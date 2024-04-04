import { Button } from "@mui/material";
import * as FileSaver from "file-saver";

import * as ExcelJS from "exceljs";

// interface Measurement {
//   timestamp: string;
//   units: {
//     [key: string]: string;
//   };
//   measurements: {
//     [key: string]: number;
//   };
// }

interface ExcelExportProps {
  excelData: any[]; // Update the type accordingly
  fileName: string;
}

export default function ExcelExport({ excelData, fileName }: ExcelExportProps) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Add headers
    const headers = ["date", ...Object.keys(excelData[0].measurements)];

    headers.forEach((header, index) => {
      worksheet.getCell(1, index + 1).value = header;
    });

    // Add data

    // Add data
    excelData.forEach((measurement, rowIndex) => {
      worksheet.getCell(rowIndex + 2, 1).value = measurement.timestamp; // Date value
      headers.slice(1).forEach((header, columnIndex) => {
        // Start from index 1 to skip "date"
        const value = measurement.measurements[header];
        worksheet.getCell(rowIndex + 2, columnIndex + 2).value = value; // Start from column index 2
      });
    });

    // Save the workbook to a file
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, fileName);
        console.log(`Excel file "${fileName}" has been created successfully.`);
      })
      .catch((error) => {
        console.error("Error occurred while creating Excel file:", error);
      });
  };

  if (excelData.length > 0) {
    return (
      <Button variant="contained" color="primary" onClick={exportToExcel}>
        Exportar a Excel
      </Button>
    );
  }

  return (
    <Button variant="contained" disabled>
      Exportar a Excel
    </Button>
  );
}
