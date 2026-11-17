import { useEffect, useMemo, useState } from 'react';
import { AlertBoardSheet } from './components/AlertBoardSheet';
import { BottomTabBar, type ShellTabId } from './components/BottomTabBar';
import { FirstLaunchScreen } from './components/FirstLaunchScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ProfileHubSheet } from './components/ProfileHubSheet';
import { SelectProfileTypeSheet } from './components/SelectProfileTypeSheet';
import { ShellTabView } from './components/ShellTabView';
import { SignUpFormScreen } from './components/SignUpFormScreen';
import { TopBar } from './components/TopBar';
import {
  INITIAL_AI_CREDITS,
  INITIAL_AI_LIBRARY,
  DEMO_TOP_UP_AMOUNT,
  type AiLibraryItem,
} from './data/aiStudio';
import type { SocialComposerPrefill } from './components/social/SocialCreateTab';
import { INITIAL_BOOKINGS, type BookingRecord } from './data/businesses';
import {
  EMPLOYEE_INDUSTRY_DATA,
  type EmployeeIndustryDataset,
  type TimeOffRequestRecord,
  type TimeOffType,
} from './data/employee';
import {
  INITIAL_SOCIAL_POSTS,
  type SocialMediaPresetId,
  type SocialPostRecord,
  type SocialPostStatus,
} from './data/socialHub';
import { getCopy, INITIAL_ALERTS, type AlertItem } from './i18n/translations';
import type {
  EmployeeIndustryId,
  Language,
  ProfileRoleId,
  SocialChannelId,
  ThemeMode,
} from './theme/tokens';
import {
  countUnreadAlerts,
  createAccountSession,
  createGuestSession,
  getDirectionForLang,
  markAllAlertsRead,
  markAlertRead,
  parseInitialAutostart,
  resolveNextLang,
  resolveNextTheme,
  switchSessionRole,
  type SignUpFormInput,
  type UserSession,
} from './utils/appLogic';
import {
  cancelBookingById,
  rescheduleBookingById,
} from './utils/clientLogic';
import {
  applyTimeOffRequest,
  cancelTimeOffRequest,
  completeEmployeeAppointment,
  startEmployeeAppointment,
  updateEmployeeClientNote,
} from './utils/employeeLogic';
import {
  createSocialPost,
  deleteSocialPost,
  rescheduleSocialPost,
  swapQueuedPostSlots,
} from './utils/socialHubLogic';
import {
  deductAiCredits,
  removeFromAiLibrary,
  saveResultToLibrary,
  topUpDemoCredits,
} from './utils/aiStudioLogic';
import type { ClaimedBusinessProfile } from './utils/ownerClaimLogic';

