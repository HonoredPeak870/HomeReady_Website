# HomeReady Planner

An interactive React/Vite data story that answers: **Can I afford to buy a house right now?**

## Essential Question

Can a first-time buyer responsibly afford a target home when mortgage payment, taxes, insurance, PMI, debt, savings, credit, and timeline are all included?

## Claim

Home-buying readiness depends on more than the principal-and-interest mortgage payment; taxes, insurance, debts, credit score, savings, and timeline can change whether a house is financially safe.

## Audience

- College students and recent graduates thinking about future homeownership.
- Early-career workers deciding whether buying is realistic now or later.
- First-time buyers comparing a target price against monthly affordability.
- Personal finance learners who need plain-language explanations of DTI, PMI, and down payment tradeoffs.

## STAR Draft

**S - Situation:** Students and early-career workers often hear that buying a home is the next milestone, but the sticker price hides the real monthly cost.

**T - Task:** The viewer should be able to decide whether a home-buying plan is ready, risky, or needs adjustment before shopping seriously.

**A - Action:** The app collects financial inputs, calculates mortgage costs and affordability ratios, ranks example house matches, and provides an AI guide that explains the results.

**R - Result:** The main result is a readiness category, a safer affordable range, a selected-house guardrail chart, and an action plan showing the biggest financial lever to improve.

## Data Story

### Claim -> Evidence -> Interaction -> Takeaway

**Claim:** A buyer should not judge affordability by principal and interest alone.

**Evidence:** The app calculates monthly principal and interest, property tax, insurance, PMI, housing ratio, DTI, down payment percentage, remaining savings needed, and timeline.

**Interaction:** The selected-house price slider changes monthly payment, housing ratio, DTI, PMI, and down payment percentage in real time. This can change a house from comfortable to risky.

**Takeaway:** A house is safer when the monthly payment stays near the buyer's comfort level, housing ratio stays near 28%, DTI stays near or below 43%, and the buyer still has emergency savings after the down payment.

## Project Structure

```text
FINAL-studentr-reality-lab/
├── data/
│   ├── raw.json
│   ├── processed.json
│   └── notes.md
├── public/
│   └── houses/
│       └── regional AI-generated listing visuals
├── src/
│   ├── components/
│   │   ├── Questionnaire.jsx
│   │   ├── ResultsDashboard.jsx
│   │   ├── HouseListings.jsx
│   │   ├── HouseDetail.jsx
│   │   ├── ChatBot.jsx
│   │   └── AccountPanel.jsx
│   ├── data/
│   │   ├── defaultAssumptions.js
│   │   └── listingData.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── propertyDataService.js
│   │   └── storageService.js
│   └── utils/
│       ├── mortgageCalculations.js
│       ├── affordabilityScoring.js
│       └── listingScoring.js
├── README.md
└── PRESENTATION.md
```

## Tech Stack

- React 18
- Vite
- CSS Grid and Flexbox
- Local JSON/data modules
- Optional Gemini or OpenAI API integration through environment variables
- AI-generated regional house images created with the course AI toolkit

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

**Live URL:** Add your deployed Vercel, Netlify, or GitHub Pages link here.

Recommended deployment settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Dataset & Provenance

| Data/Assumption | Source | Units | Retrieved | Usage |
|---|---|---:|---|---|
| User financial inputs | In-app questionnaire | USD, percent, score | User-entered | Personalizes the plan |
| 28% housing ratio target | Common 28/36 affordability rule | Percent | 2026-05-11 | Warning line for monthly housing burden |
| 43% DTI warning line | Mortgage underwriting guidance context | Percent | 2026-05-11 | Warning line for total debt burden |
| Mortgage formula | Standard fixed-rate amortization formula | USD/month | 2026-05-11 | Calculates principal and interest |
| Property tax defaults | Local project assumptions by location | Percent/year | 2026-05-11 | Estimates monthly tax when user leaves tax blank |
| Insurance and PMI assumptions | Local project assumptions | Percent/year | 2026-05-11 | Estimates monthly insurance and PMI |
| Regional house visuals | AI Toolkit image generation workflow | PNG images | 2026-05-11 | Representative listing visuals by region and home type |

## Data Dictionary

