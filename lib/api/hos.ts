import { 
  Ho, HoFilters, CreateHoData, UpdateHoData
} from '@/types/hos';
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData, buildQueryString, APIResponse, CSVUploadResponse } from './client';
import { parseCSVFile } from '@/lib/csvPreview';

/**
 * Get all Họ with filters and pagination
 * Endpoint: GET /hos/all
 */
export async function loadHos(filters: HoFilters = {}): Promise<{ hos: Ho[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ten_khoa_hoc: filters.search,
    ten_nganh_khoa_hoc: filters.ten_nganh_khoa_hoc,
  });

  const response = await apiGet<any>(`/hos/all-hos${queryString}`);
  return {
    hos: response.hos as Ho[] || [],
    total: response.total || 0,
    pages: response.pages || 0,
  };
}

/**
 * Get all Họ with extended information
 * Endpoint: GET /hos/all-hos
 */
export async function loadAllHos(filters?: HoFilters): Promise<{ hos: Ho[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ten_khoa_hoc: filters?.search,
    ten_nganh_khoa_hoc: filters?.ten_nganh_khoa_hoc,
  });

  const response = await apiGet<any>(`/hos/all-hos${queryString}`);
  return {
    hos: response.hos || [],
    total: response.total || 0,
    pages: response.pages || 0,
  };
}

/**
 * Get Họ by ID or scientific name
 * Endpoint: GET /hos/:id or GET /hos/:ten_khoa_hoc
 */
export async function getHoById(id: number): Promise<Ho> {
  return apiGet<Ho>(`/hos/${id}`);
}

export async function getHoByName(tenKhoaHoc: string): Promise<Ho> {
  return apiGet<Ho>(`/hos/${tenKhoaHoc}`);
}

/**
 * Create a single Họ
 * Endpoint: POST /hos
 */
export async function createHo(data: CreateHoData): Promise<Ho> {
  const response = await apiPost<any>('/hos', data);
  return response.data || response;
}

/**
 * Create multiple Họ
 * Endpoint: POST /hos/many
 */
export async function createMultipleHos(dataList: CreateHoData[]): Promise<Ho[]> {
  const response = await apiPost<any>('/hos/many', { data: dataList });
  return response.data || response;
}

/**
 * Update a Họ
 * Endpoint: PUT /hos/:id
 */
export async function updateHo(id: number, data: UpdateHoData): Promise<Ho> {
  const response = await apiPut<any>(`/hos/${id}`, data);
  return response.data || response;
}

/**
 * Delete a Họ
 * Endpoint: DELETE /hos/:id
 */
export async function deleteHo(id: number): Promise<Ho> {
  const response = await apiDelete<any>(`/hos/${id}`);
  return response.data || response;
}

/**
 * Upload Họ CSV file and batch create records
 * Parses CSV file and calls POST /hos/many endpoint
 */
export async function uploadHosCsv(file: File): Promise<CSVUploadResponse<Ho>> {
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
    
    const hosData: CreateHoData[] = csvData.rows.map(row => ({
      ten_khoa_hoc: row.ten_khoa_hoc || '',
      ten_tieng_viet: row.ten_tieng_viet || undefined,
      mo_ta: row.mo_ta || undefined,
      ten_nganh_khoa_hoc: row.ten_nganh_khoa_hoc || '',
    }));
    
    const response = await apiPost<any>('/hos/many', { data: hosData });
    const createdHos = Array.isArray(response.data) ? response.data : [];
    
    return {
      message: response.message || 'CSV upload successful',
      data: createdHos,
      success: createdHos.length,
      failed: hosData.length - createdHos.length,
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