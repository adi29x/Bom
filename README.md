# Industrial Sheet Optimization & Nesting Assistant

This tool automates the process of extracting component dimensions from Excel BOMs, applying manufacturing margins, and optimizing material utilization through 2D nesting.

## Features
- **Auto-Parsing**: Extracts L, W, and CF from strings like `1200 x 600 x 50`.
- **Margin Application**: Automatically adds 18mm + CF to dimensions.
- **2D Nesting**: Groups multiple parts into standard HR sheets (1250x2500, 1500x3000, etc.).
- **Procurement Reporting**: Generates project-wise procurement recommendations.

## Usage
1. Place your Excel file in the root directory.
2. Ensure the Excel has the following headers:
   - `Project ID`
   - `Project Name`
   - `FG Category`
   - `FG QTY`
   - `Model No.`
   - `Child Item Category`
   - `Child Item Specification`
   - `Total Child Item Qty`
3. Run the processing script:
   ```bash
   node process_bom.js <your_file.xlsx>
   ```

## Standard HR Sheets Supported
- 1250 × 2500
- 1500 × 3000
- 1500 × 6000
- 1220 × 2440
- 1220 × 3050
- 1220 × 3660
- 1525 × 3050
- 1525 × 3660
- 2000 × 4000
- 2000 × 6000
