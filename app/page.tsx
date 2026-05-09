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
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h1 className={styles.loginTitle}>Creativorium Invoice</h1>
          <input 
            type="password" 
            placeholder="Enter password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
            autoFocus
          />
          <button type="submit" className={styles.loginButton}>Enter</button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </main>
    );
  }

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
