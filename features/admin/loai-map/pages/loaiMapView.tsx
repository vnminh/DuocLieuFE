'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLoaiMapView } from '../hook/useLoaiMapView';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { LoaiFormModal } from '@/features/admin/loais/component/LoaiFormModal';
import { MapPin, Trees, AlertTriangle } from 'lucide-react';

// Dynamic import of Mapbox map component (SSR disabled)
const MapboxMap = dynamic(
  () => import('../component/MapboxMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Đang tải bản đồ...</p>
        </div>
      </div>
    ),
  }
);

export default function LoaiMapView() {
  const {
    vungPhanBos,
    selectedVungPhanBo,
    loais,
    selectedLoai,
    loading,
    loadingLoais,
    handleSelectVungPhanBo,
    handleSelectLoai,
    // Modal states
    showLoaiModal,
    viewingLoai,
    handleViewLoaiDetail,
    closeLoaiModal,
  } = useLoaiMapView();

  const getMucDoQuyHiemBadge = (mucDo: string | undefined) => {
    switch (mucDo) {
      case 'RAT_CAO':
        return <Badge variant="danger">Rất cao</Badge>;
      case 'CAO':
        return <Badge variant="warning">Cao</Badge>;
      case 'TRUNG_BINH':
        return <Badge variant="info">Trung bình</Badge>;
      default:
        return <Badge variant="success">Thấp</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bản đồ loài</h1>
        <p className="text-gray-600 mt-1">
          Xem và quản lý các loài cây dược liệu theo vùng phân bố
        </p>
      </div>

      {/* Main Content - 3 Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-250px)]">
        {/* Left Column - Map and Select (3/4 width) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Vung Phan Bo Select */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Select
              label="Chọn vùng phân bố"
              value={selectedVungPhanBo?.id?.toString() || ''}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const vung = vungPhanBos.find((v) => v.id === id);
                handleSelectVungPhanBo(vung || null);
              }}
            >
              <option value="">-- Chọn vùng để xem danh sách loài --</option>
              {vungPhanBos.map((vung) => (
                <option key={vung.id} value={vung.id}>
                  {vung.ten_dia_phan_hanh_chinh} ({vung.loai_count} loài)
                </option>
              ))}
            </Select>
          </div>

          {/* Map Container */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative">
            <MapboxMap
              vungPhanBos={vungPhanBos}
              selectedVungPhanBo={selectedVungPhanBo}
              loais={loais}
              selectedLoai={selectedLoai}
              onSelectVungPhanBo={handleSelectVungPhanBo}
              onSelectLoai={handleSelectLoai}
              onViewLoaiDetail={handleViewLoaiDetail}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Mức độ quý hiếm</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                  <span className='text-gray-700'>Thấp</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                  <span className='text-gray-700'>Trung bình</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
                  <span className='text-gray-700'>Cao</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
                  <span className='text-gray-700'>Rất cao</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Loais Sidebar (1/4 width) */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">
                Loài trong vùng phân bố
              </h3>
            </div>
            {selectedVungPhanBo && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedVungPhanBo.ten_dia_phan_hanh_chinh}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedVungPhanBo ? (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  Chọn vùng phân bố cần xem chi tiết
                </p>
              </div>
            ) : loadingLoais ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Đang tải các loài...</p>
              </div>
            ) : loais.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Không có loài nào trong vùng phân bố được chọn</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {loais.map((loai) => (
                  <li
                    key={loai.id}
                    onClick={() => handleSelectLoai(loai)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-blue-50 ${
                      selectedLoai?.id === loai.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {loai.ten_khoa_hoc}
                        </p>
                        {loai.ten_tieng_viet && (
                          <p className="text-xs text-gray-600 truncate">
                            {loai.ten_tieng_viet}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {loai.vi_tri_dia_li.length} vị trí
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getMucDoQuyHiemBadge(loai.dac_diem_sinh_hoc?.muc_do_quy_hiem)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedVungPhanBo && loais.length > 0 && (
            <div className="p-3 bg-gray-50 text-center">
              <span className="text-sm text-gray-600">
                Tổng: {loais.length} loài
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loai Detail Modal */}
      <LoaiFormModal
        isOpen={showLoaiModal}
        onClose={closeLoaiModal}
        onSuccess={closeLoaiModal}
        loai={viewingLoai}
        viewMode={true}
      />
    </div>
  );
}
