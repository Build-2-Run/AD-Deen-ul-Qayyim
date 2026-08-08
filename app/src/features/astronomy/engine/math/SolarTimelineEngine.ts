import {
  JulianDate,
  ObserverLocation,
  AtmosphericConditions,
  EngineResult,
  SolarEvent
} from '../../models';
import { EngineState } from '../core/EngineState';
import { SolarEventsEngine } from './SolarEventsEngine';

export interface TimelineEvent {
  event: SolarEvent;
  time: JulianDate | null;
}

export class SolarTimelineEngine {
  private solarEvents: SolarEventsEngine;

  constructor() {
    this.solarEvents = new SolarEventsEngine();
  }

  public generateTimeline(
    jd: JulianDate, // 0h UT of the target day
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<TimelineEvent[]> {
    const startTime = performance.now();
    const state = new EngineState();

    const eventsToCalculate: SolarEvent[] = [
      'AstronomicalDawn',
      'NauticalDawn',
      'CivilDawn',
      'BlueHourMorning',
      'GoldenHourMorning',
      'Sunrise',
      'SolarNoon',
      'GoldenHourEvening',
      'BlueHourEvening',
      'Sunset',
      'CivilDusk',
      'NauticalDusk',
      'AstronomicalDusk',
      'SolarMidnight'
    ];

    const timeline: TimelineEvent[] = [];

    for (const event of eventsToCalculate) {
      const result = this.solarEvents.calculateEvent(jd, location, event, atmosphere);
      timeline.push({ event, time: result.data });
    }

    // Sort chronologically, putting nulls at the end
    timeline.sort((a, b) => {
      if (a.time === null && b.time === null) return 0;
      if (a.time === null) return 1;
      if (b.time === null) return -1;
      return a.time.value - b.time.value;
    });

    state.addTrace('TIMELINE_GENERATED', 'Chronological solar timeline generated', { eventsCount: eventsToCalculate.length }, null, 'Sorting JD');

    return {
      data: timeline,
      computationTimeMs: performance.now() - startTime
    };
  }
}
