'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoicePreview from '../../components/InvoicePreview';
import { InvoiceData } from '../types';
import LZString from 'lz-string';

function ViewInvoiceContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const dataParam = searchParams.get('d');
  const [data, setData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (idParam) {
        try {
          const res = await fetch(`https://script.google.com/macros/s/AKfycbyL7SNI88Dk0Lqi2_ms215SrMtrYMyRGk3Sp3fHtVe6_d74OOI6RIVad08cK6ChjOl7/exec?id=${idParam}`);
          const json = await res.json();
          if (json.status === 'success' && json.data) {
            setData(json.data);
          } else {
            setError(json.message || 'Invoice not found');
          }
        } catch (e) {
          setError('Failed to load invoice from server.');
        }
      } else if (dataParam) {
        try {
          let jsonString = '';
        // Try LZString decompression first
        const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
        if (decompressed) {
          jsonString = decompressed;
        } else {
          // Fallback to legacy base64 if someone clicks an old link
          jsonString = Buffer.from(dataParam, 'base64').toString('utf-8');
        }
          setData(JSON.parse(jsonString));
        } catch (e) {
          setError('Failed to parse invoice data from URL');
        }
      } else {
        setError('Invalid invoice link');
      }
    };
    fetchData();
  }, [idParam, dataParam]);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-family)', color: '#d93025' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-family)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTopColor: '#1a3644', animation: 'spin 1s ease-in-out infinite' }}></div>
          <p style={{ fontWeight: 600 }}>Loading Invoice...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <InvoicePreview data={data} />
    </div>
  );
}

export default function ViewInvoice() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-family)' }}>Loading...</div>}>
      <ViewInvoiceContent />
    </Suspense>
  );
}
