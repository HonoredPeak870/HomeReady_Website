# PRESENTATION.md - STAR Framework

**Project:** HomeReady Planner  
**Course:** IS219  
**Track:** Can I buy a house?  
**Date:** May 11, 2026

## STAR Presentation Outline

### S - Situation

Housing affordability is confusing for students and early-career buyers because the listed home price is not the real monthly cost. A buyer may look at a mortgage estimate and think the payment works, but taxes, insurance, PMI, debt, credit score, and emergency savings can change the decision. This matters because buying too early can leave someone house poor, unable to handle repairs, or unable to qualify for a safe loan.

### T - Task

My task was to answer one practical question: **Can this buyer responsibly afford a home right now?**

The viewer should be able to enter their own income, debt, savings, credit score, target location, and target price, then understand whether the plan is ready, almost ready, or risky. The project also needed to show a meaningful interaction, not just static numbers.

### A - Action

I built a React/Vite web app that works as a home-buying readiness planner. The app has four main views:

1. **Questionnaire:** collects location, income, savings, debt, credit, target price, timeline, and assumptions.
2. **Readiness Dashboard:** calculates monthly housing cost, DTI, housing ratio, savings gap, affordable range, and readiness score.
3. **House Matching:** ranks example homes by affordability, preferred location, home type, DTI, and savings coverage.
4. **Selected House Breakdown:** shows a price slider, payment breakdown, affordability guardrails, recommendation, and risk note.

The key data transformation is the mortgage model. Annual income becomes monthly income. Mortgage rate becomes a monthly rate. The app calculates principal and interest, tax, insurance, PMI, housing ratio, DTI, remaining savings needed, and months to goal.

The main interaction is the selected-house price slider. Moving the slider recalculates the chart and can change whether the house is comfortable, stretched, or risky.

I also added an AI assistant that explains DTI, PMI, readiness, plan strategy, and house comparisons in plain language.

### R - Result

The result is a practical decision tool. The app does not just say whether a user can technically afford a mortgage. It shows what makes the plan safe or risky.

Headline numbers to point out during the demo:

- The app uses **28% housing ratio** as the target line for monthly housing burden.
- The app uses **43% DTI** as a warning line for total debt burden.
- The selected-house slider shows when a house crosses those thresholds.

The main takeaway is: **a buyer is more ready when the monthly payment, DTI, down payment, savings buffer, and timeline all work together.**

One limitation is that the app estimates readiness. It is not a mortgage approval, and listing matches should be verified against current property sources and lender quotes.

## Demo Flow

### 1. State the Claim

Open with the hero section: "A realistic home-buying decision must include taxes, insurance, debt, credit, savings, and timeline instead of relying on mortgage principal and interest alone."

### 2. Complete or Review the Questionnaire

Show the four sections: Location, Finances, Savings, and Assumptions. Explain that each input affects the final affordability result.

### 3. Generate the Plan

Point to the readiness rating, affordable range, monthly housing cost, DTI, housing ratio, savings still needed, and timeline estimate.

### 4. Show House Matching

Select one listing and explain that each house is ranked against the user's plan rather than shown randomly.

### 5. Demonstrate the Slider

Move the selected-house price slider. Narrate the change:

> "As the price increases, monthly payment rises. If DTI crosses 43% or the housing ratio crosses 28%, the house becomes riskier. That is the meaningful interaction because it changes the conclusion."

### 6. Use the AI Assistant

Ask one of these:

- What is DTI?
- What is PMI?
- Recommend a plan.
- Which house is safest?
- What else can I ask you?

Explain that the AI uses the calculated values from the plan to explain the result in plain language.

### 7. End With the Takeaway

Close with:

> "The safest buying decision is not just the cheapest house. It is the plan where the monthly payment, DTI, down payment, savings buffer, and timeline stay inside safer guardrails."

## Key Claims To Defend

**Q: Why use 28% for housing ratio?**  
A: It is a common housing affordability target. The app treats it as a planning guardrail, not a legal rule.

**Q: Why use 43% for DTI?**  
A: Many mortgage decisions pay close attention to DTI. The app uses 43% as a warning line because crossing it usually means the plan deserves closer review.

**Q: Why include taxes, insurance, and PMI?**  
A: Because buyers pay those costs monthly. Ignoring them makes affordability look safer than it really is.

**Q: Are these real listings?**  
A: The houses are planning examples matched to the user's location and target price. A real buyer should verify current availability and pricing through property sources.

**Q: What role does AI play?**  
A: The AI assistant explains the calculated plan, recommends a conservative/balanced/stretch strategy, defines DTI and PMI, and helps the user understand what to change first.

## Slide Notes

**Slide 1:** HomeReady Planner title, question, and claim.

**Slide 2:** Why this matters to students and first-time buyers.

**Slide 3:** Inputs and data model: income, debt, savings, credit, location, home price.

**Slide 4:** Metrics: monthly payment, housing ratio, DTI, savings gap, PMI.

**Slide 5:** House matching and selected-house guardrail chart.

**Slide 6:** Demonstrate price slider before/after.

**Slide 7:** AI assistant examples.

**Slide 8:** Limits and next steps.

## Timing

| Section | Duration | Notes |
|---|---:|---|
| Situation | 30 sec | Explain why home-buying readiness matters |
| Task | 20 sec | State the essential question |
| Action | 90 sec | Show questionnaire, dashboard, matching, and slider |
| Result | 60 sec | Explain guardrails and takeaway |
| AI demo | 30 sec | Ask DTI or plan recommendation question |
| Limits | 20 sec | Mention lender verification and current listings |

## Accessibility Notes

- Inputs and buttons are keyboard accessible.
- Sliders are native range inputs.
- Images include alt text.
- Help icons show explanatory text on hover and keyboard focus.
- Text explanations accompany the charts so users do not have to rely on color alone.

## Backup Talking Points

**If asked why this app is different from a mortgage calculator:**  
It includes DTI, savings gap, readiness scoring, location-aware matching, and AI explanations instead of only calculating principal and interest.

**If asked what the project would add next:**  
I would add live listing data, live mortgage rates, HOA costs, closing costs, and a downloadable action plan.

**If asked what the biggest limitation is:**  
This app estimates readiness. A real buying decision still requires lender quotes, inspection results, current tax data, and verified listing information.
