# 🛠️ Sheet Metal Nesting & Procurement Assistant

Welcome to the **Sheet Nesting Assistant**! If you are new to the team or this codebase, this guide will help you understand, run, and modify the system in under 5 minutes.

---

## 💡 What is this system?

When manufacturing sheet metal parts (like ducting, covers, or frames), we buy large raw metal sheets (Hot-Rolled or "HR" sheets) and cut our parts out of them. 

If we cut parts carelessly, we end up throwing away a lot of expensive metal scrap. This system is a **smart layout planner**:
1.  **Reads** your parts requirements directly from an Excel spreadsheet (BOM).
2.  **Parses** dimensions and automatically adds a **15mm safety margin** (12mm for machine clamps + 3mm for the laser/plasma cutter path).
3.  **Simulates layouts** to pack as many parts as possible into the same metal sheet.
4.  **Recommends** exactly which sheets to buy from the yard so that wastage is kept to an absolute minimum.

---

## 🚀 Quick Start Guide (Get Running in 3 Minutes)

Follow these simple steps to run the nesting assistant on your computer:

### 1. Make sure Node.js is installed
Open your terminal (PowerShell or Command Prompt) and type:
```bash
node -v
```
*If this prints a version number (like `v18.16.0`), you are ready! If not, download and install Node.js from [nodejs.org](https://nodejs.org/).*

### 2. Download code dependencies
Navigate to the project folder (`IFH-3`) in your terminal and run:
```bash
npm install
```
*This downloads the Excel parsing libraries needed to read files.*

### 3. Run the instant demo (No files needed)
Run the built-in mock test to see the optimizer in action instantly:
```bash
node scratch/test_nesting.js
```
You will see a beautiful color-coded layout table showing side plates and base frames nested on raw sheets!

### 4. Process a real Excel BOM file
To optimize the actual production Excel BOM (`BOM_Data_Extract.xlsx` in the root folder), run:
```bash
node process_bom.js BOM_Data_Extract.xlsx
```

---

## 📊 Understanding the Excel spreadsheet (BOM)

To feed new jobs into the optimizer, create or edit an Excel sheet. The first sheet must contain these columns:

| Column Header | What it means | Example entry |
| :--- | :--- | :--- |
| **Project ID** | Unique ID for the job | `PRJ-001` |
| **Project Name** | Name of the structure | `Industrial Filter Unit A` |
| **Child Item Category** | Name of the component to cut | `Side Plate` |
| **Child Item Specification** | Raw Size: `Length x Width x Bending Allowance` | `1200 x 600 x 50` *(Supports `x`, `*`, or `×`)* |
| **Total Child Item Qty** | How many of this exact part to make | `10` |

---

## 🔎 How to Read the Console Output

When you run the system, it prints an aligned console dashboard. Here is how to interpret the main sections:

### Section A: Component Requirements Details
```text
┌─────┬──────────────────────────────────┬──────────────┬──────────────┬──────────┬─────┬────────────────┐
│ ID  │ Component Category / Spec        │ Original Dim │ Marginal Dim │ Area     │ Qty │ Rec. HR Sheet  │
├─────┼──────────────────────────────────┼──────────────┼──────────────┼──────────┼─────┼────────────────┤
│ #1  │ Side Plate                       │ 1200 × 600   │ 1265 × 665   │ 0.841 m² │ 10  │ 1250 × 2500    │
│     │ Spec: 1200 x 600 x 50            │              │              │          │     │                │
```
*   **Original Dim**: The size requested in the drawings (`1200x600`).
*   **Marginal Dim**: The actual cutting size (`1265x665`). Notice that `50mm` bending loss plus a `15mm` manufacturing tolerance was automatically added!
*   **Rec. HR Sheet**: If you were to cut this part completely by itself, this is the smallest standard sheet you would need to buy.

### Section B: Procurement Recommendation
```text
📦 RECOMMENDED PROCUREMENT QUANTITIES
┌────────────────────────────┬────────────────────────────┐
│ HR Sheet Size (mm)         │ Required Sheets            │
├────────────────────────────┼────────────────────────────┤
│ 2000 × 3000                │ 2 sheet(s)                 │
└────────────────────────────┴────────────────────────────┘
```
This tells the procurement team exactly what plates to order from the material supplier.

### Section C: Optimized Nesting Layouts
```text
🧩 OPTIMIZED SHEET NESTING LAYOUTS
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📑 SHEET 1 of 2  │  Size: 2000 × 3000  │  Used: 96.7%  │  Waste: 3.3%                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  🔹 6 × [Item #1] Side Plate (1200 x 600 x 50)                                       │
│  🔹 2 × [Item #3] Elbow Plate (800 x 400 x 30)                                       │
```
This shows the cut-lists for the shop floor operators. In this example, instead of using separate small sheets, the engine nested **6 Side Plates** and **2 Elbow Plates** together onto a single `2000 x 3000` plate with an incredible **96.7% metal utilization** (only 3.3% scrap)!

---

## 🧠 Why is it so efficient? (The Algorithms Explained Simply)

If you look at the code, you'll see two key optimization strategies:
1.  **Guillotine Splitting (`src/engine/nester.js`)**: 
    Our shop floor shear cutters can only make straight, edge-to-edge cuts. When the engine packs a part, it dynamically splits the remaining space into two smaller rectangles (one to the right, one to the bottom). This keeps all cutting paths aligned and easy for the operators.
2.  **Lookahead Scheduling**:
    Instead of buying sheets one by one, the engine looks at all remaining parts first. It runs multiple background simulations testing different standard plate sizes to see which one packs the parts tightest. It then purchases the best simulation plate and removes the packed parts in a single batch.

---

## 🛠️ Developer FAQ & Quick Mod Guide

### Where do I add/change standard sheet sizes?
If the workshop gets a new shipment of sheet sizes, edit the `STANDARD_SHEETS` array at the top of [src/engine/nester.js](file:///c:/Users/dell/Desktop/IFH-3/src/engine/nester.js):
```javascript
export const STANDARD_SHEETS = [
  { width: 1500, length: 3000, thicknesses: [3, 4, 5], thicknessRange: "3 – 5" },
  // Add new plates here!
];
```

### Where is the safety margin (15mm) defined?
You can adjust the machine bending clamping margin (`12mm`) and the torch kerf clearance (`3mm`) inside `calculateAdjustedDimensions` in [src/utils/parser.js](file:///c:/Users/dell/Desktop/IFH-3/src/utils/parser.js):
```javascript
const MANUFACTURING_ALLOWANCE = 12 + 3; // Change safety offsets here
```

### What if an Excel row is corrupted?
If an Excel row is missing values or has malformed dimensions (e.g. text instead of numbers), the system prints a warning to the console, safely skips the line, and continues processing the rest of the BOM without crashing.
