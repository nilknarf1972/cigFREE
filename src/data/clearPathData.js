/**
 * CigFree™ (Working Title: Clear Path) — Core Educational, Real-Life Pathology Ledger,
 * Official Tobacco Warnings, Benefits, Milestones & Support Data
 * © 2026 The Primo IT Tech LLC. All Rights Reserved.
 */

export const LEGAL_AND_PRICING_CONFIG = {
  appName: 'CigFree™ (Clear Path)',
  primaryBrandMark: 'CigFree™',
  workingTitle: 'Clear Path',
  codename: 'cigFREE',
  version: '1.1.0',
  companyName: 'The Primo IT Tech LLC',
  legalEntity: 'The Primo IT Tech LLC, a Florida Limited Liability Company',
  managingMember: 'Keith Franklin',
  headquarters: 'Jupiter / Palm Beach County, Florida, USA',
  copyrightNotice: '© 2026 The Primo IT Tech LLC. All Rights Reserved.',
  bundleIdIOS: 'com.primoittech.cigfree',
  packageNameAndroid: 'com.primoittech.cigfree',
  trademarkSafetyNotice:
    'Brand & Trademark Clearance Notice: Because "ClearPath" is used by third-party software and existing apps on Google Play, this application is published commercially as "CigFree™ by The Primo IT Tech LLC" (retaining "Clear Path" only as an internal descriptive working subtitle).',
  pricing: {
    priceUSD: 0.99,
    displayPrice: '$0.99',
    purchaseType: 'One-Time App Store Download',
    hasSubscriptions: false,
    hasInAppPurchases: false,
    requiresUserAccount: false,
    worksOffline: true,
    storeListingSummary:
      'One-time $0.99 download via the Apple App Store and Google Play Store. Includes the full offline app with no subscriptions, no paywalls, no ads, and no surprise in-app purchases.',
    feeAndTaxDisclaimer:
      'Price shown is $0.99 USD (or local storefront equivalent) before applicable local taxes. Platform fees, commissions, and taxes are determined by Apple App Store and Google Play Store policies; The Primo IT Tech LLC does not promise or represent any specific net amount after app-store fees or taxes.'
  },
  medicalDisclaimer: {
    shortNotice:
      'CigFree™ (Clear Path) is an educational and motivational companion, not medical care or clinical diagnosis.',
    fullNotice:
      'CigFree™ (Working Title: Clear Path) by The Primo IT Tech LLC is designed for educational and motivational support only. It is not a medical device and does not provide medical advice, clinical diagnosis, or treatment. Real clinical pathology images are sourced from verified U.S. Government Public Domain (CDC PHIL, NIH/NCI) and open-access Creative Commons medical archives to illustrate documented risks of tobacco smoking. Individual health experiences vary, and no specific health outcome or timeline is guaranteed. Always consult a qualified physician, dentist, pharmacist, or healthcare professional regarding smoking cessation or any medical condition.',
    preReleaseAuditBanner:
      'Transparency & Medical Review Notice: Real-life pathology photographs are legally cleared Public Domain (CDC/NIH/NCI) or Creative Commons clinical specimens with full attribution in the Image Ledger. Educational health timelines are general public-health summaries and require final sign-off by a qualified medical reviewer prior to clinical claim release.'
  }
};

export const OFFICIAL_SMOKING_WARNINGS = [
  {
    id: 'warn-cancer',
    badge: 'SURGEON GENERAL & WHO WARNING',
    headline: 'Cigarette Smoke Causes Lung, Throat, Mouth, Lip & Esophageal Cancer',
    detail:
      'Tobacco smoke contains more than 7,000 chemicals, including at least 70 known human carcinogens (such as benzene, formaldehyde, arsenic, nitrosamines, and radioactive polonium-210).'
  },
  {
    id: 'warn-gums-lips',
    badge: 'ORAL & DENTAL WARNING',
    headline: 'Smoking Destroys Gum Tissue, Stains Teeth & Causes Oral Cancer',
    detail:
      'Smokers have twice the risk of severe gum disease (periodontitis), leading to receding gums, heavy tar calculus, and tooth loss, alongside elevated risks of lip and tongue carcinoma.'
  },
  {
    id: 'warn-heart-stroke',
    badge: 'CARDIOVASCULAR WARNING',
    headline: 'Smoking Clogs Arteries & Causes Heart Attacks and Strokes',
    detail:
      'Carbon monoxide and nicotine damage the inner walls of blood vessels, accelerating sticky plaque buildup (atherosclerosis) and blood clots.'
  },
  {
    id: 'warn-emphysema',
    badge: 'PULMONARY WARNING',
    headline: 'Smoking Permanently Destroys Delicate Lung Air Sacs (Emphysema)',
    detail:
      'Toxins in smoke rupture microscopic alveolar walls, leaving blackened, tar-stained holes in the lungs that cannot transfer oxygen efficiently.'
  }
];

export const VISUAL_INTENSITY_OPTIONS = [
  {
    id: 'direct',
    label: 'Direct',
    badge: 'Real Medical Photos + Warnings',
    shortDescription:
      'Shows real-life cleared medical photos of smoker lungs, throat, lips, gums, tongue & arteries (with advance content warning & Skip button).',
    details:
      'Includes real Public Domain / Creative Commons clinical pathology photographs of smoking damage alongside educational facts. Every graphic image includes a content warning and instant Skip button.'
  },
  {
    id: 'gentle',
    label: 'Gentle',
    badge: 'Educational Diagrams',
    shortDescription:
      'Hides real clinical pathology photos and shows calm educational vector illustrations.',
    details:
      'Shows supportive diagrams of lung renewal, oxygen transport, and positive habits. Automatically hides graphic real-life pathology photographs.'
  },
  {
    id: 'no_graphic',
    label: 'No graphic images',
    badge: 'Uplifting Only',
    shortDescription:
      'Strictly hides all real clinical pathology photos and intense health-impact imagery.',
    details:
      'Displays only peaceful restorative diagrams and milestone encouragement. You can change your choice in Settings at any time.'
  }
];

