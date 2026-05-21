/**
 * Standard Hot-Rolled (HR) Sheet Sizes available in the metal fabrication yard (dimensions in MM)
 * Classified by width, length, and supported thickness ranges.
 */
export const STANDARD_SHEETS = [
  { width: 1400, length: 1500, thicknesses: [4], thicknessRange: "4" },
  { width: 1500, length: 2000, thicknesses: [3, 4], thicknessRange: "3 – 4" },
  { width: 1500, length: 2200, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  { width: 1250, length: 2300, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 2300, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 2350, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2400, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  { width: 1600, length: 2400, thicknesses: [4], thicknessRange: "4" },
  { width: 1250, length: 2500, thicknesses: [1.8, 2, 2.5, 3, 4, 5, 6, 8], thicknessRange: "1.8 – 8" },
  { width: 1500, length: 2500, thicknesses: [3], thicknessRange: "3" },
  { width: 2000, length: 2500, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2550, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 2600, thicknesses: [3], thicknessRange: "3" },
  { width: 1800, length: 2650, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 2650, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2700, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 2700, thicknesses: [3, 4], thicknessRange: "3 – 4" },
  { width: 2000, length: 2700, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2800, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 2800, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2900, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 2950, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 3000, thicknesses: [2.5, 3, 4, 5], thicknessRange: "2.5 – 5" },
  { width: 1500, length: 3000, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  { width: 2000, length: 3000, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 3050, thicknesses: [4], thicknessRange: "4" },
  { width: 1500, length: 3050, thicknesses: [4], thicknessRange: "4" },
  { width: 1250, length: 3100, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  { width: 1500, length: 3100, thicknesses: [6], thicknessRange: "6" },
  { width: 1250, length: 3200, thicknesses: [3], thicknessRange: "3" },
  { width: 1500, length: 3200, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3200, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3300, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 3350, thicknesses: [3], thicknessRange: "3" },
  { width: 1250, length: 3400, thicknesses: [5], thicknessRange: "5" },
  { width: 1800, length: 3400, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3400, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 3450, thicknesses: [4], thicknessRange: "4" },
  { width: 1250, length: 3500, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3500, thicknesses: [5, 6, 7, 8], thicknessRange: "5 – 8" },
  { width: 1250, length: 3600, thicknesses: [6], thicknessRange: "6" },
  { width: 1500, length: 3600, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  { width: 2000, length: 3600, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 3650, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3650, thicknesses: [5], thicknessRange: "5" },
  { width: 1800, length: 3700, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 3700, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 4000, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 4000, thicknesses: [5], thicknessRange: "5" },
  { width: 1500, length: 4500, thicknesses: [5], thicknessRange: "5" },
  { width: 2000, length: 5900, thicknesses: [5], thicknessRange: "5" },
  { width: 1250, length: 6300, thicknesses: [4], thicknessRange: "4" },
  { width: 1500, length: 6300, thicknesses: [5, 6, 8, 10, 12, 16, 20, 25, 32, 40], thicknessRange: "5 – 40" },
  { width: 1800, length: 6300, thicknesses: [32], thicknessRange: "32" },
  { width: 1500, length: 6350, thicknesses: [8], thicknessRange: "8" }
];

/**
 * NestingEngine
 * Manages 2D rectangular sheet nesting using a Best-Fit-Decreasing heuristic.
 * Employs a guillotine orthogonal split pattern suitable for commercial shear cutting 
 * and CNC plasma/laser lead-ins, along with a lookahead sheet selection strategy.
 */
export class NestingEngine {
  constructor() {
    this.sheets = []; // Tracking list of physical sheets allocated for the job
  }

  /**
   * Performs the nesting allocation on the provided parts array.
   * 
   * @param {Array} parts - List of parts: { id, adjustedL, adjustedW, qty }
   * @returns {Array} List of sheet allocations with nested part coordinates and utilization metrics.
   */
  nest(parts) {
    // 1. Flatten parts based on ordered quantity
    let partsQueue = [];
    parts.forEach(p => {
      for (let i = 0; i < p.qty; i++) {
        partsQueue.push({ ...p, instanceId: `${p.id}_${i}` });
      }
    });

    // 2. Sort components by raw surface area in descending order (Best-Fit-Decreasing rule)
    // Larger parts must be nested first because they are harder to fit later.
    partsQueue.sort((a, b) => b.area - a.area);

    const allocatedSheets = [];
    
    // Copy the queue to track elements pending placement
    let pendingParts = [...partsQueue];

    while (pendingParts.length > 0) {
      const part = pendingParts[0];
      let placed = false;

      // First try: Try to pack this part into existing sheets (increases packing density)
      for (const sheet of allocatedSheets) {
        if (this.canFitInSheet(sheet, part)) {
          this.placeInSheet(sheet, part);
          placed = true;
          pendingParts.shift();
          break;
        }
      }

      // Second try: If it doesn't fit in existing sheets, allocate a new raw sheet
      if (!placed) {
        // Filter standard plates that can fit the dimensions in either standard or rotated orientation
        const candidates = STANDARD_SHEETS.filter(s => 
          (part.adjustedL <= s.length && part.adjustedW <= s.width) ||
          (part.adjustedW <= s.length && part.adjustedL <= s.width)
        );

        if (candidates.length === 0) {
          console.warn(`Part ${part.id} (${part.originalSpec}) is too large for any standard sheet.`);
          pendingParts.shift(); // Remove from queue to prevent lockups
          continue;
        }

        // Evaluate standard sheet sizes using lookahead simulation to find the most efficient fit
        let selectedSheet = null;
        let bestScore = -1;
        let bestSim = null;

        candidates.forEach(s => {
          const sim = this.simulatePacking(s, pendingParts);
          const sheetArea = s.width * s.length;
          const utilization = sim.usedArea / sheetArea;
          
          let score = utilization;
          // Completion bonus: if this plate can fit all remaining pending parts
          if (sim.packedCount === pendingParts.length) {
            score = 1000 + utilization;
          }

          // Area tie-breaker: slightly penalize larger sheet sizes to conserve inventory
          score -= (sheetArea / 1e15);

          if (score > bestScore) {
            bestScore = score;
            selectedSheet = s;
            bestSim = sim;
          }
        });

        if (selectedSheet && bestSim) {
          // Provision a new sheet with full width/length coordinates and starting free space
          const newSheet = {
            ...selectedSheet,
            id: `SHEET_${allocatedSheets.length + 1}`,
            parts: [],
            usedArea: 0,
            freeRects: [{ x: 0, y: 0, w: selectedSheet.width, l: selectedSheet.length }]
          };

          // Apply nesting placement for all parts selected in the winning lookahead simulation
          bestSim.packedIndices.forEach(idx => {
            const p = pendingParts[idx];
            this.placeInSheet(newSheet, p);
          });

          allocatedSheets.push(newSheet);

          // Clear placed components from the pending list (back-to-front to maintain indexing)
          const indicesToRemove = [...bestSim.packedIndices].sort((a, b) => b - a);
          indicesToRemove.forEach(idx => {
            pendingParts.splice(idx, 1);
          });
        } else {
          console.warn(`Could not place part ${part.id} using lookahead. Skipping.`);
          pendingParts.shift();
        }
      }
    }

    return allocatedSheets;
  }

  /**
   * Run a lookahead simulation on a given sheet size to determine utilization metrics.
   */
  simulatePacking(sheetSize, partsList) {
    const tempSheet = {
      width: sheetSize.width,
      length: sheetSize.length,
      parts: [],
      usedArea: 0,
      freeRects: [{ x: 0, y: 0, w: sheetSize.width, l: sheetSize.length }]
    };

    const packedIndices = [];
    const packedParts = [];

    partsList.forEach((part, index) => {
      if (this.canFitInSheet(tempSheet, part)) {
        this.placeInSheet(tempSheet, part);
        packedIndices.push(index);
        packedParts.push(part);
      }
    });

    return {
      packedCount: packedParts.length,
      packedIndices,
      usedArea: tempSheet.usedArea,
      parts: tempSheet.parts
    };
  }

  /**
   * Helper utility to find the smallest individual sheet that can house a single part.
   * Useful when checking constraints or working on standalone piece-by-piece fabrications.
   */
  recommendBestSheetForPart(part) {
    const fits = STANDARD_SHEETS.filter(s => 
      (part.adjustedL <= s.length && part.adjustedW <= s.width) ||
      (part.adjustedW <= s.length && part.adjustedL <= s.width)
    );

    if (fits.length === 0) return null;

    // Ascending sort by total area to capture the tightest fit
    fits.sort((a, b) => (a.width * a.length) - (b.width * b.length));
    return fits[0];
  }

  /**
   * Evaluates if a component fits in any of the sheet's available free coordinates.
   */
  canFitInSheet(sheet, part) {
    return sheet.freeRects.some(rect => 
      (part.adjustedL <= rect.l && part.adjustedW <= rect.w) ||
      (part.adjustedW <= rect.l && part.adjustedL <= rect.w)
    );
  }

  /**
   * Places a component onto a sheet and splits the remaining area into smaller rectangles.
   * Employs the Guillotine Split algorithm: creates a split line along the part's boundaries.
   */
  placeInSheet(sheet, part) {
    // Find the first free space block that can accommodate the part (respecting rotation)
    for (let i = 0; i < sheet.freeRects.length; i++) {
      const rect = sheet.freeRects[i];
      let fitsNormal = (part.adjustedL <= rect.l && part.adjustedW <= rect.w);
      let fitsRotated = (part.adjustedW <= rect.l && part.adjustedL <= rect.w);

      if (fitsNormal || fitsRotated) {
        const pL = fitsNormal ? part.adjustedL : part.adjustedW;
        const pW = fitsNormal ? part.adjustedW : part.adjustedL;

        // Position coordinates and rotation state are preserved for CNC/clamping visual output
        sheet.parts.push({ ...part, x: rect.x, y: rect.y, rotated: !fitsNormal });
        sheet.usedArea += part.area;

        // Guillotine split - break the remaining area into right and bottom rectangular pockets.
        // TODO: Save large unused scrap sheets (freeRects > 500x500mm) back into the workshop remnant plate DB.
        // TODO: Integrate heat distortion cooling delay paths for nested layouts with high density.
        // TODO: Adjust spacing dynamically based on kerf width variations (e.g. 3mm for plasma, 1.5mm for laser).
        const rectRight = { x: rect.x + pW, y: rect.y, w: rect.w - pW, l: pL };
        const rectBottom = { x: rect.x, y: rect.y + pL, w: rect.w, l: rect.l - pL };

        // Evict the consumed rectangular region
        sheet.freeRects.splice(i, 1);

        // Add newly formed free rectangles back to the sheet's available pockets
        if (rectRight.w > 0 && rectRight.l > 0) sheet.freeRects.push(rectRight);
        if (rectBottom.w > 0 && rectBottom.l > 0) sheet.freeRects.push(rectBottom);

        return true;
      }
    }
    return false;
  }
}
