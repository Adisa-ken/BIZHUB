import type { SocialMediaPresetId } from './socialHub';
import type {
  AiAspectRatio,
  AiStudioTabId,
  AiStylePresetId,
  AiToneId,
} from '../theme/tokens';

export const INITIAL_AI_CREDITS = 120;
export const DEMO_TOP_UP_AMOUNT = 50;

export type AiLibraryItemKind = 'text' | 'image' | 'video' | 'tool';

export interface AiLibraryItem {
  id: string;
  kind: AiLibraryItemKind;
  titleEn: string;
  titleAr: string;
  captionEn: string;
  captionAr: string;
  badgeEn: string;
  badgeAr: string;
  mediaPresetId: SocialMediaPresetId | null;
  gradientClass?: string;
  aspectRatio?: AiAspectRatio;
  savedAtLabelEn: string;
  savedAtLabelAr: string;
}

export interface AiGeneratedTextResult {
  id: string;
  modeLabelEn: string;
  modeLabelAr: string;
  tone: AiToneId;
  outputEn: string;
  outputAr: string;
  hashtags: string;
  mediaPresetId: SocialMediaPresetId | null;
}

export interface AiGeneratedImageResult {
  id: string;
  index: number;
  titleEn: string;
  titleAr: string;
  prompt: string;
  style: AiStylePresetId;
  aspectRatio: AiAspectRatio;
  gradientClass: string;
  captionEn: string;
  captionAr: string;
  mediaPresetId: SocialMediaPresetId;
}

export interface AiGeneratedVideoResult {
  id: string;
  modeLabelEn: string;
  modeLabelAr: string;
  prompt: string;
  sourceLabelEn: string;
  sourceLabelAr: string;
  statusMessageEn: string;
  statusMessageAr: string;
  gradientClass: string;
  captionEn: string;
  captionAr: string;
  mediaPresetId: SocialMediaPresetId;
}

export interface AiGeneratedToolResult {
  id: string;
  toolKind: 'bg_remover' | 'upscaler' | 'brand_kit';
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  captionEn: string;
  captionAr: string;
  mediaPresetId: SocialMediaPresetId;
  accentGradient: string;
}

export interface AiBrandKitState {
  brandName: string;
  monogram: string;
  paletteId: 'coral_navy' | 'amber_charcoal' | 'emerald_ivory';
  toneOfVoice: AiToneId;
}

export interface AiToolSampleAsset {
  id: string;
  labelEn: string;
  labelAr: string;
  resolutionBefore: string;
  resolutionAfter2x: string;
  resolutionAfter4x: string;
  mediaPresetId: SocialMediaPresetId;
  gradientClass: string;
}

export const AI_TEXT_SAMPLE_PROMPTS: Record<'caption' | 'paraphrase' | 'translate', { en: string; ar: string }> = {
  caption: {
    en: 'Midweek skin fade + hot towel refresh slots open at Crescent Blade Studio.',
    ar: 'مواعيد قصة الشعر التدريجية مع الفوطة الدافئة متاحة منتصف الأسبوع في كريسنت بليد.',
  },
  paraphrase: {
    en: 'We have some morning haircut appointments left tomorrow so message or tap book now.',
    ar: 'لدينا بعض مواعيد الحلاقة الصباحية المتاحة غداً، يمكنك الحجز الآن بسهولة.',
  },
  translate: {
    en: 'Book your tailored suit fitting or grooming session in three fast taps on BizHub.',
    ar: 'احجز جلسة قياس البدلة أو العناية الخاصة بك في ثلاث خطوات سريعة عبر BizHub.',
  },
};

export const AI_IMAGE_STYLE_META: Record<
  AiStylePresetId,
  { gradients: [string, string, string, string]; tagEn: string; tagAr: string }
> = {
  editorial: {
    gradients: [
      'from-rose-500/35 via-amber-500/20 to-slate-900/50',
      'from-amber-400/30 via-rose-500/20 to-indigo-950/60',
      'from-slate-700/40 via-rose-400/25 to-slate-900/70',
      'from-orange-400/30 via-slate-800/40 to-amber-500/25',
    ],
    tagEn: 'Crisp studio light · 50mm lens',
    tagAr: 'إضاءة استوديو واضحة · عدسة 50mm',
  },
  neon_noir: {
    gradients: [
      'from-fuchsia-500/35 via-indigo-900/50 to-slate-950/80',
      'from-cyan-400/30 via-rose-500/25 to-slate-950/80',
      'from-amber-500/30 via-purple-800/40 to-slate-950/80',
      'from-rose-500/35 via-teal-500/20 to-slate-950/80',
    ],
    tagEn: 'After-hours glow · rim highlights',
    tagAr: 'إضاءة مسائية · حواف نيون بارزة',
  },
  minimal_studio: {
    gradients: [
      'from-slate-300/30 via-slate-500/15 to-slate-800/35',
      'from-teal-400/25 via-slate-600/20 to-slate-900/45',
      'from-amber-200/25 via-slate-500/20 to-slate-800/40',
      'from-sky-300/25 via-slate-600/20 to-slate-900/45',
    ],
    tagEn: 'Clean backdrop · balanced shadows',
    tagAr: 'خلفية نظيفة · ظلال متوازنة',
  },
  warm_film: {
    gradients: [
      'from-amber-500/35 via-orange-600/20 to-stone-900/60',
      'from-yellow-500/25 via-rose-600/25 to-stone-900/60',
      'from-orange-400/30 via-emerald-700/20 to-stone-950/60',
      'from-rose-400/30 via-amber-700/25 to-stone-900/60',
    ],
    tagEn: 'Golden hour grain · 35mm film',
    tagAr: 'دفء الساعة الذهبية · فيلم 35mm',
  },
};

