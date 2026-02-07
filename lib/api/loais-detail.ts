import { Loai } from '@/types/loais';
import { apiGet, apiDelete, apiPostFormData } from './client';

/**
 * Get Loai with all related data (ho, nganh, dac_diem_sinh_hoc, etc.)
 * Endpoint: GET /loais/:id/detail
 */
export async function getLoaiDetail(id: number): Promise<Loai> {
  const response = await apiGet<Loai>(`/loais/${id}/detail`);
  return response;
}

/**
 * Get image count for a Loài
 * Endpoint: GET /loais/:id/images/count
 */
export async function getLoaiImageCount(id: number): Promise<{ count: number; collection_uri: string }> {
  return apiGet<{ count: number; collection_uri: string }>(`/loais/${id}/images/count`);
}

/**
 * Get image URL for a Loài by index
 * Returns the URL to fetch the image from static assets
 * URL: BASE_URL/images/{id}/{index}.jpg
 */
export function getLoaiImageUrl(id: number, index: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/images/${id}/${index}.jpg`;
}

/**
 * Upload a preview image for a Loài
 * Endpoint: POST /loais/:id/images/upload
 */
export async function uploadLoaiPreviewImage(
  id: number,
  file: File
): Promise<{ index: number; count: number }> {
  const formData = new FormData();
  formData.append('image', file);

  return apiPostFormData<{ index: number; count: number }>(
    `/loais/${id}/images/upload`,
    formData,
  );
}

/**
 * Delete a preview image for a Loài
 * Endpoint: DELETE /loais/:id/images/:index
 */
export async function deleteLoaiPreviewImage(
  id: number,
  index: number
): Promise<{ deletedIndex: number; count: number }> {
  return apiDelete<{ deletedIndex: number; count: number }>(
    `/loais/${id}/images/${index}`,
  );
}