export const MOTIVATION_REASONS = [
  {
    id: 'health',
    label: 'Avoid Cancer & Organ Damage',
    iconName: 'Heart',
    description: 'Protecting my lungs, throat, lips, mouth, and heart from 7,000 smoke chemicals.'
  },
  {
    id: 'breathing',
    label: 'Breathe Without Wheezing',
    iconName: 'Wind',
    description: 'Taking deeper, cleaner breaths on stairs, walks, and mornings.'
  },
  {
    id: 'money',
    label: 'Stop Burning My Cash',
    iconName: 'DollarSign',
    description: 'Keeping thousands of dollars in my bank account instead of turning it to ash.'
  },
  {
    id: 'family',
    label: 'Be Here for Family & Loved Ones',
    iconName: 'Users',
    description: 'Staying healthy and keeping secondhand smoke away from the people and pets I love.'
  },
  {
    id: 'smell',
    label: 'Save My Teeth, Gums & Breath',
    iconName: 'Sparkles',
    description: 'Protecting my gums and enamel from black tar buildup and stale ashtray odor.'
  },
  {
    id: 'personal_goals',
    label: 'Break the Nicotine Leash',
    iconName: 'Compass',
    description: 'Taking back control of my time, energy, and daily freedom.'
  }
];

export const DEFAULT_IMAGE_JOURNEY_CARDS = [
  {
    id: 'real-lung-emphysema-cdc',
    organTag: 'LUNGS • EMPHYSEMA & BLACK TAR',
    catchyHook: 'Every Puff Paints Your Air Sacs With Black Carbon',
    title: 'Real Smoker’s Lung: Centrilobular Emphysema & Tar Anthracosis',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/lung-emphysema-cdc.jpg',
    contentWarningText:
      'Advance Content Warning: This card shows a real-life clinical pathology photograph (CDC PHIL #865) of a human lung cut open to reveal black smoke pigment (anthracosis) and destroyed emphysema air spaces. You can reveal it or skip it at any time.',
    illustrationType: 'airway-comparison-direct',
    visualCategoryBadge: 'Real Clinical Pathology Photo — Public Domain (CDC PHIL #865)',
    caption:
      'Gross pathology of centrilobular emphysema showing blackened carbon deposits and permanently ruptured air sacs (CDC / Dr. Edwin P. Ewing, Jr.).',
    screenReaderDescription:
      'Close-up gross pathology photograph of a sectioned human lung showing dark black carbon pigment deposits and hollowed-out cavities where alveolar walls were destroyed by smoking.',
    educationalMessage:
      'When you inhale cigarette smoke, sticky tar and carbon particles settle deep inside your lungs. Over time, smoke toxins trigger inflammation that ruptures the delicate elastic walls of your air sacs (emphysema), creating permanent "dirty holes" that reduce breathing capacity.',
    encouragingTakeaway:
      'Good news: The moment you stop smoking, you halt new tar buildup and stop accelerating this tissue loss!',
    citation: 'Centers for Disease Control and Prevention (CDC PHIL #865); U.S. Surgeon General Report',
    licenseRecord: {
      source: 'CDC Public Health Image Library (PHIL #865) / Wikimedia Commons (File:Centrilobular emphysema 865 lores.jpg)',
      creator: 'CDC / Dr. Edwin P. Ewing, Jr.',
      licenseStatus: 'Cleared — Public Domain (U.S. Federal Government Work, 17 U.S.C. § 105)',
      consentStatus: 'De-identified autopsy pathology specimen (no identifiable individual shown)',
      permittedUses: 'Unrestricted worldwide educational & commercial use (Public Domain)',
      requiredAttribution: 'Photo credit: CDC / Dr. Edwin P. Ewing, Jr. (PHIL #865, Public Domain).',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified U.S. Government Public Domain real pathology photograph.'
    }
  },
  {
    id: 'real-lip-cancer-scc',
    organTag: 'LIPS • SQUAMOUS CELL CANCER',
    catchyHook: 'Where the Cigarette Rests: 1,600°F Heat + Carcinogens on Your Lip',
    title: 'Real Lip Cancer: Squamous Cell Carcinoma of the Lower Lip',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/lip-cancer-clinical.jpg',
    contentWarningText:
      'Advance Content Warning: This card displays a real-life clinical dental photograph of an ulcerated squamous cell carcinoma tumor on the lower lip. You can reveal or skip this image at any time.',
    illustrationType: 'oral-tissue-direct',
    visualCategoryBadge: 'Real Clinical Photo — Cleared CC BY-SA 4.0',
    caption:
      'Clinical photograph of ulcerated squamous cell carcinoma on the lower lip vermilion border (Coronation Dental Specialty Group, CC BY-SA 4.0).',
    screenReaderDescription:
      'Close-up clinical intraoral photograph of a lower lip showing a raised, crusted, ulcerated squamous cell carcinoma lesion.',
    educationalMessage:
      'Every drag pulls concentrated hot smoke and tar directly across the delicate tissue of your lips. Tobacco use is a primary cause of squamous cell carcinoma of the lip and oral cavity, which often starts as a persistent sore or crusted patch that does not heal.',
    encouragingTakeaway:
      'Quitting tobacco dramatically lowers your risk of developing new precancerous lip and mouth lesions.',
    citation: 'National Cancer Institute (NCI) — Lip and Oral Cavity Cancer Treatment (PDQ®); CDC',
    licenseRecord: {
      source: 'Wikimedia Commons (File:Lower lip cancer.jpg)',
      creator: 'Coronation Dental Specialty Group',
      licenseStatus: 'Cleared — Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
      consentStatus: 'Cropped clinical dental pathology view (no identifiable face shown)',
      permittedUses: 'Commercial and educational reuse permitted with attribution under CC BY-SA 4.0',
      requiredAttribution: '© Coronation Dental Specialty Group, licensed under CC BY-SA 4.0 via Wikimedia Commons.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified CC BY-SA 4.0 clinical photograph with full attribution.'
    }
  },
  {
    id: 'real-gums-teeth-calculus',
    organTag: 'GUMS & TEETH • TAR & PERIODONTITIS',
    catchyHook: 'Nicotine Chokes Gum Blood Flow While Tar Cements Onto Your Teeth',
    title: 'Real Smoker’s Gums & Teeth: Heavy Tar Calculus & Gum Recession',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/gums-teeth-calculus.jpg',
    contentWarningText:
      'Advance Content Warning: This card shows a real-life close-up dental photograph of severe brown/black tar-stained calculus buildup and inflamed, receding gums. You may view or skip it at any time.',
    illustrationType: 'oral-tissue-direct',
    visualCategoryBadge: 'Real Clinical Dental Photo — Public Domain',
    caption:
      'Severe mandibular calculus deposits, dark tobacco staining, and gingival recession (Released into Public Domain by DRosenbach).',
    screenReaderDescription:
      'Close-up intraoral photograph of lower front teeth coated in thick brown-and-yellow mineralized tartar with reddened, receding gum tissue.',
    educationalMessage:
      'Smoking weakens your mouth’s ability to fight bacteria and restricts blood flow to your gums. This accelerates hardened tartar (calculus) stained dark brown by cigarette tar, destroying the bone and gum tissue that hold your teeth in place.',
    encouragingTakeaway:
      'When you quit smoking, healthy blood circulation begins returning to your gums, helping save your natural teeth!',
    citation: 'Centers for Disease Control and Prevention (CDC) — Smoking, Gum Disease, and Tooth Loss',
    licenseRecord: {
      source: 'Wikimedia Commons (File:MandibularAnteriorCalculus.JPG)',
      creator: 'DRosenbach (English Wikipedia)',
      licenseStatus: 'Cleared — Released into the Public Domain by the copyright holder (PD-self)',
      consentStatus: 'Cropped intraoral dental view (no identifiable person shown)',
      permittedUses: 'Unrestricted worldwide educational & commercial use (Public Domain)',
      requiredAttribution: 'Clinical dental photograph by DRosenbach (Public Domain via Wikimedia Commons).',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified Public Domain intraoral dental photograph.'
    }
  },
  {
    id: 'img-airway-cilia-gentle',
    organTag: 'RECOVERY • AIRWAY CLEANING',
    catchyHook: 'Give Your Lungs’ Built-In Brooms a Chance to Sweep Clean!',
    title: 'How Your Airway Cilia Wake Back Up After Quitting',
    intensity: 'gentle',
    requiresAdvanceWarning: false,
    photoUrl: null,
    contentWarningText: '',
    illustrationType: 'cilia-renewal',
    visualCategoryBadge: 'Educational Recovery Illustration',
    caption: 'Educational diagram of microscopic brush-like cilia sweeping mucus and dust out of the bronchi.',
    screenReaderDescription:
      'An educational vector illustration showing soft teal brush-like cilia along an airway lining sweeping upward under a clean stream of air.',
    educationalMessage:
      'Cigarette smoke paralyzes and flattens the millions of tiny hair-like cilia lining your bronchial tubes. When you stay smoke-free, these microscopic brooms begin recovering and sweeping trapped tar and mucus out of your lungs.',
    encouragingTakeaway:
      'Every single cigarette you skip gives your airway lining room to heal.',
    citation: 'U.S. Surgeon General Report on Smoking Cessation (2020); American Lung Association',
    licenseRecord: {
      source: 'The Primo IT Tech LLC — In-House Educational Vector Studio',
      creator: 'The Primo IT Tech LLC Design & Health Education Team',
      licenseStatus: 'Cleared — Original Proprietary SVG Illustration (#PRIMO-SVG-001)',
      consentStatus: 'N/A — Non-photographic vector diagram',
      permittedUses: 'iOS, Android, and Web educational display in CigFree™ (Clear Path)',
      requiredAttribution: '© 2026 The Primo IT Tech LLC. Educational diagram.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified original non-graphic vector illustration.'
    }
  },
  {
    id: 'real-throat-larynx-cancer',
    organTag: 'THROAT & VOICE BOX • LARYNGEAL CANCER',
    catchyHook: 'Every Inhale Funnels Concentrated Smoke Through Your Voice Box',
    title: 'Real Throat Cancer: Squamous Cell Carcinoma of the Larynx',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/throat-larynx-cancer.jpg',
    contentWarningText:
      'Advance Content Warning: This card shows a real surgical pathology specimen of a human larynx (voice box) containing a large squamous cell carcinoma tumor. You can reveal or skip this card at any time.',
    illustrationType: 'airway-comparison-direct',
    visualCategoryBadge: 'Real Pathology Specimen Photo — Cleared CC BY-SA 3.0',
    caption:
      'Gross pathology specimen of a resected human larynx opened to show an invasive laryngeal carcinoma tumor mass (Paweł Kuźniar, CC BY-SA 3.0).',
    screenReaderDescription:
      'Gross pathology photograph of an opened human larynx specimen showing a large, irregular ulcerated tumor mass obstructing the airway.',
    educationalMessage:
      'Because all inhaled smoke funnels through the narrow passage of the throat and voice box (larynx), smokers face a dramatically increased risk of laryngeal cancer—which can require surgical removal of the voice box and a permanent breathing stoma in the neck.',
    encouragingTakeaway:
      'Quitting smoking rapidly begins lowering your risk of throat and voice box cancers over the years ahead.',
    citation: 'World Health Organization (WHO) & National Cancer Institute — Laryngeal Cancer',
    licenseRecord: {
      source: 'Wikimedia Commons (File:Larynx cancer 01.jpg)',
      creator: 'Paweł Kuźniar (Jojo_1) / Department of Pathology',
      licenseStatus: 'Cleared — Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
      consentStatus: 'De-identified surgical pathology specimen (no identifiable individual shown)',
      permittedUses: 'Commercial and educational reuse permitted with attribution under CC BY-SA 3.0',
      requiredAttribution: 'Photo credit: Paweł Kuźniar (Jojo_1), licensed under CC BY-SA 3.0 via Wikimedia Commons.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified CC BY-SA 3.0 pathology specimen photograph.'
    }
  },
  {
    id: 'real-tongue-oral-cancer',
    organTag: 'TONGUE & MOUTH • ORAL CARCINOMA',
    catchyHook: '70+ Cancer-Causing Chemicals Coat Your Tongue With Every Drag',
    title: 'Real Oral Cancer: Squamous Cell Carcinoma Inside the Mouth',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/tongue-oral-cancer.png',
    contentWarningText:
      'Advance Content Warning: This card shows a real intraoral clinical photograph of an advanced oral squamous cell carcinoma lesion under the tongue (*PLoS Medicine*, CC BY 2.5). You can reveal or skip this image at any time.',
    illustrationType: 'oral-tissue-direct',
    visualCategoryBadge: 'Real Clinical Intraoral Photo — Cleared CC BY 2.5',
    caption:
      'Intraoral photograph of oral squamous cell carcinoma on the ventral tongue and floor of the mouth (Pastore et al., PLoS Medicine, CC BY 2.5).',
    screenReaderDescription:
      'Close-up intraoral clinical photograph showing the underside of a tongue with a red-and-white ulcerated oral carcinoma mass.',
    educationalMessage:
      'Tobacco smoke bathes the delicate tissues under the tongue and floor of the mouth in nitrosamines, polycyclic aromatic hydrocarbons, and acetaldehyde. Most oral cavity cancers are directly linked to tobacco use.',
    encouragingTakeaway:
      'Within years of quitting smoking, your risk of mouth and throat cancer drops by half compared to someone who continues smoking.',
    citation: 'CDC — Tobacco and Cancer; Pastore et al., PLoS Medicine (CC BY 2.5)',
    licenseRecord: {
      source: 'PLoS Medicine / Wikimedia Commons (File:PLoS oral cancer.png, DOI: 10.1371/journal.pmed.0030165)',
      creator: 'Luca Pastore, Maria Luisa Fiorella, Raffaele Fiorella, Lorenzo Lo Muzio',
      licenseStatus: 'Cleared — Creative Commons Attribution 2.5 Generic (CC BY 2.5)',
      consentStatus: 'Published in peer-reviewed open-access clinical journal with documented patient consent; cropped intraoral view',
      permittedUses: 'Unrestricted educational & commercial redistribution with attribution under CC BY 2.5',
      requiredAttribution: '© Pastore et al. (PLoS Medicine, 2006), licensed under CC BY 2.5.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified peer-reviewed open-access CC BY 2.5 clinical photograph.'
    }
  },
  {
    id: 'real-lung-cancer-nci',
    organTag: 'LUNGS • BRONCHOGENIC CARCINOMA',
    catchyHook: 'Cigarettes Cause Nearly 9 Out of 10 Lung Cancer Deaths',
    title: 'Real Lung Tumor Specimen: Bronchogenic Lung Cancer',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/lung-cancer-specimen.jpg',
    contentWarningText:
      'Advance Content Warning: This card shows a real gross pathology specimen of a human lung cross-section with a large cancerous tumor mass (Public Domain). You can reveal or skip it at any time.',
    illustrationType: 'airway-comparison-direct',
    visualCategoryBadge: 'Real Pathology Specimen Photo — Public Domain',
    caption:
      'Cross-section of a human lung showing a large pale bronchogenic carcinoma tumor mass surrounded by dark smoke-stained lung tissue (Public Domain).',
    screenReaderDescription:
      'Gross pathology photograph of a sliced human lung specimen showing a large whitish-gray tumor mass growing inside dark, carbon-stained lung tissue.',
    educationalMessage:
      'Carcinogens in cigarette smoke directly damage the DNA of cells lining your bronchi and lungs. Smoking is the #1 cause of lung cancer worldwide—responsible for roughly 80% to 90% of lung cancer deaths.',
    encouragingTakeaway:
      'No matter your age or how long you have smoked, quitting today lowers your risk of lung cancer and helps protect your remaining lung tissue.',
    citation: 'National Cancer Institute (NCI) & CDC — Lung Cancer Risk Factors',
    licenseRecord: {
      source: 'Wikimedia Commons (File:Pathology of the lung (cancer).jpg)',
      creator: 'Medical Pathology Archive (Public Domain)',
      licenseStatus: 'Cleared — Public Domain (PD-author / U.S. Public Domain archive)',
      consentStatus: 'De-identified pathology specimen (no identifiable person)',
      permittedUses: 'Unrestricted worldwide educational & commercial use (Public Domain)',
      requiredAttribution: 'Gross pathology specimen of lung carcinoma (Public Domain via Wikimedia Commons).',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified Public Domain gross pathology specimen.'
    }
  },
  {
    id: 'img-oxygen-transport-gentle',
    organTag: 'RECOVERY • CLEAN OXYGEN BOOST',
    catchyHook: 'Kick Carbon Monoxide Out of Your Bloodstream!',
    title: 'Fresh Oxygen Flowing to Your Brain, Heart & Muscles',
    intensity: 'gentle',
    requiresAdvanceWarning: false,
    photoUrl: null,
    contentWarningText: '',
    illustrationType: 'oxygen-flow',
    visualCategoryBadge: 'Educational Recovery Illustration',
    caption: 'Educational diagram comparing carbon monoxide competition with clean oxygen transport.',
    screenReaderDescription:
      'An educational vector illustration of a flowing vessel carrying bright red cells paired with blue oxygen spheres.',
    educationalMessage:
      'Every puff floods your blood with carbon monoxide—the same poisonous gas found in car exhaust—which hijacks red blood cells so they cannot carry oxygen. When you stop smoking, carbon monoxide clears out and oxygen levels rebound.',
    encouragingTakeaway:
      'Staying smoke-free today lets your blood carry clean, energizing oxygen to every organ.',
    citation: 'Centers for Disease Control and Prevention (CDC) — Benefits of Quitting Smoking',
    licenseRecord: {
      source: 'The Primo IT Tech LLC — In-House Educational Vector Studio',
      creator: 'The Primo IT Tech LLC Design & Health Education Team',
      licenseStatus: 'Cleared — Original Proprietary SVG Illustration (#PRIMO-SVG-002)',
      consentStatus: 'N/A — Non-photographic vector diagram',
      permittedUses: 'iOS, Android, and Web educational display in CigFree™ (Clear Path)',
      requiredAttribution: '© 2026 The Primo IT Tech LLC. Educational diagram.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified original non-graphic vector illustration.'
    }
  },
  {
    id: 'real-oral-leukoplakia-nci',
    organTag: 'MOUTH & TONGUE • PRECANCEROUS LEUKOPLAKIA',
    catchyHook: 'Warning Signs Inside the Mouth: Tobacco Leukoplakia Patches',
    title: 'Real Precancerous Mouth Lesion: Oral Leukoplakia (NCI)',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/oral-leukoplakia-nci.jpg',
    contentWarningText:
      'Advance Content Warning: This card shows a real clinical photograph from the National Cancer Institute (Public Domain) of thick white precancerous leukoplakia patches on the tongue caused by tobacco irritation.',
    illustrationType: 'oral-tissue-direct',
    visualCategoryBadge: 'Real Clinical Photo — Public Domain (NCI / NIH)',
    caption:
      'Intraoral photograph of thick white leukoplakia patches on the mucous membrane of the tongue (National Cancer Institute, Public Domain).',
    screenReaderDescription:
      'Close-up intraoral photograph showing thick, raised white patches along the side of a patient’s tongue.',
    educationalMessage:
      'Chronic chemical and heat irritation from tobacco causes thick white or gray patches called leukoplakia on the gums, inside of the cheeks, and tongue. Leukoplakia cannot be scraped off and carries a risk of turning into oral cancer.',
    encouragingTakeaway:
      'Stopping tobacco use is the #1 step dentists and physicians recommend to let irritated oral mucosa recover and prevent progression.',
    citation: 'National Cancer Institute (NCI Visuals Online) & American Dental Association',
    licenseRecord: {
      source: 'National Cancer Institute (NCI) / Wikimedia Commons (File:Leukoplakia.jpg)',
      creator: 'National Cancer Institute (NCI), National Institutes of Health (NIH)',
      licenseStatus: 'Cleared — Public Domain (U.S. Federal Government Work)',
      consentStatus: 'De-identified intraoral clinical photograph released by NCI into the Public Domain',
      permittedUses: 'Unrestricted worldwide educational & commercial use (Public Domain)',
      requiredAttribution: 'Photo credit: National Cancer Institute (NCI / NIH, Public Domain).',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified U.S. Federal Government (NCI/NIH) Public Domain photograph.'
    }
  },
  {
    id: 'real-artery-atherosclerosis-cdc',
    organTag: 'HEART & ARTERIES • CLOGGED VESSELS',
    catchyHook: 'Smoke Turns Smooth Arteries Into Hardened, Plaque-Clogged Pipes',
    title: 'Real Arterial Damage: Severe Aortic Atherosclerosis (CDC)',
    intensity: 'direct',
    requiresAdvanceWarning: true,
    photoUrl: '/images/pathology/artery-atherosclerosis-cdc.jpg',
    contentWarningText:
      'Advance Content Warning: This card displays a real pathology specimen photograph (CDC PHIL #846) of a main human artery opened to show severe atherosclerotic plaque buildup and ulceration.',
    illustrationType: 'arterial-stress-direct',
    visualCategoryBadge: 'Real Pathology Specimen Photo — Public Domain (CDC PHIL #846)',
    caption:
      'Autopsy pathology specimen of an aorta opened lengthwise revealing extensive, ulcerated atherosclerotic plaques (CDC / Dr. Edwin P. Ewing, Jr., PHIL #846).',
    screenReaderDescription:
      'Gross pathology photograph of an opened human artery showing rough, yellowed, calcified and ulcerated plaque deposits covering the inner wall.',
    educationalMessage:
      'Chemicals in cigarette smoke damage the smooth inner lining of your arteries, making blood platelets stickier and accelerating hardened plaque buildup. This narrows blood flow to your heart, brain, and legs, leading to heart attacks, strokes, and peripheral vascular disease.',
    encouragingTakeaway:
      'Quitting smoking is one of the fastest ways to reduce cardiovascular strain and lower your risk of heart attack and stroke.',
    citation: 'Centers for Disease Control and Prevention (CDC PHIL #846); American Heart Association',
    licenseRecord: {
      source: 'CDC Public Health Image Library (PHIL #846) / Wikimedia Commons (File:Atherosclerosis, aorta, gross pathology PHIL 846 lores.jpg)',
      creator: 'CDC / Dr. Edwin P. Ewing, Jr.',
      licenseStatus: 'Cleared — Public Domain (U.S. Federal Government Work, 17 U.S.C. § 105)',
      consentStatus: 'De-identified pathology specimen (no identifiable individual shown)',
      permittedUses: 'Unrestricted worldwide educational & commercial use (Public Domain)',
      requiredAttribution: 'Photo credit: CDC / Dr. Edwin P. Ewing, Jr. (PHIL #846, Public Domain).',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified U.S. Government Public Domain real pathology photograph.'
    }
  },
  {
    id: 'img-senses-awakening-gentle',
    organTag: 'RECOVERY • TASTE, SMELL & FRESH BREATH',
    catchyHook: 'Ditch the Ashtray Breath & Taste Real Food Again!',
    title: 'Rediscovering Taste, Aroma & Clean Air',
    intensity: 'gentle',
    requiresAdvanceWarning: false,
    photoUrl: null,
    contentWarningText: '',
    illustrationType: 'senses-bloom',
    visualCategoryBadge: 'Educational Recovery Illustration',
    caption: 'Educational illustration of olfactory and taste receptor renewal.',
    screenReaderDescription:
      'An illustration of a warm cup, citrus slice, and pine leaf surrounded by gentle sensory waves.',
    educationalMessage:
      'Hot smoke dulls taste buds and nasal receptors while leaving stale tar odor on fingers, hair, and clothes. Quitting lets your natural sense of smell and taste bounce back.',
    encouragingTakeaway:
      'Every smoke-free day means fresher breath, cleaner clothes, and better-tasting meals.',
    citation: 'National Cancer Institute (Smokefree.gov)',
    licenseRecord: {
      source: 'The Primo IT Tech LLC — In-House Educational Vector Studio',
      creator: 'The Primo IT Tech LLC Design & Health Education Team',
      licenseStatus: 'Cleared — Original Proprietary SVG Illustration (#PRIMO-SVG-006)',
      consentStatus: 'N/A — Non-photographic vector diagram',
      permittedUses: 'iOS, Android, and Web educational display in CigFree™ (Clear Path)',
      requiredAttribution: '© 2026 The Primo IT Tech LLC. Educational diagram.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified original non-graphic vector illustration.'
    }
  },
  {
    id: 'img-craving-wave-gentle',
    organTag: 'RECOVERY • BEAT THE 5-MINUTE URGE',
    catchyHook: 'A Craving Lasts 5 Minutes — Lung Damage Lasts a Lifetime',
    title: 'Riding Out the 5-Minute Craving Wave',
    intensity: 'gentle',
    requiresAdvanceWarning: false,
    photoUrl: null,
    contentWarningText: '',
    illustrationType: 'craving-wave',
    visualCategoryBadge: 'Educational Recovery Illustration',
    caption: 'Educational diagram showing how a typical craving peaks and subsides within 3 to 5 minutes.',
    screenReaderDescription:
      'A bell-curve wave illustration showing a craving rising, cresting, and settling down into calm water over five minutes.',
    educationalMessage:
      'Nicotine cravings try to trick your brain into thinking the urge will last forever. In reality, most acute cravings peak like a wave and pass within 3 to 5 minutes whether you smoke or not!',
    encouragingTakeaway:
      'Wait 5 minutes, drink a glass of water, or look at one reality-check card—and watch the craving lose its grip.',
    citation: 'National Cancer Institute — Smokefree.gov Craving Management Guide',
    licenseRecord: {
      source: 'The Primo IT Tech LLC — In-House Educational Vector Studio',
      creator: 'The Primo IT Tech LLC Design & Health Education Team',
      licenseStatus: 'Cleared — Original Proprietary SVG Illustration (#PRIMO-SVG-009)',
      consentStatus: 'N/A — Non-photographic vector diagram',
      permittedUses: 'iOS, Android, and Web educational display in CigFree™ (Clear Path)',
      requiredAttribution: '© 2026 The Primo IT Tech LLC. Educational diagram.',
      isPlaceholderForRealPhoto: false,
      releaseAuditNote: 'Verified original non-graphic vector illustration.'
    }
  }
];

