import type { SocialChannelId } from '../theme/tokens';

export type SocialPostStatus = 'scheduled' | 'draft';

export type SocialMediaPresetId =
  | 'reel_fade'
  | 'carousel_before_after'
  | 'promo_flyer'
  | 'studio_tour';

export interface SocialMediaPreset {
  id: SocialMediaPresetId;
  labelEn: string;
  labelAr: string;
  formatEn: string;
  formatAr: string;
  aspectEn: string;
  toneClass: string;
}

export interface SocialPostRecord {
  id: string;
  caption: string;
  channels: SocialChannelId[];
  dateKey: string; // YYYY-MM-DD
  time24: string; // HH:MM
  status: SocialPostStatus;
  mediaPresetId: SocialMediaPresetId | null;
  createdAtLabelEn: string;
  createdAtLabelAr: string;
}

export interface SocialChannelAnalytics {
  channel: SocialChannelId;
  reach: number;
  engagement: number;
  growthPercent: number;
  bestWindowEn: string;
  bestWindowAr: string;
  topPostEn: string;
  topPostAr: string;
}

export const SOCIAL_CHANNEL_META: Record<
  SocialChannelId,
  {
    nameEn: string;
    nameAr: string;
    shortCode: string;
    handle: string;
    maxChars: number;
    accentClass: string;
  }
> = {
  instagram: {
    nameEn: 'Instagram',
    nameAr: 'إنستغرام',
    shortCode: 'IG',
    handle: '@bizhub.studio',
    maxChars: 2200,
    accentClass: 'bg-rose-500/15 text-rose-500 dark:text-rose-300 border-rose-500/35',
  },
  facebook: {
    nameEn: 'Facebook',
    nameAr: 'فيسبوك',
    shortCode: 'FB',
    handle: 'BizHub Local Studio',
    maxChars: 2000,
    accentClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/35',
  },
  linkedin: {
    nameEn: 'LinkedIn',
    nameAr: 'لينكدإن',
    shortCode: 'IN',
    handle: 'BizHub Pro Partners',
    maxChars: 3000,
    accentClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/35',
  },
  x: {
    nameEn: 'X',
    nameAr: 'إكس (X)',
    shortCode: 'X',
    handle: '@bizhub_hq',
    maxChars: 280,
    accentClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-200 border-slate-500/35',
  },
  tiktok: {
    nameEn: 'TikTok',
    nameAr: 'تيك توك',
    shortCode: 'TT',
    handle: '@bizhub.reels',
    maxChars: 2200,
    accentClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/35',
  },
  youtube: {
    nameEn: 'YouTube',
    nameAr: 'يوتيوب',
    shortCode: 'YT',
    handle: 'BizHub Spotlight',
    maxChars: 5000,
    accentClass: 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/35',
  },
};

export const SOCIAL_MEDIA_PRESETS: SocialMediaPreset[] = [
  {
    id: 'reel_fade',
    labelEn: 'Signature Cut Reel (9:16)',
    labelAr: 'فيديو قصير للقصة المميزة (9:16)',
    formatEn: 'Vertical Video · 0:24',
    formatAr: 'فيديو عمودي · 0:24',
    aspectEn: '9:16',
    toneClass:
      'from-rose-500/20 via-amber-500/15 to-slate-900/20 dark:from-[#FF6B5B]/25 dark:via-[#1E2B4A] dark:to-[#0F172A]',
  },
  {
    id: 'carousel_before_after',
    labelEn: 'Before & After Carousel (1:1)',
    labelAr: 'ألبوم قبل وبعد (1:1)',
    formatEn: '4-Slide Carousel',
    formatAr: 'ألبوم من 4 صور',
    aspectEn: '1:1',
    toneClass:
      'from-amber-500/20 via-orange-500/10 to-slate-900/15 dark:from-[#F59E0B]/25 dark:via-[#1A2642] dark:to-[#0B1120]',
  },
  {
    id: 'promo_flyer',
    labelEn: 'Midweek Booking Offer (4:5)',
    labelAr: 'تصميم عرض منتصف الأسبوع (4:5)',
    formatEn: 'Graphic Post',
    formatAr: 'تصميم جرافيك',
    aspectEn: '4:5',
    toneClass:
      'from-emerald-500/20 via-teal-500/10 to-slate-900/15 dark:from-[#10B981]/25 dark:via-[#17283F] dark:to-[#0B1120]',
  },
  {
    id: 'studio_tour',
    labelEn: 'Studio Walkthrough Clip (16:9)',
    labelAr: 'جولة داخل الاستوديو (16:9)',
    formatEn: 'Widescreen Clip · 0:45',
    formatAr: 'مقطع عريض · 0:45',
    aspectEn: '16:9',
    toneClass:
      'from-indigo-500/20 via-sky-500/10 to-slate-900/15 dark:from-[#38BDF8]/20 dark:via-[#192948] dark:to-[#0B1120]',
  },
];

