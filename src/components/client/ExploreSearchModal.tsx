import React, { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Crosshair,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { FAKE_EXPLORE_CITIES } from '../../data/exploreAndClaim';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';

interface ExploreSearchModalProps {
  open: boolean;
  initialFocusField: 'query' | 'location';
  lang: Language;
  query: string;
  locationLabel: string;
  recentSearches: string[];
  onChangeQuery: (q: string) => void;
  onSelectLocation: (label: string) => void;
  onSubmitSearch: (q: string) => void;
  onClose: () => void;
}

export const ExploreSearchModal: React.FC<ExploreSearchModalProps> = ({
  open,
  initialFocusField,
  lang,
  query,
  locationLabel,
  recentSearches,
  onChangeQuery,
  onSelectLocation,
  onSubmitSearch,
  onClose,
}) => {
  const ex = getCopy(lang).client.explore;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const queryInputRef = useRef<HTMLInputElement | null>(null);
  const [activeField, setActiveField] = React.useState<'query' | 'location'>(
    initialFocusField
  );

  useEffect(() => {
    if (!open) return;
    setActiveField(initialFocusField);
    if (initialFocusField === 'query') {
      window.setTimeout(() => queryInputRef.current?.focus(), 40);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, initialFocusField, onClose]);

  if (!open) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSearch(query);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ex.title}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bh-bg)] text-[var(--bh-text)]"
    >
      {/* Top Bar + Two Stacked Pill Fields */}
      <div className="border-b border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 pt-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label={ex.backAria}
              className={UI_CLASSES.iconButton}
            >
              <BackArrow className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="text-sm font-extrabold text-[var(--bh-text)]">
              {ex.title}
            </span>

            <button
              type="button"
              onClick={() => {
                onSubmitSearch(query);
                onClose();
              }}
              className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--bh-coral)] px-4 py-2 text-xs font-bold text-[var(--bh-coral-ink)]"
            >
              {ex.applySearch}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            {/* Field 1: Search */}
            <div className="relative">
              <label htmlFor="fullscreen-explore-query" className="sr-only">
                {ex.searchLabel}
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 start-4 h-[18px] w-[18px] -translate-y-1/2 text-[var(--bh-coral-text)]"
                aria-hidden="true"
              />
              <input
                ref={queryInputRef}
                id="fullscreen-explore-query"
                type="search"
                value={query}
                onFocus={() => setActiveField('query')}
                onChange={(e) => onChangeQuery(e.target.value)}
                placeholder={ex.searchPlaceholder}
                className={`${UI_CLASSES.inputPill} ps-11 pe-12 ${
                  activeField === 'query' ? 'border-[var(--bh-coral)]' : ''
                }`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onChangeQuery('')}
                  aria-label={ex.clearSearch}
                  className="absolute top-1/2 end-1.5 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Field 2: Location */}
            <button
              type="button"
              onClick={() => setActiveField('location')}
              className={`flex min-h-[48px] w-full items-center gap-3 rounded-full border bg-[var(--bh-bg)] px-4 py-3 text-start text-[15px] transition-colors ${
                activeField === 'location'
                  ? 'border-[var(--bh-coral)] text-[var(--bh-text)]'
                  : 'border-[var(--bh-border)] text-[var(--bh-text)]'
              }`}
            >
              <MapPin
                className="h-[18px] w-[18px] shrink-0 text-[var(--bh-amber-text)]"
                aria-hidden="true"
              />
              <span
                className={
                  locationLabel
                    ? 'font-semibold text-[var(--bh-text)]'
                    : 'text-[var(--bh-text-muted)]'
                }
              >
                {locationLabel || ex.locationPlaceholder}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Body: Recent Searches (Field 1) OR Location Suggestions (Field 2) */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {activeField === 'location' ? (
            <div className="space-y-4">
              {/* "Use my current location" (fake) */}
              <button
                type="button"
                onClick={() => {
                  onSelectLocation('');
                  setActiveField('query');
                }}
                className="flex min-h-[52px] w-full items-center gap-3 rounded-[20px] border border-[var(--bh-coral)]/50 bg-[var(--bh-coral-soft)] px-4 py-3 text-start text-sm font-bold text-[var(--bh-coral-text)] transition-colors hover:border-[var(--bh-coral)]"
              >
                <Crosshair className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{ex.useCurrentLocation}</span>
              </button>

              <div className="space-y-2">
                <p className="text-xs font-extrabold tracking-wider text-[var(--bh-text-muted)]">
                  {ex.citiesHeading}
                </p>
                <div className="space-y-2">
                  {FAKE_EXPLORE_CITIES.map((city) => {
                    const cityName = lang === 'ar' ? city.nameAr : city.nameEn;
                    const hint = lang === 'ar' ? city.districtHintAr : city.districtHintEn;
                    const selected = locationLabel === cityName;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          onSelectLocation(cityName);
                          onClose();
                        }}
                        className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[20px] border px-4 py-3 text-start transition-colors ${
                          selected
                            ? 'border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)]'
                            : 'border-[var(--bh-border)] bg-[var(--bh-surface)] hover:border-[var(--bh-coral)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin
                            className="h-4 w-4 shrink-0 text-[var(--bh-amber-text)]"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-sm font-bold text-[var(--bh-text)]">
                              {cityName}
                            </p>
                            <p className="text-xs text-[var(--bh-text-muted)]">{hint}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-extrabold tracking-wider text-[var(--bh-text-muted)]">
                {ex.recentSearchesHeading}
              </p>
              <div className="divide-y divide-[var(--bh-border)] overflow-hidden rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface)]">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      onChangeQuery(term);
                      onSubmitSearch(term);
                      onClose();
                    }}
                    className="flex min-h-[50px] w-full items-center gap-3 px-4 py-3 text-start text-sm font-semibold text-[var(--bh-text)] transition-colors hover:bg-[var(--bh-surface-elevated)]"
                  >
                    <Clock
                      className="h-4 w-4 shrink-0 text-[var(--bh-text-muted)]"
                      aria-hidden="true"
                    />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
