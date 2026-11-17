import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  Layers,
  MapPin,
  Megaphone,
  RefreshCw,
  Sparkles,
  Star,
  UserPlus,
} from 'lucide-react';
import type { AiLibraryItem } from '../data/aiStudio';
import {
  BUSINESSES,
  type BookingRecord,
  type BusinessCategory,
} from '../data/businesses';
import type {
  EmployeeIndustryDataset,
  TimeOffRequestRecord,
  TimeOffType,
} from '../data/employee';
import type {
  SocialMediaPresetId,
  SocialPostRecord,
  SocialPostStatus,
} from '../data/socialHub';
import { getCopy } from '../i18n/translations';
import {
  UI_CLASSES,
  type EmployeeIndustryId,
  type Language,
  type ProfileRoleId,
  type SocialChannelId,
} from '../theme/tokens';
import type { ClaimedBusinessProfile } from '../utils/ownerClaimLogic';
import type { UserSession } from '../utils/appLogic';
import { DEFAULT_EXPLORE_FILTERS, type ExploreFilters } from '../utils/clientLogic';
import type { ShellTabId } from './BottomTabBar';
import { BusinessProfileView } from './client/BusinessProfileView';
import { ClientBookView } from './client/ClientBookView';
import { ClientBookingsView } from './client/ClientBookingsView';
import { ClientExploreView } from './client/ClientExploreView';
import { ClientHelpView } from './client/ClientHelpView';
import { ClientHomeView } from './client/ClientHomeView';
import { EmployeeClientsView } from './employee/EmployeeClientsView';
import { EmployeeProfileView } from './employee/EmployeeProfileView';
import { EmployeeScheduleView } from './employee/EmployeeScheduleView';
import { EmployeeTodayView } from './employee/EmployeeTodayView';
import { AiStudioView } from './ai/AiStudioView';
import { ClaimBusinessFlow } from './owner/ClaimBusinessFlow';
import { SocialHubView } from './social/SocialHubView';
import type { SocialComposerPrefill } from './social/SocialCreateTab';
import { ProfileSwitcher } from './ProfileSwitcher';
import { ROLE_ICONS } from './roleIcons';

interface ShellTabViewProps {
  activeTab: ShellTabId;
  lang: Language;
  session: UserSession;
  bookings: BookingRecord[];
  selectedBusinessId: string | null;
  onSelectTab: (tab: ShellTabId) => void;
  onSelectBusiness: (businessId: string | null) => void;
  onAddBooking: (booking: BookingRecord) => void;
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string, dateKey: string, timeSlot: string) => void;
  onHelpMessageSent: (senderName: string) => void;
  onReturnToLaunch: () => void;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
  onSwitchRole: (role: ProfileRoleId) => void;
  onOpenCreateAccount: () => void;
  employeeIndustry: EmployeeIndustryId;
  employeeDataset: EmployeeIndustryDataset;
  employeeTimeOffRequests: TimeOffRequestRecord[];
  onChangeEmployeeIndustry: (industry: EmployeeIndustryId) => void;
  onStartEmployeeAppointment: (appointmentId: string) => void;
  onCompleteEmployeeAppointment: (appointmentId: string) => void;
  onSubmitTimeOff: (input: {
    dayId: string;
    type: TimeOffType;
    reason: string;
  }) => void;
  onCancelTimeOff: (requestId: string) => void;
  onSaveEmployeeClientNote: (clientId: string, nextNote: string) => void;
  socialPosts: SocialPostRecord[];
  onSaveSocialPost: (input: {
    caption: string;
    channels: SocialChannelId[];
    dateKey: string;
    time24: string;
    mediaPresetId: SocialMediaPresetId | null;
    status: SocialPostStatus;
  }) => void;
  onRescheduleSocialPost: (
    postId: string,
    nextDateKey: string,
    nextTime24: string
  ) => void;
  onSwapSocialPostSlots: (draggedId: string, targetId: string) => void;
  onDeleteSocialPost: (postId: string) => void;
  aiCredits: number;
  aiLibrary: AiLibraryItem[];
  socialComposerPrefill: SocialComposerPrefill | null;
  onSpendAiCredits: (cost: number) => boolean;
  onTopUpAiCredits: () => void;
  onSaveAiLibraryItem: (item: AiLibraryItem) => void;
  onRemoveAiLibraryItem: (itemId: string) => void;
  onSendAiToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
  claimedBusiness: ClaimedBusinessProfile | null;
  ownerOnboardingOpen: boolean;
  onOpenOwnerClaim: () => void;
  onCloseOwnerClaim: () => void;
  onFinishOwnerClaim: (claimed: ClaimedBusinessProfile) => void;
}

