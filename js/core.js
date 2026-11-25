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

  // Konfirmasi reservasi
  conf: btn => {
    const row = btn.closest('tr') || btn.closest('.row');
    const badge = row?.querySelector('.b.wn');
    if (badge) {
      badge.className = 'b ok';
      badge.textContent = 'Terkonfirmasi';
    }
    btn.remove();
    toast(`Reservasi ${btn.dataset.v} berhasil dikonfirmasi`, 'ok');
  },

  // Tolak reservasi
  rej: btn => {
    M('Tolak reservasi?', `<p>Reservasi <b>${btn.dataset.v}</b> akan ditolak dan slot akan dilepas.</p>`, [
      ['Batal', 'ghost'],
      ['Tolak', 'dg', () => {
        const row = btn.closest('tr') || btn.closest('.row');
        const badge = row?.querySelector('.b.wn') || row?.querySelector('.b.ok');
        if (badge) {
          badge.className = 'b dg';
          badge.textContent = 'Ditolak';
        }
        btn.remove();
        toast('Reservasi telah ditolak', 'wn');
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
    M('Perpanjang Membership?', '<p>Sesi akan direset ke 10 dan masa berlaku diperpanjang 1 tahun (simulasi).</p>', [
      ['Batal', 'ghost'],
      ['Ya, perpanjang', 'cta', () => {
        toast('Membership berhasil diperpanjang 1 tahun (+50 poin)', 'ok');
      }]
    ]);
  },

  // Gunakan 1 sesi membership
  useSes: btn => {
    toast('1 sesi terpakai! +20 poin poin loyalitas berhasil ditambahkan.', 'ok');
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
    M(`Balas Ulasan (${id})`, `
      <div class="fld">
        <label for="reply-text">Tulis balasan untuk pelanggan</label>
        <textarea id="reply-text" rows="4" placeholder="Halo, terima kasih banyak atas ulasannya..."></textarea>
      </div>
    `, [
      ['Batal', 'ghost'],
      ['Kirim Balasan', 'cta', () => {
        const txt = $('#reply-text')?.value.trim();
        if (!txt || txt.length < 5) {
          toast('Balasan minimal 5 karakter', 'dg');
          return false;
        }
        btn.disabled = true;
        btn.textContent = 'Dibalas';
        toast('Balasan tersimpan (simulasi)', 'ok');
      }]
    ]);
  },

  // Tandai ulasan selesai
  done: btn => {
    btn.disabled = true;
    btn.textContent = '✓ Selesai';
    toast('Ulasan ditandai selesai', 'ok');
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
    toast(`Profil ${name} berhasil ditambahkan!`, 'ok');
    form.reset();
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
