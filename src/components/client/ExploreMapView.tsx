import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import type { BusinessRecord } from '../../data/businesses';
import { BUSINESS_MAP_COORDS } from '../../data/exploreAndClaim';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';

interface ExploreMapViewProps {
  lang: Language;
  businesses: BusinessRecord[];
  locationLabel: string;
  onOpenBusiness: (businessId: string) => void;
  onStartBook: (businessId: string) => void;
}

const PIN_POSITIONS: Record<string, string> = {
  'biz-1': 'start-[22%] top-[24%]',
  'biz-2': 'start-[66%] top-[20%]',
  'biz-3': 'start-[46%] top-[40%]',
  'biz-4': 'start-[74%] top-[62%]',
  'biz-5': 'start-[34%] top-[52%]',
  'biz-6': 'start-[16%] top-[70%]',
  'biz-7': 'start-[56%] top-[30%]',
  'biz-8': 'start-[78%] top-[42%]',
  'biz-9': 'start-[14%] top-[42%]',
  'biz-10': 'start-[50%] top-[66%]',
  'biz-11': 'start-[68%] top-[76%]',
  'biz-12': 'start-[30%] top-[78%]',
};

export const ExploreMapView: React.FC<ExploreMapViewProps> = ({
  lang,
  businesses,
  locationLabel,
  onOpenBusiness,
  onStartBook,
}) => {
  const ex = getCopy(lang).client.explore;
  const [selectedId, setSelectedId] = useState<string>(businesses[0]?.id ?? '');

  useEffect(() => {
    if (!businesses.some((b) => b.id === selectedId)) {
      setSelectedId(businesses[0]?.id ?? '');
    }
  }, [businesses, selectedId]);

  const activeBiz = businesses.find((b) => b.id === selectedId) ?? businesses[0];

  return (
    <section aria-label={ex.mapPreviewLabel} className="space-y-4">
      <div className="relative h-[380px] w-full overflow-hidden rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface)] sm:h-[440px]">
        {/* Decorative Placeholder Street Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45 bg-[linear-gradient(to_right,var(--bh-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--bh-border)_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[46%] h-5 -rotate-3 bg-[var(--bh-surface-elevated)]/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 start-[48%] w-4 rotate-6 bg-[var(--bh-surface-elevated)]/80"
        />

        {/* Top Left/Right Label: "Map preview (demo)" */}
        <div className="absolute top-3 start-3 z-10 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--bh-amber)]/50 bg-[var(--bh-surface)]/95 px-3 py-1.5 text-xs font-extrabold text-[var(--bh-amber-text)] shadow-sm backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{ex.mapPreviewLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)]/95 px-3 py-1.5 text-xs font-semibold text-[var(--bh-text)] shadow-sm">
            <Navigation className="h-3 w-3 text-[var(--bh-coral-text)]" aria-hidden="true" />
            <span>{locationLabel || ex.locationPlaceholder}</span>
          </span>
        </div>

        {/* Center User Marker */}
        <div
          aria-hidden="true"
          className="absolute start-[48%] top-[48%] z-0 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sky-500/30"
        >
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-500" />
        </div>

        {/* Clickable Business Pins */}
        {businesses.map((biz, idx) => {
          const isSelected = activeBiz?.id === biz.id;
          const posClass =
            PIN_POSITIONS[biz.id] ??
            (BUSINESS_MAP_COORDS[biz.id]
              ? PIN_POSITIONS[`biz-${(idx % 12) + 1}`]
              : 'start-[50%] top-[50%]');
          const name = lang === 'ar' ? biz.nameAr : biz.nameEn;

          return (
            <button
              key={biz.id}
              type="button"
              onClick={() => setSelectedId(biz.id)}
              aria-label={`${name} (${biz.rating.toFixed(1)})`}
              aria-pressed={isSelected}
              className={`tabular-nums absolute z-10 inline-flex min-h-[36px] -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-md transition-transform ${posClass} ${
                isSelected
                  ? 'z-20 scale-110 bg-[var(--bh-coral)] text-[var(--bh-coral-ink)] ring-4 ring-[var(--bh-coral)]/30'
                  : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
              }`}
            >
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>{biz.rating.toFixed(1)}</span>
            </button>
          );
        })}

        {/* Floating Small Selected Card */}
        {activeBiz && (
          <article className="absolute inset-x-3 bottom-3 z-20 rounded-[18px] border border-[var(--bh-border)] bg-[var(--bh-surface)]/95 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenBusiness(activeBiz.id)}
                    className="truncate text-start text-sm font-extrabold text-[var(--bh-text)] hover:text-[var(--bh-coral-text)]"
                  >
                    {lang === 'ar' ? activeBiz.nameAr : activeBiz.nameEn}
                  </button>
                  {activeBiz.featured && (
                    <span className="rounded-full bg-[var(--bh-amber-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--bh-amber-text)]">
                      {ex.featuredTag}
                    </span>
                  )}
                </div>

                <div className="tabular-nums mt-1 flex items-center gap-2 text-xs text-[var(--bh-text-muted)]">
                  <span className="inline-flex items-center gap-1 font-bold text-[var(--bh-amber-text)]">
                    <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    {activeBiz.rating.toFixed(1)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBiz.distanceKm.toFixed(1)} km</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'ar'
                      ? activeBiz.neighborhoodAr
                      : activeBiz.neighborhoodEn}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartBook(activeBiz.id)}
                className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-5 py-2 text-xs shrink-0`}
              >
                {ex.bookNow}
              </button>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};
