/**
 * Extracts Length, Width, and CF value from specification strings.
 * Format: L × W × CF (e.g., "1200 x 600 x 50")
 */
export function parseSpecification(spec) {
  if (!spec || typeof spec !== "string") return null;

  // Clean the string: replace different multiplication symbols and remove spaces
  const cleaned = spec.toLowerCase().replace(/[×x*]/g, "x").replace(/\s+/g, "");
  
  // Match L x W x CF or just L x W
  const parts = cleaned.split("x");
  
  if (parts.length < 2) return null;

  const L = parseFloat(parts[0]);
  const W = parseFloat(parts[1]);
  const CF = parts.length > 2 ? parseFloat(parts[2]) : 0;

  if (isNaN(L) || isNaN(W)) return null;

  return { 
    originalL: L, 
    originalW: W, 
    cf: isNaN(CF) ? 0 : CF 
  };
}

/**
 * Applies manufacturing margins and calculates adjusted dimensions.
 * L_adj = L + CF + 12 (TRR) + 6 (Laser) = L + CF + 18
 */
export function calculateAdjustedDimensions(parsedSpec) {
  if (!parsedSpec) return null;

  const MARGIN = 12 + 3; // TRR + Laser (Updated to 3mm)
  
  const adjustedL = parsedSpec.originalL + parsedSpec.cf + MARGIN;
  const adjustedW = parsedSpec.originalW + parsedSpec.cf + MARGIN;
  
  return {
    ...parsedSpec,
    adjustedL,
    adjustedW,
    area: adjustedL * adjustedW
  };
}
