import { User, UserFilters, CreateUserData, UpdateUserData, VerificationPurpose, UserStatus, UserRole } from '@/types/user';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString, APIResponse, CSVUploadResponse } from './client';
import { parseCSVFile } from '@/lib/csvPreview';

/**
 * Get all users with pagination and filters
 * Endpoint: GET /users/user
 */
export async function loadUsers(filters: UserFilters = {}): Promise<{ users: User[], total: number, pages: number }> {
  const queryString = buildQueryString({
    page: filters.page || 1,
    limit: filters.limit || 10,
    role: filters.status,
    status: filters.status,
  });

  const response = await apiGet<any>(`/users/user${queryString}`);
  return {
    users: response.allUser || [],
    total: response.total || 0,
    pages: response.n_pages || 0,
  };
}

/**
 * Create a new user
 * Endpoint: POST /users/user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiPost<any>('/users/user', data);
  return response.data || response;
}

/**
 * Create multiple users
 * Endpoint: POST /users/user/many
 */
export async function createMultipleUsers(dataList: CreateUserData[]): Promise<User[]> {
  const response = await apiPost<any>('/users/user/many', { data: dataList });
  return response.data || response;
}

/**
 * Update a user
 * Endpoint: PUT /users/user/:id
 */
export async function updateUser(id: number, data: UpdateUserData): Promise<User> {
  const response = await apiPut<any>(`/users/user/${id}`, data);
  return response.data || response;
}

/**
 * Delete a user
 * Endpoint: DELETE /users/user/:id (assumed)
 */
export async function deleteUser(id: number): Promise<void> {
  await apiDelete<any>(`/users/user/${id}`);
}

/**
 * User login
 * Endpoint: POST /users/login
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const response = await apiPost<any>('/users/login', { email, password });
  return response.data || response;
}

/**
 * Request password reset
 * Endpoint: POST /users/forgot-password
 */
export async function forgotPassword(email: string): Promise<{
  verificationCode: {
    id: number;
    user_id: number;
    code: string;
    purpose: string;
    expires_at: Date;
    created_at: Date;
  };
  emailResponse: {
    id: string;
    from: string;
    to: string;
  };
}> {
  const response = await apiPost<any>('/users/forgot-password', { email });
  return response.data || response;
}

/**
 * Verify verification code
 * Endpoint: POST /users/verify-code
 */
export async function verifyCode(
  user_id: number,
  verification_code: string,
  purpose: VerificationPurpose
): Promise<User> {
  const response = await apiPost<any>('/users/verify-code', {
    user_id,
    verification_code,
    purpose,
  });
  return response.data || response;
}

/**
 * Toggle user block status (ACTIVE/INACTIVE)
 * Note: This endpoint is not explicitly documented in API_END_POINT.md
 * Assuming it's implemented as an update to the status field
 */
export async function toggleUserBlock(id: number, user_role: UserRole): Promise<User> {
  // First get the current user
  const users = await loadUsers({ limit: 1000 });
  const user = users.users.find((u) => u.id === id);

  if (!user) {
    throw new Error('User not found');
  }

  // Toggle status
  const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;
  return updateUser(id, { status: newStatus, role:user_role });
}

/**
 * Upload Users CSV file and batch create records
 * Parses CSV file and calls POST /users/user/many endpoint
 */
export async function uploadUsersCsv(file: File): Promise<CSVUploadResponse<User>> {
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
    
    const usersData: CreateUserData[] = csvData.rows.map(row => ({
      full_name: row.full_name || '',
      email: row.email || '',
      password: row.password || '',
      address: row.address || undefined,
      date_of_birth: row.date_of_birth ? new Date(row.date_of_birth) : undefined,
      gender: row.gender || undefined,
      avatar: row.avatar || undefined,
      status: (row.status as UserStatus) || UserStatus.ACTIVE,
      role: (row.role as UserRole) || UserRole.USER,
    }));
    console.log(usersData)
    const response = await apiPost<any>('/users/user/many', { data: usersData });
    const createdUsers = Array.isArray(response.data) ? response.data : [];
    
    return {
      message: response.message || 'CSV upload successful',
      data: createdUsers,
      success: createdUsers.length,
      failed: usersData.length - createdUsers.length,
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