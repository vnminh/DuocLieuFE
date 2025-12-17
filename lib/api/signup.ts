/**
 * Signup API
 * Handles user registration
 */

import { User, CreateUserData, UserStatus, UserRole } from '@/types/user';
import { apiPost } from './client';
import { cookieStorage } from '@/lib/cookieStorage';

export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
}

export interface SignupResponse {
  data: User;
  message: string;
}

/**
 * Register a new user
 * Endpoint: POST /users/user
 */
export async function signup(data: SignupRequest): Promise<User> {
  try {
    // Validate passwords match
    if (data.confirm_password && data.password !== data.confirm_password) {
      throw new Error('Passwords do not match');
    }

    const signupData: CreateUserData = {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      address: data.address,
      gender: data.gender,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
    };

    const response = await apiPost<any>('/users/user', signupData);

    const user = response.data || response;

    if (!user || !user.id) {
      throw new Error('Invalid signup response');
    }

    // Automatically log in user after signup
    cookieStorage.setUser(user);

    return user;
  } catch (error) {
    // Clear any partial data on failure
    cookieStorage.logout();
    throw error;
  }
}

/**
 * Register multiple users (admin bulk import)
 * Endpoint: POST /users/user/many
 */
export async function signupBulk(users: SignupRequest[]): Promise<User[]> {
  try {
    const signupData = users.map((user) => ({
      full_name: user.full_name,
      email: user.email,
      password: user.password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      address: user.address,
      gender: user.gender,
      date_of_birth: user.date_of_birth
        ? new Date(user.date_of_birth)
        : undefined,
    }));

    const response = await apiPost<any>('/users/user/many', { data: signupData });

    return response.data || response;
  } catch (error) {
    throw error;
  }
}
