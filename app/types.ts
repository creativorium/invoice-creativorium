export type Subtask = {
  id: string;
  title: string;
  subtitle: string;
  description?: string; // Kept for backwards compatibility with old localStorage data
  quantity: string; // For hours or quantity, supports string like "3h"
  rateType: 'minor' | 'major' | 'custom';
  customRate?: number;
};

export type InvoiceData = {
  clientName: string;
  clientCompany: string;
  myName: string;
  myTitle: string;
  invoiceNumber: string;
  taskProject: string;
  issueDate: string;
  minorRate: number;
  majorRate: number;
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
};

export const defaultInvoiceData: InvoiceData = {
  clientName: 'Sutra Wardani',
  clientCompany: 'Casadiolla',
  myName: 'Abetnego K. T',
  myTitle: 'Developer Creativorium',
  invoiceNumber: 'A-0090-8876-01026',
  taskProject: '',
  issueDate: new Date().toISOString().split('T')[0],
  minorRate: 150000,
  majorRate: 250000,
  subtasks: [
    { id: '1', title: 'Securing Website Domain', subtitle: 'thebaliestatecollection.com (first year price)', quantity: '1', rateType: 'custom', customRate: 250000 },
    { id: '2', title: 'Yearly Domain Subscribtion', subtitle: 'Memindahkan konten ke domain baru', quantity: '1', rateType: 'custom', customRate: 375000 },
    { id: '3', title: 'Website Migration', subtitle: 'Memindahkan konten ke domain baru', quantity: '1', rateType: 'minor', customRate: 150000 }
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
  themeColor: '#ffa700'
};