export const INSPIRATIONAL_PAUSE_CARDS = [
  {
    id: 'insp-mountain-dawn',
    title: 'Take a Breath — Your Body Is Thanking You Right Now',
    illustrationType: 'sunrise-horizon',
    visualCategoryBadge: 'Inspirational Breather — Cleared Original Artwork',
    caption: 'Calm horizon illustration reminding you why staying smoke-free is worth it.',
    screenReaderDescription:
      'A serene sunrise lifting over layered green hills and a winding clear path.',
    reasonToQuit:
      'Every cigarette you refuse keeps toxic tar out of your lungs, protects your gums and throat, and keeps hard-earned money in your pocket.',
    promptText:
      'You have viewed 3 cards. Want to see the next reality-check image, pause here for a moment, or jump back to your Today dashboard?'
  },
  {
    id: 'insp-forest-canopy',
    title: 'Every Smoke-Free Day Is Locked In Forever',
    illustrationType: 'forest-breeze',
    visualCategoryBadge: 'Inspirational Breather — Cleared Original Artwork',
    caption: 'Restorative woodland illustration celebrating steady, judgment-free progress.',
    screenReaderDescription:
      'Sunlight filtering through tall evergreen trees beside a calm stream.',
    reasonToQuit:
      'Quitting is the single best decision you can make for your lungs, mouth, heart, and future. Even if a day feels tough, your past smoke-free days are never erased.',
    promptText:
      'You are in the driver’s seat. Choose whether to continue, pause, or return to Today.'
  },
  {
    id: 'insp-harbor-light',
    title: 'Stay Strong — The Craving Will Pass in Minutes',
    illustrationType: 'harbor-beacon',
    visualCategoryBadge: 'Inspirational Breather — Cleared Original Artwork',
    caption: 'Calm coastal beacon symbolizing steady direction through cravings.',
    screenReaderDescription:
      'A warm lighthouse beam shining across tranquil evening water.',
    reasonToQuit:
      'Whether you are quitting to avoid cancer, breathe easier, save your teeth and gums, or be there for family, today’s choice matters.',
    promptText:
      'Keep going at your own pace. Continue to the next card, pause, or head back to Today.'
  }
];

