import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  STORAGE_KEY,
  calculateQuitProgress,
  calculateSavingsEstimates,
  createCustomImageLicenseRecord,
  createDefaultUserState,
  deleteAllUserData,
  evaluateMilestones,
  exportUserDataJSON,
  filterImagesForIntensity,
  handleCompassionateSetback,
  recordCalendarDayStatus,
  resolveEffectiveTheme,
  shouldShowInspirationalInterlude,
  updateQuitDateWithoutJudgment
} from '../src/engine/clearPathEngine.js';
import {
  DEFAULT_IMAGE_JOURNEY_CARDS,
  LEGAL_AND_PRICING_CONFIG
} from '../src/data/clearPathData.js';

test('1. Quit-date calculations track elapsed days, smoke-free logs, future dates, and preserve history on setback', () => {
  const baseState = createDefaultUserState('2026-10-01');
  const progressAfter10Days = calculateQuitProgress(baseState, '2026-10-11');

  assert.equal(progressAfter10Days.daysSinceQuitDate, 10);
  assert.equal(progressAfter10Days.isFutureQuitDate, false);
  assert.equal(progressAfter10Days.effectiveSmokeFreeDays, 10);

  let withLogs = recordCalendarDayStatus(baseState, '2026-10-10', 'smoke_free', 'Felt strong');
  withLogs = recordCalendarDayStatus(withLogs, '2026-10-11', 'smoke_free', 'Great walk');
  const progressLogged = calculateQuitProgress(withLogs, '2026-10-11');
  assert.equal(progressLogged.smokeFreeDaysCount, 2);
  assert.equal(progressLogged.currentStreakDays, 2);
  assert.equal(progressLogged.isTodayMarkedSmokeFree, true);

  const futureState = updateQuitDateWithoutJudgment(baseState, '2026-10-20', '2026-10-16');
  const futureProgress = calculateQuitProgress(futureState, '2026-10-16');
  assert.equal(futureProgress.isFutureQuitDate, true);
  assert.equal(futureProgress.daysUntilQuitDate, 4);
  assert.equal(futureProgress.daysSinceQuitDate, 0);
});

test('2. Milestone recognition unlocks 1d, 3d, 7d, 30d milestones and preserves them across setbacks or quit-date resets', () => {
  const state = createDefaultUserState('2026-09-01');
  const reportAt32Days = evaluateMilestones(state, '2026-10-03');

  assert.equal(reportAt32Days.effectiveSmokeFreeDays, 32);
  assert.ok(reportAt32Days.unlockedIds.includes('milestone-1d'));
  assert.ok(reportAt32Days.unlockedIds.includes('milestone-3d'));
  assert.ok(reportAt32Days.unlockedIds.includes('milestone-7d'));
  assert.ok(reportAt32Days.unlockedIds.includes('milestone-14d'));
  assert.ok(reportAt32Days.unlockedIds.includes('milestone-30d'));
  assert.equal(reportAt32Days.nextMilestone.id, 'milestone-90d');

  const { nextState, compassionateResponse } = handleCompassionateSetback(
    state,
    '2026-10-03',
    'reset_quit_date_keep_history',
    'Stressful afternoon'
  );
  assert.equal(nextState.quitDateISO, '2026-10-03');
  assert.ok(compassionateResponse.preservedMilestonesCount >= 5);

  const reportAfterReset = evaluateMilestones(nextState, '2026-10-03');
  assert.ok(
    reportAfterReset.unlockedIds.includes('milestone-30d'),
    'Previously earned 30-day milestone must never be erased after a setback'
  );
});

test('3. Optional savings estimates accurately compute cigarettes avoided and money saved with formula explanation', () => {
  const defaultState = createDefaultUserState('2026-10-01');
  const disabledEst = calculateSavingsEstimates(defaultState, '2026-10-11');
  assert.equal(disabledEst.isEnabled, false);
  assert.equal(disabledEst.estimatedCigarettesNotSmoked, 0);
  assert.equal(disabledEst.estimatedMoneySaved, 0);

  const enabledState = {
    ...defaultState,
    estimateSettings: {
      enabled: true,
      cigarettesPerDay: '15',
      costPerPack: '10.00',
      cigarettesPerPack: 20
    }
  };

  const activeEst = calculateSavingsEstimates(enabledState, '2026-10-11');
  assert.equal(activeEst.isEnabled, true);
  assert.equal(activeEst.hasCigaretteEstimate, true);
  assert.equal(activeEst.hasMoneyEstimate, true);
  assert.equal(activeEst.effectiveDays, 10);
  assert.equal(activeEst.estimatedCigarettesNotSmoked, 150);
  assert.equal(activeEst.estimatedPacksNotSmoked, 7.5);
  assert.equal(activeEst.estimatedMoneySaved, 75.0);
  assert.match(activeEst.formulaExplanation, /150 cigarettes avoided/);
  assert.match(activeEst.formulaExplanation, /\$75\.00 estimated saved/);
});

