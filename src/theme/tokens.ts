export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'ar';
export type ClientTabId = 'home' | 'book' | 'bookings' | 'explore' | 'help';
export type EmployeeTabId = 'today' | 'schedule' | 'clients' | 'profile';
export type CreatorTabId = 'home' | 'ai_studio' | 'profile' | 'help';
export type EmployeeIndustryId = 'barber' | 'trainer' | 'tailor';
export type SocialHubTabId = 'calendar' | 'create' | 'queue' | 'analytics';
export type AiStudioTabId = 'text' | 'image' | 'video' | 'tools';
export type AiTextMode = 'caption' | 'paraphrase' | 'translate';
export type AiTranslateDirection = 'en_to_ar' | 'ar_to_en';
export type AiToneId = 'bold' | 'warm' | 'luxury' | 'playful';
export type AiStylePresetId = 'editorial' | 'neon_noir' | 'minimal_studio' | 'warm_film';
export type AiAspectRatio = '1:1' | '4:5' | '16:9' | '9:16';
export type AiVideoMode = 'text_to_video' | 'image_to_animation';
export type AiToolKind = 'bg_remover' | 'upscaler' | 'brand_kit';
export type ExploreSortOption = 'nearest' | 'top_rated' | 'lowest_price' | 'most_reviewed';
export type ExploreViewMode = 'list' | 'map';
export type OwnerIndustryTemplateId =
  | 'barber'
  | 'gym'
  | 'tailor'
  | 'salon'
  | 'clinic'
  | 'wellness';

export const AI_CREDIT_COSTS: Record<AiStudioTabId, number> = {
  text: 2,
  image: 6,
  video: 12,
  tools: 4,
};

export type SocialChannelId =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'x'
  | 'tiktok'
  | 'youtube';

export const SOCIAL_CHANNEL_IDS: readonly SocialChannelId[] = [
  'instagram',
  'facebook',
  'linkedin',
  'x',
  'tiktok',
  'youtube',
] as const;

export type ProfileRoleId = 'client' | 'employee' | 'business_owner' | 'creator_marketer';

export const PROFILE_ROLE_IDS: readonly ProfileRoleId[] = [
  'client',
  'employee',
  'business_owner',
  'creator_marketer',
] as const;

export const DESIGN_TOKENS = {
  colors: {
    dark: {
      bgNavy: '#0B1120',
      surface: '#131C31',
      surfaceElevated: '#1A2642',
      border: '#24324F',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      coralPrimary: '#FF6B5B',
      coralInk: '#0B1120',
      amberAccent: '#F59E0B',
      amberText: '#FBBF24',
      success: '#34D399',
      error: '#FB7185',
    },
    light: {
      bgNavy: '#F4F6FA',
      surface: '#FFFFFF',
      surfaceElevated: '#EAEFF7',
      border: '#D5DFEC',
      text: '#0B1120',
      textMuted: '#475569',
      coralPrimary: '#D64234',
      coralInk: '#FFFFFF',
      amberAccent: '#F59E0B',
      amberText: '#9A4A04',
      success: '#047857',
      error: '#BE123C',
    },
  },
  fonts: {
    en: 'Inter',
    ar: 'Cairo',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    card: '20px',
    button: '999px',
  },
} as const;

export const UI_CLASSES = {
  card: 'rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface)]',
  cardElevated: 'rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)]',
  pillButtonPrimary:
    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--bh-coral)] px-6 py-3 text-[15px] font-semibold text-[var(--bh-coral-ink)] transition-colors duration-150 hover:bg-[var(--bh-coral-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45',
  pillButtonSecondary:
    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-6 py-3 text-[15px] font-semibold text-[var(--bh-text)] transition-colors duration-150 hover:border-[var(--bh-coral)] active:scale-[0.98]',
  iconButton:
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] transition-colors duration-150 hover:border-[var(--bh-coral)]',
  inputPill:
    'min-h-[48px] w-full rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-5 py-3 text-[15px] text-[var(--bh-text)] placeholder:text-[var(--bh-text-muted)] transition-colors duration-150 focus:border-[var(--bh-coral)] focus:outline-none',
} as const;