export const BENEFIT_CARDS = [
  {
    id: 'benefit-carbon-monoxide',
    category: 'Circulation & Oxygen',
    title: 'Cleaner Oxygen Transport (No More Carbon Monoxide Flood)',
    summary:
      'When you stop inhaling tobacco smoke, exposure to toxic carbon monoxide stops immediately, allowing red blood cells to carry oxygen cleanly to your heart, brain, and muscles.',
    timeframeNote:
      'General physiological response observed shortly after stopping smoke inhalation (individual timing varies; no specific personal timeline guaranteed).',
    sourceCitation: 'Centers for Disease Control and Prevention (CDC) — Health Benefits of Quitting Smoking; WHO Tobacco Fact Sheet',
    medicalReviewStatus: 'Pending Qualified Medical Reviewer Final Sign-Off Prior to Clinical Release',
    relatedMotivation: 'health'
  },
  {
    id: 'benefit-circulation',
    category: 'Heart & Vascular Health',
    title: 'Less Nicotine & Plaque Strain on Arteries',
    summary:
      'Stepping away from nicotine reduces acute blood vessel constriction and lowers your risk of coronary heart disease, stroke, and peripheral vascular damage over time.',
    timeframeNote:
      'Progressive benefit across weeks, months, and years of smoke-free living (individual outcomes depend on overall health and medical history).',
    sourceCitation: 'U.S. Surgeon General Report: Smoking Cessation (2020)',
    medicalReviewStatus: 'Pending Qualified Medical Reviewer Final Sign-Off Prior to Clinical Release',
    relatedMotivation: 'health'
  },
  {
    id: 'benefit-breathing',
    category: 'Lungs & Throat',
    title: 'Halting New Tar & Protecting Your Lungs and Larynx',
    summary:
      'Stopping smoke inhalation immediately halts new black tar deposition in your lungs and reduces carcinogen exposure across your vocal cords, throat, and bronchial passages.',
    timeframeNote:
      'Gradual improvement over smoke-free weeks, months, and years; consult a physician for any persistent cough, hoarseness, or shortness of breath.',
    sourceCitation: 'American Lung Association & U.S. Surgeon General (2020)',
    medicalReviewStatus: 'Pending Qualified Medical Reviewer Final Sign-Off Prior to Clinical Release',
    relatedMotivation: 'breathing'
  },
  {
    id: 'benefit-senses',
    category: 'Lips, Gums, Teeth & Senses',
    title: 'Healthier Gums, Cleaner Teeth & Richer Taste',
    summary:
      'Quitting improves gum blood flow, stops new brown tar staining on enamel, lowers risk of lip/tongue cancer and leukoplakia, and restores natural taste and smell.',
    timeframeNote:
      'Many people notice fresher breath and sensory improvements during early smoke-free weeks.',
    sourceCitation: 'National Cancer Institute (Smokefree.gov) & CDC Oral Health Resources',
    medicalReviewStatus: 'Pending Qualified Medical Reviewer Final Sign-Off Prior to Clinical Release',
    relatedMotivation: 'smell'
  },
  {
    id: 'benefit-secondhand',
    category: 'Family & Environment',
    title: 'Protecting Family, Kids & Pets From Secondhand Smoke',
    summary:
      'Every cigarette skipped eliminates toxic secondhand smoke and indoor chemical residue for everyone sharing your home or car.',
    timeframeNote: 'Immediate environmental benefit with every cigarette avoided.',
    sourceCitation: 'CDC — Health Effects of Secondhand Smoke',
    medicalReviewStatus: 'Pending Qualified Medical Reviewer Final Sign-Off Prior to Clinical Release',
    relatedMotivation: 'family'
  },
  {
    id: 'benefit-financial',
    category: 'Budget & Goals',
    title: 'Keeping Thousands of Dollars in Your Pocket',
    summary:
      'At $8–$12+ per pack, quitting a pack-a-day habit saves $240–$360+ every month and $2,900–$4,300+ every year for things you actually enjoy.',
    timeframeNote:
      'Calculated as an optional mathematical estimate based on your entered cigarettes/day and pack price.',
    sourceCitation: 'CigFree™ Transparent Savings Formula (Non-Medical Estimate)',
    medicalReviewStatus: 'Verified Mathematical Estimate Formula',
    relatedMotivation: 'money'
  }
];

