export type UserRole = 'ADMIN' | 'CUSTOMER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';
export type OrderStatus = 'DRAFT' | 'SUBMITTED';
export type ProductLanguage = 'en' | 'zh-Hant' | 'zh-Hans';

export interface User {
  id: string;
  name: string;
  companyName?: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface FiberItem {
  name: string;
  percentage: number;
}

export interface Order {
  id: string;
  customerName: string;
  poNumber: string;
  accountNumber: string;
  shapeNo: string;
  shapeName: string;
  styleNo: string;
  itemNo: string;
  expectedDeliveryDate: string;
  madeInCountry: string;
  fibers: FiberItem[];
  careSymbols: {
    washing: string[];
    bleaching: string[];
    drying: string[];
    ironing: string[];
    dryCleaning: string[];
  };
  careText: string[];
  sizes: string[];
  status: OrderStatus;
  createdAt: string;
  submittedAt?: string;
}

export interface SystemSetting {
  id: string;
  name: string;
  value: string;
  description: string;
}
