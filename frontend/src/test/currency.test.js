import { describe, it, expect } from 'vitest';
import { formatINR } from '../utils/currency';

describe('formatINR utility', () => {
  it('formats USD amount into INR currency string with Lakh/Crore grouping and ₹ symbol', () => {
    // 26000 USD * 83 = 2158000 INR -> ₹21,58,000
    expect(formatINR(26000)).toBe('₹21,58,000');
  });

  it('formats large numbers into Crore grouping correctly', () => {
    // 150000 USD * 83 = 12450000 INR (1 Crore 24 Lakh 50 Thousand) -> ₹1,24,50,000
    expect(formatINR(150000)).toBe('₹1,24,50,000');
  });

  it('handles zero and invalid inputs gracefully', () => {
    expect(formatINR(0)).toBe('₹0');
    expect(formatINR(null)).toBe('₹0');
    expect(formatINR(undefined)).toBe('₹0');
  });
});
