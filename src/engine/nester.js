/**
 * Standard HR Sheet Sizes (MM)
 */
export const STANDARD_SHEETS = [
  { width: 1250, length: 2500 },
  { width: 1500, length: 3000 },
  { width: 1500, length: 6000 },
  { width: 1220, length: 2440 },
  { width: 1220, length: 3050 },
  { width: 1220, length: 3660 },
  { width: 1525, length: 3050 },
  { width: 1525, length: 3660 },
  { width: 2000, length: 4000 },
  { width: 2000, length: 6000 }
];

/**
 * A simple 2D Nesting Engine using a Best-Fit-Decreasing heuristic.
 * This version prioritizes fitting multiple parts into the same sheet.
 */
export class NestingEngine {
  constructor() {
    this.sheets = []; // List of allocated sheets with their contents
  }

  /**
   * Main entry point for nesting.
   * @param {Array} parts - Array of objects { id, adjustedL, adjustedW, qty }
   */
  nest(parts) {
    // 1. Flatten parts based on quantity
    let flattenedParts = [];
    parts.forEach(p => {
      for (let i = 0; i < p.qty; i++) {
        flattenedParts.push({ ...p, instanceId: `${p.id}_${i}` });
      }
    });

    // 2. Sort parts by area (decreasing) to improve packing efficiency
    flattenedParts.sort((a, b) => b.area - a.area);

    const results = [];
    
    // Process each part
    for (const part of flattenedParts) {
      let placed = false;

      // Try to place in existing sheets first (Optimization)
      for (const sheet of results) {
        if (this.canFitInSheet(sheet, part)) {
          this.placeInSheet(sheet, part);
          placed = true;
          break;
        }
      }

      // If not placed, allocate a new sheet
      if (!placed) {
        const bestSheet = this.recommendBestSheetForPart(part);
        if (bestSheet) {
          const newSheet = {
            ...bestSheet,
            id: `SHEET_${results.length + 1}`,
            parts: [],
            usedArea: 0,
            freeRects: [{ x: 0, y: 0, w: bestSheet.width, l: bestSheet.length }]
          };
          this.placeInSheet(newSheet, part);
          results.push(newSheet);
        } else {
          console.warn(`Part ${part.id} is too large for any standard sheet.`);
          // Handle as independent allocation or mark as error
        }
      }
    }

    return results;
  }

  /**
   * Finds the smallest standard sheet that can fit the part (Minimizes initial wastage).
   */
  recommendBestSheetForPart(part) {
    const fits = STANDARD_SHEETS.filter(s => 
      (part.adjustedL <= s.length && part.adjustedW <= s.width) ||
      (part.adjustedW <= s.length && part.adjustedL <= s.width)
    );

    if (fits.length === 0) return null;

    // Sort by area ascending to find the smallest sheet that fits
    fits.sort((a, b) => (a.width * a.length) - (b.width * b.length));
    return fits[0];
  }

  /**
   * Check if part fits into existing free rectangles of a sheet.
   */
  canFitInSheet(sheet, part) {
    return sheet.freeRects.some(rect => 
      (part.adjustedL <= rect.l && part.adjustedW <= rect.w) ||
      (part.adjustedW <= rect.l && part.adjustedL <= rect.w)
    );
  }

  /**
   * Place a part in a sheet and update free rectangles (Guillotine Split).
   */
  placeInSheet(sheet, part) {
    // Find first fitting rectangle
    for (let i = 0; i < sheet.freeRects.length; i++) {
      const rect = sheet.freeRects[i];
      let fitsNormal = (part.adjustedL <= rect.l && part.adjustedW <= rect.w);
      let fitsRotated = (part.adjustedW <= rect.l && part.adjustedL <= rect.w);

      if (fitsNormal || fitsRotated) {
        const pL = fitsNormal ? part.adjustedL : part.adjustedW;
        const pW = fitsNormal ? part.adjustedW : part.adjustedL;

        // Add part to sheet
        sheet.parts.push({ ...part, x: rect.x, y: rect.y, rotated: !fitsNormal });
        sheet.usedArea += part.area;

        // Split the rectangle (Guillotine)
        // We create two new rectangles: one to the right and one below
        const rectRight = { x: rect.x + pW, y: rect.y, w: rect.w - pW, l: pL };
        const rectBottom = { x: rect.x, y: rect.y + pL, w: rect.w, l: rect.l - pL };

        // Remove old rect, add new ones if they have area
        sheet.freeRects.splice(i, 1);
        if (rectRight.w > 0 && rectRight.l > 0) sheet.freeRects.push(rectRight);
        if (rectBottom.w > 0 && rectBottom.l > 0) sheet.freeRects.push(rectBottom);

        return true;
      }
    }
    return false;
  }
}
