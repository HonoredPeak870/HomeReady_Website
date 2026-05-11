import React from "react";
import { currency, percent, calculatePlan } from "../utils/mortgageCalculations";

export default function HouseDetail({ listing }) {
  const [price, setPrice] = React.useState(listing?.price || 0);

  React.useEffect(() => {
    setPrice(listing?.price || 0);
  }, [listing?.id, listing?.price]);

  if (!listing) return null;

  const adjustedPlan = calculatePlan({ ...listing.plan, homePrice: price });
  const maxCost = Math.max(adjustedPlan.principalInterest, adjustedPlan.propertyTax, adjustedPlan.insurance, adjustedPlan.pmi, 1);
  const comfortablePayment = Number(adjustedPlan.comfortPayment || 0);
  const paymentTarget = comfortablePayment > 0 ? comfortablePayment : adjustedPlan.monthlyIncome * 0.28;
  const dtiGap = adjustedPlan.dtiRatio - 43;
  const housingGap = adjustedPlan.housingRatio - 28;

  return (
    <section className="card detail-card">
      <div className="house-detail-hero">
        <img src={listing.image} alt={`${listing.type} in ${listing.location}`} />
        <div>
          <span className="eyebrow">Selected house breakdown <Help text="This section recalculates affordability for the selected listing, including monthly payment, tax, insurance, PMI, DTI, and down-payment impact." /></span>
          <h2>{listing.name}</h2>
          <p>{listing.overview}</p>
        </div>
      </div>

      <div className="detail-grid">
        <Detail label="Estimated price" value={currency(adjustedPlan.homePrice)} />
        <Detail label="Monthly cost" value={currency(adjustedPlan.totalHousingPayment)} help="Principal, interest, estimated taxes, insurance, and PMI if applicable." />
        <Detail label="Taxes + insurance" value={currency(adjustedPlan.propertyTax + adjustedPlan.insurance)} help="These ownership costs are part of the monthly estimate, not extras after the mortgage." />
        <Detail label="DTI impact" value={percent(adjustedPlan.dtiRatio)} help="DTI compares housing plus other monthly debts against gross monthly income. Around 43% is a common warning line." />
      </div>

      <div className="what-if-panel">
        <div>
          <h3>What-if price slider <Help text="Move the price to test whether this house stays within safer monthly payment, DTI, and PMI guardrails." /></h3>
          <p>Move the price to see how monthly cost, housing ratio, and DTI change for this house.</p>
        </div>
        <strong>{currency(price)}</strong>
        <input
          type="range"
          min={Math.max(100000, Math.round(listing.price * 0.65))}
          max={Math.round(listing.price * 1.35)}
          step="5000"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
        />
      </div>

      <div className="chart-card guardrail-card">
        <h3>Affordability Guardrails <Help text="Green means the selected house is within the planning target. Amber or red means that number deserves closer attention before buying." /></h3>
        <p>These markers show whether this house is comfortable, stretched, or risky as the price changes.</p>
        <div className={`data-callout ${dtiGap > 0 || housingGap > 0 ? "risk" : "good"}`}>
          <strong>Data callout:</strong> This house puts DTI at {percent(adjustedPlan.dtiRatio)} {dtiGap > 0 ? `, ${dtiGap.toFixed(1)} points above` : `, ${Math.abs(dtiGap).toFixed(1)} points below`} the 43% warning line, and housing ratio at {percent(adjustedPlan.housingRatio)} {housingGap > 0 ? `, ${housingGap.toFixed(1)} points above` : `, ${Math.abs(housingGap).toFixed(1)} points below`} the 28% target.
        </div>
        <Guardrail label="Monthly payment" value={adjustedPlan.totalHousingPayment} target={paymentTarget} format={currency} mode="lower" />
        <Guardrail label="Housing ratio" value={adjustedPlan.housingRatio} target={28} format={(value) => percent(value)} mode="lower" />
        <Guardrail label="DTI" value={adjustedPlan.dtiRatio} target={43} format={(value) => percent(value)} mode="lower" />
        <Guardrail label="Down payment" value={adjustedPlan.downPaymentPct} target={20} format={(value) => percent(value)} mode="higher" />
      </div>

      <div className="story-card">
        <h3>What to notice</h3>
        <p>This view tests the selected house against the parts of home buying that are easy to underestimate. The listed price is only the starting point. As the slider moves, the app recalculates the monthly payment, taxes, insurance, PMI, housing ratio, DTI, and down-payment percentage. The important question is not just whether the buyer can make the payment once. It is whether the payment leaves enough room for existing debt, repairs, utilities, and emergency savings after closing. The 28% housing target shows whether the home itself is taking too much monthly income. The 43% DTI warning line shows whether housing plus other debt is becoming risky. The 20% down-payment marker explains when PMI is likely to add another monthly cost. If one guardrail turns amber or red, the buyer should lower the price, increase the down payment, reduce debt, or wait longer before buying. That is the main takeaway: readiness is a combination of payment safety, debt level, cash buffer, and timing.</p>
      </div>

      <div className="chart-card">
        <h3>Monthly Cost Breakdown <Help text="This breaks the estimated payment into the parts a buyer needs to budget for every month." /></h3>
        <BreakdownBar label="Principal & interest" value={adjustedPlan.principalInterest} max={maxCost} />
        <BreakdownBar label="Property tax" value={adjustedPlan.propertyTax} max={maxCost} />
        <BreakdownBar label="Insurance" value={adjustedPlan.insurance} max={maxCost} />
        <BreakdownBar label="PMI" value={adjustedPlan.pmi} max={maxCost} />
      </div>

      <p className="recommendation"><strong>Recommendation:</strong> {listing.explanation}</p>
      <p className="risk-note">Risk check: if taxes, HOA fees, repairs, or lender rates are higher than this estimate, the payment could become less comfortable.</p>
    </section>
  );
}

function Detail({ label, value, help }) {
  return <div><span>{label} {help && <Help text={help} />}</span><strong>{value}</strong></div>;
}

function BreakdownBar({ label, value, max }) {
  const width = `${Math.max((value / max) * 100, value > 0 ? 4 : 0)}%`;
  return (
    <div className="breakdown-bar">
      <div className="breakdown-bar-top"><span>{label}</span><strong>{currency(value)}</strong></div>
      <div className="bar-track"><span style={{ width }} /></div>
    </div>
  );
}

function Guardrail({ label, value, target, format, mode }) {
  const ratio = target > 0 ? value / target : 0;
  const status = mode === "higher"
    ? value >= target ? "good" : value >= target * 0.75 ? "watch" : "risk"
    : ratio <= 1 ? "good" : ratio <= 1.15 ? "watch" : "risk";
  const width = `${Math.min(Math.max(ratio * 100, 4), 140)}%`;
  const targetLeft = "100%";

  return (
    <div className={`guardrail ${status}`}>
      <div className="guardrail-top">
        <span>{label}</span>
        <strong>{format(value)} <small>target {format(target)}</small></strong>
      </div>
      <div className="guardrail-track">
        <span className="guardrail-fill" style={{ width }} />
        <i style={{ left: targetLeft }} />
      </div>
    </div>
  );
}

function Help({ text }) {
  return <button className="help-dot" type="button" aria-label={text}>?<span className="help-tooltip" role="tooltip">{text}</span></button>;
}
