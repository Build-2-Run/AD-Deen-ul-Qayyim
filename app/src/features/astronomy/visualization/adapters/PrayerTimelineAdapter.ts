import { PrayerTimelineSegment } from '../types/visualization-types';
import { DailyAstronomyResult } from '../../service/types';
import { ColorPalettes } from '../render/ColorPalettes';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class PrayerTimelineAdapter {
  /**
   * Adapts daily prayer times into 24-hour linear timeline segments (0% to 100%).
   */
  public static adaptPrayerTimeline(result: DailyAstronomyResult): PrayerTimelineSegment[] {
    if (!result.prayerTimes) return [];

    const p = result.prayerTimes;
    const extractPercent = (jd: { value: number } | null): number => {
      if (!jd) return 0;
      const g = TimeEngine.julianDateToGregorian(jd);
      const hours = (g.hour ?? 0) + (g.minute ?? 0) / 60 + (g.second ?? 0) / 3600;
      return Number(((hours / 24) * 100).toFixed(2));
    };

    const fajrPct = extractPercent(p.fajr);
    const sunrisePct = extractPercent(p.sunrise);
    const dhuhrPct = extractPercent(p.dhuhr);
    const asrPct = extractPercent(p.asrStandard);
    const maghribPct = extractPercent(p.maghrib);
    const ishaPct = extractPercent(p.isha);

    return [
      {
        name: 'Fajr',
        startTimeUTC: 'Fajr Start',
        endTimeUTC: 'Sunrise',
        startPercent: fajrPct,
        endPercent: sunrisePct,
        color: ColorPalettes.Prayer.Fajr,
        isCurrent: false
      },
      {
        name: 'Sunrise (Ishraq)',
        startTimeUTC: 'Sunrise',
        endTimeUTC: 'Dhuhr',
        startPercent: sunrisePct,
        endPercent: dhuhrPct,
        color: ColorPalettes.Prayer.Sunrise,
        isCurrent: false
      },
      {
        name: 'Dhuhr',
        startTimeUTC: 'Dhuhr',
        endTimeUTC: 'Asr',
        startPercent: dhuhrPct,
        endPercent: asrPct,
        color: ColorPalettes.Prayer.Dhuhr,
        isCurrent: false
      },
      {
        name: 'Asr',
        startTimeUTC: 'Asr',
        endTimeUTC: 'Maghrib',
        startPercent: asrPct,
        endPercent: maghribPct,
        color: ColorPalettes.Prayer.Asr,
        isCurrent: false
      },
      {
        name: 'Maghrib',
        startTimeUTC: 'Maghrib',
        endTimeUTC: 'Isha',
        startPercent: maghribPct,
        endPercent: ishaPct,
        color: ColorPalettes.Prayer.Maghrib,
        isCurrent: false
      },
      {
        name: 'Isha',
        startTimeUTC: 'Isha',
        endTimeUTC: 'Midnight',
        startPercent: ishaPct,
        endPercent: 100.0,
        color: ColorPalettes.Prayer.Isha,
        isCurrent: false
      }
    ];
  }
}
