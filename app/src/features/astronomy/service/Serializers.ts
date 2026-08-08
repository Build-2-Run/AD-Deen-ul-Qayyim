import { DailyAstronomyResult } from './types';
import { TimeEngine } from '../engine/math/TimeEngine';

export class Serializers {
  /**
   * Converts DailyAstronomyResult or array to JSON string.
   */
  public static toJSON(data: unknown, pretty: boolean = true): string {
    return JSON.stringify(data, null, pretty ? 2 : undefined);
  }

  /**
   * Converts array of DailyAstronomyResult into CSV string for Prayer Times and Hijri Dates.
   */
  public static toCSV(results: DailyAstronomyResult[]): string {
    const headers = [
      'Date',
      'Hijri Year',
      'Hijri Month',
      'Hijri Day',
      'Fajr',
      'Sunrise',
      'Dhuhr',
      'Asr Standard',
      'Asr Hanafi',
      'Maghrib',
      'Isha'
    ];

    const lines: string[] = [headers.join(',')];

    for (const res of results) {
      const d = res.date;
      const dateStr = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;

      const h = res.hijri;
      const hYear = h ? h.year : '';
      const hMonth = h ? h.monthName : '';
      const hDay = h ? h.day : '';

      const p = res.prayerTimes;
      const formatJD = (jd: { value: number } | null) => {
        if (!jd) return '';
        const greg = TimeEngine.julianDateToGregorian(jd);
        return `${String(greg.hour).padStart(2, '0')}:${String(greg.minute).padStart(2, '0')}`;
      };

      const fajr = p ? formatJD(p.fajr) : '';
      const sunrise = p ? formatJD(p.sunrise) : '';
      const dhuhr = p ? formatJD(p.dhuhr) : '';
      const asrStd = p ? formatJD(p.asrStandard) : '';
      const asrHan = p ? formatJD(p.asrHanafi) : '';
      const maghrib = p ? formatJD(p.maghrib) : '';
      const isha = p ? formatJD(p.isha) : '';

      lines.push([
        dateStr,
        hYear,
        `"${hMonth}"`,
        hDay,
        fajr,
        sunrise,
        dhuhr,
        asrStd,
        asrHan,
        maghrib,
        isha
      ].join(','));
    }

    return lines.join('\n');
  }

  /**
   * Exports prayer calendar to iCalendar (.ics) format.
   */
  public static toICS(results: DailyAstronomyResult[], calendarName: string = 'ADQ Prayer Times'): string {
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AD-Deen-ul-Qayyim//Astronomy Engine 4.0//EN',
      `X-WR-CALNAME:${calendarName}`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    for (const res of results) {
      if (!res.prayerTimes) continue;
      const p = res.prayerTimes;

      const formatICSDateTime = (jd: { value: number } | null, title: string) => {
        if (!jd) return;
        const g = TimeEngine.julianDateToGregorian(jd);
        const yyyy = g.year;
        const mm = String(g.month).padStart(2, '0');
        const dd = String(g.day).padStart(2, '0');
        const hh = String(g.hour).padStart(2, '0');
        const min = String(g.minute).padStart(2, '0');

        lines.push('BEGIN:VEVENT');
        lines.push(`SUMMARY:${title} Prayer - ${res.location.name}`);
        lines.push(`DTSTART:${yyyy}${mm}${dd}T${hh}${min}00Z`);
        lines.push(`DTEND:${yyyy}${mm}${dd}T${hh}${min}00Z`);
        lines.push(`DESCRIPTION:Prayer time calculated by ADQ Astronomy Engine.`);
        lines.push('END:VEVENT');
      };

      formatICSDateTime(p.fajr, 'Fajr');
      formatICSDateTime(p.dhuhr, 'Dhuhr');
      formatICSDateTime(p.asrStandard, 'Asr');
      formatICSDateTime(p.maghrib, 'Maghrib');
      formatICSDateTime(p.isha, 'Isha');
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }
}
