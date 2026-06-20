import type {
  Customer,
  ExamRecord,
  Frame,
  Lens,
  Order,
  EyePrescription,
  LensSalesStats,
  LensRestockSuggestion,
  LensRestockItem,
  OverdueStatus,
} from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'optic_customers',
  EXAM_RECORDS: 'optic_exam_records',
  FRAMES: 'optic_frames',
  LENSES: 'optic_lenses',
  ORDERS: 'optic_orders',
  INITIALIZED: 'optic_initialized',
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    name: '张三',
    phone: '13800138001',
    gender: '男',
    birthday: '1990-05-15',
    address: '北京市朝阳区建国路88号',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'cust_002',
    name: '李四',
    phone: '13900139002',
    gender: '女',
    birthday: '1985-08-20',
    address: '北京市海淀区中关村大街1号',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'cust_003',
    name: '王五',
    phone: '13700137003',
    gender: '男',
    birthday: '1995-12-03',
    address: '北京市西城区金融街15号',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
  },
];

export const mockExamRecords: ExamRecord[] = [
  {
    id: 'exam_001',
    customerId: 'cust_001',
    examDate: '2024-01-15',
    rightEye: { sphere: -2.5, cylinder: -0.5, axis: 180, add: 0, visualAcuity: '1.0' },
    leftEye: { sphere: -2.0, cylinder: -0.25, axis: 170, add: 0, visualAcuity: '1.0' },
    pd: 64,
    notes: '双眼近视，初次配镜，无不适感',
    optometrist: '李医生',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'exam_004',
    customerId: 'cust_001',
    examDate: '2024-06-20',
    rightEye: { sphere: -3.25, cylinder: -0.75, axis: 175, add: 0, visualAcuity: '1.0' },
    leftEye: { sphere: -2.75, cylinder: -0.5, axis: 165, add: 0, visualAcuity: '1.0' },
    pd: 64,
    notes: '近视加深，建议更换镜片',
    optometrist: '王医生',
    createdAt: '2024-06-20T14:00:00Z',
  },
  {
    id: 'exam_002',
    customerId: 'cust_002',
    examDate: '2024-02-10',
    rightEye: { sphere: -3.0, cylinder: -0.75, axis: 165, add: 0, visualAcuity: '1.0' },
    leftEye: { sphere: -2.75, cylinder: -0.5, axis: 175, add: 0, visualAcuity: '1.0' },
    pd: 62,
    notes: '近视加深50度，建议更换镜片',
    optometrist: '王医生',
    createdAt: '2024-02-10T15:00:00Z',
  },
  {
    id: 'exam_003',
    customerId: 'cust_003',
    examDate: '2024-03-05',
    rightEye: { sphere: +1.5, cylinder: 0, axis: 0, add: 0, visualAcuity: '1.0' },
    leftEye: { sphere: +1.25, cylinder: 0, axis: 0, add: 0, visualAcuity: '1.0' },
    pd: 65,
    notes: '远视，看近模糊，建议配远视镜',
    optometrist: '李医生',
    createdAt: '2024-03-05T09:45:00Z',
  },
];

