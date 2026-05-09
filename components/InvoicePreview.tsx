import React from 'react';
import styles from './InvoicePreview.module.css';
import { InvoiceData } from '../app/types';

const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const EmailIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const GlobeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
const LocationIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;

interface InvoicePreviewProps {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const getRate = (rateType: string, customRate?: number) => {
    if (rateType === 'custom') return customRate || 0;
    if (rateType === 'minor' && data.minorRate !== undefined) return data.minorRate;
    if (rateType === 'major' && data.majorRate !== undefined) return data.majorRate;
    
    const globalRate = (data.globalRates || []).find(r => r.id === rateType);
    if (globalRate) return globalRate.rate;
    
    return customRate || 0;
  };

  const formatCurrency = (amount: number) => {
    const currency = data.currency || 'IDR';
    if (currency === 'IDR') {
      const roundedUp = Math.ceil(amount / 1000) * 1000;
      return `IDR ${roundedUp.toLocaleString('id-ID')}`;
    } else {
      const roundedUp = Math.ceil(amount * 100) / 100;
      return `${currency} ${roundedUp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, ' - ');
  };

  const parseQuantity = (qtyStr: string | number): number => {
    const str = String(qtyStr || '').toLowerCase().trim();
    
    // If no letters at all, just return the number
    if (!/[a-z]/i.test(str)) {
      return parseFloat(str) || 0;
    }

    let totalHours = 0;
    let matched = false;
    
    // Extract hours (e.g., 3h, 3 hrs, 3 hours)
    const hMatch = str.match(/([\d.]+)\s*h(r|rs|ou?rs?)?\b/);
    if (hMatch) {
      totalHours += parseFloat(hMatch[1]) || 0;
      matched = true;
    }
    
    // Extract minutes (e.g., 28m, 28 min, 28 mins)
    const mMatch = str.match(/([\d.]+)\s*m(in|ins|inutes?)?\b/);
    if (mMatch) {
      totalHours += (parseFloat(mMatch[1]) || 0) / 60;
      matched = true;
    }

    // Fallback if no specific time units matched (e.g., "1 package")
    if (!matched) {
      return parseFloat(str) || 0;
    }

    return totalHours;
  };

  const calculateSubTotal = () => {
    return data.subtasks.reduce((sum, item) => {
      const parsedQty = parseQuantity(item.quantity);
      return sum + (parsedQty * getRate(item.rateType, item.customRate));
    }, 0);
  };

  const subTotal = calculateSubTotal();
  const taxAmount = data.hasTax ? subTotal * (data.taxPercentage || 0) / 100 : 0;
  const grandTotal = subTotal + taxAmount;
  
  const totalQuantity = data.subtasks.reduce((sum, item) => sum + (item.quantityType === 'rate' ? 1 : parseQuantity(item.quantity)), 0);
  
  const hasQty = data.subtasks.some(item => item.quantityType === 'qty');
  const hasHrs = data.subtasks.some(item => item.quantityType === 'hrs');
  
  let qtyHeader = 'QTY / HRS';
  if (hasQty && !hasHrs) qtyHeader = 'QTY';
  if (hasHrs && !hasQty) qtyHeader = 'HRS';

  let totalQtyLabel = 'Total Qty / Hrs';
  if (hasQty && !hasHrs) totalQtyLabel = 'Total Items';
  if (hasHrs && !hasQty) totalQtyLabel = 'Total Hours';
  
  const isTimeBased = data.subtasks.some(item => {
    if (item.quantityType === 'hrs') return true;
    if (item.quantityType === 'qty' || item.quantityType === 'rate') return false;
    // Fallback logic
    const str = String(item.quantity).toLowerCase();
    return /h(r|rs|ou?rs?)?\b/.test(str) || /m(in|ins|inutes?)?\b/.test(str);
  });

  let formattedTotalQty = '';
  if (isTimeBased) {
    let h = Math.floor(totalQuantity);
    let m = Math.round((totalQuantity - h) * 60);
    if (m === 60) {
      h += 1;
      m = 0;
    }
    
    if (h > 0 && m > 0) {
      formattedTotalQty = `${h}h ${m}m`;
    } else if (h > 0) {
      formattedTotalQty = `${h}h`;
    } else if (m > 0) {
      formattedTotalQty = `${m}m`;
    } else {
      formattedTotalQty = `0h`;
    }
  } else {
    formattedTotalQty = Number(totalQuantity.toFixed(2)).toString();
  }

  const paymentDueDate = data.dueDate 
    ? new Date(data.dueDate + 'T00:00:00').toISOString() 
    : new Date(new Date(data.issueDate).getTime() + 24 * 60 * 60 * 1000).toISOString();

  return (
    <div 
      className={styles.previewContainer} 
      id="invoice-preview"
      style={{ '--theme-color': data.themeColor || '#ffa700' } as React.CSSProperties}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.invoiceTo}>Invoice to</div>
          <div className={styles.clientName}>{data.clientName}</div>
          {data.clientCompany && <div className={styles.projectName}>{data.clientCompany}</div>}
        </div>
        <div className={styles.headerRight}>
          {data.logo && (
            <img src={data.logo} alt="Logo" style={{ maxHeight: '70px', marginBottom: '10px' }} />
          )}
          <div className={styles.title}>INVOICE</div>
          <div className={styles.metaInfo}>
            <div className={styles.metaColumn}>
              <div className={styles.metaLabel}>Issue Date</div>
              <div className={styles.metaValue}>{formatDate(data.issueDate)}</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.metaColumn}>
              <div className={styles.metaLabel}>Invoice No.</div>
              <div className={styles.metaValue}>{data.invoiceNumber}</div>
            </div>
          </div>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ITEM DESCRIPTION</th>
            <th>PRICE RATE</th>
            <th className={styles.quantity}>{qtyHeader}</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {data.subtasks.map((item, idx) => {
            const rate = getRate(item.rateType, item.customRate);
            const parsedQty = parseQuantity(item.quantity);
            const total = rate * parsedQty;
            
            // Fallback for old data structure
            const title = item.title || (item.description ? item.description.split('\n')[0] : '');
            const subtitle = item.subtitle || (item.description ? item.description.split('\n').slice(1).join('\n') : '');

            return (
              <tr key={item.id} className={idx % 2 === 0 ? '' : styles.grayBg}>
                <td>
                  <div className={styles.itemTitle}>{title}</div>
                  {subtitle && <div className={styles.itemDesc}>{subtitle}</div>}
                </td>
                <td>{formatCurrency(rate)}</td>
                <td className={styles.quantity}>{item.quantityType === 'rate' ? '-' : item.quantity}</td>
                <td>{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.totalsBox}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{totalQtyLabel}</span>
            <span className={styles.totalColon}>:</span>
            <span className={styles.totalValue}>{formattedTotalQty}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Sub Total</span>
            <span className={styles.totalColon}>:</span>
            <span className={styles.totalValue}>{formatCurrency(subTotal)}</span>
          </div>
          {data.hasTax && (
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Tax ({data.taxPercentage}%)</span>
              <span className={styles.totalColon}>:</span>
              <span className={styles.totalValue}>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span className={styles.totalLabel}>Grand Total</span>
            <span className={styles.totalColon}>:</span>
            <span className={styles.totalValue}>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
        <div className={styles.dueDateText}>
          Payment Due : <strong>{formatDate(paymentDueDate)}</strong>
        </div>
      </div>

      <div className={styles.footerWrap}>
        {data.note && (
          <div style={{ backgroundColor: '#fff9c4', padding: '15px', borderRadius: '8px', marginBottom: '30px', whiteSpace: 'pre-wrap', color: '#555', fontSize: '13px', lineHeight: '1.5' }}>
            <strong style={{ color: '#333' }}>Note:</strong><br />
            {data.note}
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.paymentMethods}>
          <div className={styles.paymentTitle}>Payment Methods :</div>
          {data.bank1Name && (
            <div className={styles.bankRow}>
              <span className={styles.bankName}>{data.bank1Name} :</span> {data.bank1Account} - A/N {data.bank1AccountName}
            </div>
          )}
          {data.bank2Name && (
            <div className={styles.bankRow}>
              <span className={styles.bankName}>{data.bank2Name} :</span> {data.bank2Account} - A/N {data.bank2AccountName}
            </div>
          )}
        </div>
        
        <div className={styles.signature}>
          <div className={styles.myName}>{data.myName}</div>
          <div className={styles.myTitle}>{data.myTitle}</div>
        </div>
      </div>
      </div>

      {data.companyName && (
        <div className={styles.companyFooter}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {data.logo && (
              <img src={data.logo} alt="Logo" style={{ maxHeight: '50px' }} />
            )}
            <div className={styles.companyName}>{data.companyName}</div>
          </div>
          <div className={styles.companyContactGroup}>
            <div className={styles.companyContact}>
              {data.companyPhone && <div className={styles.contactItem}><PhoneIcon /> <span>{data.companyPhone}</span></div>}
              {data.companyEmail && <div className={styles.contactItem}><EmailIcon /> <span>{data.companyEmail}</span></div>}
            </div>
            <div className={styles.companyDivider}></div>
            <div className={styles.companyContact}>
              {data.companyWebsite && <div className={styles.contactItem}><GlobeIcon /> <span>{data.companyWebsite}</span></div>}
              {data.companyAddress && <div className={styles.contactItem}><LocationIcon /> <span>{data.companyAddress}</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
