import { astronomicalConstants } from '../../mock/scientific-data';

export const EPSILON = 1e-10;

/**
 * Checks if two floating point numbers are approximately equal.
 */
export function approximatelyEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Converts degrees to radians.
 */
export function toRadians(degrees: number): number {
  return (degrees * astronomicalConstants.pi) / (astronomicalConstants.degreesInCircle / 2);
}

/**
 * Converts radians to degrees.
 */
export function toDegrees(radians: number): number {
  return (radians * (astronomicalConstants.degreesInCircle / 2)) / astronomicalConstants.pi;
}

/**
 * Normalizes an angle in degrees to the range [0, 360).
 */
export function normalizeDegrees(degrees: number): number {
  let res = degrees % astronomicalConstants.degreesInCircle;
  if (res < 0) res += astronomicalConstants.degreesInCircle;
  return res;
}

/**
 * Normalizes an angle in radians to the range [0, 2π).
 */
export function normalizeRadians(radians: number): number {
  const twoPi = 2 * astronomicalConstants.pi;
  let res = radians % twoPi;
  if (res < 0) res += twoPi;
  return res;
}

/**
 * Normalizes hours to the range [0, 24).
 */
export function normalizeHours(hours: number): number {
  let res = hours % astronomicalConstants.hoursInDay;
  if (res < 0) res += astronomicalConstants.hoursInDay;
  return res;
}

/**
 * Returns fractional part of a number.
 */
export function fractionalPart(n: number): number {
  return n - Math.floor(n);
}
