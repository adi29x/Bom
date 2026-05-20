import { OptimizationController } from "./src/main.js";
import path from "path";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide the path to the Excel file.");
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const controller = new OptimizationController();

  try {
    const report = await controller.processExcel(filePath);

    console.log("\n==================================================");
    console.log("INDUSTRIAL SHEET OPTIMIZATION REPORT");
    console.log("==================================================\n");

    report.summary.forEach(project => {
      console.log(project.title);
      console.log("--------------------------------------------------");
      console.log(project.description);
      console.log("\nComponents Details:");
      console.table(project.details);
      console.log("\n" + project.procurement);
      console.log("\n");
    });

    console.log("==================================================");
    console.log("UTILIZATION & WASTAGE SUMMARY");
    console.log("--------------------------------------------------");
    console.log(`Total Sheet Area: ${(report.wastageSummary.totalArea / 1000000).toFixed(2)} m²`);
    console.log(`Used Area:        ${(report.wastageSummary.usedArea / 1000000).toFixed(2)} m²`);
    console.log(`Total Wastage:    ${report.wastageSummary.wastage}`);
    console.log("==================================================\n");

  } catch (error) {
    console.error("Error processing BOM:", error.message);
  }
}

main();
