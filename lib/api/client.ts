/**
 * API Helper - Centralized API configuration and utility functions
 * Provides base URL configuration and error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export interface APIResponse<T = any> {
  message: string;
  data: T;
}

export interface APIErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface CSVUploadResponse<T = any> {
  message: string;
  data: T[];
  success: number;
  failed: number;
  errors: string[];
}

/**
 * Make a GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Make a POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Make a PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Make a DELETE request
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Upload a file with FormData
 */
export async function apiPostFormData<T = any>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestInit, 'body' | 'method'>
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Build query string from object
 */
export function buildQueryString(params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const errorData = data as APIErrorResponse;
    const error = new Error(
      errorData.message || `API Error: ${response.status} ${response.statusText}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  // If response has a data property (our API format), return it
  if ('data' in data) {
    return data.data as T;
  }

  // Otherwise return the whole response
  return data as T;
}

/**
 * Get full API URL for an endpoint
 */
export function getAPIUrl(endpoint: string): string {
  return `${BASE_URL}${endpoint}`;
}