| Field | Meaning | Units | Source/Derivation |
|---|---|---:|---|
| `annualIncome` | Gross household annual income | USD/year | User input |
| `monthlyIncome` | Gross monthly income | USD/month | Annual income / 12 |
| `homePrice` | Target or selected home price | USD | User input or listing selection |
| `downPayment` | Cash applied to purchase price | USD | User input, capped by model logic |
| `monthlyDebt` | Existing monthly debt obligations | USD/month | User input |
| `principalInterest` | Monthly mortgage principal and interest | USD/month | Fixed-rate mortgage formula |
| `propertyTax` | Estimated monthly property tax | USD/month | Home price x tax rate / 12 |
| `insurance` | Estimated monthly homeowner's insurance | USD/month | Home price x insurance rate / 12 |
| `pmi` | Estimated private mortgage insurance | USD/month | Included if down payment is below 20% |
| `totalHousingPayment` | Estimated monthly housing cost | USD/month | Principal + interest + tax + insurance + PMI |
| `housingRatio` | Housing payment as share of gross income | Percent | Total housing payment / monthly income |
| `dtiRatio` | Housing plus debts as share of gross income | Percent | (Housing payment + debt) / monthly income |
| `remainingSavingsNeeded` | Gap to target down payment plus emergency buffer | USD | Required cash - current savings |
| `monthsToGoal` | Estimated months to close savings gap | Months | Gap / estimated savings capacity |

## Data Viability Audit

### Missing Values

The app includes starter inputs so the story is immediately viewable. Optional tax and insurance fields use visible defaults if blank. Numeric text is cleaned before calculation so dollar signs, commas, and percent symbols do not break the model.

### Cleaning Plan

Inputs are parsed in `src/utils/mortgageCalculations.js`. The model removes formatting characters, converts strings to numbers, converts annual values to monthly values, and applies documented fallback assumptions from `src/data/defaultAssumptions.js`.

### What This Data Cannot Prove

- It cannot approve a mortgage or replace a lender quote.
- It cannot prove that a specific property is available.
- It does not include every real ownership cost, such as HOA fees, utilities, inspection findings, closing costs, maintenance, or moving costs.
- It uses representative regional listing visuals, not exact property photos.
- It estimates readiness from common financial guardrails, not legal, tax, or underwriting advice.

## Cleaning & Transform Notes

1. Annual income is divided by 12 to estimate gross monthly income.
2. Mortgage rate is converted from annual percent to monthly decimal rate.
3. Property tax and insurance are estimated monthly from annual percentage assumptions.
4. PMI is included when down payment percentage is below 20%.
5. DTI and housing ratio are recalculated whenever the target home price or selected-house slider changes.
6. Listings are matched by affordability score, DTI, savings coverage, preferred area, and preferred home type.

## Definitions

- **DTI:** Debt-to-income ratio. Monthly housing plus other monthly debt divided by gross monthly income.
- **Housing Ratio:** Monthly housing payment divided by gross monthly income.
- **PMI:** Private mortgage insurance, often added when down payment is below 20%.
- **Affordable Range:** A safer home-price range estimated from income, debt, down payment, taxes, insurance, and interest rate.
- **Readiness Score:** A combined score based on payment safety, DTI, down payment, savings buffer, and credit score.

## Interaction Design

The most important interaction is the selected-house price slider. It matters because it changes the actual conclusion: moving the price can push monthly payment above the user's comfort level, DTI above 43%, or down payment below the 20% PMI threshold.

The app also includes ranked listing selection and an AI assistant. The AI guide explains DTI, PMI, readiness, listing risk, and plan strategy using the calculated values rather than generic advice.

## Views

1. **Context/Input:** Questionnaire collecting financial and housing-preference information.
2. **Evidence:** Readiness dashboard showing payment, ratios, savings gap, and assumptions.
3. **Segmentation:** House matching by location, home type, and affordability score.
4. **Takeaway:** Selected-house guardrail chart, recommendation, risk note, and AI explanation.

## API Keys

Optional AI keys should be stored in environment variables, not hard-coded:

- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`

Property data credentials should also use environment variables if added later, such as `VITE_PROPERTY_API_KEY`.

## Accessibility & Performance

- Inputs, buttons, and sliders are keyboard accessible.
- House images include alt text.
- Help icons expose explanatory text on hover and keyboard focus.
- Calculations are lightweight and run locally without blocking large file parsing.
- The production build is generated with Vite.

## Limits & What I'd Do Next

- Add a real property API for current listings.
- Add current lender rate feeds instead of default rates.
- Add HOA, maintenance, closing cost, and utilities fields.
- Add a city-level price dataset for stronger regional evidence.
- Add authentication beyond browser localStorage.
- Add a downloadable plan summary for users preparing to speak with a lender.

## Grading Rubric Alignment

**Story + Claim + STAR clarity:** Clear question, claim, context, interaction, and takeaway.

**Data rigor:** Data folder, source notes, assumptions, dictionary, and viability audit are included.

**Visualization correctness:** Guardrail and payment breakdown visuals use labeled values and visible thresholds.

**Interaction design:** The selected-house slider changes the view and conclusion meaningfully.

**Engineering:** `npm run dev` and `npm run build` work, assumptions are centralized, and the app is responsive.
