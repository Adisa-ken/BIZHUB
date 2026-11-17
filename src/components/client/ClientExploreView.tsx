import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  CreditCard,
  List,
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import type { BusinessRecord } from '../../data/businesses';
import {
  INITIAL_RECENT_SEARCHES_AR,
  INITIAL_RECENT_SEARCHES_EN,
} from '../../data/exploreAndClaim';
import { getCopy } from '../../i18n/translations';
import {
  UI_CLASSES,
  type ExploreSortOption,
  type ExploreViewMode,
  type Language,
} from '../../theme/tokens';
import {
  addRecentSearch,
  buildSevenDayStrip,
  DEFAULT_EXPLORE_FILTERS,
  extractProfessionals,
  filterBusinesses,
  formatPriceLevel,
  type ExploreFilters,
} from '../../utils/clientLogic';
import { BusinessPhotoPlaceholder } from './BusinessVisual';
import { ExploreMapView } from './ExploreMapView';
import { ExploreSearchModal } from './ExploreSearchModal';

interface ClientExploreViewProps {
  lang: Language;
  businesses: BusinessRecord[];
  filters: ExploreFilters;
  isGuest: boolean;
  onChangeFilters: (next: ExploreFilters) => void;
  onOpenBusiness: (businessId: string) => void;
  onStartBook: (businessId: string, staffId?: string, dateKey?: string) => void;
  onOpenCreateAccount: () => void;
}

type FilterDropdownKey = 'sort' | 'nearby' | 'price' | 'available' | 'cards' | null;

const PORTFOLIO_TONE_CLASSES: Record<'coral' | 'amber' | 'slate' | 'emerald', string> = {
  coral: 'from-[#FF6B5B]/30 via-[#FB7185]/15 to-[var(--bh-surface-elevated)]',
  amber: 'from-[#F59E0B]/30 via-[#FBBF24]/15 to-[var(--bh-surface-elevated)]',
  slate: 'from-[#64748B]/30 via-[#4F46E5]/15 to-[var(--bh-surface-elevated)]',
  emerald: 'from-[#10B981]/30 via-[#14B8A6]/15 to-[var(--bh-surface-elevated)]',
};

const SORT_OPTIONS: ExploreSortOption[] = [
  'nearest',
  'top_rated',
  'lowest_price',
  'most_reviewed',
];

