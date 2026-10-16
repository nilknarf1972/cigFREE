# Clear Path (cigFREE) — Genesis Protocol & Product Brief (`genesis.md`)

**Product Title:** Clear Path (Working Title)  
**Repository / Codename:** `cigFREE`  
**Owner & Publisher:** The Primo IT Tech LLC (Managing Member: Keith Franklin, Florida, USA)  
**Version:** 1.0.0  
**Canonical Genesis Alignment:** DreamNet Genesis v1.0.0 (`ef0c1e6a`)  
**Platforms:** iOS, Android, and Offline-First Progressive Web App (PWA)  
**Pricing Model:** One-time $0.99 download via Apple App Store & Google Play Store (No subscriptions, no surprise in-app purchases)

---

## PART I — THE PRODUCT BRIEF: “CLEAR PATH”

Create a polished, supportive cigarette-cessation app for iOS and Android. Working title: **“Clear Path.”** The app helps people quit smoking using educational imagery, motivational messages, milestone celebrations, and a simple quit calendar.

### 1. Product and Pricing
- **One-Time $0.99 Download**: Priced as a one-time **$0.99** download through the relevant app stores (Apple App Store and Google Play Store), with **no subscriptions** and **no surprise in-app purchases**.
- **Transparent Store Labeling**: Clearly label the $0.99 one-time price in the store listing and purchase flow. **Do not promise a specific net amount after app-store fees or taxes** (taxes, currency conversions, and platform commissions vary by store and jurisdiction).
- **100% Offline & Account-Free Core**: Built for a complete, reliable offline experience. No user account, cloud sign-in, or personal registration is required to use any core feature.

### 2. Core Experience
1. **Onboarding**:
   - Let users choose a quit date, or start today.
   - Ask whether they want to enter an estimated number of cigarettes smoked per day and the cost per pack (optional).
   - Explain clearly that the app is **educational and motivational, not medical care**.
   - Offer a choice of visual intensity: **“Gentle,” “Direct,”** or **“Hide graphic images.”** Make it easy to change later.
   - Explain that graphic images can be upsetting and let users skip them at any time.

2. **Signature Feature: Photo Mode & Image-Based Motivation**:
   - Create a dedicated **“Photo Mode”** that guides the user through a repeatable sequence of difficult images, calming encouragement, and reasons to quit while keeping the user in complete control:
     1. Show a brief **content warning** before the first session and whenever the user changes the image intensity setting (**“Direct,” “Gentle,”** or **“No graphic images”**).
     2. Let the user choose a session length of **3 or 5 difficult images per round**.
     3. Show **one image at a time**, with a clear **Next** button, **progress indicator** (`Round X • Image Y of 3/5`), and **Skip** or **Exit** option.
     4. After the selected number of images (`3` or `5`), show a **calming, inspirational image and supportive quote**.
     5. Then show **one concise, positive reason to quit**, combining a personal motivation the user selected and a medically reviewed benefit.
     6. Offer the choice to **continue with another round, pause, or finish the session**. If they continue, begin the next round with difficult images.
     7. **Never autoplay**, surprise the user with graphic content, or make it difficult to stop or leave Photo Mode.
   - Use real-life cancer or smoking-related pathology images only when documented rights and required consent exist (e.g., U.S. Government Public Domain CDC PHIL / NIH / NCI and verified Creative Commons clinical datasets), and provide a built-in **Image Rights & Consent Ledger** recording each image’s source, creator, license/consent status, permitted uses, and attribution requirements.

2b. **Personalized Reminders (Discreet Lock-Screen Default)**:
   - Allow users to opt in to reminders for Photo Mode, choosing **days of the week, times, frequency**, and whether reminders include their **quit progress**.
   - Keep notifications **discreet by default**: never show graphic images or sensitive health details on the lock screen (`“Your progress is waiting—open Clear Path when you’re ready.”`).
   - Only show an image in a notification if the user **explicitly enables image notifications AND confirms they understand it may be visible on their device’s lock screen**.
   - Provide easy one-tap controls to **pause, change, or turn off reminders**.
   - Progress in reminders is always accurate, encouraging, and nonjudgmental—never guilt-based and never implying a setback erases past progress.

3. **Benefits and Encouragement**:
   - Present quitting benefits in short, readable cards. Use conservative educational wording grounded in public health sources (CDC, WHO, U.S. Surgeon General, American Lung Association) and cite trustworthy sources inside the app.
   - Do not invent precise health timelines or guarantee outcomes. Flag all time-based health summaries for verification by a qualified medical reviewer before clinical release.
   - Include reasons people may choose to quit, such as **health, breathing, money, family, smell, or personal goals**, and let users choose and customize their own motivations.
   - Include supportive messages for cravings and difficult days, suggesting practical options such as delaying a cigarette, taking a short walk, drinking water, calm breathing, or contacting a trusted person.

