/**
 * CSV Preview Utility
 * Allows parsing and previewing CSV files on the client side before upload
 */

export interface CSVPreviewData {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  preview: Record<string, string>[]; // First N rows for preview
}

/**
 * Parse CSV file and return preview data
 * @param file - CSV file to parse
 * @param previewRows - Number of rows to show in preview (default: 5)
 * @returns Promise with parsed CSV data and preview
 */
export async function parseCSVFile(
  file: File,
  previewRows: number = 5
): Promise<CSVPreviewData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());

        if (lines.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }

        // Parse headers
        const headers = parseCSVLine(lines[0]);

        // Parse data rows
        const rows: Record<string, string>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const row: Record<string, string> = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          rows.push(row);
        }

        const preview = rows.slice(0, previewRows);

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          preview,
        });
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Parse a single CSV line handling quoted fields
 * @param line - CSV line to parse
 * @returns Array of field values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Validate CSV headers against required fields
 * @param headers - CSV headers
 * @param requiredFields - Required field names
 * @returns Object with validation result and missing fields
 */
export function validateCSVHeaders(
  headers: string[],
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !headers.includes(field));

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Convert CSV data to a file for upload
 * @param data - CSV data (array of objects)
 * @param filename - Output filename
 * @returns File object
 */
export function convertToCSVFile(
  data: Record<string, string | number | boolean>[],
  filename: string = 'data.csv'
): File {
  if (data.length === 0) {
    throw new Error('No data to convert');
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.map((h) => `"${h}"`).join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  return new File([csv], filename, { type: 'text/csv' });
}

/**
 * Download CSV from data
 * @param data - CSV data
 * @param filename - Output filename
 */
export function downloadCSV(
  data: Record<string, string | number | boolean>[],
  filename: string = 'data.csv'
): void {
  const file = convertToCSVFile(data, filename);
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
