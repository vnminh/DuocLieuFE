'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { Nganh, CreateNganhData, UpdateNganhData } from '@/types/nganhs';
import { createNganh, updateNganh, uploadNganhsCsv, getNganhDetail, NganhDetail } from '@/lib/api/nganhs';
import { NganhFormModalProps } from '../types/nganhs';

export function NganhFormModal({ isOpen, onClose, onSuccess, nganh, viewMode = false }: NganhFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [formData, setFormData] = useState({
    ten_khoa_hoc: '',
    ten_tieng_viet: '',
    mo_ta: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailData, setDetailData] = useState<NganhDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const isEditMode = !!nganh && !viewMode;

  useEffect(() => {
    if (isOpen) {
      if (nganh) {
        setFormData({
          ten_khoa_hoc: nganh.ten_khoa_hoc || '',
          ten_tieng_viet: nganh.ten_tieng_viet || '',
          mo_ta: nganh.mo_ta || ''
        });
        
        // Fetch detail data when viewing
        if (viewMode) {
          setLoadingDetail(true);
          getNganhDetail(nganh.id)
            .then(detail => setDetailData(detail))
            .catch(console.error)
            .finally(() => setLoadingDetail(false));
        }
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          mo_ta: ''
        });
        setDetailData(null);
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, nganh, viewMode]);

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

    if (!formData.ten_khoa_hoc.trim()) {
      newErrors.ten_khoa_hoc = 'Tên khoa học là bắt buộc';
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
        mo_ta: formData.mo_ta.trim() || undefined
      };

      if (isEditMode && nganh) {
        const updateData: UpdateNganhData = { ...submitData };
        await updateNganh(nganh.id, updateData);
      } else {
        const createData: CreateNganhData = { ...submitData };
        await createNganh(createData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu ngành:', error);
      setErrors({ submit: 'Lưu ngành thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    const result = await uploadNganhsCsv(file);
    if (result.success > 0) {
      onSuccess();
    }
    return result;
  };

  const csvColumns = ['ten_khoa_hoc', 'ten_tieng_viet', 'mo_ta'];
  const sampleCsvData = {
    ten_khoa_hoc: 'Plantae',
    ten_tieng_viet: 'Thực vật',
    mo_ta: 'Mô tả ngành thực vật'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'Xem Ngành' : (isEditMode ? 'Sửa Ngành' : 'Thêm Ngành')}
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

          {/* Related Hos Section - Only in view mode */}
          {viewMode && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  Các họ liên quan
                </h3>
                {detailData && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {detailData.hos_count} họ
                  </span>
                )}
              </div>
              
              {loadingDetail ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Đang tải dữ liệu liên quan...</span>
                </div>
              ) : detailData?.hos && detailData.hos.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên khoa học</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên tiếng Việt</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Species Count</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailData.hos.map((ho) => (
                        <tr key={ho.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900 font-medium">{ho.ten_khoa_hoc}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{ho.ten_tieng_viet || '-'}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                              {ho.loais_count} loài
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-2">Không có họ liên quan.</p>
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