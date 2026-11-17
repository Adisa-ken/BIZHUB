import {
  FAKE_GOOGLE_LISTINGS,
  type FakeGoogleListing,
} from '../data/exploreAndClaim';
import type { OwnerIndustryTemplateId } from '../theme/tokens';

export interface OwnerClaimPhotoItem {
  id: string;
  labelEn: string;
  labelAr: string;
  tone: 'coral' | 'amber' | 'slate' | 'emerald';
}

export interface OwnerClaimDraft {
  source: 'google' | 'manual';
  googleListingId: string | null;
  name: string;
  address: string;
  hours: string;
  rating: number | null;
  reviewCount: number;
  photos: OwnerClaimPhotoItem[];
}

export interface ClaimedBusinessProfile {
  id: string;
  source: 'google' | 'manual';
  name: string;
  address: string;
  hours: string;
  rating: number | null;
  reviewCount: number;
  photos: OwnerClaimPhotoItem[];
  industryTemplate: OwnerIndustryTemplateId;
  claimedAtLabelEn: string;
  claimedAtLabelAr: string;
}

export function filterGoogleListings(
  listings: FakeGoogleListing[],
  query: string
): FakeGoogleListing[] {
  const q = query.trim().toLowerCase();
  if (!q) return listings.slice(0, 3);
  const matches = listings.filter((item) => {
    const haystack = `${item.nameEn} ${item.nameAr} ${item.addressEn} ${item.addressAr}`.toLowerCase();
    return haystack.includes(q);
  });
  return matches.length > 0 ? matches.slice(0, 3) : listings.slice(0, 3);
}

export function createDraftFromGoogleListing(
  listing: FakeGoogleListing,
  lang: 'en' | 'ar'
): OwnerClaimDraft {
  return {
    source: 'google',
    googleListingId: listing.id,
    name: lang === 'ar' ? listing.nameAr : listing.nameEn,
    address: lang === 'ar' ? listing.addressAr : listing.addressEn,
    hours: lang === 'ar' ? listing.hoursAr : listing.hoursEn,
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    photos: listing.photos.map((p) => ({ ...p })),
  };
}

export function createManualClaimDraft(): OwnerClaimDraft {
  return {
    source: 'manual',
    googleListingId: null,
    name: '',
    address: '',
    hours: 'Mon–Sat 09:00–20:00',
    rating: null,
    reviewCount: 0,
    photos: [
      { id: 'man-p1', labelEn: 'Storefront photo', labelAr: 'صورة الواجهة', tone: 'coral' },
      { id: 'man-p2', labelEn: 'Interior workspace', labelAr: 'المساحة الداخلية', tone: 'amber' },
    ],
  };
}

export function addPlaceholderClaimPhoto(
  photos: OwnerClaimPhotoItem[]
): OwnerClaimPhotoItem[] {
  const tones: Array<OwnerClaimPhotoItem['tone']> = ['coral', 'amber', 'slate', 'emerald'];
  const nextIndex = photos.length + 1;
  return [
    ...photos,
    {
      id: `claim-photo-${Date.now()}-${nextIndex}`,
      labelEn: `Studio shot #${nextIndex}`,
      labelAr: `لقطة استوديو #${nextIndex}`,
      tone: tones[nextIndex % tones.length],
    },
  ];
}

export function removeClaimPhoto(
  photos: OwnerClaimPhotoItem[],
  photoId: string
): OwnerClaimPhotoItem[] {
  return photos.filter((p) => p.id !== photoId);
}

export function validateClaimDraft(draft: OwnerClaimDraft): {
  valid: boolean;
  errors: Partial<Record<'name' | 'address', 'nameRequired' | 'addressRequired'>>;
} {
  const errors: Partial<Record<'name' | 'address', 'nameRequired' | 'addressRequired'>> = {};
  if (!draft.name.trim()) {
    errors.name = 'nameRequired';
  }
  if (!draft.address.trim()) {
    errors.address = 'addressRequired';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function finalizeClaimedBusiness(
  draft: OwnerClaimDraft,
  industryTemplate: OwnerIndustryTemplateId
): ClaimedBusinessProfile {
  return {
    id: `claimed-${Date.now()}`,
    source: draft.source,
    name: draft.name.trim(),
    address: draft.address.trim(),
    hours: draft.hours.trim() || '09:00–20:00',
    rating: draft.rating,
    reviewCount: draft.reviewCount,
    photos: draft.photos,
    industryTemplate,
    claimedAtLabelEn: 'Just now',
    claimedAtLabelAr: 'الآن',
  };
}

export function findSuggestedTemplateForListing(
  listingId: string | null
): OwnerIndustryTemplateId {
  if (!listingId) return 'barber';
  return (
    FAKE_GOOGLE_LISTINGS.find((l) => l.id === listingId)?.suggestedTemplate ?? 'barber'
  );
}