export const CRAVING_SUPPORT_TOOLKIT = [
  {
    id: 'tool-delay',
    title: 'Beat the 5-Minute Craving Clock',
    actionLabel: 'Start 5-Minute Delay Timer',
    iconName: 'Clock',
    description:
      'Most intense nicotine urges last only 3 to 5 minutes! Start the 5-minute clock and look at a reality-check photo until the wave passes.',
    encouragement: 'You only have to outlast the next 5 minutes.'
  },
  {
    id: 'tool-water',
    title: 'Chug a Cold Glass of Water',
    actionLabel: 'Log Water Break',
    iconName: 'Droplets',
    description:
      'Cold water cools your mouth and throat, flushes your palate, and interrupts the hand-to-mouth smoking reflex.',
    encouragement: 'Clean water instead of 7,000 smoke chemicals.'
  },
  {
    id: 'tool-walk',
    title: 'Step Outside for a 3-Minute Walk',
    actionLabel: 'Log Quick Walk',
    iconName: 'Footprints',
    description:
      'Walk around the block or stretch your arms. Moving breaks the boredom or stress trigger that sparked the craving.',
    encouragement: 'Feel your lungs working cleaner with every step.'
  },
  {
    id: 'tool-breathe',
    title: '4-4-4 Deep Lung Reset',
    actionLabel: 'Do 3 Deep Breaths',
    iconName: 'Wind',
    description:
      'Inhale clean air for 4 seconds, hold for 4 seconds, and exhale slowly for 4 seconds. Repeat 3 times.',
    encouragement: 'Remind yourself how good clean, smoke-free air feels.'
  },
  {
    id: 'tool-connect',
    title: 'Call or Text a Free Quitline Counselor',
    actionLabel: 'Open Quitline Numbers',
    iconName: 'PhoneCall',
    description:
      'Free, confidential coaches at 1-800-QUIT-NOW (and regional helplines) can help you crush tough cravings.',
    encouragement: 'Support doubles your chances of staying smoke-free.'
  }
];

