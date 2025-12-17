// Nganh types
export interface Nganh {
  id: number;
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
  created_at: Date;
  updated_at: Date;
  hos?: any[]; // Avoid circular import with Ho[]
}

export interface CreateNganhData {
  ten_khoa_hoc: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
}

export interface UpdateNganhData {
  ten_khoa_hoc?: string;
  ten_tieng_viet?: string;
  mo_ta?: string;
}

export interface NganhFilters {
  search?: string; // searches ten_khoa_hoc
  page?: number;
  limit?: number;
}