export const ShellTabView: React.FC<ShellTabViewProps> = ({
  activeTab,
  lang,
  session,
  bookings,
  selectedBusinessId,
  onSelectTab,
  onSelectBusiness,
  onAddBooking,
  onCancelBooking,
  onRescheduleBooking,
  onHelpMessageSent,
  onReturnToLaunch,
  onOpenAlerts,
  onOpenProfile,
  onSwitchRole,
  onOpenCreateAccount,
  employeeIndustry,
  employeeDataset,
  employeeTimeOffRequests,
  onChangeEmployeeIndustry,
  onStartEmployeeAppointment,
  onCompleteEmployeeAppointment,
  onSubmitTimeOff,
  onCancelTimeOff,
  onSaveEmployeeClientNote,
  socialPosts,
  onSaveSocialPost,
  onRescheduleSocialPost,
  onSwapSocialPostSlots,
  onDeleteSocialPost,
  aiCredits,
  aiLibrary,
  socialComposerPrefill,
  onSpendAiCredits,
  onTopUpAiCredits,
  onSaveAiLibraryItem,
  onRemoveAiLibraryItem,
  onSendAiToComposer,
  claimedBusiness,
  ownerOnboardingOpen,
  onOpenOwnerClaim,
  onCloseOwnerClaim,
  onFinishOwnerClaim,
}) => {
  const t = getCopy(lang);
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const activeRole = session.activeRole;
  const roleCopy = t.profileTypes.roles[activeRole];
  const RoleIcon = ROLE_ICONS[activeRole];

  const [exploreFilters, setExploreFilters] = useState<ExploreFilters>(DEFAULT_EXPLORE_FILTERS);
  const [ownerToolView, setOwnerToolView] = useState<'none' | 'social_hub' | 'ai_studio'>('none');
  const [bookTarget, setBookTarget] = useState<{
    businessId: string | null;
    serviceId: string | null;
    staffId: string | null;
    dateKey: string | null;
  }>({ businessId: null, serviceId: null, staffId: null, dateKey: null });

  const isSignedIn = session.mode !== 'guest' && Boolean(session.email);
  const identityLine = isSignedIn
    ? `${t.shell.signedInPrefix} ${
        session.firstName ? `${session.firstName} (${session.email})` : session.email
      }`
    : t.shell.guestStatus;

  const startBookingFor = (
    businessId: string,
    serviceId?: string,
    staffId?: string,
    dateKey?: string
  ) => {
    setBookTarget({
      businessId,
      serviceId: serviceId ?? null,
      staffId: staffId ?? null,
      dateKey: dateKey ?? null,
    });
    onSelectBusiness(null);
    onSelectTab('book');
  };

  const openExploreWithCategory = (category?: 'all' | BusinessCategory) => {
    if (category) {
      setExploreFilters((prev) => ({ ...prev, category }));
    }
    onSelectBusiness(null);
    onSelectTab('explore');
  };

  // Employee role full experience (Today, Schedule, Clients, Profile)
  if (activeRole === 'employee') {
    if (activeTab === 'schedule') {
      return (
        <EmployeeScheduleView
          lang={lang}
          industry={employeeIndustry}
          dataset={employeeDataset}
          schedule={employeeDataset.weeklySchedule}
          timeOffRequests={employeeTimeOffRequests}
          onSubmitTimeOff={onSubmitTimeOff}
          onCancelTimeOff={onCancelTimeOff}
        />
      );
    }

    if (activeTab === 'clients') {
      return (
        <EmployeeClientsView
          lang={lang}
          industry={employeeIndustry}
          dataset={employeeDataset}
          clients={employeeDataset.clients}
          onSaveClientNote={onSaveEmployeeClientNote}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <EmployeeProfileView
          lang={lang}
          session={session}
          industry={employeeIndustry}
          dataset={employeeDataset}
          onChangeIndustry={onChangeEmployeeIndustry}
          onSwitchRole={onSwitchRole}
          onOpenCreateAccount={onOpenCreateAccount}
          onReturnToLaunch={onReturnToLaunch}
          onHelpMessageSent={onHelpMessageSent}
        />
      );
    }

    return (
      <EmployeeTodayView
        lang={lang}
        session={session}
        industry={employeeIndustry}
        dataset={employeeDataset}
        onChangeIndustry={onChangeEmployeeIndustry}
        onStartAppointment={onStartEmployeeAppointment}
        onCompleteAppointment={onCompleteEmployeeAppointment}
      />
    );
  }

  // Profile tab (used in Business Owner & Creator / Marketer shells)
  if (activeTab === 'profile') {
    return (
      <section
        aria-labelledby="shell-tab-heading"
        className="mx-auto w-full max-w-4xl flex-1 px-4 pt-6 pb-28 sm:px-6 sm:pt-10"
      >
        <div className={`${UI_CLASSES.card} space-y-6 p-6 sm:p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--bh-text-muted)]">
            <span className="text-[var(--bh-coral-text)]">{t.profile.title}</span>
            <span>{identityLine}</span>
          </div>

          <div>
            <h1
              id="shell-tab-heading"
              className="text-3xl font-extrabold tracking-tight text-[var(--bh-text)]"
            >
              {t.tabs.profile}
            </h1>
            <p className="mt-1 text-sm text-[var(--bh-text-muted)]">{roleCopy.title}</p>
          </div>

          <ProfileSwitcher lang={lang} activeRole={activeRole} onSelectRole={onSwitchRole} />

          <div className="flex flex-wrap gap-3 border-t border-[var(--bh-border)] pt-5">
            {!isSignedIn && (
              <button
                type="button"
                onClick={onOpenCreateAccount}
                className={UI_CLASSES.pillButtonPrimary}
              >
                <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.profile.createAccountButton}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReturnToLaunch}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.shell.backToLaunch}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Help tab works across Client and non-client roles
  if (activeTab === 'help') {
    return (
      <ClientHelpView
        lang={lang}
        defaultEmail={session.email}
        defaultName={
          session.firstName && session.lastName
            ? `${session.firstName} ${session.lastName}`
            : session.firstName ?? ''
        }
        onMessageSent={onHelpMessageSent}
      />
    );
  }

  // Client role full experience
  if (activeRole === 'client') {
    if (selectedBusinessId) {
      const biz = BUSINESSES.find((b) => b.id === selectedBusinessId);
      if (biz) {
        return (
          <BusinessProfileView
            lang={lang}
            business={biz}
            onBack={() => onSelectBusiness(null)}
            onBookService={startBookingFor}
          />
        );
      }
    }

    if (activeTab === 'home') {
      return (
        <ClientHomeView
          lang={lang}
          session={session}
          businesses={BUSINESSES}
          onOpenBusiness={(id) => onSelectBusiness(id)}
          onStartBook={(id) => startBookingFor(id)}
          onOpenExplore={openExploreWithCategory}
        />
      );
    }

    if (activeTab === 'explore') {
      return (
        <ClientExploreView
          lang={lang}
          businesses={BUSINESSES}
          filters={exploreFilters}
          isGuest={session.mode === 'guest'}
          onChangeFilters={setExploreFilters}
          onOpenBusiness={(id) => onSelectBusiness(id)}
          onStartBook={(id, staffId, dateKey) =>
            startBookingFor(id, undefined, staffId, dateKey)
          }
          onOpenCreateAccount={onOpenCreateAccount}
        />
      );
    }

    if (activeTab === 'book') {
      return (
        <ClientBookView
          lang={lang}
          businesses={BUSINESSES}
          initialBusinessId={bookTarget.businessId}
          initialServiceId={bookTarget.serviceId}
          initialStaffId={bookTarget.staffId}
          initialDateKey={bookTarget.dateKey}
          onConfirmBooking={onAddBooking}
          onViewBookings={() => onSelectTab('bookings')}
        />
      );
    }

    if (activeTab === 'bookings') {
      return (
        <ClientBookingsView
          lang={lang}
          bookings={bookings}
          onCancelBooking={onCancelBooking}
          onRescheduleBooking={onRescheduleBooking}
          onExploreBusinesses={() => onSelectTab('explore')}
          onBookAgain={(id) => startBookingFor(id)}
        />
      );
    }
  }

  // AI Studio (Creator / Marketer 'ai_studio' tab OR Business Owner shortcut)
  if (
    (activeRole === 'creator_marketer' && activeTab === 'ai_studio') ||
    (activeRole === 'business_owner' && ownerToolView === 'ai_studio')
  ) {
    return (
      <AiStudioView
        lang={lang}
        credits={aiCredits}
        library={aiLibrary}
        onSpendCredits={onSpendAiCredits}
        onTopUpCredits={onTopUpAiCredits}
        onSaveLibraryItem={onSaveAiLibraryItem}
        onRemoveLibraryItem={onRemoveAiLibraryItem}
        onSendToComposer={(payload) => {
          onSendAiToComposer(payload);
          if (activeRole === 'business_owner') {
            setOwnerToolView('social_hub');
          } else {
            onSelectTab('home');
          }
        }}
        onOpenSocialHub={() => {
          if (activeRole === 'business_owner') {
            setOwnerToolView('social_hub');
          } else {
            onSelectTab('home');
          }
        }}
        onBack={
          activeRole === 'business_owner'
            ? () => setOwnerToolView('none')
            : undefined
        }
      />
    );
  }

  // Creator / Marketer experience (Social Hub) & Business Owner Social Hub shortcut
  if (
    activeRole === 'creator_marketer' ||
    (activeRole === 'business_owner' && ownerToolView === 'social_hub')
  ) {
    return (
      <SocialHubView
        lang={lang}
        posts={socialPosts}
        composerPrefill={socialComposerPrefill}
        onSavePost={onSaveSocialPost}
        onReschedulePost={onRescheduleSocialPost}
        onSwapPostSlots={onSwapSocialPostSlots}
        onDeletePost={onDeleteSocialPost}
        onOpenAiStudio={() => {
          if (activeRole === 'business_owner') {
            setOwnerToolView('ai_studio');
          } else {
            onSelectTab('ai_studio');
          }
        }}
        onBack={
          activeRole === 'business_owner'
            ? () => setOwnerToolView('none')
            : undefined
        }
      />
    );
  }

  // Business Owner "CLAIM YOUR BUSINESS" onboarding wizard
  if (activeRole === 'business_owner' && ownerOnboardingOpen) {
    return (
      <ClaimBusinessFlow
        lang={lang}
        initialClaimed={claimedBusiness}
        onFinish={onFinishOwnerClaim}
        onCancel={onCloseOwnerClaim}
      />
    );
  }

  // Business Owner Home screen
  return (
    <section
      aria-labelledby="shell-tab-heading"
      className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 sm:pt-10"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={`${UI_CLASSES.card} p-6 sm:p-8 lg:col-span-7`}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--bh-text-muted)]">
            <span className="text-[var(--bh-coral-text)]">
              {claimedBusiness ? t.ownerClaim.summaryCardTitle : t.shell.emptyPlaceholderLabel}
            </span>
            <span>{identityLine}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]">
              <RoleIcon className="h-6 w-6" aria-hidden={true} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-[var(--bh-amber-text)]">
                {roleCopy.title}
              </p>
              <h1
                id="shell-tab-heading"
                className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-4xl"
              >
                {claimedBusiness ? claimedBusiness.name : roleCopy.homeTitle}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--bh-text-muted)]">
            {claimedBusiness ? t.ownerClaim.demoNote : roleCopy.homePlaceholder}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenOwnerClaim}
              className={UI_CLASSES.pillButtonPrimary}
            >
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {claimedBusiness ? t.ownerClaim.editButton : t.ownerClaim.startButton}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerToolView('ai_studio')}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.shell.openAiStudioButton}</span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerToolView('social_hub')}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.shell.openSocialHubButton}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.shell.switchProfileButton}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAlerts}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.alerts.title}</span>
            </button>

            <button
              type="button"
              onClick={onReturnToLaunch}
              className={UI_CLASSES.pillButtonSecondary}
            >
              <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.shell.backToLaunch}</span>
            </button>
          </div>
        </div>

        <aside className={`${UI_CLASSES.card} space-y-5 p-6 sm:p-8 lg:col-span-5`}>
          {claimedBusiness ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-[var(--bh-text)]">
                  {t.ownerClaim.summaryCardTitle}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bh-success-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--bh-success)]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {claimedBusiness.source === 'google'
                      ? t.ownerClaim.connectedBadge
                      : t.ownerClaim.manualBadge}
                  </span>
                </span>
              </div>

              <div className="space-y-2 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4 text-sm">
                <p className="font-extrabold text-[var(--bh-text)]">
                  {claimedBusiness.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--bh-text-muted)]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{claimedBusiness.address}</span>
                </p>
                <p className="tabular-nums text-xs text-[var(--bh-text-muted)]">
                  {claimedBusiness.hours}
                </p>
                <p className="tabular-nums flex items-center gap-1 text-xs font-bold text-[var(--bh-amber-text)]">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>
                    {claimedBusiness.rating !== null
                      ? `${claimedBusiness.rating.toFixed(1)} (${claimedBusiness.reviewCount} ${t.ownerClaim.reviewsSuffix})`
                      : t.ownerClaim.manualRatingValue}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[var(--bh-text-muted)]">{t.ownerClaim.step4Title}</span>
                <span className="font-bold text-[var(--bh-coral-text)]">
                  {t.ownerClaim.templates[claimedBusiness.industryTemplate].title}
                </span>
              </div>

              <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
                {t.ownerClaim.photosLabel}: {claimedBusiness.photos.length}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[var(--bh-amber-text)]" aria-hidden="true" />
                <h2 className="text-base font-bold text-[var(--bh-text)]">
                  {t.shell.designSystemSummaryTitle}
                </h2>
              </div>

              <dl className="divide-y divide-[var(--bh-border)]">
                {t.shell.designSystemItems.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <dt className="text-[var(--bh-text-muted)]">{row.label}</dt>
                    <dd className="tabular-nums font-semibold text-[var(--bh-text)]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};
