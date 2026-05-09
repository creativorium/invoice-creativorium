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
    if (rateType === 'minor') return data.minorRate;
    if (rateType === 'major') return data.majorRate;
    return customRate || 0;
  };

  const formatCurrency = (amount: number) => {
    // Round up to the nearest 1,000 Rupiah for clean numbers (e.g. 366,667 -> 367,000)
    const roundedUp = Math.ceil(amount / 1000) * 1000;
    return `IDR ${roundedUp.toLocaleString('id-ID')}`;
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
  const grandTotal = subTotal; // Currently no tax logic specified

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
            <th className={styles.quantity}>QTY / HRS</th>
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
                <td className={styles.quantity}>{item.quantity}</td>
                <td>{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.totalsBox}>
          <div className={styles.totalRow}>
            <span>Sub Total :</span>
            <span>{formatCurrency(subTotal)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Grand Total :</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

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

      {data.companyName && (
        <div className={styles.companyFooter}>
          <div className={styles.companyName}>{data.companyName}</div>
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