export const DIFFICULT_DAY_AFFIRMATIONS = [
  'A craving lasts 5 minutes—lung and gum health last a lifetime. You’ve got this!',
  'If you slipped and had a cigarette, don’t throw away your progress! Log it honestly and keep every smoke-free day you already earned.',
  'Every single cigarette you DO NOT smoke is 7,000 fewer chemical hits to your lungs, throat, lips, and gums.',
  'You are breaking a powerful chemical trap one day at a time. Be proud of showing up today.'
];

export const MILESTONE_DEFINITIONS = [
  {
    id: 'milestone-1d',
    daysRequired: 1,
    title: '1 Day CigFree',
    badgeLabel: 'Day 1 Victory',
    kudosMessage:
      '24 hours without feeding tar and carbon monoxide into your lungs! The hardest step is Day 1.',
    shareText:
      'Celebrating Day 1 CigFree! Keeping my lungs, throat, and gums clean one day at a time.'
  },
  {
    id: 'milestone-3d',
    daysRequired: 3,
    title: '3 Days CigFree',
    badgeLabel: '72-Hour Breakthrough',
    kudosMessage:
      'Three full smoke-free days! You are proving you are stronger than nicotine cravings.',
    shareText:
      '3 Days CigFree! Crushing cravings and protecting my health.'
  },
  {
    id: 'milestone-7d',
    daysRequired: 7,
    title: '1 Full Week CigFree',
    badgeLabel: '7-Day Shield',
    kudosMessage:
      'One full week without cigarettes! Think of all the tar and smoke chemicals your lungs and gums avoided this week.',
    shareText:
      '1 Full Week (7 Days) CigFree! Every smoke-free day stays locked in.'
  },
  {
    id: 'milestone-14d',
    daysRequired: 14,
    title: '2 Weeks CigFree',
    badgeLabel: '14-Day Momentum',
    kudosMessage:
      'Two weeks of clean air, fresher breath, and extra cash staying in your wallet!',
    shareText:
      'Celebrating 2 Weeks (14 Days) CigFree!'
  },
  {
    id: 'milestone-30d',
    daysRequired: 30,
    title: '1 Month CigFree',
    badgeLabel: '30-Day Champion',
    kudosMessage:
      'Thirty smoke-free days! A massive milestone for your lungs, gums, circulation, and freedom.',
    shareText:
      '1 Month (30 Days) CigFree! Proud of every single day.'
  },
  {
    id: 'milestone-90d',
    daysRequired: 90,
    title: '3 Months CigFree',
    badgeLabel: '90-Day Renewal',
    kudosMessage:
      'Ninety smoke-free days! A full season of protecting your body from tobacco damage.',
    shareText:
      'Celebrating 3 Months (90 Days) CigFree!'
  },
  {
    id: 'milestone-180d',
    daysRequired: 180,
    title: '6 Months CigFree',
    badgeLabel: 'Half-Year Legend',
    kudosMessage:
      'Half a year of smoke-free living! Look how much tar and money you have saved.',
    shareText:
      '6 Months (180 Days) CigFree!'
  },
  {
    id: 'milestone-365d',
    daysRequired: 365,
    title: '1 Full Year CigFree',
    badgeLabel: '365-Day Freedom',
    kudosMessage:
      '365 smoke-free days! An extraordinary achievement for your health, family, and future.',
    shareText:
      'Celebrating 1 Full Year (365 Days) CigFree!'
  }
];

