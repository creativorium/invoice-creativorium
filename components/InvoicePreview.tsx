import React from 'react';
import styles from './InvoicePreview.module.css';
import { InvoiceData } from '../app/types';

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
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, ' - ');
  };

  const calculateSubTotal = () => {
    return data.subtasks.reduce((sum, item) => {
      const parsedQty = parseFloat(String(item.quantity)) || 0;
      return sum + (parsedQty * getRate(item.rateType, item.customRate));
    }, 0);
  };

  const subTotal = calculateSubTotal();
  const grandTotal = subTotal; // Currently no tax logic specified

  return (
    <div className={styles.previewContainer} id="invoice-preview">
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
            const parsedQty = parseFloat(String(item.quantity)) || 0;
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
    </div>
  );
}
