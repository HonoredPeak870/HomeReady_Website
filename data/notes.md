# Data Notes

## Source Summary

This project combines user-entered financial information with transparent mortgage-planning assumptions. The app does not claim lender approval. It estimates readiness by combining payment safety, debt-to-income ratio, down payment percentage, savings buffer, credit score, and timeline.

## Provenance

- Consumer mortgage education context: Consumer Financial Protection Bureau mortgage tools, retrieved 2026-05-11.
- DTI benchmark context: Fannie Mae underwriting guidance, retrieved 2026-05-11.
- Housing ratio benchmark context: common 28/36 affordability rule, retrieved 2026-05-11.
- Local project assumptions: `src/data/defaultAssumptions.js`, retrieved from this repository on 2026-05-11.
- Listing templates and regional image mapping: `src/data/listingData.js`.

## Cleaning And Transformation Notes

- Money-like user inputs are cleaned by removing `$`, `%`, commas, and spaces before numeric conversion.
- Annual income is converted to gross monthly income by dividing by 12.
- Annual interest rate is converted to a monthly decimal rate for the amortization formula.
- Property tax and insurance are converted from annual percentages to monthly dollar estimates.
- PMI is included only when down payment is below 20%.
- Listing prices are generated around the user's target home price using documented price factors, then rounded to the nearest $5,000.

## Data Viability Audit

### Missing Values

The questionnaire ships with starter values so the app can demonstrate a complete plan immediately. Optional property tax and insurance fields fall back to visible default assumptions when left blank.

### Weird Fields

User-entered text fields can include commas, dollar signs, or percent symbols. The parser removes these symbols before calculation.

### Limits And Bias

- The app estimates readiness; it cannot approve a mortgage.
- Tax, insurance, and PMI estimates may differ from real quotes.
- Listing matches are planning examples and should be verified against current listing sources.
- The model does not include HOA fees, closing costs, maintenance, utilities, inspection risk, or neighborhood-level price history.
- AI-generated house visuals are representative regional images, not exact property photos.

## What This Dataset Cannot Prove

This dataset cannot prove that a user will be approved by a lender, that a specific listing is available, or that the user should buy immediately. It can show whether the entered plan crosses common affordability warning lines and which financial lever would improve readiness first.