export const INITIAL_SOCIAL_POSTS: SocialPostRecord[] = [
  {
    id: 'sp-1',
    caption:
      'Morning chair openings at Crescent Blade Studio — book your midweek fade & hot-towel refresh in 3 taps.',
    channels: ['instagram', 'facebook'],
    dateKey: '2026-11-17',
    time24: '18:00',
    status: 'scheduled',
    mediaPresetId: 'reel_fade',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-2',
    caption:
      '3 mobility drills our trainers use before every heavy squat block at IronPulse Athletic.',
    channels: ['tiktok', 'youtube', 'instagram'],
    dateKey: '2026-11-18',
    time24: '12:30',
    status: 'scheduled',
    mediaPresetId: 'studio_tour',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-3',
    caption:
      'How neighborhood service studios cut no-shows by 38% with automated deposit reminders.',
    channels: ['linkedin', 'x'],
    dateKey: '2026-11-19',
    time24: '09:30',
    status: 'scheduled',
    mediaPresetId: 'promo_flyer',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-4',
    caption:
      'Saturday bespoke suit fitting slots just opened at Threadline Bespoke — wool & linen swatches ready.',
    channels: ['instagram', 'linkedin'],
    dateKey: '2026-11-21',
    time24: '11:00',
    status: 'scheduled',
    mediaPresetId: 'carousel_before_after',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-5',
    caption:
      'Behind the scenes: lighting setup & 60-second client glow transformation at Velvet Crown Salon.',
    channels: ['tiktok', 'youtube'],
    dateKey: '2026-11-24',
    time24: '17:15',
    status: 'scheduled',
    mediaPresetId: 'reel_fade',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-6',
    caption:
      'Winter skin recovery & quick clinic checkups — reserve your lunch-hour consultation.',
    channels: ['facebook', 'x'],
    dateKey: '2026-11-27',
    time24: '13:00',
    status: 'scheduled',
    mediaPresetId: 'promo_flyer',
    createdAtLabelEn: 'Scheduled',
    createdAtLabelAr: 'مجدول',
  },
  {
    id: 'sp-7',
    caption:
      'Holiday gift voucher bundle teaser — 20% off first haircut + beard ritual for new clients.',
    channels: ['instagram', 'x'],
    dateKey: '2026-11-29',
    time24: '15:00',
    status: 'draft',
    mediaPresetId: 'promo_flyer',
    createdAtLabelEn: 'Saved draft',
    createdAtLabelAr: 'مسودة محفوظة',
  },
];

export const INITIAL_SOCIAL_ANALYTICS: SocialChannelAnalytics[] = [
  {
    channel: 'instagram',
    reach: 16400,
    engagement: 1920,
    growthPercent: 18,
    bestWindowEn: '18:00 – 20:30',
    bestWindowAr: '18:00 – 20:30',
    topPostEn: 'Signature Fade Timelapse Reel',
    topPostAr: 'فيديو سريع لتدرج الشعر المميز',
  },
  {
    channel: 'tiktok',
    reach: 14200,
    engagement: 1580,
    growthPercent: 24,
    bestWindowEn: '19:30 – 22:00',
    bestWindowAr: '19:30 – 22:00',
    topPostEn: '30s Studio Transformation Clip',
    topPostAr: 'مقطع تحول الاستوديو في 30 ثانية',
  },
  {
    channel: 'youtube',
    reach: 7800,
    engagement: 640,
    growthPercent: 11,
    bestWindowEn: '16:00 – 18:00',
    bestWindowAr: '16:00 – 18:00',
    topPostEn: 'Mobility Warmup Walkthrough',
    topPostAr: 'شرح تمارين الإحماء والمرونة',
  },
  {
    channel: 'linkedin',
    reach: 5100,
    engagement: 430,
    growthPercent: 14,
    bestWindowEn: '09:00 – 11:00',
    bestWindowAr: '09:00 – 11:00',
    topPostEn: 'How Local Shops Cut No-Shows',
    topPostAr: 'كيف قللت المتاجر المحلية غياب المواعيد',
  },
  {
    channel: 'facebook',
    reach: 4300,
    engagement: 310,
    growthPercent: 6,
    bestWindowEn: '13:00 – 15:00',
    bestWindowAr: '13:00 – 15:00',
    topPostEn: 'Weekend Neighborhood Hours Update',
    topPostAr: 'تحديث ساعات العمل لعطلة نهاية الأسبوع',
  },
  {
    channel: 'x',
    reach: 3200,
    engagement: 260,
    growthPercent: 9,
    bestWindowEn: '12:00 – 14:00',
    bestWindowAr: '12:00 – 14:00',
    topPostEn: 'Same-Day Chair Slots Thread',
    topPostAr: 'سلسلة تغريدات المواعيد الفورية',
  },
];
