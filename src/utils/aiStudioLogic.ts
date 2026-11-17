import {
  AI_BRAND_PALETTES,
  AI_IMAGE_STYLE_META,
  AI_TOOL_SAMPLE_ASSETS,
  type AiBrandKitState,
  type AiGeneratedImageResult,
  type AiGeneratedTextResult,
  type AiGeneratedToolResult,
  type AiGeneratedVideoResult,
  type AiLibraryItem,
} from '../data/aiStudio';
import { SOCIAL_MEDIA_PRESETS, type SocialMediaPresetId } from '../data/socialHub';
import type {
  AiAspectRatio,
  AiStylePresetId,
  AiTextMode,
  AiToneId,
  AiToolKind,
  AiTranslateDirection,
  AiVideoMode,
  Language,
} from '../theme/tokens';

export function canAffordAiCredits(balance: number, cost: number): boolean {
  return balance >= cost && cost >= 0;
}

export function deductAiCredits(
  balance: number,
  cost: number
): { ok: boolean; nextBalance: number } {
  if (!canAffordAiCredits(balance, cost)) {
    return { ok: false, nextBalance: balance };
  }
  return { ok: true, nextBalance: balance - cost };
}

export function topUpDemoCredits(balance: number, amount = 50): number {
  return Math.max(0, balance) + Math.max(0, amount);
}

export function aspectRatioToMediaPreset(ratio: AiAspectRatio): SocialMediaPresetId {
  if (ratio === '9:16') return 'reel_fade';
  if (ratio === '4:5') return 'promo_flyer';
  if (ratio === '16:9') return 'studio_tour';
  return 'carousel_before_after';
}

const TONE_PREFIX: Record<AiToneId, { en: string; ar: string }> = {
  bold: {
    en: 'Sharp look, zero wait.',
    ar: 'إطلالة حادة بدون انتظار.',
  },
  warm: {
    en: 'Your neighborhood studio, ready for you.',
    ar: 'استوديو حيّك الأقرب، جاهز لاستقبالك.',
  },
  luxury: {
    en: 'Crafted detail, unhurried care.',
    ar: 'عناية دقيقة وتفاصيل مدروسة بهدوء.',
  },
  playful: {
    en: 'Fresh vibe check — chairs & mats are calling.',
    ar: 'موعدك الجديد يناديك — طاقة متجددة اليوم!',
  },
};

