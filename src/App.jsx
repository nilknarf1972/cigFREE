import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  BellOff,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  Flame,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Leaf,
  LifeBuoy,
  Lock,
  Moon,
  PauseCircle,
  PhoneCall,
  PlayCircle,
  RefreshCw,
  Settings as SettingsIcon,
  Share2,
  ShieldAlert,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Sun,
  Trash2,
  Wind,
  XCircle
} from 'lucide-react';
import EducationalIllustration from './components/EducationalIllustration.jsx';
import {
  BENEFIT_CARDS,
  CRAVING_SUPPORT_TOOLKIT,
  DEFAULT_IMAGE_JOURNEY_CARDS,
  DIFFICULT_DAY_AFFIRMATIONS,
  LEGAL_AND_PRICING_CONFIG,
  MOTIVATION_REASONS,
  OFFICIAL_SMOKING_WARNINGS,
  REGIONAL_HELP_RESOURCES,
  REMINDER_DAYS_OF_WEEK,
  REMINDER_FREQUENCY_OPTIONS,
  VISUAL_INTENSITY_OPTIONS
} from './data/clearPathData.js';
import {
  STORAGE_KEY,
  acknowledgePhotoModeWarning,
  advancePhotoModeSession,
  buildReminderNotificationPayload,
  calculateQuitProgress,
  calculateSavingsEstimates,
  changePhotoModeIntensity,
  changePhotoModeRoundLength,
  createCustomImageLicenseRecord,
  createDefaultUserState,
  createPhotoModeSession,
  deleteAllUserData,
  evaluateMilestones,
  exportUserDataJSON,
  getCalmingCardForRound,
  getPhotoModeDeck,
  handleCompassionateSetback,
  normalizeDateISO,
  normalizeVisualIntensity,
  recordCalendarDayStatus,
  resolveEffectiveTheme,
  selectPositiveReasonToQuit,
  startNextPhotoModeRound,
  updateQuitDateWithoutJudgment,
  updateReminderSettings
} from './engine/clearPathEngine.js';

const SCREEN_TABS = [
  { id: 'today', label: 'Today Dashboard', shortLabel: 'Today', icon: Sun },
  { id: 'images', label: '★ Photo Mode', shortLabel: 'Photo Mode', icon: ImageIcon },
  { id: 'benefits', label: 'Benefits & Cravings', shortLabel: 'Benefits', icon: Heart },
  { id: 'calendar', label: 'Quit Calendar', shortLabel: 'Calendar', icon: CalendarIcon },
  { id: 'milestones', label: 'Milestones', shortLabel: 'Milestones', icon: Award },
  { id: 'onboarding', label: 'Quick Setup', shortLabel: 'Setup', icon: Compass },
  { id: 'settings', label: 'Settings & Reminders', shortLabel: 'Settings', icon: SettingsIcon },
  { id: 'help', label: 'Quitline Help', shortLabel: 'Get Help', icon: LifeBuoy }
];

const ORGAN_SHORTCUTS = [
  { id: 'real-lung-emphysema-cdc', label: '🫁 Black Tar Lung (Emphysema)' },
  { id: 'real-lung-cancer-nci', label: '🫁 Lung Cancer Tumor' },
  { id: 'real-lip-cancer-scc', label: '👄 Lip Cancer' },
  { id: 'real-gums-teeth-calculus', label: '🦷 Smoker Gums & Teeth' },
  { id: 'real-throat-larynx-cancer', label: '🗣️ Throat / Voice Box Cancer' },
  { id: 'real-tongue-oral-cancer', label: '👅 Tongue / Mouth Cancer' },
  { id: 'real-oral-leukoplakia-nci', label: '⚠️ Mouth Leukoplakia' },
  { id: 'real-artery-atherosclerosis-cdc', label: '❤️ Clogged Artery Plaque' },
  { id: 'img-airway-cilia-gentle', label: '🌿 Healing Airway Diagram' }
];

