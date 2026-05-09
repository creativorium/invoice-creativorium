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

  useEffect(() => {
    const authStatus = localStorage.getItem('invoiceAuth');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }

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

  const generateShareUrl = () => {
    const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
    return `${window.location.origin}/view?d=${encoded}`;
  };

  const saveToGoogleSheets = async (url: string) => {
    setIsSaving(true);
    try {
      const parseQuantity = (qtyStr: string) => {
        const str = String(qtyStr || '').toLowerCase().trim();
        if (!/[a-z]/i.test(str)) return parseFloat(str) || 0;
        let t = 0; let m = false;
        const hm = str.match(/([\d.]+)\s*h/); if (hm) { t += parseFloat(hm[1])||0; m=true; }
        const mm = str.match(/([\d.]+)\s*m/); if (mm) { t += (parseFloat(mm[1])||0)/60; m=true; }
        return m ? t : (parseFloat(str) || 0);
      };
      
      const sub = data.subtasks.reduce((sum, item) => {
        const rate = item.rateType === 'minor' ? data.minorRate : (item.rateType === 'major' ? data.majorRate : (item.customRate || 0));
        return sum + (parseQuantity(item.quantity) * rate);
      }, 0);
      const grandTotal = Math.ceil(sub / 1000) * 1000;

      const payload = {
        apiKey: '9W8HLtwj9C3tQrCwQN1PFzuTZLz69pgH',
        data: {
          invoiceNumber: data.invoiceNumber,
          date: new Date(data.issueDate).toLocaleDateString('en-GB'),
          projectName: data.taskProject,
          clientName: data.clientCompany || data.clientName,
          senderName: data.myName,
          grandTotal: grandTotal,
          url: url
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
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = async () => {
    await saveToGoogleSheets(generateShareUrl());
    window.print();
  };

  const handleShare = async () => {
    const url = generateShareUrl();
    await saveToGoogleSheets(url);
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable URL copied to clipboard! (Data also logged to your Google Sheet)');
    });
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

      {/* Fixed bottom action bar for mobile */}
      <div className={styles.mobileActionBar}>
        <button className={styles.mobileActionBtn} onClick={handleShare} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Share URL'}
        </button>
        <button className={`${styles.mobileActionBtn} ${styles.mobilePrimary}`} onClick={handlePrint} disabled={isSaving}>
          Print / PDF
        </button>
        <button className={`${styles.mobileActionBtn} ${styles.mobileDanger}`} onClick={handleLogout}>Log Out</button>
      </div>
    </main>
  );
}