export const mockFrames: Frame[] = [
  {
    id: 'frame_001',
    brand: '雷朋',
    model: 'RB5154',
    material: '板材',
    color: '黑色',
    costPrice: 280,
    salePrice: 580,
    stock: 12,
    warningStock: 3,
    supplier: '雷朋中国总代理',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'frame_002',
    brand: '暴龙',
    model: 'BJ3012',
    material: '金属',
    color: '金色',
    costPrice: 320,
    salePrice: 680,
    stock: 8,
    warningStock: 3,
    supplier: '暴龙官方授权',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'frame_003',
    brand: '精工',
    model: 'HC-1021',
    material: '钛合金',
    color: '银色',
    costPrice: 450,
    salePrice: 980,
    stock: 5,
    warningStock: 2,
    supplier: '精工眼镜中国',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'frame_004',
    brand: '雷朋',
    model: 'RB7047',
    material: 'TR90',
    color: '深蓝色',
    costPrice: 200,
    salePrice: 420,
    stock: 2,
    warningStock: 3,
    supplier: '雷朋中国总代理',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockLenses: Lens[] = [
  {
    id: 'lens_001',
    refractiveIndex: 1.56,
    coating: '防蓝光',
    brand: '依视路',
    type: '单光',
    sphereRange: '-10.00 ~ +6.00',
    cylinderRange: '-2.00 ~ 0',
    costPrice: 180,
    salePrice: 380,
    stock: 25,
    warningStock: 5,
    supplier: '依视路中国',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lens_002',
    refractiveIndex: 1.61,
    coating: '钻晶A4',
    brand: '依视路',
    type: '单光',
    sphereRange: '-12.00 ~ +8.00',
    cylinderRange: '-4.00 ~ +2.00',
    costPrice: 320,
    salePrice: 680,
    stock: 18,
    warningStock: 5,
    supplier: '依视路中国',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lens_003',
    refractiveIndex: 1.67,
    coating: '防蓝光',
    brand: '蔡司',
    type: '单光',
    sphereRange: '-15.00 ~ +10.00',
    cylinderRange: '-6.00 ~ +4.00',
    costPrice: 580,
    salePrice: 1280,
    stock: 10,
    warningStock: 3,
    supplier: '蔡司光学',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lens_004',
    refractiveIndex: 1.56,
    coating: '渐进多焦点',
    brand: '依视路',
    type: '渐进',
    sphereRange: '-8.00 ~ +4.00',
    cylinderRange: '-2.00 ~ 0',
    costPrice: 680,
    salePrice: 1580,
    stock: 6,
    warningStock: 2,
    supplier: '依视路中国',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lens_005',
    refractiveIndex: 1.50,
    coating: '普通',
    brand: '国产',
    type: '单光',
    sphereRange: '-6.00 ~ +4.00',
    cylinderRange: '-2.00 ~ 0',
    costPrice: 60,
    salePrice: 150,
    stock: 2,
    warningStock: 5,
    supplier: '国内镜片厂',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'order_001',
    customerId: 'cust_001',
    examRecordId: 'exam_001',
    frameId: 'frame_001',
    lensId: 'lens_001',
    status: 'picked',
    totalPrice: 960,
    deposit: 300,
    notes: '加急处理，3天内取镜',
    pickupDate: '2024-01-18',
    oldGlassesRx: {
      rightEye: { sphere: -2.0, cylinder: 0, axis: 0, add: 0, visualAcuity: '0.8' },
      leftEye: { sphere: -1.75, cylinder: 0, axis: 0, add: 0, visualAcuity: '0.8' },
      pd: 64,
    },
    reviewStatus: 'reviewed',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-18T15:30:00Z',
    completedAt: '2024-01-17T10:00:00Z',
    pickupReminderSent: false,
    pickupReminderSentAt: null,
  },
  {
    id: 'order_002',
    customerId: 'cust_002',
    examRecordId: 'exam_002',
    frameId: 'frame_002',
    lensId: 'lens_002',
    status: 'completed',
    totalPrice: 1360,
    deposit: 500,
    notes: '',
    pickupDate: '2024-02-15',
    oldGlassesRx: null,
    reviewStatus: 'pending',
    createdAt: '2024-02-10T16:00:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
    completedAt: '2024-02-14T10:00:00Z',
    pickupReminderSent: false,
    pickupReminderSentAt: null,
  },
  {
    id: 'order_003',
    customerId: 'cust_003',
    examRecordId: 'exam_003',
    frameId: 'frame_003',
    lensId: 'lens_001',
    status: 'processing',
    totalPrice: 1360,
    deposit: 400,
    notes: '远视镜，请仔细核对度数',
    pickupDate: '2024-03-10',
    oldGlassesRx: null,
    reviewStatus: 'pending',
    createdAt: '2024-03-05T10:30:00Z',
    updatedAt: '2024-03-06T09:00:00Z',
    completedAt: null,
    pickupReminderSent: false,
    pickupReminderSentAt: null,
  },
  {
    id: 'order_004',
    customerId: 'cust_001',
    examRecordId: 'exam_001',
    frameId: 'frame_004',
    lensId: 'lens_003',
    status: 'pending',
    totalPrice: 1700,
    deposit: 600,
    notes: '第二副眼镜，用于工作',
    pickupDate: '2024-03-15',
    oldGlassesRx: null,
    reviewStatus: 'pending',
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z',
    completedAt: null,
    pickupReminderSent: false,
    pickupReminderSentAt: null,
  },
];

export const initializeMockData = (): void => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    setStorageItem(STORAGE_KEYS.EXAM_RECORDS, mockExamRecords);
    setStorageItem(STORAGE_KEYS.FRAMES, mockFrames);
    setStorageItem(STORAGE_KEYS.LENSES, mockLenses);
    setStorageItem(STORAGE_KEYS.ORDERS, mockOrders);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
};

export const getDashboardStats = (): {
  todayExams: number;
  pendingOrders: number;
  lowStockItems: number;
  totalSales: number;
} => {
  const exams = getStorageItem<ExamRecord[]>(STORAGE_KEYS.EXAM_RECORDS, []);
  const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  const frames = getStorageItem<Frame[]>(STORAGE_KEYS.FRAMES, []);
  const lenses = getStorageItem<Lens[]>(STORAGE_KEYS.LENSES, []);

  const todayExams = exams.filter((e) => isToday(e.createdAt)).length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;
  const lowStockFrames = frames.filter((f) => f.stock <= f.warningStock).length;
  const lowStockLenses = lenses.filter((l) => l.stock <= l.warningStock).length;
  const totalSales = orders
    .filter((o) => o.status === 'picked')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return {
    todayExams,
    pendingOrders,
    lowStockItems: lowStockFrames + lowStockLenses,
    totalSales,
  };
};

export interface PrescriptionDiff {
  rightSphereDiff: number;
  rightCylinderDiff: number;
  leftSphereDiff: number;
  leftCylinderDiff: number;
  hasSignificantChange: boolean;
  significantItems: string[];
}

export const PRESCRIPTION_CHANGE_THRESHOLD = 0.25;

export const calculatePrescriptionDiff = (
  oldRx: { rightEye: EyePrescription; leftEye: EyePrescription },
  newRx: { rightEye: EyePrescription; leftEye: EyePrescription }
): PrescriptionDiff => {
  const rightSphereDiff = newRx.rightEye.sphere - oldRx.rightEye.sphere;
  const rightCylinderDiff = newRx.rightEye.cylinder - oldRx.rightEye.cylinder;
  const leftSphereDiff = newRx.leftEye.sphere - oldRx.leftEye.sphere;
  const leftCylinderDiff = newRx.leftEye.cylinder - oldRx.leftEye.cylinder;

  const significantItems: string[] = [];

  if (Math.abs(rightSphereDiff) >= PRESCRIPTION_CHANGE_THRESHOLD) {
    significantItems.push('右眼球镜');
  }
  if (Math.abs(rightCylinderDiff) >= PRESCRIPTION_CHANGE_THRESHOLD) {
    significantItems.push('右眼柱镜');
  }
  if (Math.abs(leftSphereDiff) >= PRESCRIPTION_CHANGE_THRESHOLD) {
    significantItems.push('左眼球镜');
  }
  if (Math.abs(leftCylinderDiff) >= PRESCRIPTION_CHANGE_THRESHOLD) {
    significantItems.push('左眼柱镜');
  }

  return {
    rightSphereDiff,
    rightCylinderDiff,
    leftSphereDiff,
    leftCylinderDiff,
    hasSignificantChange: significantItems.length > 0,
    significantItems,
  };
};

export const getChangeTrendText = (diff: number, itemName: string): string => {
  if (diff === 0) return `${itemName}无变化`;
  const direction = diff > 0 ? '增加' : '减少';
  const absValue = Math.abs(diff).toFixed(2);
  return `${itemName}${direction} ${absValue}D`;
};

export const getPreviousExamRecord = (
  allRecords: ExamRecord[],
  currentRecordId: string
): ExamRecord | undefined => {
  const sortedRecords = [...allRecords].sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );
  const currentIndex = sortedRecords.findIndex((r) => r.id === currentRecordId);
  if (currentIndex < 0 || currentIndex >= sortedRecords.length - 1) return undefined;
  return sortedRecords[currentIndex + 1];
};