export default function App() {
  const initialAutostart =
    typeof window !== 'undefined' ? parseInitialAutostart(window.location.search) : false;

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [screen, setScreen] = useState<'launch' | 'signup' | 'shell'>(
    initialAutostart ? 'shell' : 'launch'
  );
  const [session, setSession] = useState<UserSession>(() => createGuestSession('client'));
  const [activeTab, setActiveTab] = useState<ShellTabId>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>(() => INITIAL_BOOKINGS);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => INITIAL_ALERTS);
  const [openModal, setOpenModal] = useState<'alerts' | 'profile' | 'role-select' | null>(null);

  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [pendingRole, setPendingRole] = useState<ProfileRoleId>('client');

  const [employeeIndustry, setEmployeeIndustry] = useState<EmployeeIndustryId>('barber');
  const [employeeDatasets, setEmployeeDatasets] = useState<
    Record<EmployeeIndustryId, EmployeeIndustryDataset>
  >(() => EMPLOYEE_INDUSTRY_DATA);
  const [employeeTimeOffByIndustry, setEmployeeTimeOffByIndustry] = useState<
    Record<EmployeeIndustryId, TimeOffRequestRecord[]>
  >({
    barber: [],
    trainer: [],
    tailor: [],
  });
  const [socialPosts, setSocialPosts] = useState<SocialPostRecord[]>(
    () => INITIAL_SOCIAL_POSTS
  );
  const [aiCredits, setAiCredits] = useState<number>(INITIAL_AI_CREDITS);
  const [aiLibrary, setAiLibrary] = useState<AiLibraryItem[]>(
    () => INITIAL_AI_LIBRARY
  );
  const [socialComposerPrefill, setSocialComposerPrefill] =
    useState<SocialComposerPrefill | null>(null);
  const [claimedBusiness, setClaimedBusiness] = useState<ClaimedBusinessProfile | null>(null);
  const [ownerOnboardingOpen, setOwnerOnboardingOpen] = useState<boolean>(false);

  const unreadCount = useMemo(() => countUnreadAlerts(alerts), [alerts]);
  const copy = getCopy(lang);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0B1120' : '#F4F6FA');
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = getDirectionForLang(lang);
  }, [lang]);

  const handleBrowseGuest = () => {
    setSession(createGuestSession('client'));
    setSelectedBusinessId(null);
    setActiveTab('home');
    setScreen('shell');
  };

  const handleContinueEmail = (email: string) => {
    setPendingEmail(email);
    setOpenModal('role-select');
  };

  const handleOpenCreateAccount = () => {
    setPendingEmail('');
    setOpenModal('role-select');
  };

  const handleConfirmProfileType = (role: ProfileRoleId) => {
    setPendingRole(role);
    setOpenModal(null);
    setScreen('signup');
  };

  const handleCompleteSignUp = (
    data: Omit<SignUpFormInput, 'password'>,
    role: ProfileRoleId
  ) => {
    setSession(createAccountSession(data, role));
    setSelectedBusinessId(null);
    setOwnerOnboardingOpen(role === 'business_owner');
    setActiveTab(role === 'employee' ? 'today' : 'home');
    setScreen('shell');
  };

  const handleSwitchRole = (role: ProfileRoleId) => {
    setSession((prev) => switchSessionRole(prev, role));
    setSelectedBusinessId(null);
    setOwnerOnboardingOpen(false);
    setActiveTab(role === 'employee' ? 'today' : 'home');
    setScreen('shell');
  };

  const handleSignOutToLaunch = () => {
    setSession(createGuestSession('client'));
    setPendingEmail('');
    setSelectedBusinessId(null);
    setActiveTab('home');
    setScreen('launch');
  };

  const handleAddBooking = (booking: BookingRecord) => {
    setBookings((prev) => [booking, ...prev]);
    setAlerts((prev) => [
      {
        id: `alert-bk-${Date.now()}`,
        category: 'booking',
        titleEn: `Booking confirmed at ${booking.businessNameEn}`,
        titleAr: `تم تأكيد الحجز في ${booking.businessNameAr}`,
        bodyEn: `${booking.serviceNameEn} on ${booking.dateKey} at ${booking.timeSlot}.`,
        bodyAr: `${booking.serviceNameAr} بتاريخ ${booking.dateKey} الساعة ${booking.timeSlot}.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => cancelBookingById(prev, bookingId));
    setAlerts((prev) => [
      {
        id: `alert-cancel-${Date.now()}`,
        category: 'booking',
        titleEn: 'Appointment cancelled',
        titleAr: 'تم إلغاء الموعد',
        bodyEn: 'Your prototype appointment was moved to Past.',
        bodyAr: 'تم نقل موعدك التجريبي إلى قائمة السابقة.',
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleRescheduleBooking = (bookingId: string, dateKey: string, timeSlot: string) => {
    setBookings((prev) => rescheduleBookingById(prev, bookingId, dateKey, timeSlot));
    setAlerts((prev) => [
      {
        id: `alert-resched-${Date.now()}`,
        category: 'booking',
        titleEn: 'Appointment rescheduled',
        titleAr: 'تمت إعادة جدولة الموعد',
        bodyEn: `Updated to ${dateKey} at ${timeSlot}.`,
        bodyAr: `تم التحديث إلى ${dateKey} الساعة ${timeSlot}.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleHelpMessageSent = (senderName: string) => {
    setAlerts((prev) => [
      {
        id: `alert-help-${Date.now()}`,
        category: 'system',
        titleEn: 'Support message recorded',
        titleAr: 'تم تسجيل رسالة الدعم',
        bodyEn: `Thanks ${senderName} — prototype support request saved in memory.`,
        bodyAr: `شكراً ${senderName} — تم حفظ طلب الدعم التجريبي في الذاكرة.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleStartEmployeeAppointment = (appointmentId: string) => {
    setEmployeeDatasets((prev) => ({
      ...prev,
      [employeeIndustry]: {
        ...prev[employeeIndustry],
        appointments: startEmployeeAppointment(
          prev[employeeIndustry].appointments,
          appointmentId
        ),
      },
    }));
  };

  const handleCompleteEmployeeAppointment = (appointmentId: string) => {
    const now = new Date();
    const doneTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const target = employeeDatasets[employeeIndustry].appointments.find(
      (a) => a.id === appointmentId
    );
    setEmployeeDatasets((prev) => ({
      ...prev,
      [employeeIndustry]: {
        ...prev[employeeIndustry],
        appointments: completeEmployeeAppointment(
          prev[employeeIndustry].appointments,
          appointmentId,
          doneTime
        ),
      },
    }));

    if (target) {
      setAlerts((prev) => [
        {
          id: `alert-emp-done-${Date.now()}`,
          category: 'booking',
          titleEn: `Completed ${target.serviceEn}`,
          titleAr: `تم إتمام ${target.serviceAr}`,
          bodyEn: `${target.clientNameEn} finished at ${doneTime}. Earnings updated in Profile.`,
          bodyAr: `انتهى موعد ${target.clientNameAr} الساعة ${doneTime}. تم تحديث الأرباح في الملف الشخصي.`,
          timeEn: 'Just now',
          timeAr: 'الآن',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitEmployeeTimeOff = (input: {
    dayId: string;
    type: TimeOffType;
    reason: string;
  }) => {
    const result = applyTimeOffRequest(
      employeeDatasets[employeeIndustry].weeklySchedule,
      employeeTimeOffByIndustry[employeeIndustry],
      input
    );
    const createdRequest = result.created;
    if (!createdRequest) return;

    setEmployeeDatasets((prev) => ({
      ...prev,
      [employeeIndustry]: {
        ...prev[employeeIndustry],
        weeklySchedule: result.schedule,
      },
    }));
    setEmployeeTimeOffByIndustry((prev) => ({
      ...prev,
      [employeeIndustry]: result.requests,
    }));
    setAlerts((prev) => [
      {
        id: `alert-tor-${Date.now()}`,
        category: 'system',
        titleEn: 'Time-off request submitted',
        titleAr: 'تم إرسال طلب الإجازة',
        bodyEn: `${createdRequest.dayLabelEn} marked as time off requested (Demo).`,
        bodyAr: `تم تسجيل طلب إجازة ليوم ${createdRequest.dayLabelAr} (تجريبي).`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleCancelEmployeeTimeOff = (requestId: string) => {
    const result = cancelTimeOffRequest(
      employeeDatasets[employeeIndustry].weeklySchedule,
      employeeTimeOffByIndustry[employeeIndustry],
      requestId
    );
    setEmployeeDatasets((prev) => ({
      ...prev,
      [employeeIndustry]: {
        ...prev[employeeIndustry],
        weeklySchedule: result.schedule,
      },
    }));
    setEmployeeTimeOffByIndustry((prev) => ({
      ...prev,
      [employeeIndustry]: result.requests,
    }));
  };

  const handleSaveEmployeeClientNote = (clientId: string, nextNote: string) => {
    setEmployeeDatasets((prev) => ({
      ...prev,
      [employeeIndustry]: {
        ...prev[employeeIndustry],
        clients: updateEmployeeClientNote(
          prev[employeeIndustry].clients,
          clientId,
          nextNote,
          lang
        ),
      },
    }));
  };

  const handleSaveSocialPost = (input: {
    caption: string;
    channels: SocialChannelId[];
    dateKey: string;
    time24: string;
    mediaPresetId: SocialMediaPresetId | null;
    status: SocialPostStatus;
  }) => {
    const result = createSocialPost(socialPosts, input);
    setSocialPosts(result.posts);
    setAlerts((prev) => [
      {
        id: `alert-social-${Date.now()}`,
        category: 'promo',
        titleEn:
          input.status === 'scheduled'
            ? 'Social post scheduled (Demo)'
            : 'Social draft saved (Demo)',
        titleAr:
          input.status === 'scheduled'
            ? 'تمت جدولة المنشور (تجريبي)'
            : 'تم حفظ المسودة (تجريبي)',
        bodyEn: `${result.created.channels.length} channel(s) · ${result.created.dateKey} at ${result.created.time24}. Posts are not really published.`,
        bodyAr: `${result.created.channels.length} منصات · ${result.created.dateKey} الساعة ${result.created.time24}. لا يتم النشر فعلياً.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleRescheduleSocialPost = (
    postId: string,
    nextDateKey: string,
    nextTime24: string
  ) => {
    setSocialPosts((prev) =>
      rescheduleSocialPost(prev, postId, nextDateKey, nextTime24)
    );
  };

  const handleSwapSocialPostSlots = (draggedId: string, targetId: string) => {
    setSocialPosts((prev) => swapQueuedPostSlots(prev, draggedId, targetId));
  };

  const handleDeleteSocialPost = (postId: string) => {
    setSocialPosts((prev) => deleteSocialPost(prev, postId));
  };

  const handleSpendAiCredits = (cost: number): boolean => {
    const result = deductAiCredits(aiCredits, cost);
    if (!result.ok) return false;
    setAiCredits(result.nextBalance);
    return true;
  };

  const handleTopUpAiCredits = () => {
    setAiCredits((prev) => topUpDemoCredits(prev, DEMO_TOP_UP_AMOUNT));
  };

  const handleSaveAiLibraryItem = (item: AiLibraryItem) => {
    const result = saveResultToLibrary(aiLibrary, item);
    if (!result.added) return;
    setAiLibrary(result.library);
    setAlerts((prev) => [
      {
        id: `alert-ai-lib-${Date.now()}`,
        category: 'promo',
        titleEn: 'Saved to AI Library (Demo)',
        titleAr: 'تم الحفظ في مكتبة الذكاء (تجريبي)',
        bodyEn: `${item.titleEn} saved in browser memory.`,
        bodyAr: `تم حفظ ${item.titleAr} في ذاكرة المتصفح.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleRemoveAiLibraryItem = (itemId: string) => {
    setAiLibrary((prev) => removeFromAiLibrary(prev, itemId));
  };

  const handleSendAiToComposer = (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => {
    setSocialComposerPrefill({
      caption: payload.caption,
      mediaPresetId: payload.mediaPresetId,
      nonce: Date.now(),
    });
    setAlerts((prev) => [
      {
        id: `alert-ai-send-${Date.now()}`,
        category: 'promo',
        titleEn: 'Sent to Social Hub composer (Demo)',
        titleAr: 'تم الإرسال لمحرر مركز التواصل (تجريبي)',
        bodyEn: 'AI Studio placeholder asset loaded into your Social Hub composer.',
        bodyAr: 'تم تحميل محتوى استوديو الذكاء المبدئي في محرر مركز التواصل.',
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleFinishOwnerClaim = (claimed: ClaimedBusinessProfile) => {
    setClaimedBusiness(claimed);
    setOwnerOnboardingOpen(false);
    setAlerts((prev) => [
      {
        id: `alert-claim-${Date.now()}`,
        category: 'system',
        titleEn: 'Business profile claimed (Demo)',
        titleAr: 'تم ربط ملف النشاط التجاري (تجريبي)',
        bodyEn: `${claimed.name} saved with ${claimed.industryTemplate} template.`,
        bodyAr: `تم حفظ ${claimed.name} بنجاح.`,
        timeEn: 'Just now',
        timeAr: 'الآن',
        read: false,
      },
      ...prev,
    ]);
  };

  return (
    <div
      dir={getDirectionForLang(lang)}
      className="flex min-h-dvh flex-col bg-[var(--bh-bg)] text-[var(--bh-text)]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-full focus:bg-[var(--bh-coral)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bh-coral-ink)]"
      >
        {copy.skipToContent}
      </a>

      <OfflineIndicator lang={lang} />

      <TopBar
        theme={theme}
        lang={lang}
        session={screen === 'shell' ? session : null}
        unreadCount={unreadCount}
        onToggleTheme={() => setTheme((prev) => resolveNextTheme(prev))}
        onToggleLang={() => setLang((prev) => resolveNextLang(prev))}
        onOpenAlerts={() => setOpenModal('alerts')}
        onOpenProfile={() => setOpenModal('profile')}
        onLogoClick={() => {
          if (screen === 'shell') {
            setSelectedBusinessId(null);
            setActiveTab(session.activeRole === 'employee' ? 'today' : 'home');
          }
        }}
      />

      <main id="main-content" className="flex flex-1 flex-col">
        {screen === 'launch' && (
          <FirstLaunchScreen
            lang={lang}
            onBrowseGuest={handleBrowseGuest}
            onContinueEmail={handleContinueEmail}
            onOpenCreateAccount={handleOpenCreateAccount}
          />
        )}

        {screen === 'signup' && (
          <SignUpFormScreen
            lang={lang}
            selectedRole={pendingRole}
            prefilledEmail={pendingEmail}
            onBackToRoles={() => setOpenModal('role-select')}
            onCancel={() => setScreen('launch')}
            onCompleteSignUp={handleCompleteSignUp}
          />
        )}

        {screen === 'shell' && (
          <ShellTabView
            activeTab={activeTab}
            lang={lang}
            session={session}
            bookings={bookings}
            selectedBusinessId={selectedBusinessId}
            onSelectTab={(tab) => {
              setSelectedBusinessId(null);
              setActiveTab(tab);
            }}
            onSelectBusiness={setSelectedBusinessId}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            onRescheduleBooking={handleRescheduleBooking}
            onHelpMessageSent={handleHelpMessageSent}
            onReturnToLaunch={() => setScreen('launch')}
            onOpenAlerts={() => setOpenModal('alerts')}
            onOpenProfile={() => setOpenModal('profile')}
            onSwitchRole={handleSwitchRole}
            onOpenCreateAccount={handleOpenCreateAccount}
            employeeIndustry={employeeIndustry}
            employeeDataset={employeeDatasets[employeeIndustry]}
            employeeTimeOffRequests={employeeTimeOffByIndustry[employeeIndustry]}
            onChangeEmployeeIndustry={setEmployeeIndustry}
            onStartEmployeeAppointment={handleStartEmployeeAppointment}
            onCompleteEmployeeAppointment={handleCompleteEmployeeAppointment}
            onSubmitTimeOff={handleSubmitEmployeeTimeOff}
            onCancelTimeOff={handleCancelEmployeeTimeOff}
            onSaveEmployeeClientNote={handleSaveEmployeeClientNote}
            socialPosts={socialPosts}
            onSaveSocialPost={handleSaveSocialPost}
            onRescheduleSocialPost={handleRescheduleSocialPost}
            onSwapSocialPostSlots={handleSwapSocialPostSlots}
            onDeleteSocialPost={handleDeleteSocialPost}
            aiCredits={aiCredits}
            aiLibrary={aiLibrary}
            socialComposerPrefill={socialComposerPrefill}
            onSpendAiCredits={handleSpendAiCredits}
            onTopUpAiCredits={handleTopUpAiCredits}
            onSaveAiLibraryItem={handleSaveAiLibraryItem}
            onRemoveAiLibraryItem={handleRemoveAiLibraryItem}
            onSendAiToComposer={handleSendAiToComposer}
            claimedBusiness={claimedBusiness}
            ownerOnboardingOpen={ownerOnboardingOpen}
            onOpenOwnerClaim={() => setOwnerOnboardingOpen(true)}
            onCloseOwnerClaim={() => setOwnerOnboardingOpen(false)}
            onFinishOwnerClaim={handleFinishOwnerClaim}
          />
        )}
      </main>

      {screen === 'shell' && (
        <BottomTabBar
          activeTab={activeTab}
          activeRole={session.activeRole}
          lang={lang}
          onSelectTab={(tab) => {
            setSelectedBusinessId(null);
            setActiveTab(tab);
          }}
        />
      )}

      <SelectProfileTypeSheet
        open={openModal === 'role-select'}
        lang={lang}
        initialRole={screen === 'signup' ? pendingRole : null}
        onClose={() => setOpenModal(null)}
        onConfirmRole={handleConfirmProfileType}
      />

      <AlertBoardSheet
        open={openModal === 'alerts'}
        lang={lang}
        alerts={alerts}
        onClose={() => setOpenModal(null)}
        onMarkRead={(id) => setAlerts((prev) => markAlertRead(prev, id))}
        onMarkAllRead={() => setAlerts((prev) => markAllAlertsRead(prev))}
      />

      <ProfileHubSheet
        open={openModal === 'profile'}
        lang={lang}
        theme={theme}
        session={session}
        onClose={() => setOpenModal(null)}
        onToggleTheme={() => setTheme((prev) => resolveNextTheme(prev))}
        onToggleLang={() => setLang((prev) => resolveNextLang(prev))}
        onSwitchRole={handleSwitchRole}
        onOpenCreateAccount={handleOpenCreateAccount}
        onSignOutToLaunch={handleSignOutToLaunch}
      />
    </div>
  );
}
