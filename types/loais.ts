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
}

export interface CreateLoaiData {
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc: string;
}

export interface UpdateLoaiData {
  ten_khoa_hoc?: string;
  ten_tieng_viet?: string;
  ten_goi_khac?: string;
  ten_ho_khoa_hoc?: string;
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

export interface ViTriDiaLi {
  id: number;
  ten_loai_khoa_hoc: string;
  kinh_do: number;
  vi_do: number;
  id_vung_phan_bo?: number;
  created_at: Date;
  updated_at: Date;
  vung_phan_bo?: VungPhanBo;
}

export interface VungPhanBo {
  id: number;
  ten_dia_phan_hanh_chinh: string;
  danh_sach_diem_bien?: string;
  created_at: Date;
  updated_at: Date;
}