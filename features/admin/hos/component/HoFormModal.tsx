'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { Ho, CreateHoData, UpdateHoData } from '@/types/hos';
import { Nganh } from '@/types/nganhs';
import { createHo, updateHo, uploadHosCsv, getHoDetail, HoDetail } from '@/lib/api/hos';
import { loadAllNganhs } from '@/lib/api/nganhs';
import { HoFormModalProps } from '../types/hos';

// Rarity color mapping
const RARITY_COLORS: Record<string, string> = {
  'KHÔNG RÕ': 'bg-gray-100 text-gray-700',
  'PHỔ BIẾN': 'bg-green-100 text-green-700',
  'THƯỜNG GẶP': 'bg-blue-100 text-blue-700',
  'HIẾM': 'bg-yellow-100 text-yellow-700',
  'RẤT HIẾM': 'bg-orange-100 text-orange-700',
  'CỰC HIẾM': 'bg-red-100 text-red-700',
};

export function HoFormModal({ isOpen, onClose, onSuccess, ho, viewMode = false }: HoFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [nganhs, setNganhs] = useState<Nganh[]>([]);
  const [formData, setFormData] = useState({
    ten_khoa_hoc: '',
    ten_tieng_viet: '',
    mo_ta: '',
    ten_nganh_khoa_hoc: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailData, setDetailData] = useState<HoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const isEditMode = !!ho && !viewMode;

  useEffect(() => {
    if (isOpen) {
      loadAllNganhs().then(setNganhs).catch(console.error);
      
      if (ho) {
        setFormData({
          ten_khoa_hoc: ho.ten_khoa_hoc || '',
          ten_tieng_viet: ho.ten_tieng_viet || '',
          mo_ta: ho.mo_ta || '',
          ten_nganh_khoa_hoc: ho.ten_nganh_khoa_hoc || ''
        });
        
        // Fetch detail data when viewing
        if (viewMode) {
          setLoadingDetail(true);
          getHoDetail(ho.id)
            .then(detail => setDetailData(detail))
            .catch(console.error)
            .finally(() => setLoadingDetail(false));
        }
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          mo_ta: '',
          ten_nganh_khoa_hoc: ''
        });
        setDetailData(null);
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, ho, viewMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.ten_khoa_hoc.trim()) {
      newErrors.ten_khoa_hoc = 'Tên khoa học là bắt buộc';
    }

    if (!formData.ten_nganh_khoa_hoc.trim()) {
      newErrors.ten_nganh_khoa_hoc = 'Vui lòng chọn ngành';
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
        ten_khoa_hoc: formData.ten_khoa_hoc.trim(),
        ten_tieng_viet: formData.ten_tieng_viet.trim() || undefined,
        mo_ta: formData.mo_ta.trim() || undefined,
        ten_nganh_khoa_hoc: formData.ten_nganh_khoa_hoc.trim()
      };

      if (isEditMode && ho) {
        const updateData: UpdateHoData = { ...submitData };
        await updateHo(ho.id, updateData);
      } else {
        const createData: CreateHoData = { ...submitData };
        await createHo(createData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu họ:', error);
      setErrors({ submit: 'Lưu họ thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    const result = await uploadHosCsv(file);
    if (result.success > 0) {
      onSuccess();
    }
    return result;
  };

  const csvColumns = ['ten_khoa_hoc', 'ten_tieng_viet', 'mo_ta', 'ten_nganh_khoa_hoc'];
  const sampleCsvData = {
    ten_khoa_hoc: 'Asteraceae',
    ten_tieng_viet: 'Họ Cúc',
    mo_ta: 'Mô tả họ cúc',
    ten_nganh_khoa_hoc: 'Plantae'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'Xem Họ' : (isEditMode ? 'Sửa Họ' : 'Thêm Họ')}
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

      {/* Form Tab */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên khoa học *"
            name="ten_khoa_hoc"
            value={formData.ten_khoa_hoc}
            onChange={handleInputChange}
            error={errors.ten_khoa_hoc}
            placeholder="Nhập tên khoa học"
            disabled={viewMode}
          />

          <Input
            label="Tên tiếng Việt"
            name="ten_tieng_viet"
            value={formData.ten_tieng_viet}
            onChange={handleInputChange}
            placeholder="Nhập tên tiếng Việt"
            disabled={viewMode}
          />

          <Select
            label="Nganh (Ten Nganh Khoa Hoc) *"
            name="ten_nganh_khoa_hoc"
            value={formData.ten_nganh_khoa_hoc}
            onChange={handleInputChange}
            error={errors.ten_nganh_khoa_hoc}
            disabled={viewMode}
          >
            <option value="">Chọn ngành</option>
            {nganhs.map(nganh => (
              <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                {nganh.ten_khoa_hoc} {nganh.ten_tieng_viet && `(${nganh.ten_tieng_viet})`}
              </option>
            ))}
          </Select>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleInputChange}
              rows={3}
              disabled={viewMode}
              className="text-gray-700 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
              placeholder="Nhập mô tả"
            />
          </div>

          {/* Related Loais Section - Only in view mode */}
          {viewMode && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  Related Species (Loài)
                </h3>
                {detailData && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {detailData.loais_count} loài
                  </span>
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Locations</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailData.loais.map((loai) => (
                        <tr key={loai.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900 font-medium">{loai.ten_khoa_hoc}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{loai.ten_tieng_viet || '-'}</td>
                          <td className="px-3 py-2 text-sm">
                            {loai.dac_diem_sinh_hoc?.muc_do_quy_hiem ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs ${RARITY_COLORS[loai.dac_diem_sinh_hoc.muc_do_quy_hiem] || 'bg-gray-100 text-gray-700'}`}>
                                {loai.dac_diem_sinh_hoc.muc_do_quy_hiem}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                              {loai.vi_tri_dia_li_count} locations
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-2">Không có loài liên quan.</p>
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
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo')}
              </Button>
            )}
          </div>
        </form>
      )}

      {/* CSV Upload Tab */}
      {activeTab === 'csv' && (
        <div>
          <CsvUpload
            onUpload={handleCsvUpload}
            acceptedColumns={csvColumns}
            sampleData={sampleCsvData}
          />
          <div className="flex justify-end pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}