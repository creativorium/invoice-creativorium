export type Subtask = {
  id: string;
  description: string;
  quantity: number; // For hours or quantity
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
    { id: '1', description: 'Securing Website Domain\nthebaliestatecollection.com (first year price)', quantity: 1, rateType: 'custom', customRate: 250000 },
    { id: '2', description: 'Yearly Domain Subscribtion\nMemindahkan konten ke domain baru', quantity: 1, rateType: 'custom', customRate: 375000 },
    { id: '3', description: 'Website Migration\nMemindahkan konten ke domain baru', quantity: 1, rateType: 'minor', customRate: 150000 }
  ],
  bank1Name: 'BCA Transfer',
  bank1Account: '7705334846',
  bank1AccountName: 'Abetnego Kristiawan',
  bank2Name: 'Mandiri Transfer',
  bank2Account: '1370012922742',
  bank2AccountName: 'Abetnego Kristiawan'
};
