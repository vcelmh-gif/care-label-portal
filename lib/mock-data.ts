import { Order, SystemSetting, User } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Alicia Wong', email: 'alicia@fashionsource.io', role: 'CUSTOMER', status: 'ACTIVE', createdAt: '2026-01-14' },
  { id: 'u2', name: 'Sean Lee', email: 'sean@studioaccess.com', role: 'CUSTOMER', status: 'PENDING', createdAt: '2026-02-02' },
  { id: 'u3', name: 'Maya Chen', email: 'maya@carelabel.co', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-11-06' },
];

export const countries = ['China', 'Bangladesh', 'Cambodia', 'Vietnam', 'Turkey', 'Portugal', 'Italy'];
export const fibers = ['Cotton', 'Elastane', 'Metal Fibre', 'Nylon', 'Polyamide', 'Polyester', 'Viscose'];
export const careTexts = ['Wash with similar colors', 'Wash in laundry bag', 'Iron inside out', 'No rubbing'];
export const careSymbols = ['W2', 'B1', 'D1', 'I1', 'DC1'];

export const orders: Order[] = [
  {
    id: 'CL26000001',
    customerName: 'Alicia Wong',
    poNumber: 'PO-2034',
    accountNumber: 'AC-9904',
    shapeNo: 'SH-331',
    shapeName: 'Classic Tee',
    styleNo: 'ST-21',
    itemNo: 'IT-562',
    expectedDeliveryDate: '2026-10-12',
    madeInCountry: 'China',
    fibers: [
      { name: 'Cotton', percentage: 95 },
      { name: 'Elastane', percentage: 5 },
    ],
    careSymbols: {
      washing: ['W2'],
      bleaching: ['B1'],
      drying: ['D1'],
      ironing: ['I1'],
      dryCleaning: ['DC1'],
    },
    careText: ['Wash with similar colors', 'Iron inside out'],
    sizes: ['M', 'L', 'XL'],
    status: 'SUBMITTED',
    createdAt: '2026-09-02',
    submittedAt: '2026-09-03',
  },
  {
    id: 'CL26000002',
    customerName: 'Alicia Wong',
    poNumber: 'PO-2048',
    accountNumber: 'AC-9904',
    shapeNo: 'SH-405',
    shapeName: 'Performance Polo',
    styleNo: 'ST-39',
    itemNo: 'IT-772',
    expectedDeliveryDate: '2026-10-26',
    madeInCountry: 'Vietnam',
    fibers: [
      { name: 'Polyester', percentage: 70 },
      { name: 'Cotton', percentage: 30 },
    ],
    careSymbols: {
      washing: ['W2'],
      bleaching: ['B1'],
      drying: ['D1'],
      ironing: ['I1'],
      dryCleaning: ['DC1'],
    },
    careText: ['Wash in laundry bag', 'No rubbing'],
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'DRAFT',
    createdAt: '2026-09-12',
  },
];

export const systemSettings: SystemSetting[] = [
  { id: 'smtp-host', name: 'SMTP Host', value: 'smtp.office365.com', description: 'Microsoft 365 SMTP gateway' },
  { id: 'smtp-port', name: 'SMTP Port', value: '587', description: 'TLS enabled email relay port' },
  { id: 'sender-email', name: 'Sender Email', value: 'orders@carelabel.example', description: 'From address for notifications' },
  { id: 'default-language', name: 'Default Language', value: 'en', description: 'Primary UI language' },
];
