'use client';

import React from 'react';
import styles from './InvoiceForm.module.css';
import { InvoiceData, Subtask } from '../app/types';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onPrint?: () => void;
  onShare?: () => void;
  isSaving?: boolean;
}

export default function InvoiceForm({ data, onChange, onPrint, onShare, isSaving }: InvoiceFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ ...data, [name]: checked });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ ...data, logo: '' });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: parseFloat(value) || 0 });
  };

  const addGlobalRate = () => {
    const newRate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Service',
      rate: 0
    };
    onChange({ ...data, globalRates: [...(data.globalRates || []), newRate] });
  };

  const removeGlobalRate = (id: string) => {
    onChange({ ...data, globalRates: (data.globalRates || []).filter(r => r.id !== id) });
  };

  const updateGlobalRate = (id: string, field: 'name' | 'rate', value: any) => {
    const newRates = (data.globalRates || []).map(r => r.id === id ? { ...r, [field]: value } : r);
    onChange({ ...data, globalRates: newRates });
  };

  const handleSubtaskChange = (id: string, field: keyof Subtask, value: any) => {
    const newSubtasks = data.subtasks.map(t => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    onChange({ ...data, subtasks: newSubtasks });
  };

  const addSubtask = () => {
    const newSubtask: Subtask = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Task',
      subtitle: '',
      quantity: '1',
      quantityType: 'qty',
      rateType: 'custom',
      customRate: 0
    };
    onChange({ ...data, subtasks: [...data.subtasks, newSubtask] });
  };

  const removeSubtask = (id: string) => {
    onChange({ ...data, subtasks: data.subtasks.filter(t => t.id !== id) });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>Invoice Settings</h2>
        <p>Edit details below to generate the invoice.</p>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onShare} disabled={isSaving}>
            Share URL
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onPrint} disabled={isSaving}>
            Print / PDF
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>General Info</div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Issue Date</label>
            <input type="date" name="issueDate" value={data.issueDate} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Due Date</label>
            <input type="date" name="dueDate" value={data.dueDate || ''} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Invoice Number</label>
            <input type="text" name="invoiceNumber" value={data.invoiceNumber} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Currency</label>
            <select name="currency" value={data.currency || 'IDR'} onChange={handleChange}>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="USD">USD - US Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="SGD">SGD - Singapore Dollar</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" name="hasTax" checked={!!data.hasTax} onChange={handleCheckboxChange} style={{ width: 'auto' }} />
            <label style={{ marginBottom: 0 }}>Apply Tax</label>
          </div>
          {data.hasTax && (
            <div className={styles.inputGroup}>
              <label>Tax Percentage (%)</label>
              <input type="number" name="taxPercentage" value={data.taxPercentage || 0} onChange={handleNumberChange} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Client Details</div>
        <div className={styles.inputGroup}>
          <label>Client Name</label>
          <input type="text" name="clientName" value={data.clientName} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>Client Company / Project</label>
          <input type="text" name="clientCompany" value={data.clientCompany} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Global Rates</span>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={addGlobalRate}>+ Add Rate</button>
        </div>
        {(data.globalRates || []).map(rate => (
          <div key={rate.id} className={styles.subtaskRow} style={{ marginBottom: '10px' }}>
            <div className={styles.inputGroup} style={{ flex: '1 1 200px' }}>
              <label>Service Name</label>
              <input type="text" value={rate.name} onChange={(e) => updateGlobalRate(rate.id, 'name', e.target.value)} />
            </div>
            <div className={styles.inputGroup} style={{ flex: '1 1 150px' }}>
              <label>Default Rate ({data.currency || 'IDR'})</label>
              <input type="number" value={rate.rate} onChange={(e) => updateGlobalRate(rate.id, 'rate', parseFloat(e.target.value) || 0)} />
            </div>
            <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`} onClick={() => removeGlobalRate(rate.id)} style={{ alignSelf: 'flex-end', marginBottom: '16px' }}>X</button>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Tasks & Items</span>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={addSubtask}>+ Add Task</button>
        </div>
        {data.subtasks.map((task, index) => (
          <div key={task.id} className={styles.subtaskRow}>
            <div className={styles.inputGroup} style={{ flex: '1 1 150px', minWidth: '150px' }}>
              <label>Title</label>
              <input 
                type="text"
                value={task.title || ''} 
                onChange={(e) => handleSubtaskChange(task.id, 'title', e.target.value)} 
                placeholder="Main task name"
              />
              <label style={{ marginTop: '5px' }}>Subtitle</label>
              <input 
                type="text"
                value={task.subtitle || ''} 
                onChange={(e) => handleSubtaskChange(task.id, 'subtitle', e.target.value)} 
                placeholder="Additional details"
              />
            </div>
            <div className={styles.inputGroup} style={{ flex: '1 1 80px', minWidth: '80px' }}>
              <label>Type</label>
              <select 
                value={task.quantityType || 'qty'} 
                onChange={(e) => {
                  const val = e.target.value as any;
                  handleSubtaskChange(task.id, 'quantityType', val);
                  if (val === 'rate') handleSubtaskChange(task.id, 'quantity', '1');
                }}
              >
                <option value="qty">QTY</option>
                <option value="hrs">HRS</option>
                <option value="rate">RATE</option>
              </select>
            </div>
            <div className={styles.inputGroup} style={{ flex: '1 1 80px', minWidth: '80px' }}>
              <label>Qty / Hrs</label>
              <input 
                type="text" 
                value={task.quantity} 
                onChange={(e) => handleSubtaskChange(task.id, 'quantity', e.target.value)} 
                placeholder={task.quantityType === 'hrs' ? 'e.g. 2h 30m' : 'e.g. 1'}
                disabled={task.quantityType === 'rate'}
                style={{ opacity: task.quantityType === 'rate' ? 0.5 : 1 }}
              />
            </div>
            <div className={styles.inputGroup} style={{ flex: '1 1 120px', minWidth: '120px' }}>
              <label>Rate Type</label>
              <select 
                value={task.rateType} 
                onChange={(e) => handleSubtaskChange(task.id, 'rateType', e.target.value)}
              >
                <option value="custom">Custom</option>
                {(data.globalRates || []).map(rate => (
                  <option key={rate.id} value={rate.id}>{rate.name}</option>
                ))}
              </select>
            </div>
            {task.rateType === 'custom' && (
              <div className={styles.inputGroup} style={{ flex: '1 1 100px', minWidth: '100px' }}>
                <label>Amount ({data.currency || 'IDR'})</label>
                <input 
                  type="number" 
                  value={task.customRate} 
                  onChange={(e) => handleSubtaskChange(task.id, 'customRate', parseFloat(e.target.value) || 0)} 
                />
              </div>
            )}
            <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`} onClick={() => removeSubtask(task.id)} style={{ alignSelf: 'flex-end', marginBottom: '16px' }}>X</button>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>My Info</div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>My Name</label>
            <input type="text" name="myName" value={data.myName} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>My Title</label>
            <input type="text" name="myTitle" value={data.myTitle} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Payment Methods</div>
        <div className={styles.inputGroup}>
          <label>Bank 1 Name (e.g. BCA Transfer)</label>
          <input type="text" name="bank1Name" value={data.bank1Name} onChange={handleChange} />
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Account Number</label>
            <input type="text" name="bank1Account" value={data.bank1Account} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Account Name</label>
            <input type="text" name="bank1AccountName" value={data.bank1AccountName} onChange={handleChange} />
          </div>
        </div>
        <hr style={{ margin: '15px 0', borderTop: '1px dashed #ccc' }} />
        <div className={styles.inputGroup}>
          <label>Bank 2 Name (e.g. Mandiri Transfer)</label>
          <input type="text" name="bank2Name" value={data.bank2Name} onChange={handleChange} />
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Account Number</label>
            <input type="text" name="bank2Account" value={data.bank2Account} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Account Name</label>
            <input type="text" name="bank2AccountName" value={data.bank2AccountName} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.sectionTitle}>Company Footer Details</div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Company Name</label>
            <input type="text" name="companyName" value={data.companyName || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Company Phone</label>
            <input type="text" name="companyPhone" value={data.companyPhone || ''} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Company Email</label>
            <input type="text" name="companyEmail" value={data.companyEmail || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Company Website</label>
            <input type="text" name="companyWebsite" value={data.companyWebsite || ''} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Company Address</label>
            <input type="text" name="companyAddress" value={data.companyAddress || ''} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.sectionTitle}>Additional Settings</div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Custom Note (above payment methods)</label>
            <textarea 
              name="note" 
              value={data.note || ''} 
              onChange={handleChange} 
              placeholder="e.g. Thank you for your business!"
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Company Logo (Max 2MB)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ flex: 1 }} />
              {data.logo && (
                <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`} onClick={removeLogo} style={{ padding: '0 10px', height: '35px' }}>Remove</button>
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Theme Color</label>
            <input 
              type="color" 
              name="themeColor" 
              value={data.themeColor || '#ffa700'} 
              onChange={handleChange} 
              style={{ padding: '0 5px', height: '40px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
