export const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const tokenize = (name = "") =>
  (name || "")
    .split(/[-_\s]+/)
    .map(t => escapeRegex(t.trim()))
    .filter(Boolean);

export const buildLookaheadRegex = (tokens = []) => {
  // tokens should already be escaped
  const lookahead = tokens.map(t => `(?=.*\\b${t}\\b)`).join("");
  // keep it anchored (start) to reduce backtracking
  return new RegExp(`^${lookahead}.*$`, "i");
};

/**
 * Basic email validation (practical, not full RFC5322).
 * Returns true for common valid emails like "user@example.com".
 * Note: prefer sending a confirmation email for final verification.
 */
export const isEmail = (s = '') => {
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return re.test(String(s).trim());
};
