export const defaultAssumptions = {
  interestRate: 6.75,
  loanTermYears: 30,
  propertyTaxRate: 1.15,
  insuranceRate: 0.38,
  pmiRate: 0.55,
  targetDownPaymentPct: 20,
  maxHousingRatio: 28,
  maxDtiRatio: 43,
  emergencyMonths: 3,
  monthlySavingsCapacityPct: 10,
};

export const locationTaxDefaults = {
  "New Jersey": 2.05,
  Newark: 2.1,
  "Jersey City": 1.75,
  "New York": 1.45,
  Philadelphia: 1.35,
  default: defaultAssumptions.propertyTaxRate,
};
