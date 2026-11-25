/**
 * js/core.js
 * JavaScript ringan yang difokuskan khusus untuk animasi, micro-interactions,
 * dialog modal, notifikasi toast, dan interaktivitas UI.
 * Tidak menghasilkan struktur HTML dari nol (HTML sudah murni di template).
 */

// Helper selector DOM
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Helper escape HTML sederhana
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

let MB = [];

/**
 * 1. ANIMASI TOAST NOTIFIKASI
 */
function toast(text, type = '') {
  const container = $('#toast');
  if (!container) return;

  const t = document.createElement('div');
  t.className = 't ' + type;
  t.textContent = text;
  container.appendChild(t);

  // Animasi masuk & otomatis keluar
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px)';
    t.style.transition = 'all 0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

/**
 * 2. ANIMASI MODAL DIALOG
 */
function M(title, contentHtml, buttons = [['Tutup', 'ghost']]) {
  MB = buttons;
  const modal = $('#modal');
  const mt = $('#mt');
  const mb = $('#mb');
  const mf = $('#mf');

  if (!modal || !mt || !mb || !mf) return;

  mt.textContent = title;
  mb.innerHTML = contentHtml;
  mf.innerHTML = buttons.map((b, i) => `<button class="btn ${b[1]}" data-action="mb" data-v="${i}">${b[0]}</button>`).join('');

  modal.hidden = false;
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.2s ease';
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
  });

  const focusTarget = $('#mb textarea, #mb select, #mb input') || $('#mf button:last-child');
  if (focusTarget) focusTarget.focus();
}

function X() {
  const modal = $('#modal');
  if (!modal || modal.hidden) return;
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.hidden = true;
  }, 200);
}

// Data detail reservasi untuk modal & tampilan
const DEFAULT_RES_STATUS = {
  'RSV-001': 'Terkonfirmasi',
  'RSV-002': 'Terkonfirmasi',
  'RSV-003': 'Menunggu',
  'RSV-004': 'Menunggu',
  'RSV-005': 'Menunggu',
  'RSV-006': 'Terkonfirmasi',
  'RSV-007': 'Ditolak',
  'RSV-008': 'Ditolak',
  'RSV-009': 'Menunggu'
};

const RES_DETAILS = {
  'RSV-001': { name: 'Aulia Rahma', wa: '081200000001', svc: 'Cat Cafe', schedule: 'Hari ini, 10:00 WIB', qty: '2 orang', price: 'Rp30.000', note: 'Pengunjung santai' },
  'RSV-002': { name: 'Citra Lestari', wa: '081200000003', svc: 'Cat Cafe', schedule: 'Hari ini, 10:00 WIB', qty: '3 orang', price: 'Rp45.000', note: 'Bermain dengan kucing ras' },
  'RSV-003': { name: 'Bima Pratama', wa: '081200000002', svc: 'Cat Cafe', schedule: 'Hari ini, 14:00 WIB', qty: '4 orang', price: 'Rp60.000', note: 'Reservasi meja tengah' },
  'RSV-004': { name: 'Eka Widyani', wa: '081200000005', svc: 'Cat Cafe', schedule: 'Besok, 12:00 WIB', qty: '2 orang', price: 'Rp30.000', note: 'Kunjungan pertama kali' },
  'RSV-005': { name: 'Aulia Rahma', wa: '081200000001', svc: 'Pet Grooming (Premium Paw)', schedule: '2 Hari Lagi', qty: '1 Kucing (2 th)', price: 'Rp110.000', note: 'Takut suara pengering' },
  'RSV-006': { name: 'Citra Lestari', wa: '081200000003', svc: 'Pet Grooming (Fresh & Clean)', schedule: '3 Hari Lalu', qty: '1 Anjing (4 th)', price: 'Rp85.000', note: 'Aktif, suka gigit handuk' },
  'RSV-007': { name: 'Farhan Nugroho', wa: '081200000006', svc: 'Cat Cafe', schedule: 'Besok, 16:00 WIB', qty: '6 orang', price: 'Rp90.000', note: 'Slot sore penuh' },
  'RSV-008': { name: 'Dimas Santoso', wa: '081200000004', svc: 'Pet Grooming (Royal Treatment)', schedule: '3 Hari Lagi', qty: '2 Kucing (1 th & 5 th)', price: 'Rp300.000', note: 'Salah satu agresif saat disisir' },
  'RSV-009': { name: 'Bima Pratama', wa: '081200000002', svc: 'Pet Grooming (Basic Care)', schedule: '4 Hari Lagi', qty: '1 Anjing (7 th)', price: 'Rp75.000', note: 'Alergi shampo beraroma' }
};

