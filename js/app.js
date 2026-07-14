// ===================================================
// PRAYER TIMES & HIJRI DATE — app.js
// ===================================================

const DEFAULT_CITY = 'Srinagar';
const DEFAULT_COUNTRY = 'India';
const DEFAULT_METHOD = 1; // UISK (Hanafi - South Asia)
const DEFAULT_CURRENCY = 'INR';
const DEFAULT_MADHAB = 'hanafi';

let appState = {
  prayerTimes: null,
  hijriDate: null,
  goldPriceUSD: null,
  silverPriceUSD: null,
  madhab: DEFAULT_MADHAB,
  currency: DEFAULT_CURRENCY,
  INR_per_USD: 83.5 // fallback
};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackgroundCanvas();
  startWorldClock();
  fetchPrayerTimes();
  fetchHijriDate();
  loadHistoryTimeline();
  initZakatCalculator();
  initInheritanceCalculator();
  initQurbaniSection();
  initCalendar();
  initOrrery();
  fetchMarketData();
  initPillarsSection();
  initAsmaUlHusna();
  initScrollAnimations();
  startCountdown();
});

// ---- NAVIGATION ----
function initNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

// ---- BACKGROUND STARS ----
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.alpha = 0.3 + 0.5 * Math.sin(t * star.speed + star.phase);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${star.alpha})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

