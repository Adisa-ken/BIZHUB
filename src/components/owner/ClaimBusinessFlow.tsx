import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Info,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import {
  FAKE_GOOGLE_LISTINGS,
  OWNER_INDUSTRY_TEMPLATE_IDS,
  type FakeGoogleListing,
} from '../../data/exploreAndClaim';
import { getCopy } from '../../i18n/translations';
import {
  UI_CLASSES,
  type Language,
  type OwnerIndustryTemplateId,
} from '../../theme/tokens';
import {
  addPlaceholderClaimPhoto,
  createDraftFromGoogleListing,
  createManualClaimDraft,
  filterGoogleListings,
  finalizeClaimedBusiness,
  findSuggestedTemplateForListing,
  removeClaimPhoto,
  validateClaimDraft,
  type ClaimedBusinessProfile,
  type OwnerClaimDraft,
} from '../../utils/ownerClaimLogic';

interface ClaimBusinessFlowProps {
  lang: Language;
  initialClaimed?: ClaimedBusinessProfile | null;
  onFinish: (claimed: ClaimedBusinessProfile) => void;
  onCancel?: () => void;
}

const PHOTO_TONE_CLASSES: Record<'coral' | 'amber' | 'slate' | 'emerald', string> = {
  coral: 'from-rose-500/30 via-amber-500/15 to-slate-900/50',
  amber: 'from-amber-500/30 via-orange-500/15 to-slate-900/50',
  slate: 'from-slate-500/30 via-indigo-500/15 to-slate-900/50',
  emerald: 'from-emerald-500/30 via-teal-500/15 to-slate-900/50',
};

