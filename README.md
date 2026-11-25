# Petsaga — Website Cat Cafe, Pet Grooming & Panel Admin CRM

Proyek website responsif menggunakan **HTML murni** dengan styling **Tailwind CSS**, tipografi modern standar aplikasi (**Plus Jakarta Sans**), maskot kucing (**Mochi the Cat**), dan **100% ikon vektor SVG monokrom/tema** (bebas dari emotikon berwarna bawaan OS).

---

## 🎨 Pembaruan Desain & Alur Pengguna

1. **Palet Warna Sesuai Logo Petsaga**:
   - **Amber-Gold** (`#F99D26`): Warna hangat dari lingkaran logo resmi Petsaga.
   - **Deep Petrol Teal** (`#0B474D`): Warna khas tipografi kata *"petsaga"*.
   - **Latar Belakang Putih Bersih** (`#FFFFFF`): Menghilangkan nuansa pastel buram agar tampilan terlihat sangat jelas, modern, dan berkontras tinggi (*high-clarity*).

2. **Alur Navigasi Dashboard & Pemisahan Portal**:
   - Saat website pertama kali dibuka, pengguna langsung masuk ke **Dashboard Pelanggan** ([index.html](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/petsaga/index.html)).
   - Di header atas tersedia tombol yang jelas: **"Portal Admin"** yang mengarahkan ke halaman login internal [admin-login.html](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/petsaga/admin-login.html).

3. **Portal Admin: Wajib Login & Khusus Desktop**:
   - Menggunakan alur autentikasi staf via [admin-login.html](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/petsaga/admin-login.html) dengan kredensial demo (`admin@petsaga.com` / `petsaga2026`).
   - **Proteksi Layar Lebar**: Panel Admin dikunci khusus untuk perangkat Desktop/Laptop (layar min. 1024px). Jika dibuka di smartphone atau tablet, sistem secara otomatis menampilkan layar pencegah (*mobile barrier*) dengan tombol kembali ke Portal Pelanggan.

4. **Navigasi Bawah Pelanggan yang Lega (Tidak Berjejer Padat)**:
   - Pada perangkat mobile (layar ≤ 820px), menu bawah disederhanakan menjadi **5 tab utama** yang proporsional dan nyaman dijangkau:
     - **Beranda** (`index.html`)
     - **Cat Cafe** (`cafe.html`)
     - **Grooming** (`grooming.html`)
     - **VIP Member** (`member.html`)
     - **Info & FAQ** (`info.html`)

5. **Bentuk Kartu Fisik Asli untuk VIP Membership**:
   - Di halaman [member.html](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/petsaga/member.html), kartu keanggotaan didesain menyerupai kartu ATM/kredit fisik asli:
     - Rasio standar kartu fisik ISO/IEC (1.586 : 1) dengan sudut melengkung.
     - Chip emas EMV realistis dengan grid sirkuit mikro.
     - Ikon gelombang transaksi nirsentuh (*contactless NFC*).
     - Nomor kartu 16-digit timbul (*embossed*): `8024 4219 8820 1049`.
     - Nama pemegang kartu timbul (*embossed*): `AULIA RAHMA`.
     - Efek kemilau cahaya (*glossy reflective sheen*) dan bayangan fisik 3D.

---

## 📁 Struktur Direktori

```text
petsaga/
├── css/
│   └── style.css            # Stylesheet tema, warna logo Petsaga, blocker desktop, kartu fisik & bottom nav
├── data/
│   └── dummy-data.js        # Data awal dummy (pelanggan, reservasi, kuota, paket grooming)
├── js/
│   └── core.js              # Logika interaksi murni: toast, modal, rating bintang & validasi form
├── index.html               # Beranda Portal Pelanggan & aksi cepat
├── info.html                # Portal Pelanggan: Aturan Cat Cafe & akordeon FAQ
├── cafe.html                # Portal Pelanggan: Form reservasi slot Cat Cafe
├── grooming.html            # Portal Pelanggan: Form booking Pet Grooming & 4 paket perawatan
├── hewan.html               # Portal Pelanggan: Profil anabul (Mochi & Susu) & formulir tambah hewan
├── member.html              # Portal Pelanggan: Kartu fisik VIP digital, kuota sesi & poin
├── feedback.html            # Portal Pelanggan: Rating bintang SVG interaktif & riwayat ulasan
├── admin-login.html         # Panel Admin: Halaman login autentikasi staf (dengan desktop blocker)
├── admin-dashboard.html     # Panel Admin: Ringkasan metrik harian & kontrol kuota
├── admin-reservasi.html     # Panel Admin: Tabel data reservasi dengan pencarian & filter
├── admin-pelanggan.html     # Panel Admin: Tabel pelanggan, kontak WhatsApp & profil anabul
├── admin-ulasan.html        # Panel Admin: Kotak ulasan pelanggan & form balas tanggapan
├── admin-pengingat.html     # Panel Admin: Pengingat retensi pelanggan pasif & membership expired
├── admin-kpi.html           # Panel Admin: Laporan KPI kepuasan & sebaran rating bintang
├── vercel.json              # Konfigurasi deployment routing Vercel
├── package.json             # Metadata & script development lokal
└── README.md                # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan & Deploy ke Vercel

### Jalankan Lokal
```bash
cd C:\Users\Lenovo\.gemini\antigravity\scratch\petsaga
npx serve .
```

### Hosting di Vercel
1. Push repository ke GitHub.
2. Di [vercel.com](https://vercel.com), pilih **Add New... > Project** dan import repository.
3. Klik **Deploy** (otomatis menggunakan static hosting via `vercel.json`).
