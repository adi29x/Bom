/**
 * process_bom.js
 * 
 * Command-line entry point to load raw fabrication BOM exports from Excel,
 * calculate adjusted cutting layouts, and generate nested sheet procurement reports.
 * 
 * Usage: node process_bom.js <path_to_excel_file.xlsx>
 */

import { OptimizationController } from "./src/main.js";
import { PremiumReporter } from "./src/utils/reporter.js";
import path from "path";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node process_bom.js <path_to_excel_file.xlsx>");
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const controller = new OptimizationController();

  try {
    const report = await controller.processExcel(filePath);
    PremiumReporter.printFullReport(report);
  } catch (error) {
    console.error("Error: Failed to process BOM file:", error.message);
  }
}

main();