export const ClaimBusinessFlow: React.FC<ClaimBusinessFlowProps> = ({
  lang,
  initialClaimed,
  onFinish,
  onCancel,
}) => {
  const t = getCopy(lang).ownerClaim;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialClaimed ? 3 : 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<FakeGoogleListing | null>(
    FAKE_GOOGLE_LISTINGS[0]
  );
  const [draft, setDraft] = useState<OwnerClaimDraft>(() =>
    initialClaimed
      ? {
          source: initialClaimed.source,
          googleListingId: null,
          name: initialClaimed.name,
          address: initialClaimed.address,
          hours: initialClaimed.hours,
          rating: initialClaimed.rating,
          reviewCount: initialClaimed.reviewCount,
          photos: initialClaimed.photos,
        }
      : createDraftFromGoogleListing(FAKE_GOOGLE_LISTINGS[0], lang)
  );
  const [templateId, setTemplateId] = useState<OwnerIndustryTemplateId>(
    initialClaimed?.industryTemplate ?? 'barber'
  );
  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'address', 'nameRequired' | 'addressRequired'>>
  >({});

  const googleResults = filterGoogleListings(FAKE_GOOGLE_LISTINGS, searchQuery);

  const handleSelectListing = (listing: FakeGoogleListing) => {
    setSelectedListing(listing);
    setDraft(createDraftFromGoogleListing(listing, lang));
    setTemplateId(findSuggestedTemplateForListing(listing.id));
    setErrors({});
    setStep(2);
  };

  const handleStartManual = () => {
    setSelectedListing(null);
    setDraft(createManualClaimDraft());
    setErrors({});
    setStep(3);
  };

  const handleContinueFromStep3 = () => {
    const check = validateClaimDraft(draft);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setStep(4);
  };

  const handleFinish = () => {
    const check = validateClaimDraft(draft);
    if (!check.valid) {
      setErrors(check.errors);
      setStep(3);
      return;
    }
    onFinish(finalizeClaimedBusiness(draft, templateId));
  };

  return (
    <section
      aria-labelledby="owner-claim-heading"
      className="mx-auto w-full max-w-3xl flex-1 space-y-5 px-4 pt-5 pb-28 sm:px-6 sm:pt-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="tabular-nums text-xs font-bold text-[var(--bh-coral-text)]">
            {t.stepLabel} {step} {t.ofLabel}
          </p>
          <h1
            id="owner-claim-heading"
            className="mt-0.5 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
          >
            {t.title}
          </h1>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
          >
            <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.backButton}</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {([1, 2, 3, 4] as const).map((idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-colors ${
              step >= idx ? 'bg-[var(--bh-coral)]' : 'bg-[var(--bh-border)]'
            }`}
          />
        ))}
      </div>

      {/* Mandatory Demo Note */}
      <div
        role="status"
        className="flex items-center gap-2.5 rounded-[16px] border border-[var(--bh-amber)]/45 bg-[var(--bh-amber-soft)] px-4 py-3 text-sm font-semibold text-[var(--bh-amber-text)]"
      >
        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t.demoNote}</span>
      </div>

      {/* Step 1: Find your business + 3 Google-style results + Create manually */}
      {step === 1 && (
        <div className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}>
          <h2 className="text-lg font-extrabold text-[var(--bh-text)]">
            {t.step1Title}
          </h2>

          <div className="relative">
            <label htmlFor="claim-find-business-input" className="sr-only">
              {t.findLabel}
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 start-4 h-[18px] w-[18px] -translate-y-1/2 text-[var(--bh-text-muted)]"
              aria-hidden="true"
            />
            <input
              id="claim-find-business-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.findPlaceholder}
              className={`${UI_CLASSES.inputPill} ps-11`}
            />
          </div>

          <div className="space-y-3">
            {googleResults.map((item) => {
              const name = lang === 'ar' ? item.nameAr : item.nameEn;
              const address = lang === 'ar' ? item.addressAr : item.addressEn;
              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-[18px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <span className="inline-block rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--bh-amber-text)]">
                      {t.googleBadge}
                    </span>
                    <h3 className="text-base font-extrabold text-[var(--bh-text)]">
                      {name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--bh-text-muted)]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{address}</span>
                    </p>
                    <p className="tabular-nums flex items-center gap-1 text-xs font-bold text-[var(--bh-amber-text)]">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      <span>
                        {item.rating.toFixed(1)} ({item.reviewCount} {t.reviewsSuffix})
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectListing(item)}
                    className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-5 py-2 text-xs shrink-0`}
                  >
                    {t.selectResultButton}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--bh-border)] pt-4">
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.noListingPrompt}
            </p>
            <button
              type="button"
              onClick={handleStartManual}
              className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
            >
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.createManualButton}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Connect Google Business Profile (fake) */}
      {step === 2 && selectedListing && (
        <div className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--bh-text)]">
              {t.step2Title}
            </h2>
            <p className="mt-1 text-sm text-[var(--bh-text-muted)]">
              {t.step2Subtitle}
            </p>
          </div>

          <div className="rounded-[18px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4 space-y-1.5">
            <p className="text-xs font-bold text-[var(--bh-amber-text)]">
              {t.googleBadge}
            </p>
            <p className="text-lg font-extrabold text-[var(--bh-text)]">
              {lang === 'ar' ? selectedListing.nameAr : selectedListing.nameEn}
            </p>
            <p className="text-xs text-[var(--bh-text-muted)]">
              {lang === 'ar' ? selectedListing.addressAr : selectedListing.addressEn}
            </p>
            <p className="tabular-nums flex items-center gap-1 pt-1 text-xs font-bold text-[var(--bh-amber-text)]">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              <span>
                {selectedListing.rating.toFixed(1)} ({selectedListing.reviewCount}{' '}
                {t.reviewsSuffix})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={UI_CLASSES.pillButtonSecondary}
            >
              {t.backButton}
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.connectGoogleButton}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Editable imported fake data (name, address, hours, photos, rating) */}
      {step === 3 && (
        <div className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--bh-text)]">
              {draft.source === 'manual' ? t.step3SubtitleManual : t.step3Title}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="claim-edit-name"
                className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
              >
                {t.nameLabel}
              </label>
              <input
                id="claim-edit-name"
                type="text"
                value={draft.name}
                onChange={(e) => {
                  setDraft((prev) => ({ ...prev, name: e.target.value }));
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={UI_CLASSES.inputPill}
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-xs font-semibold text-[var(--bh-error)]">
                  {t.errors[errors.name]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="claim-edit-address"
                className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
              >
                {t.addressLabel}
              </label>
              <input
                id="claim-edit-address"
                type="text"
                value={draft.address}
                onChange={(e) => {
                  setDraft((prev) => ({ ...prev, address: e.target.value }));
                  setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                className={UI_CLASSES.inputPill}
              />
              {errors.address && (
                <p role="alert" className="mt-1 text-xs font-semibold text-[var(--bh-error)]">
                  {t.errors[errors.address]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="claim-edit-hours"
                  className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
                >
                  {t.hoursLabel}
                </label>
                <input
                  id="claim-edit-hours"
                  type="text"
                  value={draft.hours}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, hours: e.target.value }))
                  }
                  className={`${UI_CLASSES.inputPill} tabular-nums`}
                />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-bold text-[var(--bh-text)]">
                  {t.ratingLabel}
                </p>
                <div className="tabular-nums flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-4 text-sm font-bold text-[var(--bh-amber-text)]">
                  <Star className="h-4 w-4 fill-current shrink-0" aria-hidden="true" />
                  <span>
                    {draft.rating !== null
                      ? `${draft.rating.toFixed(1)} (${draft.reviewCount} ${t.reviewsSuffix})`
                      : t.manualRatingValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Photos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[var(--bh-text)]">
                  {t.photosLabel} ({draft.photos.length})
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      photos: addPlaceholderClaimPhoto(prev.photos),
                    }))
                  }
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-full px-3 text-xs font-bold text-[var(--bh-coral-text)] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.addPhotoButton}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {draft.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative flex h-24 flex-col justify-end rounded-[16px] border border-[var(--bh-border)] bg-gradient-to-br p-2.5 ${PHOTO_TONE_CLASSES[photo.tone]}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          photos: removeClaimPhoto(prev.photos, photo.id),
                        }))
                      }
                      aria-label={`Remove ${photo.labelEn}`}
                      className="absolute top-1.5 end-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1120]/75 text-white hover:bg-[#0B1120]"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="inline-block max-w-full self-start truncate rounded-full bg-[#0B1120]/75 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {lang === 'ar' ? photo.labelAr : photo.labelEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(draft.source === 'manual' ? 1 : 2)}
              className={UI_CLASSES.pillButtonSecondary}
            >
              {t.backButton}
            </button>
            <button
              type="button"
              onClick={handleContinueFromStep3}
              className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
            >
              {t.continueButton}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Choose industry template, then finish */}
      {step === 4 && (
        <div className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--bh-text)]">
              {t.step4Title}
            </h2>
            <p className="mt-1 text-sm text-[var(--bh-text-muted)]">
              {t.step4Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OWNER_INDUSTRY_TEMPLATE_IDS.map((id) => {
              const tpl = t.templates[id];
              const active = templateId === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTemplateId(id)}
                  className={`flex min-h-[76px] flex-col justify-center rounded-[18px] border p-4 text-start transition-colors ${
                    active
                      ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-coral-soft)]'
                      : 'border-[var(--bh-border)] bg-[var(--bh-bg)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  <p className="text-sm font-extrabold text-[var(--bh-text)]">
                    {tpl.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">
                    {tpl.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className={UI_CLASSES.pillButtonSecondary}
            >
              {t.backButton}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.finishButton}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
