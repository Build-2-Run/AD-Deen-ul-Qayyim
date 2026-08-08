import {
  ObserverLocation,
  GregorianDate,
  JulianDate,
  AtmosphericConditions,
  CalculationMethod
} from '../../models';

export class InputValidationError extends Error {
  constructor(public parameterName: string, public value: unknown, message: string) {
    super(`[InputValidationError] Invalid ${parameterName}: ${message}`);
    this.name = 'InputValidationError';
  }
}

export function sanitizeLocation(location: ObserverLocation): ObserverLocation {
  if (!location || !location.coordinates) {
    throw new InputValidationError('location', location, 'Location and coordinates object are required.');
  }

  const { latitude, longitude } = location.coordinates;
  if (typeof latitude !== 'number' || Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new InputValidationError('latitude', latitude, 'Latitude must be a valid number between -90 and 90 degrees.');
  }

  if (typeof longitude !== 'number' || Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new InputValidationError('longitude', longitude, 'Longitude must be a valid number between -180 and 180 degrees.');
  }

  return location;
}

export function sanitizeDate(date: GregorianDate): GregorianDate {
  if (!date) {
    throw new InputValidationError('date', date, 'GregorianDate object is required.');
  }

  const { year, month, day, hour, minute, second } = date;

  if (typeof year !== 'number' || !Number.isInteger(year) || year < -4000 || year > 4000) {
    throw new InputValidationError('year', year, 'Year must be an integer between -4000 and 4000.');
  }

  if (typeof month !== 'number' || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new InputValidationError('month', month, 'Month must be an integer between 1 and 12.');
  }

  if (typeof day !== 'number' || !Number.isInteger(day) || day < 1 || day > 31) {
    throw new InputValidationError('day', day, 'Day must be an integer between 1 and 31.');
  }

  if (hour !== undefined && (typeof hour !== 'number' || hour < 0 || hour > 23)) {
    throw new InputValidationError('hour', hour, 'Hour must be a number between 0 and 23.');
  }

  if (minute !== undefined && (typeof minute !== 'number' || minute < 0 || minute > 59)) {
    throw new InputValidationError('minute', minute, 'Minute must be a number between 0 and 59.');
  }

  if (second !== undefined && (typeof second !== 'number' || second < 0 || second > 59)) {
    throw new InputValidationError('second', second, 'Second must be a number between 0 and 59.');
  }

  return date;
}

export function sanitizeAtmosphere(atmosphere?: AtmosphericConditions): AtmosphericConditions | undefined {
  if (!atmosphere) return undefined;

  const { pressure, temperature } = atmosphere;

  if (pressure !== undefined && (typeof pressure !== 'number' || pressure < 300 || pressure > 1200)) {
    throw new InputValidationError('pressure', pressure, 'Atmospheric pressure must be between 300 and 1200 millibars.');
  }

  if (temperature !== undefined && (typeof temperature !== 'number' || temperature < -80 || temperature > 70)) {
    throw new InputValidationError('temperature', temperature, 'Temperature must be between -80 and 70 degrees Celsius.');
  }

  return atmosphere;
}

export function sanitizeCalculationMethod(method: CalculationMethod): CalculationMethod {
  if (!method || !method.id || !method.fajr || !method.isha) {
    throw new InputValidationError('calculationMethod', method, 'Valid calculation method with Fajr and Isha definitions is required.');
  }
  return method;
}

export function sanitizeTimezone(timezone: string): string {
  if (typeof timezone !== 'string' || timezone.trim().length === 0) {
    throw new InputValidationError('timezone', timezone, 'Timezone must be a non-empty string identifier (e.g. "Asia/Riyadh").');
  }
  return timezone;
}

export function sanitizeElevation(elevation?: number): number {
  if (elevation === undefined) return 0;
  if (typeof elevation !== 'number' || Number.isNaN(elevation) || elevation < -500 || elevation > 9000) {
    throw new InputValidationError('elevation', elevation, 'Elevation must be a valid number between -500 and 9000 meters.');
  }
  return elevation;
}

export function sanitizeObserver(observer: ObserverLocation): ObserverLocation {
  sanitizeLocation(observer);
  sanitizeTimezone(observer.timezone);
  if (observer.coordinates.altitude !== undefined) {
    sanitizeElevation(observer.coordinates.altitude);
  }
  return observer;
}

export function sanitizeJulianDate(jd: JulianDate): JulianDate {
  if (!jd || typeof jd.value !== 'number' || Number.isNaN(jd.value) || jd.value <= 0) {
    throw new InputValidationError('julianDate', jd, 'JulianDate value must be a positive number.');
  }
  return jd;
}