export const REGIONAL_HELP_RESOURCES = [
  {
    regionCode: 'US',
    regionName: 'United States',
    privacyNote: 'Selected manually by you — CigFree™ never tracks or guesses your GPS location.',
    services: [
      {
        name: 'National Quitline (1-800-QUIT-NOW)',
        phone: '1-800-784-8669',
        url: 'https://smokefree.gov',
        description:
          'Free, confidential 1-on-1 coaching and quit resources from the National Cancer Institute (NCI) and state quitlines.'
      },
      {
        name: 'SmokefreeTXT Text Support',
        phone: 'Text QUITNOW to 333888',
        url: 'https://smokefree.gov/tools-tips/text-programs',
        description: '24/7 encouragement, craving tips, and support via text message (U.S.).'
      },
      {
        name: 'CDC Quit Smoking Resources',
        phone: '1-800-CDC-INFO',
        url: 'https://www.cdc.gov/tobacco/campaign/tips/quit-smoking/index.html',
        description: 'Real stories, health warnings, quit plans, and educational guides from the CDC.'
      }
    ]
  },
  {
    regionCode: 'CA',
    regionName: 'Canada',
    privacyNote: 'Selected manually by you — CigFree™ never tracks or guesses your GPS location.',
    services: [
      {
        name: 'Pan-Canadian Quitline',
        phone: '1-866-366-3667',
        url: 'https://www.canada.ca/en/health-canada/services/smoking-tobacco/quit-smoking.html',
        description: 'Free, confidential support from trained quit specialists across Canadian provinces and territories.'
      }
    ]
  },
  {
    regionCode: 'UK',
    regionName: 'United Kingdom',
    privacyNote: 'Selected manually by you — CigFree™ never tracks or guesses your GPS location.',
    services: [
      {
        name: 'NHS Smokefree National Helpline',
        phone: '0300 123 1044',
        url: 'https://www.nhs.uk/better-health/quit-smoking/',
        description: 'Free NHS stop-smoking advice, local stop-smoking service directory, and trained advisers.'
      }
    ]
  },
  {
    regionCode: 'AU',
    regionName: 'Australia',
    privacyNote: 'Selected manually by you — CigFree™ never tracks or guesses your GPS location.',
    services: [
      {
        name: 'Quitline Australia',
        phone: '13 7848',
        url: 'https://www.quit.org.au',
        description: 'Confidential telephone counselling and tailored quit resources across Australia.'
      }
    ]
  },
  {
    regionCode: 'INTL',
    regionName: 'International / World Health Organization',
    privacyNote: 'Selected manually by you — CigFree™ never tracks or guesses your GPS location.',
    services: [
      {
        name: 'WHO Quitting Tobacco Initiative & Global Toll-Free Directory',
        phone: 'See WHO national toll-free directory',
        url: 'https://www.who.int/activities/quitting-tobacco',
        description:
          'Official World Health Organization tobacco cessation guidance and country-by-country support resources.'
      }
    ]
  }
];

