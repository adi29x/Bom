import XLSX from "xlsx";
const { readFile } = XLSX;

const workbook = readFile("BOM_Data_Extract.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const range = XLSX.utils.decode_range(sheet['!ref']);
console.log("Range:", sheet['!ref']);
for (let c = range.s.c; c <= range.e.c; c++) {
  const cellAddress = XLSX.utils.encode_cell({ r: 0, c: c });
  const cell = sheet[cellAddress];
  console.log(`Column ${c} (${cellAddress}):`, cell ? cell.v : undefined);
}
