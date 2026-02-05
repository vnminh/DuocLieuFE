'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Image as ImageIcon } from 'lucide-react';

export function LoaiFormModal({ isOpen, onClose, onSuccess, loai, viewMode }: LoaiFormModalProps) {
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
    ten_nganh_khoa_hoc: '',
    dac_diem_mo_ta: '',
    dang_song: '',
    tru_luong: '',
    muc_do_quy_hiem: '',
    phuong_an_bao_ton: '',
    chi_tiet_ky_thuat: '',
    hien_trang_gay_trong_phat_trien: '',
    ky_thuat_trong_cham_soc_thu_hoach: '',
    collection_uri: '',
    bo_phan_su_dung: '',
    cong_dung: '',
    bai_thuoc: '',
    tac_dung_duoc_ly: '',
    kinh_do: '',
    vi_do: '',
    id_vung_phan_bo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!loai && !viewMode;

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        loadAllHos(),
        loadAllNganhs()
      ]).then(([hosData, nganhsData]) => {
        setHos(hosData.hos);
        setNganhs(nganhsData);
        setFilteredHos(hosData.hos);
      }).catch(console.error);
      
      if (loai) {
        setFormData({
          ten_khoa_hoc: loai.ten_khoa_hoc || '',
          ten_tieng_viet: loai.ten_tieng_viet || '',
          ten_goi_khac: loai.ten_goi_khac || '',
          ten_ho_khoa_hoc: loai.ten_ho_khoa_hoc || '',
          ten_nganh_khoa_hoc: loai.ho?.nganh?.ten_khoa_hoc || '',
          dac_diem_mo_ta: loai.dac_diem_sinh_hoc?.mo_ta || '',
          dang_song: loai.dac_diem_sinh_hoc?.dang_song || '',
          tru_luong: loai.dac_diem_sinh_hoc?.tru_luong || '',
          muc_do_quy_hiem: loai.dac_diem_sinh_hoc?.muc_do_quy_hiem || '',
          phuong_an_bao_ton: loai.dac_diem_sinh_hoc?.phuong_an_bao_ton || '',
          chi_tiet_ky_thuat: loai.khai_thac_va_che_bien?.chi_tiet_ky_thuat || '',
          hien_trang_gay_trong_phat_trien: loai.khai_thac_va_che_bien?.hien_trang_gay_trong_phat_trien || '',
          ky_thuat_trong_cham_soc_thu_hoach: loai.khai_thac_va_che_bien?.ky_thuat_trong_cham_soc_thu_hoach || '',
          collection_uri: loai.hinh_anh?.collection_uri || '',
          bo_phan_su_dung: loai.cong_dung_va_thanh_phan_hoa_hoc?.map((cong_dung_va_thanh_phan_hoa_hoc)=>cong_dung_va_thanh_phan_hoa_hoc.bo_phan_su_dung).join(';')||'',
          cong_dung: loai.cong_dung_va_thanh_phan_hoa_hoc?.map((cong_dung_va_thanh_phan_hoa_hoc)=>cong_dung_va_thanh_phan_hoa_hoc.cong_dung).join(';')||'',
          bai_thuoc: loai.cong_dung_va_thanh_phan_hoa_hoc?.map((cong_dung_va_thanh_phan_hoa_hoc)=>cong_dung_va_thanh_phan_hoa_hoc.bai_thuoc).join(';')||'',
          tac_dung_duoc_ly: loai.cong_dung_va_thanh_phan_hoa_hoc?.map((cong_dung_va_thanh_phan_hoa_hoc)=>cong_dung_va_thanh_phan_hoa_hoc.tac_dung_duoc_ly).join(';')||'',
          kinh_do: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.kinh_do).join(';')||'',
          vi_do: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.vi_do).join(';')||'',
          id_vung_phan_bo: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.id_vung_phan_bo).join(';')||'',
        });
      } else {
        setFormData({
          ten_khoa_hoc: '',
          ten_tieng_viet: '',
          ten_goi_khac: '',
          ten_ho_khoa_hoc: '',
          ten_nganh_khoa_hoc: '',
          dac_diem_mo_ta: '',
          dang_song: '',
          tru_luong: '',
          muc_do_quy_hiem: '',
          phuong_an_bao_ton: '',
          chi_tiet_ky_thuat: '',
          hien_trang_gay_trong_phat_trien: '',
          ky_thuat_trong_cham_soc_thu_hoach: '',
          collection_uri: '',
          bo_phan_su_dung: '',
          cong_dung: '',
          bai_thuoc: '',
          tac_dung_duoc_ly: '',
          kinh_do: '',
          vi_do: '',
          id_vung_phan_bo: ''
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
        ten_ho_khoa_hoc: formData.ten_ho_khoa_hoc.trim(),
        ...(formData.dac_diem_mo_ta.trim() && { dac_diem_mo_ta: formData.dac_diem_mo_ta.trim() }),
        ...(formData.dang_song.trim() && { dang_song: formData.dang_song.trim() }),
        ...(formData.tru_luong.trim() && { tru_luong: formData.tru_luong.trim() }),
        ...(formData.muc_do_quy_hiem.trim() && { muc_do_quy_hiem: formData.muc_do_quy_hiem.trim() }),
        ...(formData.phuong_an_bao_ton.trim() && { phuong_an_bao_ton: formData.phuong_an_bao_ton.trim() }),
        ...(formData.chi_tiet_ky_thuat.trim() && { chi_tiet_ky_thuat: formData.chi_tiet_ky_thuat.trim() }),
        ...(formData.hien_trang_gay_trong_phat_trien.trim() && { hien_trang_gay_trong_phat_trien: formData.hien_trang_gay_trong_phat_trien.trim() }),
        ...(formData.ky_thuat_trong_cham_soc_thu_hoach.trim() && { ky_thuat_trong_cham_soc_thu_hoach: formData.ky_thuat_trong_cham_soc_thu_hoach.trim() }),
        ...(formData.collection_uri.trim() && { collection_uri: formData.collection_uri.trim() }),
        ...(formData.bo_phan_su_dung.trim() && { bo_phan_su_dung: formData.bo_phan_su_dung.trim() }),
        ...(formData.cong_dung.trim() && { cong_dung: formData.cong_dung.trim() }),
        ...(formData.bai_thuoc.trim() && { bai_thuoc: formData.bai_thuoc.trim() }),
        ...(formData.tac_dung_duoc_ly.trim() && { tac_dung_duoc_ly: formData.tac_dung_duoc_ly.trim() }),
        ...(formData.kinh_do.trim() && { kinh_do: formData.kinh_do.trim() }),
        ...(formData.vi_do.trim() && { vi_do: formData.vi_do.trim() }),
        ...(formData.id_vung_phan_bo.trim() && { id_vung_phan_bo: formData.id_vung_phan_bo.trim() })
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

  const csvColumns = [
    'ten_khoa_hoc',
    'ten_tieng_viet',
    'ten_goi_khac',
    'ten_ho_khoa_hoc',
    'dac_diem_mo_ta',
    'dang_song',
    'tru_luong',
    'muc_do_quy_hiem',
    'phuong_an_bao_ton',
    'chi_tiet_ky_thuat',
    'hien_trang_gay_trong_phat_trien',
    'ky_thuat_trong_cham_soc_thu_hoach',
    'collection_uri',
    'bo_phan_su_dung',
    'cong_dung',
    'bai_thuoc',
    'tac_dung_duoc_ly',
    'kinh_do',
    'vi_do',
    'id_vung_phan_bo'
  ];
  const sampleCsvData = {
    ten_khoa_hoc: 'Artemisia vulgaris',
    ten_tieng_viet: 'Ngải cứu',
    ten_goi_khac: 'Ngải rừng',
    ten_ho_khoa_hoc: 'Asteraceae',
    dac_diem_mo_ta: 'Rare medicinal plant with bitter taste',
    dang_song: 'Mountain regions and wild grasslands',
    tru_luong: 'Spring to autumn',
    muc_do_quy_hiem: 'Endangered',
    phuong_an_bao_ton: 'Protect natural habitat and promote cultivation',
    chi_tiet_ky_thuat: 'Propagate by seeds in spring',
    hien_trang_gay_trong_phat_trien: 'Currently cultivated in central highlands',
    ky_thuat_trong_cham_soc_thu_hoach: 'Harvest leaves before flowering',
    collection_uri: 'https://example.com/artemisia.jpg',
    bo_phan_su_dung: 'Leaves;Roots;Stems',
    cong_dung: 'Anti-inflammatory;Digestive;Fever reduction',
    bai_thuoc: 'Traditional fever medicine;Digestive tea',
    tac_dung_duoc_ly: 'Antimicrobial;Hepatoprotective',
    kinh_do: '106.8;106.9;107.0',
    vi_do: '20.5;20.6;20.7',
    id_vung_phan_bo: '1;2;3'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'View Loai' : (isEditMode ? 'Edit Loai' : 'Add Loai')}
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

      {/* Form Tab */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {/* Basic Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Basic Information</h3>
            <Input
              label="Scientific Name (Ten Khoa Hoc) *"
              name="ten_khoa_hoc"
              value={formData.ten_khoa_hoc}
              onChange={handleInputChange}
              error={errors.ten_khoa_hoc}
              placeholder="Enter scientific name"
              disabled={viewMode}
            />

            <Input
              label="Vietnamese Name (Ten Tieng Viet)"
              name="ten_tieng_viet"
              value={formData.ten_tieng_viet}
              onChange={handleInputChange}
              placeholder="Enter Vietnamese name"
              disabled={viewMode}
            />

            <Input
              label="Alternative Name (Ten Goi Khac)"
              name="ten_goi_khac"
              value={formData.ten_goi_khac}
              onChange={handleInputChange}
              placeholder="Enter alternative name"
              disabled={viewMode}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Nganh (Optional filter)"
                name="ten_nganh_khoa_hoc"
                value={formData.ten_nganh_khoa_hoc}
                onChange={handleInputChange}
                disabled={viewMode}
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
                disabled={viewMode}
              >
                <option value="">Select a ho</option>
                {filteredHos.map(ho => (
                  <option key={ho.ten_khoa_hoc} value={ho.ten_khoa_hoc}>
                    {ho.ten_khoa_hoc} {ho.ten_tieng_viet && `(${ho.ten_tieng_viet})`}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Biological Characteristics Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Biological Characteristics</h3>
            <Input
              label="Characteristics Description (Dac Diem Mo Ta)"
              name="dac_diem_mo_ta"
              value={formData.dac_diem_mo_ta}
              onChange={handleInputChange}
              placeholder="Describe the plant's characteristics"
              disabled={viewMode}
            />
            <Input
              label="Habitat (Dang Song)"
              name="dang_song"
              value={formData.dang_song}
              onChange={handleInputChange}
              placeholder="Where does it live/grow"
              disabled={viewMode}
            />
            <Input
              label="Conservation Status (Muc Do Quy Hiem)"
              name="muc_do_quy_hiem"
              value={formData.muc_do_quy_hiem}
              onChange={handleInputChange}
              placeholder="e.g., Endangered, Vulnerable"
              disabled={viewMode}
            />
            <Input
              label="Seasonal Availability (Tru Luong)"
              name="tru_luong"
              value={formData.tru_luong}
              onChange={handleInputChange}
              placeholder="e.g., Spring, Summer, Year-round"
              disabled={viewMode}
            />
            <Input
              label="Conservation Methods (Phuong An Bao Ton)"
              name="phuong_an_bao_ton"
              value={formData.phuong_an_bao_ton}
              onChange={handleInputChange}
              placeholder="How to protect and preserve"
              disabled={viewMode}
            />
          </div>

          {/* Cultivation & Harvesting Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Cultivation & Harvesting</h3>
            <Input
              label="Cultivation Technique Details (Chi Tiet Ky Thuat)"
              name="chi_tiet_ky_thuat"
              value={formData.chi_tiet_ky_thuat}
              onChange={handleInputChange}
              placeholder="Describe growing techniques"
              disabled={viewMode}
            />
            <Input
              label="Current Development Status (Hien Trang Gay Trong)"
              name="hien_trang_gay_trong_phat_trien"
              value={formData.hien_trang_gay_trong_phat_trien}
              onChange={handleInputChange}
              placeholder="Current cultivation status"
              disabled={viewMode}
            />
            <Input
              label="Care & Harvesting Techniques (Ky Thuat Cham Soc)"
              name="ky_thuat_trong_cham_soc_thu_hoach"
              value={formData.ky_thuat_trong_cham_soc_thu_hoach}
              onChange={handleInputChange}
              placeholder="Describe care and harvesting"
              disabled={viewMode}
            />
          </div>

          {/* Image & Media Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Media</h3>
            <Input
              label="Image Folder Path (Collection URI)"
              name="collection_uri"
              value={formData.collection_uri}
              onChange={handleInputChange}
              placeholder="/path/to/images/folder"
              disabled={viewMode}
            />
            {loai && loai.id && (
              <div className="mt-2">
                <Link
                  href={`/admin/loais-detail?id=${loai.id}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  View Image Gallery
                </Link>
              </div>
            )}
          </div>

          {/* Uses & Components Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Uses & Components (semicolon-separated)</h3>
            <Input
              label="Usable Parts (Bo Phan Su Dung)"
              name="bo_phan_su_dung"
              value={formData.bo_phan_su_dung}
              onChange={handleInputChange}
              placeholder="e.g., Leaves;Roots;Stems"
              disabled={viewMode}
            />
            <Input
              label="General Uses (Cong Dung)"
              name="cong_dung"
              value={formData.cong_dung}
              onChange={handleInputChange}
              placeholder="e.g., Medicine;Tea;Food"
              disabled={viewMode}
            />
            <Input
              label="Traditional Medicine (Bai Thuoc)"
              name="bai_thuoc"
              value={formData.bai_thuoc}
              onChange={handleInputChange}
              placeholder="Traditional remedies"
              disabled={viewMode}
            />
            <Input
              label="Pharmacological Effects (Tac Dung Duoc Ly)"
              name="tac_dung_duoc_ly"
              value={formData.tac_dung_duoc_ly}
              onChange={handleInputChange}
              placeholder="e.g., Anti-inflammatory;Antimicrobial"
              disabled={viewMode}
            />
          </div>

          {/* Geographic Distribution Section */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Geographic Distribution (semicolon-separated)</h3>
            <Input
              label="Longitude (Kinh Do)"
              name="kinh_do"
              value={formData.kinh_do}
              onChange={handleInputChange}
              placeholder="e.g., 106.8;106.9;107.0"
              disabled={viewMode}
            />
            <Input
              label="Latitude (Vi Do)"
              name="vi_do"
              value={formData.vi_do}
              onChange={handleInputChange}
              placeholder="e.g., 20.5;20.6;20.7"
              disabled={viewMode}
            />
            <Input
              label="Region IDs (ID Vung Phan Bo)"
              name="id_vung_phan_bo"
              value={formData.id_vung_phan_bo}
              onChange={handleInputChange}
              placeholder="e.g., 1;2;3"
              disabled={viewMode}
            />
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {viewMode ? 'Close' : 'Cancel'}
            </Button>
            {!viewMode && (
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
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
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}