export default function App() {
  const todayISO = useMemo(() => normalizeDateISO(new Date()), []);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [statusBanner, setStatusBanner] = useState('');

  const [userState, setUserState] = useState(() => createDefaultUserState(todayISO));
  const [activeScreen, setActiveScreen] = useState('today');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Signature Feature: Photo Mode state machine
  const [photoSession, setPhotoSession] = useState(() =>
    createPhotoModeSession(createDefaultUserState(todayISO))
  );
  const [showLicenseLedgerModal, setShowLicenseLedgerModal] = useState(false);
  const [newLicenseForm, setNewLicenseForm] = useState({
    title: '',
    source: '',
    creator: '',
    licenseStatus: '',
    consentStatus: '',
    permittedUses: '',
    requiredAttribution: '',
    intensity: 'direct',
    isPlaceholderForRealPhoto: false,
    caption: ''
  });
  const [licenseFormError, setLicenseFormError] = useState('');

  // Personalized Reminder new time input
  const [newReminderTimeInput, setNewReminderTimeInput] = useState('18:00');
  const [testNotificationBanner, setTestNotificationBanner] = useState(null);

  // Today / Setback / Craving Timer state
  const [showSetbackFlow, setShowSetbackFlow] = useState(false);
  const [setbackNote, setSetbackNote] = useState('');
  const [setbackResultMessage, setSetbackResultMessage] = useState(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [cravingTimerSeconds, setCravingTimerSeconds] = useState(0);
  const [activeAffirmationIdx, setActiveAffirmationIdx] = useState(0);
  const [activeWarningIdx, setActiveWarningIdx] = useState(0);

  // Benefits custom motivation input
  const [customMotivationInput, setCustomMotivationInput] = useState('');

  // Calendar state
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(todayISO);
  const [calendarDayNote, setCalendarDayNote] = useState('');
  const [quitDateEditInput, setQuitDateEditInput] = useState(todayISO);

  // Milestones opt-in share preview state
  const [optInShareMilestone, setOptInShareMilestone] = useState(null);

  // Settings delete confirmation & export preview
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [exportedJSONPreview, setExportedJSONPreview] = useState('');

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const defaults = createDefaultUserState(todayISO);
        const merged = {
          ...defaults,
          ...parsed,
          visualIntensity: normalizeVisualIntensity(parsed.visualIntensity || defaults.visualIntensity),
          estimateSettings: {
            ...defaults.estimateSettings,
            ...(parsed.estimateSettings || {})
          },
          photoModeConfig: {
            ...defaults.photoModeConfig,
            ...(parsed.photoModeConfig || {})
          },
          reminderSettings: {
            ...defaults.reminderSettings,
            ...(parsed.reminderSettings || {})
          }
        };
        setUserState(merged);
        setPhotoSession(
          createPhotoModeSession(merged, [
            ...DEFAULT_IMAGE_JOURNEY_CARDS,
            ...(merged.customImageRecords || [])
          ])
        );
        setQuitDateEditInput(merged.quitDateISO || todayISO);
        setActiveScreen(merged.onboardingCompleted ? 'today' : 'onboarding');
      } else {
        setActiveScreen('onboarding');
      }
    } catch {
      setLoadError(
        'Could not read saved local progress. Starting with a clean local profile—your privacy remains protected.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [todayISO]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [userState, isLoading]);

  // Detect system dark mode preference
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mq.matches);
    const handler = (e) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Apply theme, text scale, high contrast, and reduced motion attributes
  const effectiveTheme = useMemo(
    () => resolveEffectiveTheme(userState.themeMode, systemPrefersDark),
    [userState.themeMode, systemPrefersDark]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', effectiveTheme);
    root.setAttribute('data-text-scale', userState.textScale || 'standard');
    root.setAttribute('data-high-contrast', String(Boolean(userState.highContrast)));
    root.setAttribute('data-reduced-motion', String(Boolean(userState.reducedMotion)));
  }, [effectiveTheme, userState.textScale, userState.highContrast, userState.reducedMotion]);

  // 5-Minute Craving Delay Timer countdown (Note: Photo Mode NEVER autoplays; this timer is only for optional craving pause)
  useEffect(() => {
    if (cravingTimerSeconds <= 0) return undefined;
    const interval = window.setInterval(() => {
      setCravingTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [cravingTimerSeconds]);

  // Derived domain models
  const progress = useMemo(
    () => calculateQuitProgress(userState, todayISO),
    [userState, todayISO]
  );
  const estimates = useMemo(
    () => calculateSavingsEstimates(userState, todayISO),
    [userState, todayISO]
  );
  const milestoneReport = useMemo(
    () => evaluateMilestones(userState, todayISO),
    [userState, todayISO]
  );

  const allImageCards = useMemo(
    () => [...DEFAULT_IMAGE_JOURNEY_CARDS, ...(userState.customImageRecords || [])],
    [userState.customImageRecords]
  );

  const photoModeDeck = useMemo(
    () => getPhotoModeDeck(allImageCards, userState.visualIntensity),
    [allImageCards, userState.visualIntensity]
  );

  const safeDeckCursor =
    photoModeDeck.length > 0 ? (photoSession.deckCursor || 0) % photoModeDeck.length : 0;
  const currentPhotoCard = photoModeDeck[safeDeckCursor] || null;
  const currentCalmingCard = useMemo(
    () => getCalmingCardForRound(photoSession.roundNumber),
    [photoSession.roundNumber]
  );
  const currentReasonToQuit = useMemo(
    () => selectPositiveReasonToQuit(userState, photoSession.roundNumber),
    [userState, photoSession.roundNumber]
  );
  const currentOfficialWarning =
    OFFICIAL_SMOKING_WARNINGS[activeWarningIdx % OFFICIAL_SMOKING_WARNINGS.length];

  const reminderPayload = useMemo(
    () => buildReminderNotificationPayload(userState, todayISO),
    [userState, todayISO]
  );

  const showTemporaryStatus = (msg) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? '' : prev));
    }, 5000);
  };

  // ============================================================================
  // PHOTO MODE HANDLERS (FULL-SCREEN VIEWER, STRICT USER CONTROL, NO AUTOPLAY)
  // ============================================================================
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const handleOpenPhotoMode = () => {
    setImageLoadFailed(false);
    setPhotoSession((prev) => {
      const normalized = normalizeVisualIntensity(userState.visualIntensity);
      return {
        ...prev,
        visualIntensity: normalized,
        roundLength: Number(userState.photoModeConfig?.roundLength) === 5 ? 5 : 3,
        deckLength: photoModeDeck.length,
        imageIndexInRound: 0,
        step: 'content_warning',
        isPaused: false
      };
    });
    setActiveScreen('images');
  };

  const handleAcknowledgeWarningAndBeginRound = (overrideLength = null) => {
    setImageLoadFailed(false);
    const chosenLength =
      overrideLength === 3 || overrideLength === 5 ? overrideLength : photoSession.roundLength;
    const { nextUserState, nextSession } = acknowledgePhotoModeWarning(userState, {
      ...photoSession,
      roundLength: chosenLength,
      deckLength: photoModeDeck.length
    });
    setUserState(nextUserState);
    setPhotoSession(nextSession);
  };

  const handlePhotoModeRoundLengthChange = (lengthVal) => {
    const { nextUserState, nextSession } = changePhotoModeRoundLength(
      userState,
      photoSession,
      lengthVal
    );
    setUserState(nextUserState);
    setPhotoSession(nextSession);
  };

  const handleIntensityChangeEverywhere = (newIntensity) => {
    setImageLoadFailed(false);
    const { nextUserState, nextSession } = changePhotoModeIntensity(
      userState,
      photoSession,
      newIntensity,
      allImageCards
    );
    setUserState(nextUserState);
    setPhotoSession(nextSession);
    showTemporaryStatus(
      `Visual intensity set to "${
        VISUAL_INTENSITY_OPTIONS.find((o) => o.id === normalizeVisualIntensity(newIntensity))?.label
      }".`
    );
  };

  const handleAdvancePhotoStep = (wasSkipped = false) => {
    setImageLoadFailed(false);
    setActiveWarningIdx((prev) => prev + 1);
    setPhotoSession((prev) =>
      advancePhotoModeSession(
        {
          ...prev,
          deckLength: photoModeDeck.length
        },
        wasSkipped
      )
    );
  };

  const handleStartNextRound = () => {
    setImageLoadFailed(false);
    const { nextUserState, nextSession } = startNextPhotoModeRound(userState, {
      ...photoSession,
      deckLength: photoModeDeck.length
    });
    setUserState(nextUserState);
    setPhotoSession(nextSession);
  };

  const handleExitPhotoMode = () => {
    setImageLoadFailed(false);
    setPhotoSession((prev) => ({
      ...prev,
      isPaused: false
    }));
    setActiveScreen('today');
  };

  const handleJumpToOrganInPhotoMode = (cardId) => {
    setImageLoadFailed(false);
    const targetCard = allImageCards.find((c) => c.id === cardId);
    if (!targetCard) return;

    const normalized =
      targetCard.intensity === 'direct'
        ? 'direct'
        : normalizeVisualIntensity(userState.visualIntensity);
    const nextDeck = getPhotoModeDeck(allImageCards, normalized);
    const idx = Math.max(
      0,
      nextDeck.findIndex((c) => c.id === cardId)
    );

    if (normalized !== normalizeVisualIntensity(userState.visualIntensity)) {
      setUserState((prev) => ({
        ...prev,
        visualIntensity: normalized
      }));
    }

    setPhotoSession((prev) => ({
      ...prev,
      visualIntensity: normalized,
      deckCursor: idx,
      deckLength: nextDeck.length,
      imageIndexInRound: 0,
      step: 'content_warning',
      isPaused: false
    }));
    setActiveScreen('images');
  };

  // ============================================================================
  // GENERAL HANDLERS
  // ============================================================================

  const handleCompleteOnboarding = (e) => {
    if (e) e.preventDefault();
    setUserState((prev) => ({
      ...prev,
      onboardingCompleted: true
    }));
    setActiveScreen('today');
    showTemporaryStatus('Setup complete! Welcome to your Today dashboard & Photo Mode.');
  };

  const handleMarkTodaySmokeFree = () => {
    const updated = recordCalendarDayStatus(
      userState,
      todayISO,
      'smoke_free',
      'Marked smoke-free from Today screen'
    );
    setUserState(updated);
    setSetbackResultMessage(null);
    showTemporaryStatus('Awesome job! Today is locked in as Smoke-Free.');
  };

  const handleSetbackChoice = (option) => {
    const { nextState, compassionateResponse } = handleCompassionateSetback(
      userState,
      todayISO,
      option,
      setbackNote
    );
    setUserState(nextState);
    setQuitDateEditInput(nextState.quitDateISO);
    setSetbackResultMessage(compassionateResponse);
    setShowSetbackFlow(false);
    setSetbackNote('');
  };

  const handleToggleMotivation = (id) => {
    setUserState((prev) => {
      const exists = (prev.selectedMotivations || []).includes(id);
      const next = exists
        ? prev.selectedMotivations.filter((m) => m !== id)
        : [...(prev.selectedMotivations || []), id];
      return { ...prev, selectedMotivations: next };
    });
  };

  const handleAddCustomMotivation = (e) => {
    e.preventDefault();
    const trimmed = customMotivationInput.trim();
    if (!trimmed) return;
    setUserState((prev) => ({
      ...prev,
      customMotivations: [...(prev.customMotivations || []), trimmed]
    }));
    setCustomMotivationInput('');
    showTemporaryStatus('Added your personal motivation reason.');
  };

  const handleAddCustomImageLicense = (e) => {
    e.preventDefault();
    setLicenseFormError('');
    try {
      const record = createCustomImageLicenseRecord(newLicenseForm);
      setUserState((prev) => ({
        ...prev,
        customImageRecords: [...(prev.customImageRecords || []), record]
      }));
      setNewLicenseForm({
        title: '',
        source: '',
        creator: '',
        licenseStatus: '',
        consentStatus: '',
        permittedUses: '',
        requiredAttribution: '',
        intensity: 'direct',
        isPlaceholderForRealPhoto: false,
        caption: ''
      });
      showTemporaryStatus('Recorded cleared visual asset in the local Image License Ledger.');
    } catch (err) {
      setLicenseFormError(err.message || 'Please complete required license fields.');
    }
  };

  const handleExportData = () => {
    const json = exportUserDataJSON(userState);
    setExportedJSONPreview(json);
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cigfree-local-backup-${todayISO}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showTemporaryStatus('Exported your local data as a portable JSON file.');
    } catch {
      showTemporaryStatus('Prepared your JSON data export below.');
    }
  };

  const handleConfirmDeleteAllData = () => {
    const fresh = deleteAllUserData(window.localStorage, todayISO);
    setUserState(fresh);
    setPhotoSession(createPhotoModeSession(fresh));
    setQuitDateEditInput(todayISO);
    setConfirmDeleteOpen(false);
    setExportedJSONPreview('');
    setSetbackResultMessage(null);
    setTestNotificationBanner(null);
    setActiveScreen('onboarding');
    showTemporaryStatus('All local data has been permanently deleted from this device.');
  };

  // Calendar grid helper
  const calendarDaysData = useMemo(() => {
    const [baseYear, baseMonth] = todayISO.split('-').map(Number);
    const viewDate = new Date(baseYear, baseMonth - 1 + calendarMonthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthLabel = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const firstDayWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayWeekday; i += 1) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        iso,
        log: (userState.calendarLogs || {})[iso] || null
      });
    }
    return { monthLabel, cells };
  }, [todayISO, calendarMonthOffset, userState.calendarLogs]);

  // Shared Personalized Reminders Control Panel (rendered in Photo Mode & Settings)
  const renderPersonalizedRemindersPanel = () => {
    const rem = userState.reminderSettings || createDefaultUserState().reminderSettings;
    return (
      <section className="card" aria-labelledby="reminders-heading">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}
        >
          <div>
            <h3 id="reminders-heading" className="section-title" style={{ margin: 0 }}>
              <Bell size={20} /> Personalized Photo Mode Reminders (Discreet by Default)
            </h3>
            <p className="section-subtitle" style={{ margin: '0.2rem 0 0 0' }}>
              Opt in to gentle reminders for Photo Mode. Lock-screen notifications are discreet by
              default—never showing graphic images or sensitive health details unless you explicitly
              enable and confirm lock-screen images.
            </p>
          </div>

          {/* Easy Controls to Turn On, Pause, or Turn Off Reminders */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!rem.enabled ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setUserState((prev) =>
                    updateReminderSettings(prev, { enabled: true, paused: false })
                  );
                  showTemporaryStatus('Opted in to Personalized Photo Mode Reminders.');
                }}
              >
                <Bell size={18} /> Opt In to Reminders
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const nextPaused = !rem.paused;
                    setUserState((prev) =>
                      updateReminderSettings(prev, { paused: nextPaused })
                    );
                    showTemporaryStatus(
                      nextPaused
                        ? 'Reminders paused. Resume whenever you are ready.'
                        : 'Reminders resumed.'
                    );
                  }}
                >
                  <PauseCircle size={18} />
                  {rem.paused ? 'Resume Reminders' : 'Pause Reminders'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setUserState((prev) =>
                      updateReminderSettings(prev, {
                        enabled: false,
                        paused: false,
                        enableImageInNotification: false,
                        lockScreenImageConfirmed: false
                      })
                    );
                    showTemporaryStatus('Turned off Photo Mode reminders.');
                  }}
                >
                  <BellOff size={18} /> Turn Off Reminders
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Lock-Screen Discreet Preview */}
        <div
          className="card"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'var(--brand-primary)',
            marginBottom: '1rem'
          }}
          role="region"
          aria-label="Lock Screen Notification Preview"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.4rem'
            }}
          >
            <span className="pill-badge price-pill">
              <Lock size={13} />{' '}
              {reminderPayload.discreetLockScreenDefault
                ? 'Discreet Lock-Screen Mode Active (No Graphic Images Shown)'
                : 'Opt-In Lock-Screen Image Enabled (Confirmed by User)'}
            </span>
            <span className="pill-badge">
              Status:{' '}
              {!rem.enabled ? 'Off' : rem.paused ? 'Paused' : `Active (${reminderPayload.scheduleSummary})`}
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>{reminderPayload.title}</div>
          <div style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>“{reminderPayload.body}”</div>
          {reminderPayload.showsImageOnLockScreen && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#9B2C2C', fontWeight: 700 }}>
              [Opt-In Image Preview Attached on Lock Screen]
            </div>
          )}
        </div>

        {rem.enabled && (
          <div className="grid-2">
            {/* Days & Frequency */}
            <div>
              <div className="form-group">
                <label htmlFor="rem-frequency-select" className="form-label">
                  Reminder Frequency
                </label>
                <select
                  id="rem-frequency-select"
                  className="form-input"
                  value={rem.frequency}
                  onChange={(e) => {
                    const freq = e.target.value;
                    const nextTimes =
                      freq === 'twice_daily' && (rem.timesOfDay || []).length < 2
                        ? ['09:00', '19:00']
                        : rem.timesOfDay;
                    setUserState((prev) =>
                      updateReminderSettings(prev, { frequency: freq, timesOfDay: nextTimes })
                    );
                  }}
                >
                  {REMINDER_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <span className="form-label">Days of the Week</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {REMINDER_DAYS_OF_WEEK.map((day) => {
                    const selected = (rem.daysOfWeek || []).includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        className={`organ-chip ${selected ? 'active' : ''}`}
                        style={
                          selected
                            ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }
                            : {}
                        }
                        onClick={() => {
                          const exists = (rem.daysOfWeek || []).includes(day.id);
                          const nextDays = exists
                            ? rem.daysOfWeek.filter((d) => d !== day.id)
                            : [...(rem.daysOfWeek || []), day.id];
                          setUserState((prev) =>
                            updateReminderSettings(prev, { daysOfWeek: nextDays })
                          );
                        }}
                        aria-pressed={selected}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <span className="form-label">Reminder Times</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.5rem' }}>
                  {(rem.timesOfDay || ['09:00']).map((t) => (
                    <span key={t} className="pill-badge">
                      <Clock size={13} /> {t}
                      {(rem.timesOfDay || []).length > 1 && (
                        <button
                          type="button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontWeight: 800,
                            marginLeft: '4px',
                            color: 'inherit'
                          }}
                          onClick={() =>
                            setUserState((prev) =>
                              updateReminderSettings(prev, {
                                timesOfDay: rem.timesOfDay.filter((x) => x !== t)
                              })
                            )
                          }
                          aria-label={`Remove reminder time ${t}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="time"
                    className="form-input"
                    value={newReminderTimeInput}
                    onChange={(e) => setNewReminderTimeInput(e.target.value)}
                    aria-label="New reminder time"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      if (!newReminderTimeInput) return;
                      const nextTimes = Array.from(
                        new Set([...(rem.timesOfDay || []), newReminderTimeInput])
                      ).sort();
                      setUserState((prev) =>
                        updateReminderSettings(prev, { timesOfDay: nextTimes })
                      );
                    }}
                  >
                    + Add Time
                  </button>
                </div>
              </div>
            </div>

            {/* Progress & Lock-Screen Privacy Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.55rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(rem.includeQuitProgress)}
                  onChange={(e) =>
                    setUserState((prev) =>
                      updateReminderSettings(prev, { includeQuitProgress: e.target.checked })
                    )
                  }
                />
                <span>
                  Include My Accurate, Nonjudgmental Quit Progress
                  <span className="form-hint" style={{ display: 'block', fontWeight: 400 }}>
                    Includes saved smoke-free days without guilt-based wording or implying a setback
                    erases past progress.
                  </span>
                </span>
              </label>

              <div className="card card-warning" style={{ padding: '0.9rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.55rem',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(rem.enableImageInNotification)}
                    onChange={(e) =>
                      setUserState((prev) =>
                        updateReminderSettings(prev, {
                          enableImageInNotification: e.target.checked,
                          lockScreenImageConfirmed: false
                        })
                      )
                    }
                  />
                  <span>
                    Allow an Image in Notifications (Off by Default)
                    <span className="form-hint" style={{ display: 'block', fontWeight: 400 }}>
                      By default, notifications are text-only and discreet.
                    </span>
                  </span>
                </label>

                {rem.enableImageInNotification && (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.55rem',
                      cursor: 'pointer',
                      marginTop: '0.65rem',
                      paddingTop: '0.65rem',
                      borderTop: '1px solid var(--border-color)',
                      fontWeight: 700,
                      color: '#9B2C2C'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(rem.lockScreenImageConfirmed)}
                      onChange={(e) =>
                        setUserState((prev) =>
                          updateReminderSettings(prev, {
                            lockScreenImageConfirmed: e.target.checked
                          })
                        )
                      }
                    />
                    <span>
                      Required Lock-Screen Confirmation: I understand that enabling notification
                      images means an image may be visible on my device’s lock screen.
                    </span>
                  </label>
                )}
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setTestNotificationBanner(reminderPayload);
                  showTemporaryStatus('Previewed your Personalized Reminder below.');
                }}
              >
                <Bell size={18} /> Test My Reminder Notification Now
              </button>

              {testNotificationBanner && (
                <div className="card" role="status">
                  <strong>Simulated Device Notification:</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>
                    <strong>{testNotificationBanner.title}:</strong> {testNotificationBanner.body}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="app-shell" aria-busy="true" aria-live="polite">
        <main className="main-content">
          <div className="card">
            <h1 className="section-title">Loading CigFree™ (Clear Path)…</h1>
            <p className="section-subtitle">
              Preparing your offline-first quit companion by The Primo IT Tech LLC.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ===========================================================================
  // SIMPLE FULL-SCREEN PHOTO MODE IMAGE VIEWER
  // No dashboard, cards, menus, explanations, stats, captions, or progress bars over images.
  // ===========================================================================
  if (activeScreen === 'images') {
    const overlayBtnStyle = {
      minHeight: '44px',
      padding: '0.55rem 1.2rem',
      borderRadius: '999px',
      fontSize: '0.95rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.65)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const closeBtnStyle = {
      ...overlayBtnStyle,
      background: 'rgba(12, 16, 20, 0.84)',
      color: '#FFFFFF',
      border: '1.5px solid rgba(255, 255, 255, 0.85)'
    };

    const nextBtnStyle = {
      ...overlayBtnStyle,
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#0A0E12',
      border: '1.5px solid #0A0E12',
      fontWeight: 800
    };

    const controlsBarStyle = {
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10002,
      pointerEvents: 'none'
    };

    // 1. Pre-start Content Warning + Choose a round of 3 or 5 difficult images
    if (photoSession.step === 'content_warning') {
      return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pm-fullscreen-warning-title"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            background: '#090D10',
            color: '#F7FAFC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.75rem',
            textAlign: 'center',
            zIndex: 9999
          }}
        >
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <h2
              id="pm-fullscreen-warning-title"
              style={{ margin: '0 0 0.75rem 0', fontSize: '1.4rem', fontWeight: 800 }}
            >
              Content Warning
            </h2>
            <p
              style={{
                margin: '0 0 1.5rem 0',
                fontSize: '1rem',
                lineHeight: 1.55,
                color: '#CBD5E0'
              }}
            >
              {normalizeVisualIntensity(userState.visualIntensity) === 'direct'
                ? 'Photo Mode displays real, legally cleared clinical photographs of smoking-related damage. These images can be upsetting. You are in complete control—tap Next to advance at your own pace, or tap Close at any time.'
                : 'Photo Mode displays non-graphic educational placeholders for smoking-related imagery. You are in complete control—tap Next to advance at your own pace, or tap Close at any time.'}
            </p>

            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 700, fontSize: '1rem' }}>
              Choose a round of 3 or 5 difficult images:
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '1.5rem'
              }}
            >
              {[3, 5].map((len) => {
                const isSelected = photoSession.roundLength === len;
                return (
                  <button
                    key={len}
                    type="button"
                    onClick={() => handlePhotoModeRoundLengthChange(len)}
                    aria-pressed={isSelected}
                    style={{
                      minHeight: '48px',
                      padding: '0.65rem 1.35rem',
                      borderRadius: '999px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
                      color: isSelected ? '#090D10' : '#FFFFFF',
                      border: isSelected
                        ? '2px solid #FFFFFF'
                        : '1.5px solid rgba(255, 255, 255, 0.45)'
                    }}
                  >
                    {len} Difficult Images {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.85rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={() => handleAcknowledgeWarningAndBeginRound(photoSession.roundLength)}
                style={{
                  ...nextBtnStyle,
                  padding: '0.7rem 1.6rem',
                  fontSize: '1rem'
                }}
              >
                Next
              </button>
              <button
                type="button"
                onClick={handleExitPhotoMode}
                style={{
                  ...closeBtnStyle,
                  padding: '0.7rem 1.4rem',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 2. Difficult Image Full-Screen Step (1 at a time; ONLY the image + Next and Close buttons)
    if (photoSession.step === 'difficult_image') {
      const hasRealPhoto = Boolean(currentPhotoCard?.photoUrl && !imageLoadFailed);
      return (
        <div
          role="region"
          aria-label="Photo Mode Full-Screen Image Viewer"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            background: '#000000',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {hasRealPhoto ? (
            <img
              src={currentPhotoCard.photoUrl}
              alt={currentPhotoCard.screenReaderDescription || currentPhotoCard.title}
              onError={() => setImageLoadFailed(true)}
              style={{
                width: '100vw',
                height: '100dvh',
                objectFit: 'contain',
                display: 'block',
                background: '#000000'
              }}
            />
          ) : (
            <div
              style={{
                width: '100vw',
                height: '100dvh',
                background: '#0D1317',
                color: '#E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.4)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                PLACEHOLDER IMAGE (Development / Non-Graphic Mode)
              </div>
              <div style={{ maxWidth: '520px', width: '100%' }}>
                <EducationalIllustration
                  type={currentPhotoCard?.illustrationType || 'cilia-renewal'}
                  title={currentPhotoCard?.title || 'Educational Placeholder'}
                  description={
                    currentPhotoCard?.screenReaderDescription ||
                    'Labeled educational placeholder illustration'
                  }
                  reducedMotion={userState.reducedMotion}
                />
              </div>
            </div>
          )}

          <div style={controlsBarStyle}>
            <button
              type="button"
              onClick={handleExitPhotoMode}
              style={{ ...closeBtnStyle, pointerEvents: 'auto' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleAdvancePhotoStep(false)}
              style={{ ...nextBtnStyle, pointerEvents: 'auto' }}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    // 3. Full-Screen Calming or Inspirational Image Step (ONLY the image + Next and Close buttons)
    if (photoSession.step === 'calming_encouragement') {
      const hasCalmPhoto = Boolean(currentCalmingCard?.photoUrl && !imageLoadFailed);
      return (
        <div
          role="region"
          aria-label="Photo Mode Calming Image"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            background: '#000000',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {hasCalmPhoto ? (
            <img
              src={currentCalmingCard.photoUrl}
              alt={currentCalmingCard.screenReaderDescription || currentCalmingCard.title}
              onError={() => setImageLoadFailed(true)}
              style={{
                width: '100vw',
                height: '100dvh',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ) : (
            <div
              style={{
                width: '100vw',
                height: '100dvh',
                background: '#0D1B1E',
                color: '#E6FFFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '1rem' }}>
                PLACEHOLDER CALMING IMAGE (Development Mode)
              </div>
              <div style={{ maxWidth: '520px', width: '100%' }}>
                <EducationalIllustration
                  type={currentCalmingCard?.illustrationType || 'sunrise-horizon'}
                  title={currentCalmingCard?.title || 'Calming Image'}
                  description={currentCalmingCard?.screenReaderDescription || 'Calming scene'}
                  reducedMotion={userState.reducedMotion}
                />
              </div>
            </div>
          )}

          <div style={controlsBarStyle}>
            <button
              type="button"
              onClick={handleExitPhotoMode}
              style={{ ...closeBtnStyle, pointerEvents: 'auto' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleAdvancePhotoStep(false)}
              style={{ ...nextBtnStyle, pointerEvents: 'auto' }}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    // 4. Full-Screen Reason to Quit (short line of text over a suitable image + Next and Close)
    if (photoSession.step === 'reason_to_quit') {
      const hasReasonPhoto = Boolean(currentReasonToQuit?.photoUrl && !imageLoadFailed);
      return (
        <div
          role="region"
          aria-label="Photo Mode Reason to Quit"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            background: '#000000',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {hasReasonPhoto ? (
            <img
              src={currentReasonToQuit.photoUrl}
              alt="Calming background for reason to quit"
              onError={() => setImageLoadFailed(true)}
              style={{
                width: '100vw',
                height: '100dvh',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ) : (
            <div
              style={{
                width: '100vw',
                height: '100dvh',
                background: '#0F2429'
              }}
            />
          )}

          {/* One short line of text over the suitable image */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              pointerEvents: 'none',
              zIndex: 10001
            }}
          >
            <p
              style={{
                margin: 0,
                padding: '0.85rem 1.4rem',
                borderRadius: '14px',
                background: 'rgba(8, 12, 16, 0.78)',
                color: '#FFFFFF',
                fontSize: 'clamp(1.1rem, 2.8vw, 1.55rem)',
                fontWeight: 800,
                textAlign: 'center',
                maxWidth: '680px',
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.65)'
              }}
            >
              {currentReasonToQuit.shortLine}
            </p>
          </div>

          <div style={controlsBarStyle}>
            <button
              type="button"
              onClick={handleExitPhotoMode}
              style={{ ...closeBtnStyle, pointerEvents: 'auto' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleAdvancePhotoStep(false)}
              style={{ ...nextBtnStyle, pointerEvents: 'auto' }}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    // 5. After Reason to Quit: Show "Continue" and "Close"
    return (
      <div
        role="region"
        aria-label="Photo Mode Round Complete"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          background: '#090D10',
          color: '#FFFFFF',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <button
            type="button"
            onClick={handleStartNextRound}
            style={{
              ...nextBtnStyle,
              padding: '0.75rem 1.75rem',
              fontSize: '1.05rem'
            }}
          >
            Continue
          </button>
          <button
            type="button"
            onClick={handleExitPhotoMode}
            style={{
              ...closeBtnStyle,
              padding: '0.75rem 1.55rem',
              fontSize: '1.05rem'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Sticky Header + Always-Visible Top Navigation Menu */}
      <div className="sticky-top-wrapper">
        <header className="app-header" role="banner">
          <div className="brand-row">
            <button
              type="button"
              className="brand-logo"
              onClick={() => setActiveScreen('today')}
              title="Go to Today Dashboard"
              aria-label="Go to Today Dashboard"
            >
              <Leaf size={22} />
            </button>
            <div className="brand-titles">
              <h1>CigFree™ — Clear Path</h1>
              <p className="brand-subtitle">
                By <strong>{LEGAL_AND_PRICING_CONFIG.companyName}</strong> • Signature Photo Mode &amp; Quit
                Companion
              </p>
            </div>
          </div>

          <div className="header-pills">
            <span
              className="pill-badge price-pill"
              title="One-Time App Store Download — No Subscriptions"
            >
              <Lock size={13} aria-hidden="true" />
              {LEGAL_AND_PRICING_CONFIG.pricing.displayPrice} One-Time • No Subscriptions
            </span>
            <button
              type="button"
              className="pill-badge"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setUserState((prev) => ({
                  ...prev,
                  themeMode: effectiveTheme === 'dark' ? 'light' : 'dark'
                }))
              }
              aria-label={`Switch theme (currently ${effectiveTheme} mode)`}
            >
              {effectiveTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        {/* ALWAYS-VISIBLE TOP NAVIGATION BAR */}
        <nav className="top-nav-bar" aria-label="Main Screen Navigation">
          {SCREEN_TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`top-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (tab.id === 'images') {
                    handleOpenPhotoMode();
                  } else {
                    setActiveScreen(tab.id);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent size={16} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="main-content" role="main">
        {/* Prominent Back-to-Today Bar on ANY screen other than Today! */}
        {activeScreen !== 'today' && (
          <div className="back-bar" role="navigation" aria-label="Return to Today screen">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActiveScreen('today')}
            >
              <ArrowLeft size={18} /> ← Back to Today Dashboard
            </button>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeScreen !== 'images' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleOpenPhotoMode}
                >
                  <ImageIcon size={18} /> Open Signature Photo Mode
                </button>
              )}
            </div>
          </div>
        )}

        {loadError && (
          <div className="card card-warning" role="alert">
            <strong>Storage Notice:</strong> {loadError}
          </div>
        )}

        {statusBanner && (
          <div
            className="card"
            role="status"
            aria-live="polite"
            style={{
              background: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              borderColor: 'var(--brand-secondary)',
              fontWeight: 700
            }}
          >
            {statusBanner}
          </div>
        )}

        {/* =====================================================================
            SCREEN 1: WELCOME / QUICK SETUP
           ===================================================================== */}
        {activeScreen === 'onboarding' && (
          <section aria-labelledby="onboarding-heading" className="card card-hero">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}
            >
              <span className="pill-badge price-pill">
                iOS &amp; Android • {LEGAL_AND_PRICING_CONFIG.pricing.displayPrice} One-Time Download
              </span>
              <span className="pill-badge">No Account Required • 100% Offline Ready</span>
            </div>

            <h2 id="onboarding-heading" className="section-title">
              <Compass size={24} /> Welcome &amp; Quick Setup — CigFree™ (Clear Path)
            </h2>
            <p className="section-subtitle">
              Set your quit date, choose your image intensity (**Direct**, **Gentle**, or **No graphic
              images**), and configure your **Signature Photo Mode** session length (**3 or 5 images per
              round**).
            </p>

            {/* Non-Medical, Trademark & Store Pricing Disclosure Box */}
            <div className="card" style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <p style={{ margin: '0 0 0.4rem 0' }}>
                <strong>Educational &amp; Motivational Purpose (Not Medical Care):</strong>{' '}
                {LEGAL_AND_PRICING_CONFIG.medicalDisclaimer.shortNotice}
              </p>
              <p style={{ margin: '0 0 0.4rem 0', color: 'var(--text-secondary)' }}>
                <strong>One-Time $0.99 Price &amp; Store Fee Disclaimer:</strong>{' '}
                {LEGAL_AND_PRICING_CONFIG.pricing.storeListingSummary}{' '}
                {LEGAL_AND_PRICING_CONFIG.pricing.feeAndTaxDisclaimer}
              </p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                <strong>{LEGAL_AND_PRICING_CONFIG.trademarkSafetyNotice}</strong>
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding}>
              {/* 1. Quit Date */}
              <div className="form-group">
                <label htmlFor="onboarding-quit-date" className="form-label">
                  1. Pick Your Quit Date (or Click “Start Today”)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                  <input
                    id="onboarding-quit-date"
                    type="date"
                    className="form-input"
                    value={userState.quitDateISO}
                    onChange={(e) => {
                      const val = normalizeDateISO(e.target.value);
                      setUserState((prev) => updateQuitDateWithoutJudgment(prev, val, todayISO));
                      setQuitDateEditInput(val);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setUserState((prev) => updateQuitDateWithoutJudgment(prev, todayISO, todayISO));
                      setQuitDateEditInput(todayISO);
                      showTemporaryStatus('Quit date set to Today.');
                    }}
                  >
                    Start Today ({todayISO})
                  </button>
                </div>
              </div>

              {/* 2. Visual Intensity Choice */}
              <div className="form-group">
                <span className="form-label">
                  2. Choose Your Visual Intensity (“Direct,” “Gentle,” or “No graphic images”)
                </span>
                <span className="form-hint">
                  Graphic images can be upsetting. Photo Mode always shows a content warning before your
                  first session and whenever you change intensity, and lets you skip or exit at any time.
                </span>
                <div className="grid-3" style={{ marginTop: '0.5rem' }}>
                  {VISUAL_INTENSITY_OPTIONS.map((opt) => {
                    const selected =
                      normalizeVisualIntensity(userState.visualIntensity) === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`option-card ${selected ? 'selected' : ''}`}
                        onClick={() => handleIntensityChangeEverywhere(opt.id)}
                        aria-pressed={selected}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                          }}
                        >
                          <strong>{opt.label}</strong>
                          <span className="pill-badge">{opt.badge}</span>
                        </div>
                        <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                          {opt.shortDescription}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Photo Mode Round Length (3 or 5) */}
              <div className="form-group">
                <span className="form-label">
                  3. Signature Photo Mode Session Length (3 or 5 Difficult Images per Round)
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  {[3, 5].map((len) => {
                    const active = (userState.photoModeConfig?.roundLength || 3) === len;
                    return (
                      <button
                        key={len}
                        type="button"
                        className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePhotoModeRoundLengthChange(len)}
                        aria-pressed={active}
                      >
                        {len} Images per Round {active ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Optional Estimates */}
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                      4. Optional Cigarette &amp; Cash Savings Tracker
                    </h3>
                    <p className="form-hint" style={{ margin: '0.2rem 0 0 0' }}>
                      Optional: Enter how many cigarettes you smoked per day and pack cost.
                    </p>
                  </div>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(userState.estimateSettings?.enabled)}
                      onChange={(e) =>
                        setUserState((prev) => ({
                          ...prev,
                          estimateSettings: {
                            ...prev.estimateSettings,
                            enabled: e.target.checked
                          }
                        }))
                      }
                    />
                    Enable Cash &amp; Cigarette Estimates
                  </label>
                </div>

                {userState.estimateSettings?.enabled && (
                  <div className="grid-3" style={{ marginTop: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="onb-cigs-day" className="form-label">
                        Est. Cigarettes / Day
                      </label>
                      <input
                        id="onb-cigs-day"
                        type="number"
                        min="0"
                        max="200"
                        step="1"
                        placeholder="e.g. 20"
                        className="form-input"
                        value={userState.estimateSettings.cigarettesPerDay}
                        onChange={(e) =>
                          setUserState((prev) => ({
                            ...prev,
                            estimateSettings: {
                              ...prev.estimateSettings,
                              cigarettesPerDay: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="onb-cost-pack" className="form-label">
                        Cost per Pack USD ($)
                      </label>
                      <input
                        id="onb-cost-pack"
                        type="number"
                        min="0"
                        max="100"
                        step="0.25"
                        placeholder="e.g. 10.50"
                        className="form-input"
                        value={userState.estimateSettings.costPerPack}
                        onChange={(e) =>
                          setUserState((prev) => ({
                            ...prev,
                            estimateSettings: {
                              ...prev.estimateSettings,
                              costPerPack: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="onb-pack-size" className="form-label">
                        Cigarettes per Pack
                      </label>
                      <input
                        id="onb-pack-size"
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        className="form-input"
                        value={userState.estimateSettings.cigarettesPerPack}
                        onChange={(e) =>
                          setUserState((prev) => ({
                            ...prev,
                            estimateSettings: {
                              ...prev.estimateSettings,
                              cigarettesPerPack: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Motivations */}
              <div className="form-group">
                <span className="form-label">5. Why Are You Quitting? (Tap Any)</span>
                <div className="grid-3" style={{ marginTop: '0.4rem' }}>
                  {MOTIVATION_REASONS.map((reason) => {
                    const active = (userState.selectedMotivations || []).includes(reason.id);
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        className={`option-card ${active ? 'selected' : ''}`}
                        onClick={() => handleToggleMotivation(reason.id)}
                        aria-pressed={active}
                      >
                        <strong>
                          {active ? '✓ ' : ''}
                          {reason.label}
                        </strong>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {reason.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={20} /> Save Setup &amp; Open Today Dashboard →
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setUserState((prev) => ({ ...prev, onboardingCompleted: true }));
                    handleOpenPhotoMode();
                  }}
                >
                  <ImageIcon size={20} /> Launch Signature Photo Mode Now →
                </button>
              </div>
            </form>
          </section>
        )}

        {/* =====================================================================
            SCREEN 2: TODAY DASHBOARD (WITH SIGNATURE PHOTO MODE LAUNCHER)
           ===================================================================== */}
        {activeScreen === 'today' && (
          <>
            {/* Signature Feature Highlight Card on Today Screen */}
            <section className="card card-shock" aria-labelledby="today-photomode-cta-heading">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <span className="pill-badge warning-pill">
                    ★ SIGNATURE FEATURE • PHOTO MODE
                  </span>
                  <h2
                    id="today-photomode-cta-heading"
                    className="section-title"
                    style={{ marginTop: '0.45rem' }}
                  >
                    Guided Photo Mode: Reality Check, Calm &amp; Your Reason to Quit
                  </h2>
                  <p className="section-subtitle" style={{ marginBottom: '0.5rem' }}>
                    Walk through a controlled round of <strong>3 or 5 difficult images</strong> (real
                    cleared pathology of lungs, throat, lips, gums &amp; arteries, or gentle diagrams),
                    followed by a <strong>calming encouragement card</strong> and your{' '}
                    <strong>personal reason to quit</strong>. Never autoplays—you are always in control.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleOpenPhotoMode}
                  >
                    <PlayCircle size={20} /> Start Photo Mode Session (
                    {userState.photoModeConfig?.roundLength || 3} Images / Round) →
                  </button>
                </div>
              </div>

              {/* Quick Organ Jump Chips right on Today */}
              <div style={{ marginTop: '0.75rem' }}>
                <span className="form-hint" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Or jump directly to a specific organ in Photo Mode:
                </span>
                <div className="organ-filter-row" style={{ marginBottom: 0 }}>
                  {ORGAN_SHORTCUTS.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      className="organ-chip"
                      onClick={() => {
                        handleJumpToOrganInPhotoMode(org.id);
                        setActiveScreen('images');
                      }}
                    >
                      {org.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* MAIN ACTION ON TODAY SCREEN — DAILY SMOKE-FREE CHECK-IN */}
            <section className="card card-hero" aria-labelledby="today-hero-heading">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <span className="pill-badge">Today • {todayISO}</span>
                  <h2 id="today-hero-heading" className="section-title" style={{ marginTop: '0.4rem' }}>
                    {progress.isFutureQuitDate
                      ? `Countdown to Quit Date: ${progress.daysUntilQuitDate} Day${
                          progress.daysUntilQuitDate === 1 ? '' : 's'
                        }`
                      : `${progress.effectiveSmokeFreeDays} Smoke-Free Day${
                          progress.effectiveSmokeFreeDays === 1 ? '' : 's'
                        } Saved!`}
                  </h2>
                  <p className="section-subtitle" style={{ marginBottom: 0 }}>
                    Quit Date: <strong>{progress.quitDateISO}</strong> • Visual Intensity:{' '}
                    <strong>
                      {
                        VISUAL_INTENSITY_OPTIONS.find(
                          (o) => o.id === normalizeVisualIntensity(userState.visualIntensity)
                        )?.label
                      }
                    </strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleMarkTodaySmokeFree}
                    aria-label="Primary Action: Mark Today Smoke-Free"
                  >
                    <CheckCircle2 size={20} />
                    {progress.isTodayMarkedSmokeFree
                      ? 'Today Marked Smoke-Free ✓'
                      : '✓ Mark Today Smoke-Free!'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-warm"
                    onClick={() => setShowSetbackFlow((prev) => !prev)}
                  >
                    <Heart size={18} /> I Smoked (Log Kindly)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCravingTimerSeconds(300);
                      showTemporaryStatus('5-Minute Craving Clock started! Outlast the urge.');
                    }}
                  >
                    <Clock size={18} />
                    {cravingTimerSeconds > 0
                      ? `Craving Clock: ${Math.floor(cravingTimerSeconds / 60)}:${String(
                          cravingTimerSeconds % 60
                        ).padStart(2, '0')}`
                      : 'Start 5-Min Craving Clock'}
                  </button>
                </div>
              </div>

              {/* Compassionate Setback Drawer */}
              {showSetbackFlow && (
                <div
                  className="card card-warning"
                  style={{ marginTop: '1rem' }}
                  role="region"
                  aria-label="Compassionate Setback Support"
                >
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>
                    Slipping Up Doesn’t Erase Your Past Smoke-Free Days
                  </h3>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem' }}>
                    Don’t let one cigarette trick you into giving up. CigFree™{' '}
                    <strong>never erases</strong> the smoke-free days or milestones you already earned.
                  </p>
                  <div className="form-group">
                    <label htmlFor="setback-note-input" className="form-label">
                      Optional Note (what triggered the craving?):
                    </label>
                    <input
                      id="setback-note-input"
                      type="text"
                      className="form-input"
                      placeholder="e.g., Stressful afternoon (stored 100% locally)"
                      value={setbackNote}
                      onChange={(e) => setSetbackNote(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSetbackChoice('log_and_keep_date')}
                    >
                      Log Today Honestly &amp; Keep My Quit Date ({userState.quitDateISO})
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleSetbackChoice('reset_quit_date_keep_history')}
                    >
                      Reset Quit Date to Today (Keep Past Smoke-Free Days Saved)
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowSetbackFlow(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {setbackResultMessage && (
                <div className="card" style={{ marginTop: '1rem' }} role="status">
                  <strong>{setbackResultMessage.headline}</strong>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.92rem' }}>
                    {setbackResultMessage.message} ({setbackResultMessage.preservedSmokeFreeDays}{' '}
                    smoke-free day{setbackResultMessage.preservedSmokeFreeDays === 1 ? '' : 's'} preserved).
                  </p>
                </div>
              )}
            </section>

            {/* SCOREBOARD & OPTIONAL SAVINGS ESTIMATES */}
            <section className="card" aria-labelledby="progress-stats-heading">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                <h3 id="progress-stats-heading" className="section-title" style={{ margin: 0 }}>
                  Your Scoreboard &amp; Optional Estimates
                </h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '40px', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  onClick={() => setShowFormulaDetails((prev) => !prev)}
                >
                  <Info size={16} />{' '}
                  {showFormulaDetails ? 'Hide Calculation Formula' : 'How Estimates Are Calculated'}
                </button>
              </div>

              <div className="grid-2">
                <div className="stat-box">
                  <span className="stat-label">Smoke-Free Days Preserved</span>
                  <span className="stat-value">{progress.effectiveSmokeFreeDays}</span>
                  <span className="form-hint">
                    Days since quit date ({progress.daysSinceQuitDate}) • Calendar logs (
                    {progress.smokeFreeDaysCount})
                  </span>
                </div>

                <div className="stat-box">
                  <span className="stat-label">Milestones Unlocked</span>
                  <span className="stat-value">
                    {milestoneReport.achievedCount} / {milestoneReport.totalCount}
                  </span>
                  <span className="form-hint">
                    {milestoneReport.nextMilestone
                      ? `Next: ${milestoneReport.nextMilestone.title} (${milestoneReport.nextMilestone.daysRemaining} day${
                          milestoneReport.nextMilestone.daysRemaining === 1 ? '' : 's'
                        } to go)`
                      : 'All 8 major milestones unlocked!'}
                  </span>
                </div>

                <div className="stat-box">
                  <span className="stat-label">
                    Est. Cigarettes Never Smoked <span className="pill-badge">Estimate</span>
                  </span>
                  <span className="stat-value">
                    {estimates.hasCigaretteEstimate
                      ? estimates.estimatedCigarettesNotSmoked.toLocaleString()
                      : 'Optional'}
                  </span>
                  <span className="form-hint">
                    {estimates.hasCigaretteEstimate
                      ? `Approx. ${estimates.estimatedPacksNotSmoked} packs avoided`
                      : 'Turn on optional estimates in Quick Setup or Settings'}
                  </span>
                </div>

                <div className="stat-box">
                  <span className="stat-label">
                    Est. Cash Saved <span className="pill-badge">Estimate</span>
                  </span>
                  <span className="stat-value">
                    {estimates.hasMoneyEstimate
                      ? `$${estimates.estimatedMoneySaved.toFixed(2)}`
                      : 'Optional'}
                  </span>
                  <span className="form-hint">
                    {estimates.hasMoneyEstimate
                      ? `Est. $${estimates.projectedMonthlySavings.toFixed(2)}/mo • $${estimates.projectedYearlySavings.toFixed(2)}/yr`
                      : 'Add optional pack cost in Quick Setup or Settings'}
                  </span>
                </div>
              </div>

              {showFormulaDetails && (
                <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-elevated)' }}>
                  <strong>Transparent Calculation Formula ({estimates.estimateLabel}):</strong>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem' }}>
                    {estimates.formulaExplanation}
                  </p>
                </div>
              )}
            </section>

            {/* CRAVING RESCUE & QUICK LINKS */}
            <section className="card" aria-labelledby="today-craving-heading">
              <h3 id="today-craving-heading" className="section-title">
                <Wind size={20} /> Craving Rescue &amp; Quick Support
              </h3>
              <p style={{ fontStyle: 'italic', margin: '0 0 0.85rem 0', color: 'var(--text-secondary)' }}>
                “{DIFFICULT_DAY_AFFIRMATIONS[activeAffirmationIdx % DIFFICULT_DAY_AFFIRMATIONS.length]}”
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveAffirmationIdx((prev) => prev + 1)}
                >
                  <RefreshCw size={16} /> Next Supportive Message
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveScreen('benefits')}
                >
                  Open Benefits &amp; 5-Min Craving Toolkit
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveScreen('help')}
                >
                  <PhoneCall size={16} /> Talk to a Free Quitline Counselor
                </button>
              </div>
            </section>
          </>
        )}

        {/* =====================================================================
            SCREEN 4: BENEFITS & ENCOURAGEMENT
           ===================================================================== */}
        {activeScreen === 'benefits' && (
          <>
            <section className="card" aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="section-title">
                <Heart size={22} /> Quitting Benefits &amp; Trusted Public-Health Sources
              </h2>
              <p className="section-subtitle">
                Short, readable educational summaries grounded in public-health guidance (CDC, WHO, U.S.
                Surgeon General, NCI). Individual health timelines vary and outcomes are never guaranteed.
              </p>

              <div className="card card-warning" style={{ marginBottom: '1rem', fontSize: '0.88rem' }}>
                <strong>Pre-Release Clinical Verification Notice:</strong>{' '}
                {LEGAL_AND_PRICING_CONFIG.medicalDisclaimer.preReleaseAuditBanner}
              </div>

              <div className="grid-2">
                {BENEFIT_CARDS.map((card) => (
                  <article
                    key={card.id}
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.35rem'
                      }}
                    >
                      <span className="pill-badge price-pill">{card.category}</span>
                      <span className="pill-badge">Educational Summary</span>
                    </div>
                    <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.08rem' }}>{card.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.93rem' }}>{card.summary}</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <strong>Context:</strong> {card.timeframeNote}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Source Citation:</strong> {card.sourceCitation}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Personal Motivations Selector & Custom Reasons */}
            <section className="card" aria-labelledby="personal-motivations-heading">
              <h3 id="personal-motivations-heading" className="section-title">
                <Sparkles size={20} /> Your Personal Reasons to Stay CigFree
              </h3>
              <div className="grid-3" style={{ marginBottom: '1rem' }}>
                {MOTIVATION_REASONS.map((reason) => {
                  const selected = (userState.selectedMotivations || []).includes(reason.id);
                  return (
                    <button
                      key={reason.id}
                      type="button"
                      className={`option-card ${selected ? 'selected' : ''}`}
                      onClick={() => handleToggleMotivation(reason.id)}
                      aria-pressed={selected}
                    >
                      <strong>
                        {selected ? '✓ ' : ''}
                        {reason.label}
                      </strong>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        {reason.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {(userState.customMotivations || []).length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Your Custom Motivations:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                    {userState.customMotivations.map((item, idx) => (
                      <span key={idx} className="pill-badge price-pill">
                        ★ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleAddCustomMotivation}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: '1 1 240px' }}
                  placeholder="Add your own reason (e.g., Protecting my lungs and voice box)"
                  value={customMotivationInput}
                  onChange={(e) => setCustomMotivationInput(e.target.value)}
                  aria-label="Add a custom personal motivation"
                />
                <button type="submit" className="btn btn-primary">
                  Add My Motivation
                </button>
              </form>
            </section>

            {/* Cravings & Difficult Days Practical Options */}
            <section className="card" aria-labelledby="craving-toolkit-heading">
              <h3 id="craving-toolkit-heading" className="section-title">
                <Clock size={20} /> 5-Minute Craving Busters
              </h3>
              <div className="grid-2">
                {CRAVING_SUPPORT_TOOLKIT.map((tool) => (
                  <div key={tool.id} className="card" style={{ background: 'var(--bg-elevated)' }}>
                    <h4 style={{ margin: '0 0 0.35rem 0' }}>{tool.title}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{tool.description}</p>
                    <p
                      style={{
                        margin: '0 0 0.75rem 0',
                        fontSize: '0.84rem',
                        color: 'var(--brand-primary)',
                        fontWeight: 600
                      }}
                    >
                      {tool.encouragement}
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        if (tool.id === 'tool-delay') {
                          setCravingTimerSeconds(300);
                        } else if (tool.id === 'tool-connect') {
                          setActiveScreen('help');
                        }
                        setUserState((prev) => ({
                          ...prev,
                          cravingStrategiesUsed: (prev.cravingStrategiesUsed || 0) + 1
                        }));
                        showTemporaryStatus(`Activated: ${tool.title}`);
                      }}
                    >
                      {tool.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* =====================================================================
            SCREEN 5: QUIT CALENDAR & PROGRESS
           ===================================================================== */}
        {activeScreen === 'calendar' && (
          <>
            <section className="card" aria-labelledby="calendar-heading">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <h2 id="calendar-heading" className="section-title" style={{ margin: 0 }}>
                    <CalendarIcon size={22} /> Smoke-Free Quit Calendar
                  </h2>
                  <p className="section-subtitle" style={{ margin: '0.2rem 0 0 0' }}>
                    Tap any date to mark a smoke-free day or kindly log a setback. Past progress is always
                    preserved.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCalendarMonthOffset((p) => p - 1)}
                    aria-label="Previous Month"
                  >
                    ← Prev
                  </button>
                  <strong style={{ minWidth: '140px', textAlign: 'center' }}>
                    {calendarDaysData.monthLabel}
                  </strong>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCalendarMonthOffset((p) => p + 1)}
                    aria-label="Next Month"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="calendar-grid" role="grid" aria-label={calendarDaysData.monthLabel}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="calendar-weekday" role="columnheader">
                    {d}
                  </div>
                ))}
                {calendarDaysData.cells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} aria-hidden="true" />;
                  }
                  const status = cell.log?.status || '';
                  const isSelected = selectedCalendarDate === cell.iso;
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      className={`calendar-day-btn ${
                        status === 'smoke_free'
                          ? 'smoke-free'
                          : status === 'setback'
                          ? 'setback'
                          : ''
                      } ${isSelected ? 'selected-day' : ''}`}
                      onClick={() => {
                        setSelectedCalendarDate(cell.iso);
                        setCalendarDayNote(cell.log?.note || '');
                      }}
                      aria-label={`${cell.iso}: ${
                        status === 'smoke_free'
                          ? 'Smoke-free day'
                          : status === 'setback'
                          ? 'Setback logged'
                          : 'Not marked'
                      }`}
                    >
                      <span>{cell.dayNumber}</span>
                      <span style={{ fontSize: '0.7rem' }}>
                        {status === 'smoke_free' ? '✓ Free' : status === 'setback' ? '• Slip' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Editor */}
              <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.02rem' }}>
                  Update Date: {selectedCalendarDate}
                </h3>
                <div className="form-group">
                  <label htmlFor="calendar-day-note" className="form-label">
                    Optional Note for {selectedCalendarDate}:
                  </label>
                  <input
                    id="calendar-day-note"
                    type="text"
                    className="form-input"
                    placeholder="How did this day go? (Saved locally)"
                    value={calendarDayNote}
                    onChange={(e) => setCalendarDayNote(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setUserState((prev) =>
                        recordCalendarDayStatus(
                          prev,
                          selectedCalendarDate,
                          'smoke_free',
                          calendarDayNote
                        )
                      );
                      showTemporaryStatus(`Marked ${selectedCalendarDate} as Smoke-Free.`);
                    }}
                  >
                    <CheckCircle2 size={18} /> Mark Smoke-Free
                  </button>
                  <button
                    type="button"
                    className="btn btn-warm"
                    onClick={() => {
                      setUserState((prev) =>
                        recordCalendarDayStatus(prev, selectedCalendarDate, 'setback', calendarDayNote)
                      );
                      showTemporaryStatus(
                        `Logged ${selectedCalendarDate} kindly. All past smoke-free days remain saved.`
                      );
                    }}
                  >
                    Log a Setback Kindly
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setUserState((prev) =>
                        recordCalendarDayStatus(prev, selectedCalendarDate, 'clear', '')
                      );
                      setCalendarDayNote('');
                      showTemporaryStatus(`Cleared status for ${selectedCalendarDate}.`);
                    }}
                  >
                    Clear Date Entry
                  </button>
                </div>
              </div>
            </section>

            {/* Judgment-Free Quit Date Editor */}
            <section className="card" aria-labelledby="edit-quit-date-heading">
              <h3 id="edit-quit-date-heading" className="section-title">
                Edit or Reset Your Quit Date Without Judgment
              </h3>
              <p className="section-subtitle">
                Changing your quit date updates your start reference while preserving every smoke-free day
                and milestone you have already logged on your calendar.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="date"
                  className="form-input"
                  value={quitDateEditInput}
                  onChange={(e) => setQuitDateEditInput(normalizeDateISO(e.target.value))}
                  aria-label="New quit date"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setUserState((prev) =>
                      updateQuitDateWithoutJudgment(prev, quitDateEditInput, todayISO)
                    );
                    showTemporaryStatus(
                      `Updated quit date to ${quitDateEditInput}. Your past smoke-free days remain preserved.`
                    );
                  }}
                >
                  Save Quit Date
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setQuitDateEditInput(todayISO);
                    setUserState((prev) => updateQuitDateWithoutJudgment(prev, todayISO, todayISO));
                    showTemporaryStatus(
                      `Quit date reset to Today (${todayISO}). Past smoke-free days remain preserved.`
                    );
                  }}
                >
                  Reset to Today ({todayISO})
                </button>
              </div>
            </section>
          </>
        )}

        {/* =====================================================================
            SCREEN 6: MILESTONES & KUDOS
           ===================================================================== */}
        {activeScreen === 'milestones' && (
          <section className="card" aria-labelledby="milestones-heading">
            <h2 id="milestones-heading" className="section-title">
              <Award size={22} /> Milestones &amp; Kudos
            </h2>
            <p className="section-subtitle">
              Celebrating 1 day, 3 days, 1 week, 1 month, and beyond. Once you unlock a milestone,
              CigFree™ preserves it even if you later have a setback. Sharing is always strictly opt-in.
            </p>

            {optInShareMilestone && (
              <div
                className="card card-hero"
                style={{ marginBottom: '1rem' }}
                role="region"
                aria-label="Opt-in Shareable Milestone Card"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <span className="pill-badge price-pill">Opt-In Shareable Card Preview</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ minHeight: '36px', padding: '0.25rem 0.65rem' }}
                    onClick={() => setOptInShareMilestone(null)}
                  >
                    Close Preview
                  </button>
                </div>
                <h3 style={{ margin: '0.5rem 0 0.25rem 0' }}>{optInShareMilestone.title}</h3>
                <p style={{ margin: '0 0 0.75rem 0' }}>{optInShareMilestone.shareText}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(optInShareMilestone.shareText);
                      showTemporaryStatus(
                        'Copied milestone message to clipboard (only shared if you paste it).'
                      );
                    } else {
                      showTemporaryStatus('Milestone card ready for you to copy.');
                    }
                  }}
                >
                  <Share2 size={18} /> Copy Milestone Text to Clipboard
                </button>
              </div>
            )}

            <div className="grid-2">
              {milestoneReport.milestones.map((m) => (
                <div
                  key={m.id}
                  className="card"
                  style={{
                    borderColor: m.achieved ? 'var(--brand-primary)' : 'var(--border-color)',
                    background: m.achieved ? 'var(--status-success-bg)' : 'var(--bg-surface)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span className="pill-badge">
                      {m.achieved ? '★ Unlocked Milestone' : `${m.progressPercent}% Complete`}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                      {m.daysRequired} Day{m.daysRequired === 1 ? '' : 's'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0.5rem 0 0.3rem 0' }}>{m.title}</h3>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem' }}>{m.kudosMessage}</p>
                  {m.achieved ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setOptInShareMilestone(m)}
                    >
                      <Share2 size={16} /> Preview Opt-In Share Card
                    </button>
                  ) : (
                    <span className="form-hint">
                      {m.daysRemaining} more smoke-free day{m.daysRemaining === 1 ? '' : 's'} to unlock
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================================
            SCREEN 7: SETTINGS, REMINDERS, ACCESSIBILITY, PRIVACY & LEGAL
           ===================================================================== */}
        {activeScreen === 'settings' && (
          <>
            {/* Personalized Reminders Section */}
            {renderPersonalizedRemindersPanel()}

            {/* Appearance & Accessibility */}
            <section className="card" aria-labelledby="settings-appearance-heading">
              <h2 id="settings-appearance-heading" className="section-title">
                <SettingsIcon size={22} /> Appearance, Accessibility &amp; Visual Intensity
              </h2>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="settings-theme-mode" className="form-label">
                    Color Theme (Light, Dark, or System Default)
                  </label>
                  <select
                    id="settings-theme-mode"
                    className="form-input"
                    value={userState.themeMode}
                    onChange={(e) =>
                      setUserState((prev) => ({ ...prev, themeMode: e.target.value }))
                    }
                  >
                    <option value="system">
                      System Default ({systemPrefersDark ? 'Dark' : 'Light'})
                    </option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="settings-text-scale" className="form-label">
                    Scalable Text Size
                  </label>
                  <select
                    id="settings-text-scale"
                    className="form-input"
                    value={userState.textScale}
                    onChange={(e) =>
                      setUserState((prev) => ({ ...prev, textScale: e.target.value }))
                    }
                  >
                    <option value="standard">Standard (100%)</option>
                    <option value="large">Large (115%)</option>
                    <option value="xlarge">Extra Large (130%)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="settings-visual-intensity" className="form-label">
                    Photo Mode Image Intensity (“Direct,” “Gentle,” or “No graphic images”)
                  </label>
                  <select
                    id="settings-visual-intensity"
                    className="form-input"
                    value={normalizeVisualIntensity(userState.visualIntensity)}
                    onChange={(e) => handleIntensityChangeEverywhere(e.target.value)}
                  >
                    {VISUAL_INTENSITY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} — {opt.badge}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ justifyContent: 'center', gap: '0.65rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(userState.highContrast)}
                      onChange={(e) =>
                        setUserState((prev) => ({ ...prev, highContrast: e.target.checked }))
                      }
                    />
                    Strong / High-Contrast Borders &amp; Text
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(userState.reducedMotion)}
                      onChange={(e) =>
                        setUserState((prev) => ({ ...prev, reducedMotion: e.target.checked }))
                      }
                    />
                    Reduced Motion (Disable Animations &amp; Transitions)
                  </label>
                </div>
              </div>
            </section>

            {/* Optional Estimate Inputs */}
            <section className="card" aria-labelledby="settings-estimates-heading">
              <h3 id="settings-estimates-heading" className="section-title">
                <DollarSign size={20} /> Optional Cigarette &amp; Cost Savings Settings
              </h3>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  marginBottom: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(userState.estimateSettings?.enabled)}
                  onChange={(e) =>
                    setUserState((prev) => ({
                      ...prev,
                      estimateSettings: {
                        ...prev.estimateSettings,
                        enabled: e.target.checked
                      }
                    }))
                  }
                />
                Show Optional Cigarettes Avoided &amp; Money Saved Estimates
              </label>

              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="set-cigs-day" className="form-label">
                    Est. Cigarettes / Day
                  </label>
                  <input
                    id="set-cigs-day"
                    type="number"
                    min="0"
                    max="200"
                    className="form-input"
                    value={userState.estimateSettings?.cigarettesPerDay || ''}
                    onChange={(e) =>
                      setUserState((prev) => ({
                        ...prev,
                        estimateSettings: {
                          ...prev.estimateSettings,
                          cigarettesPerDay: e.target.value
                        }
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="set-cost-pack" className="form-label">
                    Cost per Pack (USD)
                  </label>
                  <input
                    id="set-cost-pack"
                    type="number"
                    min="0"
                    step="0.25"
                    className="form-input"
                    value={userState.estimateSettings?.costPerPack || ''}
                    onChange={(e) =>
                      setUserState((prev) => ({
                        ...prev,
                        estimateSettings: {
                          ...prev.estimateSettings,
                          costPerPack: e.target.value
                        }
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="set-pack-size" className="form-label">
                    Cigarettes per Pack
                  </label>
                  <input
                    id="set-pack-size"
                    type="number"
                    min="1"
                    max="100"
                    className="form-input"
                    value={userState.estimateSettings?.cigarettesPerPack || 20}
                    onChange={(e) =>
                      setUserState((prev) => ({
                        ...prev,
                        estimateSettings: {
                          ...prev.estimateSettings,
                          cigarettesPerPack: e.target.value
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </section>

            {/* Local Privacy, Export & Delete Controls */}
            <section className="card" aria-labelledby="settings-privacy-heading">
              <h3 id="settings-privacy-heading" className="section-title">
                <ShieldCheck size={20} /> Privacy, Local Data Export &amp; Deletion
              </h3>
              <p className="section-subtitle">
                Your progress is stored 100% locally on your device. CigFree™ includes no ads, no tracking,
                and no cloud account requirements.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button type="button" className="btn btn-primary" onClick={handleExportData}>
                  <Download size={18} /> Export My Data (JSON)
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 size={18} /> Delete All Local Data
                </button>
              </div>

              {exportedJSONPreview && (
                <div style={{ marginTop: '1rem' }}>
                  <label htmlFor="export-json-textarea" className="form-label">
                    Portable JSON Data Export:
                  </label>
                  <textarea
                    id="export-json-textarea"
                    readOnly
                    rows={6}
                    className="form-input"
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem' }}
                    value={exportedJSONPreview}
                  />
                </div>
              )}

              {confirmDeleteOpen && (
                <div
                  className="card card-warning"
                  style={{ marginTop: '1rem' }}
                  role="alertdialog"
                  aria-labelledby="delete-confirm-title"
                >
                  <h4 id="delete-confirm-title" style={{ margin: '0 0 0.4rem 0' }}>
                    Confirm Permanent Deletion of Local Data
                  </h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
                    This will permanently erase your quit date, calendar logs, milestones, and settings from
                    this device. This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleConfirmDeleteAllData}
                    >
                      Yes, Permanently Delete My Data
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setConfirmDeleteOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Store Pricing, Trademark & Legal Disclosures (The Primo IT Tech LLC) */}
            <section className="card" aria-labelledby="settings-legal-heading">
              <h3 id="settings-legal-heading" className="section-title">
                <BookOpen size={20} /> Legal, Brand Clearance &amp; Store Pricing Notice (
                {LEGAL_AND_PRICING_CONFIG.companyName})
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.2rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}
              >
                <li>
                  <strong>Publisher &amp; Owner:</strong> {LEGAL_AND_PRICING_CONFIG.legalEntity} (Managing
                  Member: {LEGAL_AND_PRICING_CONFIG.managingMember}, {LEGAL_AND_PRICING_CONFIG.headquarters}
                  ).
                </li>
                <li>
                  <strong>Trademark &amp; Brand Safety:</strong>{' '}
                  {LEGAL_AND_PRICING_CONFIG.trademarkSafetyNotice}
                </li>
                <li>
                  <strong>Store Listing &amp; $0.99 Purchase Flow:</strong>{' '}
                  {LEGAL_AND_PRICING_CONFIG.pricing.storeListingSummary}
                </li>
                <li>
                  <strong>App-Store Fees &amp; Taxes Disclaimer:</strong>{' '}
                  {LEGAL_AND_PRICING_CONFIG.pricing.feeAndTaxDisclaimer}
                </li>
                <li>
                  <strong>Medical Disclaimer:</strong> {LEGAL_AND_PRICING_CONFIG.medicalDisclaimer.fullNotice}
                </li>
              </ul>

              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLicenseLedgerModal((prev) => !prev)}
                >
                  <FileCheck2 size={16} />{' '}
                  {showLicenseLedgerModal
                    ? 'Hide Documented Image License Ledger'
                    : 'View / Record Documented Image License Ledger'}
                </button>
              </div>

              {showLicenseLedgerModal && (
                <div
                  className="card"
                  style={{ marginTop: '1rem' }}
                  role="region"
                  aria-labelledby="license-ledger-heading"
                >
                  <h4 id="license-ledger-heading" style={{ margin: '0 0 0.5rem 0' }}>
                    Documented Image Source, License &amp; Consent Ledger
                  </h4>
                  <div className="grid-2" style={{ marginBottom: '1rem' }}>
                    {allImageCards.map((card) => (
                      <div
                        key={card.id}
                        className="card"
                        style={{ background: 'var(--bg-elevated)', fontSize: '0.82rem' }}
                      >
                        <strong>{card.title}</strong>
                        <div style={{ marginTop: '0.3rem' }}>
                          <strong>Source:</strong> {card.licenseRecord?.source}
                        </div>
                        <div>
                          <strong>Creator:</strong> {card.licenseRecord?.creator}
                        </div>
                        <div>
                          <strong>License:</strong> {card.licenseRecord?.licenseStatus}
                        </div>
                        <div>
                          <strong>Consent / Specimen Status:</strong> {card.licenseRecord?.consentStatus}
                        </div>
                        <div>
                          <strong>Permitted Uses:</strong> {card.licenseRecord?.permittedUses}
                        </div>
                        <div>
                          <strong>Attribution:</strong> {card.licenseRecord?.requiredAttribution}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAddCustomImageLicense}
                    className="card"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <h4 style={{ margin: '0 0 0.75rem 0' }}>Record an Additional Cleared Visual Asset</h4>
                    {licenseFormError && (
                      <p style={{ color: '#9B2C2C', fontWeight: 700 }} role="alert">
                        {licenseFormError}
                      </p>
                    )}
                    <div className="grid-2">
                      <div className="form-group">
                        <label htmlFor="lic-title" className="form-label">
                          Image Title *
                        </label>
                        <input
                          id="lic-title"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Healthy Alveoli Specimen"
                          value={newLicenseForm.title}
                          onChange={(e) =>
                            setNewLicenseForm((p) => ({ ...p, title: e.target.value }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lic-source" className="form-label">
                          Documented Source *
                        </label>
                        <input
                          id="lic-source"
                          type="text"
                          className="form-input"
                          placeholder="e.g. CDC Public Health Image Library"
                          value={newLicenseForm.source}
                          onChange={(e) =>
                            setNewLicenseForm((p) => ({ ...p, source: e.target.value }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lic-status" className="form-label">
                          License / Permission Status *
                        </label>
                        <input
                          id="lic-status"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Public Domain / Written License"
                          value={newLicenseForm.licenseStatus}
                          onChange={(e) =>
                            setNewLicenseForm((p) => ({ ...p, licenseStatus: e.target.value }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lic-consent" className="form-label">
                          Subject Informed Consent Status
                        </label>
                        <input
                          id="lic-consent"
                          type="text"
                          className="form-input"
                          placeholder="e.g. De-identified pathology specimen / Signed release"
                          value={newLicenseForm.consentStatus}
                          onChange={(e) =>
                            setNewLicenseForm((p) => ({ ...p, consentStatus: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save License Record to Ledger
                    </button>
                  </form>
                </div>
              )}
            </section>
          </>
        )}

        {/* =====================================================================
            SCREEN 8: GET HELP (REPUTABLE QUIT-SMOKING SUPPORT)
           ===================================================================== */}
        {activeScreen === 'help' && (
          <section className="card" aria-labelledby="get-help-heading">
            <h2 id="get-help-heading" className="section-title">
              <LifeBuoy size={22} /> Talk to a Free Quitline Counselor &amp; Get Support
            </h2>
            <p className="section-subtitle">
              Connect with reputable, evidence-based quit-smoking support organizations. CigFree™ never
              guesses or tracks your location—select your region below, or use the top bar to jump back to
              your Today dashboard at any time.
            </p>

            <div className="form-group" style={{ maxWidth: '380px' }}>
              <label htmlFor="help-region-select" className="form-label">
                Select Your Region (Manual Selection — Zero Location Tracking):
              </label>
              <select
                id="help-region-select"
                className="form-input"
                value={userState.selectedRegion || 'US'}
                onChange={(e) =>
                  setUserState((prev) => ({ ...prev, selectedRegion: e.target.value }))
                }
              >
                {REGIONAL_HELP_RESOURCES.map((reg) => (
                  <option key={reg.regionCode} value={reg.regionCode}>
                    {reg.regionName}
                  </option>
                ))}
              </select>
            </div>

            {REGIONAL_HELP_RESOURCES.filter(
              (r) => r.regionCode === (userState.selectedRegion || 'US')
            ).map((region) => (
              <div key={region.regionCode}>
                <p className="form-hint" style={{ marginBottom: '0.75rem' }}>
                  {region.privacyNote}
                </p>
                <div className="grid-2">
                  {region.services.map((svc) => (
                    <div key={svc.name} className="card" style={{ background: 'var(--bg-elevated)' }}>
                      <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>{svc.name}</h3>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{svc.description}</p>
                      <p style={{ margin: '0 0 0.65rem 0', fontWeight: 700, color: 'var(--brand-primary)' }}>
                        <PhoneCall size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {svc.phone}
                      </p>
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Visit Official Website ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="card card-warning" style={{ marginTop: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem' }}>
                <HelpCircle size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                When to Speak With a Healthcare Professional
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                CigFree™ (Clear Path) is an educational and motivational tool, not medical care. If you
                notice any sore, white/red patch, lump, hoarseness, or cough that does not heal, or if you
                want to discuss nicotine replacement therapy (NRT) or prescription cessation medications,
                please consult a licensed physician, dentist, pharmacist, or healthcare provider.
              </p>
            </div>
          </section>
        )}

        {/* Legal & Corporate Footer */}
        <footer className="legal-footer" role="contentinfo">
          <div>
            <strong>{LEGAL_AND_PRICING_CONFIG.copyrightNotice}</strong> Published by{' '}
            <strong>{LEGAL_AND_PRICING_CONFIG.legalEntity}</strong> (Managing Member:{' '}
            {LEGAL_AND_PRICING_CONFIG.managingMember}).
          </div>
          <div>
            <strong>Trademark &amp; Pricing Disclosure:</strong>{' '}
            {LEGAL_AND_PRICING_CONFIG.trademarkSafetyNotice} One-time $0.99 download via Apple App Store
            and Google Play Store; no subscriptions, no surprise IAPs, and no specific net proceeds after
            app-store fees or taxes are promised.
          </div>
          <div>
            <strong>Educational Disclaimer:</strong> {LEGAL_AND_PRICING_CONFIG.medicalDisclaimer.shortNotice}
          </div>
        </footer>
      </main>

      {/* Accessible 8-Screen Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Secondary Bottom Navigation">
        <div className="bottom-nav-inner">
          {SCREEN_TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (tab.id === 'images') {
                    handleOpenPhotoMode();
                  } else {
                    setActiveScreen(tab.id);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent size={19} aria-hidden="true" />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
