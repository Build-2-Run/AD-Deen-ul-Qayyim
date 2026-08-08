import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { FiqhStatusBadge } from '../../../platform/fiqh/FiqhStatusBadge';
import { readLocation, readMadhhab } from '../../astronomy/config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation } from '../../astronomy/config/settings';
import { computeDaySchedule, computeTwilightBands } from '../logic/schedule';
import { TwilightDiagram } from '../components/TwilightDiagram';

type Status = 'consensus' | 'scholarly-difference';

function Boundary({ label, angle, time }: { label: string; angle: string; time: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-[var(--border)] last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
        <Caption variant="secondary" className="text-[11px]">{angle}</Caption>
      </div>
      <div className="font-[family-name:var(--font-heading)] text-lg font-bold tabular-nums text-[var(--primary)] shrink-0">{time}</div>
    </div>
  );
}

function PrayerCard({ name, arabic, start, end, note, status }: {
  name: string; arabic: string;
  start: { label: string; angle: string; time: string };
  end: { label: string; angle: string; time: string };
  note: string; status: Status;
}) {
  return (
    <div className="adq-card p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <Heading level={3} size="lg" className="tracking-tight">{name}</Heading>
        <span className="adq-arabic-display text-xl">{arabic}</span>
      </div>
      <Caption variant="secondary" className="text-[10px] uppercase tracking-wider block mb-0.5">Begins</Caption>
      <Boundary {...start} />
      <Caption variant="secondary" className="text-[10px] uppercase tracking-wider block mt-2 mb-0.5">Ends</Caption>
      <Boundary {...end} />
      <div className="flex items-start gap-2 mt-3">
        <div className="shrink-0 mt-0.5"><FiqhStatusBadge status={status} showLabel={status === 'scholarly-difference'} /></div>
        <Caption variant="secondary" className="text-[11px] leading-relaxed">{note}</Caption>
      </div>
    </div>
  );
}

