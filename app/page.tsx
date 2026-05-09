'use client';

import React, { useState, useEffect } from 'react';
import styles from './invoice.module.css';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { InvoiceData, defaultInvoiceData } from './types';

export default function Home() {
  const [data, setData] = useState<InvoiceData>(defaultInvoiceData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('invoiceData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...defaultInvoiceData, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved invoice data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('invoiceData', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
    const url = `${window.location.origin}/view?d=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable URL copied to clipboard!');
    });
  };

  if (!isLoaded) return null;

  return (
    <main className={styles.container}>
      <div className={styles.sidebar}>
        <InvoiceForm 
          data={data} 
          onChange={setData} 
          onPrint={handlePrint}
          onShare={handleShare}
        />
      </div>
      <div className={styles.previewArea}>
        <InvoicePreview data={data} />
      </div>
    </main>
  );
}