export const ClientExploreView: React.FC<ClientExploreViewProps> = ({
  lang,
  businesses,
  filters,
  isGuest,
  onChangeFilters,
  onOpenBusiness,
  onStartBook,
  onOpenCreateAccount,
}) => {
  const copy = getCopy(lang);
  const t = copy.client;
  const ex = t.explore;

  const [viewMode, setViewMode] = useState<ExploreViewMode>('list');
  const [searchModalField, setSearchModalField] = useState<'query' | 'location' | null>(null);
  const [recentSearchesEn, setRecentSearchesEn] = useState<string[]>(INITIAL_RECENT_SEARCHES_EN);
  const [recentSearchesAr, setRecentSearchesAr] = useState<string[]>(INITIAL_RECENT_SEARCHES_AR);
  const [openDropdown, setOpenDropdown] = useState<FilterDropdownKey>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const dayStrip = useMemo(() => buildSevenDayStrip(new Date(2026, 10, 17), lang), [lang]);
  const results = useMemo(() => filterBusinesses(businesses, filters), [businesses, filters]);
  const professionals = useMemo(() => extractProfessionals(results), [results]);

  const recentSearches = lang === 'ar' ? recentSearchesAr : recentSearchesEn;

  const handleCommitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    if (lang === 'ar') {
      setRecentSearchesAr((prev) => addRecentSearch(prev, trimmed));
    } else {
      setRecentSearchesEn((prev) => addRecentSearch(prev, trimmed));
    }
  };

  const toggleDropdown = (key: Exclude<FilterDropdownKey, null>) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.locationLabel.trim().length > 0 ||
    filters.category !== 'all' ||
    filters.nearbyOnly ||
    filters.maxDistanceKm !== 'all' ||
    filters.priceLevel !== 'all' ||
    filters.availableNowOnly ||
    filters.acceptsCardsOnly ||
    filters.sortBy !== 'nearest';

  const nearbyActive = filters.maxDistanceKm !== 'all' || filters.nearbyOnly;
  const nearbyLabel =
    filters.maxDistanceKm === 1
      ? ex.nearby1km
      : filters.maxDistanceKm === 2 || filters.nearbyOnly
        ? ex.nearby2km
        : filters.maxDistanceKm === 5
          ? ex.nearby5km
          : ex.nearbyFilter;

  const sortLabel =
    filters.sortBy === 'nearest'
      ? ex.sortChip
      : `${ex.sortChip}: ${ex.sortOptions[filters.sortBy]}`;

  const priceLabel =
    filters.priceLevel === 'all'
      ? ex.priceChip
      : `${ex.priceChip}: ${formatPriceLevel(filters.priceLevel)}`;

  const handleResetAll = () => {
    onChangeFilters(DEFAULT_EXPLORE_FILTERS);
    setOpenDropdown(null);
    setInviteSent(false);
  };

  return (
    <div
      className={`mx-auto w-full max-w-6xl space-y-5 px-4 pt-5 sm:px-6 sm:pt-8 ${
        isGuest ? 'pb-44' : 'pb-28'
      }`}
    >
      {/* Top Heading + LIST / MAP Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl">
            {ex.title}
          </h1>
          <p className="tabular-nums mt-0.5 text-xs font-semibold text-[var(--bh-text-muted)]">
            {results.length}{' '}
            {results.length === 1 ? ex.resultsSingular : ex.resultsPlural}
          </p>
        </div>

        {/* LIST / MAP Toggle */}
        <div
          role="group"
          aria-label={`${ex.listToggle} / ${ex.mapToggle}`}
          className="inline-flex rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1"
        >
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wide transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
            }`}
          >
            <List className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{ex.listToggle}</span>
          </button>

          <button
            type="button"
            aria-pressed={viewMode === 'map'}
            onClick={() => setViewMode('map')}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wide transition-colors ${
              viewMode === 'map'
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{ex.mapToggle}</span>
          </button>
        </div>
      </div>

      {/* 1. TOP: Two Stacked Pill-Shaped Fields */}
      <div className="space-y-2.5">
        {/* Field 1: Magnifier icon + "Search businesses, services or categories" */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setSearchModalField('query')}
            aria-label={ex.searchLabel}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3 text-start text-[15px] transition-colors hover:border-[var(--bh-coral)]"
          >
            <Search
              className="h-[18px] w-[18px] shrink-0 text-[var(--bh-coral-text)]"
              aria-hidden="true"
            />
            <span
              className={`flex-1 truncate ${
                filters.query.trim()
                  ? 'font-semibold text-[var(--bh-text)]'
                  : 'text-[var(--bh-text-muted)]'
              }`}
            >
              {filters.query.trim() || ex.searchPlaceholder}
            </span>
          </button>
          {filters.query.trim() && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, query: '' })}
              aria-label={ex.clearSearch}
              className="absolute end-1.5 flex h-[44px] w-[44px] items-center justify-center rounded-full text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Field 2: Location-pin icon + "Current Location" */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setSearchModalField('location')}
            aria-label={ex.locationLabel}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3 text-start text-[15px] transition-colors hover:border-[var(--bh-coral)]"
          >
            <MapPin
              className="h-[18px] w-[18px] shrink-0 text-[var(--bh-amber-text)]"
              aria-hidden="true"
            />
            <span
              className={`flex-1 truncate ${
                filters.locationLabel.trim()
                  ? 'font-semibold text-[var(--bh-text)]'
                  : 'text-[var(--bh-text-muted)]'
              }`}
            >
              {filters.locationLabel.trim() || ex.locationPlaceholder}
            </span>
          </button>
          {filters.locationLabel.trim() && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, locationLabel: '' })}
              aria-label={ex.clearSearch}
              className="absolute end-1.5 flex h-[44px] w-[44px] items-center justify-center rounded-full text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Horizontally Scrolling Row of Filter Chips with Dropdown Arrows */}
      <div className="space-y-2.5">
        <div
          role="group"
          aria-label={ex.filtersLabel}
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {/* Sort */}
          <button
            type="button"
            aria-expanded={openDropdown === 'sort'}
            onClick={() => toggleDropdown('sort')}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              filters.sortBy !== 'nearest' || openDropdown === 'sort'
                ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            <span>{sortLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          {/* Nearby */}
          <button
            type="button"
            aria-expanded={openDropdown === 'nearby'}
            onClick={() => toggleDropdown('nearby')}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              nearbyActive || openDropdown === 'nearby'
                ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            <span>{nearbyLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          {/* Price */}
          <button
            type="button"
            aria-expanded={openDropdown === 'price'}
            onClick={() => toggleDropdown('price')}
            className={`tabular-nums inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              filters.priceLevel !== 'all' || openDropdown === 'price'
                ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            <span>{priceLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          {/* Available now */}
          <button
            type="button"
            aria-expanded={openDropdown === 'available'}
            onClick={() => toggleDropdown('available')}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              filters.availableNowOnly || openDropdown === 'available'
                ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            <span>{ex.availableNowFilter}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          {/* Accepts cards */}
          <button
            type="button"
            aria-expanded={openDropdown === 'cards'}
            onClick={() => toggleDropdown('cards')}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              filters.acceptsCardsOnly || openDropdown === 'cards'
                ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{ex.acceptsCardsFilter}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          {/* Optional Active Category Badge (when navigated from Home category chip) */}
          {filters.category !== 'all' && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, category: 'all' })}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[var(--bh-coral)] px-3.5 py-2 text-xs font-bold text-[var(--bh-coral-ink)] whitespace-nowrap"
            >
              <span>{t.categories[filters.category]}</span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[var(--bh-coral-text)] whitespace-nowrap hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{ex.resetFilters}</span>
            </button>
          )}
        </div>

        {/* Inline Dropdown Option Panel when a Filter Chip is Open */}
        {openDropdown && (
          <div className={`${UI_CLASSES.card} flex flex-wrap items-center gap-2 p-3`}>
            {openDropdown === 'sort' &&
              SORT_OPTIONS.map((opt) => {
                const selected = filters.sortBy === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChangeFilters({ ...filters, sortBy: opt });
                      setOpenDropdown(null);
                    }}
                    className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      selected
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span>{ex.sortOptions[opt]}</span>
                  </button>
                );
              })}

            {openDropdown === 'nearby' &&
              (
                [
                  { value: 'all', label: ex.nearbyAny },
                  { value: 1, label: ex.nearby1km },
                  { value: 2, label: ex.nearby2km },
                  { value: 5, label: ex.nearby5km },
                ] as const
              ).map((item) => {
                const selected = filters.maxDistanceKm === item.value;
                return (
                  <button
                    key={String(item.value)}
                    type="button"
                    onClick={() => {
                      onChangeFilters({
                        ...filters,
                        maxDistanceKm: item.value,
                        nearbyOnly: item.value !== 'all',
                      });
                      setOpenDropdown(null);
                    }}
                    className={`tabular-nums inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      selected
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}

            {openDropdown === 'price' &&
              (
                [
                  { value: 'all', label: ex.priceAny },
                  { value: 1, label: '$' },
                  { value: 2, label: '$$' },
                  { value: 3, label: '$$$' },
                ] as const
              ).map((item) => {
                const selected = filters.priceLevel === item.value;
                return (
                  <button
                    key={String(item.value)}
                    type="button"
                    onClick={() => {
                      onChangeFilters({ ...filters, priceLevel: item.value });
                      setOpenDropdown(null);
                    }}
                    className={`tabular-nums inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      selected
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}

            {openDropdown === 'available' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onChangeFilters({ ...filters, availableNowOnly: false });
                    setOpenDropdown(null);
                  }}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    !filters.availableNowOnly
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)]'
                  }`}
                >
                  {!filters.availableNowOnly && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{ex.availableAny}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeFilters({ ...filters, availableNowOnly: true });
                    setOpenDropdown(null);
                  }}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    filters.availableNowOnly
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)]'
                  }`}
                >
                  {filters.availableNowOnly && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{ex.availableNowFilter}</span>
                </button>
              </>
            )}

            {openDropdown === 'cards' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onChangeFilters({ ...filters, acceptsCardsOnly: false });
                    setOpenDropdown(null);
                  }}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    !filters.acceptsCardsOnly
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)]'
                  }`}
                >
                  {!filters.acceptsCardsOnly && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{ex.acceptsAny}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeFilters({ ...filters, acceptsCardsOnly: true });
                    setOpenDropdown(null);
                  }}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    filters.acceptsCardsOnly
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)]'
                  }`}
                >
                  {filters.acceptsCardsOnly && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{ex.acceptsCardsFilter}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 8. EMPTY STATE when nothing matches */}
      {results.length === 0 ? (
        <section
          aria-labelledby="explore-empty-heading"
          className={`${UI_CLASSES.card} space-y-4 p-8 text-center`}
        >
          <h2
            id="explore-empty-heading"
            className="text-xl font-extrabold tracking-wide text-[var(--bh-text)]"
          >
            {ex.emptyHeading}
          </h2>
          <p className="mx-auto max-w-md text-sm text-[var(--bh-text-muted)]">
            {ex.emptyBody}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setInviteSent(true)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[var(--bh-coral)] bg-transparent px-6 py-2.5 text-xs font-extrabold tracking-wide text-[var(--bh-coral-text)] transition-colors hover:bg-[var(--bh-coral-soft)]"
            >
              {ex.inviteBusinessButton}
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-5 py-2.5 text-xs`}
            >
              {ex.resetFilters}
            </button>
          </div>

          {inviteSent && (
            <p
              role="status"
              className="mx-auto max-w-md rounded-full bg-[var(--bh-success-soft)] px-4 py-2 text-xs font-bold text-[var(--bh-success)]"
            >
              {ex.inviteSentNotice}
            </p>
          )}
        </section>
      ) : viewMode === 'map' ? (
        /* 5. MAP View */
        <ExploreMapView
          lang={lang}
          businesses={results}
          locationLabel={filters.locationLabel}
          onOpenBusiness={onOpenBusiness}
          onStartBook={(bizId) => onStartBook(bizId)}
        />
      ) : (
        /* 6. LIST View: "Businesses" (horizontal cards) + "Professionals" (rows) */
        <div className="space-y-8">
          {/* Section A: Businesses (horizontal cards) */}
          <section aria-labelledby="explore-businesses-heading" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2
                id="explore-businesses-heading"
                className="text-lg font-extrabold text-[var(--bh-text)] sm:text-xl"
              >
                {ex.businessesSection}
              </h2>
              <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
                {results.length}
              </span>
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {results.map((biz) => {
                const name = lang === 'ar' ? biz.nameAr : biz.nameEn;
                const neighborhood = lang === 'ar' ? biz.neighborhoodAr : biz.neighborhoodEn;

                return (
                  <article
                    key={biz.id}
                    className={`${UI_CLASSES.card} flex w-[280px] shrink-0 snap-start flex-col justify-between p-4 sm:w-[300px]`}
                  >
                    <div>
                      <div className="relative">
                        <BusinessPhotoPlaceholder
                          category={biz.category}
                          tone={biz.coverTone}
                          label={name}
                          heightClass="h-32"
                        />
                        {biz.featured && (
                          <span className="absolute top-2.5 start-2.5 inline-flex items-center gap-1 rounded-full bg-[var(--bh-amber)] px-2.5 py-1 text-[11px] font-extrabold text-[#0B1120] shadow-sm">
                            <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{ex.featuredTag}</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[var(--bh-coral-text)]">
                            {t.categories[biz.category]} · {neighborhood}
                          </span>
                          {biz.availableNow && (
                            <span className="font-semibold text-[var(--bh-success)]">
                              {ex.availableNowFilter}
                            </span>
                          )}
                        </div>

                        <h3 className="truncate text-base font-extrabold text-[var(--bh-text)]">
                          {name}
                        </h3>

                        <div className="tabular-nums flex flex-wrap items-center gap-1.5 text-xs text-[var(--bh-text-muted)]">
                          <span className="inline-flex items-center gap-1 font-bold text-[var(--bh-amber-text)]">
                            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                            {biz.rating.toFixed(1)} ({biz.reviewCount})
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{biz.distanceKm.toFixed(1)} km</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-[var(--bh-text)]">
                            {formatPriceLevel(biz.priceLevel)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-[var(--bh-border)] pt-3">
                      <button
                        type="button"
                        onClick={() => onOpenBusiness(biz.id)}
                        className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] flex-1 px-3 py-2 text-xs`}
                      >
                        {ex.viewProfile}
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartBook(biz.id)}
                        className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-4 py-2 text-xs`}
                      >
                        {ex.bookNow}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Section B: Professionals (rows with avatar, rating, distance, price, 3-4 portfolio photos, tags, 7-day strip) */}
          <section aria-labelledby="explore-professionals-heading" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2
                id="explore-professionals-heading"
                className="text-lg font-extrabold text-[var(--bh-text)] sm:text-xl"
              >
                {ex.professionalsSection}
              </h2>
              <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
                {professionals.length}
              </span>
            </div>

            <div className="space-y-4">
              {professionals.map(({ id, staff, business, portfolioPhotos }) => {
                const proName = lang === 'ar' ? staff.nameAr : staff.nameEn;
                const proRole = lang === 'ar' ? staff.roleAr : staff.roleEn;
                const bizName = lang === 'ar' ? business.nameAr : business.nameEn;

                return (
                  <article
                    key={id}
                    className={`${UI_CLASSES.card} space-y-4 p-4 sm:p-5`}
                  >
                    {/* Header: Avatar, Name/Role/Business, Rating, Distance, Price Level */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral-soft)] text-sm font-extrabold text-[var(--bh-coral-text)]">
                          {staff.initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-extrabold text-[var(--bh-text)]">
                              {proName}
                            </h3>
                            <span className="text-xs font-semibold text-[var(--bh-text-muted)]">
                              · {proRole}
                            </span>
                          </div>

                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => onOpenBusiness(business.id)}
                              className="font-bold text-[var(--bh-coral-text)] hover:underline"
                            >
                              {bizName}
                            </button>
                            {business.featured && (
                              <span className="rounded-full bg-[var(--bh-amber-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--bh-amber-text)]">
                                {ex.featuredTag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="tabular-nums flex items-center gap-2 text-xs text-[var(--bh-text-muted)]">
                        <span className="inline-flex items-center gap-1 font-bold text-[var(--bh-amber-text)]">
                          <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                          {staff.rating.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{business.distanceKm.toFixed(1)} km</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-extrabold text-[var(--bh-text)]">
                          {formatPriceLevel(business.priceLevel)}
                        </span>
                      </div>
                    </div>

                    {/* Availability & Payment Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {business.availableNow && (
                        <span className="rounded-full border border-[var(--bh-success)]/40 bg-[var(--bh-success-soft)] px-3 py-1 font-bold text-[var(--bh-success)]">
                          {ex.availableNowFilter}
                        </span>
                      )}
                      {business.acceptsCards ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3 py-1 font-semibold text-[var(--bh-text)]">
                          <CreditCard className="h-3.5 w-3.5 text-[var(--bh-coral-text)]" aria-hidden="true" />
                          <span>{ex.acceptsCardsFilter}</span>
                        </span>
                      ) : (
                        <span className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3 py-1 font-semibold text-[var(--bh-text-muted)]">
                          {ex.cashOnly}
                        </span>
                      )}
                    </div>

                    {/* 3-4 Portfolio Photos */}
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {portfolioPhotos.slice(0, 4).map((photo, index) => (
                        <div
                          key={`${id}-${photo.id}-${index}`}
                          className={`flex h-20 items-end rounded-[14px] border border-[var(--bh-border)] bg-gradient-to-br p-2 ${
                            PORTFOLIO_TONE_CLASSES[photo.tone]
                          }`}
                        >
                          <span className="line-clamp-1 text-[11px] font-bold text-[var(--bh-text)]">
                            {lang === 'ar' ? photo.captionAr : photo.captionEn}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 7-Day Date Strip */}
                    <div className="space-y-1.5 border-t border-[var(--bh-border)] pt-3">
                      <p className="text-[11px] font-bold text-[var(--bh-text-muted)]">
                        {ex.sevenDayQuickLabel}
                      </p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {dayStrip.map((day) => (
                          <button
                            key={day.dateKey}
                            type="button"
                            onClick={() => onStartBook(business.id, staff.id, day.dateKey)}
                            className="flex min-h-[48px] flex-col items-center justify-center rounded-[14px] border border-[var(--bh-border)] bg-[var(--bh-bg)]/60 px-1 py-1.5 text-center transition-colors hover:border-[var(--bh-coral)] hover:bg-[var(--bh-coral-soft)]"
                          >
                            <span className="text-[10px] font-semibold text-[var(--bh-text-muted)]">
                              {day.dayShort}
                            </span>
                            <span className="tabular-nums text-xs font-extrabold text-[var(--bh-text)]">
                              {day.dayNum}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 9. For guests (not signed in): gradient LOGIN / SIGNUP button pinned above bottom tab bar */}
      {isGuest && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[76px] z-30 flex justify-center px-4 sm:bottom-[86px]">
          <button
            type="button"
            onClick={onOpenCreateAccount}
            className="pointer-events-auto inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B5B] via-[#FB7185] to-[#F59E0B] px-8 py-3 text-sm font-extrabold tracking-wide text-[#0B1120] shadow-xl transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bh-coral)]"
          >
            {ex.loginSignupButton}
          </button>
        </div>
      )}

      {/* 2 & 3. Full-Screen Search View */}
      <ExploreSearchModal
        open={searchModalField !== null}
        initialFocusField={searchModalField ?? 'query'}
        lang={lang}
        query={filters.query}
        locationLabel={filters.locationLabel}
        recentSearches={recentSearches}
        onChangeQuery={(nextQuery) =>
          onChangeFilters({ ...filters, query: nextQuery })
        }
        onSelectLocation={(nextLocation) =>
          onChangeFilters({ ...filters, locationLabel: nextLocation })
        }
        onSubmitSearch={handleCommitSearch}
        onClose={() => setSearchModalField(null)}
      />
    </div>
  );
};