4. **Quit Calendar and Progress**:
   - Include an interactive calendar where users can mark smoke-free days and view their progress.
   - Track time since the quit date, smoke-free days, and optional estimated cigarettes and money saved. Clearly label all estimates and show the exact formula for how they are calculated.
   - Allow users to edit or reset their quit date without judgment.
   - If a user smokes, respond kindly: acknowledge the setback, help them choose a next step, and preserve their past smoke-free days and achieved milestones.

5. **Milestones and Kudos**:
   - Celebrate milestones including **1 day, 3 days, 1 week, 2 weeks, 1 month, 3 months, 6 months, and 1 year**.
   - Use accessible celebratory visuals, encouraging messages, and optional **opt-in** shareable cards.
   - Preserve unlocked progress so users never feel their past effort is erased if they experience a setback.

6. **Appearance and Accessibility**:
   - Include **Light**, **Dark**, and **System Default** theme modes.
   - Support screen readers (`aria-label`, `aria-live`, semantic landmarks), scalable text (`100%`, `115%`, `130%`), strong contrast mode, captions and descriptions for every image, and reduced-motion settings.
   - Make buttons easy to use (minimum 44×44px touch targets) and give every direct/intense image an accessible content warning and description.

### 3. Privacy, Safety & Legal (The Primo IT Tech LLC)
- Owned and published by **The Primo IT Tech LLC**.
- Store personal progress locally on-device by default (`localStorage` / `AsyncStorage`). Do not collect or transmit health or personal data.
- No ads, no third-party tracking, and no automatic social sharing.
- Provide clear one-click controls to **export (JSON)** or **permanently delete** the user’s local data.
- Include a **“Get Help”** area linking to reputable quit-smoking support (with manual region selection so the app never guesses or tracks the user’s location).
- Clearly identify any educational illustration placeholders and unverified medical claims prior to release.

---

## PART II — THE DREAMNET GENESIS LORE & 6-PILLAR ARCHITECTURE

### 1. The Seed (The Dream Kernel)
Before anything existed onchain or off, there was only a single seed — the Dream Kernel. A tiny point of possibility. In **Clear Path**, the Seed is the single intentional decision to breathe free: *"Every smoke-free hour is a victory kept forever."*

### 2. The Microcosm (The Subterranean Layer)
Beneath the surface interface operates the pure, deterministic local engine (`src/engine/clearPathEngine.js`):
- Quit-date & elapsed time calculator (`calculateQuitProgress`)
- Optional cigarette & financial savings estimator with transparent formula disclosure (`calculateSavingsEstimates`)
- Non-erasing milestone & kudos evaluator (`evaluateMilestones`)
- Setback & compassionate recovery handler (`recordSmokingEvent`)
- Local persistence, JSON export, and cryptographic-grade zero-residue local wipe (`clearAllUserData`)

### 3. The Breakthrough (The First Emergence)
Bridging subterranean local storage to native iOS/Android (`mobile/app.json`) and offline PWA service workers (`public/sw.js`) with Light, Dark, System Default, High Contrast, Scalable Text, and Reduced Motion accessibility.

### 4. The First Tree (The Connectivity Engine)
- **Trunk**: `src/data/clearPathData.js` (Verified image license ledger, benefit cards with public-health citations, craving interventions, milestones, and regional quitlines).
- **Branches (8 Main Screens)**:
  1. `Welcome / Onboarding`
  2. `Today`
  3. `Image Journey`
  4. `Benefits`
  5. `Calendar`
  6. `Milestones`
  7. `Settings`
  8. `Get Help`

### 5. The City, the World, the Realms (Trust Ledger & Governance)
- **Image Rights & Consent Trust Ledger**: Every visual asset records documented license status, creator attribution, subject consent verification, placeholder disclosure, and intensity rating (`Gentle`, `Direct`, `Inspirational`).
- **Pre-Release Medical & Legal Audit Gate**: Explicitly distinguishes educational illustrations from patient photography and flags health timeline summaries for qualified clinical review.

### 6. The Living System
An evolving, judgment-free companion published by **The Primo IT Tech LLC** that adapts to each user's visual comfort, personal motivations, and pace without ever shaming or erasing their past victories.
