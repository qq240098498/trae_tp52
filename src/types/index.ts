export interface Customer {
  id: string;
  name: string;
  phone: string;
  gender: '男' | '女';
  birthday: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface EyePrescription {
  sphere: number;
  cylinder: number;
  axis: number;
  add: number;
  visualAcuity: string;
}

export interface ExamRecord {
  id: string;
  customerId: string;
  examDate: string;
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  pd: number;
  notes: string;
  optometrist: string;
  createdAt: string;
}

export interface Frame {
  id: string;
  brand: string;
  model: string;
  material: string;
  color: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  warningStock: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lens {
  id: string;
  refractiveIndex: number;
  coating: string;
  brand: string;
  type: string;
  sphereRange: string;
  cylinderRange: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  warningStock: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export interface OldGlassesRx {
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  pd: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'picked';
export type ReviewStatus = 'pending' | 'reviewed';
export type OverdueStatus = 'normal' | 'warning' | 'abnormal';

export interface Order {
  id: string;
  customerId: string;
  examRecordId: string;
  frameId: string;
  lensId: string;
  status: OrderStatus;
  totalPrice: number;
  deposit: number;
  notes: string;
  pickupDate: string;
  oldGlassesRx: OldGlassesRx | null;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  pickupReminderSent: boolean;
  pickupReminderSentAt: string | null;
}

export interface DashboardStats {
  todayExams: number;
  pendingOrders: number;
  lowStockItems: number;
  totalSales: number;
}

export interface LensSalesStats {
  refractiveIndex: number;
  coating: string;
  brand: string;
  type: string;
  lensId: string;
  lastMonthSales: number;
}

export interface LensRestockItem {
  lens: Lens;
  lastMonthSales: number;
  stockGap: number;
  suggestedPurchaseQty: number;
  estimatedCost: number;
  urgency: 'normal' | 'urgent' | 'critical';
}

export interface LensRestockSuggestion {
  generatedAt: string;
  lastMonthRange: { start: string; end: string };
  items: LensRestockItem[];
  totalEstimatedCost: number;
  summary: {
    totalItems: number;
    criticalItems: number;
    urgentItems: number;
    normalItems: number;
  };
}
