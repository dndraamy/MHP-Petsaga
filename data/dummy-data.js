/**
 * data/dummy-data.js
 * File khusus data dummy awal (seed data) untuk prototype simulasi Petsaga.
 * Terpisah dari file style dan logic utama.
 */

// Helper untuk format tanggal relatif (hari ini + n hari)
const d = (n = 0) => {
  const x = new Date();
  x.setDate(x.getDate() + n);
  return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
};

const H = 36e5; // 1 jam dalam milidetik

// Daftar slot waktu Cat Cafe
const SL = ['10:00', '12:00', '14:00', '16:00', '18:00'];

// Pemetaan nama layanan
const SV = {
  cafe: 'Cat Cafe',
  groom: 'Grooming'
};

// Label & styling status reservasi
const STL = {
  Menunggu: 'Menunggu Konfirmasi',
  Terkonfirmasi: 'Terkonfirmasi',
  Ditolak: 'Ditolak'
};

const STC = {
  Menunggu: 'wn',
  Terkonfirmasi: 'ok',
  Ditolak: 'dg'
};

// Paket grooming
const PACKS = [
  ['Basic Care', 2, '±45 menit', 'Mandi + pengeringan'],
  ['Fresh & Clean', 3, '±1 jam', 'Mandi, pengeringan, potong kuku & bersihkan telinga'],
  ['Premium Paw', 4, '±1,5 jam', 'Fresh & Clean + sisir dan rapikan bulu'],
  ['Royal Treatment', 6, '±2,5 jam', 'Premium Paw + perawatan gigi, spa aroma, dan parfum hewan']
];

// Template balasan ulasan
const TPL = {
  Positif: 'Halo {nama}, terima kasih banyak atas ulasan positifnya! Kami senang Anda dan hewan kesayangan nyaman di Petsaga. Sampai jumpa lagi 🐾',
  Keluhan: 'Halo {nama}, mohon maaf atas ketidaknyamanan yang Anda alami. Keluhan sudah kami catat dan tim kami akan menindaklanjuti lewat WhatsApp dalam 2×24 jam.'
};

/**
 * Menghasilkan data dummy awal baru (fresh seed)
 */
