import { parseSpecification, calculateAdjustedDimensions } from "./utils/parser.js";
import { NestingEngine } from "./engine/nester.js";
import XLSX from "xlsx";

const { readFile, utils } = XLSX;

/**
 * OptimizationController
 * Coordinates BOM importing from Excel, applies material/bending tolerances,
 * triggers 2D nesting routines, and aggregates procurement recommendations.
 */
export class OptimizationController {
  constructor() {
    this.nester = new NestingEngine();
  }

  /**
   * Reads target Excel worksheet and triggers optimization pipeline.
   * 
   * @param {string} filePath - Absolute path to XLSX file
   */
  async processExcel(filePath) {
    const workbook = readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = utils.sheet_to_json(workbook.Sheets[sheetName]);
    return this.processComponents(rawData);
  }

  /**
   * Prepares raw part records and runs the 2D sheet packing pipeline.
   * 
   * @param {Array} rawData - Parsed rows from the BOM
   */
  async processComponents(rawData) {
    console.log(`Processing ${rawData.length} components...`);

    // Parse dimension specs and add fabrication margins
    const rawParts = rawData.map((item, index) => {
      const parsed = parseSpecification(item["Child Item Specification"]);
      const adjusted = calculateAdjustedDimensions(parsed);
      
      if (!adjusted) return null;

      return {
        ...item,
        ...adjusted,
        originalSpec: item["Child Item Specification"],
        qty: parseInt(item["Total Child Item Qty"]) || 0,
        originalIndex: index + 1
      };
    }).filter(Boolean);

    // Assign fallback standalone raw plate recommendation for each item
    rawParts.forEach(item => {
      item.recommendedSheet = this.nester.recommendBestSheetForPart(item);
    });

    // Run nesting packer to group components into optimized layouts
    const nestedSheets = this.nester.nest(rawParts);

    return this.generateReports(rawParts, nestedSheets);
  }

  /**
   * Aggregates nesting calculations into localized project summaries and procurement tables.
   */
  generateReports(rawParts, nestedSheets) {
    const groupedProjects = {};
    
    // Group components back by their designated Project ID
    rawParts.forEach(p => {
      const pid = p["Project ID"] || "UNKNOWN";
      if (!groupedProjects[pid]) {
        groupedProjects[pid] = {
          id: pid,
          name: p["Project Name"] || "Unnamed Project",
          parts: []
        };
      }
      groupedProjects[pid].parts.push(p);
    });

    const report = {
      summary: [],
      wastageSummary: {
        totalArea: 0,
        usedArea: 0,
        wastage: 0
      }
    };

    Object.values(groupedProjects).forEach(group => {
      // Find all nested sheets that contain parts from this specific project group
      const projectSheets = nestedSheets.filter(s => 
        s.parts.some(p => p["Project ID"] === group.id)
      );

      // Summarize recommended sheet purchases
      const procureSummary = projectSheets.reduce((acc, s) => {
        const key = `${s.width} × ${s.length}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const procurementLines = Object.entries(procureSummary)
        .map(([size, count]) => `- ${size}: ${count} sheet(s)`)
        .join("\n");

      const sheetLayoutDetails = projectSheets.map((s, idx) => {
        const partCounts = {};
        s.parts.forEach(p => {
          const key = `[Item #${p.originalIndex}] ${p["Child Item Category"]} (${p.originalSpec})`;
          partCounts[key] = (partCounts[key] || 0) + 1;
        });

        const partDetails = Object.entries(partCounts)
          .map(([name, qty]) => `${name} × ${qty}`)
          .join(", ");

        return {
          "Sheet No.": idx + 1,
          "Sheet Size": `${s.width} × ${s.length}`,
          "Nested Components & Quantities": partDetails
        };
      });

      const sheets = projectSheets.map((s, idx) => {
        const partCounts = {};
        s.parts.forEach(p => {
          const key = `[Item #${p.originalIndex}] ${p["Child Item Category"]} (${p.originalSpec})`;
          if (!partCounts[key]) {
            partCounts[key] = {
              index: p.originalIndex,
              category: p["Child Item Category"],
              spec: p.originalSpec,
              qty: 0
            };
          }
          partCounts[key].qty += 1;
        });

        return {
          sheetNo: idx + 1,
          width: s.width,
          length: s.length,
          usedArea: s.usedArea,
          totalArea: s.width * s.length,
          utilization: (s.usedArea / (s.width * s.length)) * 100,
          parts: Object.values(partCounts)
        };
      });

      report.summary.push({
        title: `Project: ${group.name} (${group.id})`,
        description: `This project requires the following components. After applying manufacturing margins, these parts can be grouped into the following HR sheet sizes.`,
        procurement: `Recommended procurement quantity:\n${procurementLines}`,
        sheetLayoutDetails,
        sheets,
        details: group.parts.map(p => ({
          "Item Specification": p.originalSpec,
          "Original Dimensions": `${p.originalL} × ${p.originalW}`,
          "Final Marginal Dimensions": `${p.adjustedL} × ${p.adjustedW}`,
          "Final Area": `${(p.area / 1000000).toFixed(3)} m²`,
          "Quantity Required": p.qty,
          "Recommended HR Sheet": `${p.recommendedSheet.width} × ${p.recommendedSheet.length}`,
          "originalIndex": p.originalIndex,
          "category": p["Child Item Category"]
        }))
      });
    });

    // Compute aggregate wastage metrics across all sheets processed in this run
    nestedSheets.forEach(s => {
      report.wastageSummary.totalArea += s.width * s.length;
      report.wastageSummary.usedArea += s.usedArea;
    });
    report.wastageSummary.wastage = ((1 - (report.wastageSummary.usedArea / report.wastageSummary.totalArea)) * 100).toFixed(2) + "%";

    return report;
  }
}
