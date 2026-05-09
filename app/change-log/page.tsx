import React from 'react';

export const metadata = {
  title: 'Change Log - Creativorium Invoice Generator',
  description: 'Catatan pembaruan untuk Creativorium Invoice Generator',
};

export default function ChangeLog() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '40px 20px', fontFamily: 'var(--font-family)', color: 'var(--primary-color)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--invoice-bg)', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: 'var(--primary-color)', borderBottom: '2px solid var(--accent-color)', paddingBottom: '10px', display: 'inline-block' }}>Catatan Pembaruan (Change Log)</h1>
        <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Pembaruan terbaru untuk Creativorium Invoice Generator.</p>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>v2.0.1</span>
            <span style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>9 Mei 2026</span>
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Pembaruan UI & Tata Letak</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8', color: 'var(--primary-color)' }}>
            <li><strong>Penyesuaian Area Total:</strong> Lebar kotak rincian harga (Sub Total, Tax, Grand Total) telah diperlebar agar nominal yang besar (seperti USD/AUD) tidak terpotong atau turun ke baris baru. Margin bawah di versi mobile juga telah dioptimalkan.</li>
            <li><strong>Posisi Catatan (Notes):</strong> Lokasi catatan khusus telah disempurnakan dan sekarang berada rapi tepat di atas area informasi Metode Pembayaran (pada desktop maupun mobile).</li>
            <li><strong>Perbaikan Tata Letak Logo:</strong> Spasi dan penempatan Logo Perusahaan diatur ulang; pada header mobile diposisikan ke kiri (flex-start), dan pada footer diatur agar sejajar rapi dengan Nama Perusahaan tanpa celah/spasi berlebih.</li>
            <li><strong>Label Input Mata Uang Dinamis:</strong> Label pengisian harga/rate kini akan otomatis menyesuaikan dengan nama mata uang yang Anda pilih (misal: "Amount (USD)", bukan lagi "Amount (IDR)").</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#666', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>v2.0.0</span>
            <span style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>Mei 2026</span>
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Pembaruan Fitur Mayor</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8', color: 'var(--primary-color)' }}>
            <li><strong>Pengaturan Tarif Global (Dynamic Global Rates):</strong> Anda sekarang dapat menambahkan, menamai, dan mengatur tarif dasar untuk berbagai layanan khusus (misalnya, "Fotografi", "Video Editing") di bagian "Global Rates". Ini menggantikan sistem "Minor/Major update" yang kaku sebelumnya.</li>
            <li><strong>Pemilihan Tipe Kalkulasi (QTY / HRS / RATE):</strong> Setiap tugas/item kini memiliki opsi pilihan tipe kalkulasi (Kuantitas, Jam, atau Tarif Tetap). Label pada tabel invoice dan keterangan total akan menyesuaikan otomatis. Jika memilih RATE, kuantitas akan diset otomatis menjadi 1.</li>
            <li><strong>Unggah Logo Perusahaan:</strong> Menambahkan opsi untuk mengunggah logo kustom (maksimal 2MB) yang akan muncul di pojok kanan atas invoice dan di atas nama perusahaan pada bagian footer.</li>
            <li><strong>Pilihan Mata Uang:</strong> Menambahkan menu pilihan mata uang (IDR, USD, AUD, SGD). Kalkulasi dan format angka desimal akan disesuaikan otomatis (contoh: 2 desimal untuk USD/AUD/SGD dengan pembulatan ke atas, dan pembulatan ribuan untuk IDR).</li>
            <li><strong>Perhitungan Pajak:</strong> Opsi baru untuk menambahkan pajak (dalam persentase) yang akan terakumulasi otomatis ke total akhir (Grand Total).</li>
            <li><strong>Tenggat Waktu Pembayaran (Due Date) Kustom:</strong> Tenggat waktu pembayaran kini dapat diatur secara manual melalui fitur kalender, tidak lagi terpaku otomatis pada perhitungan hari esok.</li>
            <li><strong>Catatan Tambahan (Custom Note):</strong> Anda dapat menambahkan catatan khusus yang akan tampil dengan rapi di dalam kotak berwarna kuning pastel di atas area metode pembayaran.</li>
            <li><strong>Kompatibilitas Sistem (Backward Compatibility):</strong> Invoice lama yang disimpan di sistem (local storage) akan dikonversi secara otomatis menggunakan struktur pengaturan layanan dinamis yang baru agar data lama tidak hilang.</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <a href="/" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', padding: '10px 20px', border: '1px solid var(--accent-color)', borderRadius: '6px', transition: 'all 0.3s ease' }}>Kembali ke Generator</a>
        </div>
      </div>
    </div>
  );
}
