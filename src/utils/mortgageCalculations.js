import { defaultAssumptions, locationTaxDefaults } from "../data/defaultAssumptions.js";

export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function percent(value, decimals = 1) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(decimals)}%`;
}

export function getTaxRateForLocation(location = "") {
  const match = Object.entries(locationTaxDefaults).find(([key]) =>
    key !== "default" && location.toLowerCase().includes(key.toLowerCase())
  );
  return match ? match[1] : locationTaxDefaults.default;
}

export function calculateMortgagePayment(principal, annualRate, years) {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const payments = years * 12;
  if (monthlyRate === 0) return principal / payments;
  return principal * ((monthlyRate * (1 + monthlyRate) ** payments) / ((1 + monthlyRate) ** payments - 1));
}

function parseMoneyLike(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value || "").replace(/[$,%\s,]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasEnteredValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function calculatePlan(input) {
  const annualIncome = parseMoneyLike(input.annualIncome);
  const monthlyIncome = annualIncome / 12;
  const homePrice = parseMoneyLike(input.homePrice);
  const savings = parseMoneyLike(input.savings);
  const enteredDownPayment = parseMoneyLike(input.downPayment);
  const monthlyDebt = parseMoneyLike(input.monthlyDebt);
  const interestRate = hasEnteredValue(input.interestRate) ? parseMoneyLike(input.interestRate) : defaultAssumptions.interestRate;
  const loanTermYears = hasEnteredValue(input.loanTermYears) ? parseMoneyLike(input.loanTermYears) : defaultAssumptions.loanTermYears;
  const taxRate = hasEnteredValue(input.propertyTaxRate) ? parseMoneyLike(input.propertyTaxRate) : getTaxRateForLocation(input.location);
  const insuranceRate = hasEnteredValue(input.insuranceRate) ? parseMoneyLike(input.insuranceRate) : defaultAssumptions.insuranceRate;
  const estimatedMonthlyTaxesInsurance = (homePrice * (taxRate / 100)) / 12 + (homePrice * (insuranceRate / 100)) / 12;
  const estimatedEmergencyTarget = (estimatedMonthlyTaxesInsurance + monthlyDebt) * defaultAssumptions.emergencyMonths;
  const cashAvailableForDownPayment = Math.max(savings - estimatedEmergencyTarget, 0);
  const targetDownPayment = Math.min(homePrice, Math.max(enteredDownPayment, Math.min(cashAvailableForDownPayment, homePrice)));
  const downPayment = targetDownPayment;
  const principal = Math.max(homePrice - downPayment, 0);
  const principalInterest = calculateMortgagePayment(principal, interestRate, loanTermYears);
  const propertyTax = (homePrice * (taxRate / 100)) / 12;
  const insurance = (homePrice * (insuranceRate / 100)) / 12;
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const pmi = downPaymentPct < 20 ? (principal * (defaultAssumptions.pmiRate / 100)) / 12 : 0;
  const totalHousingPayment = principalInterest + propertyTax + insurance + pmi;
  const housingRatio = monthlyIncome > 0 ? (totalHousingPayment / monthlyIncome) * 100 : 0;
  const dtiRatio = monthlyIncome > 0 ? ((totalHousingPayment + monthlyDebt) / monthlyIncome) * 100 : 0;
  const requiredDownPayment = homePrice * (defaultAssumptions.targetDownPaymentPct / 100);
  const emergencyTarget = (totalHousingPayment + monthlyDebt) * defaultAssumptions.emergencyMonths;
  const cashNeeded = requiredDownPayment + emergencyTarget;
  const remainingSavingsNeeded = Math.max(cashNeeded - savings, 0);
  const monthlySavingsCapacity = Math.max(monthlyIncome * (defaultAssumptions.monthlySavingsCapacityPct / 100), 100);
  const monthsToGoal = remainingSavingsNeeded > 0 ? Math.ceil(remainingSavingsNeeded / monthlySavingsCapacity) : 0;
  const affordableMonthly = Math.max(monthlyIncome * (defaultAssumptions.maxHousingRatio / 100) - monthlyDebt * 0.15, 0);
  const estimatedAffordablePrice = estimateAffordablePrice(affordableMonthly, downPayment, interestRate, loanTermYears, taxRate, insuranceRate);

  return {
    ...input,
    annualIncome,
    monthlyIncome,
    homePrice,
    downPayment,
    enteredDownPayment,
    savings,
    monthlyDebt,
    interestRate,
    loanTermYears,
    taxRate,
    insuranceRate,
    principal,
    principalInterest,
    propertyTax,
    insurance,
    pmi,
    totalHousingPayment,
    housingRatio,
    dtiRatio,
    downPaymentPct,
    requiredDownPayment,
    emergencyTarget,
    remainingSavingsNeeded,
    monthsToGoal,
    estimatedAffordablePrice,
    affordableRangeLow: estimatedAffordablePrice * 0.85,
    affordableRangeHigh: estimatedAffordablePrice * 1.05,
  };
}

function estimateAffordablePrice(targetMonthly, downPayment, interestRate, years, taxRate, insuranceRate) {
  let low = 50000;
  let high = 1200000;
  for (let i = 0; i < 32; i += 1) {
    const mid = (low + high) / 2;
    const loan = Math.max(mid - downPayment, 0);
    const payment = calculateMortgagePayment(loan, interestRate, years) + (mid * (taxRate / 100)) / 12 + (mid * (insuranceRate / 100)) / 12;
    if (payment <= targetMonthly) low = mid;
    else high = mid;
  }
  return Math.round(low / 1000) * 1000;
}
