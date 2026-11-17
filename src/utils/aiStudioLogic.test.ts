import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_AI_CREDITS, INITIAL_BRAND_KIT, INITIAL_AI_LIBRARY } from '../data/aiStudio';
import {
  aspectRatioToMediaPreset,
  buildSocialComposerPayload,
  canAffordAiCredits,
  deductAiCredits,
  generateFakeImageResults,
  generateFakeTextResult,
  generateFakeToolResult,
  generateFakeVideoResult,
  removeFromAiLibrary,
  saveResultToLibrary,
  topUpDemoCredits,
} from './aiStudioLogic';
import { AI_CREDIT_COSTS } from '../theme/tokens';

test('deductAiCredits enforces balance guard and topUpDemoCredits restores funds', () => {
  assert.equal(canAffordAiCredits(INITIAL_AI_CREDITS, AI_CREDIT_COSTS.video), true);
  assert.equal(canAffordAiCredits(1, AI_CREDIT_COSTS.text), false);

  const denied = deductAiCredits(5, AI_CREDIT_COSTS.image);
  assert.equal(denied.ok, false);
  assert.equal(denied.nextBalance, 5);

  const spent = deductAiCredits(120, AI_CREDIT_COSTS.image);
  assert.equal(spent.ok, true);
  assert.equal(spent.nextBalance, 114);

  const topped = topUpDemoCredits(spent.nextBalance, 50);
  assert.equal(topped, 164);
});

test('generateFakeTextResult handles caption, paraphrase, and translate EN/AR modes', () => {
  const captionRes = generateFakeTextResult({
    mode: 'caption',
    tone: 'bold',
    prompt: 'Friday skin fade openings',
    translateDirection: 'en_to_ar',
  });
  assert.ok(captionRes.outputEn.includes('Friday skin fade openings'));
  assert.equal(captionRes.mediaPresetId, 'reel_fade');

  const paraRes = generateFakeTextResult({
    mode: 'paraphrase',
    tone: 'luxury',
    prompt: 'Book with us soon',
    translateDirection: 'en_to_ar',
  });
  assert.ok(paraRes.outputEn.includes('Polished rewrite'));

  const trRes = generateFakeTextResult({
    mode: 'translate',
    tone: 'warm',
    prompt: 'Welcome to our salon',
    translateDirection: 'en_to_ar',
  });
  assert.ok(trRes.outputAr.includes('Welcome to our salon'));
});

test('generateFakeImageResults returns exactly 4 placeholder results with matching aspect ratio', () => {
  const results = generateFakeImageResults({
    prompt: 'Minimalist barber chair sunset',
    style: 'warm_film',
    aspectRatio: '9:16',
  });
  assert.equal(results.length, 4);
  assert.equal(results[0].aspectRatio, '9:16');
  assert.equal(results[0].mediaPresetId, aspectRatioToMediaPreset('9:16'));
  assert.notEqual(results[0].titleEn, results[1].titleEn);
});

test('generateFakeVideoResult includes ready in a few minutes wording for both modes', () => {
  const t2v = generateFakeVideoResult({
    mode: 'text_to_video',
    prompt: 'Slow pan across chairs',
    sourcePresetId: 'reel_fade',
  });
  assert.ok(t2v.statusMessageEn.toLowerCase().includes('ready in a few minutes'));

  const i2a = generateFakeVideoResult({
    mode: 'image_to_animation',
    prompt: 'Subtle brass light flicker',
    sourcePresetId: 'studio_tour',
  });
  assert.equal(i2a.mediaPresetId, 'studio_tour');
});

test('generateFakeToolResult covers bg_remover, upscaler, and brand_kit', () => {
  const bg = generateFakeToolResult({
    toolKind: 'bg_remover',
    assetId: 'asset-chair',
    upscaleFactor: '2x',
    brandKit: INITIAL_BRAND_KIT,
  });
  assert.ok(bg.summaryEn.toLowerCase().includes('transparent'));

  const up = generateFakeToolResult({
    toolKind: 'upscaler',
    assetId: 'asset-tailor',
    upscaleFactor: '4x',
    brandKit: INITIAL_BRAND_KIT,
  });
  assert.ok(up.titleEn.includes('4320 × 4320'));

  const kit = generateFakeToolResult({
    toolKind: 'brand_kit',
    assetId: 'asset-chair',
    upscaleFactor: '2x',
    brandKit: INITIAL_BRAND_KIT,
  });
  assert.ok(kit.captionEn.includes(INITIAL_BRAND_KIT.brandName));
});

test('saveResultToLibrary deduplicates and buildSocialComposerPayload maps language copy', () => {
  const newItem = {
    id: 'lib-test-1',
    kind: 'image' as const,
    titleEn: 'Concept 1',
    titleAr: 'مقترح 1',
    captionEn: 'English promo caption',
    captionAr: 'نص ترويجي عربي',
    badgeEn: 'Image',
    badgeAr: 'صورة',
    mediaPresetId: 'promo_flyer' as const,
    savedAtLabelEn: 'Just now',
    savedAtLabelAr: 'الآن',
  };

  const first = saveResultToLibrary(INITIAL_AI_LIBRARY, newItem);
  assert.equal(first.added, true);
  assert.equal(first.library.length, INITIAL_AI_LIBRARY.length + 1);

  const dup = saveResultToLibrary(first.library, newItem);
  assert.equal(dup.added, false);
  assert.equal(dup.library.length, first.library.length);

  const enPayload = buildSocialComposerPayload(newItem, 'en');
  assert.equal(enPayload.caption, 'English promo caption');
  assert.equal(enPayload.mediaPresetId, 'promo_flyer');

  const arPayload = buildSocialComposerPayload(newItem, 'ar');
  assert.equal(arPayload.caption, 'نص ترويجي عربي');

  const trimmed = removeFromAiLibrary(first.library, 'lib-test-1');
  assert.equal(trimmed.length, INITIAL_AI_LIBRARY.length);
});
