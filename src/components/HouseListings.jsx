import { currency, percent } from "../utils/mortgageCalculations";

export default function HouseListings({ listings, selectedId, onSelect, timeline }) {
  if (timeline === "Not anytime soon") {
    return (
      <section className="card long-term-plan">
          <span className="eyebrow">Long-term plan</span>
          <h2>No pressure to shop yet</h2>
        <p>Because the timeline is not anytime soon, this plan focuses on savings, credit, and debt preparation instead of forcing listings.</p>
      </section>
    );
  }

  return (
    <section className="card listings-section">
      <div className="section-header split">
        <div>
          <span className="eyebrow">House matching</span>
          <h2>Listings ranked against your plan <Help text="Each match is scored against your estimated payment, DTI, housing ratio, savings, timeline, and preferred home type." /></h2>
        </div>
      </div>
      <div className="listing-grid">
        {listings.map((listing) => (
          <button className={`listing-card ${selectedId === listing.id ? "selected" : ""}`} type="button" key={listing.id} onClick={() => onSelect(listing)}>
            <img className="listing-image" src={listing.image} alt={`${listing.type} in ${listing.location}`} />
            <span className={`rating ${listing.rating.replaceAll(" ", "-").toLowerCase()}`}>{listing.rating}</span>
            <h3>{listing.name}</h3>
            <p>{listing.location} · {listing.type} · {listing.beds} bd / {listing.baths} ba</p>
            <strong>{currency(listing.price)}</strong>
            <small>{currency(listing.plan.totalHousingPayment)} monthly · DTI {percent(listing.plan.dtiRatio)}</small>
            <span>{listing.explanation}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Help({ text }) {
  return <button className="help-dot" type="button" aria-label={text}>?<span className="help-tooltip" role="tooltip">{text}</span></button>;
}
