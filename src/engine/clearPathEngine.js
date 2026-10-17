/**
 * CigFree™ (Working Title: Clear Path) — Pure Core Domain Engine
 * © 2026 The Primo IT Tech LLC. All Rights Reserved.
 *
 * Implements deterministic, unit-tested calculations for:
 * - Quit-date progress & calendar tracking
 * - Compassionate setback recovery (never erasing past smoke-free days or milestones)
 * - Optional cigarette & financial savings estimates with transparent formulas
 * - Milestone recognition & preservation
 * - Signature Feature: Photo Mode repeatable sequence state machine
 * - Personalized Reminders with discreet-by-default lock-screen protection
 * - Theme & accessibility resolution
 * - Image license/consent ledger management
 * - Local data export & deletion
 */

import {
  BENEFIT_CARDS,
  DEFAULT_IMAGE_JOURNEY_CARDS,
  LEGAL_AND_PRICING_CONFIG,
  MILESTONE_DEFINITIONS,
  MOTIVATION_REASONS,
  PHOTO_MODE_CALMING_STEPS
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
 * Normalizes intensity values so 'no_graphic' and 'hide_graphic' are treated equivalently.
 */
export function normalizeVisualIntensity(intensity = 'direct') {
  if (intensity === 'no_graphic' || intensity === 'hide_graphic') {
    return 'no_graphic';
  }
  if (intensity === 'gentle') {
    return 'gentle';
  }
  return 'direct';
}

/**
 * Creates a clean default user state for Clear Path / CigFree.
 */
export function createDefaultUserState(todayISO = normalizeDateISO()) {
  const normalizedToday = normalizeDateISO(todayISO);
  return {
    schemaVersion: '1.2.0',
    ownerCompany: LEGAL_AND_PRICING_CONFIG.companyName,
    onboardingCompleted: false,
    quitDateISO: normalizedToday,
    visualIntensity: 'direct', // 'direct' | 'gentle' | 'no_graphic'
    estimateSettings: {
      enabled: false,
      cigarettesPerDay: '',
      costPerPack: '',
      cigarettesPerPack: 20
    },
    photoModeConfig: {
      roundLength: 3, // 3 or 5 difficult images per round
      warningAcknowledgedForIntensity: null, // null until first session warning is accepted; resets when intensity changes
      completedRoundsCount: 0
    },
    reminderSettings: {
      enabled: false,
      paused: false,
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timesOfDay: ['09:00'],
      frequency: 'daily', // 'daily' | 'twice_daily' | 'selected_days'
      includeQuitProgress: true,
      enableImageInNotification: false,
      lockScreenImageConfirmed: false
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

  const elapsedSmokeFreeSpan = isFutureQuitDate
    ? 0
    : Math.max(0, daysSinceQuitDate + (isTodayMarkedSmokeFree ? 1 : 0) - setbacksSinceQuitDate);

  const effectiveSmokeFreeDays = Math.max(smokeFreeDaysCount, elapsedSmokeFreeSpan);

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
 * - 'no_graphic' / 'hide_graphic': excludes 'direct' images
 * - 'direct': includes both 'gentle' and 'direct' images (direct images remain gated behind an advance warning)
 */
export function filterImagesForIntensity(
  images = DEFAULT_IMAGE_JOURNEY_CARDS,
  visualIntensity = 'gentle'
) {
  const list = Array.isArray(images) ? images : DEFAULT_IMAGE_JOURNEY_CARDS;
  const normalized = normalizeVisualIntensity(visualIntensity);
  if (normalized === 'direct') {
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
 * Determines whether to offer an optional inspirational pause card after every N images (default 3 or 5).
 */
export function shouldShowInspirationalInterlude(imagesViewedCount, cadence = 3) {
  const safeCadence = Number(cadence) >= 3 && Number(cadence) <= 5 ? Number(cadence) : 3;
  return Number.isInteger(imagesViewedCount) && imagesViewedCount > 0 && imagesViewedCount % safeCadence === 0;
}

// ============================================================================
// SIGNATURE FEATURE: PHOTO MODE SEQUENCE ENGINE
// ============================================================================

/**
 * Builds the ordered Photo Mode round deck based on user's intensity setting.
 * In 'direct' mode, prioritizes rights-cleared difficult pathology photos first so each round
 * delivers the selected 3 or 5 difficult images before transitioning to calming encouragement.
 */
export function getPhotoModeDeck(allCards = DEFAULT_IMAGE_JOURNEY_CARDS, visualIntensity = 'direct') {
  const normalized = normalizeVisualIntensity(visualIntensity);
  const filtered = filterImagesForIntensity(allCards, normalized);
  if (normalized === 'direct') {
    const directCards = filtered.filter((c) => c.intensity === 'direct');
    const gentleCards = filtered.filter((c) => c.intensity !== 'direct');
    return [...directCards, ...gentleCards];
  }
  return filtered;
}

/**
 * Selects a concise, positive reason to quit for Step 5 of Photo Mode, combining the user's
 * chosen personal motivations and medically reviewed public-health benefits.
 */
export function selectPositiveReasonToQuit(userState, roundNumber = 1) {
  const safeState = userState || createDefaultUserState();
  const selectedIds = safeState.selectedMotivations || ['health'];
  const customList = safeState.customMotivations || [];

  const matchedMotivations = MOTIVATION_REASONS.filter((m) => selectedIds.includes(m.id));
  const pool =
    matchedMotivations.length > 0 ? matchedMotivations : MOTIVATION_REASONS;
  const chosenMotivation = pool[(roundNumber - 1) % pool.length];

  const matchedBenefits = BENEFIT_CARDS.filter(
    (b) => b.relatedMotivation === chosenMotivation.id
  );
  const chosenBenefit =
    matchedBenefits.length > 0
      ? matchedBenefits[(roundNumber - 1) % matchedBenefits.length]
      : BENEFIT_CARDS[(roundNumber - 1) % BENEFIT_CARDS.length];

  const customReason =
    customList.length > 0 ? customList[(roundNumber - 1) % customList.length] : null;

  const calmingStep =
    PHOTO_MODE_CALMING_STEPS[(roundNumber - 1) % PHOTO_MODE_CALMING_STEPS.length];

  const shortLine = customReason
    ? `Reason to Quit: ${customReason}`
    : `${chosenMotivation.label} — ${chosenBenefit.title}`;

  return {
    shortLine,
    photoUrl: calmingStep?.reasonPhotoUrl || './images/calming/calm-ocean-nps.jpg',
    motivationLabel: customReason || chosenMotivation.label,
    motivationDescription: customReason
      ? `Your personal goal: "${customReason}"`
      : chosenMotivation.description,
    benefitTitle: chosenBenefit.title,
    benefitSummary: chosenBenefit.summary,
    benefitCitation: chosenBenefit.sourceCitation
  };
}

/**
 * Initializes a Photo Mode session.
 * Shows the content warning and 3-or-5 round selector before Photo Mode starts (never on top of every photo).
 * Never autoplays (`autoplay: false`).
 */
export function createPhotoModeSession(userState, allCards = DEFAULT_IMAGE_JOURNEY_CARDS) {
  const safeState = userState || createDefaultUserState();
  const normalizedIntensity = normalizeVisualIntensity(safeState.visualIntensity);
  const config = safeState.photoModeConfig || {};
  const roundLength = Number(config.roundLength) === 5 ? 5 : 3;

  const deck = getPhotoModeDeck(allCards, normalizedIntensity);

  return {
    step: 'content_warning',
    visualIntensity: normalizedIntensity,
    roundLength, // 3 or 5
    roundNumber: 1,
    imageIndexInRound: 0, // 0 .. roundLength - 1
    deckCursor: 0,
    deckLength: deck.length,
    isPaused: false,
    autoplay: false,
    skippedCount: 0,
    viewedCount: 0
  };
}

/**
 * Acknowledges the brief content warning before the session starts,
 * transitioning Photo Mode into Step 2 (showing difficult image 1 of 3 or 5 full-screen).
 */
export function acknowledgePhotoModeWarning(userState, session) {
  const safeState = userState || createDefaultUserState();
  const normalizedIntensity = normalizeVisualIntensity(safeState.visualIntensity);
  const nextUserState = {
    ...safeState,
    photoModeConfig: {
      ...(safeState.photoModeConfig || {}),
      roundLength: session?.roundLength === 5 ? 5 : 3,
      warningAcknowledgedForIntensity: normalizedIntensity
    }
  };
  const nextSession = {
    ...session,
    visualIntensity: normalizedIntensity,
    step: 'difficult_image',
    imageIndexInRound: 0,
    isPaused: false
  };
  return { nextUserState, nextSession };
}

/**
 * Changes the Photo Mode round length (3 or 5 difficult images per round).
 */
export function changePhotoModeRoundLength(userState, session, newRoundLength) {
  const validLength = Number(newRoundLength) === 5 ? 5 : 3;
  const nextUserState = {
    ...(userState || createDefaultUserState()),
    photoModeConfig: {
      ...(userState?.photoModeConfig || {}),
      roundLength: validLength
    }
  };
  const nextSession = {
    ...session,
    roundLength: validLength,
    imageIndexInRound: Math.min(session?.imageIndexInRound || 0, validLength - 1)
  };
  return { nextUserState, nextSession };
}

/**
 * Changes the image intensity setting ('direct' | 'gentle' | 'no_graphic').
 * Whenever the user changes the image intensity setting, show the brief content warning before starting.
 */
export function changePhotoModeIntensity(
  userState,
  session,
  newIntensity,
  allCards = DEFAULT_IMAGE_JOURNEY_CARDS
) {
  const safeState = userState || createDefaultUserState();
  const prevNormalized = normalizeVisualIntensity(safeState.visualIntensity);
  const nextNormalized = normalizeVisualIntensity(newIntensity);
  const nextDeck = getPhotoModeDeck(allCards, nextNormalized);

  const didChange = prevNormalized !== nextNormalized;

  const nextUserState = {
    ...safeState,
    visualIntensity: nextNormalized,
    photoModeConfig: {
      ...(safeState.photoModeConfig || {}),
      warningAcknowledgedForIntensity: didChange
        ? null
        : safeState.photoModeConfig?.warningAcknowledgedForIntensity
    }
  };

  const nextSession = {
    ...session,
    visualIntensity: nextNormalized,
    step: didChange ? 'content_warning' : session.step,
    imageIndexInRound: 0,
    deckCursor: 0,
    deckLength: nextDeck.length,
    isPaused: false
  };

  return { nextUserState, nextSession };
}

/**
 * Advances Photo Mode through its full-screen sequence on each "Next" tap:
 * 1. 'content_warning' -> 'difficult_image' (1 of 3 or 5)
 * 2. 'difficult_image' (1..N) -> 'calming_encouragement' (after N difficult images)
 * 3. 'calming_encouragement' -> 'reason_to_quit' (full-screen image with one short line of text)
 * 4. 'reason_to_quit' -> 'round_complete' (shows "Continue" and "Close")
 */
export function advancePhotoModeSession(session, wasSkipped = false) {
  if (!session) return null;

  if (session.step === 'content_warning') {
    return {
      ...session,
      step: 'difficult_image',
      imageIndexInRound: 0,
      isPaused: false
    };
  }

  if (session.step === 'difficult_image') {
    const nextViewed = wasSkipped ? session.viewedCount : session.viewedCount + 1;
    const nextSkipped = wasSkipped ? session.skippedCount + 1 : session.skippedCount;
    const nextCursor =
      session.deckLength > 0 ? (session.deckCursor + 1) % session.deckLength : 0;

    if (session.imageIndexInRound + 1 < session.roundLength) {
      return {
        ...session,
        imageIndexInRound: session.imageIndexInRound + 1,
        deckCursor: nextCursor,
        viewedCount: nextViewed,
        skippedCount: nextSkipped,
        isPaused: false
      };
    }

    // Completed the selected number (3 or 5) of difficult images -> show full-screen calming image
    return {
      ...session,
      step: 'calming_encouragement',
      deckCursor: nextCursor,
      viewedCount: nextViewed,
      skippedCount: nextSkipped,
      isPaused: false
    };
  }

  if (session.step === 'calming_encouragement') {
    return {
      ...session,
      step: 'reason_to_quit',
      isPaused: false
    };
  }

  if (session.step === 'reason_to_quit') {
    return {
      ...session,
      step: 'round_complete',
      isPaused: false
    };
  }

  return session;
}

/**
 * Rule 6: If the user chooses to continue with another round, begin the next round with difficult images.
 */
export function startNextPhotoModeRound(userState, session) {
  const safeState = userState || createDefaultUserState();
  const nextUserState = {
    ...safeState,
    photoModeConfig: {
      ...(safeState.photoModeConfig || {}),
      completedRoundsCount: (safeState.photoModeConfig?.completedRoundsCount || 0) + 1
    }
  };

  const nextSession = {
    ...session,
    roundNumber: (session?.roundNumber || 1) + 1,
    step: 'difficult_image',
    imageIndexInRound: 0,
    isPaused: false
  };

  return { nextUserState, nextSession };
}

/**
 * Retrieves the active calming card for the current round.
 */
export function getCalmingCardForRound(roundNumber = 1) {
  const idx = Math.max(0, roundNumber - 1) % PHOTO_MODE_CALMING_STEPS.length;
  return PHOTO_MODE_CALMING_STEPS[idx];
}

// ============================================================================
// PERSONALIZED REMINDERS ENGINE (DISCREET BY DEFAULT)
// ============================================================================

/**
 * Updates the user's Personalized Reminder settings while enforcing lock-screen image safety.
 */
export function updateReminderSettings(userState, patch = {}) {
  const safeState = userState || createDefaultUserState();
  const current = safeState.reminderSettings || createDefaultUserState().reminderSettings;
  const merged = {
    ...current,
    ...patch
  };

  // If image notifications are turned off, reset the explicit lock-screen confirmation
  if (!merged.enableImageInNotification) {
    merged.lockScreenImageConfirmed = false;
  }

  return {
    ...safeState,
    reminderSettings: merged
  };
}

/**
 * Builds the notification payload for Personalized Reminders.
 * - Discreet by default: never shows graphic images or sensitive health details on the lock screen.
 * - Default copy: "Your progress is waiting—open Clear Path when you’re ready."
 * - If includeQuitProgress is true, includes accurate, encouraging, nonjudgmental progress
 *   without guilt or implying a setback erases progress.
 * - Only includes an image if BOTH enableImageInNotification AND lockScreenImageConfirmed are true.
 */
export function buildReminderNotificationPayload(
  userState,
  referenceDateISO = normalizeDateISO()
) {
  const safeState = userState || createDefaultUserState(referenceDateISO);
  const reminders = safeState.reminderSettings || createDefaultUserState().reminderSettings;
  const progress = calculateQuitProgress(safeState, referenceDateISO);

  const isActive = Boolean(reminders.enabled && !reminders.paused);
  const showsImageOnLockScreen = Boolean(
    reminders.enableImageInNotification && reminders.lockScreenImageConfirmed
  );

  let bodyText = 'Your progress is waiting—open Clear Path when you’re ready.';
  if (reminders.includeQuitProgress) {
    const days = progress.effectiveSmokeFreeDays;
    bodyText =
      days > 0
        ? `Your progress is waiting (${days} smoke-free day${days === 1 ? '' : 's'} saved)—open Clear Path when you’re ready.`
        : 'Your progress is waiting—every smoke-free choice counts. Open Clear Path when you’re ready.';
  }

  return {
    isActive,
    isEnabled: Boolean(reminders.enabled),
    isPaused: Boolean(reminders.paused),
    title: 'Clear Path • CigFree™ Check-In',
    body: bodyText,
    discreetLockScreenDefault: !showsImageOnLockScreen,
    showsImageOnLockScreen,
    attachedImageUrl: showsImageOnLockScreen
      ? './images/pathology/lung-emphysema-cdc.jpg'
      : null,
    scheduleSummary: `${reminders.frequency === 'twice_daily' ? 'Twice daily' : 'Selected days'} (${(
      reminders.daysOfWeek || []
    ).join(', ')}) at ${(reminders.timesOfDay || ['09:00']).join(', ')}`
  };
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
