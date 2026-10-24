import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice } from '../src/pricing.js';

const vehicle = {
  pricePerDayPaise: 125000,
  weeklyDiscountPercent: 10,
  monthlyDiscountPercent: 20,
};

test('calculates an undiscounted short booking in integer paise', () => {
  assert.deepEqual(calculatePrice(vehicle, '2026-11-01', '2026-11-04'), {
    days: 3,
    basePaise: 375000,
    discountPaise: 0,
    platformFeePaise: 37500,
    taxPaise: 74250,
    totalPaise: 486750,
    depositPaise: 500000,
  });
});

test('applies weekly and monthly discounts using integer arithmetic', () => {
  const weekly = calculatePrice(vehicle, '2026-11-01', '2026-11-08');
  assert.equal(weekly.discountPaise, 87500);
  assert.equal(weekly.totalPaise, 1022175);

  const monthly = calculatePrice(vehicle, '2026-11-01', '2026-12-01');
  assert.equal(monthly.discountPaise, 750000);
  assert.equal(monthly.totalPaise, 3894000);
});

test('rejects invalid or non-increasing calendar dates', () => {
  assert.throws(() => calculatePrice(vehicle, '2026-02-31', '2026-03-03'), { code: 'INVALID_DATES' });
  assert.throws(() => calculatePrice(vehicle, '2026-11-08', '2026-11-08'), { code: 'INVALID_DATES' });
  assert.throws(() => calculatePrice(vehicle, '2026-11-09', '2026-11-08'), { code: 'INVALID_DATES' });
});