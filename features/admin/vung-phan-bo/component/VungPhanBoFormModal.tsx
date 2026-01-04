'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { VungPhanBo, CreateVungPhanBoData, UpdateVungPhanBoData } from '@/types/vung-phan-bo';
import { createVungPhanBo, updateVungPhanBo, uploadVungPhanBosCsv } from '@/lib/api/vung-phan-bo';
import { VungPhanBoFormModalProps } from '../types/vung-phan-bo';

export function VungPhanBoFormModal({ isOpen, onClose, onSuccess, vungPhanBo, viewMode = false }: VungPhanBoFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [formData, setFormData] = useState({
    ten_dia_phan_hanh_chinh: '',
    danh_sach_diem_bien: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!vungPhanBo && !viewMode;

  useEffect(() => {
    if (isOpen) {
      if (vungPhanBo) {
        setFormData({
          ten_dia_phan_hanh_chinh: vungPhanBo.ten_dia_phan_hanh_chinh || '',
          danh_sach_diem_bien: vungPhanBo.danh_sach_diem_bien || ''
        });
      } else {
        setFormData({
          ten_dia_phan_hanh_chinh: '',
          danh_sach_diem_bien: ''
        });
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, vungPhanBo]);

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
      newErrors.ten_dia_phan_hanh_chinh = 'Administrative region name is required';
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
      console.error('Error saving vung phan bo:', error);
      setErrors({ submit: 'Failed to save vung phan bo. Please try again.' });
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
      title={viewMode ? 'View Vùng Phân Bố' : (isEditMode ? 'Edit Vùng Phân Bố' : 'Add Vùng Phân Bố')}
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
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'csv'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            CSV Upload
          </button>
        </div>
      )}

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Administrative Region Name"
            name="ten_dia_phan_hanh_chinh"
            value={formData.ten_dia_phan_hanh_chinh}
            onChange={handleInputChange}
            placeholder="Enter administrative region name"
            required
            disabled={viewMode}
            error={errors.ten_dia_phan_hanh_chinh}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boundary Points List
            </label>
            <textarea
              name="danh_sach_diem_bien"
              value={formData.danh_sach_diem_bien}
              onChange={handleInputChange}
              placeholder="Enter boundary points (optional)"
              rows={4}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

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
              {viewMode ? 'Close' : 'Cancel'}
            </Button>
            {!viewMode && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
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
