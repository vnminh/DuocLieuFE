'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { HoFormModal } from '@/features/admin/hos/component/HoFormModal';
import { useHosView } from '../hook/useHosView';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function HosView() {
  const {
    handleCreateHo,
    setSearchInput,
    handleNganhFilterChange,
    formatDate,
    handleEditHo,
    handleViewHo,
    handleDeleteHo,
    setShowModal,
    handleModalSuccess,
    setFilters,
    searchInput,
    filters,
    total,
    loading,
    hos,
    nganhs,
    totalPages,
    showModal,
    editingHo,
    isViewMode,
  } = useHosView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ho Management</h1>
          <p className="text-gray-600 mt-1">Manage taxonomic families (hos)</p>
        </div>
        <Button onClick={handleCreateHo}>
          <Plus className="w-4 h-4 mr-2" />
          Add Ho
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              label="Search by Scientific Name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ten khoa hoc"
            >
              <Search className="text-gray-400 ml-2" />
            </Input>
          </div>
          
          <Select
            label="Filter by Nganh"
            value={filters.ten_nganh_khoa_hoc || ''}
            onChange={handleNganhFilterChange}
          >
            <option value="">All Nganhs</option>
            {nganhs.map(nganh => (
              <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                {nganh.ten_khoa_hoc}
              </option>
            ))}
          </Select>

          <div className="flex items-end col-start-1">
            <div className="text-sm text-gray-600">
              Total: {total} hos
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading hos...</p>
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
                      Nganh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loais Count
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
                  {hos.map((ho) => (
                    <tr key={ho.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ho.ten_khoa_hoc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ho.ten_tieng_viet || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {ho.ten_nganh_khoa_hoc}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {ho.mo_ta || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">
                          {ho.loais_count  || 0} loais
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(ho.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewHo(ho)}
                        >
                          <span className="flex items-center"> 
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditHo(ho)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteHo(ho.id)}
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

            {hos.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No hos found</p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={filters.page!}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.limit!}
              itemsCount={hos.length}
              itemName="hos"
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
            />
          </>
        )}
      </div>

      {/* Ho Form Modal */}
      <HoFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        ho={editingHo}
        viewMode={isViewMode}
      />
    </div>
  );
}