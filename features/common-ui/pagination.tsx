'use client';

import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemsCount: number;
  itemName?: string;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemsCount,
  itemName = 'items',
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 25, 50, 100],
}: PaginationProps) {
  // Calculate page numbers to show with ellipsis
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the start: 1, 2, 3, ..., last
      pages.push(2, 3);
      if (totalPages > 4) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: 1, ..., n-2, n-1, n
      pages.push('ellipsis-start');
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle: 1, ..., current-1, current, current+1, ..., last
      pages.push('ellipsis-start');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis-end');
      pages.push(totalPages);
    }

    return pages;
  };
  
  return (
    <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Hiển thị {totalItems} {itemName}
        </div>
        {onLimitChange && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Số dòng mỗi trang:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {limitOptions.map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          title="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers with ellipsis */}
        <div className="flex space-x-1">
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span
                  key={page}
                  className="px-3 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
          title="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
