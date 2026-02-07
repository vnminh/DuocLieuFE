'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { LoaiFormModal } from '@/features/admin/loais/component/LoaiFormModal';
import { LoaiCard } from '@/features/admin/loais/component/LoaiCard';
import { useLoaisView } from '../hook/useLoaisView';
import { Plus, Search, Edit, Trash2, Filter, Eye, List, LayoutGrid } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';
import { ErrorModal } from '@/features/common-ui/error-modal';

export default function LoaisView() {
  const { canEdit, canDelete, canAdd } = usePermissions();
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
    nganhs,
    vungPhanBos,
    filteredHos,
    totalPages,
    showModal,
    editingLoai,
    hasActiveFilters,
    isViewMode,
    displayMode,
    setDisplayMode,
    errorMessage,
    setErrorMessage,
  } = useLoaisView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loai Management</h1>
          <p className="text-gray-600 mt-1">Manage taxonomic species (loais)</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDisplayMode('list')}
              className={`p-2 rounded-md transition-colors ${
                displayMode === 'list'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDisplayMode('card')}
              className={`p-2 rounded-md transition-colors ${
                displayMode === 'card'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          {canAdd && (
            <Button onClick={handleCreateLoai}>
              <Plus className="w-4 h-4 mr-2" />
              Add Loai
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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

      {/* Content - List or Card View */}
      {loading ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading loais...</p>
        </div>
      ) : loais.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters ? 'No loais found matching your filters' : 'No loais found'}
          </p>
        </div>
      ) : (
        <>
          {displayMode === 'card' ? (
            /* Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loais.map((loai) => (
                <LoaiCard
                  key={loai.id}
                  loai={loai}
                  onView={handleViewLoai}
                  onEdit={handleEditLoai}
                  onDelete={handleDeleteLoai}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            /* List View (Table) */
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                          <span className="flex items-center">           
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </span>
                        </Button>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleEditLoai(loai)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteLoai(loai.id)}
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
          </div>
          )}

          {/* Shared Pagination for both views */}
          <div className={displayMode === 'card' ? 'mt-6 bg-white shadow-sm rounded-lg' : ''}>
            <Pagination
              currentPage={filters.page!}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.limit!}
              itemsCount={loais.length}
              itemName="loais"
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
            />
          </div>
        </>
      )}

      {/* Loai Form Modal */}
      <LoaiFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        loai={editingLoai}
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
