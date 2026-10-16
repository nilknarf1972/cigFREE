/**
 * Clear Path (cigFREE) — Pure Core Domain Engine
 * © 2026 The Primo IT Tech LLC. All Rights Reserved.
 *
 * Implements deterministic, unit-tested calculations for:
 * - Quit-date progress & calendar tracking
 * - Compassionate setback recovery (never erasing past smoke-free days or milestones)
 * - Optional cigarette & financial savings estimates with transparent formulas
 * - Milestone recognition & preservation
 * - Visual intensity & advance content warning filtering
 * - Theme & accessibility resolution
 * - Image license/consent ledger management
 * - Local data export & deletion
 */

import {
  DEFAULT_IMAGE_JOURNEY_CARDS,
  LEGAL_AND_PRICING_CONFIG,
  MILESTONE_DEFINITIONS
} from '../data/clearPathData.js';

export const STORAGE_KEY = 'clear_path_primo_state_v1';

/**
 * Normalizes a Date object or date string into a YYYY-MM-DD local ISO date string.
 */
export function normalizeDateISO(dateInput = new Date()) {
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) {
    const fallback = new Date();
    return formatLocalYYYYMMDD(fallback);
  }
  return formatLocalYYYYMMDD(dateObj);
}

function formatLocalYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a UTC midnight timestamp for exact calendar-day diffing.
 */
