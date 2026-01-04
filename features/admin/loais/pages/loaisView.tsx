'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { LoaiFormModal } from '@/features/admin/loais/component/LoaiFormModal';
import { useLoaisView } from '../hook/useLoaisView';
import { Plus, Search, Edit, Trash2, Filter, Eye } from 'lucide-react';

export default function LoaisView() {
  const {
    handleCreateLoai,
    setSearchInput,
    handleFilterChange,
    clearFilters,
    formatDate,
    handleEditLoai,
    handleViewLoai,
    handleDeleteLoai,
    setShowModal,
    handleModalSuccess,
    setFilters,
    searchInput,
    filters,
    total,
    loading,
    loais,
    hos,
    nganhs,
    vungPhanBos,
    filteredHos,
    totalPages,
    showModal,
    editingLoai,
    hasActiveFilters,
    isViewMode,
  } = useLoaisView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loai Management</h1>
          <p className="text-gray-600 mt-1">Manage taxonomic species (loais)</p>
        </div>
        <Button onClick={handleCreateLoai}>
          <Plus className="w-4 h-4 mr-2" />
          Add Loai
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <Input
              label="Search by Scientific Name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ten khoa hoc"
            >
              <Search className='text-gray-400 ml-2'/>
            </Input>

          </div>
          
          <Select
            label="Filter by Nganh"
            value={filters.ten_nganh_khoa_hoc || ''}
            onChange={handleFilterChange('ten_nganh_khoa_hoc')}
          >
            <option value="">All Nganhs</option>
            {nganhs.map(nganh => (
              <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                {nganh.ten_khoa_hoc}
              </option>
            ))}
          </Select>

          <Select
            label="Filter by Ho"
            value={filters.ten_ho_khoa_hoc || ''}
            onChange={handleFilterChange('ten_ho_khoa_hoc')}
          >
            <option value="">All Hos</option>
            {filteredHos.map(ho => (
              <option key={ho.ten_khoa_hoc} value={ho.ten_khoa_hoc}>
                {ho.ten_khoa_hoc}
              </option>
            ))}
          </Select>

          <Select
            label="Filter by Vung Phan Bo"
            value={filters.vung_phan_bo || ''}
            onChange={handleFilterChange('vung_phan_bo')}
          >
            <option value="">All Regions</option>
            {vungPhanBos.map(vung => (
              <option key={vung.id} value={vung.id}>
                {vung.ten_dia_phan_hanh_chinh}
              </option>
            ))}
          </Select>

          <div className="flex items-end space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              <Filter className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total: {total} loais
          </div>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {filters.search && (
                <Badge variant="info" className="text-xs">
                  Search: {filters.search}
                </Badge>
              )}
              {filters.ten_nganh_khoa_hoc && (
                <Badge variant="info" className="text-xs">
                  Nganh: {filters.ten_nganh_khoa_hoc}
                </Badge>
              )}
              {filters.ten_ho_khoa_hoc && (
                <Badge variant="info" className="text-xs">
                  Ho: {filters.ten_ho_khoa_hoc}
                </Badge>
              )}
              {filters.vung_phan_bo && (
                <Badge variant="info" className="text-xs">
                  Region: {filters.vung_phan_bo}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading loais...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scientific Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vietnamese Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alternative Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nganh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loais.map((loai) => (
                    <tr key={loai.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {loai.ten_khoa_hoc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loai.ten_tieng_viet || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loai.ten_goi_khac || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {loai.ten_ho_khoa_hoc}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">
                          {loai.ho?.nganh?.ten_khoa_hoc || '-'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(loai.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewLoai(loai)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditLoai(loai)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteLoai(loai.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loais.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  {hasActiveFilters ? 'No loais found matching your filters' : 'No loais found'}
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing {loais.length > 0 ? ((filters.page! - 1) * filters.limit! + 1) : 0} to {Math.min(filters.page! * filters.limit!, total)} of {total} loais
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Rows per page:</label>
                  <select
                    value={filters.limit}
                    onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}
                >
                  First
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {(() => {
                    const currentPage = filters.page!;
                    const pages = [];
                    const maxPagesToShow = 5;
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                    
                    if (endPage - startPage < maxPagesToShow - 1) {
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setFilters(prev => ({ ...prev, page: i }))}
                          className={`px-3 py-1 text-sm rounded ${
                            i === currentPage
                              ? 'bg-blue-600 text-white font-medium'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: totalPages }))}
                >
                  Last
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Loai Form Modal */}
      <LoaiFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        loai={editingLoai}
        viewMode={isViewMode}
      />
    </div>
  );
}