export type GlobalRate = {
  id: string;
  name: string;
  rate: number;
};

export type Subtask = {
  id: string;
  title: string;
  subtitle: string;
  description?: string; // Kept for backwards compatibility with old localStorage data
  quantity: string; // For hours or quantity, supports string like "3h"
  quantityType?: 'qty' | 'hrs' | 'rate';
  rateType: string;
  customRate?: number;
  discount?: number;
  discountType?: 'amount' | 'percentage';
};

export type InvoiceData = {
  clientName: string;
  clientCompany: string;
  myName: string;
  myTitle: string;
  invoiceNumber: string;
  taskProject: string;
  issueDate: string;
  minorRate?: number; // Kept for backwards compatibility
  majorRate?: number; // Kept for backwards compatibility
  globalRates: GlobalRate[];
  subtasks: Subtask[];
  bank1Name: string;
  bank1Account: string;
  bank1AccountName: string;
  bank2Name: string;
  bank2Account: string;
  bank2AccountName: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyAddress: string;
  themeColor: string;
  logo?: string;
  hasTax?: boolean;
  taxPercentage?: number;
  dueDate?: string;
  note?: string;
  currency?: string;
  globalDiscount?: number;
  globalDiscountType?: 'amount' | 'percentage';
};

export const defaultInvoiceData: InvoiceData = {
  clientName: 'Customer Name',
  clientCompany: 'Client Company',
  myName: 'Abetnego K. T',
  myTitle: 'Developer Creativorium',
  invoiceNumber: 'INV-0001',
  taskProject: 'Project Name',
  issueDate: new Date().toISOString().split('T')[0],
  globalRates: [
    { id: 'minor', name: 'Minor Update', rate: 150000 },
    { id: 'major', name: 'Major Update', rate: 250000 }
  ],
  subtasks: [
    { id: '1', title: 'Task 1', subtitle: 'Sub description task 1', quantity: '1', quantityType: 'qty', rateType: 'custom', customRate: 150000 }
  ],
  bank1Name: 'BCA Transfer',
  bank1Account: '7705334846',
  bank1AccountName: 'Abetnego Kristiawan',
  bank2Name: 'Mandiri Transfer',
  bank2Account: '1370012922742',
  bank2AccountName: 'Abetnego Kristiawan',
  companyName: 'CREATIVORIUM',
  companyPhone: '+62 877-6018-5018',
  companyEmail: 'dev@creativorium.com',
  companyWebsite: 'creativorium.com',
  companyAddress: 'Bali, Indonesia',
  themeColor: '#ffa700',
  currency: 'IDR',
  hasTax: false,
  taxPercentage: 11,
  dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};
