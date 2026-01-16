import { 
  Nganh, NganhFilters, CreateNganhData, UpdateNganhData
} from '@/types/nganhs';
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData, buildQueryString, APIResponse, CSVUploadResponse } from './client';
import { parseCSVFile } from '@/lib/csvPreview';

/**
 * Get all Ngành with extended information
 * Endpoint: GET /nganhs/all-nganhs
 */
export async function loadNganhs(filters: NganhFilters = {}): Promise<{ nganhs: Nganh[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ten_khoa_hoc: filters.search,
  });

  const response = await apiGet<any>(`/nganhs/all-nganhs${queryString}`);
  return {
    nganhs: response.nganhs || [],
    total: response.total || 0,
    pages: response.pages || 0,
  };
}

/**
 * Get Ngành by ID or scientific name
 * Endpoint: GET /nganhs/:id or GET /nganhs/:ten_khoa_hoc
 */
export async function getNganhById(id: number): Promise<Nganh> {
  const response = await apiGet<any>(`/nganhs/${id}`);
  return response.data || response;
}

/**
 * Get Nganh with all related data (hos with loais count)
 * Endpoint: GET /nganhs/:id/detail
 */
export interface NganhDetail extends Nganh {
  hos: {
    id: number;
    ten_khoa_hoc: string;
    ten_tieng_viet: string | null;
    mo_ta: string | null;
    loais_count: number;
  }[];
  hos_count: number;
}

export async function getNganhDetail(id: number): Promise<NganhDetail> {
  const response = await apiGet<NganhDetail>(`/nganhs/${id}/detail`);
  return response;
}

export async function getNganhByName(tenKhoaHoc: string): Promise<Nganh> {
  const response = await apiGet<any>(`/nganhs/${tenKhoaHoc}`);
  return response.data || response;
}

/**
 * Create a single Ngành
 * Endpoint: POST /nganhs
 */
export async function createNganh(data: CreateNganhData): Promise<Nganh> {
  const response = await apiPost<any>('/nganhs', data);
  return response.data || response;
}

/**
 * Create multiple Ngành
 * Endpoint: POST /nganhs/many
 */
export async function createMultipleNganhs(dataList: CreateNganhData[]): Promise<Nganh[]> {
  const response = await apiPost<any>('/nganhs/many', { data: dataList });
  return response.data || response;
}

/**
 * Update a Ngành
 * Endpoint: PUT /nganhs/:id
 */
export async function updateNganh(id: number, data: UpdateNganhData): Promise<Nganh> {
  const response = await apiPut<any>(`/nganhs/${id}`, data);
  return response.data || response;
}

/**
 * Delete a Ngành
 * Endpoint: DELETE /nganhs/:id
 */
export async function deleteNganh(id: number): Promise<Nganh> {
  const response = await apiDelete<any>(`/nganhs/${id}`);
  return response.data || response;
}

/**
 * Upload Ngành CSV file
 * Note: This endpoint is not documented in API_END_POINT.md
 * Assuming it follows the pattern: POST /nganhs/upload-csv or similar
 */
export async function uploadNganhsCsv(file: File): Promise<CSVUploadResponse<Nganh>> {
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
    
    const nganhsData: CreateNganhData[] = csvData.rows.map(row => ({
      ten_khoa_hoc: row.ten_khoa_hoc || '',
      ten_tieng_viet: row.ten_tieng_viet || undefined,
      mo_ta: row.mo_ta || undefined,
    }));
    
    const response = await apiPost<any>('/nganhs/many', { data: nganhsData });
    const createdNganhs = Array.isArray(response.data) ? response.data : [];
    
    return {
      message: response.message || 'CSV upload successful',
      data: createdNganhs,
      success: createdNganhs.length,
      failed: nganhsData.length - createdNganhs.length,
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
 * Get all Ngành as a simple list (no pagination)
 * Useful for dropdowns and selections
 */
export async function loadAllNganhs(): Promise<Nganh[]> {
  try {
    const response = await apiGet<any>('/nganhs/all-nganhs?limit=1000&page=1');
    return response.nganhs || [];
  } catch (error) {
    console.warn('Failed to load all Ngành:', error);
    return [];
  }
}