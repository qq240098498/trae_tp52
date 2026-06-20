import type { Customer, ExamRecord, Frame, Lens, Order, EyePrescription } from '../types';

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

export { STORAGE_KEYS };