test('4. Theme switching, visual intensity filtering & real pathology image files on disk', () => {
  assert.equal(resolveEffectiveTheme('light', true), 'light');
  assert.equal(resolveEffectiveTheme('dark', false), 'dark');
  assert.equal(resolveEffectiveTheme('system', true), 'dark');
  assert.equal(resolveEffectiveTheme('system', false), 'light');

  const gentleDeck = filterImagesForIntensity(DEFAULT_IMAGE_JOURNEY_CARDS, 'gentle');
  const hiddenDeck = filterImagesForIntensity(DEFAULT_IMAGE_JOURNEY_CARDS, 'hide_graphic');
  const directDeck = filterImagesForIntensity(DEFAULT_IMAGE_JOURNEY_CARDS, 'direct');

  assert.ok(gentleDeck.every((img) => img.intensity !== 'direct'));
  assert.ok(hiddenDeck.every((img) => img.intensity !== 'direct'));

  const realPhotoCards = directDeck.filter((img) => Boolean(img.photoUrl));
  assert.equal(realPhotoCards.length, 8, 'Should include 8 real-life medical pathology photo cards');

  for (const card of realPhotoCards) {
    assert.ok(card.requiresExplicitWarningGate, `${card.id} must require advance warning gate`);
    assert.ok(card.licenseRecord?.source, `${card.id} must have documented source`);
    assert.ok(card.licenseRecord?.licenseStatus, `${card.id} must have documented license status`);
    const diskPath = path.join('C:\\projects\\cigFREE\\public', card.photoUrl.replace(/\//g, path.sep));
    assert.ok(fs.existsSync(diskPath), `Pathology photo file must exist on disk: ${diskPath}`);
  }

  assert.equal(shouldShowInspirationalInterlude(1, 3), false);
  assert.equal(shouldShowInspirationalInterlude(2, 3), false);
  assert.equal(shouldShowInspirationalInterlude(3, 3), true);
  assert.equal(shouldShowInspirationalInterlude(6, 3), true);
});

test('5. Data export, data deletion, image license ledger, and The Primo IT Tech LLC $0.99 pricing compliance', () => {
  const mockStorage = {
    store: { [STORAGE_KEY]: '{"quitDateISO":"2026-01-01"}' },
    removeItem(key) {
      delete this.store[key];
    }
  };

  let populated = createDefaultUserState('2026-10-01');
  populated = recordCalendarDayStatus(populated, '2026-10-01', 'smoke_free', 'Day 1');

  const exported = exportUserDataJSON(populated);
  const parsedExport = JSON.parse(exported);
  assert.equal(parsedExport.publisher, 'The Primo IT Tech LLC');
  assert.equal(parsedExport.data.calendarLogs['2026-10-01'].status, 'smoke_free');

  const wipedState = deleteAllUserData(mockStorage, '2026-10-16');
  assert.equal(mockStorage.store[STORAGE_KEY], undefined);
  assert.deepEqual(wipedState.calendarLogs, {});
  assert.equal(wipedState.onboardingCompleted, false);

  const customAsset = createCustomImageLicenseRecord({
    title: 'Cleared Healthy Bronchi Diagram',
    source: 'The Primo IT Tech LLC Vector Studio',
    licenseStatus: 'Documented Commercial License #2026-101'
  });
  assert.equal(customAsset.licenseRecord.source, 'The Primo IT Tech LLC Vector Studio');

  assert.equal(LEGAL_AND_PRICING_CONFIG.companyName, 'The Primo IT Tech LLC');
  assert.equal(LEGAL_AND_PRICING_CONFIG.primaryBrandMark, 'CigFree™');
  assert.equal(LEGAL_AND_PRICING_CONFIG.pricing.priceUSD, 0.99);
  assert.equal(LEGAL_AND_PRICING_CONFIG.pricing.hasSubscriptions, false);
  assert.equal(LEGAL_AND_PRICING_CONFIG.pricing.hasInAppPurchases, false);
  assert.equal(LEGAL_AND_PRICING_CONFIG.pricing.requiresUserAccount, false);
  assert.match(
    LEGAL_AND_PRICING_CONFIG.pricing.feeAndTaxDisclaimer,
    /does not promise or represent any specific net amount after app-store fees or taxes/
  );
});
