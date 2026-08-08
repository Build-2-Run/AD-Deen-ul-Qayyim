# ADQ Prayer Time Astronomical Calculation Specification

**Phase**: 10B.7 — Astronomy Knowledge Domain Expansion  
**Status**: Technical Calculation Specification  
**Date**: 2026-07-22  
**Target Path**: `docs/Prayer-Time-Astronomy.md`

---

## 1. Astronomical Calculation Rules for Prayer Times

| Prayer | Astronomical Event | Solar Altitude / Depression Angle ($\alpha$) | Formula / Criterion |
|--------|--------------------|--------------------------------------------|---------------------|
| **Fajr** | True Dawn (*Al-Fajr Al-Sadiq*) | $-18.0^\circ$ (ISNA/MWL) or $-19.5^\circ$ (Umm al-Qura) | $\cos h = \frac{\sin \alpha - \sin \phi \sin \delta}{\cos \phi \cos \delta}$ |
| **Sunrise** | Solar Disc Horizon Crossing | $-0.833^\circ$ (Refraction & Semi-diameter) | Upper solar rim touches eastern horizon |
| **Dhuhr** | Solar Meridian Transit (*Zawal*) | Solar Zenith ($h_{\text{max}} = 90^\circ - \phi + \delta$) | Sun crosses observer's true north-south meridian |
| **Asr** | Shadow Length Multiplier | Shadow $= \text{Height} + \text{Shadow at Zawal}$ (Shafi'i/Hanbali/Maliki) or $+ 2\times \text{Height}$ (Hanafi) | $\operatorname{arccot}(1 + \tan(\phi - \delta))$ |
| **Maghrib** | Full Sunset (*Ghurub*) | $-0.833^\circ$ | Upper solar rim vanishes below western horizon |
| **Isha** | Disappearance of Twilight (*Shafaq*) | $-17.0^\circ$ (ISNA) or $-18.0^\circ$ (MWL) or $+90\text{m}$ (Umm al-Qura) | Dark astronomical twilight boundary |
