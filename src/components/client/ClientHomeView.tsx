import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, Star } from 'lucide-react';
import type { BusinessCategory, BusinessRecord } from '../../data/businesses';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import type { UserSession } from '../../utils/appLogic';
import { formatPriceLevel } from '../../utils/clientLogic';
import { BusinessPhotoPlaceholder, CATEGORY_ICONS } from './BusinessVisual';

interface ClientHomeViewProps {
  lang: Language;
  session: UserSession;
  businesses: BusinessRecord[];
  onOpenBusiness: (businessId: string) => void;
  onStartBook: (businessId: string) => void;
  onOpenExplore: (category?: 'all' | BusinessCategory) => void;
}

const CATEGORIES: Array<'all' | BusinessCategory> = [
  'all',
  'barber',
  'gym',
  'tailor',
  'salon',
  'clinic',
];

export const ClientHomeView: React.FC<ClientHomeViewProps> = ({
  lang,
  session,
  businesses,
  onOpenBusiness,
  onStartBook,
  onOpenExplore,
}) => {
  const copy = getCopy(lang);
  const t = copy.client;
  const [selectedCategory, setSelectedCategory] = useState<'all' | BusinessCategory>('all');

  const featuredList = useMemo(() => {
    return businesses.filter(
      (b) => b.featured && (selectedCategory === 'all' || b.category === selectedCategory)
    );
  }, [businesses, selectedCategory]);

  const nearbyList = useMemo(() => {
    return [...businesses]
      .filter((b) => selectedCategory === 'all' || b.category === selectedCategory)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [businesses, selectedCategory]);

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Greeting & Search Jump */}
      <section aria-labelledby="client-home-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
              {session.firstName
                ? `${t.home.greetingUserPrefix} ${session.firstName}`
                : copy.shell.guestStatus}
            </p>
            <h1
              id="client-home-heading"
              className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
            >
              {t.home.greetingGuest}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenExplore(selectedCategory)}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-5 py-3 text-start text-sm text-[var(--bh-text-muted)] transition-colors hover:border-[var(--bh-coral)]"
        >
          <Search className="h-4 w-4 shrink-0 text-[var(--bh-coral-text)]" aria-hidden="true" />
          <span className="truncate">{t.home.searchPrompt}</span>
        </button>

        {/* Category Chips */}
        <div
          role="group"
          aria-label={t.explore.filtersLabel}
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const Icon = cat === 'all' ? null : CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                    : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden={true} />}
                <span>{t.categories[cat]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Row */}
      {featuredList.length > 0 && (
        <section aria-labelledby="featured-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="featured-heading"
              className="text-xl font-extrabold tracking-tight text-[var(--bh-text)]"
            >
              {t.home.featuredHeading}
            </h2>
            <button
              type="button"
              onClick={() => onOpenExplore(selectedCategory)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--bh-coral-text)] whitespace-nowrap hover:underline"
            >
              <span>{t.home.seeAllExplore}</span>
              <Arrow className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {featuredList.map((biz) => {
              const name = lang === 'ar' ? biz.nameAr : biz.nameEn;
              const neighborhood = lang === 'ar' ? biz.neighborhoodAr : biz.neighborhoodEn;
              return (
                <article
                  key={biz.id}
                  className={`${UI_CLASSES.card} flex w-[280px] shrink-0 flex-col justify-between p-4 lg:w-auto`}
                >
                  <div>
                    <BusinessPhotoPlaceholder
                      category={biz.category}
                      tone={biz.coverTone}
                      label={name}
                      heightClass="h-32"
                    />
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
                        {t.categories[biz.category]} · {neighborhood}
                      </p>
                      <h3 className="text-base font-extrabold text-[var(--bh-text)]">
                        {name}
                      </h3>
                      <div className="tabular-nums flex items-center gap-2 text-xs text-[var(--bh-text-muted)]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--bh-amber-text)]">
                          <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                          {biz.rating.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{biz.distanceKm.toFixed(1)} km</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatPriceLevel(biz.priceLevel)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenBusiness(biz.id)}
                      className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] flex-1 px-4 py-2 text-xs`}
                    >
                      {t.explore.viewProfile}
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartBook(biz.id)}
                      className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-4 py-2 text-xs`}
                    >
                      {t.home.bookQuick}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Nearby List */}
      <section aria-labelledby="nearby-heading" className="space-y-4">
        <h2
          id="nearby-heading"
          className="text-xl font-extrabold tracking-tight text-[var(--bh-text)]"
        >
          {t.home.nearbyHeading}
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {nearbyList.map((biz) => {
            const name = lang === 'ar' ? biz.nameAr : biz.nameEn;
            const tagline = lang === 'ar' ? biz.taglineAr : biz.taglineEn;
            const neighborhood = lang === 'ar' ? biz.neighborhoodAr : biz.neighborhoodEn;
            const Icon = CATEGORY_ICONS[biz.category];

            return (
              <article
                key={biz.id}
                className={`${UI_CLASSES.card} flex items-center justify-between gap-4 p-4`}
              >
                <button
                  type="button"
                  onClick={() => onOpenBusiness(biz.id)}
                  className="flex min-w-0 flex-1 items-center gap-3.5 text-start"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] text-[var(--bh-coral-text)]">
                    <Icon className="h-5 w-5" aria-hidden={true} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-[var(--bh-text)] sm:text-base">
                      {name}
                    </h3>
                    <p className="truncate text-xs text-[var(--bh-text-muted)]">
                      {tagline}
                    </p>
                    <div className="tabular-nums mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--bh-text-muted)]">
                      <span className="font-semibold text-[var(--bh-amber-text)]">
                        {biz.rating.toFixed(1)} ★
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{biz.distanceKm.toFixed(1)} km</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatPriceLevel(biz.priceLevel)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{neighborhood}</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onStartBook(biz.id)}
                  aria-label={`${t.home.bookQuick} ${name}`}
                  className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] shrink-0 px-4 py-2 text-xs`}
                >
                  {t.home.bookQuick}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
