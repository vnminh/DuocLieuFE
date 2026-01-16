'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { NganhFormModal } from '@/features/admin/nganhs/component/NganhFormModal';
import { useNganhsView } from '../hook/useNganhsView';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function NganhsView() {
  const {
    handleCreateNganh,
    setSearchInput,
    formatDate,
    handleEditNganh,
    handleViewNganh,
    handleDeleteNganh,
    setShowModal,
    handleModalSuccess,
    setFilters,
    searchInput,
    filters,
    total,
    loading,
    nganhs,
    totalPages,
    showModal,
    editingNganh,
    isViewMode,
  } = useNganhsView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nganh Management</h1>
          <p className="text-gray-600 mt-1">Manage taxonomic kingdoms (nganhs)</p>
        </div>
        <Button onClick={handleCreateNganh}>
          <Plus className="w-4 h-4 mr-2" />
          Add Nganh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              label="Search by Scientific Name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ten_khoa_hoc..."
            >
              <Search className='text-gray-400 ml-2'/>
            </Input>
          </div>

          <div className="flex items-end col-start-1">
            <div className="text-sm text-gray-600">
              Total: {total} nganhs
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading nganhs...</p>
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
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hos Count
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
                  {nganhs.map((nganh) => (
                    <tr key={nganh.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {nganh.ten_khoa_hoc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {nganh.ten_tieng_viet || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {nganh.mo_ta || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {nganh.hos_count || 0} 
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(nganh.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewNganh(nganh)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditNganh(nganh)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteNganh(nganh.id)}
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

            {nganhs.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No nganhs found</p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={filters.page!}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.limit!}
              itemsCount={nganhs.length}
              itemName="nganhs"
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
            />
          </>
        )}
      </div>

      {/* Nganh Form Modal */}
      <NganhFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        nganh={editingNganh}
        viewMode={isViewMode}
      />
    </div>
  );
}