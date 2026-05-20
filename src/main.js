import { parseSpecification, calculateAdjustedDimensions } from "./utils/parser.js";
import { NestingEngine } from "./engine/nester.js";

import XLSX from "xlsx";
const { readFile, utils } = XLSX;

/**
 * Main Controller for Industrial Sheet Optimization
 */
export class OptimizationController {
  constructor() {
    this.nester = new NestingEngine();
  }

  /**
   * Processes an Excel file directly.
   */
  async processExcel(filePath) {
    const workbook = readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = utils.sheet_to_json(workbook.Sheets[sheetName]);
    return this.processComponents(rawData);
  }

  /**
   * Processes a list of raw components from Excel.
   */
  async processComponents(rawData) {
    console.log(`Processing ${rawData.length} components...`);

    // 1. Extraction & Margin Application
    const processed = rawData.map(item => {
      const parsed = parseSpecification(item["Child Item Specification"]);
      const adjusted = calculateAdjustedDimensions(parsed);
      
      if (!adjusted) return null;

      return {
        ...item,
        ...adjusted,
        originalSpec: item["Child Item Specification"],
        qty: parseInt(item["Total Child Item Qty"]) || 0
      };
    }).filter(Boolean);

    // 2. Individual Sheet Recommendation (Step 3)
    processed.forEach(item => {
      item.recommendedSheet = this.nester.recommendBestSheetForPart(item);
    });

    // 3. Nesting Optimization (Step 4)
    const nestedSheets = this.nester.nest(processed);

    // 3. Generate Final Reports
    return this.generateReports(processed, nestedSheets);
  }

  generateReports(processed, nestedSheets) {
    // Grouping by Project
    const projectGroups = {};
    processed.forEach(p => {
      const pid = p["Project ID"] || "UNKNOWN";
      if (!projectGroups[pid]) {
        projectGroups[pid] = {
          id: pid,
          name: p["Project Name"] || "Unnamed Project",
          parts: []
        };
      }
      projectGroups[pid].parts.push(p);
    });

    const report = {
      summary: [],
      wastageSummary: {
        totalArea: 0,
        usedArea: 0,
        wastage: 0
      }
    };

    Object.values(projectGroups).forEach(group => {
      const projectSheets = nestedSheets.filter(s => 
        s.parts.some(p => p["Project ID"] === group.id)
      );

      const procurement = projectSheets.reduce((acc, s) => {
        const key = `${s.width} × ${s.length}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const procurementLines = Object.entries(procurement)
        .map(([size, count]) => `- ${size}: ${count} sheet(s)`)
        .join("\n");

      report.summary.push({
        title: `Project: ${group.name} (${group.id})`,
        description: `This project requires the following components. After applying manufacturing margins, these parts can be grouped into the following HR sheet sizes.`,
        procurement: `Recommended procurement quantity:\n${procurementLines}`,
        details: group.parts.map(p => ({
          "Item Specification": p.originalSpec,
          "Original Dimensions": `${p.originalL} × ${p.originalW}`,
          "Final Marginal Dimensions": `${p.adjustedL} × ${p.adjustedW}`,
          "Final Area": `${(p.area / 1000000).toFixed(3)} m²`,
          "Quantity Required": p.qty,
          "Recommended HR Sheet": `${p.recommendedSheet.width} × ${p.recommendedSheet.length}`
        }))
      });
    });

    // Calculate total wastage
    nestedSheets.forEach(s => {
      report.wastageSummary.totalArea += s.width * s.length;
      report.wastageSummary.usedArea += s.usedArea;
    });
    report.wastageSummary.wastage = ((1 - (report.wastageSummary.usedArea / report.wastageSummary.totalArea)) * 100).toFixed(2) + "%";

    return report;
  }
}
