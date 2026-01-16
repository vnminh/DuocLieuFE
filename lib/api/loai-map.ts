import { apiGet } from './client';
import {
  VungPhanBoMapData,
  VungPhanBoWithLoais,
  LoaiWithCoordinates,
} from '@/features/admin/loai-map/types/loai-map';

/**
 * Get all VungPhanBo with map data (boundaries and loai count)
 * Endpoint: GET /vung-phan-bo/map-data
 * Note: handleResponse already unwraps the 'data' property from { message, data }
 */
export async function loadMapData(): Promise<VungPhanBoMapData[]> {
  const response = await apiGet<VungPhanBoMapData[]>('/vung-phan-bo/map-data');
  return response || [];
}

/**
 * Get loais with coordinates for a specific VungPhanBo
 * Endpoint: GET /vung-phan-bo/:id/loais-with-coordinates
 * Note: handleResponse already unwraps the 'data' property from { message, data }
 */
export async function loadLoaisWithCoordinates(vungPhanBoId: number): Promise<VungPhanBoWithLoais> {
  const response = await apiGet<VungPhanBoWithLoais>(`/vung-phan-bo/${vungPhanBoId}/loais-with-coordinates`);
  return response;
}

/**
 * Get all loais with coordinates
 * Endpoint: GET /vung-phan-bo/all-loais-with-coordinates
 * Note: handleResponse already unwraps the 'data' property from { message, data }
 */
export async function loadAllLoaisWithCoordinates(): Promise<LoaiWithCoordinates[]> {
  const response = await apiGet<LoaiWithCoordinates[]>('/vung-phan-bo/all-loais-with-coordinates');
  return response || [];
}
