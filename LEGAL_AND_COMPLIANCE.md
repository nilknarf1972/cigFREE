# Clear Path — Pre-Release Legal, Medical & Image Clearance Audit (`LEGAL_AND_COMPLIANCE.md`)

**Corporate Entity:** The Primo IT Tech LLC (Florida Limited Liability Company)  
**Managing Member:** Keith Franklin  
**Copyright:** © 2026 The Primo IT Tech LLC. All Rights Reserved.  
**Product:** Clear Path (`cigFREE`) v1.0.0  

---

## 1. Corporate & Store Listing Compliance
- **Publisher Name:** The Primo IT Tech LLC
- **Price Tier:** **$0.99 USD One-Time Download** on Apple App Store (`com.primoittech.clearpath`) and Google Play Store (`com.primoittech.clearpath`).
- **Monetization Rules Enforced:**
  - `hasSubscriptions`: `false`
  - `hasInAppPurchases`: `false`
  - `requiresUserAccount`: `false`
  - `promisesSpecificNetProceedsAfterFeesOrTaxes`: `false` (Store listing and in-app disclosure explicitly state that platform commissions and applicable taxes vary by store/jurisdiction and no specific net amount after app-store fees or taxes is promised).

---

## 2. Pre-Release Image Clearance & Placeholder Disclosure Audit
In accordance with the product brief:
> *"Use only images that are legally cleared for this specific use: documented licenses or written, informed permission from the photographer and identifiable people shown. Do not scrape images, assume online availability means permission, or generate fake images presented as real patient photos... Before release, identify any placeholder images or unverified health claims clearly. Do not present placeholders as real patient images or unreviewed claims as medical facts."*

### Current Visual Asset Status in v1.0.0:
1. **100% Original Non-Graphic & Direct Educational SVG Illustrations**:
   - All 9 journey visuals and 3 inspirational interlude visuals bundled in v1.0.0 are original vector diagrams created by **The Primo IT Tech LLC** under internal proprietary license (`PRIMO-SVG-2026-CLEARPATH`).
   - Every visual is explicitly badged in the UI as: **`Educational Illustration — Not a Real Patient Photo`**.
2. **Real-Life Clinical Photography Placeholder Identification**:
   - Where future releases may optionally incorporate real-world clinical or photographic imagery (such as direct clinical pathology photography), those slots are explicitly marked in the **Image Rights & Consent Ledger** (`src/data/clearPathData.js`) with `isPlaceholderForRealPhoto: true` and `releaseAuditNote: "Educational vector diagram used in place of clinical photography. Before replacing with any real-world photograph, obtain written photographer license and signed HIPAA/informed subject consent release."`
   - No scraped, unverified, or AI-generated fake patient photos exist anywhere in this repository.

---

## 3. Pre-Release Health & Medical Claim Verification Audit
In accordance with the product brief:
> *"Present quitting benefits in short, readable cards. Use medically reviewed wording and cite trustworthy sources inside the app. Do not invent precise health timelines or guarantee outcomes. Have a qualified reviewer verify any specific time-based health claims before release."*

### Audit Table of Educational Benefit Cards (`src/data/clearPathData.js`):
| Card ID | Topic | Public Health Citation | Pre-Release Clinical Review Status |
| :--- | :--- | :--- | :--- |
| `benefit-circulation` | Heart & Circulation Support | U.S. Surgeon General *Smoking Cessation* Report (2020); CDC | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
| `benefit-carbon-monoxide` | Oxygen & Carbon Monoxide Balance | CDC — *Benefits of Quitting Smoking*; WHO Tobacco Fact Sheet | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
| `benefit-breathing` | Breathing & Cilia Recovery | American Lung Association; U.S. Surgeon General (2020) | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
| `benefit-senses` | Taste, Smell & Everyday Comfort | National Cancer Institute (`Smokefree.gov`); CDC | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
| `benefit-long-term` | Long-Term Cardiovascular & Lung Resilience | World Health Organization (WHO); CDC | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
| `benefit-financial` | Financial Savings & Household Budget | User-Entered Optional Estimate Formula (Non-Medical) | **Verified Mathematical Estimate Formula (Labeled as Estimate)** |
| `benefit-secondhand` | Smoke-Free Home & Loved Ones | CDC — *Health Effects of Secondhand Smoke*; WHO | **Educational Summary — Pending Final Sign-Off by Qualified Medical Reviewer Before Clinical Release** |
