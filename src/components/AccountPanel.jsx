import React from "react";
import { currency } from "../utils/mortgageCalculations";
import { getSavedPlans, savePlan, signIn, signOut } from "../services/storageService";

export default function AccountPanel({ user, setUser, answers, plan, selectedListing, onOpenPlan, onStartNewPlan }) {
  const [email, setEmail] = React.useState(user || "");
  const [planName, setPlanName] = React.useState(defaultPlanName(answers));
  const [savedPlans, setSavedPlans] = React.useState(() => getSavedPlans(user));

  React.useEffect(() => setSavedPlans(getSavedPlans(user)), [user]);
  React.useEffect(() => setPlanName(defaultPlanName(answers)), [answers.location]);

  function handleSignIn(event) {
    event.preventDefault();
    const account = signIn(email);
    if (account) setUser(account.email);
  }

  function handleSave() {
    const record = {
      id: Date.now().toString(),
      name: planName.trim() || defaultPlanName(answers),
      createdAt: new Date().toLocaleDateString(),
      answers,
      plan,
      selectedListingId: selectedListing?.id || "",
    };
    savePlan(user, record);
    setSavedPlans(getSavedPlans(user));
  }

  return (
    <section className="card account-card">
      <span className="eyebrow">Account</span>
      <h2>Plans</h2>
      {user ? (
        <>
          <div className="account-toolbar">
            <p>Signed in as <strong>{user}</strong></p>
            <button className="ghost" type="button" onClick={() => { signOut(); setUser(""); }}>Log out</button>
          </div>
          <div className="save-plan-box">
            <label>
              <span>Plan name</span>
              <input value={planName} onChange={(event) => setPlanName(event.target.value)} placeholder="Name this plan" />
            </label>
            <div className="account-actions">
              <button type="button" onClick={handleSave}>Save current plan</button>
              <button className="ghost" type="button" onClick={onStartNewPlan}>Start new plan</button>
            </div>
          </div>
        </>
      ) : (
        <form className="account-form" onSubmit={handleSignIn}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" />
          <button type="submit">Create account / log in</button>
        </form>
      )}
      {savedPlans.length > 0 && (
        <div className="saved-list">
          <h3>Saved plans</h3>
          <div className="saved-plan-grid">
            {savedPlans.map((saved) => (
              <button className="saved-plan-card" type="button" key={saved.id} onClick={() => onOpenPlan(saved)}>
                <strong>{saved.name || "Saved plan"}</strong>
                <span>{saved.answers?.location || saved.plan?.location} · {saved.plan?.readiness?.category}</span>
                <small>{currency(saved.plan?.totalHousingPayment || 0)} monthly · {saved.createdAt}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function defaultPlanName(answers) {
  const place = String(answers?.location || "Home").split(",")[0].trim() || "Home";
  return `${place} plan`;
}
