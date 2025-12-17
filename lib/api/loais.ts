import { 
  Loai, LoaiFilters, CreateLoaiData, UpdateLoaiData, CreateLoaiWithDetailsData,
  VungPhanBo,
  MucDoQuyHiem
} from '@/types/loais';
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData, buildQueryString, APIResponse, CSVUploadResponse } from './client';
import { parseCSVFile } from '@/lib/csvPreview';

/**
 * Get all Loài with filters and pagination
 * Endpoint: GET /loais/all
 */
export async function loadLoais(filters: LoaiFilters = {}): Promise<{ loais: Loai[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ten_khoa_hoc: filters.search,
    ten_ho_khoa_hoc: filters.ten_ho_khoa_hoc,
    ten_nganh_khoa_hoc: filters.ten_nganh_khoa_hoc,
    vung_phan_bo_id: filters.vung_phan_bo,
  });

  const response = await apiGet<any>(`/loais/all${queryString}`);
  return {
    loais: response.loais || [],
    total: response.total || 0,
    pages: response.pages || 0,
  };
}

/**
 * Get Loài by ID or scientific name
 * Endpoint: GET /loais/:id or GET /loais/:ten_khoa_hoc
 */
export async function getLoaiById(id: number): Promise<Loai> {
  const response = await apiGet<any>(`/loais/${id}`);
  return response.data || response;
}

export async function getLoaiByName(tenKhoaHoc: string): Promise<Loai> {
  const response = await apiGet<any>(`/loais/${tenKhoaHoc}`);
  return response.data || response;
}

/**
 * Create a single Loài
 * Endpoint: POST /loais
 */
export async function createLoai(data: CreateLoaiData): Promise<Loai> {
  const response = await apiPost<any>('/loais', data);
  return response.data || response;
}

/**
 * Create multiple Loài
 * Endpoint: POST /loais/many
 */
export async function createMultipleLoais(dataList: CreateLoaiData[]): Promise<Loai[]> {
  const response = await apiPost<any>('/loais/many', { data: dataList });
  return response.data || response;
}

/**
 * Update a Loài
 * Endpoint: PUT /loais/:id
 */
export async function updateLoai(id: number, data: UpdateLoaiData): Promise<Loai> {
  const response = await apiPut<any>(`/loais/${id}`, data);
  return response.data || response;
}

/**
 * Delete a Loài
 * Endpoint: DELETE /loais/:id
 */
export async function deleteLoai(id: number): Promise<Loai> {
  const response = await apiDelete<any>(`/loais/${id}`);
  return response.data || response;
}

/**
 * Load all Vùng Phân Bố (Geographic Distribution)
 * Note: This endpoint is not documented in API_END_POINT.md
 * Assuming it exists for loading distribution zones
 */
export async function loadVungPhanBos(): Promise<VungPhanBo[]> {
  try {
    const response = await apiGet<any>('/loais/vung-phan-bo');
    return response.data || response || [];
  } catch (error) {
    console.warn('Failed to load Vùng Phân Bố:', error);
    return [];
  }
}

/**
 * Upload Loài CSV file with optional nested data
 * Supports both basic and detailed (with nested entities) CSV formats
 * Endpoint: POST /loais/many-with-details
 */
export async function uploadLoaisCsv(file: File): Promise<CSVUploadResponse<Loai>> {
  try {
    const csvData = await parseCSVFile(file);
    
    if (csvData.rows.length === 0) {
      return { 
        message: 'No data rows found in CSV', 
        data: [], 
        success: 0, 
        failed: 0, 
        errors: ['No data rows found in CSV'] 
      };
    }
    
    // Check if CSV contains nested data fields
    const hasNestedData = csvData.headers.some(header => 
      ['dac_diem_mo_ta', 'chi_tiet_ky_thuat', 'collection_uri', 'bo_phan_su_dung', 'kinh_do', 'vi_do'].includes(header)
    );

    if (hasNestedData) {
      // Use endpoint that supports nested data
      const loaisData: CreateLoaiWithDetailsData[] = csvData.rows.map(row => {
        const baseData: CreateLoaiWithDetailsData = {
          ten_khoa_hoc: row.ten_khoa_hoc || '',
          ten_tieng_viet: row.ten_tieng_viet || undefined,
          ten_goi_khac: row.ten_goi_khac || undefined,
          ten_ho_khoa_hoc: row.ten_ho_khoa_hoc || '',
          dac_diem_mo_ta: row.dac_diem_mo_ta || undefined,
          dang_song: row.dang_song || undefined,
          tru_luong: row.tru_luong || undefined,
          muc_do_quy_hiem: row.muc_do_quy_hiem as MucDoQuyHiem || undefined,
          phuong_an_bao_ton: row.phuong_an_bao_ton || undefined,
          chi_tiet_ky_thuat: row.chi_tiet_ky_thuat || undefined,
          hien_trang_gay_trong_phat_trien: row.hien_trang_gay_trong_phat_trien || undefined,
          ky_thuat_trong_cham_soc_thu_hoach: row.ky_thuat_trong_cham_soc_thu_hoach || undefined,
          collection_uri: row.collection_uri || undefined,
        };

        // Handle array fields (split by semicolon)
        if (row.bo_phan_su_dung) baseData.bo_phan_su_dung = row.bo_phan_su_dung.split(';').map(s => s.trim());
        if (row.cong_dung) baseData.cong_dung = row.cong_dung.split(';').map(s => s.trim());
        if (row.bai_thuoc) baseData.bai_thuoc = row.bai_thuoc.split(';').map(s => s.trim());
        if (row.tac_dung_duoc_ly) baseData.tac_dung_duoc_ly = row.tac_dung_duoc_ly.split(';').map(s => s.trim());
        if (row.kinh_do) baseData.kinh_do = (typeof row.kinh_do === 'string' ? row.kinh_do.split(';') : [row.kinh_do]).map(s => parseFloat(s.toString().trim()));
        if (row.vi_do) baseData.vi_do = (typeof row.vi_do === 'string' ? row.vi_do.split(';') : [row.vi_do]).map(s => parseFloat(s.toString().trim()));
        if (row.id_vung_phan_bo) baseData.id_vung_phan_bo = (typeof row.id_vung_phan_bo === 'string' ? row.id_vung_phan_bo.split(';') : [row.id_vung_phan_bo]).map(s => parseInt(s.toString().trim()));

        return baseData;
      });

      const response = await apiPost<any>('/loais/many-with-details', { data: loaisData });
      const createdLoais = Array.isArray(response.data) ? response.data : [];
      
      return {
        message: response.message || 'CSV upload successful',
        data: createdLoais,
        success: createdLoais.length,
        failed: loaisData.length - createdLoais.length,
        errors: [],
      };
    } else {
      // Use basic endpoint without nested data
      const loaisData: CreateLoaiData[] = csvData.rows.map(row => ({
        ten_khoa_hoc: row.ten_khoa_hoc || '',
        ten_tieng_viet: row.ten_tieng_viet || undefined,
        ten_goi_khac: row.ten_goi_khac || undefined,
        ten_ho_khoa_hoc: row.ten_ho_khoa_hoc || '',
      }));
      
      const response = await apiPost<any>('/loais/many', { data: loaisData });
      const createdLoais = Array.isArray(response.data) ? response.data : [];
      
      return {
        message: response.message || 'CSV upload successful',
        data: createdLoais,
        success: createdLoais.length,
        failed: loaisData.length - createdLoais.length,
        errors: [],
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during CSV upload';
    return {
      message: 'CSV upload failed',
      data: [],
      success: 0,
      failed: 0,
      errors: [errorMessage],
    };
  }
}
