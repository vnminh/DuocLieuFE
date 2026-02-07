'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { VungPhanBoFormModal } from '@/features/admin/vung-phan-bo/component/VungPhanBoFormModal';
import { useVungPhanBoView } from '../hook/useVungPhanBoView';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';
import { ErrorModal } from '@/features/common-ui/error-modal';

export default function VungPhanBoView() {
  const { canEdit, canDelete, canAdd } = usePermissions();
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
    errorMessage,
    setErrorMessage,
  } = useVungPhanBoView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vùng Phân Bố Management</h1>
          <p className="text-gray-600 mt-1">Manage distribution regions</p>
        </div>
        {canAdd && (
          <Button onClick={handleCreateVungPhanBo}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vùng Phân Bố
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleEditVungPhanBo(vungPhanBo)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteVungPhanBo(vungPhanBo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        )}
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
            <Pagination
              currentPage={filters.page!}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.limit!}
              itemsCount={vungPhanBos.length}
              itemName="regions"
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
            />
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

      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </div>
  );
}
