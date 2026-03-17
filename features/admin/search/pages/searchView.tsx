'use client';

import React from 'react';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { Button } from '@/features/common-ui/button';
import { useSearchView, SearchType } from '../hook/useSearchView';
import { LoaiFormModal } from '@/features/admin/loais/component/LoaiFormModal';
import { HoFormModal } from '@/features/admin/hos/component/HoFormModal';
import { NganhFormModal } from '@/features/admin/nganhs/component/NganhFormModal';
import { Search, Eye, Layers, Heart, Filter, X, Edit, Trash2 } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';

export default function SearchView() {
  const { canEdit, canDelete } = usePermissions();
  const {
    searchType,
    searchInput,
    loading,
    page,
    limit,
    total,
    totalPages,
    loais,
    hos,
    nganhs,
    allNganhs,
    filteredHos,
    allVungPhanBos,
    filterNganh,
    filterHo,
    filterVungPhanBo,
    hasActiveFilters,
    // Modal states
    showLoaiModal,
    showHoModal,
    showNganhModal,
    editingLoai,
    editingHo,
    editingNganh,
    isViewMode,
    // Setters
    setSearchInput,
    setShowLoaiModal,
    setShowHoModal,
    setShowNganhModal,
    // Handlers
    handleSearchTypeChange,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    clearFilters,
    formatDate,
    getResultsCount,
    // Loai handlers
    handleViewLoai,
    handleEditLoai,
    handleDeleteLoai,
    handleLoaiModalSuccess,
    // Ho handlers
    handleViewHo,
    handleEditHo,
    handleDeleteHo,
    handleHoModalSuccess,
    // Nganh handlers
    handleViewNganh,
    handleEditNganh,
    handleDeleteNganh,
    handleNganhModalSuccess,
  } = useSearchView();

  const searchTypes: { value: SearchType; label: string; icon: React.ReactNode }[] = [
    { value: 'loais', label: 'Loài', icon: <Layers className="w-4 h-4" /> },
    { value: 'hos', label: 'Họ', icon: <Heart className="w-4 h-4" /> },
    { value: 'nganhs', label: 'Ngành', icon: <Filter className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-1">Tìm kiếm trên loài, họ và ngành</p>
      </div>

      {/* Search Type Radio Buttons and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Radio Button Group */}
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">Tìm trong:</span>
            {searchTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                  searchType === type.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="searchType"
                  value={type.value}
                  checked={searchType === type.value}
                  onChange={() => handleSearchTypeChange(type.value)}
                  className="sr-only"
                />
                {type.icon}
                <span className="font-medium">{type.label}</span>
              </label>
            ))}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Input
                label="Tìm theo tên khoa học"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search ${searchType}...`}
              >
                <Search className="text-gray-400 ml-2" />
              </Input>
            </div>

            {/* Loais Filters */}
            {searchType === 'loais' && (
              <>
                <Select
                  label="Filter by Nganh"
                  value={filterNganh}
                  onChange={handleFilterChange('nganh')}
                >
                  <option value="">Tất cả Ngành</option>
                  {allNganhs.map(nganh => (
                    <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                      {nganh.ten_khoa_hoc}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Lọc theo Họ"
                  value={filterHo}
                  onChange={handleFilterChange('ho')}
                >
                  <option value="">Tất cả Họ</option>
                  {filteredHos.map(ho => (
                    <option key={ho.ten_khoa_hoc} value={ho.ten_khoa_hoc}>
                      {ho.ten_khoa_hoc}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Lọc theo Vùng phân bố"
                  value={filterVungPhanBo}
                  onChange={handleFilterChange('vungPhanBo')}
                >
                  <option value="">Tất cả vùng</option>
                  {allVungPhanBos.map(vung => (
                    <option key={vung.id} value={vung.id}>
                      {vung.ten_dia_phan_hanh_chinh}
                    </option>
                  ))}
                </Select>
              </>
            )}

            {/* Hos Filters */}
            {searchType === 'hos' && (
              <Select
                label="Lọc theo Ngành"
                value={filterNganh}
                onChange={handleFilterChange('nganh')}
              >
                <option value="">Tất cả Ngành</option>
                {allNganhs.map(nganh => (
                  <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                    {nganh.ten_khoa_hoc}
                  </option>
                ))}
              </Select>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa lọc
                </Button>
              </div>
            )}
          </div>

          {/* Results Count and Active Filters */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total: {total} {searchType}
            </div>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
                {searchInput && (
                  <Badge variant="info" className="text-xs">
                    Search: {searchInput}
                  </Badge>
                )}
                {filterNganh && (
                  <Badge variant="info" className="text-xs">
                    Nganh: {filterNganh}
                  </Badge>
                )}
                {filterHo && (
                  <Badge variant="info" className="text-xs">
                    Ho: {filterHo}
                  </Badge>
                )}
                {filterVungPhanBo && (
                  <Badge variant="info" className="text-xs">
                    Vùng: {filterVungPhanBo}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tìm kiếm...</p>
        </div>
      ) : getResultsCount() === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters ? `Không tìm thấy ${searchType} phù hợp bộ lọc` : `Không tìm thấy ${searchType}`}
          </p>
        </div>
      ) : (
        <>
          {/* Loais Table */}
          {searchType === 'loais' && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên khoa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên tiếng Việt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ho
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nganh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
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
                          <Badge variant="info">{loai.ten_ho_khoa_hoc}</Badge>
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
                              Xem
                            </span>
                          </Button>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditLoai(loai)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteLoai(loai.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
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

          {/* Hos Table */}
          {searchType === 'hos' && (
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
                        Nganh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng loài
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
                          <Badge variant="info">{ho.ten_nganh_khoa_hoc}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {ho.mo_ta || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">
                            {ho.loais_count || 0} loài
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
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditHo(ho)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteHo(ho.id)}
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

          {/* Nganhs Table */}
          {searchType === 'nganhs' && (
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
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng họ
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
                            {nganh.hos_count || 0} họ
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
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </span>
                          </Button>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditNganh(nganh)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteNganh(nganh.id)}
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

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={limit}
            itemsCount={getResultsCount()}
            itemName={searchType}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {/* Loai Form Modal */}
      <LoaiFormModal
        isOpen={showLoaiModal}
        onClose={() => setShowLoaiModal(false)}
        onSuccess={handleLoaiModalSuccess}
        loai={editingLoai}
        viewMode={isViewMode}
      />

      {/* Ho Form Modal */}
      <HoFormModal
        isOpen={showHoModal}
        onClose={() => setShowHoModal(false)}
        onSuccess={handleHoModalSuccess}
        ho={editingHo}
        viewMode={isViewMode}
      />

      {/* Nganh Form Modal */}
      <NganhFormModal
        isOpen={showNganhModal}
        onClose={() => setShowNganhModal(false)}
        onSuccess={handleNganhModalSuccess}
        nganh={editingNganh}
        viewMode={isViewMode}
      />
    </div>
  );
}
