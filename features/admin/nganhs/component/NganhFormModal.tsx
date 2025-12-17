'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { Nganh, CreateNganhData, UpdateNganhData } from '@/types/nganhs';
import { createNganh, updateNganh, uploadNganhsCsv } from '@/lib/api/nganhs';
import { NganhFormModalProps } from '../types/nganhs';

export function NganhFormModal({ isOpen, onClose, onSuccess, nganh }: NganhFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [formData, setFormData] = useState({
    ten_khoa_hoc: '',
    ten_tieng_viet: '',
    mo_ta: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!nganh;

  useEffect(() => {
    if (isOpen) {
      if (nganh) {
        setFormData({
          ten_khoa_hoc: nganh.ten_khoa_hoc || '',
          ten_tieng_viet: nganh.ten_tieng_viet || '',
          mo_ta: nganh.mo_ta || ''
        });
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          mo_ta: ''
        });
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, nganh]);

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
      newErrors.ten_khoa_hoc = 'Scientific name is required';
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
      console.error('Error saving nganh:', error);
      setErrors({ submit: 'Failed to save nganh. Please try again.' });
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
      title={isEditMode ? 'Edit Nganh' : 'Add Nganh'}
      className="max-w-2xl"
    >
      {/* Tabs */}
      {!isEditMode && (
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

      {/* Form Tab */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Scientific Name (Ten Khoa Hoc) *"
            name="ten_khoa_hoc"
            value={formData.ten_khoa_hoc}
            onChange={handleInputChange}
            error={errors.ten_khoa_hoc}
            placeholder="Enter scientific name"
          />

          <Input
            label="Vietnamese Name (Ten Tieng Viet)"
            name="ten_tieng_viet"
            value={formData.ten_tieng_viet}
            onChange={handleInputChange}
            placeholder="Enter Vietnamese name"
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description (Mo Ta)
            </label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleInputChange}
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description"
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </Button>
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
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}