import type {
  BookingRecord,
  BusinessCategory,
  BusinessGalleryItem,
  BusinessRecord,
  BusinessStaff,
} from '../data/businesses';
import type { ExploreSortOption, Language } from '../theme/tokens';
import { validateEmail } from './appLogic';

export interface ExploreFilters {
  query: string;
  locationLabel: string;
  category: 'all' | BusinessCategory;
  nearbyOnly: boolean;
  maxDistanceKm: 'all' | 1 | 2 | 5;
  priceLevel: 'all' | 1 | 2 | 3;
  availableNowOnly: boolean;
  acceptsCardsOnly: boolean;
  sortBy: ExploreSortOption;
}

export interface ExploreProfessionalItem {
  id: string;
  staff: BusinessStaff;
  business: BusinessRecord;
  portfolioPhotos: BusinessGalleryItem[];
}

export interface DayStripItem {
  dateKey: string;
  dayShort: string;
  dayNum: string;
  monthShort: string;
}

export interface HelpMessageInput {
  name: string;
  email: string;
  message: string;
}

export type HelpMessageErrorKey = 'nameRequired' | 'emailRequired' | 'emailInvalid' | 'messageTooShort';

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  query: '',
  locationLabel: '',
  category: 'all',
  nearbyOnly: false,
  maxDistanceKm: 'all',
  priceLevel: 'all',
  availableNowOnly: false,
  acceptsCardsOnly: false,
  sortBy: 'nearest',
};

export function formatPriceLevel(level: 1 | 2 | 3): string {
  return '$'.repeat(level);
}

export function sortBusinesses(
  list: BusinessRecord[],
  sortBy: ExploreSortOption
): BusinessRecord[] {
  return [...list].sort((a, b) => {
    if (sortBy === 'top_rated') return b.rating - a.rating || a.distanceKm - b.distanceKm;
    if (sortBy === 'lowest_price') return a.priceLevel - b.priceLevel || a.distanceKm - b.distanceKm;
    if (sortBy === 'most_reviewed') return b.reviewCount - a.reviewCount;
    return a.distanceKm - b.distanceKm;
  });
}

export function filterBusinesses(
  list: BusinessRecord[],
  filters: ExploreFilters
): BusinessRecord[] {
  const q = filters.query.trim().toLowerCase();
  const effectiveMaxKm =
    filters.maxDistanceKm !== 'all'
      ? filters.maxDistanceKm
      : filters.nearbyOnly
        ? 2.0
        : null;

  const matched = list.filter((biz) => {
    if (filters.category !== 'all' && biz.category !== filters.category) {
      return false;
    }
    if (effectiveMaxKm !== null && biz.distanceKm > effectiveMaxKm) {
      return false;
    }
    if (filters.priceLevel !== 'all' && biz.priceLevel !== filters.priceLevel) {
      return false;
    }
    if (filters.availableNowOnly && !biz.availableNow) {
      return false;
    }
    if (filters.acceptsCardsOnly && !biz.acceptsCards) {
      return false;
    }
    if (q) {
      const haystack = [
        biz.nameEn,
        biz.nameAr,
        biz.category,
        biz.neighborhoodEn,
        biz.neighborhoodAr,
        biz.taglineEn,
        biz.taglineAr,
        ...biz.services.map((s) => `${s.nameEn} ${s.nameAr}`),
        ...biz.staff.map((st) => `${st.nameEn} ${st.nameAr} ${st.roleEn} ${st.roleAr}`),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });

  return sortBusinesses(matched, filters.sortBy);
}

const PORTFOLIO_FILLERS: BusinessGalleryItem[] = [
  {
    id: 'pf-fill-1',
    captionEn: 'Client result showcase',
    captionAr: 'عرض نتيجة العميل',
    tone: 'coral',
  },
  {
    id: 'pf-fill-2',
    captionEn: 'Studio craft detail',
    captionAr: 'تفاصيل العمل اليدوي',
    tone: 'amber',
  },
];

export function extractProfessionals(
  filteredBusinesses: BusinessRecord[]
): ExploreProfessionalItem[] {
  const rows: ExploreProfessionalItem[] = [];
  filteredBusinesses.forEach((biz) => {
    const basePhotos = biz.gallery.slice(0, 4);
    const portfolioPhotos =
      basePhotos.length >= 3
        ? basePhotos
        : [...basePhotos, ...PORTFOLIO_FILLERS].slice(0, 3);

    biz.staff.forEach((staff) => {
      rows.push({
        id: `${biz.id}-${staff.id}`,
        staff,
        business: biz,
        portfolioPhotos,
      });
    });
  });
  return rows;
}

export function addRecentSearch(list: string[], nextQuery: string): string[] {
  const trimmed = nextQuery.trim();
  if (!trimmed) return list;
  const deduped = list.filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase()
  );
  return [trimmed, ...deduped].slice(0, 6);
}

export function buildSevenDayStrip(baseDate: Date, lang: Language): DayStripItem[] {
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  const dayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const monthFmt = new Intl.DateTimeFormat(locale, { month: 'short' });

  const items: DayStripItem[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    items.push({
      dateKey: `${yyyy}-${mm}-${dd}`,
      dayShort: dayFmt.format(d),
      dayNum: String(d.getDate()),
      monthShort: monthFmt.format(d),
    });
  }
  return items;
}

export function createBookingRecord(params: {
  id: string;
  business: BusinessRecord;
  serviceId: string;
  staffId: string;
  dateKey: string;
  timeSlot: string;
}): BookingRecord {
  const service =
    params.business.services.find((s) => s.id === params.serviceId) ??
    params.business.services[0];
  const staff =
    params.business.staff.find((st) => st.id === params.staffId) ??
    params.business.staff[0];

  return {
    id: params.id,
    businessId: params.business.id,
    businessNameEn: params.business.nameEn,
    businessNameAr: params.business.nameAr,
    serviceNameEn: service.nameEn,
    serviceNameAr: service.nameAr,
    staffNameEn: staff.nameEn,
    staffNameAr: staff.nameAr,
    dateKey: params.dateKey,
    timeSlot: params.timeSlot,
    priceUsd: service.priceUsd,
    depositUsd: service.depositUsd,
    status: 'upcoming',
  };
}

export function cancelBookingById(
  bookings: BookingRecord[],
  bookingId: string
): BookingRecord[] {
  return bookings.map((bk) =>
    bk.id === bookingId ? { ...bk, status: 'cancelled' } : bk
  );
}

export function rescheduleBookingById(
  bookings: BookingRecord[],
  bookingId: string,
  dateKey: string,
  timeSlot: string
): BookingRecord[] {
  return bookings.map((bk) =>
    bk.id === bookingId ? { ...bk, dateKey, timeSlot, status: 'upcoming' } : bk
  );
}

export function validateHelpMessage(input: HelpMessageInput): {
  valid: boolean;
  errors: Partial<Record<keyof HelpMessageInput, HelpMessageErrorKey>>;
} {
  const errors: Partial<Record<keyof HelpMessageInput, HelpMessageErrorKey>> = {};
  if (!input.name.trim()) {
    errors.name = 'nameRequired';
  }
  const emailRes = validateEmail(input.email);
  if (!emailRes.valid) {
    errors.email = emailRes.errorKey === 'required' ? 'emailRequired' : 'emailInvalid';
  }
  if (input.message.trim().length < 10) {
    errors.message = 'messageTooShort';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
