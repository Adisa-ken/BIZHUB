import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_SOCIAL_ANALYTICS, INITIAL_SOCIAL_POSTS } from '../data/socialHub';
import {
  buildMonthGrid,
  computeSocialAnalyticsTotals,
  createSocialPost,
  deleteSocialPost,
  groupScheduledPostsByDate,
  rescheduleSocialPost,
  swapQueuedPostSlots,
  validateSocialPostInput,
} from './socialHubLogic';

test('buildMonthGrid builds full weeks for November 2026 with expected day count', () => {
  const cells = buildMonthGrid(2026, 10); // Nov 2026 (0-indexed month 10)
  assert.equal(cells.length % 7, 0);
  const novDays = cells.filter((c) => c.inCurrentMonth);
  assert.equal(novDays.length, 30);
  assert.equal(novDays[0].dateKey, '2026-11-01');
  assert.equal(novDays[29].dateKey, '2026-11-30');
});

test('validateSocialPostInput validates caption/media, channels, and schedule date/time', () => {
  assert.equal(
    validateSocialPostInput({
      caption: '   ',
      channels: ['instagram'],
      dateKey: '2026-11-20',
      time24: '14:00',
      mediaPresetId: null,
      targetStatus: 'scheduled',
    }).errorKey,
    'captionOrMediaRequired'
  );

  assert.equal(
    validateSocialPostInput({
      caption: 'Weekend special!',
      channels: [],
      dateKey: '2026-11-20',
      time24: '14:00',
      mediaPresetId: null,
      targetStatus: 'scheduled',
    }).errorKey,
    'channelsRequired'
  );

  assert.equal(
    validateSocialPostInput({
      caption: 'Weekend special!',
      channels: ['instagram', 'x'],
      dateKey: '2026-11-20',
      time24: '14:00',
      mediaPresetId: 'reel_fade',
      targetStatus: 'scheduled',
    }).valid,
    true
  );
});

test('createSocialPost schedules or saves draft and updates calendar grouping', () => {
  const { posts, created } = createSocialPost(INITIAL_SOCIAL_POSTS, {
    caption: 'Fresh midweek appointment slots live now.',
    channels: ['instagram', 'linkedin'],
    dateKey: '2026-11-22',
    time24: '10:00',
    mediaPresetId: 'promo_flyer',
    status: 'scheduled',
  });

  assert.equal(posts.length, INITIAL_SOCIAL_POSTS.length + 1);
  const grouped = groupScheduledPostsByDate(posts);
  assert.ok(grouped['2026-11-22']?.some((p) => p.id === created.id));

  const afterDraft = createSocialPost(posts, {
    caption: 'Draft teaser idea',
    channels: ['x'],
    dateKey: '2026-11-25',
    time24: '09:00',
    mediaPresetId: null,
    status: 'draft',
  });
  const groupedAfterDraft = groupScheduledPostsByDate(afterDraft.posts);
  assert.equal(groupedAfterDraft['2026-11-25'], undefined);
});

test('rescheduleSocialPost, swapQueuedPostSlots, and deleteSocialPost update queue accurately', () => {
  const rescheduled = rescheduleSocialPost(
    INITIAL_SOCIAL_POSTS,
    'sp-1',
    '2026-11-28',
    '19:30'
  );
  const target = rescheduled.find((p) => p.id === 'sp-1');
  assert.equal(target?.dateKey, '2026-11-28');
  assert.equal(target?.time24, '19:30');

  const swapped = swapQueuedPostSlots(INITIAL_SOCIAL_POSTS, 'sp-1', 'sp-2');
  const sp1 = swapped.find((p) => p.id === 'sp-1');
  const sp2 = swapped.find((p) => p.id === 'sp-2');
  assert.equal(sp1?.dateKey, '2026-11-18');
  assert.equal(sp2?.dateKey, '2026-11-17');

  const afterDelete = deleteSocialPost(swapped, 'sp-1');
  assert.equal(afterDelete.length, swapped.length - 1);
});

test('computeSocialAnalyticsTotals aggregates reach, engagement, rate, and post counts', () => {
  const totals = computeSocialAnalyticsTotals(
    INITIAL_SOCIAL_ANALYTICS,
    INITIAL_SOCIAL_POSTS
  );
  assert.ok(totals.totalReach > 40000);
  assert.ok(totals.totalEngagement > 4000);
  assert.ok(totals.avgEngagementRate > 5);
  assert.equal(totals.scheduledCount, 6);
  assert.equal(totals.draftCount, 1);
});
