import { useMemo } from 'react';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Icon } from '../../../design/icons/Icon';

import { HijriCalendarEngine } from '../../astronomy/engine/math/HijriCalendarEngine';
import { readHijriStrategy, readHijriOffset } from '../../astronomy/config/settings';

const hijriEngine = new HijriCalendarEngine();

// Verified facts only — sourced and cross-checked against Wikipedia's "Hijri calendar" /
// "Hijri era" articles and Qur'an 9:36-37 (Sahih International) before writing this page.
// Epoch constant matches the one already used in HijriCalendarEngine.ts (JD 1948439.5).
const SYNODIC_DAYS = 29.530588;
const LUNAR_YEAR_DAYS = 354.367; // 12 x synodic month
const SOLAR_YEAR_DAYS = 365.24219; // mean tropical year
const ANNUAL_DRIFT_DAYS = SOLAR_YEAR_DAYS - LUNAR_YEAR_DAYS; // ~10.88 days/year

interface MonthInfo {
  arabic: string;
  translit: string;
  meaning: string;
  note: string;
  sacred: boolean;
}

// Meanings/notes kept to what's widely and uncontroversially attested (etymology,
// well-known associated events). Nothing about disputed observances (e.g. Mawlid)
// is asserted here — those differ by school and aren't this page's place to rule on.
const MONTHS: MonthInfo[] = [
  { arabic: 'مُحَرَّم', translit: 'Muḥarram', meaning: '"Forbidden" — fighting is forbidden', note: 'First month; includes ʿĀshūrāʾ (10th)', sacred: true },
  { arabic: 'صَفَر', translit: 'Ṣafar', meaning: '"Empty" — homes emptied as men travelled or raided', note: '', sacred: false },
  { arabic: 'رَبِيع الأَوَّل', translit: "Rabīʿ al-Awwal", meaning: '"First spring"', note: 'Traditionally associated with the Prophet ﷺ’s birth', sacred: false },
  { arabic: 'رَبِيع الثَّانِي', translit: "Rabīʿ al-Thānī", meaning: '"Second spring"', note: '', sacred: false },
  { arabic: 'جُمَادَىٰ الأُولَىٰ', translit: "Jumādā al-Ūlā", meaning: '"First month of parched land"', note: '', sacred: false },
  { arabic: 'جُمَادَىٰ الآخِرَة', translit: "Jumādā al-Ākhirah", meaning: '"Last month of parched land"', note: '', sacred: false },
  { arabic: 'رَجَب', translit: 'Rajab', meaning: '"To respect" — a sacred month', note: 'One of the four sacred months', sacred: true },
  { arabic: 'شَعْبَان', translit: "Sha'bān", meaning: '"To spread out" — tribes dispersed to raid or seek water', note: 'Precedes Ramaḍān', sacred: false },
  { arabic: 'رَمَضَان', translit: 'Ramaḍān', meaning: '"Scorching heat"', note: 'Month of fasting; the Qur’an’s revelation began in this month (2:185)', sacred: false },
  { arabic: 'شَوَّال', translit: 'Shawwāl', meaning: '"To be light/active" — camels lift their tails in this season', note: 'ʿĪd al-Fiṭr falls on the 1st', sacred: false },
  { arabic: 'ذُو القَعْدَة', translit: "Dhū al-Qa'dah", meaning: '"The one of truce" — raiding paused', note: 'One of the four sacred months', sacred: true },
  { arabic: 'ذُو الحِجَّة', translit: 'Dhū al-Ḥijjah', meaning: '"The one of pilgrimage"', note: 'Ḥajj and ʿĪd al-Aḍḥā; one of the four sacred months', sacred: true },
];

