'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { Loai, CreateLoaiData, UpdateLoaiData } from '@/types/loais';
import { Ho } from '@/types/hos';
import { Nganh } from '@/types/nganhs';
import { createLoai, updateLoai, uploadLoaisCsv } from '@/lib/api/loais';
import { loadAllHos } from '@/lib/api/hos';
import { loadAllNganhs } from '@/lib/api/nganhs';
import { LoaiFormModalProps } from '../types/loais';

export function LoaiFormModal({ isOpen, onClose, onSuccess, loai }: LoaiFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [hos, setHos] = useState<Ho[]>([]);
  const [nganhs, setNganhs] = useState<Nganh[]>([]);
  const [filteredHos, setFilteredHos] = useState<Ho[]>([]);
  const [formData, setFormData] = useState({
    ten_khoa_hoc: '',
    ten_tieng_viet: '',
    ten_goi_khac: '',
    ten_ho_khoa_hoc: '',
    ten_nganh_khoa_hoc: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!loai;

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        loadAllHos(),
        loadAllNganhs()
      ]).then(([hosData, nganhsData]) => {
        setHos(hosData);
        setNganhs(nganhsData);
        setFilteredHos(hosData);
      }).catch(console.error);
      
      if (loai) {
        setFormData({
          ten_khoa_hoc: loai.ten_khoa_hoc || '',
          ten_tieng_viet: loai.ten_tieng_viet || '',
          ten_goi_khac: loai.ten_goi_khac || '',
          ten_ho_khoa_hoc: loai.ten_ho_khoa_hoc || '',
          ten_nganh_khoa_hoc: loai.ho?.ten_nganh_khoa_hoc || ''
        });
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          ten_goi_khac: '',
          ten_ho_khoa_hoc: '',
          ten_nganh_khoa_hoc: ''
        });
      }
      setErrors({});
      setActiveTab('form');
    }
  }, [isOpen, loai]);

  // Filter hos based on selected nganh
  useEffect(() => {
    if (formData.ten_nganh_khoa_hoc) {
      const filtered = hos.filter(ho => ho.ten_nganh_khoa_hoc === formData.ten_nganh_khoa_hoc);
      setFilteredHos(filtered);
      
      // Reset ho selection if current ho doesn't belong to selected nganh
      if (formData.ten_ho_khoa_hoc) {
        const currentHoExists = filtered.some(ho => ho.ten_khoa_hoc === formData.ten_ho_khoa_hoc);
        if (!currentHoExists) {
          setFormData(prev => ({ ...prev, ten_ho_khoa_hoc: '' }));
        }
      }
    } else {
      setFilteredHos(hos);
    }
  }, [formData.ten_nganh_khoa_hoc, hos]);

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

    if (!formData.ten_ho_khoa_hoc.trim()) {
      newErrors.ten_ho_khoa_hoc = 'Ho selection is required';
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
        ten_goi_khac: formData.ten_goi_khac.trim() || undefined,
        ten_ho_khoa_hoc: formData.ten_ho_khoa_hoc.trim()
      };

      if (isEditMode && loai) {
        const updateData: UpdateLoaiData = { ...submitData };
        await updateLoai(loai.id, updateData);
      } else {
        const createData: CreateLoaiData = { ...submitData };
        await createLoai(createData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving loai:', error);
      setErrors({ submit: 'Failed to save loai. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    const result = await uploadLoaisCsv(file);
    if (result.success > 0) {
      onSuccess();
    }
    return result;
  };

  const csvColumns = ['ten_khoa_hoc', 'ten_tieng_viet', 'ten_goi_khac', 'ten_ho_khoa_hoc'];
  const sampleCsvData = {
    ten_khoa_hoc: 'Artemisia vulgaris',
    ten_tieng_viet: 'Ngải cứu',
    ten_goi_khac: 'Ngải rừng',
    ten_ho_khoa_hoc: 'Asteraceae'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Loai' : 'Add Loai'}
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

          <Input
            label="Alternative Name (Ten Goi Khac)"
            name="ten_goi_khac"
            value={formData.ten_goi_khac}
            onChange={handleInputChange}
            placeholder="Enter alternative name"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Nganh (Optional filter)"
              name="ten_nganh_khoa_hoc"
              value={formData.ten_nganh_khoa_hoc}
              onChange={handleInputChange}
            >
              <option value="">All nganhs</option>
              {nganhs.map(nganh => (
                <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                  {nganh.ten_khoa_hoc}
                </option>
              ))}
            </Select>

            <Select
              label="Ho (Ten Ho Khoa Hoc) *"
              name="ten_ho_khoa_hoc"
              value={formData.ten_ho_khoa_hoc}
              onChange={handleInputChange}
              error={errors.ten_ho_khoa_hoc}
            >
              <option value="">Select a ho</option>
              {filteredHos.map(ho => (
                <option key={ho.ten_khoa_hoc} value={ho.ten_khoa_hoc}>
                  {ho.ten_khoa_hoc} {ho.ten_tieng_viet && `(${ho.ten_tieng_viet})`}
                </option>
              ))}
            </Select>
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