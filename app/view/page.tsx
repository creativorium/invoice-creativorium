'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoicePreview from '../../components/InvoicePreview';
import { InvoiceData } from '../types';

function ViewInvoiceContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('d');
  const [data, setData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = Buffer.from(dataParam, 'base64').toString('utf-8');
        setData(JSON.parse(decoded));
      } catch (e) {
        console.error('Failed to parse invoice data from URL', e);
      }
    }
  }, [dataParam]);

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-family)' }}>
        <p>Loading invoice or invalid link...</p>
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