interface VerseCardProps { arabic: string; translation: string; reference: string; note?: string }
function VerseCard({ arabic, translation, reference, note }: VerseCardProps) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(12,24,36,0.85)', border: '1px solid rgba(245,199,93,0.22)' }}
    >
      <div dir="rtl" className="text-right mb-3">
        <ArabicText size="xl" style={{ color: '#f5c75d', textShadow: '0 0 12px rgba(245,199,93,0.3)' }}>{arabic}</ArabicText>
      </div>
      <Body variant="secondary" className="text-white/85 text-sm italic leading-relaxed">“{translation}”</Body>
      <Caption weight="semibold" className="text-[#f5c75d] text-[11px] mt-2 block">— {reference}</Caption>
      {note && <Body className="text-white/60 text-xs mt-3 leading-relaxed">{note}</Body>}
    </div>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-5 text-center"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <div className="text-2xl font-bold tabular-nums" style={{ color: '#f5c75d', fontFamily: 'var(--font-heading)' }}>{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-white/60 mt-1.5">{label}</div>
      {hint && <div className="text-[10px] text-white/40 mt-1">{hint}</div>}
    </div>
  );
}

export function CalendarHome() {
  const today = useMemo(() => new Date(), []);
  const strategy = useMemo(() => readHijriStrategy(), []);
  const offset = useMemo(() => readHijriOffset(), []);

  const hijriToday = useMemo(() => {
    try {
      return hijriEngine.gregorianToHijri(
        { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
        strategy,
        offset,
      ).data;
    } catch { return null; }
  }, [today, strategy, offset]);

  const gregLabel = useMemo(
    () => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today),
    [today],
  );

  const sacredCount = MONTHS.filter((m) => m.sacred).length;

  return (
    <PageContainer className="adq-sky adq-sky-night min-h-full rounded-none text-white">
      <ContentContainer>
        {/* ---------------- HERO ---------------- */}
        <section
          className="relative overflow-hidden rounded-[24px] px-6 py-10 md:px-12 md:py-14"
          style={{
            background: 'radial-gradient(ellipse at top center, #0f2a40 0%, #040a14 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <Caption className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(245,199,93,0.85)' }}>
              Tools · Calendar
            </Caption>
            <div dir="rtl" className="mt-3 mb-3">
              <ArabicText size="3xl" style={{ color: '#f5c75d', textShadow: '0 0 20px rgba(245,199,93,0.5)' }}>التقويم الهجري</ArabicText>
            </div>
            <Heading level={1} size="4xl" className="text-white tracking-tight">The Hijri Calendar</Heading>
            <Body className="text-white/70 mt-4 text-base leading-relaxed">
              A purely lunar calendar of twelve months, each one beginning with the sighting or
              calculation of a new crescent moon — unlike the Gregorian calendar's fixed, humanly
              adjusted months.
            </Body>

            {hijriToday && (
              <div
                className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-7 rounded-2xl px-6 py-4"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,199,93,0.25)' }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/55">Today</span>
                <span className="text-lg font-bold" style={{ color: '#f5c75d' }}>
                  {hijriToday.day} {hijriToday.monthName} {hijriToday.year} AH
                </span>
                <span className="hidden sm:inline text-white/25">·</span>
                <span className="text-sm text-white/70">{gregLabel}</span>
              </div>
            )}
          </div>
        </section>

        {/* ---------------- QUICK FACTS ---------------- */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Months" value="12" hint="all lunar" />
          <StatTile label="Sacred months" value={String(sacredCount)} hint="Qur'an 9:36" />
          <StatTile label="Epoch" value="622 CE" hint="1 Muḥarram, 1 AH" />
          <StatTile label="Established" value="17 AH" hint="by Caliph ʿUmar" />
        </section>

        {/* ---------------- WHAT IT IS ---------------- */}
        <section className="mt-10">
          <Caption className="adq-eyebrow text-[11px]">Structure</Caption>
          <Heading level={2} size="2xl" className="text-white tracking-tight mt-1 mb-3">What the Hijri calendar is</Heading>
          <Body className="text-white/70 leading-relaxed max-w-3xl">
            The Hijri (or Islamic) calendar has twelve months, each tracking one full cycle of the
            Moon's phases — about 29.53 days, the synodic month. A Hijri year is therefore roughly
            354–355 days, about eleven days shorter than the ~365.24-day solar year the Gregorian
            calendar tracks. Every month starts at the new crescent, either by direct sighting
            (ruʾyah) or, as used elsewhere on this site's prayer and moon pages, by astronomical
            calculation of the same event.
          </Body>
        </section>

        {/* ---------------- MONTH GRID ---------------- */}
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MONTHS.map((m, i) => (
              <div
                key={m.translit}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.035)', border: `1px solid ${m.sacred ? 'rgba(245,199,93,0.35)' : 'rgba(255,255,255,0.10)'}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-white/40 tabular-nums">{String(i + 1).padStart(2, '0')}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{m.translit}</div>
                  </div>
                  <div dir="rtl">
                    <ArabicText size="lg" style={{ color: '#f5c75d' }}>{m.arabic}</ArabicText>
                  </div>
                </div>
                <div className="text-xs text-white/55 mt-2 italic">{m.meaning}</div>
                {m.note && <div className="text-xs text-white/70 mt-1.5">{m.note}</div>}
                {m.sacred && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide mt-2.5 rounded-full px-2.5 py-1"
                    style={{ color: '#f5c75d', background: 'rgba(245,199,93,0.14)' }}
                  >
                    <Icon name="ShieldCheck" size={11} /> Sacred month
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- THE FOUNDATION ---------------- */}
        <section className="mt-12">
          <Caption className="adq-eyebrow text-[11px]">Origin</Caption>
          <Heading level={2} size="2xl" className="text-white tracking-tight mt-1 mb-3">The foundation: Hijrah, and its formal adoption</Heading>
          <Body className="text-white/70 leading-relaxed max-w-3xl">
            The calendar's epoch — year 1 — is fixed to the Hijrah: the Prophet Muhammad ﷺ's
            migration from Makkah to Madīnah in 622 CE. Its first day, 1 Muḥarram AH 1, corresponds
            to 16 July 622 CE on the proleptic Julian calendar. The numbered era itself wasn't
            formalised until roughly 17 AH (638–639 CE), when Caliph ʿUmar ibn al-Khaṭṭāb
            instituted it — the historical record credits a request from his governor Abū Mūsā
            al-Ashʿarī, who needed a consistent way to date correspondence — replacing the earlier
            practice of naming years after notable events.
          </Body>
        </section>

        {/* ---------------- WHY LUNAR ---------------- */}
        <section className="mt-12">
          <Caption className="adq-eyebrow text-[11px]">Basis</Caption>
          <Heading level={2} size="2xl" className="text-white tracking-tight mt-1 mb-3">Why a lunar calendar, with no adjustment</Heading>
          <Body className="text-white/70 leading-relaxed max-w-3xl mb-6">
            Pre-Islamic Arabia used a lunar calendar too, but periodically inserted an extra month
            (an intercalation practice called <em>al-nasīʾ</em>) to keep the months aligned with
            the seasons — mirroring what the Gregorian calendar's leap years do for the solar year.
            The Qur'an explicitly ended this practice, fixing the calendar as purely lunar with no
            correction back to the solar year:
          </Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VerseCard
              arabic="إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ ۚ ذَٰلِكَ الدِّينُ الْقَيِّمُ"
              translation="Indeed, the number of months ordained by Allah is twelve — in Allah's Record since the day He created the heavens and the earth — of which four are sacred. That is the Right Way."
              reference="Qur'an, at-Tawbah 9:36"
            />
            <VerseCard
              arabic="إِنَّمَا النَّسِيءُ زِيَادَةٌ فِي الْكُفْرِ ۖ يُضَلُّ بِهِ الَّذِينَ كَفَرُوا يُحِلُّونَهُ عَامًا وَيُحَرِّمُونَهُ عَامًا"
              translation="Indeed, the postponing [of restriction within sacred months] is an increase in disbelief... They make it lawful one year and unlawful another year, to correspond to the number [of months] made unlawful by Allah."
              reference="Qur'an, at-Tawbah 9:37"
              note="This verse is read as the Qur'anic basis for prohibiting Nasī' — the seasonal-adjustment practice — fixing the calendar as purely lunar from that point on."
            />
            <VerseCard
              arabic="يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ"
              translation="They ask you about the crescent moons. Say: They are measurements of time for the people and for Ḥajj."
              reference="Qur'an, al-Baqarah 2:189"
            />
            <VerseCard
              arabic="هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ"
              translation="It is He who made the sun a shining light and the moon a derived light, and determined for it phases — that you may know the number of years and the account [of time]."
              reference="Qur'an, Yūnus 10:5"
            />
          </div>
        </section>

        {/* ---------------- THE DRIFT ---------------- */}
        <section className="mt-12">
          <Caption className="adq-eyebrow text-[11px]">Astronomy</Caption>
          <Heading level={2} size="2xl" className="text-white tracking-tight mt-1 mb-3">The consequence: a calendar that moves through the seasons</Heading>
          <Body className="text-white/70 leading-relaxed max-w-3xl mb-5">
            Because a Hijri year (≈354.37 days) is shorter than a solar year (≈365.24 days) by
            about {ANNUAL_DRIFT_DAYS.toFixed(1)} days, Hijri months drift earlier through the
            Gregorian calendar every year — roughly one month every 2.7 years — completing a full
            cycle through all four seasons in about 33 Hijri years (≈32 solar years). This is
            deliberate, not a flaw: it means Ramaḍān and Ḥajj are not fixed to one climate or one
            hemisphere's season — over a lifetime, every Muslim fasts Ramaḍān in every season, in
            long summer days and short winter ones alike.
          </Body>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            <StatTile label="Synodic month" value={`${SYNODIC_DAYS.toFixed(2)}d`} hint="one lunar cycle" />
            <StatTile label="Lunar year" value={`${LUNAR_YEAR_DAYS.toFixed(1)}d`} hint="12 × synodic month" />
            <StatTile label="Annual drift" value={`~${ANNUAL_DRIFT_DAYS.toFixed(1)}d`} hint="vs. the solar year" />
          </div>
        </section>

        {/* ---------------- COMPARISON ---------------- */}
        <section className="mt-12 mb-4">
          <Caption className="adq-eyebrow text-[11px]">In the Islamic view</Caption>
          <Heading level={2} size="2xl" className="text-white tracking-tight mt-1 mb-3">Hijri and Gregorian, compared</Heading>
          <Body className="text-white/70 leading-relaxed max-w-3xl mb-6">
            The two calendars serve different purposes, and each is well-suited to what it was
            built for — the Gregorian calendar's fixed alignment to the solar year makes it good
            for agriculture and civil seasons. What distinguishes the Hijri calendar, in the
            Islamic view, is that its months trace directly back to an observable natural
            event — the new moon — rather than to a rule imposed by decree.
          </Body>
          <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <th className="text-left px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wide">Feature</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: '#f5c75d' }}>Hijri (Islamic)</th>
                  <th className="text-left px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wide">Gregorian</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {[
                  ['Basis', 'Lunar — the observable Moon cycle (≈29.53 days/month)', 'Solar — the Earth’s orbit around the Sun (≈365.24 days/year)'],
                  ['Origin', 'Fixed to the Hijrah (622 CE); formalised 17 AH by Caliph ʿUmar', 'Reformed in 1582 CE by Pope Gregory XIII from the Julian calendar (45 BCE, Julius Caesar)'],
                  ['Month lengths', '29 or 30 days, each tied to an actual lunar cycle', '28–31 days, fixed by historical convention rather than any natural cycle'],
                  ['Correction for drift', 'None — intercalation (Nasī’) was explicitly prohibited (Qur’an 9:37)', 'Leap day every 4 years (skipped on century years not divisible by 400)'],
                  ['Year length', '354–355 days', '365 or 366 days'],
                  ['Primary use', 'Worship: Ramaḍān, Ḥajj, Zakāh anniversary, the sacred months', 'Civil, agricultural, and administrative scheduling'],
                ].map((row) => (
                  <tr key={row[0]} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td className="px-4 py-3 font-semibold text-white/90 align-top">{row[0]}</td>
                    <td className="px-4 py-3 align-top">{row[1]}</td>
                    <td className="px-4 py-3 align-top text-white/65">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Caption variant="secondary" className="block text-white/45 border-t border-white/10 pt-4 mt-4 mb-8 leading-relaxed">
          Historical and astronomical figures on this page are cross-checked against Wikipedia's
          "Hijri calendar" and "Hijri era" articles and standard astronomical constants. Verse
          translations follow Sahih International. This page states facts and the traditional
          Islamic rationale for them — it does not rule on matters where schools differ (such as
          whether or how the Prophet ﷺ's birth month is marked).
        </Caption>
      </ContentContainer>
    </PageContainer>
  );
}
