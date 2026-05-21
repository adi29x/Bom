/**
 * Parses raw dimension strings from the fabrication BOM.
 * Handles manual draftsman variations: e.g., "1200 x 600 x 50", "1200*600", or "1200×600".
 * 
 * @param {string} spec - Raw specification string
 * @returns {object|null} Parsed dimensions in mm: { originalL, originalW, cf }
 */
export function parseSpecification(spec) {
  if (!spec || typeof spec !== "string") return null;

  // Normalize delimiters (shop drawings sometimes mix x, *, and Unicode × symbols)
  const normalized = spec.toLowerCase().replace(/[×x*]/g, "x").replace(/\s+/g, "");
  
  // Split into components (Length x Width x Bending Loss / CF)
  const tokens = normalized.split("x");
  if (tokens.length < 2) return null;

  const length = parseFloat(tokens[0]);
  const width = parseFloat(tokens[1]);
  
  // CF (Bending Loss/Allowance) is optional; default to 0 if not bent
  const bendingLoss = tokens.length > 2 ? parseFloat(tokens[2]) : 0;

  if (isNaN(length) || isNaN(width)) {
    return null; // Skip malformed rows
  }

  // TODO: Add support for fractional input formats (e.g. 1200.5) if requested by engineering
  return { 
    originalL: length, 
    originalW: width, 
    cf: isNaN(bendingLoss) ? 0 : bendingLoss 
  };
}

/**
 * Calculates adjusted cutting dimensions incorporating manufacturing allowances.
 * Formula: Adjusted = Raw Dimension + Bending Loss (CF) + Margin
 * 
 * Margin is 15mm:
 * - 12mm clamping allowance for the TRR machine
 * - 3mm kerf / lead-in allowance for the CNC laser/plasma torch
 */
export function calculateAdjustedDimensions(parsedSpec) {
  if (!parsedSpec) return null;

  // Clamping tolerance (12mm) + Laser lead-in/kerf (3mm)
  const MANUFACTURING_ALLOWANCE = 12 + 3; 
  
  const adjustedL = parsedSpec.originalL + parsedSpec.cf + MANUFACTURING_ALLOWANCE;
  const adjustedW = parsedSpec.originalW + parsedSpec.cf + MANUFACTURING_ALLOWANCE;
  
  // TODO: In the future, check if sheet grain direction matters for bending load-bearing parts
  return {
    ...parsedSpec,
    adjustedL,
    adjustedW,
    area: adjustedL * adjustedW
  };
}
