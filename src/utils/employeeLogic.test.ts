import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPLOYEE_INDUSTRY_DATA } from '../data/employee';
import {
  applyTimeOffRequest,
  calculateEmployeeEarnings,
  cancelTimeOffRequest,
  completeEmployeeAppointment,
  filterEmployeeClients,
  sortAppointmentsByTime,
  startEmployeeAppointment,
  updateEmployeeClientNote,
  validateTimeOffRequest,
} from './employeeLogic';

test('employee datasets exist for Barber, Trainer, and Tailor with ordered appointments', () => {
  const industries = ['barber', 'trainer', 'tailor'] as const;
  for (const industry of industries) {
    const dataset = EMPLOYEE_INDUSTRY_DATA[industry];
    assert.ok(dataset.appointments.length >= 4);
    assert.equal(dataset.weeklySchedule.length, 7);
    assert.ok(dataset.clients.length >= 4);

    const sorted = sortAppointmentsByTime(dataset.appointments);
    for (let i = 1; i < sorted.length; i += 1) {
      assert.ok(sorted[i - 1].time24 <= sorted[i].time24);
    }
  }
});

test('start and complete appointment transitions update status and personal earnings', () => {
  const base = EMPLOYEE_INDUSTRY_DATA.barber;
  const beforeSummary = calculateEmployeeEarnings(base.earningsBase, base.appointments);

  const scheduled = base.appointments.find((a) => a.status === 'scheduled');
  assert.ok(scheduled);

  const started = startEmployeeAppointment(base.appointments, scheduled.id);
  assert.equal(
    started.find((a) => a.id === scheduled.id)?.status,
    'in_progress'
  );

  const completed = completeEmployeeAppointment(started, scheduled.id, '11:55');
  assert.equal(
    completed.find((a) => a.id === scheduled.id)?.status,
    'completed'
  );

  const afterSummary = calculateEmployeeEarnings(base.earningsBase, completed);
  assert.equal(afterSummary.completedTodayCount, beforeSummary.completedTodayCount + 1);
  assert.ok(afterSummary.todayTotal > beforeSummary.todayTotal);
  assert.ok(afterSummary.weekTotal > beforeSummary.weekTotal);
  assert.ok(afterSummary.monthToDateTotal > beforeSummary.monthToDateTotal);
});

test('time-off validation blocks off days and short reasons, and submit/cancel syncs schedule', () => {
  const schedule = EMPLOYEE_INDUSTRY_DATA.trainer.weeklySchedule;
  const offDay = schedule.find((d) => d.status === 'off');
  const workDay = schedule.find((d) => d.status === 'scheduled');
  assert.ok(offDay && workDay);

  assert.equal(
    validateTimeOffRequest({ day: offDay, reason: 'Family event' }).errorKey,
    'dayOffBlocked'
  );
  assert.equal(
    validateTimeOffRequest({ day: workDay, reason: 'no' }).errorKey,
    'reasonTooShort'
  );

  const submitted = applyTimeOffRequest(schedule, [], {
    dayId: workDay.id,
    type: 'full_day',
    reason: 'Dentist appointment in the morning',
  });
  assert.ok(submitted.created);
  assert.equal(submitted.requests.length, 1);
  assert.equal(
    submitted.schedule.find((d) => d.id === workDay.id)?.status,
    'time_off_requested'
  );

  const cancelled = cancelTimeOffRequest(
    submitted.schedule,
    submitted.requests,
    submitted.created.id
  );
  assert.equal(cancelled.requests.length, 0);
  assert.equal(
    cancelled.schedule.find((d) => d.id === workDay.id)?.status,
    'scheduled'
  );
});

test('client filtering and note updates work across notes and client names', () => {
  const clients = EMPLOYEE_INDUSTRY_DATA.tailor.clients;
  const filtered = filterEmployeeClients(clients, 'Neapolitan');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].nameEn, 'Rami Al-Zahrani');

  const updated = updateEmployeeClientNote(
    clients,
    filtered[0].id,
    'Updated sleeve measurement: 63.5 cm, prefers horn buttons.',
    'en'
  );
  assert.match(
    updated.find((c) => c.id === filtered[0].id)?.notesEn ?? '',
    /horn buttons/
  );
});
