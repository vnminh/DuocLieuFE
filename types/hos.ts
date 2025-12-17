// Ho types
export interface Ho {
  id: number;
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
  ten_nganh_khoa_hoc: string;
  created_at: Date;
  updated_at: Date;
  nganh?: any; // Avoid circular import with Nganh
  loais?: any[]; // Avoid circular import with Loai[]
}

export interface CreateHoData {
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
  ten_nganh_khoa_hoc: string;
}

export interface UpdateHoData {
  ten_khoa_hoc?: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
  ten_nganh_khoa_hoc?: string;
}

export interface HoFilters {
  search?: string; // searches ten_khoa_hoc
  ten_nganh_khoa_hoc?: string;
  page?: number;
  limit?: number;
}