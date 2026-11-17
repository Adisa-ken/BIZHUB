import type {
  EmployeeAppointment,
  EmployeeClientRecord,
  EmployeeEarningsBase,
  EmployeeShiftDay,
  TimeOffRequestRecord,
  TimeOffType,
} from '../data/employee';

export interface EmployeeEarningsSummary {
  todayCommission: number;
  todayTips: number;
  todayTotal: number;
  weekCommission: number;
  weekTips: number;
  weekTotal: number;
  monthToDateTotal: number;
  completedTodayCount: number;
  completedWeekCount: number;
  averageTicket: number;
}

export interface TimeOffValidationResult {
  valid: boolean;
  errorKey: 'dayRequired' | 'dayOffBlocked' | 'reasonTooShort' | null;
}

export function sortAppointmentsByTime(
  appointments: EmployeeAppointment[]
): EmployeeAppointment[] {
  return [...appointments].sort((a, b) => a.time24.localeCompare(b.time24));
}

export function startEmployeeAppointment(
  appointments: EmployeeAppointment[],
  appointmentId: string
): EmployeeAppointment[] {
  return appointments.map((appt) =>
    appt.id === appointmentId && appt.status === 'scheduled'
      ? { ...appt, status: 'in_progress' }
      : appt
  );
}

export function completeEmployeeAppointment(
  appointments: EmployeeAppointment[],
  appointmentId: string,
  completedAtLabel = 'Just now'
): EmployeeAppointment[] {
  return appointments.map((appt) =>
    appt.id === appointmentId && appt.status !== 'completed'
      ? { ...appt, status: 'completed', completedAtLabel }
      : appt
  );
}

export function calculateEmployeeEarnings(
  base: EmployeeEarningsBase,
  appointments: EmployeeAppointment[]
): EmployeeEarningsSummary {
  const completedToday = appointments.filter((appt) => appt.status === 'completed');
  const rate = base.commissionRatePercent / 100;

  const todayCommission = Math.round(
    completedToday.reduce((sum, appt) => sum + appt.price * rate, 0)
  );
  const todayTips = completedToday.reduce((sum, appt) => sum + appt.estimatedTip, 0);
  const todayTotal = todayCommission + todayTips;

  const weekCommission = base.weekCommissionPriorDays + todayCommission;
  const weekTips = base.weekTipsPriorDays + todayTips;
  const weekTotal = weekCommission + weekTips;
  const completedWeekCount = base.completedPriorWeekCount + completedToday.length;

  const averageTicket =
    completedToday.length > 0
      ? Math.round(
          completedToday.reduce((sum, appt) => sum + appt.price, 0) / completedToday.length
        )
      : appointments.length > 0
        ? Math.round(
            appointments.reduce((sum, appt) => sum + appt.price, 0) / appointments.length
          )
        : 0;

  return {
    todayCommission,
    todayTips,
    todayTotal,
    weekCommission,
    weekTips,
    weekTotal,
    monthToDateTotal: base.monthToDateTotal + todayTotal,
    completedTodayCount: completedToday.length,
    completedWeekCount,
    averageTicket,
  };
}

export function validateTimeOffRequest(input: {
  day: EmployeeShiftDay | undefined;
  reason: string;
}): TimeOffValidationResult {
  if (!input.day) {
    return { valid: false, errorKey: 'dayRequired' };
  }
  if (input.day.status === 'off') {
    return { valid: false, errorKey: 'dayOffBlocked' };
  }
  if (input.reason.trim().length < 5) {
    return { valid: false, errorKey: 'reasonTooShort' };
  }
  return { valid: true, errorKey: null };
}

export function applyTimeOffRequest(
  schedule: EmployeeShiftDay[],
  requests: TimeOffRequestRecord[],
  input: {
    dayId: string;
    type: TimeOffType;
    reason: string;
  }
): {
  schedule: EmployeeShiftDay[];
  requests: TimeOffRequestRecord[];
  created: TimeOffRequestRecord | null;
} {
  const targetDay = schedule.find((d) => d.id === input.dayId);
  const check = validateTimeOffRequest({ day: targetDay, reason: input.reason });
  if (!check.valid || !targetDay) {
    return { schedule, requests, created: null };
  }

  const created: TimeOffRequestRecord = {
    id: `tor-${Date.now()}`,
    dayId: targetDay.id,
    dateKey: targetDay.dateKey,
    dayLabelEn: `${targetDay.dayEn} · ${targetDay.shortDateEn}`,
    dayLabelAr: `${targetDay.dayAr} · ${targetDay.shortDateAr}`,
    type: input.type,
    reason: input.reason.trim(),
    status: 'pending',
    submittedAtEn: 'Just now',
    submittedAtAr: 'الآن',
  };

  const nextSchedule = schedule.map((day) =>
    day.id === targetDay.id ? { ...day, status: 'time_off_requested' as const } : day
  );

  return {
    schedule: nextSchedule,
    requests: [created, ...requests],
    created,
  };
}

export function cancelTimeOffRequest(
  schedule: EmployeeShiftDay[],
  requests: TimeOffRequestRecord[],
  requestId: string
): {
  schedule: EmployeeShiftDay[];
  requests: TimeOffRequestRecord[];
} {
  const target = requests.find((r) => r.id === requestId);
  if (!target) {
    return { schedule, requests };
  }
  const nextRequests = requests.filter((r) => r.id !== requestId);
  const stillHasForDay = nextRequests.some((r) => r.dayId === target.dayId);
  const nextSchedule = stillHasForDay
    ? schedule
    : schedule.map((day) =>
        day.id === target.dayId && day.status === 'time_off_requested'
          ? { ...day, status: 'scheduled' as const }
          : day
      );

  return { schedule: nextSchedule, requests: nextRequests };
}

export function filterEmployeeClients(
  clients: EmployeeClientRecord[],
  query: string
): EmployeeClientRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return clients;
  return clients.filter((client) => {
    const haystack = [
      client.nameEn,
      client.nameAr,
      client.favoriteServiceEn,
      client.favoriteServiceAr,
      client.notesEn,
      client.notesAr,
      client.phone,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function updateEmployeeClientNote(
  clients: EmployeeClientRecord[],
  clientId: string,
  nextNote: string,
  lang: 'en' | 'ar'
): EmployeeClientRecord[] {
  const trimmed = nextNote.trim();
  if (!trimmed) return clients;
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    return lang === 'ar'
      ? { ...client, notesAr: trimmed }
      : { ...client, notesEn: trimmed };
  });
}
