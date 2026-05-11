export async function askHomeBuyingAssistant(question, plan) {
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    if (geminiKey) return askGemini(question, plan, geminiKey);
    if (openAiKey) return askOpenAi(question, plan, openAiKey);
  } catch (error) {
    console.error("AI provider failed, using local guidance:", error);
  }

  return localFallback(question, plan);
}

async function askGemini(question, plan, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(question, plan) }] }],
      generationConfig: { temperature: 0.45, maxOutputTokens: 760 },
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || localFallback(question, plan);
}

async function askOpenAi(question, plan, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.45,
      max_tokens: 760,
      messages: [
        { role: "system", content: "You are a practical home-buying affordability advisor. Explain tradeoffs clearly, prioritize safety, recommend plans when useful, and use only the provided calculated values. Do not invent financial numbers, live listing facts, lender approvals, or legal/tax advice." },
        { role: "user", content: buildPrompt(question, plan) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || localFallback(question, plan);
}

function buildPrompt(question, plan) {
  const selected = plan.selectedListing;
  const rankedListings = (plan.listings || []).slice(0, 5).map((listing, index) => (
    `${index + 1}. ${listing.name} in ${listing.location}: ${money(listing.price)}, ${listing.rating}, estimated monthly ${money(listing.plan?.totalHousingPayment)}, housing ratio ${number(listing.plan?.housingRatio)}%, DTI ${number(listing.plan?.dtiRatio)}%. Reason: ${listing.explanation}`
  )).join("\n");

  return `User question: ${question}

Calculated plan data:
- Readiness: ${plan.readiness?.category} (${plan.readiness?.score}/100)
- Annual income: ${money(plan.annualIncome)}
- Credit score: ${plan.creditScore || "not provided"}
- Target home price: ${money(plan.homePrice)}
- Down payment: ${money(plan.downPayment)} (${number(plan.downPaymentPct)}%)
- Current savings: ${money(plan.savings)}
- Monthly debt: ${money(plan.monthlyDebt)}
- Principal and interest: ${money(plan.principalInterest)} monthly
- Property tax: ${money(plan.propertyTax)} monthly using ${number(plan.taxRate)}%
- Homeowner insurance: ${money(plan.insurance)} monthly using ${number(plan.insuranceRate)}%
- PMI: ${money(plan.pmi)} monthly
- Total monthly housing cost: ${money(plan.totalHousingPayment)}
- Housing ratio: ${number(plan.housingRatio)}%
- Debt-to-income ratio: ${number(plan.dtiRatio)}%
- Remaining savings needed: ${money(plan.remainingSavingsNeeded)}
- Timeline estimate: ${plan.monthsToGoal} months
- Selected listing: ${selected ? `${selected.name}, ${money(selected.price)}, rating ${selected.rating}` : "none"}
- Ranked listings:
${rankedListings || "No ranked listings available."}
- Recommended actions: ${(plan.readiness?.actions || []).join(" | ")}

Answer like an expert advisor in plain language. Use 2-5 short paragraphs or bullets. Start with the direct answer, then explain the reason using calculated ratios and listings. If the user asks whether something is too expensive, compare housing ratio to 28% and DTI to 43%, then name the biggest lever to fix it. If they ask for a plan recommendation, compare a conservative, balanced, and stretch approach using the affordable range, selected listing, DTI, savings gap, and actions. If they ask which house is best, rank the options using the provided listing ratings and risks. If they ask what else they can ask, give practical example questions. If they ask for exact lender approval or live listing facts, say this app estimates readiness and they should verify with a lender/listing source.`;
}

function money(value) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function number(value) {
  return Number(value || 0).toFixed(1);
}

function localFallback(question, plan) {
  const lower = question.toLowerCase();
  const bestListing = plan.listings?.[0] || plan.selectedListing;

  if (lower.includes("plan") || lower.includes("recommend") || lower.includes("strategy")) {
    const selected = plan.selectedListing || bestListing;
    const conservativePrice = Math.round((plan.affordableRangeLow || plan.homePrice || 0) / 1000) * 1000;
    const balancedPrice = Math.round((plan.estimatedAffordablePrice || plan.homePrice || 0) / 1000) * 1000;
    const stretchPrice = Math.round((plan.affordableRangeHigh || plan.homePrice || 0) / 1000) * 1000;
    return `I would use a balanced plan unless the selected house pushes your ratios too high. Conservative means shopping around $${conservativePrice.toLocaleString()} to protect monthly cash flow. Balanced means staying near $${balancedPrice.toLocaleString()}, where the payment is closer to the safer range. Stretch means going up toward $${stretchPrice.toLocaleString()}, but only if DTI stays near or below 43% and the savings gap is manageable.

For your current plan, the key numbers are $${Math.round(plan.totalHousingPayment || 0).toLocaleString()} monthly, ${(plan.housingRatio || 0).toFixed(1)}% housing ratio, ${(plan.dtiRatio || 0).toFixed(1)}% DTI, and $${Math.round(plan.remainingSavingsNeeded || 0).toLocaleString()} still needed. ${selected ? `The selected house, ${selected.name}, is ${selected.rating}, so I would judge it by whether its monthly payment still leaves room for repairs, utilities, and emergencies.` : "Pick a house from the matches and I can explain whether it fits the plan."}`;
  }

  if (lower.includes("best") || lower.includes("house") || lower.includes("listing") || lower.includes("recommend")) {
    if (!bestListing) return "Generate a plan first, then I can compare the ranked house options against your ratios and savings.";
    return `The strongest option right now is ${bestListing.name} in ${bestListing.location}. It is rated ${bestListing.rating} with an estimated monthly cost of $${Math.round(bestListing.plan?.totalHousingPayment || 0).toLocaleString()}, housing ratio of ${(bestListing.plan?.housingRatio || 0).toFixed(1)}%, and DTI of ${(bestListing.plan?.dtiRatio || 0).toFixed(1)}%.

I would treat that as the best fit because it keeps the payment more aligned with your income than the higher-priced options. Compare houses by monthly payment first, then location and size second.`;
  }

  if (lower.includes("what can i ask") || lower.includes("what else") || lower.includes("help")) {
    return `You can ask me things like:

- What is DTI and why does mine matter?
- What is PMI?
- Which house is safest for my budget?
- Why am I not ready yet?
- What should I change first: debt, savings, down payment, or price?
- How would a cheaper house change my monthly payment?
- Explain the selected house in plain English.`;
  }

  if (lower.includes("make it look nicer") || lower.includes("nicer") || lower.includes("visual") || lower.includes("graph")) {
    return `The most useful visual for this decision is an affordability guardrail chart: monthly payment, housing ratio, DTI, and down payment percentage compared against safe targets. That is better than a decorative chart because it directly shows whether a house is comfortable, risky, or out of range.

For this app, I would also use the price slider to show what changes when the house price moves. If DTI crosses 43%, housing crosses 28%, or down payment falls below 20%, the visual should make that risk obvious.`;
  }

  if (lower.includes("dti") || lower.includes("debt-to-income") || lower.includes("debt to income")) {
    return `DTI means debt-to-income ratio. It compares your monthly housing cost plus other monthly debt to your gross monthly income. Your current DTI is ${(plan.dtiRatio || 0).toFixed(1)}%.

A lower DTI usually gives you more room for emergencies, repairs, utilities, and lender approval. This planner uses 43% as an important warning line because many mortgage decisions look closely at that area.`;
  }

  if (lower.includes("pmi")) {
    return `PMI means private mortgage insurance. It is usually added when the down payment is below 20%. It protects the lender, not the buyer, but the buyer pays it monthly.

In this plan, PMI is estimated at $${Math.round(plan.pmi || 0).toLocaleString()} per month. Increasing the down payment to 20% can remove this estimate and lower the monthly housing cost.`;
  }

  if (lower.includes("too much") || lower.includes("too high") || lower.includes("afford") || lower.includes("expensive")) {
    const housingStatus = plan.housingRatio <= 28 ? "within the usual 28% housing target" : `above the usual 28% housing target by ${(plan.housingRatio - 28).toFixed(1)} percentage points`;
    const dtiStatus = plan.dtiRatio <= 43 ? "under the common 43% DTI ceiling" : `above the common 43% DTI ceiling by ${(plan.dtiRatio - 43).toFixed(1)} percentage points`;
    return `This plan is ${plan.housingRatio <= 28 && plan.dtiRatio <= 43 ? "within the main affordability guardrails" : "stretched based on the ratios"}. Your estimated monthly housing cost is $${Math.round(plan.totalHousingPayment || 0).toLocaleString()}, which puts housing at ${(plan.housingRatio || 0).toFixed(1)}% of gross income. That is ${housingStatus}. Your total DTI is ${(plan.dtiRatio || 0).toFixed(1)}%, which is ${dtiStatus}.

The biggest lever is usually lowering the target home price or increasing the down payment. Reducing monthly debt also helps because it directly improves DTI. A safer estimated range from this plan is about $${Math.round(plan.affordableRangeLow || 0).toLocaleString()} to $${Math.round(plan.affordableRangeHigh || 0).toLocaleString()}.`;
  }

  if (lower.includes("credit")) {
    return `Your entered credit score is ${plan.creditScore || "not provided"}. Credit matters because it can change the mortgage rate, and the rate directly changes the principal-and-interest payment. Improving credit can lower the monthly payment and make more homes qualify as safer matches.`;
  }

  if (lower.includes("tax") || lower.includes("insurance")) {
    return `Taxes and insurance are included in the monthly housing estimate. This plan uses ${plan.taxRate?.toFixed(2)}% for property tax and ${plan.insuranceRate?.toFixed(2)}% for insurance. Together, they add $${Math.round((plan.propertyTax || 0) + (plan.insurance || 0)).toLocaleString()} per month before PMI.`;
  }

  if (lower.includes("save") || lower.includes("ready")) {
    return `Your readiness category is ${plan.readiness?.category}. The remaining savings gap is ${plan.remainingSavingsNeeded ? `$${Math.round(plan.remainingSavingsNeeded).toLocaleString()}` : "$0"}. If the savings gap is low but readiness is still weak, the issue is monthly affordability: housing ratio is ${(plan.housingRatio || 0).toFixed(1)}% and DTI is ${(plan.dtiRatio || 0).toFixed(1)}%.`;
  }

  return `Here is the short version: your estimated monthly housing cost is $${Math.round(plan.totalHousingPayment || 0).toLocaleString()}, your housing ratio is ${(plan.housingRatio || 0).toFixed(1)}%, and your DTI is ${(plan.dtiRatio || 0).toFixed(1)}%. The plan is marked ${plan.readiness?.category} because it compares monthly affordability, savings, down payment, and credit against safer buying targets.

The most important thing to watch is not just whether you have enough cash. It is whether the monthly payment leaves room for debt, repairs, utilities, and emergencies after closing.`;
}
