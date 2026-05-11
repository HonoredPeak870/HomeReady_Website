import React from "react";

const locationSuggestions = [
  "Newark, NJ",
  "Jersey City, NJ",
  "Hoboken, NJ",
  "Montclair, NJ",
  "Bloomfield, NJ",
  "Elizabeth, NJ",
  "Paterson, NJ",
  "Edison, NJ",
  "New Brunswick, NJ",
  "Trenton, NJ",
  "Morristown, NJ",
  "Hackensack, NJ",
  "Philadelphia, PA",
  "New York, NY",
  "Staten Island, NY",
];

const steps = [
  {
    navLabel: "Location",
    title: "Where and what are you looking for?",
    fields: [
      ["location", "Desired location", "text"],
      ["homeType", "Preferred home type", "select", ["Any", "Condo", "Townhome", "Single Family"]],
      ["timeline", "Timeline", "select", ["Looking now", "Looking soon", "Not anytime soon"]],
    ],
  },
  {
    navLabel: "Finances",
    title: "Income, credit, and debt",
    fields: [
      ["annualIncome", "Household annual income", "number"],
      ["creditScore", "Credit score", "number"],
      ["monthlyDebt", "Monthly debts and obligations", "number"],
    ],
  },
  {
    navLabel: "Savings",
    title: "Savings and target home",
    fields: [
      ["savings", "Current savings", "number"],
      ["downPayment", "Planned down payment", "number"],
      ["homePrice", "Target home price", "number"],
      ["comfortPayment", "Comfortable monthly housing payment", "number"],
    ],
  },
  {
    navLabel: "Assumptions",
    title: "Assumptions you can adjust",
    fields: [
      ["interestRate", "Mortgage interest rate (%)", "number", null, "0.01"],
      ["loanTermYears", "Loan term (years)", "number"],
      ["propertyTaxRate", "Property tax rate (%) optional", "number", null, "0.01"],
      ["insuranceRate", "Insurance rate (%) optional", "number", null, "0.01"],
    ],
  },
];

export default function Questionnaire({ answers, setAnswers, onSubmit, isGenerating }) {
  const [step, setStep] = React.useState(0);
  const current = steps[step];
  const sectionProgress = step / (steps.length - 1 || 1);
  const progress = Math.round(sectionProgress * 100);

  function update(field, value) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="card questionnaire questionnaire-shell" aria-labelledby="questionnaire-title">
      <div className="questionnaire-main">
        <div className="section-header">
          <span className="eyebrow">Step {step + 1} of {steps.length}</span>
          <h2 id="questionnaire-title">{current.title}</h2>
        </div>
        <div className="progress-bar" aria-label="Questionnaire progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="form-grid">
          {current.fields.map(([field, label, type, options, stepValue]) => (
            <label key={field}>
              <span>{label}</span>
              {type === "select" ? (
                <select value={answers[field]} onChange={(event) => update(field, event.target.value)}>
                  {options.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : field === "location" ? (
                <LocationPicker value={answers[field]} onChange={(value) => update(field, value)} />
              ) : (
                <input
                  type={type === "number" ? "text" : type}
                  inputMode={type === "number" ? "decimal" : undefined}
                  step={stepValue || "1"}
                  value={answers[field]}
                  onChange={(event) => update(field, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <div className="button-row">
          <button className="ghost" type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)}>Continue</button>
          ) : (
            <button type="button" disabled={isGenerating} onClick={onSubmit}>{isGenerating ? "Generating..." : "Generate my plan"}</button>
          )}
        </div>
      </div>

      <nav className="section-jump" aria-label="Questionnaire sections">
        <span className="eyebrow">Sections</span>
        {steps.map((section, index) => (
          <button
            className={`section-jump-button ${index === step ? "active" : ""}`}
            type="button"
            key={section.navLabel}
            onClick={() => setStep(index)}
          >
            <strong>{index + 1}</strong>
            <span>{section.navLabel}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}

function LocationPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const filtered = locationSuggestions.filter((location) =>
    location.toLowerCase().includes(String(value || "").toLowerCase())
  );

  return (
    <div className="location-picker">
      <input
        type="text"
        value={value}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        placeholder="Search town, city, or state"
        aria-autocomplete="list"
      />
      {isOpen && filtered.length > 0 && (
        <div className="location-menu" role="listbox">
          {filtered.slice(0, 7).map((location) => (
            <button
              className="location-option"
              type="button"
              key={location}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(location);
                setIsOpen(false);
              }}
            >
              <span>{location.split(",")[0]}</span>
              <small>{location.split(",")[1]?.trim()}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
