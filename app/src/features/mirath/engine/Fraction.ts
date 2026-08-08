export class Fraction {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error("Denominator cannot be zero.");
    }
    
    const divisor = this.gcd(Math.abs(numerator), Math.abs(denominator));
    this.numerator = numerator / divisor;
    this.denominator = denominator / divisor;
    
    // Ensure denominator is always positive
    if (this.denominator < 0) {
      this.numerator *= -1;
      this.denominator *= -1;
    }
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  static fromString(fraction: string): Fraction {
    if (fraction.toLowerCase() === 'residue' || fraction.toLowerCase() === 'asabah') {
      return new Fraction(0, 1); // Residue is evaluated later
    }
    const [num, den] = fraction.split('/');
    if (!den) return new Fraction(parseInt(num, 10), 1);
    return new Fraction(parseInt(num, 10), parseInt(den, 10));
  }

  add(other: Fraction): Fraction {
    const num = this.numerator * other.denominator + other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den);
  }

  subtract(other: Fraction): Fraction {
    const num = this.numerator * other.denominator - other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den);
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other: Fraction): Fraction {
    return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
  }
  
  scaleNumerator(newDenominator: number): number {
      if (newDenominator % this.denominator !== 0) {
          throw new Error("Cannot cleanly scale to new denominator without floating point");
      }
      return this.numerator * (newDenominator / this.denominator);
  }

  toNumber(): number {
    return this.numerator / this.denominator;
  }

  toString(): string {
    if (this.denominator === 1) return `${this.numerator}`;
    return `${this.numerator}/${this.denominator}`;
  }

  equals(other: Fraction): boolean {
    return this.numerator === other.numerator && this.denominator === other.denominator;
  }
  
  isZero(): boolean {
      return this.numerator === 0;
  }
}
