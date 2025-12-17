/**
 * CSV Template Generator
 * Generates CSV templates with sample data for each module
 */

/**
 * CSV Template data for each module
 */
export const CSV_TEMPLATES = {
  hos: {
    filename: 'hos-template.csv',
    headers: ['ten_khoa_hoc', 'ten_tieng_viet', 'mo_ta', 'ten_nganh_khoa_hoc'],
    sample: [
      {
        ten_khoa_hoc: 'Họ Dâu',
        ten_tieng_viet: 'Họ Dâu',
        mo_ta: 'Mô tả về họ dâu',
        ten_nganh_khoa_hoc: 'Ngành Hạt'
      },
      {
        ten_khoa_hoc: 'Họ Thanh',
        ten_tieng_viet: 'Họ Thanh',
        mo_ta: 'Mô tả về họ thanh',
        ten_nganh_khoa_hoc: 'Ngành Hạt'
      }
    ],
    requiredFields: ['ten_khoa_hoc', 'ten_nganh_khoa_hoc'],
    description: 'Template for uploading Họ (Family/Class) data'
  },

  loais: {
    filename: 'loais-template.csv',
    headers: [
      'ten_khoa_hoc',
      'ten_tieng_viet',
      'ten_goi_khac',
      'ten_ho_khoa_hoc'
    ],
    sample: [
      {
        ten_khoa_hoc: 'Morus alba',
        ten_tieng_viet: 'Dâu trắng',
        ten_goi_khac: 'Dâu',
        ten_ho_khoa_hoc: 'Họ Dâu'
      },
      {
        ten_khoa_hoc: 'Artocarpus heterophyllus',
        ten_tieng_viet: 'Mít',
        ten_goi_khac: 'Trái mít',
        ten_ho_khoa_hoc: 'Họ Dâu'
      }
    ],
    requiredFields: ['ten_khoa_hoc', 'ten_ho_khoa_hoc'],
    description: 'Template for uploading Loài (Species) data'
  },

  nganhs: {
    filename: 'nganhs-template.csv',
    headers: ['ten_khoa_hoc', 'ten_tieng_viet', 'mo_ta'],
    sample: [
      {
        ten_khoa_hoc: 'Ngành Hạt',
        ten_tieng_viet: 'Ngành Hạt',
        mo_ta: 'Mô tả về ngành hạt'
      },
      {
        ten_khoa_hoc: 'Ngành Hoa',
        ten_tieng_viet: 'Ngành Hoa',
        mo_ta: 'Mô tả về ngành hoa'
      }
    ],
    requiredFields: ['ten_khoa_hoc'],
    description: 'Template for uploading Ngành (Branch) data'
  },

  users: {
    filename: 'users-template.csv',
    headers: [
      'full_name',
      'email',
      'password',
      'role',
      'address',
      'gender',
      'status'
    ],
    sample: [
      {
        full_name: 'Nguyễn Văn A',
        email: 'user1@example.com',
        password: 'password123',
        role: 'USER',
        address: '123 Đường ABC',
        gender: 'Male',
        status: 'ACTIVE'
      },
      {
        full_name: 'Trần Thị B',
        email: 'user2@example.com',
        password: 'password456',
        role: 'USER',
        address: '456 Đường XYZ',
        gender: 'Female',
        status: 'ACTIVE'
      }
    ],
    requiredFields: ['full_name', 'email', 'password', 'role', 'status'],
    description: 'Template for uploading User data'
  }
};

/**
 * Generate CSV template content
 * @param module - Module name ('hos', 'loais', 'nganhs', 'users')
 * @param includeSample - Include sample data rows (default: true)
 * @returns CSV content as string
 */
export function generateCSVTemplate(
  module: keyof typeof CSV_TEMPLATES,
  includeSample: boolean = true
): string {
  const template = CSV_TEMPLATES[module];

  // Generate header row
  const headerRow = template.headers.map((h) => `"${h}"`).join(',');

  if (!includeSample) {
    return headerRow;
  }

  // Generate sample rows
  const sampleRows = template.sample.map((row) =>
    template.headers
      .map((header) => {
        const value = row[header as keyof typeof row] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerRow, ...sampleRows].join('\n');
}

/**
 * Download CSV template file
 * @param module - Module name ('hos', 'loais', 'nganhs', 'users')
 */
export function downloadCSVTemplate(module: keyof typeof CSV_TEMPLATES): void {
  const content = generateCSVTemplate(module, true);
  const filename = CSV_TEMPLATES[module].filename;

  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get template information
 * @param module - Module name ('hos', 'loais', 'nganhs', 'users')
 * @returns Template metadata
 */
export function getTemplateInfo(module: keyof typeof CSV_TEMPLATES) {
  const template = CSV_TEMPLATES[module];
  return {
    description: template.description,
    filename: template.filename,
    headers: template.headers,
    requiredFields: template.requiredFields,
    optionalFields: template.headers.filter(
      (h) => !template.requiredFields.includes(h)
    ),
    sampleRowCount: template.sample.length
  };
}

/**
 * Get all template names
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(CSV_TEMPLATES) as Array<keyof typeof CSV_TEMPLATES>;
}

/**
 * Create CSV content from data array
 * @param data - Array of objects
 * @param headers - Optional specific headers order
 * @returns CSV content as string
 */
export function createCSVContent(
  data: Record<string, any>[],
  headers?: string[]
): string {
  if (data.length === 0) {
    throw new Error('No data to convert to CSV');
  }

  const allHeaders = headers || Object.keys(data[0]);

  // Generate header row
  const headerRow = allHeaders.map((h) => `"${h}"`).join(',');

  // Generate data rows
  const dataRows = data.map((row) =>
    allHeaders
      .map((header) => {
        const value = row[header] ?? '';
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Validate CSV data against template requirements
 * @param data - CSV data rows
 * @param headers - CSV headers
 * @param module - Module name for validation rules
 * @returns Validation result with errors
 */
export function validateCSVData(
  data: Record<string, string>[],
  headers: string[],
  module: keyof typeof CSV_TEMPLATES
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const template = CSV_TEMPLATES[module];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required headers
  const missingHeaders = template.requiredFields.filter(
    (field) => !headers.includes(field)
  );
  if (missingHeaders.length > 0) {
    errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  // Check for empty required fields
  data.forEach((row, rowIndex) => {
    template.requiredFields.forEach((field) => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${rowIndex + 1}: Missing required field "${field}"`);
      }
    });
  });

  // Check for duplicate entries
  const seen = new Set<string>();
  data.forEach((row, rowIndex) => {
    const key = template.headers.map((h) => row[h]).join('|');
    if (seen.has(key)) {
      warnings.push(`Row ${rowIndex + 1}: Possible duplicate entry`);
    }
    seen.add(key);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Export template helper UI
 * Usage in React components:
 * 
 * import { getAvailableTemplates, downloadCSVTemplate, getTemplateInfo } from '@/lib/csvTemplate';
 * 
 * function TemplateDownload() {
 *   const templates = getAvailableTemplates();
 * 
 *   return (
 *     <div>
 *       {templates.map(template => (
 *         <div key={template}>
 *           <h3>{template}</h3>
 *           <p>{getTemplateInfo(template).description}</p>
 *           <button onClick={() => downloadCSVTemplate(template)}>
 *             Download Template
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
