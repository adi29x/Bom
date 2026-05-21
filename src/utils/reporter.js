const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  
  // Foreground Colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  
  // Bright/Muted Colors
  gray: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
};

/**
 * Robust padding function that strips ANSI color codes to compute exact string length,
 * ensuring table borders never shift or break on different terminal systems (e.g. VS Code, PowerShell, bash).
 */
function pad(str, len, align = "left") {
  str = String(str || "");
  // Remove ANSI escape sequences so they don't count towards the physical text layout length
  const cleanStr = str.replace(/\x1b\[[0-9;]*m/g, "");
  const diff = len - cleanStr.length;
  if (diff <= 0) return str;
  const padding = " ".repeat(diff);
  if (align === "right") return padding + str;
  if (align === "center") {
    const left = " ".repeat(Math.floor(diff / 2));
    const right = " ".repeat(diff - left.length);
    return left + str + right;
  }
  return str + padding;
}

/**
 * Render the premium Component requirements table
 */
function drawComponentTable(details) {
  const widths = { id: 5, comp: 34, orig: 14, marg: 14, area: 10, qty: 5, sheet: 16 };
  let buffer = "";
  
  // Top Border
  buffer += colors.gray + "┌" + "─".repeat(widths.id) + "┬" + "─".repeat(widths.comp) + "┬" + "─".repeat(widths.orig) + "┬" + "─".repeat(widths.marg) + "┬" + "─".repeat(widths.area) + "┬" + "─".repeat(widths.qty) + "┬" + "─".repeat(widths.sheet) + "┐\n" + colors.reset;
  
  // Header Row
  buffer += colors.gray + "│" + colors.reset + " " + colors.bold + pad("ID", widths.id - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Component Category / Spec", widths.comp - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Original Dim", widths.orig - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Marginal Dim", widths.marg - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Area", widths.area - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Qty", widths.qty - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Rec. HR Sheet", widths.sheet - 1) + colors.gray + "│\n" + colors.reset;
  
  // Header Separator
  buffer += colors.gray + "├" + "─".repeat(widths.id) + "┼" + "─".repeat(widths.comp) + "┼" + "─".repeat(widths.orig) + "┼" + "─".repeat(widths.marg) + "┼" + "─".repeat(widths.area) + "┼" + "─".repeat(widths.qty) + "┼" + "─".repeat(widths.sheet) + "┤\n" + colors.reset;
  
  // Data Rows
  details.forEach((row, index) => {
    const idStr = `#${row.originalIndex}`;
    const compStr = row.category || "Component";
    const specStr = `Spec: ${row["Item Specification"]}`;
    const origStr = row["Original Dimensions"];
    const margStr = row["Final Marginal Dimensions"];
    const areaStr = row["Final Area"];
    const qtyStr = String(row["Quantity Required"]);
    const sheetStr = row["Recommended HR Sheet"];
    
    // First line of row (Category name + other fields)
    buffer += colors.gray + "│" + colors.reset + " " + pad(colors.brightCyan + idStr + colors.reset, widths.id - 1) + colors.gray + "│" + colors.reset + " " + pad(colors.brightWhite + compStr + colors.reset, widths.comp - 1) + colors.gray + "│" + colors.reset + " " + pad(origStr, widths.orig - 1) + colors.gray + "│" + colors.reset + " " + pad(margStr, widths.marg - 1) + colors.gray + "│" + colors.reset + " " + pad(areaStr, widths.area - 1) + colors.gray + "│" + colors.reset + " " + pad(qtyStr, widths.qty - 1) + colors.gray + "│" + colors.reset + " " + pad(sheetStr, widths.sheet - 1) + colors.gray + "│\n" + colors.reset;
    
    // Second line of row (Specification printed under Category in muted grey)
    buffer += colors.gray + "│" + colors.reset + " " + pad("", widths.id - 1) + colors.gray + "│" + colors.reset + " " + pad(colors.gray + specStr + colors.reset, widths.comp - 1) + colors.gray + "│" + colors.reset + " " + pad("", widths.orig - 1) + colors.gray + "│" + colors.reset + " " + pad("", widths.marg - 1) + colors.gray + "│" + colors.reset + " " + pad("", widths.area - 1) + colors.gray + "│" + colors.reset + " " + pad("", widths.qty - 1) + colors.gray + "│" + colors.reset + " " + pad("", widths.sheet - 1) + colors.gray + "│\n" + colors.reset;
    
    // Separator between items, except the last one
    if (index < details.length - 1) {
      buffer += colors.gray + "├" + "─".repeat(widths.id) + "┼" + "─".repeat(widths.comp) + "┼" + "─".repeat(widths.orig) + "┼" + "─".repeat(widths.marg) + "┼" + "─".repeat(widths.area) + "┼" + "─".repeat(widths.qty) + "┼" + "─".repeat(widths.sheet) + "┤\n" + colors.reset;
    }
  });
  
  // Bottom Border
  buffer += colors.gray + "└" + "─".repeat(widths.id) + "┴" + "─".repeat(widths.comp) + "┴" + "─".repeat(widths.orig) + "┴" + "─".repeat(widths.marg) + "┴" + "─".repeat(widths.area) + "┴" + "─".repeat(widths.qty) + "┴" + "─".repeat(widths.sheet) + "┘\n" + colors.reset;
  
  return buffer;
}

/**
 * Render the procurement quantity table
 */
function drawProcurementTable(procurementText) {
  const lines = procurementText.split("\n");
  const items = [];
  lines.forEach(line => {
    if (line.trim().startsWith("-")) {
      const parts = line.replace("-", "").split(":");
      if (parts.length === 2) {
        items.push({
          size: parts[0].trim(),
          qty: parts[1].trim()
        });
      }
    }
  });

  const widths = { size: 28, qty: 28 };
  let buffer = "";
  
  // Top Border
  buffer += colors.gray + "┌" + "─".repeat(widths.size) + "┬" + "─".repeat(widths.qty) + "┐\n" + colors.reset;
  
  // Header
  buffer += colors.gray + "│" + colors.reset + " " + colors.bold + pad("HR Sheet Size (mm)", widths.size - 1) + colors.gray + "│" + colors.reset + " " + colors.bold + pad("Required Sheets", widths.qty - 1) + colors.gray + "│\n" + colors.reset;
  
  // Header Separator
  buffer += colors.gray + "├" + "─".repeat(widths.size) + "┼" + "─".repeat(widths.qty) + "┤\n" + colors.reset;
  
  // Data Rows
  items.forEach((item, index) => {
    buffer += colors.gray + "│" + colors.reset + " " + pad(colors.brightWhite + item.size + colors.reset, widths.size - 1) + colors.gray + "│" + colors.reset + " " + pad(colors.brightGreen + item.qty + colors.reset, widths.qty - 1) + colors.gray + "│\n" + colors.reset;
  });
  
  // Bottom Border
  buffer += colors.gray + "└" + "─".repeat(widths.size) + "┴" + "─".repeat(widths.qty) + "┘\n" + colors.reset;
  return buffer;
}

/**
 * Render sheet layouts as elegant cards
 */
function drawSheetLayouts(sheets) {
  if (!sheets || sheets.length === 0) return "";
  const cardWidth = 86;
  let buffer = "";
  
  // Top Border of Card Container
  buffer += colors.gray + "┌" + "─".repeat(cardWidth) + "┐\n" + colors.reset;
  
  sheets.forEach((sheet, sheetIdx) => {
    // Header values
    const sheetNoStr = `SHEET ${sheet.sheetNo} of ${sheets.length}`;
    const sizeStr = `Size: ${sheet.width} × ${sheet.length}`;
    const utilVal = sheet.utilization.toFixed(1);
    const wasteVal = (100 - sheet.utilization).toFixed(1);
    
    let utilColor = colors.brightRed;
    if (sheet.utilization >= 85) utilColor = colors.brightGreen;
    else if (sheet.utilization >= 60) utilColor = colors.brightYellow;
    
    const utilStr = `Used: ${utilColor}${utilVal}%${colors.reset}`;
    const wasteStr = `Waste: ${colors.gray}${wasteVal}%${colors.reset}`;
    
    const headerContent = ` 📑 ${colors.brightCyan}${sheetNoStr}${colors.reset}  ${colors.gray}│${colors.reset}  ${colors.bold}${sizeStr}${colors.reset}  ${colors.gray}│${colors.reset}  ${utilStr}  ${colors.gray}│${colors.reset}  ${wasteStr}`;
    
    // Draw sheet card header
    buffer += colors.gray + "│" + colors.reset + pad(headerContent, cardWidth) + colors.gray + "│\n" + colors.reset;
    
    // Content Separator
    buffer += colors.gray + "├" + "─".repeat(cardWidth) + "┤\n" + colors.reset;
    
    // List nested parts
    sheet.parts.forEach(part => {
      const partLine = `  🔹 ${colors.bold}${part.qty} ×${colors.reset} [Item #${part.index}] ${colors.brightWhite}${part.category}${colors.reset} ${colors.gray}(${part.spec})${colors.reset}`;
      buffer += colors.gray + "│" + colors.reset + pad(partLine, cardWidth) + colors.gray + "│\n" + colors.reset;
    });
    
    // Bottom inner separator if there are more sheets
    if (sheetIdx < sheets.length - 1) {
      buffer += colors.gray + "├" + "─".repeat(cardWidth) + "┤\n" + colors.reset;
    }
  });
  
  // Bottom Border of Card Container
  buffer += colors.gray + "└" + "─".repeat(cardWidth) + "┘\n" + colors.reset;
  return buffer;
}

/**
 * Draw the final premium summary efficiency box
 */
function drawWastageSummary(wastageSummary) {
  const panelWidth = 56;
  let buffer = "";
  
  buffer += colors.brightMagenta + "┌" + "─".repeat(panelWidth) + "┐\n" + colors.reset;
  buffer += colors.brightMagenta + "│" + colors.reset + pad(colors.bold + colors.brightWhite + "             UTILIZATION & WASTAGE SUMMARY              ", panelWidth, "center") + colors.brightMagenta + "│\n" + colors.reset;
  buffer += colors.brightMagenta + "├" + "─".repeat(panelWidth) + "┤\n" + colors.reset;
  
  const totalStr = `  📊 Total Sheet Area:      ${colors.bold}${(wastageSummary.totalArea / 1000000).toFixed(2)} m²${colors.reset}`;
  const usedStr = `  ✅ Used Area:              ${colors.brightGreen}${colors.bold}${(wastageSummary.usedArea / 1000000).toFixed(2)} m²${colors.reset}`;
  
  const wasteNum = parseFloat(wastageSummary.wastage);
  let wasteColor = colors.brightRed;
  if (wasteNum <= 15) wasteColor = colors.brightGreen;
  else if (wasteNum <= 40) wasteColor = colors.brightYellow;
  
  const wastageStr = `  ⚠️ Total Wastage:          ${wasteColor}${colors.bold}${wastageSummary.wastage}${colors.reset}`;
  
  const efficiencyNum = (100 - wasteNum).toFixed(2);
  let effColor = colors.brightRed;
  if (efficiencyNum >= 85) effColor = colors.brightGreen;
  else if (efficiencyNum >= 60) effColor = colors.brightYellow;
  
  const efficiencyStr = `  📈 Overall Efficiency:     ${effColor}${colors.bold}${efficiencyNum}%${colors.reset}`;
  
  buffer += colors.brightMagenta + "│" + colors.reset + pad(totalStr, panelWidth) + colors.brightMagenta + "│\n" + colors.reset;
  buffer += colors.brightMagenta + "│" + colors.reset + pad(usedStr, panelWidth) + colors.brightMagenta + "│\n" + colors.reset;
  buffer += colors.brightMagenta + "│" + colors.reset + pad(wastageStr, panelWidth) + colors.brightMagenta + "│\n" + colors.reset;
  buffer += colors.brightMagenta + "│" + colors.reset + pad(efficiencyStr, panelWidth) + colors.brightMagenta + "│\n" + colors.reset;
  
  buffer += colors.brightMagenta + "└" + "─".repeat(panelWidth) + "┘\n" + colors.reset;
  return buffer;
}

/**
 * PremiumReporter
 * Main console output formatter. Draws premium aligned Unicode character tables 
 * and boxes detailing component utilization and plate-nesting layouts.
 */
export class PremiumReporter {
  /**
   * Orchestrates the standard printing of final fabrication summaries.
   * 
   * @param {object} report - Compiled metrics and nesting groups
   */
  static printFullReport(report) {
    // TODO: Add support for exporting these report tables to raw CSV or formatted PDF files for procurement teams.
    console.log("\n" + colors.bold + colors.brightCyan + "┌" + "─".repeat(56) + "┐" + colors.reset);
    console.log(colors.bold + colors.brightCyan + "│" + colors.reset + pad("          INDUSTRIAL SHEET OPTIMIZATION REPORT          ", 56) + colors.bold + colors.brightCyan + "│" + colors.reset);
    console.log(colors.bold + colors.brightCyan + "└" + "─".repeat(56) + "┘" + colors.reset + "\n");

    report.summary.forEach(project => {
      // Draw project title panel block
      const titleLen = 78;
      console.log(colors.brightBlue + "╔" + "═".repeat(titleLen) + "╗" + colors.reset);
      console.log(colors.brightBlue + "║ " + colors.reset + pad(colors.bold + colors.brightWhite + project.title.toUpperCase() + colors.reset, titleLen - 1) + colors.brightBlue + "║" + colors.reset);
      console.log(colors.brightBlue + "╚" + "═".repeat(titleLen) + "╝" + colors.reset);
      
      console.log(colors.gray + project.description + colors.reset + "\n");
      
      console.log(colors.bold + colors.brightYellow + "⚙️  COMPONENT REQUIREMENTS DETAILS" + colors.reset);
      console.log(drawComponentTable(project.details));
      
      console.log(colors.bold + colors.brightYellow + "📦 RECOMMENDED PROCUREMENT QUANTITIES" + colors.reset);
      console.log(drawProcurementTable(project.procurement));
      
      if (project.sheets && project.sheets.length > 0) {
        console.log(colors.bold + colors.brightYellow + "🧩 OPTIMIZED SHEET NESTING LAYOUTS" + colors.reset);
        console.log(drawSheetLayouts(project.sheets));
      }
      
      console.log("\n");
    });

    console.log(drawWastageSummary(report.wastageSummary));
    console.log("\n");
  }
}
