import { create } from 'zustand';
import type { Customer, ExamRecord } from '../types';
import { generateId, getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils';

interface CustomerState {
  customers: Customer[];
  examRecords: ExamRecord[];
  loading: boolean;
  loadData: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  addExamRecord: (record: Omit<ExamRecord, 'id' | 'createdAt'>) => void;
  getExamRecordsByCustomerId: (customerId: string) => ExamRecord[];
  getExamRecordById: (id: string) => ExamRecord | undefined;
  searchCustomers: (keyword: string) => Customer[];
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  examRecords: [],
  loading: false,

  loadData: () => {
    const customers = getStorageItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const examRecords = getStorageItem<ExamRecord[]>(STORAGE_KEYS.EXAM_RECORDS, []);
    set({ customers, examRecords });
  },

  addCustomer: (customer) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const customers = [...get().customers, newCustomer];
    set({ customers });
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
  },

  updateCustomer: (id, customer) => {
    const now = new Date().toISOString();
    const customers = get().customers.map((c) =>
      c.id === id ? { ...c, ...customer, updatedAt: now } : c
    );
    set({ customers });
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
  },

  deleteCustomer: (id) => {
    const customers = get().customers.filter((c) => c.id !== id);
    const examRecords = get().examRecords.filter((e) => e.customerId !== id);
    set({ customers, examRecords });
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
    setStorageItem(STORAGE_KEYS.EXAM_RECORDS, examRecords);
  },

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  addExamRecord: (record) => {
    const now = new Date().toISOString();
    const newRecord: ExamRecord = {
      ...record,
      id: generateId(),
      createdAt: now,
    };
    const examRecords = [...get().examRecords, newRecord];
    set({ examRecords });
    setStorageItem(STORAGE_KEYS.EXAM_RECORDS, examRecords);
  },

  getExamRecordsByCustomerId: (customerId) => {
    return get()
      .examRecords.filter((e) => e.customerId === customerId)
      .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
  },

  getExamRecordById: (id) => {
    return get().examRecords.find((e) => e.id === id);
  },

  searchCustomers: (keyword) => {
    if (!keyword.trim()) return get().customers;
    const lowerKeyword = keyword.toLowerCase();
    return get().customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerKeyword) ||
        c.phone.includes(keyword)
    );
  },
}));
