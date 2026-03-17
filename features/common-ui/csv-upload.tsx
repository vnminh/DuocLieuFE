'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/features/common-ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSVFile, CSVPreviewData, validateCSVHeaders } from '@/lib/csvPreview';

interface CsvUploadProps {
  onUpload: (file: File) => Promise<{ success: number, errors: string[] }>;
  acceptedColumns: string[];
  sampleData?: Record<string, string>;
  requiredFields?: string[];
  showPreview?: boolean;
  previewRows?: number;
}

interface ParsedCSVState {
  data: CSVPreviewData | null;
  error: string | null;
  loading: boolean;
}

/**
 * CSV Upload Component with Preview
 * 
 * Features:
 * - Drag and drop file upload
 * - CSV file validation and preview
 * - Header validation against required fields
 * - Sample data download
 * - Upload result feedback
 * 
 * @example
 * ```tsx
 * <CsvUpload
 *   onUpload={uploadHosCsv}
 *   acceptedColumns={['ten_khoa_hoc', 'ten_tieng_viet', 'ten_nganh_khoa_hoc']}
 *   requiredFields={['ten_khoa_hoc', 'ten_nganh_khoa_hoc']}
 *   sampleData={{
 *     ten_khoa_hoc: 'Họ A',
 *     ten_tieng_viet: 'Họ A Tiếng Việt',
 *     ten_nganh_khoa_hoc: 'Ngành B'
 *   }}
 *   showPreview={true}
 *   previewRows={5}
 * />
 * ```
 */
export function CsvUpload({ 
  onUpload, 
  acceptedColumns, 
  sampleData,
  requiredFields = [],
  showPreview = true,
  previewRows = 5
}: CsvUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ success: number, errors: string[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [csvPreview, setCSVPreview] = useState<ParsedCSVState>({ 
    data: null, 
    error: null, 
    loading: false 
  });
  const [showAllRows, setShowAllRows] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      setResults({ success: 0, errors: ['Vui lòng chọn file CSV'] });
      return;
    }

    // Parse CSV for preview
    if (showPreview) {
      setCSVPreview({ data: null, error: null, loading: true });
      setShowAllRows(false);
      try {
        const parsedData = await parseCSVFile(file, previewRows);
        
        // Validate headers if required fields specified
        if (requiredFields.length > 0) {
          const validation = validateCSVHeaders(parsedData.headers, requiredFields);
          if (!validation.isValid) {
            setCSVPreview({
              data: null,
              error: `Thiếu các cột bắt buộc: ${validation.missingFields.join(', ')}`,
              loading: false
            });
            return;
          }
        }
        
        setCSVPreview({ data: parsedData, error: null, loading: false });
      } catch (err) {
        setCSVPreview({
          data: null,
          error: err instanceof Error ? err.message : 'Xử lý file CSV thất bại',
          loading: false
        });
        return;
      }
    }

    // Upload file
    setUploading(true);
    setResults(null);

    try {
      const result = await onUpload(file);
      setResults(result);
    } catch (error) {
      setResults({ 
        success: 0, 
        errors: [error instanceof Error ? error.message : 'Tải lên thất bại'] 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const downloadSampleCsv = () => {
    if (!sampleData) return;
    
    const headers = Object.keys(sampleData).join(',');
    const values = Object.values(sampleData).join(',');
    const csvContent = `${headers}\n${values}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Thả file CSV vào đây hoặc bấm để chọn
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Hỗ trợ file CSV với các cột sau
        </p>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mb-4"
        >
          {uploading ? 'Đang tải lên...' : 'Chọn file CSV'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Accepted Columns */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Các cột CSV cần có:</h4>
        <div className="flex flex-wrap gap-2">
          {acceptedColumns.map((column) => (
            <span
              key={column}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {column}
            </span>
          ))}
        </div>
      </div>

      {/* Sample Download */}
      {sampleData && (
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">
              Cần hỗ trợ định dạng?
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={downloadSampleCsv}
          >
            Tải file CSV mẫu
          </Button>
        </div>
      )}

      {/* CSV Preview Loading State */}
      {showPreview && csvPreview.loading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">Đang xử lý file CSV...</div>
        </div>
      )}

      {/* CSV Preview Error State */}
      {showPreview && csvPreview.error && (
        <div className="rounded-lg p-4 bg-red-50">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Lỗi khi kiểm tra format file CSV</h4>
          </div>
          <p className="text-sm text-red-700">{csvPreview.error}</p>
        </div>
      )}

      {/* CSV Preview Table */}
      {showPreview && csvPreview.data && (
        <div className="rounded-lg border border-gray-200 p-4 overflow-auto">
          <div className="mb-3">
            <h4 className="font-medium text-gray-900 mb-2">Xem trước</h4>
            <p className="text-sm text-gray-600">
              Tổng số dòng: <span className="font-semibold">{csvPreview.data.totalRows}</span>
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {csvPreview.data.headers.map((header) => (
                    <th 
                      key={header}
                      className="text-left px-3 py-2 bg-gray-50 font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showAllRows ? csvPreview.data.rows : csvPreview.data.preview).map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    {csvPreview.data!.headers.map((header) => (
                      <td 
                        key={`${idx}-${header}`}
                        className="px-3 py-2 text-gray-700"
                      >
                        {row[header] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {csvPreview.data.totalRows > csvPreview.data.preview.length && (
            <a 
              className="text-xs text-gray-600 mt-2 hover:underline hover:cursor-pointer block"
              onClick={() => setShowAllRows(!showAllRows)}
            >
              {showAllRows 
                ? 'Ẩn' 
                : `... và ${csvPreview.data.totalRows - csvPreview.data.preview.length} dòng nữa`
              }
            </a>
          )}
        </div>
      )}

      {/* Upload Results */}
      {results && (
        <div className={`rounded-lg p-4 ${
          results.errors.length > 0 ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center mb-2">
            {results.errors.length > 0 ? (
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            )}
            <h4 className={`font-medium ${
              results.errors.length > 0 ? 'text-red-800' : 'text-green-800'
            }`}>
              Kết quả tải lên
            </h4>
          </div>
          
          {results.success > 0 && (
            <p className="text-sm text-green-700 mb-2">
              ✅ Đã thêm thành công {results.success} bản ghi
            </p>
          )}
          
          {results.errors.length > 0 && (
            <div>
              <p className="text-sm text-red-700 mb-2">
                ❌ {results.errors.length} lỗi đã xảy ra:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                {results.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
