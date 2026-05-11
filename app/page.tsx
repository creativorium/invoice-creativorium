'use client';

import React, { useState, useEffect } from 'react';
import styles from './invoice.module.css';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { InvoiceData, defaultInvoiceData } from './types';

export default function Home() {
  const [data, setData] = useState<InvoiceData>(defaultInvoiceData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('invoiceAuth');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }

    const saved = localStorage.getItem('invoiceData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.globalRates && (parsed.minorRate !== undefined || parsed.majorRate !== undefined)) {
          parsed.globalRates = [
            { id: 'minor', name: 'Minor Update', rate: parsed.minorRate || 150000 },
            { id: 'major', name: 'Major Update', rate: parsed.majorRate || 250000 }
          ];
        }
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

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const saveToGoogleSheets = async (id: string, url: string) => {
    try {
      const parseQuantity = (qtyStr: string) => {
        const str = String(qtyStr || '').toLowerCase().trim();
        if (!/[a-z]/i.test(str)) return parseFloat(str) || 0;
        let t = 0; let m = false;
        const hm = str.match(/([\d.]+)\s*h/); if (hm) { t += parseFloat(hm[1])||0; m=true; }
        const mm = str.match(/([\d.]+)\s*m/); if (mm) { t += (parseFloat(mm[1])||0)/60; m=true; }
        return m ? t : (parseFloat(str) || 0);
      };
      
      let totalHoursNum = 0;
      const sub = data.subtasks.reduce((sum, item) => {
        let rate = 0;
        if (item.rateType === 'custom') {
          rate = item.customRate || 0;
        } else if (item.rateType === 'minor' && data.minorRate !== undefined) {
          rate = data.minorRate;
        } else if (item.rateType === 'major' && data.majorRate !== undefined) {
          rate = data.majorRate;
        } else {
          const globalRate = (data.globalRates || []).find(r => r.id === item.rateType);
          if (globalRate) rate = globalRate.rate;
        }
        
        const qty = item.quantityType === 'rate' ? 1 : parseQuantity(item.quantity);
        totalHoursNum += qty;
        
        let itemTotal = qty * rate;
        if (item.discount) {
          if (item.discountType === 'percentage') {
            itemTotal -= itemTotal * (item.discount / 100);
          } else {
            itemTotal -= item.discount;
          }
        }
        return sum + itemTotal;
      }, 0);
      
      let globalDiscountAmount = 0;
      if (data.globalDiscount) {
        if (data.globalDiscountType === 'percentage') {
          globalDiscountAmount = sub * (data.globalDiscount / 100);
        } else {
          globalDiscountAmount = data.globalDiscount;
        }
      }
      
      const subAfterDiscount = sub - globalDiscountAmount;
      const taxAmount = data.hasTax ? subAfterDiscount * (data.taxPercentage || 0) / 100 : 0;
      const rawGrandTotal = subAfterDiscount + taxAmount;
      
      let grandTotal = rawGrandTotal;
      const currency = data.currency || 'IDR';
      if (currency === 'IDR') {
        grandTotal = Math.ceil(rawGrandTotal / 1000) * 1000;
      } else {
        grandTotal = Math.ceil(rawGrandTotal * 100) / 100;
      }
      
      const paymentDueDate = data.dueDate 
        ? new Date(data.dueDate + 'T00:00:00').toLocaleDateString('en-GB') 
        : new Date(new Date(data.issueDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

      const taskList = data.subtasks.map(t => t.title).join(', ');

      const payload = {
        apiKey: '9W8HLtwj9C3tQrCwQN1PFzuTZLz69pgH',
        id: id,
        jsonData: JSON.stringify(data),
        data: {
          date: new Date(data.issueDate).toLocaleDateString('en-GB'),
          dueDate: paymentDueDate,
          invoiceName: data.invoiceNumber,
          clientName: data.clientCompany || data.clientName,
          totalHours: totalHoursNum,
          totalPrice: grandTotal,
          sharedUrl: url,
          task: taskList,
          statusPayment: ''
        }
      };

      await fetch('https://script.google.com/macros/s/AKfycbyL7SNI88Dk0Lqi2_ms215SrMtrYMyRGk3Sp3fHtVe6_d74OOI6RIVad08cK6ChjOl7/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error('Failed to log to Google Sheets', e);
    }
  };

  const handlePrint = async () => {
    setIsSaving(true);
    const id = generateShortId();
    const url = `${window.location.origin}/view?id=${id}`;
    await saveToGoogleSheets(id, url);
    setIsSaving(false);
    // Use a small timeout to let React render the DOM without the loading overlay
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleShare = async () => {
    setIsSaving(true);
    setSaveComplete(false);
    try {
      const id = generateShortId();
      const url = `${window.location.origin}/view?id=${id}`;
      await saveToGoogleSheets(id, url);
      await navigator.clipboard.writeText(url);
      setSaveComplete(true);
      setTimeout(() => {
        setSaveComplete(false);
        setIsSaving(false);
      }, 2000);
    } catch (e) {
      alert('Failed to generate or copy URL.');
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('invoiceAuth');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yagituajalah') {
      setIsLoggedIn(true);
      localStorage.setItem('invoiceAuth', 'true');
      setError('');
    } else {
      setError('password salah coy, minta dlu ke ownernya');
    }
  };

  if (!isLoaded) return null;

  if (!isLoggedIn) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>CREATIVORIUM</h1>
            <p className={styles.loginSubtitle}>INVOICE GENERATOR</p>
          </div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Password</label>
              <input 
                type="password" 
                placeholder="Team password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
                autoFocus
              />
            </div>
            <button type="submit" className={styles.loginButton}>Enter Invoice Generator</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
          <p className={styles.loginFooter}>This area is restricted to area.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <button className={styles.logoutTopRight} onClick={handleLogout}>Log Out</button>

      <div className={styles.sidebar}>
        <InvoiceForm 
          data={data} 
          onChange={setData} 
          onPrint={handlePrint}
          onShare={handleShare}
          isSaving={isSaving}
        />
      </div>
      <div className={styles.previewArea}>
        <InvoicePreview data={data} />
      </div>

      {isSaving && (
        <div className={styles.loadingOverlay}>
          {saveComplete ? (
            <>
              <div className={styles.successCheckmark}>✓</div>
              <p>Done! URL Copied to Clipboard.</p>
            </>
          ) : (
            <>
              <div className={styles.loadingSpinner}></div>
              <p>Generating Invoice...</p>
            </>
          )}
        </div>
      )}

      {/* Fixed bottom action bar for mobile */}
      <div className={styles.mobileActionBar}>
        <button className={styles.mobileActionBtn} onClick={handleShare} disabled={isSaving}>
          Share URL
        </button>
        <button className={`${styles.mobileActionBtn} ${styles.mobilePrimary}`} onClick={handlePrint} disabled={isSaving}>
          Print / PDF
        </button>
        <button className={`${styles.mobileActionBtn} ${styles.mobileDanger}`} onClick={handleLogout} disabled={isSaving}>
          Log Out
        </button>
      </div>
    </main>
  );
}
