import { describe, it, expect } from 'vitest';
import {
  sanitizeLocation,
  sanitizeDate,
  sanitizeTimezone,
  sanitizeElevation,
  InputValidationError
} from '../validators/InputValidators';

describe('InputValidators Unit Tests', () => {
  it('should validate correct locations', () => {
    const validLoc = {
      name: 'London',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      timezone: 'Europe/London'
    };
    expect(sanitizeLocation(validLoc)).toBe(validLoc);
  });

  it('should throw error for out-of-bounds latitude', () => {
    const invalidLoc = {
      name: 'Invalid',
      coordinates: { latitude: 105.0, longitude: 0 },
      timezone: 'UTC'
    };
    expect(() => sanitizeLocation(invalidLoc)).toThrow(InputValidationError);
  });

  it('should validate correct Gregorian dates', () => {
    const validDate = { year: 2026, month: 4, day: 1 };
    expect(sanitizeDate(validDate)).toBe(validDate);
  });

  it('should throw error for out-of-bounds month', () => {
    const invalidDate = { year: 2026, month: 14, day: 1 };
    expect(() => sanitizeDate(invalidDate)).toThrow(InputValidationError);
  });

  it('should validate timezone strings', () => {
    expect(sanitizeTimezone('Asia/Riyadh')).toBe('Asia/Riyadh');
    expect(() => sanitizeTimezone('')).toThrow(InputValidationError);
  });

  it('should validate elevation', () => {
    expect(sanitizeElevation(500)).toBe(500);
    expect(() => sanitizeElevation(-1000)).toThrow(InputValidationError);
  });
});
