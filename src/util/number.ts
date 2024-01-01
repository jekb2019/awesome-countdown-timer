export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

export function convertToInteger(value: any): number {
  const number = convertToNumber(value);
  return Math.round(number);
}

export function convertToNumber(value: any): number {
  if (isNaN(value)) {
    throw new Error(`Cannot convert ${value} to integer`);
  }
  return Number(value);
}

export function isPositiveNumber(value: number): boolean {
  return value >= 0;
}
