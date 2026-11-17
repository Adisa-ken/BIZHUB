import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countUnreadAlerts,
  createAccountSession,
  createEmailSession,
  createGuestSession,
  getDirectionForLang,
  markAlertRead,
  markAllAlertsRead,
  parseInitialAutostart,
  resolveNextLang,
  resolveNextTheme,
  switchSessionRole,
  validateEmail,
  validateSignUpForm,
} from './appLogic';
import { INITIAL_ALERTS } from '../i18n/translations';
import { PROFILE_ROLE_IDS } from '../theme/tokens';

test('validateEmail rejects empty and malformed inputs, accepts valid addresses', () => {
  assert.deepEqual(validateEmail('   '), {
    valid: false,
    normalized: '',
    errorKey: 'required',
  });
  assert.deepEqual(validateEmail('not-an-email'), {
    valid: false,
    normalized: 'not-an-email',
    errorKey: 'invalid',
  });
  assert.deepEqual(validateEmail('user@domain'), {
    valid: false,
    normalized: 'user@domain',
    errorKey: 'invalid',
  });
  assert.deepEqual(validateEmail('  sara@bizhub.demo  '), {
    valid: true,
    normalized: 'sara@bizhub.demo',
    errorKey: null,
  });
});

test('validateSignUpForm validates all 5 sign-up fields cleanly', () => {
  const emptyCheck = validateSignUpForm({
    firstName: ' ',
    lastName: '',
    phone: '123',
    email: 'bad',
    password: '123',
  });
  assert.equal(emptyCheck.valid, false);
  assert.equal(emptyCheck.errors.firstName, 'firstNameRequired');
  assert.equal(emptyCheck.errors.lastName, 'lastNameRequired');
  assert.equal(emptyCheck.errors.phone, 'phoneInvalid');
  assert.equal(emptyCheck.errors.email, 'emailInvalid');
  assert.equal(emptyCheck.errors.password, 'passwordTooShort');

  const validCheck = validateSignUpForm({
    firstName: ' Sara ',
    lastName: ' Hassan ',
    phone: '+1 555 234 5678',
    email: ' sara@bizhub.demo ',
    password: 'secret123',
  });
  assert.equal(validCheck.valid, true);
  assert.deepEqual(validCheck.errors, {});
  assert.equal(validCheck.normalized.firstName, 'Sara');
  assert.equal(validCheck.normalized.email, 'sara@bizhub.demo');
});

test('getDirectionForLang and toggle resolvers return expected values', () => {
  assert.equal(getDirectionForLang('en'), 'ltr');
  assert.equal(getDirectionForLang('ar'), 'rtl');
  assert.equal(resolveNextTheme('dark'), 'light');
  assert.equal(resolveNextTheme('light'), 'dark');
  assert.equal(resolveNextLang('en'), 'ar');
  assert.equal(resolveNextLang('ar'), 'en');
});

test('session factories and role switcher support all 4 profile types', () => {
  assert.deepEqual(PROFILE_ROLE_IDS, [
    'client',
    'employee',
    'business_owner',
    'creator_marketer',
  ]);

  assert.deepEqual(createGuestSession(), {
    mode: 'guest',
    email: null,
    activeRole: 'client',
  });

  assert.deepEqual(createEmailSession('  alex@local.co ', 'employee'), {
    mode: 'email',
    email: 'alex@local.co',
    activeRole: 'employee',
  });

  const account = createAccountSession(
    {
      firstName: 'Sara',
      lastName: 'Hassan',
      phone: '+15552345678',
      email: 'sara@bizhub.demo',
    },
    'business_owner'
  );
  assert.equal(account.mode, 'account');
  assert.equal(account.activeRole, 'business_owner');

  const switched = switchSessionRole(account, 'creator_marketer');
  assert.equal(switched.activeRole, 'creator_marketer');
  assert.equal(switched.firstName, 'Sara');
  assert.equal(switched.email, 'sara@bizhub.demo');
});

test('alert helpers count unread and mark individual or all alerts read', () => {
  assert.equal(countUnreadAlerts(INITIAL_ALERTS), 2);
  const afterOne = markAlertRead(INITIAL_ALERTS, 'alert-1');
  assert.equal(countUnreadAlerts(afterOne), 1);
  assert.equal(afterOne[0].read, true);
  const afterAll = markAllAlertsRead(INITIAL_ALERTS);
  assert.equal(countUnreadAlerts(afterAll), 0);
});

test('parseInitialAutostart detects ?autostart=1', () => {
  assert.equal(parseInitialAutostart('?autostart=1'), true);
  assert.equal(parseInitialAutostart('?autostart=0'), false);
  assert.equal(parseInitialAutostart(''), false);
});
