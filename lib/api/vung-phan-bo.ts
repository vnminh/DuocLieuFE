import { 
  VungPhanBo, VungPhanBoFilters, CreateVungPhanBoData, UpdateVungPhanBoData
} from '@/types/vung-phan-bo';
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData, buildQueryString, APIResponse, CSVUploadResponse } from './client';
import { parseCSVFile } from '@/lib/csvPreview';

/**
 * Get all VungPhanBo with extended information
 * Endpoint: GET /vung-phan-bo/all-vung-phan-bo
 */
export async function loadVungPhanBos(filters: VungPhanBoFilters = {}): Promise<{ vungPhanBos: VungPhanBo[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ten_dia_phan_hanh_chinh: filters.search,
  });

  const response = await apiGet<any>(`/vung-phan-bo/all-vung-phan-bo${queryString}`);
  
  return {
    vungPhanBos: response.vungPhanBos || [],
    total: response.total || 0,
    pages: response.pages || 0,
  };
}

/**
 * Get VungPhanBo by ID or administrative name
 * Endpoint: GET /vung-phan-bo/:id or GET /vung-phan-bo/:ten_dia_phan_hanh_chinh
 */
export async function getVungPhanBoById(id: number): Promise<VungPhanBo> {
  const response = await apiGet<any>(`/vung-phan-bo/${id}`);
  return response.data || response;
}

export async function getVungPhanBoByName(tenDiaPhanHanhChinh: string): Promise<VungPhanBo> {
  const response = await apiGet<any>(`/vung-phan-bo/${tenDiaPhanHanhChinh}`);
  return response.data || response;
}

/**
 * Create a single VungPhanBo
 * Endpoint: POST /vung-phan-bo
 */
export async function createVungPhanBo(data: CreateVungPhanBoData): Promise<VungPhanBo> {
  const response = await apiPost<any>('/vung-phan-bo', data);
  return response.data || response;
}

/**
 * Create multiple VungPhanBo
 * Endpoint: POST /vung-phan-bo/many
 */
export async function createMultipleVungPhanBos(dataList: CreateVungPhanBoData[]): Promise<VungPhanBo[]> {
  const response = await apiPost<any>('/vung-phan-bo/many', { data: dataList });
  return response.data || response;
}

/**
 * Update a VungPhanBo
 * Endpoint: PUT /vung-phan-bo/:id
 */
export async function updateVungPhanBo(id: number, data: UpdateVungPhanBoData): Promise<VungPhanBo> {
  const response = await apiPut<any>(`/vung-phan-bo/${id}`, data);
  return response.data || response;
}

/**
 * Delete a VungPhanBo
 * Endpoint: DELETE /vung-phan-bo/:id
 */
export async function deleteVungPhanBo(id: number): Promise<VungPhanBo> {
  const response = await apiDelete<any>(`/vung-phan-bo/${id}`);
  return response.data || response;
}

/**
 * Upload VungPhanBo CSV file
 */
export async function uploadVungPhanBosCsv(file: File): Promise<CSVUploadResponse<VungPhanBo>> {
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
    
    const vungPhanBosData: CreateVungPhanBoData[] = csvData.rows.map(row => ({
      ten_dia_phan_hanh_chinh: row.ten_dia_phan_hanh_chinh || '',
      danh_sach_diem_bien: row.danh_sach_diem_bien || undefined,
    }));
    
    const response = await apiPost<any>('/vung-phan-bo/many', { data: vungPhanBosData });
    const createdVungPhanBos = Array.isArray(response.data) ? response.data : [];
    
    return {
      message: response.message || 'CSV upload successful',
      data: createdVungPhanBos,
      success: createdVungPhanBos.length,
      failed: vungPhanBosData.length - createdVungPhanBos.length,
      errors: [],
    };
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

/**
 * Get all VungPhanBo as a simple list (no pagination)
 * Useful for dropdowns and selections
 */
export async function loadAllVungPhanBos(): Promise<VungPhanBo[]> {
  try {
    const response = await apiGet<any>('/vung-phan-bo/all-vung-phan-bo?limit=1000&page=1');
    return response.vungPhanBos || [];
  } catch (error) {
    console.warn('Failed to load all VungPhanBo:', error);
    return [];
  }
}