export const getLastMonthRange = (now: Date = new Date()): { start: string; end: string } => {
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const start = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0, 0);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export const calculateLensSalesStats = (
  orders: Order[],
  lenses: Lens[],
  now: Date = new Date()
): LensSalesStats[] => {
  const { start, end } = getLastMonthRange(now);
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();

  const salesMap = new Map<string, LensSalesStats>();

  lenses.forEach((lens) => {
    const key = `${lens.refractiveIndex}_${lens.coating}_${lens.id}`;
    salesMap.set(key, {
      refractiveIndex: lens.refractiveIndex,
      coating: lens.coating,
      brand: lens.brand,
      type: lens.type,
      lensId: lens.id,
      lastMonthSales: 0,
    });
  });

  orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt).getTime();
      return orderDate >= startMs && orderDate <= endMs;
    })
    .forEach((order) => {
      const lens = lenses.find((l) => l.id === order.lensId);
      if (lens) {
        const key = `${lens.refractiveIndex}_${lens.coating}_${lens.id}`;
        const stats = salesMap.get(key);
        if (stats) {
          stats.lastMonthSales += 1;
        }
      }
    });

  return Array.from(salesMap.values());
};

const getUrgencyLevel = (stock: number, warningStock: number, lastMonthSales: number): LensRestockItem['urgency'] => {
  if (stock <= 0) return 'critical';
  if (lastMonthSales > 0) {
    const daysOfStock = lastMonthSales / 30 > 0 ? stock / (lastMonthSales / 30) : 999;
    if (daysOfStock <= 7) return 'critical';
    if (daysOfStock <= 15) return 'urgent';
  }
  if (stock <= warningStock * 0.5) return 'critical';
  if (stock <= warningStock) return 'urgent';
  return 'normal';
};