export function generateFakeTextResult(input: {
  mode: AiTextMode;
  tone: AiToneId;
  prompt: string;
  translateDirection: AiTranslateDirection;
}): AiGeneratedTextResult {
  const cleanPrompt = input.prompt.trim();
  const id = `ai-txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const toneLine = TONE_PREFIX[input.tone];

  if (input.mode === 'translate') {
    const isEnToAr = input.translateDirection === 'en_to_ar';
    const outputEn = isEnToAr
      ? `EN source: ${cleanPrompt}`
      : `Translated (Demo): "${cleanPrompt}" -> Reserve your local studio visit effortlessly on BizHub with instant slot confirmation.`;
    const outputAr = isEnToAr
      ? `ترجمة تجريبية: "${cleanPrompt}" ← احجز جلستك المحلية بسهولة عبر BizHub مع تأكيد فوري للموعد.`
      : `النص العربي الأصلي: ${cleanPrompt}`;

    return {
      id,
      modeLabelEn: isEnToAr ? 'Translate EN → AR' : 'Translate AR → EN',
      modeLabelAr: isEnToAr ? 'ترجمة EN ← AR' : 'ترجمة AR ← EN',
      tone: input.tone,
      outputEn,
      outputAr,
      hashtags: '#BizHub #LocalPros #BilingualPromo',
      mediaPresetId: 'promo_flyer',
    };
  }

  if (input.mode === 'paraphrase') {
    return {
      id,
      modeLabelEn: 'Paraphrase',
      modeLabelAr: 'إعادة صياغة',
      tone: input.tone,
      outputEn: `${toneLine.en} Polished rewrite: ${cleanPrompt} — Tap Book on BizHub to lock in your spot today.`,
      outputAr: `${toneLine.ar} صياغة محسّنة: ${cleanPrompt} — اضغط احجز الآن عبر BizHub لتثبيت موعدك اليوم.`,
      hashtags: '#BizHub #BookLocal #StudioUpdate',
      mediaPresetId: 'carousel_before_after',
    };
  }

  return {
    id,
    modeLabelEn: 'Caption writer',
    modeLabelAr: 'كاتب الكابشن',
    tone: input.tone,
    outputEn: `${toneLine.en} ${cleanPrompt} Open slots are live this week — reserve in 3 quick taps on BizHub.`,
    outputAr: `${toneLine.ar} ${cleanPrompt} المواعيد المتاحة مفتوحة هذا الأسبوع — احجز في 3 خطوات عبر BizHub.`,
    hashtags: '#BizHub #LocalStudio #BookNow',
    mediaPresetId: 'reel_fade',
  };
}

export function generateFakeImageResults(input: {
  prompt: string;
  style: AiStylePresetId;
  aspectRatio: AiAspectRatio;
}): AiGeneratedImageResult[] {
  const cleanPrompt = input.prompt.trim();
  const styleMeta = AI_IMAGE_STYLE_META[input.style];
  const presetId = aspectRatioToMediaPreset(input.aspectRatio);
  const stamp = Date.now();

  const angles = [
    {
      en: 'Hero Close-Up',
      ar: 'لقطة قريبة رئيسية',
    },
    {
      en: 'Wide Studio Frame',
      ar: 'إطار استوديو عريض',
    },
    {
      en: 'Detail & Texture',
      ar: 'تفاصيل وملمس',
    },
    {
      en: 'Promo Card Layout',
      ar: 'تصميم بطاقة ترويجية',
    },
  ];

  return angles.map((angle, index) => ({
    id: `ai-img-${stamp}-${index + 1}`,
    index: index + 1,
    titleEn: `${angle.en} · ${input.aspectRatio}`,
    titleAr: `${angle.ar} · ${input.aspectRatio}`,
    prompt: cleanPrompt,
    style: input.style,
    aspectRatio: input.aspectRatio,
    gradientClass: styleMeta.gradients[index],
    captionEn: `${cleanPrompt} — styled in ${input.style.replace('_', ' ')} (${angle.en}, ${input.aspectRatio}).`,
    captionAr: `${cleanPrompt} — بأسلوب ${input.style.replace('_', ' ')} (${angle.ar}، ${input.aspectRatio}).`,
    mediaPresetId: presetId,
  }));
}

export function generateFakeVideoResult(input: {
  mode: AiVideoMode;
  prompt: string;
  sourcePresetId: SocialMediaPresetId;
}): AiGeneratedVideoResult {
  const cleanPrompt = input.prompt.trim();
  const preset =
    SOCIAL_MEDIA_PRESETS.find((p) => p.id === input.sourcePresetId) ??
    SOCIAL_MEDIA_PRESETS[0];

  const isTextToVideo = input.mode === 'text_to_video';

  return {
    id: `ai-vid-${Date.now()}`,
    modeLabelEn: isTextToVideo ? 'Text-to-video' : 'Image-to-animation',
    modeLabelAr: isTextToVideo ? 'نص إلى فيديو' : 'تحريك صورة',
    prompt: cleanPrompt,
    sourceLabelEn: preset.labelEn,
    sourceLabelAr: preset.labelAr,
    statusMessageEn: 'Ready in a few minutes — your placeholder clip is queued (Demo).',
    statusMessageAr: 'سيكون جاهزاً خلال بضع دقائق — تم إدراج المقطع المبدئي في الانتظار (تجريبي).',
    gradientClass: preset.toneClass,
    captionEn: isTextToVideo
      ? `New studio reel: ${cleanPrompt} — watch the full transformation and book your slot on BizHub.`
      : `Animated showcase from ${preset.labelEn}: ${cleanPrompt}`,
    captionAr: isTextToVideo
      ? `فيديو جديد للاستوديو: ${cleanPrompt} — شاهد التحول الكامل واحجز موعدك على BizHub.`
      : `عرض متحرك من ${preset.labelAr}: ${cleanPrompt}`,
    mediaPresetId: isTextToVideo ? 'reel_fade' : preset.id,
  };
}

export function generateFakeToolResult(input: {
  toolKind: AiToolKind;
  assetId: string;
  upscaleFactor: '2x' | '4x';
  brandKit: AiBrandKitState;
}): AiGeneratedToolResult {
  const asset =
    AI_TOOL_SAMPLE_ASSETS.find((a) => a.id === input.assetId) ?? AI_TOOL_SAMPLE_ASSETS[0];
  const palette = AI_BRAND_PALETTES[input.brandKit.paletteId];
  const id = `ai-tool-${Date.now()}`;

  if (input.toolKind === 'bg_remover') {
    return {
      id,
      toolKind: 'bg_remover',
      titleEn: `Cutout ready · ${asset.labelEn}`,
      titleAr: `تم عزل الخلفية · ${asset.labelAr}`,
      summaryEn: 'Subject isolated on transparent alpha grid (Demo placeholder).',
      summaryAr: 'تم عزل العنصر على خلفية شفافة جاهزة للتصميم (عنصر مبدئي).',
      captionEn: `Clean studio spotlight featuring ${asset.labelEn} — crisp promo visual ready for your feed.`,
      captionAr: `لقطة استوديو معزولة الخلفية لـ ${asset.labelAr} — جاهزة للنشر الترويجي.`,
      mediaPresetId: asset.mediaPresetId,
      accentGradient: asset.gradientClass,
    };
  }

  if (input.toolKind === 'upscaler') {
    const targetRes =
      input.upscaleFactor === '4x' ? asset.resolutionAfter4x : asset.resolutionAfter2x;
    return {
      id,
      toolKind: 'upscaler',
      titleEn: `Upscaled ${input.upscaleFactor} · ${targetRes}`,
      titleAr: `رفع الدقة ${input.upscaleFactor} · ${targetRes}`,
      summaryEn: `Boosted from ${asset.resolutionBefore} to ${targetRes} (Demo placeholder).`,
      summaryAr: `تم التحسين من ${asset.resolutionBefore} إلى ${targetRes} (عنصر مبدئي).`,
      captionEn: `Ultra-crisp ${input.upscaleFactor} detail shot of ${asset.labelEn} — book your session on BizHub.`,
      captionAr: `صورة عالية الوضوح بدقة ${input.upscaleFactor} لـ ${asset.labelAr} — احجز جلستك عبر BizHub.`,
      mediaPresetId: asset.mediaPresetId,
      accentGradient: asset.gradientClass,
    };
  }

  const cleanBrand = input.brandKit.brandName.trim() || 'BizHub Studio';
  const cleanMono = input.brandKit.monogram.trim().slice(0, 3).toUpperCase() || 'BH';
  const toneLine = TONE_PREFIX[input.brandKit.toneOfVoice];

  return {
    id,
    toolKind: 'brand_kit',
    titleEn: `Brand Kit · ${cleanBrand} (${cleanMono})`,
    titleAr: `طقم العلامة · ${cleanBrand} (${cleanMono})`,
    summaryEn: `${palette.labelEn} · Tone: ${input.brandKit.toneOfVoice}`,
    summaryAr: `${palette.labelAr} · النبرة: ${input.brandKit.toneOfVoice}`,
    captionEn: `${cleanBrand}: ${toneLine.en} Reserve this week's signature slots directly on BizHub.`,
    captionAr: `${cleanBrand}: ${toneLine.ar} احجز مواعيدك المميزة هذا الأسبوع مباشرة عبر BizHub.`,
    mediaPresetId: 'promo_flyer',
    accentGradient: palette.gradientClass,
  };
}

export function saveResultToLibrary(
  library: AiLibraryItem[],
  item: AiLibraryItem
): { library: AiLibraryItem[]; added: boolean } {
  if (library.some((existing) => existing.id === item.id)) {
    return { library, added: false };
  }
  return {
    library: [item, ...library],
    added: true,
  };
}

export function removeFromAiLibrary(
  library: AiLibraryItem[],
  itemId: string
): AiLibraryItem[] {
  return library.filter((item) => item.id !== itemId);
}

export function buildSocialComposerPayload(
  input: {
    captionEn: string;
    captionAr: string;
    mediaPresetId: SocialMediaPresetId | null;
  },
  lang: Language
): { caption: string; mediaPresetId: SocialMediaPresetId | null } {
  return {
    caption: lang === 'ar' ? input.captionAr : input.captionEn,
    mediaPresetId: input.mediaPresetId,
  };
}