export function TwilightBoundaries() {
  const navigate = useNavigate();

  const location = useMemo(() => readLocation(), []);
  const madhhab = useMemo(() => readMadhhab(), []);
  const methodId = useMemo(() => readMethodId(), []);
  const settings = useMemo(() => readSettings(), []);
  const method = useMemo(() => effectiveMethod(methodId, settings), [methodId, settings]);
  const effLoc = useMemo(() => effectiveLocation(location, methodId, settings), [location, methodId, settings]);

  const [today] = useState(() => new Date());
  const schedule = useMemo(() => computeDaySchedule(today, effLoc, method, madhhab), [today, effLoc, method, madhhab]);
  const tz = location.timezone;
  const a = schedule.assumptions;
  const times = schedule.times;

  const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d) : '—');
  const fajrA = a.fajrAngle ?? 18;
  const ishaLabel = a.ishaAngle != null ? `−${a.ishaAngle}° below horizon` : a.ishaMinutes != null ? `+${a.ishaMinutes} min after Maghrib (fixed)` : 'end of twilight';

  // The location's true geographic elevation (for context) — distinct from the
  // sea-level horizon the times are actually computed at.
  const realElev = Math.round(location.coordinates?.elevation ?? location.elevation ?? 0);

  // Real, date-dependent twilight-band durations (not fixed — vary with the season).
  const bands = useMemo(() => computeTwilightBands(today, effLoc), [today, effLoc]);
  const fmtDur = (m: number | null) => (m == null ? 'does not end tonight' : m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
  const dateLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: tz }).format(today);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        <header className="mb-6">
          <button type="button" onClick={() => navigate('/prayer')} className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Icon name="ArrowLeft" size={16} /> Salaat
          </button>
          <Caption className="adq-eyebrow text-[11px]">The geometry of the times</Caption>
          <Heading level={1} size="4xl" className="tracking-tight mt-1 mb-2">Twilight &amp; prayer boundaries</Heading>
          <Body variant="secondary" className="max-w-2xl text-base leading-relaxed">
            Fajr, Maghrib and Isha are defined by how far the sun sits below the horizon. Drag the sun to see the twilight
            fade — and how each depression angle maps to a real time today in {a.locationName}.
          </Body>
        </header>

        {/* diagram */}
        <section className="mb-8">
          <TwilightDiagram
            fajrAngle={a.fajrAngle}
            ishaAngle={a.ishaAngle}
            ishaMinutes={a.ishaMinutes}
            times={{ fajr: times.fajr, sunrise: times.sunrise, maghrib: times.maghrib, isha: times.isha, fajrNext: schedule.fajrNext }}
            tz={tz}
          />
        </section>

        {/* the three prayers defined by twilight */}
        <section className="mb-8">
          <Caption className="adq-eyebrow text-[11px]">Start &amp; end today</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">Fajr · Maghrib · Isha</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <PrayerCard
              name="Fajr" arabic="الفجر"
              start={{ label: 'Ṣubḥ ṣādiq — true dawn', angle: `Sun at −${fajrA}° below the horizon`, time: fmt(times.fajr) }}
              end={{ label: 'Sunrise', angle: 'Sun at −0.83° (upper limb at horizon)', time: fmt(times.sunrise) }}
              note={`Fajr begins with the true dawn — the light that spreads horizontally across the sky — and ends at sunrise. The exact angle differs by method (−15° to −19.5°); this uses −${fajrA}°.`}
              status="scholarly-difference"
            />
            <PrayerCard
              name="Maghrib" arabic="المغرب"
              start={{ label: 'Sunset', angle: 'Sun at −0.83° (upper limb at horizon)', time: fmt(times.maghrib) }}
              end={{ label: 'Twilight (shafaq) disappears', angle: 'Isha begins', time: fmt(times.isha) }}
              note="Maghrib starts the moment the sun's disc sets and lasts until the shafaq fades. Most schools end it at the red twilight (shafaq aḥmar); the Ḥanafī view uses the later white twilight (shafaq abyaḍ)."
              status="scholarly-difference"
            />
            <PrayerCard
              name="Isha" arabic="العشاء"
              start={{ label: 'Twilight ends', angle: ishaLabel, time: fmt(times.isha) }}
              end={{ label: 'Start of Fajr (next dawn)', angle: 'Preferred before Islamic midnight', time: fmt(schedule.fajrNext) }}
              note="Isha begins once the twilight is gone and runs until the next Fajr, though it is preferably prayed before the midpoint of the night."
              status="scholarly-difference"
            />
          </div>
        </section>

        {/* twilight zones explained */}
        <section className="mb-8">
          <Caption className="adq-eyebrow text-[11px]">The three twilights</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-1">What each zone means</Heading>
          <Caption variant="secondary" className="text-xs block mb-4">Durations are computed for {dateLabel} in {a.locationName} — they are <b>not fixed</b> and change through the year.</Caption>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { c: '#e79a4e', key: 'civil', n: 'Civil', range: '0° to −6°', d: 'The brightest twilight. The horizon is clear and you can still see and work outdoors without light.' },
              { c: '#3e6fa4', key: 'nautical', n: 'Nautical', range: '−6° to −12°', d: 'Named for sailors — the sea horizon becomes hard to make out, and the first stars appear.' },
              { c: '#7986cb', key: 'astronomical', n: 'Astronomical', range: '−12° to −18°', d: 'The last faint glow drains from the sky. At −18° the sun no longer lights the sky at all.' },
            ].map((z) => {
              const band = bands.find((b) => b.key === z.key);
              return (
                <div key={z.key} className="adq-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: z.c }} />
                    <Heading level={3} size="sm" className="tracking-tight">{z.n}</Heading>
                    <Caption variant="secondary" className="text-[11px]">· {z.range}</Caption>
                  </div>
                  <div className="mb-1.5 space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--primary)] tabular-nums">{fmtDur(band?.morningMin ?? null)}</span>
                      <Caption variant="secondary" className="text-[11px]">at dawn (before sunrise)</Caption>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--primary)] tabular-nums">{fmtDur(band?.eveningMin ?? null)}</span>
                      <Caption variant="secondary" className="text-[11px]">at dusk (after sunset)</Caption>
                    </div>
                  </div>
                  <Caption variant="secondary" className="text-[12px] leading-relaxed block">{z.d}</Caption>
                </div>
              );
            })}
          </div>
          <Body variant="secondary" className="text-sm leading-relaxed mt-4">
            Fajr and Isha fall at the edge of <b>astronomical twilight</b> — the point where the sun's light no longer
            reaches the sky. Most calculation methods place this at about <b>−18°</b>; others range from −15° to −19.5°,
            which is why prayer times can differ slightly between authorities.
          </Body>
          <Body variant="secondary" className="text-sm leading-relaxed mt-3">
            <b>These lengths change with the season.</b> Twilight is shortest near the equinoxes and longest around the
            summer solstice; the higher the latitude, the greater the swing. At far-northern latitudes in midsummer the
            sun never sinks to −18°, so astronomical twilight lasts the whole night — shown above as “does not end tonight.”
          </Body>
        </section>

        {/* how exact is the time? — accuracy & precautions */}
        <section className="mb-8">
          <Caption className="adq-eyebrow text-[11px]">Accuracy &amp; precautions</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">How exact is the time?</Heading>

          <Heading level={3} size="lg" className="tracking-tight mb-1">A mountain valley — the skyline it can't see</Heading>
          <Caption variant="secondary" className="text-xs block mb-4">{a.locationName} sits at {realElev} m, ringed by mountains — so it's worth knowing what the calculation does and doesn't account for.</Caption>

          <div className="grid grid-cols-2 gap-3 mb-4 max-w-md">
            <div className="adq-card p-4">
              <Caption variant="secondary" className="text-[11px] uppercase tracking-wide block">Sunrise · Fajr ends</Caption>
              <div className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--primary)] tabular-nums mt-1">{fmt(times.sunrise)}</div>
              <Caption variant="secondary" className="text-[11px]">sun's upper edge at the true horizon</Caption>
            </div>
            <div className="adq-card p-4">
              <Caption variant="secondary" className="text-[11px] uppercase tracking-wide block">Sunset · Maghrib</Caption>
              <div className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--primary)] tabular-nums mt-1">{fmt(times.maghrib)}</div>
              <Caption variant="secondary" className="text-[11px]">sun's upper edge at the true horizon</Caption>
            </div>
          </div>

          <Body variant="secondary" className="text-sm leading-relaxed">
            These are astronomical times: the moment the sun's upper edge crosses the <b>sea-level horizon</b>, including
            atmospheric <b>refraction</b> (~0.57°) and the sun's own radius (<b>~0.27°</b>) — the same convention as standard
            published timetables. {a.locationName} actually sits at <b>{realElev} m</b>; from that height a clear horizon would
            make sunset a few minutes later and sunrise earlier (the <b>horizon dip</b>), but since the real horizon here is
            mountains rather than open sea, that dip is <b>not applied by default</b> — you can turn it on in Astronomy settings.
          </Body>

          <div className="adq-card p-5 mt-4">
            <Heading level={3} size="sm" className="tracking-tight mb-2">What a calculation can't see — the skyline</Heading>
            <Body variant="secondary" className="text-sm leading-relaxed">
              In a valley ringed by peaks, mountains to the <b>west hide the sun before</b> the true sunset, and peaks to the
              <b> east reveal it after</b> the true sunrise. No timetable knows your local ridgeline, so the <i>visible</i> sun and
              the <i>calculated</i> time will not match exactly — sometimes by many minutes.
            </Body>
          </div>

          <div className="flex items-start gap-2 mt-4">
            <div className="shrink-0 mt-0.5"><FiqhStatusBadge status="scholarly-difference" showLabel /></div>
            <Caption variant="secondary" className="text-[12px] leading-relaxed">
              The prayer and fasting times follow the <b>true horizon, not the mountain</b>. The sun slipping behind a ridge is
              obstruction, not sunset — beyond the ridge it is still daytime; likewise Fajr ends at the calculated sunrise even
              while eastern peaks still hide the sun. So a valley is a reason <b>not to break the fast early</b>, rather than a
              reason to add minutes. Some scholars do follow the <i>visible</i> local horizon — this is a genuine difference of opinion.
            </Caption>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <div className="shrink-0 mt-0.5"><FiqhStatusBadge status="local-authority" showLabel /></div>
            <Caption variant="secondary" className="text-[12px] leading-relaxed">
              This page computes at the <b>sea-level horizon</b> by default, matching most published timetables; you can add your
              elevation in <button type="button" onClick={() => navigate('/astronomy')} className="text-[var(--primary)] font-semibold underline">Astronomy settings</button> if you want the dip applied.
              For fasting and prayer, defer to your local mosque or moon-sighting authority.
            </Caption>
          </div>

          {/* B — a small buffer on the calculated times */}
          <div className="border-t border-[var(--border)] mt-6 pt-6">
            <Heading level={3} size="lg" className="tracking-tight mb-1">A small buffer on calculated times</Heading>
            <Body variant="secondary" className="text-sm leading-relaxed mb-3">
              Calculated sunrise and sunset are precise to the astronomy — but the sun is a <i>disk</i>, not a point, refraction
              varies with the weather, and location/elevation data carries small errors. Some mosques and timetables add a small,
              uniform margin.
            </Body>

            <div className="adq-card p-4 mb-3">
              {[
                { e: 'Fajr / fast begins', m: 'Astronomical dawn (−18°)', adj: '− a few min (imsāk)', p: 'some stop eating just before the calculated dawn' },
                { e: 'Sunrise / Fajr ends', m: "Sun's upper edge at the true horizon", adj: '+ a few min', p: 'wait until the sky is clearly bright' },
                { e: 'Sunset / Maghrib · iftār', m: "Sun's upper edge at the true horizon", adj: '+ a few min', p: 'break fast a couple of minutes after calculated sunset' },
              ].map((r) => (
                <div key={r.e} className="flex items-start justify-between gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{r.e}</div>
                    <Caption variant="secondary" className="text-[11px]">{r.m}</Caption>
                  </div>
                  <div className="text-right shrink-0 max-w-[46%]">
                    <div className="text-sm font-bold text-[var(--primary)]">{r.adj}</div>
                    <Caption variant="secondary" className="text-[11px] leading-snug">{r.p}</Caption>
                  </div>
                </div>
              ))}
            </div>

            <div className="adq-evidence p-4 mb-3">
              <p className="adq-arabic-read text-2xl text-right mb-2" dir="rtl" lang="ar">لا يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ</p>
              <Body variant="secondary" className="text-sm italic leading-relaxed">“The people will remain upon goodness as long as they hasten to break the fast.”</Body>
              <div className="flex items-center gap-2 mt-2">
                <FiqhStatusBadge status="consensus" />
                <Caption weight="semibold" className="text-[var(--accent)] text-[11px]">— Sahl ibn Saʿd · muttafaqun ʿalayhi (Bukhārī 1957, Muslim 1098)</Caption>
              </div>
              <Caption variant="secondary" className="text-[11px] block mt-2 leading-relaxed">
                Note this ḥadīth urges <b>promptness</b> at Maghrib — which is exactly why many scholars <b>oppose</b> a sunset buffer;
                the buffer view holds only that it ensures the sun has <i>actually</i> set first.
              </Caption>
            </div>

            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5"><FiqhStatusBadge status="scholarly-difference" showLabel /></div>
              <Caption variant="secondary" className="text-[12px] leading-relaxed">
                Not a consensus rule. Some authorities add ~2–3 min to sunset and subtract ~2–3 min from dawn as a margin for
                refraction, elevation and the sun's disk; others follow the calculation directly, holding modern astronomy accurate
                enough and iftār not to be delayed. A large <i>imsāk</i> gap before Fajr is itself disputed — many hold you may eat
                until true dawn (Qur'an 2:187).
              </Caption>
            </div>

            <div className="adq-card p-4 mt-3">
              <Caption weight="semibold" className="text-[11px] uppercase tracking-wide block mb-2">How this differs from the mountain-valley note</Caption>
              <div className="flex items-start justify-between gap-3 py-1.5 border-b border-[var(--border)]">
                <div className="text-[12px] font-semibold text-[var(--text-primary)] w-28 shrink-0">Mountain valley</div>
                <Caption variant="secondary" className="text-[12px] leading-relaxed">Sun is behind a ridge but hasn't reached the <i>true</i> horizon → don't break <b>early</b>.</Caption>
              </div>
              <div className="flex items-start justify-between gap-3 py-1.5">
                <div className="text-[12px] font-semibold text-[var(--text-primary)] w-28 shrink-0">This buffer</div>
                <Caption variant="secondary" className="text-[12px] leading-relaxed">The calculation itself may be off by ~a minute → some add a small uniform margin.</Caption>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <div className="shrink-0 mt-0.5"><FiqhStatusBadge status="local-authority" showLabel /></div>
              <Caption variant="secondary" className="text-[12px] leading-relaxed">
                Your mosque or national timetable may already bake a buffer in. Check whether their “Maghrib” is raw sunset or
                sunset + a few minutes, and follow them consistently.
              </Caption>
            </div>
          </div>
        </section>

        {/* evidence */}
        <section className="mb-4">
          <Caption className="adq-eyebrow text-[11px]">Evidence</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">From the Qur'an &amp; Sunnah</Heading>
          <div className="flex flex-col gap-3">
            <div className="adq-evidence p-4">
              <p className="adq-arabic-read text-2xl text-right mb-2" dir="rtl" lang="ar">
                حَتَّىٰ يَتَبَيَّنَ لَكُمُ الْخَيْطُ الْأَبْيَضُ مِنَ الْخَيْطِ الْأَسْوَدِ مِنَ الْفَجْرِ
              </p>
              <Body variant="secondary" className="text-sm italic leading-relaxed">
                “…until the white thread of dawn becomes distinct to you from the black thread [of night]. Then complete the fast until the night.”
              </Body>
              <div className="flex items-center gap-2 mt-2">
                <FiqhStatusBadge status="consensus" />
                <Caption weight="semibold" className="text-[var(--accent)] text-[11px]">— Qur'an, al-Baqarah 2:187 (the basis for Fajr = true dawn)</Caption>
              </div>

              {/* the verse, explained with respect to the angles */}
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <Caption weight="semibold" className="text-[11px] uppercase tracking-wide text-[var(--text-primary)] block mb-2">What this means, with respect to the angles</Caption>
                <ul className="space-y-2">
                  {[
                    <>When ʿAdī ibn Ḥātim took two literal threads, the Prophet ﷺ explained the “threads” mean <b>the whiteness of day and the blackness of night</b> — i.e. the break of true dawn (<i>al-fajr al-ṣādiq</i>).</>,
                    <><b>True dawn (ṣubḥ ṣādiq):</b> the faint light that spreads <b>horizontally</b> along the horizon — the “white thread.” This begins Fajr and the fast.</>,
                    <><b>False dawn (ṣubḥ kādhib):</b> a <b>vertical</b> shaft of light that rises earlier then fades — it does <b>not</b> begin the prayer or the fast.</>,
                    <>That first horizontal glow becomes distinct when the sun is about <b>18° below the horizon</b> (end of astronomical twilight) — which is why most methods set Fajr at <b>≈ −18°</b>.</>,
                    <>The geometry <b>mirrors at dusk:</b> when the sun sinks to <b>≈ −18°</b> in the west, the last twilight (shafaq) is gone and <b>Isha</b> begins.</>,
                  ].map((node, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5" />
                      <Caption variant="secondary" className="text-[12px] leading-relaxed">{node}</Caption>
                    </li>
                  ))}
                </ul>
                <Caption variant="secondary" className="text-[10.5px] block mt-3 leading-relaxed">
                  Qur'an, al-Baqarah 2:187 · thread clarification reported by al-Bukhārī (ʿAdī ibn Ḥātim). Educational — verify specifics with a scholar.
                </Caption>
              </div>
            </div>
            <div className="adq-evidence p-4">
              <Body variant="secondary" className="text-sm italic leading-relaxed">
                “The time of Maghrib lasts as long as the twilight (shafaq) has not disappeared; the time of Isha lasts until the middle of the night; and the time of the dawn prayer is from the appearance of dawn as long as the sun has not risen.”
              </Body>
              <div className="flex items-center gap-2 mt-2">
                <FiqhStatusBadge status="consensus" />
                <Caption weight="semibold" className="text-[var(--accent)] text-[11px]">— ʿAbdullāh ibn ʿAmr — Ṣaḥīḥ Muslim 612</Caption>
              </div>
            </div>
          </div>
        </section>

        <Caption variant="secondary" className="block text-center text-[11px] mt-2 px-4 leading-relaxed">
          Calculated times are a study aid computed by the ADQ Astronomy engine for your saved location and method.
          The depression angles above follow your <button type="button" onClick={() => navigate('/astronomy')} className="text-[var(--primary)] font-semibold underline">Astronomy settings</button>.
          For binding rulings, consult a qualified scholar.
        </Caption>
      </ContentContainer>
    </PageContainer>
  );
}
