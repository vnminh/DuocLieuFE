// VungPhanBo types
export interface VungPhanBo {
  id: number;
  ten_dia_phan_hanh_chinh: string;
  danh_sach_diem_bien?: string;
  created_at: Date;
  updated_at: Date;
  vi_tri_dia_li_count?: number;
}

export interface CreateVungPhanBoData {
  ten_dia_phan_hanh_chinh: string;
  danh_sach_diem_bien?: string;
}

export interface UpdateVungPhanBoData {
  ten_dia_phan_hanh_chinh?: string;
  danh_sach_diem_bien?: string;
}

export interface VungPhanBoFilters {
  search?: string; // searches ten_dia_phan_hanh_chinh
  page?: number;
  limit?: number;
}
