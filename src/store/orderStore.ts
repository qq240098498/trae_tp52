import { create } from 'zustand';
import type { Order, OrderStatus, OldGlassesRx, OverdueStatus } from '../types';
import {
  generateId,
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
  getOverdueStatus,
  getDaysSinceCompleted,
  getOverdueOrders,
  getWarningOrders,
  getAbnormalOrders,
  sendPickupReminderSms,
} from '../utils';
import { useFrameStore } from './frameStore';
import { useLensStore } from './lensStore';
import { useCustomerStore } from './customerStore';

interface OrderState {
  orders: Order[];
  loading: boolean;
  loadData: () => void;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'reviewStatus' | 'createdAt' | 'updatedAt' | 'completedAt' | 'pickupReminderSent' | 'pickupReminderSentAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByCustomerId: (customerId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  updateOldGlassesRx: (id: string, oldGlassesRx: OldGlassesRx) => void;
  markAsReviewed: (id: string) => void;
  searchOrders: (keyword: string) => Order[];
  getOverdueStatus: (orderId: string) => OverdueStatus;
  getDaysSinceCompleted: (orderId: string) => number;
  getOverdueOrders: () => Order[];
  getWarningOrders: () => Order[];
  getAbnormalOrders: () => Order[];
  sendPickupReminder: (orderId: string) => boolean;
  sendBatchPickupReminders: () => { success: number; failed: number };
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
      completedAt: null,
      pickupReminderSent: false,
      pickupReminderSentAt: null,
    };
    const orders = [...get().orders, newOrder];
    set({ orders });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);

    useFrameStore.getState().updateStock(order.frameId, -1);
    useLensStore.getState().updateStock(order.lensId, -1);
  },

  updateOrderStatus: (id, status) => {
    const now = new Date().toISOString();
    const orders = get().orders.map((o) => {
      if (o.id !== id) return o;
      const updated: Order = { ...o, status, updatedAt: now };
      if (status === 'completed' && !o.completedAt) {
        updated.completedAt = now;
      }
      if (status === 'picked') {
        updated.pickupReminderSent = false;
        updated.pickupReminderSentAt = null;
      }
      return updated;
    });
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

  getOverdueStatus: (orderId) => {
    const order = get().getOrderById(orderId);
    if (!order) return 'normal';
    return getOverdueStatus(order);
  },

  getDaysSinceCompleted: (orderId) => {
    const order = get().getOrderById(orderId);
    if (!order) return 0;
    return getDaysSinceCompleted(order);
  },

  getOverdueOrders: () => {
    return getOverdueOrders(get().orders);
  },

  getWarningOrders: () => {
    return getWarningOrders(get().orders);
  },

  getAbnormalOrders: () => {
    return getAbnormalOrders(get().orders);
  },

  sendPickupReminder: (orderId) => {
    const order = get().getOrderById(orderId);
    if (!order || order.status !== 'completed') return false;

    const customer = useCustomerStore.getState().getCustomerById(order.customerId);
    if (!customer) return false;

    const success = sendPickupReminderSms(customer, order);
    if (success) {
      const now = new Date().toISOString();
      const orders = get().orders.map((o) =>
        o.id === orderId
          ? { ...o, pickupReminderSent: true, pickupReminderSentAt: now, updatedAt: now }
          : o
      );
      set({ orders });
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
    }
    return success;
  },

  sendBatchPickupReminders: () => {
    const warningOrders = get().getWarningOrders();
    const unsentOrders = warningOrders.filter((o) => !o.pickupReminderSent);
    let success = 0;
    let failed = 0;

    unsentOrders.forEach((order) => {
      const customer = useCustomerStore.getState().getCustomerById(order.customerId);
      if (customer && sendPickupReminderSms(customer, order)) {
        success++;
      } else {
        failed++;
      }
    });

    if (success > 0) {
      const now = new Date().toISOString();
      const unsentIds = unsentOrders.map((o) => o.id);
      const orders = get().orders.map((o) =>
        unsentIds.includes(o.id)
          ? { ...o, pickupReminderSent: true, pickupReminderSentAt: now, updatedAt: now }
          : o
      );
      set({ orders });
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
    }

    return { success, failed };
  },
}));