function getResStatuses() {
  try {
    const s = localStorage.getItem('petsaga_res_status');
    if (s) return JSON.parse(s);
  } catch (e) {}
  return { ...DEFAULT_RES_STATUS };
}

function setResStatus(id, newStatus) {
  const statuses = getResStatuses();
  statuses[id] = newStatus;
  localStorage.setItem('petsaga_res_status', JSON.stringify(statuses));
  return statuses;
}

window.DEFAULT_RES_STATUS = DEFAULT_RES_STATUS;
window.RES_DETAILS = RES_DETAILS;
window.getResStatuses = getResStatuses;
window.setResStatus = setResStatus;

/**
 * 3. INTERAKSI & AKSI TOMBOL
 */
const Actions = {
  // Tombol reset demo data
  reset: () => {
    localStorage.removeItem('petsaga_res_status');
    toast('Data reservasi telah dikembalikan ke kondisi awal', 'in');
    if (typeof window.syncDashboardCounters === 'function') window.syncDashboardCounters();
    if (typeof window.syncReservationsTable === 'function') window.syncReservationsTable();
  },

  // Tombol dalam modal
  mb: btn => {
    const idx = +btn.dataset.v;
    const action = MB[idx]?.[2];
    if (!action || action() !== false) {
      X();
    }
  },

  // Interaksi klik rating bintang
  star: btn => {
    const val = +btn.dataset.v;
    const ratingInput = document.querySelector('input[name="rating"]');
    if (ratingInput) ratingInput.value = val;

    $$('#stars .star').forEach((b, i) => {
      b.classList.toggle('on', i < val);
    });
  },

  // Konfirmasi reservasi (Admin hanya bisa pilih salah satu: konfirmasi atau tolak)
  conf: btnOrId => {
    const id = typeof btnOrId === 'string' ? btnOrId : (btnOrId.dataset?.v || btnOrId.value || btnOrId);
    setResStatus(id, 'Terkonfirmasi');

    // Sinkronisasi live di halaman dashboard jika aktif
    if (typeof window.syncDashboardCounters === 'function') {
      window.syncDashboardCounters();
    }
    // Sinkronisasi live di halaman tabel reservasi jika aktif
    if (typeof window.syncReservationsTable === 'function') {
      window.syncReservationsTable();
    }

    if (typeof btnOrId !== 'string' && btnOrId?.closest) {
      const tr = btnOrId.closest('tr');
      if (tr) {
        tr.setAttribute('data-st', 'Terkonfirmasi');
        const stBadge = tr.querySelector('.status-cell') || tr.querySelector('.b.wn, .b.ok, .b.dg');
        if (stBadge) {
          stBadge.className = 'b ok';
          stBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block"><polyline points="20 6 9 17 4 12"/></svg> Terkonfirmasi`;
        }
      }
      const containerRow = btnOrId.parentElement;
      if (containerRow && !tr) {
        containerRow.innerHTML = `<span class="b ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block"><polyline points="20 6 9 17 4 12"/></svg> Terkonfirmasi</span>`;
      }
    }
    toast(`Reservasi ${id} berhasil disetujui & dikonfirmasi`, 'ok');
  },

  // Tolak reservasi (Admin hanya bisa pilih salah satu: konfirmasi atau tolak)
  rej: btnOrId => {
    const id = typeof btnOrId === 'string' ? btnOrId : (btnOrId.dataset?.v || btnOrId.value || btnOrId);
    M('Tolak Reservasi?', `<p style="margin:8px 0;line-height:1.5;color:var(--tx2)">Apakah Anda yakin ingin menolak reservasi <b>${esc(id)}</b>?</p>`, [
      ['Batal', 'ghost'],
      ['Tolak Reservasi', 'dg', () => {
        setResStatus(id, 'Ditolak');

        if (typeof window.syncDashboardCounters === 'function') {
          window.syncDashboardCounters();
        }
        if (typeof window.syncReservationsTable === 'function') {
          window.syncReservationsTable();
        }

        if (typeof btnOrId !== 'string' && btnOrId?.closest) {
          const tr = btnOrId.closest('tr');
          if (tr) {
            tr.setAttribute('data-st', 'Ditolak');
            const stBadge = tr.querySelector('.status-cell') || tr.querySelector('.b.wn, .b.ok, .b.dg');
            if (stBadge) {
              stBadge.className = 'b dg';
              stBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ditolak`;
            }
          }
          const containerRow = btnOrId.parentElement;
          if (containerRow && !tr) {
            containerRow.innerHTML = `<span class="b dg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ditolak</span>`;
          }
        }
        toast(`Reservasi ${id} telah ditolak`, 'wn');
      }]
    ]);
  },

  // Detail reservasi
  det: btnOrId => {
    const id = typeof btnOrId === 'string' ? btnOrId : (btnOrId.dataset?.v || btnOrId.value || btnOrId);
    const item = RES_DETAILS[id] || { name: 'Pelanggan', wa: '081200000000', svc: 'Layanan Petsaga', schedule: 'Hari ini', qty: '1', price: 'Rp75.000', note: '—' };
    const currentStatus = (window.getResStatuses ? window.getResStatuses()[id] : null) || 'Terkonfirmasi';
    const stBadgeClass = currentStatus === 'Terkonfirmasi' ? 'ok' : (currentStatus === 'Ditolak' ? 'dg' : 'wn');

    M(`Detail Reservasi — ${esc(id)}`, `
      <div style="font-size:0.92rem;line-height:1.7;margin:8px 0">
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">ID Reservasi:</span>
          <b>${esc(id)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Nama Pelanggan:</span>
          <b>${esc(item.name)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Nomor WhatsApp:</span>
          <b>${esc(item.wa)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Layanan:</span>
          <span class="b cafe">${esc(item.svc)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Kapasitas / Qty:</span>
          <span>${esc(item.qty)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Jadwal:</span>
          <span>${esc(item.schedule)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Total Biaya Pemesanan:</span>
          <b style="color:var(--brand-teal);font-size:1.05rem">${esc(item.price)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)">
          <span style="color:var(--tx2);font-weight:600">Catatan Khusus:</span>
          <span class="mut">${esc(item.note)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;margin-top:4px">
          <span style="color:var(--tx2);font-weight:600">Status Saat Ini:</span>
          <span class="b ${stBadgeClass}">${esc(currentStatus)}</span>
        </div>
      </div>
    `, [
      ['Tutup', 'ghost']
    ]);
  },

  // Kontrol kuota slot Cat Cafe (+ / -)
  cap: btn => {
    const [time, diff] = btn.dataset.v.split('|');
    const targetSpan = $(`#cap-text-${time.replace(':', '')}`) || btn.parentElement.querySelector('span');
    if (targetSpan) {
      const match = targetSpan.textContent.match(/(\d+)\/(\d+)/);
      if (match) {
        let current = +match[1];
        let total = +match[2] + +diff;
        if (total < Math.max(1, current) || total > 20) {
          return toast('Kuota tidak boleh kurang dari jumlah yang terisi', 'wn');
        }
        targetSpan.textContent = `${current}/${total} terisi`;
        toast(`Kapasitas slot ${time} diubah menjadi ${total}`, 'in');
      }
    }
  },

  // Perpanjang membership
  renew: () => {
    window.location.href = 'bayar-membership.html';
  },

  // Kirim notifikasi WhatsApp resmi
  wa: btn => {
    const val = btn.dataset.v || '';
    const [id, type] = val.split('|');
    M('Kirim Notifikasi WhatsApp', `
      <p style="margin:0 0 10px;color:var(--tx2);font-size:0.92rem">Pesan otomatis telah disiapkan untuk dikirimkan langsung ke nomor WhatsApp pelanggan:</p>
      <div class="b in" style="white-space:normal;padding:14px;margin:8px 0;line-height:1.6;font-size:0.92rem;text-align:left">
        "Halo Kak, kami dari Petsaga merindukan kunjungan Anda dan anabul kesayangan! Dapatkan penawaran perawatan spesial minggu ini bersama tim groomer kami."
      </div>
      <p class="mut" style="font-size:0.8rem;margin-top:10px">Template pesan sesuai standar komunikasi resmi Petsaga.</p>
    `, [
      ['Batal', 'ghost'],
      ['Kirim WhatsApp Sekarang', 'ok', () => {
        btn.textContent = '✓ Terkirim';
        btn.className = 'b ok';
        btn.disabled = true;
        toast('Notifikasi WhatsApp berhasil dikirim ke pelanggan', 'ok');
      }]
    ]);
  },

  // Balas ulasan
  reply: btn => {
    const id = btn.dataset.v;
    const card = btn.closest('.card') || $(`#card-${id}`);
    const customerName = card?.querySelector('b')?.textContent || 'Pelanggan';

    M(`Balas Ulasan — ${esc(customerName)}`, `
      <div class="fld">
        <label for="reply-text">Tulis balasan resmi Petsaga untuk ${esc(customerName)}</label>
        <textarea id="reply-text" rows="4" placeholder="Halo ${esc(customerName)}, terima kasih banyak atas masukannya..."></textarea>
      </div>
    `, [
      ['Batal', 'ghost'],
      ['Kirim Balasan', 'cta', () => {
        const txt = $('#reply-text')?.value.trim();
        if (!txt || txt.length < 5) {
          toast('Tulis balasan minimal 5 karakter', 'dg');
          return false;
        }

        if (card) {
          // Update status data attribute for filter
          card.setAttribute('data-status', 'replied');

          // Append or update admin-reply-box
          let replyBox = card.querySelector('.admin-reply-box');
          if (!replyBox) {
            replyBox = document.createElement('div');
            replyBox.className = 'admin-reply-box';
            replyBox.style.marginTop = '12px';
            card.appendChild(replyBox);
          }
          replyBox.innerHTML = `
            <small style="font-weight:700;color:var(--brand-teal);display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <svg style="width:14px;height:14px;display:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              Balasan Resmi Tim Petsaga
            </small>
            <p style="margin:0;font-size:0.92rem;color:var(--tx)">${esc(txt)}</p>
          `;

          // Update status badge
          const statusSpan = card.querySelector(`#st-${id}`) || card.querySelector('.row small span.b');
          if (statusSpan) {
            statusSpan.className = 'b ok';
            statusSpan.textContent = 'Sudah dibalas';
          }

          // Replace buttons with final badge
          const actionRow = card.querySelector(`#act-${id}`) || card.querySelector('.row:last-of-type');
          if (actionRow) {
            const btnGroup = actionRow.querySelector('.row');
            if (btnGroup) {
              btnGroup.innerHTML = `
                <span class="b ok" style="display:flex;align-items:center;gap:4px">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>
                  Sudah Dibalas
                </span>
              `;
            }
          }

          // Refresh counts and filter
          if (typeof window.refreshReviewCounts === 'function') {
            window.refreshReviewCounts();
            const activeFilter = document.querySelector('.filter-btn.on')?.getAttribute('data-filter');
            if (activeFilter === 'unreplied') {
              card.style.display = 'none';
            }
          }
        }

        toast('Balasan resmi berhasil dikirim & ditampilkan!', 'ok');
      }]
    ]);
  },

  // Tandai ulasan selesai
  done: btn => {
    const id = btn.dataset.v;
    const card = btn.closest('.card') || $(`#card-${id}`);
    if (card) {
      card.setAttribute('data-status', 'replied');
      const statusSpan = card.querySelector(`#st-${id}`) || card.querySelector('.row small span.b');
      if (statusSpan) {
        statusSpan.className = 'b ok';
        statusSpan.textContent = 'Selesai ditangani';
      }
      const actionGroup = btn.parentElement;
      if (actionGroup) {
        actionGroup.innerHTML = `
          <span class="b ok" style="display:flex;align-items:center;gap:4px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>
            Selesai Ditangani
          </span>
        `;
      }
      if (typeof window.refreshReviewCounts === 'function') {
        window.refreshReviewCounts();
        const activeFilter = document.querySelector('.filter-btn.on')?.getAttribute('data-filter');
        if (activeFilter === 'unreplied') {
          card.style.display = 'none';
        }
      }
    }
    toast('Ulasan ditandai selesai ditangani', 'ok');
  }
};

/**
 * 4. FORM SUBMIT MICRO-INTERACTIONS
 */
document.addEventListener('submit', e => {
  const form = e.target;
  if (!form) return;
  e.preventDefault();

  if (form.id === 'fCafe') {
    toast('Reservasi Cat Cafe terkirim! Menunggu konfirmasi admin.', 'ok');
  } else if (form.id === 'fGroom') {
    toast('Booking Grooming terkirim! Menunggu konfirmasi admin.', 'ok');
  } else if (form.id === 'fPet') {
    const name = form.elements.n?.value.trim() || 'Hewan';
    let petType = form.elements.t?.value || 'Hewan';
    if (petType === 'Lainnya') {
      const otherVal = form.elements.otherType?.value.trim();
      if (otherVal) petType = otherVal;
    }
    const weight = form.elements.w?.value ? `${form.elements.w.value} kg` : '4 kg';
    const fur = form.elements.fur?.value || 'Short Hair';
    toast(`Profil ${name} (${petType}) berhasil ditambahkan!`, 'ok');

    // Dynamically append new card to #list if on hewan.html
    const list = $('#list');
    if (list) {
      const newCard = document.createElement('div');
      newCard.className = 'card interactive';
      newCard.style.cssText = 'border-left:5px solid var(--brand-gold);border-radius:18px;margin-top:14px';
      newCard.innerHTML = `
        <div class="row" style="justify-content:space-between;margin-bottom:10px">
          <div class="row" style="gap:12px">
            <div class="card-icon" style="background:#FFF7ED;color:var(--brand-gold);border:1px solid #FED7AA;width:40px;height:40px">
              <svg style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c-5 0-8 3-8 8 0 4 3 7 8 7s8-3 8-7c0-5-3-8-8-8Z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M11 16c.6.6 1.4.6 2 0"/></svg>
            </div>
            <div>
              <h3 style="margin:0;color:var(--brand-teal)">${esc(name)}</h3>
              <small class="mut">${esc(petType)} · ${esc(form.elements.a?.value || '1 tahun')} · ${esc(weight)} (${esc(fur)})</small>
            </div>
          </div>
          <span class="b ok">
            <svg style="width:14px;height:14px;display:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ${esc(form.elements.v?.value || 'Lengkap')}
          </span>
        </div>
        <p style="margin-top:12px"><b>Alergi:</b> <span class="mut">${esc(form.elements.al?.value || 'Tidak ada')}</span></p>
        <p><b>Karakter:</b> ${esc(form.elements.tp?.value || 'Sehat dan lincah')}</p>
      `;
      list.appendChild(newCard);
    }
    form.reset();
    const fldOther = $('#fldOtherPet');
    if (fldOther) fldOther.style.display = 'none';
  } else if (form.id === 'fFb') {
    toast('Terima kasih atas ulasan & feedback Anda!', 'ok');
    form.reset();
    $$('#stars .star').forEach(b => b.classList.remove('on'));
  }
});

/**
 * 5. EVENT LISTENERS GLOBAL
 */
document.addEventListener('click', e => {
  const target = e.target.closest('[data-action], [data-a]');
  if (target) {
    const actionName = target.dataset.action || target.dataset.a;
    if (Actions[actionName]) {
      Actions[actionName](target);
    }
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') X();
});

const modalElem = $('#modal');
if (modalElem) {
  modalElem.addEventListener('click', e => {
    if (e.target.id === 'modal') X();
  });
}
