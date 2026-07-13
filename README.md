# 🕌 AD-Deen ul-Qayyim — الدِّينُ الْقَيِّمُ

> *An open-source knowledge engine dedicated to Islamic history, theology, and philosophy. Connecting traditional scholarship with modern digital accessibility.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-green?style=flat-square)](https://build2run.github.io/AD-Deen-ul-Qayyim/)
[![No Backend](https://img.shields.io/badge/Backend-None%20Required-gold?style=flat-square)]()
[![Mobile Ready](https://img.shields.io/badge/Mobile-Responsive-blue?style=flat-square)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-Islamic%20Knowledge-teal?style=flat-square)]()

---

## ✨ Features

| Section | Description |
|---------|-------------|
| 🏠 **Hero** | Live prayer times (Srinagar), Hijri date, world city clocks |
| 📜 **History** | Interactive 1400-year Islamic history timeline |
| 💰 **Zakat** | Full Zakat calculator with live gold/silver prices (INR) |
| ⚖️ **Mirath** | Islamic inheritance calculator (Faraid) — all 4 Madhabs |
| 🐑 **Qurbani** | Eid ul-Adha sacrifice guide and eligibility calculator |
| 🌙 **Calendar** | Lunar calendar, moon phase, Hijri ↔ Gregorian converter |
| 🌍 **Orrery** | Animated solar system showing Earth–Moon–Sun positions |
| 📈 **Market** | Live gold/silver prices and Nisab values in INR |
| 🕋 **Pillars** | 5 Pillars of Islam + 6 Pillars of Iman with Quranic references |
| 📿 **99 Names** | All Asmaul Husna with Arabic, transliteration, meaning & benefit |

---

## 🚀 Deploy to GitHub Pages (Free Hosting)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new) and sign in as **Build2Run**
2. **Repository name**: `AD-Deen-ul-Qayyim`
3. **Description**: *An open-source knowledge engine dedicated to Islamic history, theology, and philosophy. Connecting traditional scholarship with modern digital accessibility.*
4. Set to **Public**
5. ❌ **Do NOT** check "Initialize with README" (we already have one)
6. Click **"Create repository"**

### Step 2: Push the Code (run once in your terminal)
```bash
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select **main branch** → **/ (root)**
3. Click **Save**
4. Wait 2–3 minutes, then visit:

🌐 **https://build2run.github.io/AD-Deen-ul-Qayyim/**

🎉 **Your site is now live for free, forever!**

---

## 📁 Project Structure

```
islamic-hub/
├── index.html              ← Main website (all sections)
├── README.md               ← This file
├── css/
│   └── main.css            ← Full design system (dark glassmorphism)
├── js/
│   └── app.js              ← All calculators, APIs, animations
└── data/
    ├── asmaul-husna.json   ← 99 Names of Allah
    ├── history.json        ← Islamic history timeline data
    └── events.json         ← Hijri calendar events & world cities
```

---

## 🌐 APIs Used (All Free, No Key Required)

| API | Purpose |
|-----|---------|
| `api.aladhan.com` | Prayer times + Hijri date conversion |
| `api.metals.live` | Live gold & silver prices |
| `api.frankfurter.app` | USD → INR exchange rate |

All APIs have **automatic fallback** to hardcoded values if internet is unavailable.

---

## ⚙️ Local Development

Just open `index.html` in your browser! No server needed.

For live-reload development (optional):
```bash
# If you have Python installed:
python -m http.server 8000
# Then open: http://localhost:8000
```

---

## 🕌 Prayer Times

- **Default Location**: Srinagar, Kashmir, India (nearest major city to Ratnipora)
- **Calculation Method**: University of Islamic Sciences, Karachi (UISK) — Standard for South Asia
- **Madhab**: Hanafi (Asr calculated at 1x shadow length)

---

## ⚖️ Madhab Support

All calculators support switching between:
- **Hanafi** (default) — Silver Nisab for Zakat, specific Asr time
- **Shafi'i** — Gold Nisab for Zakat
- **Maliki** — Gold Nisab for Zakat  
- **Hanbali** — Gold Nisab for Zakat

---

## 📖 References

- Quran — Surah An-Nisa 4:11-12 (Inheritance)
- Quran — Surah At-Tawbah 9:60 (Zakat recipients)
- Quran — Surah Al-Baqarah 2:183 (Fasting)
- Nisab values: 87.48g gold (7.5 tola) / 612.36g silver (52.5 tola)

---

> ⚠️ **Disclaimer**: All calculations are for educational purposes. Please consult a qualified Islamic scholar for important decisions related to Zakat, inheritance, or other religious obligations.

---

*Made with ❤️ | Ratnipora, Pulwama, Kashmir, India | بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ*
