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

/**
 * 3. INTERAKSI & AKSI TOMBOL
 */
const Actions = {
  // Tombol reset demo data
  reset: () => {
    toast('Data demo dikembalikan ke kondisi awal (simulasi)');
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
  conf: btn => {
    const id = btn.dataset.v;
    const tr = btn.closest('tr');
    if (tr) {
      const stBadge = tr.querySelector('.b.wn, .b.ok, .b.dg');
      if (stBadge) {
        stBadge.className = 'b ok';
        stBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block"><polyline points="20 6 9 17 4 12"/></svg> Terkonfirmasi`;
      }
      tr.setAttribute('data-st', 'Terkonfirmasi');
      const actionCell = tr.querySelector('td:last-child');
      if (actionCell) {
        actionCell.innerHTML = `<button class="btn sm in" data-action="det" data-v="${id}">Detail</button>`;
      }
    } else {
      const containerRow = btn.parentElement;
      if (containerRow) {
        containerRow.innerHTML = `<span class="b ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block"><polyline points="20 6 9 17 4 12"/></svg> Terkonfirmasi</span>`;
      }
    }
    toast(`Reservasi ${id} berhasil disetujui & dikonfirmasi`, 'ok');
  },

  // Tolak reservasi (Admin hanya bisa pilih salah satu: konfirmasi atau tolak)
  rej: btn => {
    const id = btn.dataset.v;
    M('Tolak Reservasi?', `<p>Apakah Anda yakin ingin menolak reservasi <b>${esc(id)}</b>?</p>`, [
      ['Batal', 'ghost'],
      ['Tolak Reservasi', 'dg', () => {
        const tr = btn.closest('tr');
        if (tr) {
          const stBadge = tr.querySelector('.b.wn, .b.ok, .b.dg');
          if (stBadge) {
            stBadge.className = 'b dg';
            stBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ditolak`;
          }
          tr.setAttribute('data-st', 'Ditolak');
          const actionCell = tr.querySelector('td:last-child');
          if (actionCell) {
            actionCell.innerHTML = `<span class="b dg">Ditolak</span>`;
          }
        } else {
          const containerRow = btn.parentElement;
          if (containerRow) {
            containerRow.innerHTML = `<span class="b dg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ditolak</span>`;
          }
        }
        toast(`Reservasi ${id} telah ditolak`, 'wn');
      }]
    ]);
  },

  // Detail reservasi
  det: btn => {
    const id = btn.dataset.v;
    M(`Detail Reservasi ${id}`, `
      <dl>
        <dt>ID Reservasi</dt><dd><b>${esc(id)}</b></dd>
        <dt>Pelanggan</dt><dd>Aulia Rahma</dd>
        <dt>WhatsApp</dt><dd>081200000001</dd>
        <dt>Layanan</dt><dd>Simulasi Layanan Petsaga</dd>
        <dt>Status</dt><dd><span class="b ok">Aktif</span></dd>
      </dl>
    `);
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

  // Simulasi pesan WhatsApp
  wa: btn => {
    const [id, type] = btn.dataset.v.split('|');
    M('Simulasi Kirim WhatsApp', `
      <p>Pesan otomatis siap dikirim ke nomor kontak pelanggan (simulasi).</p>
      <div class="b in" style="white-space:normal;padding:12px;margin:8px 0">
        "Halo, kami dari Petsaga merindukan kunjungan Anda! Dapatkan penawaran spesial minggu ini 🐾"
      </div>
      <p class="mut">Tidak ada pulsa atau pesan WhatsApp nyata yang dikirim.</p>
    `, [
      ['Tutup', 'ghost'],
      ['Tandai Terkirim', 'in', () => {
        btn.textContent = '✓ Dihubungi';
        btn.className = 'b ok';
        btn.disabled = true;
        toast('Status berhasil ditandai sudah dihubungi', 'ok');
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
              <small class="mut">${esc(petType)} · ${esc(form.elements.a?.value || '1 tahun')}</small>
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