export const generateLensRestockSuggestion = (
  orders: Order[],
  lenses: Lens[],
  safetyBuffer: number = 1.5,
  now: Date = new Date()
): LensRestockSuggestion => {
  const salesStats = calculateLensSalesStats(orders, lenses, now);
  const lastMonthRange = getLastMonthRange(now);
  const items: LensRestockItem[] = [];

  salesStats.forEach((stats) => {
    const lens = lenses.find((l) => l.id === stats.lensId);
    if (!lens) return;

    const needsRestock = lens.stock <= lens.warningStock || stats.lastMonthSales > lens.stock;

    if (!needsRestock) return;

    const projectedDemand = Math.ceil(stats.lastMonthSales * safetyBuffer);
    const targetStock = Math.max(projectedDemand, lens.warningStock * 2);
    const stockGap = Math.max(0, targetStock - lens.stock);
    const suggestedPurchaseQty = stockGap > 0 ? stockGap : Math.ceil(lens.warningStock * 0.5);
    const urgency = getUrgencyLevel(lens.stock, lens.warningStock, stats.lastMonthSales);
    const estimatedCost = suggestedPurchaseQty * lens.costPrice;

    items.push({
      lens,
      lastMonthSales: stats.lastMonthSales,
      stockGap,
      suggestedPurchaseQty,
      estimatedCost,
      urgency,
    });
  });

  items.sort((a, b) => {
    const urgencyOrder = { critical: 0, urgent: 1, normal: 2 };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return b.lastMonthSales - a.lastMonthSales;
  });

  const totalEstimatedCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const criticalItems = items.filter((i) => i.urgency === 'critical').length;
  const urgentItems = items.filter((i) => i.urgency === 'urgent').length;
  const normalItems = items.filter((i) => i.urgency === 'normal').length;

  return {
    generatedAt: new Date().toISOString(),
    lastMonthRange,
    items,
    totalEstimatedCost,
    summary: {
      totalItems: items.length,
      criticalItems,
      urgentItems,
      normalItems,
    },
  };
};

export { STORAGE_KEYS };

export const PICKUP_REMINDER_DAYS = 7;
export const PICKUP_ABNORMAL_DAYS = 30;

export const getDaysSinceCompleted = (order: Order, now: Date = new Date()): number => {
  if (!order.completedAt || order.status !== 'completed') return 0;
  const completedDate = new Date(order.completedAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const completed = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
  const diffTime = today.getTime() - completed.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getOverdueStatus = (order: Order, now: Date = new Date()): OverdueStatus => {
  if (order.status !== 'completed' || !order.completedAt) return 'normal';
  const days = getDaysSinceCompleted(order, now);
  if (days >= PICKUP_ABNORMAL_DAYS) return 'abnormal';
  if (days >= PICKUP_REMINDER_DAYS) return 'warning';
  return 'normal';
};

export const getOverdueOrders = (orders: Order[], now: Date = new Date()): Order[] => {
  return orders.filter((o) => {
    const status = getOverdueStatus(o, now);
    return status === 'warning' || status === 'abnormal';
  });
};

export const getWarningOrders = (orders: Order[], now: Date = new Date()): Order[] => {
  return orders.filter((o) => getOverdueStatus(o, now) === 'warning');
};

export const getAbnormalOrders = (orders: Order[], now: Date = new Date()): Order[] => {
  return orders.filter((o) => getOverdueStatus(o, now) === 'abnormal');
};

export const sendPickupReminderSms = (customer: Customer, order: Order): boolean => {
  console.log(`[短信提醒] 发送给 ${customer.name} (${customer.phone}): 您的眼镜已加工完成${getDaysSinceCompleted(order)}天，请到店取镜。订单号: ${order.id}`);
  return true;
};
