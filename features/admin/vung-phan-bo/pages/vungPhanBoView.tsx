'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Badge } from '@/features/common-ui/badge';
import { VungPhanBoFormModal } from '@/features/admin/vung-phan-bo/component/VungPhanBoFormModal';
import { useVungPhanBoView } from '../hook/useVungPhanBoView';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function VungPhanBoView() {
  const {
    handleCreateVungPhanBo,
    setSearchInput,
    formatDate,
    handleEditVungPhanBo,
    handleViewVungPhanBo,
    handleDeleteVungPhanBo,
    setShowModal,
    handleModalSuccess,
    setFilters,
    searchInput,
    filters,
    total,
    loading,
    vungPhanBos,
    totalPages,
    showModal,
    editingVungPhanBo,
    isViewMode,
  } = useVungPhanBoView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vùng Phân Bố Management</h1>
          <p className="text-gray-600 mt-1">Manage distribution regions</p>
        </div>
        <Button onClick={handleCreateVungPhanBo}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vùng Phân Bố
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              label="Search by Administrative Region"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ten_dia_phan_hanh_chinh..."
            >
              <Search className='text-gray-400 ml-2'/>
            </Input>
          </div>

          <div className="flex items-end col-start-1">
            <div className="text-sm text-gray-600">
              Total: {total} distribution regions
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading distribution regions...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Administrative Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Boundary Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locations Count
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
                  {vungPhanBos.map((vungPhanBo) => (
                    <tr key={vungPhanBo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vungPhanBo.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vungPhanBo.ten_dia_phan_hanh_chinh}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {vungPhanBo.danh_sach_diem_bien || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {vungPhanBo.vi_tri_dia_li_count || 0} locations
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(vungPhanBo.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewVungPhanBo(vungPhanBo)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditVungPhanBo(vungPhanBo)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteVungPhanBo(vungPhanBo.id)}
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

            {vungPhanBos.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No distribution regions found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing {vungPhanBos.length > 0 ? ((filters.page! - 1) * filters.limit! + 1) : 0} to {Math.min(filters.page! * filters.limit!, total)} of {total} regions
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

      {/* VungPhanBo Form Modal */}
      <VungPhanBoFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        vungPhanBo={editingVungPhanBo}
        viewMode={isViewMode}
      />
    </div>
  );
}
