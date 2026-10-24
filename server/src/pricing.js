const DAY_MS = 24 * 60 * 60 * 1000;
const PLATFORM_FEE_BPS = 1000;
const GST_BPS = 1800;
const DEFAULT_DEPOSIT_PAISE = 500000;

function parseUtcDate(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

export function calculatePrice(vehicle, startDateValue, endDateValue) {
  const startDate = parseUtcDate(startDateValue);
  const endDate = parseUtcDate(endDateValue);
  if (!startDate || !endDate || endDate <= startDate) {
    const error = new Error('Choose a valid return date after the pick-up date.');
    error.statusCode = 400;
    error.code = 'INVALID_DATES';
    throw error;
  }

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / DAY_MS);
  const basePaise = vehicle.pricePerDayPaise * days;
  const discountPercent = days >= 30
    ? vehicle.monthlyDiscountPercent || 0
    : days >= 7 ? vehicle.weeklyDiscountPercent || 0 : 0;
  const discountBasisPoints = Math.round(discountPercent * 100);
  const discountPaise = Math.floor(basePaise * discountBasisPoints / 10000);
  const discountedBase = basePaise - discountPaise;
  const platformFeePaise = Math.floor(discountedBase * PLATFORM_FEE_BPS / 10000);
  const taxPaise = Math.floor((discountedBase + platformFeePaise) * GST_BPS / 10000);

  return {
    days,
    basePaise,
    discountPaise,
    platformFeePaise,
    taxPaise,
    totalPaise: discountedBase + platformFeePaise + taxPaise,
    depositPaise: DEFAULT_DEPOSIT_PAISE,
  };
}

export function toUtcDate(value) {
  return parseUtcDate(value);
}