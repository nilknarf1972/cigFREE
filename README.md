# Clear Path (`cigFREE`) — Supportive Cigarette-Cessation App for iOS, Android & Offline Web

**Working Title:** Clear Path  
**Publisher & Legal Owner:** **The Primo IT Tech LLC** (Managing Member: Keith Franklin, Florida, USA)  
**Copyright:** © 2026 The Primo IT Tech LLC. All Rights Reserved.  
**Store Pricing:** **One-time $0.99 download** via Apple App Store & Google Play Store (No subscriptions, no ads, no surprise in-app purchases, no account required).

---

## 1. Product Overview

**Clear Path** is a calm, compassionate, offline-first cigarette-cessation app built by **The Primo IT Tech LLC** for iOS, Android, and Web/PWA. It helps people quit smoking through:
- **8 Core Screens**:
  1. **Welcome / Onboarding**: Choose a quit date (or start today), optionally enter estimated cigarettes/day and cost/pack, choose personal motivations, and select visual intensity (**Gentle**, **Direct**, or **Hide graphic images**).
  2. **Today Dashboard**: Prominent **“Mark Today Smoke-Free”** primary action, compassionate **“I Smoked / Log a Setback Kindly”** flow that preserves past smoke-free days and milestones, 5-minute craving pause timer, and optional clearly-labeled savings estimates with formula transparency.
  3. **Image Journey**: **“View the Next Image”** experience with image counter, always-visible **Skip Image** button, per-image **Advance Content Warning** gate before any direct educational diagram, optional **Inspirational Pause Interlude** after every 3 images (**Continue**, **Pause**, or **Leave**), and a built-in **Image Source, License & Consent Ledger**.
  4. **Benefits & Encouragement**: Readable cards grounded in public-health sources (CDC, WHO, U.S. Surgeon General, NCI `Smokefree.gov`, American Lung Association), customizable personal motivations, and a practical Craving Toolkit.
  5. **Quit Calendar & Progress**: Interactive monthly calendar to mark smoke-free days or setbacks, add local notes, and edit/reset quit dates without judgment.
  6. **Milestones & Kudos**: Celebrates **1 day, 3 days, 1 week, 2 weeks, 1 month, 3 months, 6 months, and 1 year** with non-erasing milestone memory and strictly **opt-in** shareable milestone cards.
  7. **Settings**: Light, Dark, and System Default themes; Scalable Text (`100%`, `115%`, `130%`); High-Contrast mode; Reduced Motion toggle; Visual Intensity switcher; JSON Data Export; and one-click Local Data Deletion with confirmation.
  8. **Get Help**: Reputable national and international quitlines (US `1-800-QUIT-NOW`, Canada, UK NHS, Australia, WHO) with manual region selection so the app never guesses or tracks user geolocation.

---

## 2. Pricing, Legal & Pre-Release Audit Disclosures (The Primo IT Tech LLC)

- **One-Time $0.99 App Store Download**: Priced as a one-time **$0.99 USD** download (or local storefront equivalent) with no subscriptions or surprise in-app purchases.
- **No Promised Net Proceeds After Store Fees or Taxes**: Applicable sales taxes, VAT/GST, and platform commissions are handled by Apple App Store and Google Play Store at checkout; **The Primo IT Tech LLC** does not promise or represent a specific net amount after app-store fees or taxes.
- **Educational & Motivational Only (Not Medical Care)**: Clear Path is an educational and motivational tool, not a medical device or clinical service. Always consult a physician, pharmacist, or healthcare professional for medical advice.
- **Pre-Release Image & Clinical Claim Audit**:
  - All visuals bundled in v1.0.0 are **original non-photographic SVG educational illustrations** created by **The Primo IT Tech LLC** (`Educational Illustration — Not a Real Patient Photo`). No scraped photos or AI-generated fake patient photos are used.
  - All time-based health benefit summaries cite public-health authorities and are explicitly flagged in [`LEGAL_AND_COMPLIANCE.md`](./LEGAL_AND_COMPLIANCE.md) for final sign-off by a qualified medical reviewer before clinical claim release.

---

## 3. Setup, Run & Test Instructions

### Prerequisites
- **Node.js** `>= 18.0.0` (tested on Node `v24.20.0`) and **npm**

### A. Run Unit Tests (No External Dependencies Required)
The core calculation and compliance test suite uses Node's built-in test runner and runs immediately:
```bash
npm test
```

### B. Install Dependencies & Run Web / Offline PWA
```bash
npm install
npm run dev
```
- Opens the interactive app at `http://localhost:5175`
- Build production offline PWA bundle:
```bash
npm run build
npm run preview
```

### C. Run iOS & Android Native App (Expo)
```bash
cd mobile
npm install
npx expo start
```
- Press `i` for iOS Simulator, `a` for Android Emulator, or scan with Expo Go on your iOS/Android device.

---

## 4. Repository Structure

- [`genesis.md`](./genesis.md) — Root-level Genesis Protocol & Clear Path Product Brief
- [`genesis_manifest.md`](./genesis_manifest.md) — 6-Pillar Genesis Manifest for Clear Path
- [`LICENSE.md`](./LICENSE.md) — Proprietary Software License & Legal Terms (**The Primo IT Tech LLC**)
- [`LEGAL_AND_COMPLIANCE.md`](./LEGAL_AND_COMPLIANCE.md) — Pre-Release Image Clearance & Medical Reviewer Audit Ledger
- [`src/data/clearPathData.js`](./src/data/clearPathData.js) — Image license ledger, benefits cards, craving toolkit, milestones, and regional quitlines
- [`src/engine/clearPathEngine.js`](./src/engine/clearPathEngine.js) — Pure domain logic for quit-date calculations, milestones, savings estimates, theme resolution, and data deletion
- [`src/components/EducationalIllustration.jsx`](./src/components/EducationalIllustration.jsx) — Accessible custom SVG educational illustrations
- [`src/App.jsx`](./src/App.jsx) — Main 8-screen application interface
- [`mobile/`](./mobile/app.json) — iOS App Store & Google Play Store Expo configuration (`com.primoittech.clearpath`)
- [`tests/clearPathEngine.test.mjs`](./tests/clearPathEngine.test.mjs) — Automated unit tests
