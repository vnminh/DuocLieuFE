'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { VungPhanBo, CreateVungPhanBoData, UpdateVungPhanBoData } from '@/types/vung-phan-bo';
import { createVungPhanBo, updateVungPhanBo, uploadVungPhanBosCsv, getVungPhanBoDetail, VungPhanBoDetail } from '@/lib/api/vung-phan-bo';
import { VungPhanBoFormModalProps } from '../types/vung-phan-bo';

// Rarity color mapping
const RARITY_COLORS: Record<string, string> = {
  'KHÔNG RÕ': 'bg-gray-100 text-gray-700',
  'PHỔ BIẾN': 'bg-green-100 text-green-700',
  'THƯỜNG GẶP': 'bg-blue-100 text-blue-700',
  'HIẾM': 'bg-yellow-100 text-yellow-700',
  'RẤT HIẾM': 'bg-orange-100 text-orange-700',
  'CỰC HIẾM': 'bg-red-100 text-red-700',
};

export function VungPhanBoFormModal({ isOpen, onClose, onSuccess, vungPhanBo, viewMode = false }: VungPhanBoFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [formData, setFormData] = useState({
    ten_dia_phan_hanh_chinh: '',
    danh_sach_diem_bien: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailData, setDetailData] = useState<VungPhanBoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const isEditMode = !!vungPhanBo && !viewMode;

  useEffect(() => {
    if (isOpen) {
      if (vungPhanBo) {
        setFormData({
          ten_dia_phan_hanh_chinh: vungPhanBo.ten_dia_phan_hanh_chinh || '',
          danh_sach_diem_bien: vungPhanBo.danh_sach_diem_bien || ''
        });
        
        // Fetch detail data when viewing
        if (viewMode) {
          setLoadingDetail(true);
          getVungPhanBoDetail(vungPhanBo.id)
            .then(detail => setDetailData(detail))
            .catch(console.error)
            .finally(() => setLoadingDetail(false));
        }
      } else {
        setFormData({
          ten_dia_phan_hanh_chinh: '',
          danh_sach_diem_bien: ''
        });
        setDetailData(null);
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, vungPhanBo, viewMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ten_dia_phan_hanh_chinh.trim()) {
      newErrors.ten_dia_phan_hanh_chinh = 'Tên địa phận hành chính là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ten_dia_phan_hanh_chinh: formData.ten_dia_phan_hanh_chinh.trim(),
        danh_sach_diem_bien: formData.danh_sach_diem_bien.trim() || undefined
      };

      if (isEditMode && vungPhanBo) {
        const updateData: UpdateVungPhanBoData = { ...submitData };
        await updateVungPhanBo(vungPhanBo.id, updateData);
      } else {
        const createData: CreateVungPhanBoData = { ...submitData };
        await createVungPhanBo(createData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu vùng phân bố:', error);
      setErrors({ submit: 'Lưu vùng phân bố thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    const result = await uploadVungPhanBosCsv(file);
    if (result.success > 0) {
      onSuccess();
    }
    return result;
  };

  const csvColumns = ['ten_dia_phan_hanh_chinh', 'danh_sach_diem_bien'];
  const sampleCsvData = {
    ten_dia_phan_hanh_chinh: 'Hà Nội',
    danh_sach_diem_bien: 'Điểm 1, Điểm 2, Điểm 3'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'Xem Vùng phân bố' : (isEditMode ? 'Sửa Vùng phân bố' : 'Thêm Vùng phân bố')}
      className="max-w-2xl"
    >
      {/* Tabs */}
      {!isEditMode && !viewMode && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'form'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nhập thủ công
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'csv'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tải lên CSV
          </button>
        </div>
      )}

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên địa phận hành chính"
            name="ten_dia_phan_hanh_chinh"
            value={formData.ten_dia_phan_hanh_chinh}
            onChange={handleInputChange}
            placeholder="Nhập tên địa phận hành chính"
            required
            disabled={viewMode}
            error={errors.ten_dia_phan_hanh_chinh}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh sách điểm biên
            </label>
            <textarea
              name="danh_sach_diem_bien"
              value={formData.danh_sach_diem_bien}
              onChange={handleInputChange}
              placeholder="Nhập danh sách điểm biên (không bắt buộc)"
              rows={4}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Related Loais Section - Only in view mode */}
          {viewMode && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  Loài liên quan trong vùng này
                </h3>
                {detailData && (
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {detailData.loais_count} loài
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {detailData.vi_tri_dia_li_count} vị trí
                    </span>
                  </div>
                )}
              </div>
              
              {loadingDetail ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Đang tải dữ liệu liên quan...</span>
                </div>
              ) : detailData?.loais && detailData.loais.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên khoa học</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên tiếng Việt</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rarity</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coords</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailData.loais.map((loai) => (
                        <tr key={loai.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900 font-medium">{loai.ten_khoa_hoc}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{loai.ten_tieng_viet || '-'}</td>
                          <td className="px-3 py-2 text-sm">
                            {loai.muc_do_quy_hiem ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs ${RARITY_COLORS[loai.muc_do_quy_hiem] || 'bg-gray-100 text-gray-700'}`}>
                                {loai.muc_do_quy_hiem}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                              {loai.coordinates.length} điểm
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-2">Không có loài liên quan trong vùng này.</p>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {viewMode ? 'Đóng' : 'Hủy'}
            </Button>
            {!viewMode && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo'}
              </Button>
            )}
          </div>
        </form>
      ) : (
        <CsvUpload
          onUpload={handleCsvUpload}
          acceptedColumns={csvColumns}
          sampleData={sampleCsvData}
        />
      )}
    </Modal>
  );
}
