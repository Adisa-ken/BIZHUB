import assert from 'node:assert/strict';
import test from 'node:test';
import { FAKE_GOOGLE_LISTINGS } from '../data/exploreAndClaim';
import {
  addPlaceholderClaimPhoto,
  createDraftFromGoogleListing,
  createManualClaimDraft,
  filterGoogleListings,
  finalizeClaimedBusiness,
  removeClaimPhoto,
  validateClaimDraft,
} from './ownerClaimLogic';

test('filterGoogleListings returns 3 fake listings by default and matches queries', () => {
  const initial = filterGoogleListings(FAKE_GOOGLE_LISTINGS, '');
  assert.equal(initial.length, 3);

  const filtered = filterGoogleListings(FAKE_GOOGLE_LISTINGS, 'crescent');
  assert.equal(filtered[0].id, 'gp-1');
});

test('createDraftFromGoogleListing and manual draft validate and finalize cleanly', () => {
  const googleDraft = createDraftFromGoogleListing(FAKE_GOOGLE_LISTINGS[0], 'en');
  assert.equal(googleDraft.source, 'google');
  assert.equal(googleDraft.rating, 4.9);
  assert.equal(googleDraft.photos.length, 3);
  assert.equal(validateClaimDraft(googleDraft).valid, true);

  const manualDraft = createManualClaimDraft();
  assert.equal(manualDraft.source, 'manual');
  assert.equal(manualDraft.rating, null);
  assert.equal(validateClaimDraft(manualDraft).valid, false);

  const updatedPhotos = addPlaceholderClaimPhoto(manualDraft.photos);
  assert.equal(updatedPhotos.length, 3);
  const trimmedPhotos = removeClaimPhoto(updatedPhotos, updatedPhotos[0].id);
  assert.equal(trimmedPhotos.length, 2);

  const finalized = finalizeClaimedBusiness(
    { ...manualDraft, name: 'Studio Nova', address: '88 Oak St' },
    'tailor'
  );
  assert.equal(finalized.name, 'Studio Nova');
  assert.equal(finalized.industryTemplate, 'tailor');
});