export const AI_TOOL_SAMPLE_ASSETS: AiToolSampleAsset[] = [
  {
    id: 'asset-chair',
    labelEn: 'Barber Chair & Brass Clippers',
    labelAr: 'كرسي الحلاقة وأدوات التشذيب النحاسية',
    resolutionBefore: '1080 × 1350',
    resolutionAfter2x: '2160 × 2700',
    resolutionAfter4x: '4320 × 5400',
    mediaPresetId: 'promo_flyer',
    gradientClass: 'from-rose-500/30 via-amber-500/20 to-slate-900/50',
  },
  {
    id: 'asset-tailor',
    labelEn: 'Bespoke Wool Jacket Lapel',
    labelAr: 'تفصيل سترة صوفية في المشغل',
    resolutionBefore: '1080 × 1080',
    resolutionAfter2x: '2160 × 2160',
    resolutionAfter4x: '4320 × 4320',
    mediaPresetId: 'carousel_before_after',
    gradientClass: 'from-amber-500/30 via-emerald-500/15 to-slate-900/55',
  },
  {
    id: 'asset-gym',
    labelEn: 'Kettlebell & Turf Conditioning Zone',
    labelAr: 'منطقة الأوزان واللياقة البدنية',
    resolutionBefore: '1280 × 720',
    resolutionAfter2x: '2560 × 1440',
    resolutionAfter4x: '5120 × 2880',
    mediaPresetId: 'studio_tour',
    gradientClass: 'from-sky-500/30 via-indigo-600/20 to-slate-900/60',
  },
];

export const AI_BRAND_PALETTES: Record<
  AiBrandKitState['paletteId'],
  {
    labelEn: string;
    labelAr: string;
    swatches: [string, string, string];
    gradientClass: string;
  }
> = {
  coral_navy: {
    labelEn: 'Coral & Midnight Navy',
    labelAr: 'مرجاني وكحلي داكن',
    swatches: ['#0B1120', '#FF6B5B', '#F59E0B'],
    gradientClass: 'from-[#FF6B5B]/35 via-[#1A2642] to-[#0B1120]',
  },
  amber_charcoal: {
    labelEn: 'Amber & Slate Craft',
    labelAr: 'كهرماني وفحمي دافئ',
    swatches: ['#18181B', '#F59E0B', '#FDE68A'],
    gradientClass: 'from-[#F59E0B]/35 via-stone-800/70 to-zinc-950',
  },
  emerald_ivory: {
    labelEn: 'Emerald & Studio Crisp',
    labelAr: 'زمردي وعاجي حديث',
    swatches: ['#064E3B', '#34D399', '#F8FAFC'],
    gradientClass: 'from-[#34D399]/30 via-emerald-900/60 to-slate-950',
  },
};

export const INITIAL_BRAND_KIT: AiBrandKitState = {
  brandName: 'Crescent Blade Studio',
  monogram: 'CB',
  paletteId: 'coral_navy',
  toneOfVoice: 'bold',
};

export const INITIAL_AI_LIBRARY: AiLibraryItem[] = [
  {
    id: 'lib-seed-1',
    kind: 'text',
    titleEn: 'Bold promo · Chair openings',
    titleAr: 'نص جريء · المواعيد المتاحة',
    captionEn:
      'Skip the weekend wait. Grab a crisp midweek fade + hot towel reset in 3 taps on BizHub.',
    captionAr:
      'تجاوز زحمة نهاية الأسبوع. احجز قصة الشعر التدريجية مع الفوطة الدافئة في 3 خطوات عبر BizHub.',
    badgeEn: 'Text · Bold',
    badgeAr: 'نص · جريء',
    mediaPresetId: 'reel_fade',
    savedAtLabelEn: 'Sample asset',
    savedAtLabelAr: 'عنصر جاهز',
  },
];

export const AI_TAB_ORDER: AiStudioTabId[] = ['text', 'image', 'video', 'tools'];
