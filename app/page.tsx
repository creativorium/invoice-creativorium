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
            <h1 className={styles.loginTitle}>Creativorium</h1>
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
          <p className={styles.loginFooter}>This area is restricted to authorised Creativorium staff.</p>
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
        />
      </div>
      <div className={styles.previewArea}>
        <InvoicePreview data={data} />
      </div>

      {/* Fixed bottom action bar for mobile */}
      <div className={styles.mobileActionBar}>
        <button className={styles.mobileActionBtn} onClick={handleShare}>Share URL</button>
        <button className={`${styles.mobileActionBtn} ${styles.mobilePrimary}`} onClick={handlePrint}>Print / PDF</button>
        <button className={`${styles.mobileActionBtn} ${styles.mobileDanger}`} onClick={handleLogout}>Log Out</button>
      </div>
    </main>
  );
}
