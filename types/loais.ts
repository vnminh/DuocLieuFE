// Loai types
export interface Loai {
  id: number;
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc: string;
  created_at: Date;
  updated_at: Date;
  ho?: any; // Avoid circular import with Ho
  dac_diem_sinh_hoc?: DacDiemSinhHoc;
  vi_tri_dia_li?: ViTriDiaLi[];
  khai_thac_va_che_bien?: KhaiThacVaCheBien;
  hinh_anh?: HinhAnh;
  cong_dung_va_thanh_phan_hoa_hoc?: CongDungVaThanPhanHoaHoc[];
}

export interface CreateLoaiData {
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc: string;
}

// Extended data type for creating loai with all nested data (flattened)
export interface CreateLoaiWithDetailsData {
  // Loai fields
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc: string;

  // Dac_diem_sinh_hoc fields
  dac_diem_mo_ta?: string;
  dang_song?: string;
  tru_luong?: string;
  muc_do_quy_hiem?: MucDoQuyHiem;
  phuong_an_bao_ton?: string;

  // Khai_thac_va_che_bien fields
  chi_tiet_ky_thuat?: string;
  hien_trang_gay_trong_phat_trien?: string;
  ky_thuat_trong_cham_soc_thu_hoach?: string;

  // Hinh_anh fields
  collection_uri?: string;

  // Cong_dung_va_thanh_phan_hoa_hoc fields (can have multiple)
  bo_phan_su_dung?: string[];
  cong_dung?: string[];
  bai_thuoc?: string[];

  // Vi_tri_dia_li fields (can have multiple)
  kinh_do?: number[];
  vi_do?: number[];
  id_vung_phan_bo?: number[];
}

// Extended data type for updating loai with all nested data (all fields optional)
export interface UpdateLoaiData {
  // Loai fields
  ten_khoa_hoc?: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc?: string;

  // Dac_diem_sinh_hoc fields
  dac_diem_mo_ta?: string;
  dang_song?: string;
  tru_luong?: string;
  muc_do_quy_hiem?: string;
  phuong_an_bao_ton?: string;

  // Khai_thac_va_che_bien fields
  chi_tiet_ky_thuat?: string;
  hien_trang_gay_trong_phat_trien?: string;
  ky_thuat_trong_cham_soc_thu_hoach?: string;

  // Hinh_anh fields
  collection_uri?: string;

  // Cong_dung_va_thanh_phan_hoa_hoc fields (can have multiple)
  bo_phan_su_dung?: string;
  cong_dung?: string;
  bai_thuoc?: string;

  // Vi_tri_dia_li fields (can have multiple)
  kinh_do?: string;
  vi_do?: string;
  id_vung_phan_bo?: string;
}

export interface LoaiFilters {
  search?: string; // searches ten_khoa_hoc
  ten_ho_khoa_hoc?: string;
  ten_nganh_khoa_hoc?: string;
  vung_phan_bo?: string;
  page?: number;
  limit?: number;
}

// Supporting types for Loai
export enum MucDoQuyHiem {
  THAP = 'THAP',
  TRUNG_BINH = 'TRUNG_BINH',
  CAO = 'CAO',
  RAT_CAO = 'RAT_CAO'
}

export interface DacDiemSinhHoc {
  id: number;
  ten_loai_khoa_hoc: string;
  mo_ta?: string;
  dang_song?: string;
  tru_luong?: string;
  muc_do_quy_hiem: MucDoQuyHiem;
  phuong_an_bao_ton?: string;
  created_at: Date;
  updated_at: Date;
}

export interface KhaiThacVaCheBien {
  id: number;
  ten_loai_khoa_hoc: string;
  chi_tiet_ky_thuat?: string;
  hien_trang_gay_trong_phat_trien?: string;
  ky_thuat_trong_cham_soc_thu_hoach?: string;
  created_at: Date;
  updated_at: Date;
}

export interface HinhAnh {
  id: number;
  ten_loai_khoa_hoc: string;
  collection_uri?: string;
  so_luong_anh_preview?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CongDungVaThanPhanHoaHoc {
  id: number;
  ten_loai_khoa_hoc: string;
  bo_phan_su_dung?: string;
  cong_dung?: string;
  bai_thuoc?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ViTriDiaLi {
  id: number;
  ten_loai_khoa_hoc: string;
  kinh_do: number;
  vi_do: number;
  id_vung_phan_bo?: number;
  created_at: Date;
  updated_at: Date;
}