// ---- WORLD CLOCK ----
const WORLD_CITIES = [
  { name: 'Mecca', tz: 'Asia/Riyadh', flag: '🕋' },
  { name: 'Madinah', tz: 'Asia/Riyadh', flag: '🕌' },
  { name: 'Jerusalem', tz: 'Asia/Jerusalem', flag: '🇵🇸' },
  { name: 'Istanbul', tz: 'Europe/Istanbul', flag: '🇹🇷' },
  { name: 'Srinagar', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Islamabad', tz: 'Asia/Karachi', flag: '🇵🇰' },
  { name: 'Cairo', tz: 'Africa/Cairo', flag: '🇪🇬' },
  { name: 'London', tz: 'Europe/London', flag: '🇬🇧' },
  { name: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
  { name: 'Kuala Lumpur', tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { name: 'Jakarta', tz: 'Asia/Jakarta', flag: '🇮🇩' },
  { name: 'Dhaka', tz: 'Asia/Dhaka', flag: '🇧🇩' }
];

function startWorldClock() {
  const container = document.getElementById('world-clocks');
  if (!container) return;

  function renderClocks() {
    const now = new Date();
    container.innerHTML = WORLD_CITIES.map(city => {
      const timeStr = now.toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-US', { timeZone: city.tz, weekday: 'short' });
      return `
        <div class="world-clock-item">
          <div class="wc-city">${city.flag} ${city.name}</div>
          <div class="wc-time">${timeStr}</div>
          <div class="wc-tz">${dateStr}</div>
        </div>
      `;
    }).join('');
  }

  renderClocks();
  setInterval(renderClocks, 1000);
}

// ---- PRAYER TIMES ----
async function fetchPrayerTimes() {
  const container = document.getElementById('prayer-times-strip');
  const cityLabel = document.getElementById('prayer-city');
  if (!container) return;

  // Show skeleton
  container.innerHTML = `<div class="text-muted" style="font-size:0.85rem;">Loading prayer times for ${DEFAULT_CITY}...</div>`;

  try {
    const today = new Date();
    const d = today.getDate(), m = today.getMonth() + 1, y = today.getFullYear();
    const url = `https://api.aladhan.com/v1/timingsByCity/${d}-${m}-${y}?city=${DEFAULT_CITY}&country=${DEFAULT_COUNTRY}&method=${DEFAULT_METHOD}&school=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code === 200) {
      const t = data.data.timings;
      appState.prayerTimes = t;

      const prayers = [
        { name: 'Fajr', time: t.Fajr },
        { name: 'Sunrise', time: t.Sunrise },
        { name: 'Dhuhr', time: t.Dhuhr },
        { name: 'Asr', time: t.Asr },
        { name: 'Maghrib', time: t.Maghrib },
        { name: 'Isha', time: t.Isha }
      ];

      const nextPrayer = getNextPrayer(prayers);

      container.innerHTML = prayers.map(p => `
        <div class="prayer-time ${p.name === nextPrayer?.name ? 'next-prayer' : ''}">
          <span class="p-name">${p.name}</span>
          <span class="p-time">${formatPrayerTime(p.time)}</span>
          ${p.name === nextPrayer?.name ? '<span style="font-size:0.6rem;color:var(--gold);">NEXT ▲</span>' : ''}
        </div>
      `).join('');

      if (cityLabel) cityLabel.textContent = `${DEFAULT_CITY}, Kashmir, India`;

      // Store for countdown
      appState.nextPrayer = nextPrayer;
    }
  } catch (err) {
    container.innerHTML = `<div class="alert alert-warning">Prayer times temporarily unavailable. Please check your internet connection.</div>`;
    console.error('Prayer times error:', err);
  }
}

function formatPrayerTime(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getNextPrayer(prayers) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    if (prayer.name === 'Sunrise') continue;
    const [h, m] = prayer.time.split(':').map(Number);
    if (h * 60 + m > nowMins) return prayer;
  }
  return prayers[0]; // Tomorrow's Fajr
}

function startCountdown() {
  function updateCountdown() {
    const el = document.getElementById('next-prayer-countdown');
    if (!el || !appState.nextPrayer) return;

    const now = new Date();
    const [h, m] = appState.nextPrayer.time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    let diff = target - now;
    if (diff < 0) diff += 86400000;

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    el.innerHTML = `Next prayer <span>${appState.nextPrayer.name}</span> in <span>${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</span>`;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ---- HIJRI DATE ----
async function fetchHijriDate() {
  try {
    const today = new Date();
    const d = today.getDate(), m = today.getMonth() + 1, y = today.getFullYear();
    const url = `https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code === 200) {
      const h = data.data.hijri;
      appState.hijriDate = h;

      const el = document.getElementById('hijri-date');
      if (el) {
        el.textContent = `${h.day} ${h.month.en} ${h.year} AH`;
      }

      const arEl = document.getElementById('hijri-date-arabic');
      if (arEl) {
        arEl.textContent = `${h.day} ${h.month.ar} ${h.year}`;
      }
    }
  } catch (err) {
    const el = document.getElementById('hijri-date');
    if (el) el.textContent = 'Hijri date unavailable';
  }
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const animEls = document.querySelectorAll('.section-animate, .timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => observer.observe(el));
}

// ---- HISTORY TIMELINE ----
async function loadHistoryTimeline() {
  const container = document.getElementById('history-timeline');
  if (!container) return;

  try {
    const res = await fetch('data/history.json');
    const data = await res.json();

    container.innerHTML = data.map((item, i) => `
      <div class="timeline-item" style="transition-delay:${i * 0.1}s">
        <div class="timeline-dot" onclick="toggleTimeline(${i})">${item.icon}</div>
        <div class="timeline-card" onclick="toggleTimeline(${i})">
          <div class="timeline-header">
            <div>
              <div class="timeline-era">${item.era}</div>
              <div class="timeline-summary">${item.summary}</div>
            </div>
            <div class="timeline-period">${item.period}</div>
          </div>
          <div class="timeline-details" id="timeline-${i}">
            <p>${item.details}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
              <div>
                <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);margin-bottom:0.5rem">Key Figures</div>
                <ul class="timeline-list">
                  ${item.keyFigures.map(f => `<li>👤 ${f}</li>`).join('')}
                </ul>
              </div>
              <div>
                <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);margin-bottom:0.5rem">Key Events</div>
                <ul class="timeline-list">
                  ${item.keyEvents.map(e => `<li>📌 ${e}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  } catch(e) {
    container.innerHTML = '<div class="alert alert-warning">History data could not be loaded.</div>';
  }
}

window.toggleTimeline = function(i) {
  const el = document.getElementById(`timeline-${i}`);
  if (el) el.classList.toggle('open');
};

// ---- ZAKAT CALCULATOR ----
function initZakatCalculator() {
  const form = document.getElementById('zakat-form');
  if (!form) return;

  // Madhab selector
  const madhabSelect = document.getElementById('madhab-select');
  if (madhabSelect) {
    madhabSelect.addEventListener('change', (e) => {
      appState.madhab = e.target.value;
      calculateZakat();
    });
  }

  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach(input => input.addEventListener('input', calculateZakat));

  calculateZakat();
}

// Nisab values in grams
const NISAB_GOLD_G = 87.48;  // 7.5 tola
const NISAB_SILVER_G = 612.36; // 52.5 tola
const GOLD_GRAM_INR = 6500;   // fallback ~INR per gram
const SILVER_GRAM_INR = 82;   // fallback

function getNisabINR(madhab) {
  const goldPrice = appState.goldPriceINR || GOLD_GRAM_INR;
  const silverPrice = appState.silverPriceINR || SILVER_GRAM_INR;

  // Hanafi uses LOWER of gold/silver (usually silver)
  // Shafi/Maliki/Hanbali use gold nisab
  const goldNisab = NISAB_GOLD_G * goldPrice;
  const silverNisab = NISAB_SILVER_G * silverPrice;

  if (madhab === 'hanafi') {
    return { value: silverNisab, type: 'Silver (52.5 tola)', goldNisab, silverNisab };
  } else {
    return { value: goldNisab, type: 'Gold (7.5 tola)', goldNisab, silverNisab };
  }
}

function calculateZakat() {
  const get = id => parseFloat(document.getElementById(id)?.value || 0);

  const cash = get('zakat-cash');
  const gold = get('zakat-gold-g') * (appState.goldPriceINR || GOLD_GRAM_INR);
  const silver = get('zakat-silver-g') * (appState.silverPriceINR || SILVER_GRAM_INR);
  const business = get('zakat-business');
  const savings = get('zakat-savings');
  const livestock = get('zakat-livestock');

  const totalAssets = cash + gold + silver + business + savings + livestock;
  const nisabData = getNisabINR(appState.madhab);
  const nisabValue = nisabData.value;
  const zakatDue = totalAssets >= nisabValue;
  const zakatAmount = zakatDue ? totalAssets * 0.025 : 0;

  // Update UI
  const dueMsgEl = document.getElementById('zakat-due-msg');
  const amountEl = document.getElementById('zakat-amount');
  const nisabEl = document.getElementById('nisab-display');

  if (nisabEl) {
    nisabEl.innerHTML = `
      <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.3rem">Nisab (${nisabData.type})</div>
      <div class="nisab-value" style="color:${zakatDue ? 'var(--red)' : 'var(--green-light)'}">${formatINR(nisabValue)}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">
        Gold Nisab: ${formatINR(nisabData.goldNisab)} | Silver Nisab: ${formatINR(nisabData.silverNisab)}
      </div>
    `;
  }

  if (dueMsgEl) {
    if (totalAssets === 0) {
      dueMsgEl.innerHTML = `<div class="alert alert-info">Enter your asset values above to calculate Zakat.</div>`;
    } else if (zakatDue) {
      dueMsgEl.innerHTML = `<div class="alert alert-warning">⚠️ Your total assets <strong>${formatINR(totalAssets)}</strong> exceed the Nisab. <strong>Zakat is obligatory.</strong></div>`;
    } else {
      dueMsgEl.innerHTML = `<div class="alert alert-success">✅ Your total assets <strong>${formatINR(totalAssets)}</strong> are below the Nisab. Zakat is not yet obligatory.</div>`;
    }
  }

  if (amountEl) {
    amountEl.textContent = zakatDue ? formatINR(zakatAmount) : '₹0';
  }

  // Update doughnut chart
  updateZakatChart({ cash, gold, silver, business, savings, livestock });
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

let zakatChart = null;
function updateZakatChart(data) {
  const ctx = document.getElementById('zakat-chart');
  if (!ctx) return;

  const labels = ['Cash', 'Gold', 'Silver', 'Business', 'Savings', 'Livestock'];
  const values = [data.cash, data.gold, data.silver, data.business, data.savings, data.livestock];
  const colors = ['#c9a84c', '#e8c96a', '#a8a8a8', '#3498db', '#2ecc71', '#e67e22'];

  if (zakatChart) {
    zakatChart.data.datasets[0].data = values;
    zakatChart.update();
    return;
  }

  if (window.Chart) {
    zakatChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderColor: 'rgba(8,14,26,0.5)', borderWidth: 2 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a8b8cc', font: { family: 'Inter', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${formatINR(ctx.raw)}`
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

// ---- INHERITANCE CALCULATOR ----
function initInheritanceCalculator() {
  const btn = document.getElementById('calc-inheritance');
  if (btn) btn.addEventListener('click', calculateInheritance);
  const totalInput = document.getElementById('estate-total');
  if (totalInput) totalInput.addEventListener('input', calculateInheritance);
}

function calculateInheritance() {
  const total = parseFloat(document.getElementById('estate-total')?.value || 0);
  const madhab = document.getElementById('inheritance-madhab')?.value || 'hanafi';

  const heirs = {
    husband: parseInt(document.getElementById('h-husband')?.value || 0),
    wife: parseInt(document.getElementById('h-wife')?.value || 0),
    son: parseInt(document.getElementById('h-son')?.value || 0),
    daughter: parseInt(document.getElementById('h-daughter')?.value || 0),
    father: parseInt(document.getElementById('h-father')?.value || 0) > 0 ? 1 : 0,
    mother: parseInt(document.getElementById('h-mother')?.value || 0) > 0 ? 1 : 0,
    paternal_grandfather: parseInt(document.getElementById('h-pgf')?.value || 0) > 0 ? 1 : 0,
    maternal_grandmother: parseInt(document.getElementById('h-mgm')?.value || 0) > 0 ? 1 : 0,
    full_brother: parseInt(document.getElementById('h-fbrother')?.value || 0),
    full_sister: parseInt(document.getElementById('h-fsister')?.value || 0),
  };

  if (total <= 0) {
    document.getElementById('inheritance-result').innerHTML = '<div class="alert alert-info">Enter estate value and heirs to calculate.</div>';
    return;
  }

  const shares = computeInheritance(heirs, total, madhab);
  displayInheritanceResult(shares, total);
}

function computeInheritance(heirs, total, madhab) {
  let shares = [];

  // Basic flags
  const hasSon = heirs.son > 0;
  const hasDaughter = heirs.daughter > 0;
  const hasChildren = hasSon || hasDaughter;

  // Parents existence
  const hasFather = heirs.father > 0;
  const hasMother = heirs.mother > 0;

  // Siblings count
  const totalSiblings = heirs.full_brother + heirs.full_sister;

  // Map of fixed fard heirs
  let fardHeirs = {};

  // 1. Spouse Share (Surah An-Nisa 4:12)
  if (heirs.husband > 0) {
    const fraction = hasChildren ? 1/4 : 1/2;
    fardHeirs['Husband'] = {
      fraction: fraction,
      count: 1,
      basis: hasChildren ? '1/4 (because deceased left children)' : '1/2 (because deceased left no children)'
    };
  }
  if (heirs.wife > 0) {
    const fraction = hasChildren ? 1/8 : 1/4;
    fardHeirs['Wife/Wives'] = {
      fraction: fraction, // split among wives
      count: heirs.wife,
      basis: hasChildren ? '1/8 (because deceased left children)' : '1/4 (because deceased left no children)'
    };
  }

  // 2. Mother's Share (Surah An-Nisa 4:11)
  if (hasMother) {
    let motherFraction = 1/3;
    let basis = '1/3 (because deceased left no children and < 2 siblings)';

    if (hasChildren || totalSiblings >= 2) {
      motherFraction = 1/6;
      basis = hasChildren ? '1/6 (because deceased left children)' : '1/6 (because deceased left 2 or more siblings)';
    } else if (hasFather && (heirs.husband > 0 || heirs.wife > 0)) {
      // Umariyyat / Gharrawayn Case (Father + Mother + Spouse)
      // Mother receives 1/3 of the residue after spouse's share
      if (heirs.husband > 0) {
        motherFraction = 1/6; // 1/3 of (1 - 1/2) = 1/6
        basis = '1/6 (Umariyyat: 1/3 of remainder after Husband\'s share)';
      } else if (heirs.wife > 0) {
        motherFraction = 1/4; // 1/3 of (1 - 1/4) = 1/4
        basis = '1/4 (Umariyyat: 1/3 of remainder after Wife\'s share)';
      }
    }

    fardHeirs['Mother'] = {
      fraction: motherFraction,
      count: 1,
      basis: basis
    };
  }

  // 3. Father's Fixed Share (Surah An-Nisa 4:11 - gets 1/6 only if children exist, otherwise acts as Asabah/residual)
  if (hasFather && hasChildren) {
    fardHeirs['Father'] = {
      fraction: 1/6,
      count: 1,
      basis: '1/6 (because deceased left children)'
    };
  }

  // 4. Daughters' Fixed Share (Surah An-Nisa 4:11 - only if there are no sons)
  if (hasDaughter && !hasSon) {
    const fraction = heirs.daughter === 1 ? 1/2 : 2/3;
    const basis = heirs.daughter === 1 ? '1/2 (single daughter, no sons)' : '2/3 (multiple daughters, no sons)';
    fardHeirs['Daughter(s)'] = {
      fraction: fraction,
      count: heirs.daughter,
      basis: basis
    };
  }

  // 5. Grandparents Fallbacks (if parents are absent)
  if (heirs.maternal_grandmother > 0 && !hasMother) {
    fardHeirs['Maternal Grandmother'] = {
      fraction: 1/6,
      count: 1,
      basis: '1/6 (because Mother is absent)'
    };
  }
  const hasGrandfather = heirs.paternal_grandfather > 0 && !hasFather;
  if (hasGrandfather && hasChildren) {
    fardHeirs['Paternal Grandfather'] = {
      fraction: 1/6,
      count: 1,
      basis: '1/6 (because Father is absent and children exist)'
    };
  }

  // 6. Sisters' Fixed Share (only if Kalalah: no children, no father, no grandfather, and no brothers)
  const isKalalah = !hasChildren && !hasFather && !hasGrandfather;
  if (isKalalah && heirs.full_sister > 0 && heirs.full_brother === 0) {
    const fraction = heirs.full_sister === 1 ? 1/2 : 2/3;
    const basis = heirs.full_sister === 1 ? '1/2 (single sister, Kalalah)' : '2/3 (multiple sisters, Kalalah)';
    fardHeirs['Full Sister(s)'] = {
      fraction: fraction,
      count: heirs.full_sister,
      basis: basis
    };
  }

  // Sum up all fixed (Fard) shares to check for Aul
  let sumFard = 0;
  for (let heirName in fardHeirs) {
    sumFard += fardHeirs[heirName].fraction;
  }

  // Aul (Reduction): Sum of shares exceeds 1.0
  if (sumFard > 1.0001) {
    for (let heirName in fardHeirs) {
      const originalFraction = fardHeirs[heirName].fraction;
      fardHeirs[heirName].fraction = originalFraction / sumFard;
      fardHeirs[heirName].basis += ` (Reduced via Aul from ${formatFractionName(originalFraction)})`;

      shares.push({
        heir: heirName,
        count: fardHeirs[heirName].count,
        fraction: fardHeirs[heirName].fraction,
        basis: fardHeirs[heirName].basis
      });
    }
    return finalizeSharesList(shares, total);
  }

  // Standard case: Copy Fard shares to final results
  for (let heirName in fardHeirs) {
    shares.push({
      heir: heirName,
      count: fardHeirs[heirName].count,
      fraction: fardHeirs[heirName].fraction,
      basis: fardHeirs[heirName].basis
    });
  }

  // Residue fraction
  let remaining = 1.0 - sumFard;

  // Asabah (Residual Heirs) distribution
  if (remaining > 0.0001) {
    let asabahShares = [];

    // Priority 1: Sons & Daughters (as Asabah Bil-Ghayr)
    if (hasSon) {
      const totalParts = heirs.son * 2 + heirs.daughter;
      asabahShares.push({
        heir: 'Son(s)',
        count: heirs.son,
        fraction: (heirs.son * 2 / totalParts) * remaining,
        basis: `Residual (Asabah Bil-Ghayr: 2:1 ratio with daughters)`
      });
      if (hasDaughter) {
        asabahShares.push({
          heir: 'Daughter(s)',
          count: heirs.daughter,
          fraction: (heirs.daughter / totalParts) * remaining,
          basis: `Residual (Asabah Bil-Ghayr: 1:2 ratio with sons)`
        });
      }
      remaining = 0;
    }
    // Priority 2: Father (gets entire residue as Asabah if no male descendants)
    else if (hasFather) {
      const fatherIdx = shares.findIndex(s => s.heir === 'Father');
      if (fatherIdx !== -1) {
        shares[fatherIdx].fraction += remaining;
        shares[fatherIdx].basis = `1/6 fixed + Residual (Asabah — no sons) — total: ${formatFractionName(shares[fatherIdx].fraction)}`;
      } else {
        shares.push({
          heir: 'Father',
          count: 1,
          fraction: remaining,
          basis: 'Residual (Asabah — no children)'
        });
      }
      remaining = 0;
    }
    // Priority 3: Paternal Grandfather (in absence of father)
    else if (hasGrandfather) {
      const gfIdx = shares.findIndex(s => s.heir === 'Paternal Grandfather');
      if (gfIdx !== -1) {
        shares[gfIdx].fraction += remaining;
        shares[gfIdx].basis = `1/6 fixed + Residual (Asabah)`;
      } else {
        shares.push({
          heir: 'Paternal Grandfather',
          count: 1,
          fraction: remaining,
          basis: 'Residual (Asabah)'
        });
      }
      remaining = 0;
    }
    // Priority 4: Siblings (Full Brothers / Full Sisters)
    else if (isKalalah && (heirs.full_brother > 0 || heirs.full_sister > 0)) {
      if (heirs.full_brother > 0) {
        const totalParts = heirs.full_brother * 2 + heirs.full_sister;
        asabahShares.push({
          heir: 'Full Brother(s)',
          count: heirs.full_brother,
          fraction: (heirs.full_brother * 2 / totalParts) * remaining,
          basis: 'Residual (Asabah Bil-Ghayr: 2:1 ratio)'
        });
        if (heirs.full_sister > 0) {
          asabahShares.push({
            heir: 'Full Sister(s)',
            count: heirs.full_sister,
            fraction: (heirs.full_sister / totalParts) * remaining,
            basis: 'Residual (Asabah Bil-Ghayr: 1:2 ratio)'
          });
        }
        remaining = 0;
      } else {
        // Sisters act as Asabah Ma'al Ghayr if there are daughters (and no brothers/sons/father)
        if (hasDaughter) {
          asabahShares.push({
            heir: 'Full Sister(s)',
            count: heirs.full_sister,
            fraction: remaining,
            basis: 'Residual (Asabah Ma\'al Ghayr with daughters)'
          });
          remaining = 0;
        }
      }
    }

    if (asabahShares.length > 0) {
      shares.push(...asabahShares);
    }
  }

  // Radd (Return): If there is still residue and no Asabah heirs exist
  if (remaining > 0.0001) {
    // Radd is distributed proportionally among Fard heirs except Husband and Wife
    let raddHeirs = shares.filter(s => s.heir !== 'Husband' && s.heir !== 'Wife/Wives');
    if (raddHeirs.length > 0) {
      const eligibleSum = raddHeirs.reduce((sum, h) => sum + h.fraction, 0);
      shares.forEach(s => {
        if (s.heir !== 'Husband' && s.heir !== 'Wife/Wives') {
          const raddAmount = (s.fraction / eligibleSum) * remaining;
          s.fraction += raddAmount;
          s.basis += ` (+ Radd proportion)`;
        }
      });
      remaining = 0;
    } else {
      // In the absolute absence of other heirs, give remaining back to Spouse (modern/civil Faraid fallback)
      let spouseHeir = shares.find(s => s.heir === 'Husband' || s.heir === 'Wife/Wives');
      if (spouseHeir) {
        spouseHeir.fraction += remaining;
        spouseHeir.basis += ` (+ Radd residue)`;
        remaining = 0;
      }
    }
  }

  return finalizeSharesList(shares, total);
}

function formatFractionName(fraction) {
  const common = [
    { val: 1/2, name: '1/2' }, { val: 1/3, name: '1/3' }, { val: 2/3, name: '2/3' },
    { val: 1/4, name: '1/4' }, { val: 3/4, name: '3/4' }, { val: 1/6, name: '1/6' },
    { val: 5/6, name: '5/6' }, { val: 1/8, name: '1/8' }, { val: 3/8, name: '3/8' },
    { val: 7/8, name: '7/8' }, { val: 1/12, name: '1/12' }, { val: 5/12, name: '5/12' },
    { val: 7/12, name: '7/12' }, { val: 17/24, name: '17/24' }
  ];
  for (let item of common) {
    if (Math.abs(item.val - fraction) < 0.005) return item.name;
  }
  return `${(fraction * 100).toFixed(1)}%`;
}

function finalizeSharesList(shares, total) {
  const customOrder = ['Husband', 'Wife/Wives', 'Father', 'Mother', 'Son(s)', 'Daughter(s)', 'Maternal Grandmother', 'Paternal Grandfather', 'Full Brother(s)', 'Full Sister(s)'];
  shares.sort((a, b) => {
    let indexA = customOrder.indexOf(a.heir);
    let indexB = customOrder.indexOf(b.heir);
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  return shares.map(s => ({
    ...s,
    amount: s.fraction * total,
    perPerson: (s.fraction * total) / s.count
  }));
}

function displayInheritanceResult(shares, total) {
  const container = document.getElementById('inheritance-result');
  if (!container) return;

  if (shares.length === 0) {
    container.innerHTML = '<div class="alert alert-warning">No valid heirs entered. Please enter at least one heir.</div>';
    return;
  }

  const rows = shares.map(s => `
    <tr>
      <td><strong>${s.heir}</strong></td>
      <td style="text-align:center">${s.count}</td>
      <td style="color:var(--gold)">${s.basis}</td>
      <td style="color:var(--gold-light);font-family:'Outfit',sans-serif;font-weight:700">${formatINR(s.amount)}</td>
      <td style="color:var(--text-muted)">${formatINR(s.perPerson)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <table class="inheritance-result-table">
      <thead>
        <tr>
          <th>Heir</th><th>Count</th><th>Basis</th><th>Total Share</th><th>Per Person</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="alert alert-info mt-2" style="margin-top:1rem">
      📖 Based on Surah An-Nisa (4:11-12). Consult a qualified Islamic scholar for complex cases involving multiple heirs or debts.
    </div>
  `;

  // Update pie chart
  updateInheritanceChart(shares);
}

let inheritanceChart = null;
function updateInheritanceChart(shares) {
  const ctx = document.getElementById('inheritance-chart');
  if (!ctx || !window.Chart) return;

  const colors = ['#c9a84c','#2ecc71','#3498db','#e74c3c','#9b59b6','#e67e22','#1abc9c','#e8c96a'];

  if (inheritanceChart) { inheritanceChart.destroy(); }

  inheritanceChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: shares.map(s => `${s.heir} (${(s.fraction*100).toFixed(1)}%)`),
      datasets: [{ data: shares.map(s => s.fraction * 100), backgroundColor: colors.slice(0, shares.length), borderColor: '#080e1a', borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#a8b8cc', font: { family: 'Inter', size: 11 }, padding: 16 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw.toFixed(2)}%` } }
      }
    }
  });
}

// ---- QURBANI SECTION ----
function initQurbaniSection() {
  const btn = document.getElementById('calc-qurbani');
  if (btn) btn.addEventListener('click', calculateQurbani);
}

function calculateQurbani() {
  const assets = parseFloat(document.getElementById('qurbani-assets')?.value || 0);
  const nisabData = getNisabINR(appState.madhab);
  const obligatory = assets >= nisabData.value;
  const resultEl = document.getElementById('qurbani-result');
  if (!resultEl) return;

  if (obligatory) {
    resultEl.innerHTML = `
      <div class="alert alert-warning">
        🐑 <strong>Qurbani is Wajib (obligatory)</strong> on you. Your assets of <strong>${formatINR(assets)}</strong> exceed the Nisab of <strong>${formatINR(nisabData.value)}</strong>.
        <br><br>You must sacrifice at least 1 share. This can be 1 small animal (goat/sheep) or 1/7 of a large animal (cow/camel).
      </div>
    `;
  } else {
    resultEl.innerHTML = `
      <div class="alert alert-success">
        ✅ Qurbani is <strong>Nafl (voluntary)</strong> for you. Your assets of <strong>${formatINR(assets)}</strong> are below the Nisab. You are still encouraged to sacrifice if able.
      </div>
    `;
  }
}

// ---- CALENDAR & MOON ----
function initCalendar() {
  renderLunarCalendar();
  renderMoonPhase();
  loadUpcomingEvents();
  initDateConverter();
}

function renderLunarCalendar() {
  const canvas = document.getElementById('moon-canvas');
  if (!canvas) return;
  drawMoon(canvas, getMoonPhase());
}

function getMoonPhase() {
  // Calculate moon phase (0-1, 0=new moon, 0.5=full moon)
  const now = new Date();
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.53058867;
  const elapsed = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  return (elapsed % lunarCycle) / lunarCycle;
}

function drawMoon(canvas, phase) {
  const size = 160;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const r = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Shadow background
  ctx.beginPath();
  ctx.arc(r, r, r - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();

  // Moon surface
  const gradient = ctx.createRadialGradient(r * 0.7, r * 0.6, 0, r, r, r);
  gradient.addColorStop(0, '#f5e6c8');
  gradient.addColorStop(0.7, '#d4b483');
  gradient.addColorStop(1, '#a0855a');
  ctx.beginPath();
  ctx.arc(r, r, r - 2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Shadow overlay (simulating moon phase)
  ctx.save();
  ctx.beginPath();
  ctx.arc(r, r, r - 2, -Math.PI / 2, Math.PI / 2);

  const shadowX = r - (r * 2 * Math.abs(0.5 - phase) * 2) * Math.sign(0.5 - phase);

  ctx.bezierCurveTo(shadowX, r - (r-2), shadowX, r + (r-2), r, r + (r-2));
  ctx.closePath();

  if (phase < 0.5) {
    ctx.fillStyle = 'rgba(8,14,26,0.92)';
  } else {
    ctx.fillStyle = 'rgba(8,14,26,0.0)';
  }
  ctx.fill();
  ctx.restore();

  // Glow
  ctx.shadowBlur = 30;
  ctx.shadowColor = 'rgba(245,230,200,0.3)';
  ctx.beginPath();
  ctx.arc(r, r, r - 2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(245,230,200,0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return '🌑 New Moon (Hilal)';
  if (phase < 0.22) return '🌒 Waxing Crescent';
  if (phase < 0.28) return '🌓 First Quarter';
  if (phase < 0.47) return '🌔 Waxing Gibbous';
  if (phase < 0.53) return '🌕 Full Moon (Badr)';
  if (phase < 0.72) return '🌖 Waning Gibbous';
  if (phase < 0.78) return '🌗 Last Quarter';
  if (phase < 0.97) return '🌘 Waning Crescent';
  return '🌑 New Moon';
}

function renderMoonPhase() {
  const phase = getMoonPhase();
  const nameEl = document.getElementById('moon-phase-name');
  if (nameEl) nameEl.textContent = getPhaseName(phase);
}

async function loadUpcomingEvents() {
  const container = document.getElementById('events-list');
  if (!container) return;

  try {
    const res = await fetch('data/events.json');
    const data = await res.json();

    // Get current Hijri date
    const hijriNow = appState.hijriDate;

    // For demo: show all recurring events with dummy countdowns
    container.innerHTML = data.recurring.slice(0, 8).map(ev => `
      <li class="event-item">
        <div class="event-countdown">${ev.hijriDay} ${getHijriMonthName(ev.hijriMonth)}</div>
        <div>
          <div class="event-name">${ev.name}</div>
          <div class="event-desc">${ev.description}</div>
        </div>
      </li>
    `).join('');
  } catch(e) {
    if (container) container.innerHTML = '<div class="alert alert-warning">Events unavailable.</div>';
  }
}

function getHijriMonthName(n) {
  const months = ['','Muharram','Safar','Rabi I','Rabi II','Jumada I','Jumada II','Rajab','Sha\'ban','Ramadan','Shawwal','Dhul Qa\'dah','Dhul Hijjah'];
  return months[n] || '';
}

function initDateConverter() {
  const btn = document.getElementById('convert-date');
  if (btn) btn.addEventListener('click', async () => {
    const dateInput = document.getElementById('greg-date')?.value;
    if (!dateInput) return;
    const [y, m, d] = dateInput.split('-');
    try {
      const res = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`);
      const data = await res.json();
      if (data.code === 200) {
        const h = data.data.hijri;
        document.getElementById('convert-result').textContent = `${h.day} ${h.month.en} ${h.year} AH (${h.month.ar})`;
      }
    } catch(e) {
      document.getElementById('convert-result').textContent = 'Conversion failed. Check internet connection.';
    }
  });
}

// ---- SOLAR SYSTEM ORRERY ----
function initOrrery() {
  const canvas = document.getElementById('orrery-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = Math.min(600, window.innerWidth - 40);
  canvas.width = W; canvas.height = W;
  const cx = W/2, cy = W/2;

  let t = 0;

  function drawOrrery() {
    ctx.clearRect(0, 0, W, W);

    // Background
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, W, W);

    // Grid circles
    [0.15, 0.3, 0.45].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * W/2, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(201,168,76,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Sun
    const sunR = W * 0.05;
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR);
    sunGrad.addColorStop(0, '#fff8e7');
    sunGrad.addColorStop(0.5, '#ffd700');
    sunGrad.addColorStop(1, '#ff8c00');
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI*2);
    ctx.fillStyle = sunGrad;
    ctx.shadowBlur = 40; ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sun label
    ctx.fillStyle = '#c9a84c';
    ctx.font = `${W*0.022}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText('☀️ Sun', cx, cy + sunR + W*0.025);

    // Earth orbit & position
    const earthOrbitR = W * 0.28;
    const earthAngle = t * 0.01;
    const ex = cx + earthOrbitR * Math.cos(earthAngle);
    const ey = cy + earthOrbitR * Math.sin(earthAngle);

    ctx.beginPath();
    ctx.arc(cx, cy, earthOrbitR, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(52,152,219,0.2)';
    ctx.lineWidth = 1; ctx.stroke();

    // Earth
    const earthR = W * 0.025;
    const earthGrad = ctx.createRadialGradient(ex-earthR*0.3, ey-earthR*0.3, 0, ex, ey, earthR);
    earthGrad.addColorStop(0, '#5dade2');
    earthGrad.addColorStop(0.6, '#2e86c1');
    earthGrad.addColorStop(1, '#1a5276');
    ctx.beginPath();
    ctx.arc(ex, ey, earthR, 0, Math.PI*2);
    ctx.fillStyle = earthGrad;
    ctx.fill();
    ctx.fillStyle = '#74b9e8';
    ctx.font = `${W*0.018}px Inter`;
    ctx.fillText('🌍 Earth', ex, ey + earthR + W*0.02);

    // Moon orbit & position
    const moonOrbitR = W * 0.08;
    const moonAngle = t * 0.13; // ~13x faster than Earth
    const mx = ex + moonOrbitR * Math.cos(moonAngle);
    const my = ey + moonOrbitR * Math.sin(moonAngle);

    ctx.beginPath();
    ctx.arc(ex, ey, moonOrbitR, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(245,230,200,0.15)';
    ctx.lineWidth = 0.5; ctx.stroke();

    // Moon phase angle relative to Sun
    const moonPhaseAngle = moonAngle - earthAngle;
    const moonPhase = ((moonPhaseAngle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2) / (Math.PI*2);

    // Draw moon
    const moonR = W * 0.015;
    ctx.beginPath();
    ctx.arc(mx, my, moonR, 0, Math.PI*2);
    ctx.fillStyle = '#d4c5a9';
    ctx.fill();

    // Crescent overlay
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, moonR, 0, Math.PI*2);
    ctx.clip();
    ctx.fillStyle = 'rgba(8,14,26,0.7)';
    ctx.beginPath();
    const shadowOffset = moonR * Math.cos(moonPhaseAngle) * 1.5;
    ctx.ellipse(mx + shadowOffset, my, moonR * Math.abs(Math.sin(moonPhaseAngle + 0.01)) + 0.5, moonR, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#d4c5a9';
    ctx.font = `${W*0.016}px Inter`;
    ctx.fillText('🌙 Moon', mx, my - moonR - W*0.01);

    // Info text
    ctx.fillStyle = 'rgba(201,168,76,0.6)';
    ctx.font = `${W*0.016}px Inter`;
    ctx.textAlign = 'left';
    ctx.fillText(`Moon phase: ${getPhaseName(moonPhase)}`, 10, W - 10);

    t++;
    requestAnimationFrame(drawOrrery);
  }

  drawOrrery();
}

// ---- MARKET DATA ----
async function fetchMarketData() {
  try {
    // Try metals.live free API
    const res = await fetch('https://api.metals.live/v1/spot/gold,silver');
    if (res.ok) {
      const data = await res.json();
      const goldUSD = data[0]?.price || null;
      const silverUSD = data[1]?.price || null;

      if (goldUSD) {
        appState.goldPriceUSD = goldUSD;
        appState.silverPriceUSD = silverUSD;

        // Convert to INR (approximate)
        const inrRate = await getINRRate();
        appState.goldPriceINR = (goldUSD / 31.1035) * inrRate; // per gram
        appState.silverPriceINR = (silverUSD / 31.1035) * inrRate;
        appState.INR_per_USD = inrRate;

        updateMarketUI(goldUSD, silverUSD, inrRate);
        return;
      }
    }
  } catch(e) {}

  // Fallback to hardcoded values
  const goldUSD = 3380;
  const silverUSD = 32.5;
  const inrRate = 83.5;
  appState.goldPriceINR = (goldUSD / 31.1035) * inrRate;
  appState.silverPriceINR = (silverUSD / 31.1035) * inrRate;
  updateMarketUI(goldUSD, silverUSD, inrRate, true);
}

async function getINRRate() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
    const data = await res.json();
    return data.rates?.INR || 83.5;
  } catch {
    return 83.5;
  }
}

function updateMarketUI(goldUSD, silverUSD, inrRate, isFallback = false) {
  const goldEl = document.getElementById('gold-price');
  const silverEl = document.getElementById('silver-price');
  const goldINREl = document.getElementById('gold-price-inr');
  const silverINREl = document.getElementById('silver-price-inr');

  if (goldEl) goldEl.textContent = `$${goldUSD.toFixed(2)}`;
  if (silverEl) silverEl.textContent = `$${silverUSD.toFixed(2)}`;

  const goldGramINR = (goldUSD / 31.1035) * inrRate;
  const silverGramINR = (silverUSD / 31.1035) * inrRate;

  if (goldINREl) goldINREl.textContent = `₹${goldGramINR.toFixed(0)}/g`;
  if (silverINREl) silverINREl.textContent = `₹${silverGramINR.toFixed(0)}/g`;

  // Nisab display
  const goldNisabINR = NISAB_GOLD_G * goldGramINR;
  const silverNisabINR = NISAB_SILVER_G * silverGramINR;

  const nisabEl = document.getElementById('market-nisab');
  if (nisabEl) {
    nisabEl.innerHTML = `
      <div class="nisab-row"><span class="nisab-row-label">🥇 Gold Nisab (87.48g / 7.5 tola)</span><span class="nisab-row-value">${formatINR(goldNisabINR)}</span></div>
      <div class="nisab-row"><span class="nisab-row-label">🥈 Silver Nisab (612.36g / 52.5 tola)</span><span class="nisab-row-value">${formatINR(silverNisabINR)}</span></div>
      <div class="nisab-row"><span class="nisab-row-label">💱 USD/INR Rate</span><span class="nisab-row-value">₹${inrRate.toFixed(2)}</span></div>
      ${isFallback ? '<div class="alert alert-info mt-2" style="margin-top:0.5rem;font-size:0.8rem">⚠️ Using estimated prices. Live prices require internet connection.</div>' : ''}
    `;
  }

  // Refresh Zakat calculator with new prices
  calculateZakat();
}

// ---- PILLARS SECTION ----
function initPillarsSection() {
  const tabs = document.querySelectorAll('.pillar-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.dataset.target;
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
    });
  });
}

// ---- ASMAUL HUSNA ----
async function initAsmaUlHusna() {
  const container = document.getElementById('names-grid');
  if (!container) return;

  try {
    const res = await fetch('data/asmaul-husna.json');
    const names = await res.json();

    window._allNames = names;
    renderNames(names);

    const searchInput = document.getElementById('names-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = names.filter(n =>
          n.meaning.toLowerCase().includes(q) ||
          n.transliteration.toLowerCase().includes(q) ||
          n.arabic.includes(q)
        );
        renderNames(filtered);
      });
    }
  } catch(e) {
    if (container) container.innerHTML = '<div class="alert alert-warning">Names data could not be loaded.</div>';
  }
}

function renderNames(names) {
  const container = document.getElementById('names-grid');
  if (!container) return;

  container.innerHTML = names.map(n => `
    <div class="name-card" onclick="openNameModal(${n.number})">
      <span class="name-number">${n.number}</span>
      <div class="name-arabic">${n.arabic}</div>
      <div class="name-transliteration">${n.transliteration}</div>
      <div class="name-meaning">${n.meaning}</div>
    </div>
  `).join('');
}

window.openNameModal = function(num) {
  const name = window._allNames?.find(n => n.number === num);
  if (!name) return;

  const modal = document.getElementById('name-modal');
  if (!modal) return;

  document.getElementById('modal-arabic').textContent = name.arabic;
  document.getElementById('modal-trans').textContent = name.transliteration;
  document.getElementById('modal-meaning').textContent = name.meaning;
  document.getElementById('modal-benefit').textContent = `💡 ${name.benefit}`;
  document.getElementById('modal-num').textContent = `#${name.number} of 99`;

  modal.classList.add('open');
};

window.closeNameModal = function() {
  document.getElementById('name-modal')?.classList.remove('open');
};
