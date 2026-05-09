import React from 'react';

export const metadata = {
  title: 'Dokumentasi - Creativorium Invoice Generator',
  description: 'Panduan lengkap cara menggunakan Creativorium Invoice Generator',
};

export default function Documentation() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '40px 20px', fontFamily: 'var(--font-family)', color: 'var(--primary-color)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--invoice-bg)', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--primary-color)', borderBottom: '2px solid var(--accent-color)', paddingBottom: '10px', display: 'inline-block' }}>Panduan Penggunaan</h1>
        <p style={{ color: 'var(--secondary-color)', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>Dokumentasi komprehensif cara menggunakan <strong>Creativorium Invoice Generator</strong>. Ikuti langkah-langkah di bawah ini untuk membuat invoice dengan editor yang cepat dan mudah.</p>

        {/* 1. Akses & Login */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>1</span>
            Akses & Login
          </h2>
          <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
            Aplikasi ini diamankan dengan kata sandi (password). Saat pertama kali membuka, Anda wajib memasukkan <strong>Team password</strong> yang telah diberikan oleh pemilik (Owner). Setelah login berhasil, akses Anda akan disimpan di sistem (Local Storage) sehingga Anda tidak perlu login berulang kali di perangkat yang sama.
          </p>
        </section>

        {/* 2. General Info */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>2</span>
            General Info (Informasi Umum)
          </h2>
          <ul style={{ listStyleType: 'none', paddingLeft: '0', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}><strong>Issue Date & Due Date:</strong> Tanggal diterbitkannya invoice dan tenggat waktu pembayaran. Secara bawaan (default), Due Date diatur ke esok hari, namun Anda bebas mengubahnya sesuai perjanjian.</li>
            <li style={{ marginBottom: '10px' }}><strong>Invoice Number:</strong> Masukkan nomor seri dokumen secara manual (misal: INV-001).</li>
            <li style={{ marginBottom: '10px' }}><strong>Currency (Mata Uang):</strong> Anda dapat memilih IDR, USD, AUD, atau SGD. Seluruh tabel akan menyesuaikan format angka secara otomatis. (Contoh: USD memiliki 2 desimal, sedangkan IDR akan dibulatkan ke atas setiap kelipatan Rp 1.000).</li>
            <li style={{ marginBottom: '10px' }}><strong>Apply Tax (Pajak):</strong> Centang kotak ini jika Anda ingin mengenakan pajak pada tagihan. Tentukan persentase pajak (misal 11%), maka total akhir (Grand Total) akan dihitung secara otomatis.</li>
          </ul>
        </section>

        {/* 3. Global Rates */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>3</span>
            Global Rates (Tarif Layanan Dasar)
          </h2>
          <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
            Bagian ini memungkinkan Anda menyimpan daftar harga patokan untuk layanan yang sering Anda gunakan agar tidak perlu mengetik nominal berulang kali pada setiap penambahan item.
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Klik tombol <strong>+ Add Rate</strong> untuk membuat kategori layanan baru.</li>
            <li>Beri nama layanan (misal: "Photography", "Website Development") dan tentukan <strong>Default Rate</strong> (Nominal Dasar).</li>
            <li>Daftar layanan yang Anda buat di sini akan otomatis muncul pada pengaturan <em>Rate Type</em> saat Anda menambah rincian tugas (Tasks & Items).</li>
          </ul>
        </section>

        {/* 4. Tasks & Items */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>4</span>
            Tasks & Items (Pengisian Item Tagihan)
          </h2>
          <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>Isi tabel rincian pengerjaan klien di bagian ini secara detail.</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Title & Subtitle:</strong> Judul layanan utama yang dikerjakan beserta deskripsi atau penjelasannya.</li>
            <li><strong>Type (QTY / HRS / RATE):</strong> Menentukan kalkulator kuantitas:
              <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                <li><strong>QTY (Kuantitas):</strong> Dihitung sebagai unit/satuan (Contoh pengisian: <code>1</code>, <code>5</code>).</li>
                <li><strong>HRS (Waktu):</strong> Dihitung berdasarkan durasi jam kerja (Contoh pengisian: <code>2h</code>, <code>2h 30m</code>).</li>
                <li><strong>RATE (Tarif Tetap):</strong> Dihitung sebagai harga lumpsum (Kuantitas akan dikunci menjadi strip <code>-</code> dan dihitung sebagai 1x pengerjaan).</li>
              </ul>
            </li>
            <li><strong>Rate Type:</strong> Pilih dari <em>Global Rates</em> yang telah Anda buat sebelumnya untuk menggunakan template harga. Atau pilih <strong>"Custom"</strong> jika Anda ingin mengetikkan harga yang berbeda dari standar pada bagian <em>Amount</em> yang akan muncul.</li>
          </ul>
        </section>

        {/* 5. Detail Tambahan & Personalisasi */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>5</span>
            Personalisasi, Pembayaran, dan Catatan
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>My Info & Payment Methods:</strong> Informasi Nama, Jabatan Penagih, dan Detail Rekening Bank untuk pencairan dana (tersedia maksimal 2 slot rekening bank berbeda).</li>
            <li><strong>Company Footer Details:</strong> Informasi kontak perusahaan pendukung yang akan muncul pada bagian bawah invoice.</li>
            <li><strong>Custom Note (Catatan Tambahan):</strong> Tulis pesan hangat (seperti "Terima Kasih atas kerjasamanya!") atau instruksi khusus transfer. Catatan ini akan muncul di atas metode pembayaran. Mohon maap spacenya jgn banyak banyak dipakai nanti jelek.</li>
            <li><strong>Company Logo:</strong> Anda bisa mengunggah file logo (Maksimal 2MB) akan muncul di header dan footer.</li>
            <li><strong>Theme Color:</strong> Ubah warna aksen tema invoice sesuai keinginan (Bawaan: oranye kekuningan Creativorium).</li>
          </ul>
        </section>

        {/* 6. Export */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--theme-color, var(--primary-color))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px' }}>6</span>
            Export (Simpan, Cetak, & Bagikan)
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Share URL:</strong> Menghasilkan dan menyalin sebuah tautan pendek (contoh: <code>/view?id=abcde</code>). Berikan tautan ini ke klien agar mereka dapat mengakses invoice digital secara instan lewat browser mereka, kapan saja.</li>
            <li><strong>Print / PDF:</strong> Mencetak layar aktif atau menyimpan dokumen lokal menjadi file PDF yang sah. Tapi mohon maap PDFnya kadang 2 page kadang 1 page ga jelas masih.</li>
          </ul>
        </section>

        <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
          <a href="/" style={{ color: 'white', backgroundColor: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', padding: '12px 30px', borderRadius: '6px', transition: 'all 0.3s ease' }}>Gas Buat Invoice</a>
        </div>
      </div>
    </div>
  );
}
