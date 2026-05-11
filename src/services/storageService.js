const ACCOUNT_KEY = "srl_homebuying_accounts";
const SESSION_KEY = "srl_homebuying_session";

function readAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "{}");
}

function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY) || "";
}

export function signIn(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const accounts = readAccounts();
  accounts[normalized] = accounts[normalized] || { email: normalized, plans: [] };
  writeAccounts(accounts);
  localStorage.setItem(SESSION_KEY, normalized);
  return accounts[normalized];
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function savePlan(email, planRecord) {
  if (!email) return;
  const accounts = readAccounts();
  accounts[email] = accounts[email] || { email, plans: [] };
  accounts[email].plans = [planRecord, ...accounts[email].plans.filter((plan) => plan.id !== planRecord.id)].slice(0, 12);
  writeAccounts(accounts);
}

export function getSavedPlans(email) {
  if (!email) return [];
  return readAccounts()[email]?.plans || [];
}
