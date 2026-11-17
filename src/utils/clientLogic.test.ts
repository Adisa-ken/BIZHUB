import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESSES, INITIAL_BOOKINGS } from '../data/businesses';
import {
  buildSevenDayStrip,
  cancelBookingById,
  createBookingRecord,
  DEFAULT_EXPLORE_FILTERS,
  filterBusinesses,
  formatPriceLevel,
  rescheduleBookingById,
  validateHelpMessage,
} from './clientLogic';

test('dataset includes exactly 12 businesses across all 5 categories', () => {
  assert.equal(BUSINESSES.length, 12);
  const categories = new Set(BUSINESSES.map((b) => b.category));
  assert.deepEqual(
    [...categories].sort(),
    ['barber', 'clinic', 'gym', 'salon', 'tailor']
  );
});

test('filterBusinesses filters by query, category, nearby, price, availability, and cards', () => {
  const barbers = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    category: 'barber',
  });
  assert.equal(barbers.length, 2);

  const nearbyCardAvailable = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    nearbyOnly: true,
    availableNowOnly: true,
    acceptsCardsOnly: true,
  });
  assert.ok(nearbyCardAvailable.every((b) => b.distanceKm <= 2.0 && b.availableNow && b.acceptsCards));

  const queryMatch = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    query: 'balayage',
  });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'biz-7');

  const budgetOnly = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    priceLevel: 1,
  });
  assert.ok(budgetOnly.every((b) => b.priceLevel === 1));
  assert.equal(formatPriceLevel(2), '$$');
});

test('buildSevenDayStrip generates 7 sequential days', () => {
  const strip = buildSevenDayStrip(new Date(2026, 10, 17), 'en');
  assert.equal(strip.length, 7);
  assert.equal(strip[0].dateKey, '2026-11-17');
  assert.equal(strip[6].dateKey, '2026-11-23');
});

test('booking creation, cancellation, and rescheduling update state cleanly', () => {
  const biz = BUSINESSES[0];
  const created = createBookingRecord({
    id: 'bk-new',
    business: biz,
    serviceId: biz.services[0].id,
    staffId: biz.staff[0].id,
    dateKey: '2026-11-19',
    timeSlot: '13:30',
  });
  assert.equal(created.status, 'upcoming');
  assert.equal(created.depositUsd, biz.services[0].depositUsd);

  const afterCancel = cancelBookingById([created, ...INITIAL_BOOKINGS], 'bk-new');
  assert.equal(afterCancel.find((b) => b.id === 'bk-new')?.status, 'cancelled');

  const afterReschedule = rescheduleBookingById(
    INITIAL_BOOKINGS,
    'bk-101',
    '2026-11-22',
    '19:00'
  );
  const updated = afterReschedule.find((b) => b.id === 'bk-101');
  assert.equal(updated?.dateKey, '2026-11-22');
  assert.equal(updated?.timeSlot, '19:00');
});

test('validateHelpMessage checks name, email, and message length', () => {
  const invalid = validateHelpMessage({ name: '', email: 'bad', message: 'hi' });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.name, 'nameRequired');
  assert.equal(invalid.errors.email, 'emailInvalid');
  assert.equal(invalid.errors.message, 'messageTooShort');

  const valid = validateHelpMessage({
    name: 'Alex',
    email: 'alex@bizhub.demo',
    message: 'Need help updating my booking slot.',
  });
  assert.equal(valid.valid, true);
});

import {
  addRecentSearch,
  extractProfessionals,
} from './clientLogic';

test('filterBusinesses sorts by top_rated, lowest_price, and respects maxDistanceKm', () => {
  const rated = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    sortBy: 'top_rated',
  });
  assert.ok(rated[0].rating >= rated[1].rating);

  const cheapest = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    sortBy: 'lowest_price',
  });
  assert.equal(cheapest[0].priceLevel, 1);

  const within1Km = filterBusinesses(BUSINESSES, {
    ...DEFAULT_EXPLORE_FILTERS,
    maxDistanceKm: 1,
  });
  assert.ok(within1Km.every((b) => b.distanceKm <= 1));
});

test('extractProfessionals produces professionals with 3-4 portfolio photos and addRecentSearch deduplicates', () => {
  const pros = extractProfessionals(BUSINESSES);
  assert.ok(pros.length >= BUSINESSES.length);
  assert.ok(
    pros.every((p) => p.portfolioPhotos.length >= 3 && p.portfolioPhotos.length <= 4)
  );

  const recents = addRecentSearch(['barber shop', 'gym near me'], 'Gym Near Me');
  assert.deepEqual(recents, ['Gym Near Me', 'barber shop']);
});
