import { OptimizationController } from "../src/main.js";

const sampleData = [
  {
    "Project ID": "PRJ-001",
    "Project Name": "Industrial Filter Unit A",
    "FG Category": "Filter House",
    "FG QTY": 2,
    "Model No.": "IF-2000",
    "Child Item Category": "Side Plate",
    "Child Item Specification": "1200 x 600 x 50",
    "Total Child Item Qty": 10
  },
  {
    "Project ID": "PRJ-001",
    "Project Name": "Industrial Filter Unit A",
    "FG Category": "Filter House",
    "FG QTY": 2,
    "Model No.": "IF-2000",
    "Child Item Category": "Base Frame",
    "Child Item Specification": "2500 x 1200 x 100",
    "Total Child Item Qty": 2
  },
  {
    "Project ID": "PRJ-002",
    "Project Name": "Himenviro System B",
    "FG Category": "Ducting",
    "FG QTY": 1,
    "Model No.": "DS-500",
    "Child Item Category": "Elbow Plate",
    "Child Item Specification": "800 x 400 x 30",
    "Total Child Item Qty": 15
  }
];

async function runTest() {
  const controller = new OptimizationController();
  const report = await controller.processComponents(sampleData);

  console.log("==================================================");
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
  console.log("==================================================");
}

runTest();
