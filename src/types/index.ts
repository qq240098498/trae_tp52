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
}

export interface DashboardStats {
  todayExams: number;
  pendingOrders: number;
  lowStockItems: number;
  totalSales: number;
}