function seed() {
  return {
    me: 'c1',
    n: 10,
    cap: {
      '10:00': 8,
      '12:00': 8,
      '14:00': 8,
      '16:00': 8,
      '18:00': 8
    },
    cust: [
      { id: 'c1', name: 'Aulia Rahma', wa: '081200000001', last: 3, m: { used: 6, tot: 10, pts: 240, exp: d(200), st: 'Aktif' } },
      { id: 'c2', name: 'Bima Pratama', wa: '081200000002', last: 75, m: { used: 9, tot: 10, pts: 410, exp: d(25), st: 'Aktif' } },
      { id: 'c3', name: 'Citra Lestari', wa: '081200000003', last: 10, m: { used: 2, tot: 10, pts: 80, exp: d(300), st: 'Aktif' } },
      { id: 'c4', name: 'Dimas Santoso', wa: '081200000004', last: 50, m: { used: 10, tot: 10, pts: 500, exp: d(-5), st: 'Kedaluwarsa' } },
      { id: 'c5', name: 'Eka Widyani', wa: '081200000005', last: 5, m: null },
      { id: 'c6', name: 'Farhan Nugroho', wa: '081200000006', last: 95, m: { used: 4, tot: 10, pts: 150, exp: d(120), st: 'Aktif' } }
    ],
    pets: [
      { id: 'p1', o: 'c1', n: 'Mochi', t: 'Kucing', a: '2 th', v: 'Lengkap', al: '', tp: 'Tenang' },
      { id: 'p2', o: 'c1', n: 'Susu', t: 'Kucing', a: '8 bln', v: 'Belum lengkap', al: '', tp: 'Pemalu, takut suara keras' },
      { id: 'p3', o: 'c2', n: 'Biscuit', t: 'Anjing', a: '7 th', v: 'Lengkap', al: 'Shampo beraroma kuat', tp: 'Tenang' },
      { id: 'p4', o: 'c3', n: 'Kopi', t: 'Anjing', a: '4 th', v: 'Lengkap', al: 'Ayam', tp: 'Aktif, suka menggigit handuk' },
      { id: 'p5', o: 'c4', n: 'Oreo', t: 'Kucing', a: '1 th', v: 'Lengkap', al: '', tp: 'Agresif saat disisir' },
      { id: 'p6', o: 'c5', n: 'Nala', t: 'Kucing', a: '3 th', v: 'Belum lengkap', al: '', tp: 'Ramah' },
      { id: 'p7', o: 'c6', n: 'Simba', t: 'Kucing', a: '6 th', v: 'Lengkap', al: 'Ikan laut', tp: 'Tenang' }
    ],
    res: [
      { id: 'RSV-001', c: 'c1', svc: 'cafe', date: d(0), time: '10:00', qty: 2, st: 'Terkonfirmasi' },
      { id: 'RSV-002', c: 'c3', svc: 'cafe', date: d(0), time: '10:00', qty: 3, st: 'Terkonfirmasi' },
      { id: 'RSV-003', c: 'c2', svc: 'cafe', date: d(0), time: '14:00', qty: 4, st: 'Menunggu' },
      { id: 'RSV-004', c: 'c5', svc: 'cafe', date: d(1), time: '12:00', qty: 2, st: 'Menunggu' },
      { id: 'RSV-005', c: 'c1', svc: 'groom', date: d(2), time: '—', qty: 1, pt: 'Kucing', age: '2 th', pack: 'Premium Paw', note: 'Takut suara pengering', st: 'Menunggu' },
      { id: 'RSV-006', c: 'c3', svc: 'groom', date: d(-3), time: '—', qty: 1, pt: 'Anjing', age: '4 th', pack: 'Fresh & Clean', note: 'Aktif, suka menggigit handuk', st: 'Terkonfirmasi' },
      { id: 'RSV-007', c: 'c6', svc: 'cafe', date: d(1), time: '16:00', qty: 6, st: 'Ditolak' },
      { id: 'RSV-008', c: 'c4', svc: 'groom', date: d(3), time: '—', qty: 2, pt: 'Kucing', age: '1 th & 5 th', pack: 'Royal Treatment', note: 'Salah satu agresif saat disisir', st: 'Ditolak' },
      { id: 'RSV-009', c: 'c2', svc: 'groom', date: d(4), time: '—', qty: 1, pt: 'Anjing', age: '7 th', pack: 'Basic Care', note: 'Alergi shampo beraroma', st: 'Menunggu' }
    ],
    fb: [
      { id: 'f1', c: 'c2', svc: 'groom', r: 1, txt: 'Hewan saya pulang dalam kondisi bulu masih lembap.', h: 60, replied: false, done: false },
      { id: 'f2', c: 'c4', svc: 'cafe', r: 2, txt: 'Antrean masuk lama dan area kurang bersih.', h: 30, replied: false, done: false },
      { id: 'f3', c: 'c1', svc: 'cafe', r: 5, txt: 'Kucingnya ramah-ramah, staf sangat membantu!', h: 100, replied: true, done: false },
      { id: 'f4', c: 'c3', svc: 'groom', r: 4, txt: 'Hasil grooming rapi, harum, dan Kopi tenang.', h: 5, replied: false, done: false },
      { id: 'f5', c: 'c6', svc: 'cafe', r: 4, txt: 'Suasananya sangat nyaman dan kucingnya ramah-ramah.', h: 20, replied: false, done: false },
      { id: 'f6', c: 'c5', svc: 'groom', r: 5, txt: 'Pelayanan cepat dan hasilnya memuaskan.', h: 150, replied: true, done: true }
    ].map(f => ({ ...f, at: Date.now() - f.h * H })),
    ct: {}
  };
}

// Ekspor ke window agar dapat diakses oleh core.js
window.PETSAGA_SEED = seed;
window.d = d;
window.SL = SL;
window.SV = SV;
window.STL = STL;
window.STC = STC;
window.PACKS = PACKS;
window.TPL = TPL;
window.H = H;
