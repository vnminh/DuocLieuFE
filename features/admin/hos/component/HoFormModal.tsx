'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { Ho, CreateHoData, UpdateHoData } from '@/types/hos';
import { Nganh } from '@/types/nganhs';
import { createHo, updateHo, uploadHosCsv } from '@/lib/api/hos';
import { loadAllNganhs } from '@/lib/api/nganhs';
import { HoFormModalProps } from '../types/hos';

export function HoFormModal({ isOpen, onClose, onSuccess, ho }: HoFormModalProps) {
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

  const isEditMode = !!ho;

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
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          mo_ta: '',
          ten_nganh_khoa_hoc: ''
        });
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, ho]);

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
      newErrors.ten_khoa_hoc = 'Scientific name is required';
    }

    if (!formData.ten_nganh_khoa_hoc.trim()) {
      newErrors.ten_nganh_khoa_hoc = 'Nganh selection is required';
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
      console.error('Error saving ho:', error);
      setErrors({ submit: 'Failed to save ho. Please try again.' });
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
      title={isEditMode ? 'Edit Ho' : 'Add Ho'}
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

          <Select
            label="Nganh (Ten Nganh Khoa Hoc) *"
            name="ten_nganh_khoa_hoc"
            value={formData.ten_nganh_khoa_hoc}
            onChange={handleInputChange}
            error={errors.ten_nganh_khoa_hoc}
          >
            <option value="">Select a nganh</option>
            {nganhs.map(nganh => (
              <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                {nganh.ten_khoa_hoc} {nganh.ten_tieng_viet && `(${nganh.ten_tieng_viet})`}
              </option>
            ))}
          </Select>

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