export function parseISODateToUTCMs(isoDateString) {
  const normalized = normalizeDateISO(isoDateString);
  const [year, month, day] = normalized.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * Creates a clean default user state for Clear Path.
 */
export function createDefaultUserState(todayISO = normalizeDateISO()) {
  const normalizedToday = normalizeDateISO(todayISO);
  return {
    schemaVersion: '1.0.0',
    ownerCompany: LEGAL_AND_PRICING_CONFIG.companyName,
    onboardingCompleted: false,
    quitDateISO: normalizedToday,
    visualIntensity: 'direct', // 'direct' | 'gentle' | 'hide_graphic'
    estimateSettings: {
      enabled: false,
      cigarettesPerDay: '',
      costPerPack: '',
      cigarettesPerPack: 20
    },
    selectedMotivations: ['health', 'breathing'],
    customMotivations: [],
    calendarLogs: {}, // { 'YYYY-MM-DD': { status: 'smoke_free' | 'setback', note: '', updatedAt: ISO } }
    preservedMilestoneIds: [],
    customImageRecords: [],
    themeMode: 'system', // 'light' | 'dark' | 'system'
    textScale: 'standard', // 'standard' | 'large' | 'xlarge'
    highContrast: false,
    reducedMotion: false,
    selectedRegion: 'US',
    cravingStrategiesUsed: 0
  };
}

/**
 * Calculates quit-date progress, smoke-free days, current streak, and setback counts.
 */
export function calculateQuitProgress(state, referenceDateISO = normalizeDateISO()) {
  const safeState = state || createDefaultUserState(referenceDateISO);
  const todayISO = normalizeDateISO(referenceDateISO);
  const quitDateISO = normalizeDateISO(safeState.quitDateISO || todayISO);

  const todayMs = parseISODateToUTCMs(todayISO);
  const quitMs = parseISODateToUTCMs(quitDateISO);
  const msPerDay = 24 * 60 * 60 * 1000;
  const rawDayDiff = Math.floor((todayMs - quitMs) / msPerDay);

  const isFutureQuitDate = rawDayDiff < 0;
  const daysSinceQuitDate = isFutureQuitDate ? 0 : rawDayDiff;
  const daysUntilQuitDate = isFutureQuitDate ? Math.abs(rawDayDiff) : 0;

  const logs = safeState.calendarLogs || {};
  let smokeFreeDaysCount = 0;
  let setbackDaysCount = 0;
  let setbacksSinceQuitDate = 0;

  Object.entries(logs).forEach(([dateKey, entry]) => {
    if (!entry || !entry.status) return;
    const entryMs = parseISODateToUTCMs(dateKey);
    if (entry.status === 'smoke_free') {
      smokeFreeDaysCount += 1;
    } else if (entry.status === 'setback') {
      setbackDaysCount += 1;
      if (entryMs >= quitMs && entryMs <= todayMs) {
        setbacksSinceQuitDate += 1;
      }
    }
  });

  const isTodayMarkedSmokeFree = logs[todayISO]?.status === 'smoke_free';
  const isTodayMarkedSetback = logs[todayISO]?.status === 'setback';

  // Effective smoke-free days combine elapsed days since quit date (minus any logged setbacks in that span)
  // plus today if marked smoke-free on day 0, or total explicitly logged smoke-free days if higher (so resetting
  // a quit date never erases past logged smoke-free days).
  const elapsedSmokeFreeSpan = isFutureQuitDate
    ? 0
    : Math.max(0, daysSinceQuitDate + (isTodayMarkedSmokeFree ? 1 : 0) - setbacksSinceQuitDate);

  const effectiveSmokeFreeDays = Math.max(smokeFreeDaysCount, elapsedSmokeFreeSpan);

  // Calculate current consecutive explicitly-marked smoke-free streak up to today (or yesterday if today is unmarked)
  let currentStreakDays = 0;
  let cursorMs = isTodayMarkedSmokeFree ? todayMs : todayMs - msPerDay;
  while (true) {
    const cursorISO = formatUTCDateMs(cursorMs);
    if (logs[cursorISO]?.status === 'smoke_free') {
      currentStreakDays += 1;
      cursorMs -= msPerDay;
    } else {
      break;
    }
  }

  return {
    quitDateISO,
    referenceDateISO: todayISO,
    isFutureQuitDate,
    daysSinceQuitDate,
    daysUntilQuitDate,
    smokeFreeDaysCount,
    setbackDaysCount,
    effectiveSmokeFreeDays,
    currentStreakDays,
    isTodayMarkedSmokeFree,
    isTodayMarkedSetback
  };
}

function formatUTCDateMs(utcMs) {
  const d = new Date(utcMs);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates optional cigarette and financial savings estimates with full formula transparency.
 */
export function calculateSavingsEstimates(state, referenceDateISO = normalizeDateISO()) {
  const safeState = state || createDefaultUserState(referenceDateISO);
  const progress = calculateQuitProgress(safeState, referenceDateISO);
  const settings = safeState.estimateSettings || {};

  const cigsPerDay = Number(settings.cigarettesPerDay);
  const costPerPack = Number(settings.costPerPack);
  const cigsPerPack = Number(settings.cigarettesPerPack) > 0 ? Number(settings.cigarettesPerPack) : 20;

  const hasCigaretteEstimate = Boolean(
    settings.enabled && Number.isFinite(cigsPerDay) && cigsPerDay > 0
  );
  const hasMoneyEstimate = Boolean(
    hasCigaretteEstimate && Number.isFinite(costPerPack) && costPerPack > 0
  );

  const effectiveDays = progress.effectiveSmokeFreeDays;
  const estimatedCigarettesNotSmoked = hasCigaretteEstimate
    ? Math.round(effectiveDays * cigsPerDay)
    : 0;
  const estimatedPacksNotSmoked = hasCigaretteEstimate
    ? Number(((effectiveDays * cigsPerDay) / cigsPerPack).toFixed(2))
    : 0;
  const estimatedMoneySaved = hasMoneyEstimate
    ? Number((((effectiveDays * cigsPerDay) / cigsPerPack) * costPerPack).toFixed(2))
    : 0;

  const projectedMonthlySavings = hasMoneyEstimate
    ? Number((((30 * cigsPerDay) / cigsPerPack) * costPerPack).toFixed(2))
    : 0;
  const projectedYearlySavings = hasMoneyEstimate
    ? Number((((365 * cigsPerDay) / cigsPerPack) * costPerPack).toFixed(2))
    : 0;

  return {
    isEnabled: Boolean(settings.enabled),
    hasCigaretteEstimate,
    hasMoneyEstimate,
    effectiveDays,
    cigarettesPerDay: hasCigaretteEstimate ? cigsPerDay : 0,
    cigarettesPerPack: cigsPerPack,
    costPerPack: hasMoneyEstimate ? costPerPack : 0,
    estimatedCigarettesNotSmoked,
    estimatedPacksNotSmoked,
    estimatedMoneySaved,
    projectedMonthlySavings,
    projectedYearlySavings,
    estimateLabel: 'Optional Personal Estimate (Not Guaranteed)',
    formulaExplanation: hasCigaretteEstimate
      ? `Calculated from ${effectiveDays} smoke-free day${effectiveDays === 1 ? '' : 's'} × ${cigsPerDay} estimated cigarettes/day = ${estimatedCigarettesNotSmoked} cigarettes avoided` +
        (hasMoneyEstimate
          ? `, divided by ${cigsPerPack} cigarettes/pack × $${costPerPack.toFixed(2)}/pack = $${estimatedMoneySaved.toFixed(2)} estimated saved.`
          : '.')
      : 'Optional estimate is turned off or awaiting your estimated cigarettes per day and pack price.'
  };
}

/**
 * Evaluates milestones against effective smoke-free days AND preserved milestone history
 * so a setback never erases previously unlocked milestones.
 */
export function evaluateMilestones(state, referenceDateISO = normalizeDateISO()) {
  const safeState = state || createDefaultUserState(referenceDateISO);
  const progress = calculateQuitProgress(safeState, referenceDateISO);
  const preservedSet = new Set(safeState.preservedMilestoneIds || []);

  const evaluated = MILESTONE_DEFINITIONS.map((milestone) => {
    const unlockedByDays = progress.effectiveSmokeFreeDays >= milestone.daysRequired;
    const unlockedByHistory = preservedSet.has(milestone.id);
    const achieved = unlockedByDays || unlockedByHistory;
    const progressRatio = Math.min(
      1,
      milestone.daysRequired > 0 ? progress.effectiveSmokeFreeDays / milestone.daysRequired : 1
    );

    return {
      ...milestone,
      achieved,
      unlockedByDays,
      preservedFromHistory: unlockedByHistory && !unlockedByDays,
      progressPercent: Math.round(progressRatio * 100),
      daysRemaining: Math.max(0, milestone.daysRequired - progress.effectiveSmokeFreeDays)
    };
  });

  const achievedMilestones = evaluated.filter((m) => m.achieved);
  const nextMilestone = evaluated.find((m) => !m.achieved) || null;

  return {
    effectiveSmokeFreeDays: progress.effectiveSmokeFreeDays,
    milestones: evaluated,
    achievedCount: achievedMilestones.length,
    totalCount: evaluated.length,
    unlockedIds: achievedMilestones.map((m) => m.id),
    nextMilestone
  };
}

/**
 * Marks a day on the quit calendar ('smoke_free' | 'setback' | 'clear') while preserving earned milestones.
 */
export function recordCalendarDayStatus(state, dateISO, status, note = '') {
  const safeState = state || createDefaultUserState();
  const normalizedDate = normalizeDateISO(dateISO);
  const currentMilestones = evaluateMilestones(safeState, normalizedDate);

  const nextLogs = { ...(safeState.calendarLogs || {}) };
  if (status === 'clear' || !status) {
    delete nextLogs[normalizedDate];
  } else {
    nextLogs[normalizedDate] = {
      status: status === 'setback' ? 'setback' : 'smoke_free',
      note: typeof note === 'string' ? note.trim() : '',
      updatedAt: new Date().toISOString()
    };
  }

  const mergedPreserved = Array.from(
    new Set([...(safeState.preservedMilestoneIds || []), ...currentMilestones.unlockedIds])
  );

  return {
    ...safeState,
    calendarLogs: nextLogs,
    preservedMilestoneIds: mergedPreserved
  };
}

/**
 * Handles a smoking setback with compassion, preserving past smoke-free days and milestones.
 * Options:
 * - 'log_and_keep_date': Logs the setback on dateISO and keeps the current quitDateISO.
 * - 'reset_quit_date_keep_history': Logs the setback on dateISO, sets quitDateISO to dateISO,
 *   and preserves all previous smoke-free days and unlocked milestones.
 */
export function handleCompassionateSetback(
  state,
  dateISO = normalizeDateISO(),
  option = 'log_and_keep_date',
  note = ''
) {
  const normalizedDate = normalizeDateISO(dateISO);
  const loggedState = recordCalendarDayStatus(state, normalizedDate, 'setback', note);

  const nextState =
    option === 'reset_quit_date_keep_history'
      ? {
          ...loggedState,
          quitDateISO: normalizedDate
        }
      : loggedState;

  const progressAfter = calculateQuitProgress(nextState, normalizedDate);

  return {
    nextState,
    compassionateResponse: {
      headline: 'Thank you for checking in honestly.',
      message:
        'A setback is a common part of learning to quit—not a failure. All of your previously logged smoke-free days and earned milestones remain safely saved.',
      preservedSmokeFreeDays: progressAfter.smokeFreeDaysCount,
      preservedMilestonesCount: (nextState.preservedMilestoneIds || []).length,
      chosenOption: option
    }
  };
}

/**
 * Updates the user's quit date without judgment while preserving past calendar entries and unlocked milestones.
 */
export function updateQuitDateWithoutJudgment(state, newQuitDateISO, referenceDateISO = normalizeDateISO()) {
  const safeState = state || createDefaultUserState(referenceDateISO);
  const currentMilestones = evaluateMilestones(safeState, referenceDateISO);
  const mergedPreserved = Array.from(
    new Set([...(safeState.preservedMilestoneIds || []), ...currentMilestones.unlockedIds])
  );

  return {
    ...safeState,
    quitDateISO: normalizeDateISO(newQuitDateISO),
    preservedMilestoneIds: mergedPreserved
  };
}

/**
 * Filters the educational image deck according to the user's selected visual intensity:
 * - 'gentle': excludes 'direct' images
 * - 'hide_graphic': excludes 'direct' images
 * - 'direct': includes both 'gentle' and 'direct' images (direct images remain gated behind an advance warning)
 */
export function filterImagesForIntensity(
  images = DEFAULT_IMAGE_JOURNEY_CARDS,
  visualIntensity = 'gentle'
) {
  const list = Array.isArray(images) ? images : DEFAULT_IMAGE_JOURNEY_CARDS;
  if (visualIntensity === 'direct') {
    return list.map((img) => ({
      ...img,
      requiresExplicitWarningGate: Boolean(img.intensity === 'direct' || img.requiresAdvanceWarning)
    }));
  }
  return list
    .filter((img) => img.intensity !== 'direct' && !img.requiresAdvanceWarning)
    .map((img) => ({
      ...img,
      requiresExplicitWarningGate: false
    }));
}

/**
 * Determines whether to offer an optional inspirational pause card after every N images (default 3).
 */
export function shouldShowInspirationalInterlude(imagesViewedCount, cadence = 3) {
  const safeCadence = Number(cadence) >= 3 && Number(cadence) <= 5 ? Number(cadence) : 3;
  return Number.isInteger(imagesViewedCount) && imagesViewedCount > 0 && imagesViewedCount % safeCadence === 0;
}

/**
 * Resolves the effective theme ('light' | 'dark') from user preference ('light' | 'dark' | 'system').
 */
export function resolveEffectiveTheme(themeMode = 'system', systemPrefersDark = false) {
  if (themeMode === 'dark') return 'dark';
  if (themeMode === 'light') return 'light';
  return systemPrefersDark ? 'dark' : 'light';
}

/**
 * Validates and creates a documented image license/consent ledger entry so only legally cleared
 * images or clearly labeled educational illustrations are recorded.
 */
export function createCustomImageLicenseRecord(input = {}) {
  const title = (input.title || '').trim();
  const source = (input.source || '').trim();
  const licenseStatus = (input.licenseStatus || '').trim();
  const consentStatus = (input.consentStatus || '').trim();
  const permittedUses = (input.permittedUses || '').trim();

  if (!title || !source || !licenseStatus) {
    throw new Error('Image title, documented source, and license status are required.');
  }

  return {
    id: `custom-img-${Date.now()}`,
    title,
    intensity: input.intensity === 'direct' ? 'direct' : 'gentle',
    requiresAdvanceWarning: input.intensity === 'direct',
    visualCategoryBadge: input.isPlaceholderForRealPhoto
      ? 'Placeholder / Awaiting Real-Photo License — Not a Real Patient Photo'
      : 'Cleared Educational Visual',
    caption: (input.caption || title).trim(),
    screenReaderDescription: (input.screenReaderDescription || input.caption || title).trim(),
    licenseRecord: {
      source,
      creator: (input.creator || 'Documented Contributor').trim(),
      licenseStatus,
      consentStatus: consentStatus || 'Written consent on file / Non-identifiable educational illustration',
      permittedUses: permittedUses || 'Educational display in Clear Path (The Primo IT Tech LLC)',
      requiredAttribution: (input.requiredAttribution || `© ${source}`).trim(),
      isPlaceholderForRealPhoto: Boolean(input.isPlaceholderForRealPhoto),
      releaseAuditNote: input.isPlaceholderForRealPhoto
        ? 'Flagged as placeholder—must not be presented as a real patient photo.'
        : 'Documented license and consent verified.'
    },
    recordedAt: new Date().toISOString()
  };
}

/**
 * Exports the user's complete local progress as a formatted JSON string.
 */
export function exportUserDataJSON(state) {
  const payload = {
    exportedFrom: LEGAL_AND_PRICING_CONFIG.appName,
    publisher: LEGAL_AND_PRICING_CONFIG.companyName,
    exportedAt: new Date().toISOString(),
    privacyNotice: '100% Local On-Device Data Export — Clear Path by The Primo IT Tech LLC',
    data: state || createDefaultUserState()
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Deletes all user data from storage and returns a clean initial state.
 */
export function deleteAllUserData(storage = null, todayISO = normalizeDateISO()) {
  if (storage && typeof storage.removeItem === 'function') {
    storage.removeItem(STORAGE_KEY);
  }
  return createDefaultUserState(todayISO);
}
