// Types for loai-map feature

export interface VungPhanBoMapData {
  id: number;
  ten_dia_phan_hanh_chinh: string;
  danh_sach_diem_bien: number[][] | null; // [[lon, lat], ...]
  center: [number, number] | null; // [lon, lat]
  loai_count: number;
}

export interface LoaiWithCoordinates {
  id: number;
  ten_khoa_hoc: string;
  ten_tieng_viet: string | null;
  ten_goi_khac: string | null;
  ten_ho_khoa_hoc: string;
  vi_tri_dia_li: {
    id: number;
    kinh_do: number;
    vi_do: number;
  }[];
  dac_diem_sinh_hoc?: {
    muc_do_quy_hiem: string;
  };
}

export interface VungPhanBoWithLoais {
  vung_phan_bo: {
    id: number;
    ten_dia_phan_hanh_chinh: string;
    danh_sach_diem_bien: number[][] | null;
    center: [number, number] | null;
  };
  loais: LoaiWithCoordinates[];
  total: number;
}

export interface MapDataResponse {
  message: string;
  data: VungPhanBoMapData[];
}

export interface LoaisWithCoordinatesResponse {
  message: string;
  data: VungPhanBoWithLoais;
}

export interface AllLoaisWithCoordinatesResponse {
  message: string;
  data: LoaiWithCoordinates[];
  total: number;
}
