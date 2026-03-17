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
import { loadAllVungPhanBos } from '@/lib/api/vung-phan-bo';
import { VungPhanBo } from '@/types/vung-phan-bo';
import { LoaiFormModalProps } from '../types/loais';
import { Image as ImageIcon } from 'lucide-react';

type DistributionPoint = {
  kinh_do: string;
  vi_do: string;
  id_vung_phan_bo: string;
};

export function LoaiFormModal({ isOpen, onClose, onSuccess, loai, viewMode }: LoaiFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  const [hos, setHos] = useState<Ho[]>([]);
  const [nganhs, setNganhs] = useState<Nganh[]>([]);
  const [vungPhanBos, setVungPhanBos] = useState<VungPhanBo[]>([]);
  const [filteredHos, setFilteredHos] = useState<Ho[]>([]);
  const [distributionPoints, setDistributionPoints] = useState<DistributionPoint[]>([
    { kinh_do: '', vi_do: '', id_vung_phan_bo: '' },
  ]);
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
        loadAllNganhs(),
        loadAllVungPhanBos(),
      ]).then(([hosData, nganhsData, vungPhanBoData]) => {
        setHos(hosData.hos);
        setNganhs(nganhsData);
        setVungPhanBos(vungPhanBoData);
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
          kinh_do: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.kinh_do).join(';')||'',
          vi_do: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.vi_do).join(';')||'',
          id_vung_phan_bo: loai.vi_tri_dia_li?.map((vi_tri_dia_li)=>vi_tri_dia_li.id_vung_phan_bo).join(';')||'',
        });

        const pointsFromLoai = (loai.vi_tri_dia_li || []).map((viTri) => ({
          kinh_do: viTri.kinh_do?.toString() || '',
          vi_do: viTri.vi_do?.toString() || '',
          id_vung_phan_bo: viTri.id_vung_phan_bo?.toString() || '',
        }));
        setDistributionPoints(pointsFromLoai.length > 0
          ? pointsFromLoai
          : [{ kinh_do: '', vi_do: '', id_vung_phan_bo: '' }]);
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
          kinh_do: '',
          vi_do: '',
          id_vung_phan_bo: ''
        });
        setDistributionPoints([{ kinh_do: '', vi_do: '', id_vung_phan_bo: '' }]);
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
      newErrors.ten_khoa_hoc = 'Tên khoa học là bắt buộc';
    }

    if (!formData.ten_ho_khoa_hoc.trim()) {
      newErrors.ten_ho_khoa_hoc = 'Vui lòng chọn họ';
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
      const normalizedPoints = distributionPoints.map((point) => ({
        kinh_do: point.kinh_do.trim(),
        vi_do: point.vi_do.trim(),
        id_vung_phan_bo: point.id_vung_phan_bo.trim(),
      }));
      const hasPartialPoint = normalizedPoints.some((point) => {
        const filled = [point.kinh_do, point.vi_do, point.id_vung_phan_bo].filter(Boolean).length;
        return filled > 0 && filled < 3;
      });
      if (hasPartialPoint) {
        setErrors({ submit: 'Mỗi điểm phân bố cần nhập đủ kinh độ, vĩ độ và vùng phân bố.' });
        setLoading(false);
        return;
      }

      const completePoints = normalizedPoints.filter(
        (point) => point.kinh_do && point.vi_do && point.id_vung_phan_bo
      );
      const joinedKinhDo = completePoints.map((point) => point.kinh_do).join(';');
      const joinedViDo = completePoints.map((point) => point.vi_do).join(';');
      const joinedVungPhanBo = completePoints.map((point) => point.id_vung_phan_bo).join(';');

      setFormData((prev) => ({
        ...prev,
        kinh_do: joinedKinhDo,
        vi_do: joinedViDo,
        id_vung_phan_bo: joinedVungPhanBo,
      }));

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
        ...(joinedKinhDo && { kinh_do: joinedKinhDo }),
        ...(joinedViDo && { vi_do: joinedViDo }),
        ...(joinedVungPhanBo && { id_vung_phan_bo: joinedVungPhanBo })
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
      setErrors({ submit: 'Lưu loài thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDistributionPointChange = (index: number, field: keyof DistributionPoint, value: string) => {
    setDistributionPoints((prev) => prev.map((point, pointIndex) => (
      pointIndex === index ? { ...point, [field]: value } : point
    )));

    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: '' }));
    }
  };

  const handleAddDistributionPoint = () => {
    setDistributionPoints((prev) => [...prev, { kinh_do: '', vi_do: '', id_vung_phan_bo: '' }]);
  };

  const handleRemoveDistributionPoint = (index: number) => {
    setDistributionPoints((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, pointIndex) => pointIndex !== index);
    });
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
    'kinh_do',
    'vi_do',
    'id_vung_phan_bo'
  ];
  const sampleCsvData = {
    ten_khoa_hoc: 'Artemisia vulgaris',
    ten_tieng_viet: 'Ngải cứu',
    ten_goi_khac: 'Ngải rừng',
    ten_ho_khoa_hoc: 'Asteraceae',
    dac_diem_mo_ta: 'Cây dược liệu quý, có vị đắng',
    dang_song: 'Vùng núi và đồng cỏ hoang',
    tru_luong: 'Từ mùa xuân đến mùa thu',
    muc_do_quy_hiem: 'Nguy cấp',
    phuong_an_bao_ton: 'Bảo vệ sinh cảnh tự nhiên và khuyến khích trồng',
    chi_tiet_ky_thuat: 'Nhân giống bằng hạt vào mùa xuân',
    hien_trang_gay_trong_phat_trien: 'Hiện đang được trồng tại vùng Tây Nguyên',
    ky_thuat_trong_cham_soc_thu_hoach: 'Thu hoạch lá trước khi ra hoa',
    collection_uri: 'https://example.com/artemisia.jpg',
    bo_phan_su_dung: 'Lá;Rễ;Thân',
    cong_dung: 'Kháng viêm;Hỗ trợ tiêu hóa;Hạ sốt',
    bai_thuoc: 'Bài thuốc hạ sốt dân gian;Trà hỗ trợ tiêu hóa',
    kinh_do: '106.8;106.9;107.0',
    vi_do: '20.5;20.6;20.7',
    id_vung_phan_bo: '1;2;3'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'Xem loài' : (isEditMode ? 'Sửa loài' : 'Thêm loài')}
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
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {/* Basic Information Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Thông tin cơ bản</h3>
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

            <Input
              label="Tên gọi khác"
              name="ten_goi_khac"
              value={formData.ten_goi_khac}
              onChange={handleInputChange}
              placeholder="Nhập tên gọi khác"
              disabled={viewMode}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Ngành (lọc tùy chọn)"
                name="ten_nganh_khoa_hoc"
                value={formData.ten_nganh_khoa_hoc}
                onChange={handleInputChange}
                disabled={viewMode}
              >
                <option value="">Tất cả ngành</option>
                {nganhs.map(nganh => (
                  <option key={nganh.ten_khoa_hoc} value={nganh.ten_khoa_hoc}>
                    {nganh.ten_khoa_hoc}
                  </option>
                ))}
              </Select>

              <Select
                label="Họ *"
                name="ten_ho_khoa_hoc"
                value={formData.ten_ho_khoa_hoc}
                onChange={handleInputChange}
                error={errors.ten_ho_khoa_hoc}
                disabled={viewMode}
              >
                <option value="">Chọn họ</option>
                {filteredHos.map(ho => (
                  <option key={ho.ten_khoa_hoc} value={ho.ten_khoa_hoc}>
                    {ho.ten_khoa_hoc} {ho.ten_tieng_viet && `(${ho.ten_tieng_viet})`}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Biological Characteristics Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Đặc điểm sinh học</h3>
            <Input
              label="Mô tả đặc điểm"
              name="dac_diem_mo_ta"
              value={formData.dac_diem_mo_ta}
              onChange={handleInputChange}
              placeholder="Mô tả đặc điểm của loài"
              disabled={viewMode}
            />
            <Input
              label="Dạng sống / Môi trường sống"
              name="dang_song"
              value={formData.dang_song}
              onChange={handleInputChange}
              placeholder="Loài sống hoặc phát triển ở đâu"
              disabled={viewMode}
            />
            <Input
              label="Mức độ quý hiếm"
              name="muc_do_quy_hiem"
              value={formData.muc_do_quy_hiem}
              onChange={handleInputChange}
              placeholder="Ví dụ: Nguy cấp, Sắp nguy cấp"
              disabled={viewMode}
            />
            <Input
              label="Trữ lượng / Mùa vụ"
              name="tru_luong"
              value={formData.tru_luong}
              onChange={handleInputChange}
              placeholder="Ví dụ: Mùa xuân, mùa hè, quanh năm"
              disabled={viewMode}
            />
            <Input
              label="Phương án bảo tồn"
              name="phuong_an_bao_ton"
              value={formData.phuong_an_bao_ton}
              onChange={handleInputChange}
              placeholder="Cách bảo vệ và bảo tồn"
              disabled={viewMode}
            />
          </div>

          {/* Cultivation & Harvesting Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Trồng trọt và thu hoạch</h3>
            <Input
              label="Chi tiết kỹ thuật trồng"
              name="chi_tiet_ky_thuat"
              value={formData.chi_tiet_ky_thuat}
              onChange={handleInputChange}
              placeholder="Mô tả kỹ thuật trồng"
              disabled={viewMode}
            />
            <Input
              label="Hiện trạng gây trồng, phát triển"
              name="hien_trang_gay_trong_phat_trien"
              value={formData.hien_trang_gay_trong_phat_trien}
              onChange={handleInputChange}
              placeholder="Hiện trạng canh tác hiện tại"
              disabled={viewMode}
            />
            <Input
              label="Kỹ thuật chăm sóc và thu hoạch"
              name="ky_thuat_trong_cham_soc_thu_hoach"
              value={formData.ky_thuat_trong_cham_soc_thu_hoach}
              onChange={handleInputChange}
              placeholder="Mô tả cách chăm sóc và thu hoạch"
              disabled={viewMode}
            />
          </div>

          {/* Image & Media Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Hình ảnh và tư liệu</h3>
            <Input
              label="Đường dẫn thư mục ảnh (Collection URI)"
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
                  Xem thư viện ảnh
                </Link>
              </div>
            )}
          </div>

          {/* Uses & Components Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Công dụng và thành phần (phân tách bằng dấu chấm phẩy)</h3>
            <Input
              label="Bộ phận sử dụng"
              name="bo_phan_su_dung"
              value={formData.bo_phan_su_dung}
              onChange={handleInputChange}
              placeholder="Ví dụ: Lá;Rễ;Thân"
              disabled={viewMode}
            />
            <Input
              label="Công dụng"
              name="cong_dung"
              value={formData.cong_dung}
              onChange={handleInputChange}
              placeholder="Ví dụ: Làm thuốc;Pha trà;Thực phẩm"
              disabled={viewMode}
            />
            <Input
              label="Bài thuốc"
              name="bai_thuoc"
              value={formData.bai_thuoc}
              onChange={handleInputChange}
              placeholder="Các bài thuốc dân gian"
              disabled={viewMode}
            />
          </div>

          {/* Geographic Distribution Section */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Phân bố địa lý</h3>

            <div className="space-y-3">
              {distributionPoints.map((point, index) => (
                <div key={index} className="rounded-md border border-gray-200 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      label={`Kinh độ ${index + 1}`}
                      value={point.kinh_do}
                      onChange={(e) => handleDistributionPointChange(index, 'kinh_do', e.target.value)}
                      placeholder="Ví dụ: 106.8"
                      disabled={viewMode}
                    />
                    <Input
                      label={`Vĩ độ ${index + 1}`}
                      value={point.vi_do}
                      onChange={(e) => handleDistributionPointChange(index, 'vi_do', e.target.value)}
                      placeholder="Ví dụ: 20.5"
                      disabled={viewMode}
                    />
                    <Select
                      label={`Vùng phân bố ${index + 1}`}
                      value={point.id_vung_phan_bo}
                      onChange={(e) => handleDistributionPointChange(index, 'id_vung_phan_bo', e.target.value)}
                      disabled={viewMode}
                    >
                      <option value="">Chọn vùng phân bố</option>
                      {vungPhanBos.map((vung) => (
                        <option key={vung.id} value={vung.id}>
                          {vung.id} - {vung.ten_dia_phan_hanh_chinh}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {!viewMode && distributionPoints.length > 1 && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleRemoveDistributionPoint(index)}
                      >
                        Xóa điểm
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!viewMode && (
              <div className="mt-3">
                <Button type="button" variant="secondary" onClick={handleAddDistributionPoint}>
                  Thêm điểm
                </Button>
              </div>
            )}
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
              {viewMode ? 'Đóng' : 'Hủy'}
            </Button>
            {!viewMode && (
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
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