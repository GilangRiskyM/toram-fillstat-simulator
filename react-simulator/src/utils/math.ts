// Ported from math.js - Mathematical calculation utilities for precise decimal operations

export class MathCalculator {
  private num: number = 0;
  private exp: number = 0;

  constructor(num?: number | MathCalculator) {
    this.load(num || 0);
  }

  result(): number {
    return this.num / Math.pow(10, this.exp);
  }

  private parse(num: number | MathCalculator) {
    if (num instanceof MathCalculator) {
      num = num.result();
    }
    const decimals = num.toString().split(".")[1] || "";

    return {
      number: num * Math.pow(10, decimals.length),
      exponent: decimals.length,
    };
  }

  private normalize(num: { number: number; exponent: number }) {
    const diff = this.exp - num.exponent;
    const absdiff = Math.abs(diff);
    if (diff > 0) {
      num.exponent += absdiff;
      num.number *= Math.pow(10, absdiff);
    } else if (diff < 0) {
      this.exp += absdiff;
      this.num *= Math.pow(10, absdiff);
    }

    return num;
  }

  private load(num: number | MathCalculator) {
    if (num instanceof MathCalculator) {
      num = num.result();
    }
    const _num = this.parse(num);
    this.num = _num.number;
    this.exp = _num.exponent;
  }

  add(num: number | MathCalculator): MathCalculator {
    let _num = this.parse(num);
    _num = this.normalize(_num);

    this.num += _num.number;
    return this;
  }

  subtract(num: number | MathCalculator): MathCalculator {
    let _num = this.parse(num);
    _num = this.normalize(_num);

    this.num -= _num.number;
    return this;
  }

  multiply(num: number | MathCalculator): MathCalculator {
    let _num = this.parse(num);

    this.num *= _num.number;
    this.exp += _num.exponent;
    return this;
  }

  divide(num: number | MathCalculator): MathCalculator {
    let _num = this.parse(num);
    _num = this.normalize(_num);

    this.num /= _num.number;
    return this;
  }
}

export function Calc(num: number | MathCalculator): MathCalculator {
  return new MathCalculator(num);
}