export const PHOTO_MODE_CALMING_STEPS = [
  {
    id: 'calm-sunrise-breath',
    title: 'Pause & Exhale — You Are Choosing Health Right Now',
    photoUrl: '/images/calming/calm-sunrise-nps.jpg',
    reasonPhotoUrl: '/images/calming/calm-ocean-nps.jpg',
    illustrationType: 'sunrise-horizon',
    visualCategoryBadge: 'Calming Photograph — U.S. National Park Service (Public Domain)',
    caption: 'Sunrise over Shenandoah National Park (U.S. National Park Service, Public Domain).',
    screenReaderDescription:
      'A peaceful mountain sunrise glowing over Shenandoah National Park.',
    supportiveQuote:
      '“Facing the reality of what tobacco does takes courage. Every single cigarette you choose not to smoke is an act of kindness toward your future self.”',
    licenseRecord: {
      source: 'U.S. National Park Service / Wikimedia Commons (Shenandoah National Park)',
      creator: 'U.S. National Park Service (Federal Government Photograph)',
      licenseStatus: 'Public Domain in the United States (17 U.S.C. § 105 / PD-USGov-NPS)',
      consentStatus: 'Landscape photograph — no identifiable individuals shown',
      permittedUses: 'Cleared for educational & commercial display in Clear Path (The Primo IT Tech LLC)',
      requiredAttribution: 'Photo: U.S. National Park Service (Public Domain)',
      isPlaceholderForRealPhoto: false
    }
  },
  {
    id: 'calm-forest-stream',
    title: 'Steady & Strong — One Round, One Day at a Time',
    photoUrl: '/images/calming/calm-forest-nps.jpg',
    reasonPhotoUrl: '/images/calming/calm-lake-nps.jpg',
    illustrationType: 'forest-breeze',
    visualCategoryBadge: 'Calming Photograph — U.S. National Park Service (Public Domain)',
    caption: 'Tall Coast Redwoods in Redwood National Park (U.S. National Park Service, Public Domain).',
    screenReaderDescription:
      'Peaceful tall redwood trees in Redwood National Park.',
    supportiveQuote:
      '“You do not have to be perfect to make real progress. Every smoke-free hour stays in your corner permanently.”',
    licenseRecord: {
      source: 'U.S. National Park Service / Wikimedia Commons (Redwood National Park REDW2653)',
      creator: 'U.S. National Park Service (Federal Government Photograph)',
      licenseStatus: 'Public Domain in the United States (17 U.S.C. § 105 / PD-USGov-NPS)',
      consentStatus: 'Landscape photograph — no identifiable individuals shown',
      permittedUses: 'Cleared for educational & commercial display in Clear Path (The Primo IT Tech LLC)',
      requiredAttribution: 'Photo: U.S. National Park Service (Public Domain)',
      isPlaceholderForRealPhoto: false
    }
  },
  {
    id: 'calm-harbor-beacon',
    title: 'You Are Stronger Than a 5-Minute Craving',
    photoUrl: '/images/calming/calm-lake-nps.jpg',
    reasonPhotoUrl: '/images/calming/calm-sunrise-nps.jpg',
    illustrationType: 'harbor-beacon',
    visualCategoryBadge: 'Calming Photograph — U.S. National Park Service (Public Domain)',
    caption: 'Lake McDonald in Glacier National Park (U.S. National Park Service, Public Domain).',
    screenReaderDescription:
      'Calm waters of Lake McDonald reflecting mountains in Glacier National Park.',
    supportiveQuote:
      '“Cravings are temporary waves that crest and fade in minutes. Your lungs, throat, gums, and heart will thank you for years.”',
    licenseRecord: {
      source: 'U.S. National Park Service / Wikimedia Commons (Glacier National Park)',
      creator: 'U.S. National Park Service (Federal Government Photograph)',
      licenseStatus: 'Public Domain in the United States (17 U.S.C. § 105 / PD-USGov-NPS)',
      consentStatus: 'Landscape photograph — no identifiable individuals shown',
      permittedUses: 'Cleared for educational & commercial display in Clear Path (The Primo IT Tech LLC)',
      requiredAttribution: 'Photo: U.S. National Park Service (Public Domain)',
      isPlaceholderForRealPhoto: false
    }
  }
];

export const REMINDER_DAYS_OF_WEEK = [
  { id: 'Mon', label: 'Mon' },
  { id: 'Tue', label: 'Tue' },
  { id: 'Wed', label: 'Wed' },
  { id: 'Thu', label: 'Thu' },
  { id: 'Fri', label: 'Fri' },
  { id: 'Sat', label: 'Sat' },
  { id: 'Sun', label: 'Sun' }
];

export const REMINDER_FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Once Daily (Selected Days)' },
  { id: 'twice_daily', label: 'Twice Daily (Morning & Evening)' },
  { id: 'selected_days', label: 'Custom Days Only' }
];

