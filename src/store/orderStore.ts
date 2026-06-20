import { create } from 'zustand';
import type { Order, OrderStatus, OldGlassesRx } from '../types';
import { generateId, getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils';
import { useFrameStore } from './frameStore';
import { useLensStore } from './lensStore';

interface OrderState {
  orders: Order[];
  loading: boolean;
  loadData: () => void;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'reviewStatus' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByCustomerId: (customerId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  updateOldGlassesRx: (id: string, oldGlassesRx: OldGlassesRx) => void;
  markAsReviewed: (id: string) => void;
  searchOrders: (keyword: string) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,

  loadData: () => {
    const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    set({ orders });
  },

  addOrder: (order) => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...order,
      id: generateId(),
      status: 'pending',
      reviewStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    const orders = [...get().orders, newOrder];
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);

    useFrameStore.getState().updateStock(order.frameId, -1);
    useLensStore.getState().updateStock(order.lensId, -1);
  },

  updateOrderStatus: (id, status) => {
    const now = new Date().toISOString();
    const orders = get().orders.map((o) =>
      o.id === id ? { ...o, status, updatedAt: now } : o
    );
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  updateOrder: (id, order) => {
    const now = new Date().toISOString();
    const orders = get().orders.map((o) =>
      o.id === id ? { ...o, ...order, updatedAt: now } : o
    );
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  deleteOrder: (id) => {
    const order = get().getOrderById(id);
    if (order && order.status === 'pending') {
      useFrameStore.getState().updateStock(order.frameId, 1);
      useLensStore.getState().updateStock(order.lensId, 1);
    }
    const orders = get().orders.filter((o) => o.id !== id);
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id);
  },

  getOrdersByCustomerId: (customerId) => {
    return get()
      .orders.filter((o) => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrdersByStatus: (status) => {
    return get()
      .orders.filter((o) => o.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateOldGlassesRx: (id, oldGlassesRx) => {
    const now = new Date().toISOString();
    const orders = get().orders.map((o) =>
      o.id === id ? { ...o, oldGlassesRx, updatedAt: now } : o
    );
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  markAsReviewed: (id) => {
    const now = new Date().toISOString();
    const orders = get().orders.map((o) =>
      o.id === id ? { ...o, reviewStatus: 'reviewed' as const, status: 'picked' as const, updatedAt: now } : o
    );
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  searchOrders: (keyword) => {
    if (!keyword.trim()) return get().orders;
    const lowerKeyword = keyword.toLowerCase();
    return get().orders.filter((o) => o.id.toLowerCase().includes(lowerKeyword));
  },
}));
