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

2. **Image-Based Motivation**:
   - Create a **“View the next image”** experience with a clear **Next** button, **image counter**, and **Skip** option.
   - Do **not** show graphic images automatically, unexpectedly, or without an advance content warning.
   - Use only images that are **legally cleared for this specific use**: documented licenses or written, informed permission from the photographer and identifiable people shown. Do not scrape images, assume online availability means permission, or generate fake images presented as real patient photos.
   - Provide a built-in **Image Rights & Consent Ledger** to record each image’s source, license or consent status, permitted uses, and any required attribution.
   - Where real-life patient photographs are not yet licensed, use clearly labeled **non-graphic educational illustrations** (`[Educational Illustration — Not a Real Patient Photo]`).
   - After every 3–5 images, offer an **optional inspirational image** and a concise, encouraging reason to quit. Let users **continue, pause, or leave** the experience.
   - Keep language compassionate and non-shaming. Never imply that someone deserves illness or that relapse is failure.

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
