import React from "react";
import Questionnaire from "./components/Questionnaire";
import ResultsDashboard from "./components/ResultsDashboard";
import HouseListings from "./components/HouseListings";
import HouseDetail from "./components/HouseDetail";
import ChatBot from "./components/ChatBot";
import AccountPanel from "./components/AccountPanel";
import { calculatePlan } from "./utils/mortgageCalculations";
import { scoreReadiness } from "./utils/affordabilityScoring";
import { matchListings } from "./utils/listingScoring";
import { getPropertyListings } from "./services/propertyDataService";
import { getCurrentUser } from "./services/storageService";

const starterAnswers = {
  location: "Newark, NJ",
  annualIncome: "78000",
  creditScore: "700",
  savings: "42000",
  downPayment: "35000",
  monthlyDebt: "520",
  homePrice: "335000",
  timeline: "Looking soon",
  homeType: "Any",
  comfortPayment: "2400",
  interestRate: "6.75",
  loanTermYears: "30",
  propertyTaxRate: "",
  insuranceRate: "",
};

function createPlanRecord(baseAnswers, chosenListingId = "") {
  const basePlan = calculatePlan(baseAnswers);
  const readiness = scoreReadiness(basePlan);
  const completePlan = { ...basePlan, readiness };
  return getPropertyListings(completePlan).then((propertyData) => {
    const matched = matchListings(propertyData.listings, completePlan);
    const selected = matched.find((listing) => listing.id === chosenListingId) || matched[0] || null;
    return { completePlan, propertyData, matched, selected };
  });
}

export default function App() {
  const [answers, setAnswers] = React.useState(starterAnswers);
  const [plan, setPlan] = React.useState(null);
  const [listings, setListings] = React.useState([]);
  const [selectedListing, setSelectedListing] = React.useState(null);
  const [user, setUser] = React.useState(getCurrentUser());
  const [isGenerating, setIsGenerating] = React.useState(false);
  const resultsRef = React.useRef(null);

  async function generatePlan() {
    setIsGenerating(true);
    try {
      const { completePlan, propertyData, matched, selected } = await createPlanRecord(answers);
      setPlan(completePlan);
      setListings(matched);
      setSelectedListing(selected);
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } finally {
      setIsGenerating(false);
    }
  }

  async function openSavedPlan(saved) {
    const restoredAnswers = { ...starterAnswers, ...(saved.answers || {}) };
    setAnswers(restoredAnswers);
    setIsGenerating(true);
    try {
      const { completePlan, propertyData, matched, selected } = await createPlanRecord(restoredAnswers, saved.selectedListingId);
      setPlan(completePlan);
      setListings(matched);
      setSelectedListing(selected);
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } finally {
      setIsGenerating(false);
    }
  }

  function startNewPlan() {
    setAnswers(starterAnswers);
    setPlan(null);
    setListings([]);
    setSelectedListing(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <section className="hero-shell">
        <nav className="topbar">
          <strong>HomeReady Planner</strong>
          <span>Home-buying readiness planner</span>
        </nav>
        <div className="hero-grid">
          <div>
            <h1>Can I afford to buy a house right now?</h1>
            <p>Answer financial and housing-preference questions, then get a readiness rating, estimated monthly cost, savings gap, matched listings, and a practical action plan.</p>
          </div>
          <div className="claim-box">
            <strong>Claim</strong>
            <p>A realistic home-buying decision must include taxes, insurance, debt, credit, savings, and timeline instead of relying on mortgage principal and interest alone.</p>
          </div>
        </div>
      </section>

      <div className="app-layout">
        <Questionnaire answers={answers} setAnswers={setAnswers} onSubmit={generatePlan} isGenerating={isGenerating} />
        <div ref={resultsRef}>
          {plan ? (
            <>
            <div className="generated-banner" role="status">Plan Generated</div>
            <ResultsDashboard plan={plan} onAdjust={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <HouseListings listings={listings} selectedId={selectedListing?.id} onSelect={setSelectedListing} timeline={plan.timeline} />
            <HouseDetail listing={selectedListing} />
            <div className="two-column">
              <ChatBot plan={{ ...plan, selectedListing, listings }} />
              <AccountPanel
                user={user}
                setUser={setUser}
                answers={answers}
                plan={{ ...plan, selectedListing }}
                selectedListing={selectedListing}
                onOpenPlan={openSavedPlan}
                onStartNewPlan={startNewPlan}
              />
            </div>
            </>
          ) : (
            <section className="card empty-results">
              <span className="eyebrow">Ready when you are</span>
              <h2>Your dashboard will appear here</h2>
              <p>Complete the questionnaire and click <strong>Generate my plan</strong> to calculate readiness, payment details, savings gaps, and house matches.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
