import type { OwnerIndustryTemplateId } from '../theme/tokens';

export interface FakeCityOption {
  id: string;
  nameEn: string;
  nameAr: string;
  districtHintEn: string;
  districtHintAr: string;
}

export const FAKE_EXPLORE_CITIES: FakeCityOption[] = [
  {
    id: 'city-riyadh',
    nameEn: 'Riyadh',
    nameAr: 'الرياض',
    districtHintEn: 'Olaya · Al Malqa · KAFD',
    districtHintAr: 'العليا · الملقا · كافد',
  },
  {
    id: 'city-jeddah',
    nameEn: 'Jeddah',
    nameAr: 'جدة',
    districtHintEn: 'Al Rawdah · Corniche · Red Sea',
    districtHintAr: 'الروضة · الكورنيش · البحر الأحمر',
  },
  {
    id: 'city-lagos',
    nameEn: 'Lagos',
    nameAr: 'لاغوس',
    districtHintEn: 'Victoria Island · Lekki · Ikoyi',
    districtHintAr: 'فيكتوريا آيلاند · ليكي · إيكويي',
  },
  {
    id: 'city-new-york',
    nameEn: 'New York',
    nameAr: 'نيويورك',
    districtHintEn: 'SoHo · Midtown · Williamsburg',
    districtHintAr: 'سوهو · ميدتاون · ويليامزبرغ',
  },
];

export const INITIAL_RECENT_SEARCHES_EN: string[] = [
  'barber shop',
  'gym near me',
  'bespoke suit',
  'scalp facial',
];

export const INITIAL_RECENT_SEARCHES_AR: string[] = [
  'صالون حلاقة',
  'نادي رياضي قريب',
  'تفصيل بدلة',
  'عيادة أسنان',
];

export const BUSINESS_MAP_COORDS: Record<string, { xPct: number; yPct: number }> = {
  'biz-1': { xPct: 24, yPct: 28 },
  'biz-2': { xPct: 68, yPct: 24 },
  'biz-3': { xPct: 48, yPct: 42 },
  'biz-4': { xPct: 78, yPct: 64 },
  'biz-5': { xPct: 36, yPct: 54 },
  'biz-6': { xPct: 18, yPct: 72 },
  'biz-7': { xPct: 58, yPct: 32 },
  'biz-8': { xPct: 82, yPct: 44 },
  'biz-9': { xPct: 16, yPct: 44 },
  'biz-10': { xPct: 52, yPct: 68 },
  'biz-11': { xPct: 70, yPct: 78 },
  'biz-12': { xPct: 32, yPct: 80 },
};

export interface FakeGoogleListing {
  id: string;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  rating: number;
  reviewCount: number;
  hoursEn: string;
  hoursAr: string;
  photos: Array<{
    id: string;
    labelEn: string;
    labelAr: string;
    tone: 'coral' | 'amber' | 'slate' | 'emerald';
  }>;
  suggestedTemplate: OwnerIndustryTemplateId;
}

export const FAKE_GOOGLE_LISTINGS: FakeGoogleListing[] = [
  {
    id: 'gp-1',
    nameEn: 'Crescent Blade Grooming Co.',
    nameAr: 'كريسنت بليد للعناية الرجالية',
    addressEn: '418 Marina Walk, Suite 2B',
    addressAr: '418 ممشى المارينا، جناح 2B',
    rating: 4.9,
    reviewCount: 218,
    hoursEn: 'Mon–Sat 09:00–21:00 · Sun 10:00–18:00',
    hoursAr: 'الإثنين–السبت 09:00–21:00 · الأحد 10:00–18:00',
    photos: [
      { id: 'gp-p1', labelEn: 'Chair stations', labelAr: 'كراسي الحلاقة', tone: 'coral' },
      { id: 'gp-p2', labelEn: 'Hot towel bar', labelAr: 'ركن المناشف الساخنة', tone: 'amber' },
      { id: 'gp-p3', labelEn: 'Storefront glow', labelAr: 'واجهة المحل', tone: 'slate' },
    ],
    suggestedTemplate: 'barber',
  },
  {
    id: 'gp-2',
    nameEn: 'IronPulse Strength & Recovery',
    nameAr: 'أيرون بالس للقوة والاستشفاء',
    addressEn: '905 Midtown Plaza, Floor 1',
    addressAr: '905 ساحة وسط المدينة، الطابق 1',
    rating: 4.8,
    reviewCount: 305,
    hoursEn: 'Daily 06:00–22:00',
    hoursAr: 'يومياً 06:00–22:00',
    photos: [
      { id: 'gp-p4', labelEn: 'Turf sprint lane', labelAr: 'مسار الجري', tone: 'amber' },
      { id: 'gp-p5', labelEn: 'Lifting racks', labelAr: 'منصات الأوزان', tone: 'coral' },
      { id: 'gp-p6', labelEn: 'Recovery lounge', labelAr: 'صالة الاستشفاء', tone: 'emerald' },
    ],
    suggestedTemplate: 'gym',
  },
  {
    id: 'gp-3',
    nameEn: 'Velvet Crown Hair Atelier',
    nameAr: 'أتيليه فيلفيت كراون للشعر',
    addressEn: '142 Design District Blvd',
    addressAr: '142 بوليفارد حي التصميم',
    rating: 4.8,
    reviewCount: 247,
    hoursEn: 'Tue–Sun 10:00–20:00',
    hoursAr: 'الثلاثاء–الأحد 10:00–20:00',
    photos: [
      { id: 'gp-p7', labelEn: 'Styling suite', labelAr: 'جناح التصفيف', tone: 'coral' },
      { id: 'gp-p8', labelEn: 'Color studio', labelAr: 'استوديو الألوان', tone: 'amber' },
      { id: 'gp-p9', labelEn: 'Botanical wash bar', labelAr: 'ركن العناية النباتية', tone: 'emerald' },
    ],
    suggestedTemplate: 'salon',
  },
];

export const OWNER_INDUSTRY_TEMPLATE_IDS: OwnerIndustryTemplateId[] = [
  'barber',
  'gym',
  'tailor',
  'salon',
  'clinic',
  'wellness',
];
