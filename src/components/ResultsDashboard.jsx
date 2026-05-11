import { currency, percent } from "../utils/mortgageCalculations";
import { describeCreditImpact } from "../utils/affordabilityScoring";

const helpText = {
  readiness: "Readiness combines payment safety, DTI, savings, down payment, and credit score into one practical rating.",
  range: "Affordable range estimates a safer home-price zone based on your income, debts, down payment, taxes, insurance, and interest rate.",
  monthly: "Monthly housing cost includes principal and interest, estimated property tax, insurance, and PMI when applicable.",
  dti: "Debt-to-income ratio compares monthly housing plus other debt to gross monthly income. Many lenders watch 43% closely.",
  housing: "Housing ratio compares only the monthly housing cost to gross monthly income. A common target is 28% or less.",
  savings: "Savings still needed estimates the cash gap for down payment plus an emergency buffer after buying.",
  timeline: "Timeline estimates how long it may take to close the savings gap based on an assumed savings pace.",
};

export default function ResultsDashboard({ plan, onAdjust }) {
  const timeline = `${plan.monthsToGoal} months`;

  return (
    <section className="dashboard-grid" aria-label="Personalized results dashboard">
      <div className="card hero-result">
        <span className="eyebrow">Readiness rating <Help text={helpText.readiness} /></span>
        <h2>{plan.readiness.category}</h2>
        <p>{plan.readiness.summary}</p>
        <div className="score-meter"><span style={{ width: `${plan.readiness.score}%` }} /></div>
        <div className="result-actions"><button type="button" onClick={onAdjust}>Adjust answers</button></div>
      </div>
      <Metric label="Affordable range" help={helpText.range} value={`${currency(plan.affordableRangeLow)} - ${currency(plan.affordableRangeHigh)}`} />
      <Metric label="Monthly housing cost" help={helpText.monthly} value={currency(plan.totalHousingPayment)} />
      <Metric label="Debt-to-income" help={helpText.dti} value={percent(plan.dtiRatio)} tone={plan.dtiRatio <= 43 ? "good" : "risk"} />
      <Metric label="Housing ratio" help={helpText.housing} value={percent(plan.housingRatio)} tone={plan.housingRatio <= 28 ? "good" : "risk"} />
      <Metric label="Savings still needed" help={helpText.savings} value={currency(plan.remainingSavingsNeeded)} />
      <Metric label="Timeline estimate" help={helpText.timeline} value={timeline} />

      <div className="card breakdown-card">
        <h3>Monthly Payment Breakdown</h3>
        <Line label="Principal & interest" value={currency(plan.principalInterest)} />
        <Line label="Property tax" value={currency(plan.propertyTax)} />
        <Line label="Homeowner's insurance" value={currency(plan.insurance)} />
        <Line label="PMI estimate" value={plan.pmi > 0 ? currency(plan.pmi) : "Not estimated"} />
        <Line label="Total housing cost" value={currency(plan.totalHousingPayment)} strong />
      </div>

      <div className="card action-card">
        <h3>Action Steps</h3>
        <p>{describeCreditImpact(plan.creditScore)}</p>
        <ul>
          {plan.readiness.actions.map((action) => <li key={action}>{action}</li>)}
        </ul>
      </div>

      <div className="card assumptions-card">
        <h3>Visible Assumptions</h3>
        <Line label="Interest rate" value={percent(plan.interestRate)} />
        <Line label="Loan term" value={`${plan.loanTermYears} years`} />
        <Line label="Down payment used" value={currency(plan.downPayment)} />
        <Line label="Property tax rate" value={percent(plan.taxRate)} />
        <Line label="Insurance rate" value={percent(plan.insuranceRate)} />
        <Line label="PMI warning" value={plan.downPaymentPct < 20 ? "Included because down payment is below 20%" : "No PMI estimate included"} />
      </div>
    </section>
  );
}

function Metric({ label, value, help, tone = "" }) {
  return <div className={`card metric ${tone}`}><span>{label} {help && <Help text={help} />}</span><strong>{value}</strong></div>;
}

function Line({ label, value, strong = false }) {
  return <div className={`line-item ${strong ? "strong" : ""}`}><span>{label}</span><b>{value}</b></div>;
}

function Help({ text }) {
  return <button className="help-dot" type="button" aria-label={text}>?<span className="help-tooltip" role="tooltip">{text}</span></button>;
}
