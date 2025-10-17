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