'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/features/common-ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CsvUploadProps {
  onUpload: (file: File) => Promise<{ success: number, errors: string[] }>;
  acceptedColumns: string[];
  sampleData?: Record<string, string>;
}

export function CsvUpload({ onUpload, acceptedColumns, sampleData }: CsvUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ success: number, errors: string[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      setResults({ success: 0, errors: ['Please select a CSV file'] });
      return;
    }

    setUploading(true);
    setResults(null);

    try {
      const result = await onUpload(file);
      setResults(result);
    } catch (error) {
      setResults({ 
        success: 0, 
        errors: [error instanceof Error ? error.message : 'Upload failed'] 
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
          Drop your CSV file here, or click to browse
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Supports CSV files with the following columns
        </p>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mb-4"
        >
          {uploading ? 'Uploading...' : 'Select CSV File'}
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
        <h4 className="font-medium text-gray-900 mb-2">Expected CSV Columns:</h4>
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
              Need help with the format?
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={downloadSampleCsv}
          >
            Download Sample CSV
          </Button>
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
              Upload Results
            </h4>
          </div>
          
          {results.success > 0 && (
            <p className="text-sm text-green-700 mb-2">
              ✅ Successfully imported {results.success} records
            </p>
          )}
          
          {results.errors.length > 0 && (
            <div>
              <p className="text-sm text-red-700 mb-2">
                ❌ {results.errors.length} errors occurred:
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