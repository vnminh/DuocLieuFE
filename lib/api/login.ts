/**
 * Login API
 * Handles user authentication and saves user data to cookies
 */

import { User } from '@/types/user';
import { apiPost } from './client';
import { cookieStorage } from '@/lib/cookieStorage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: User;
  message: string;
}

/**
 * Login user and save auth data to cookies
 * Endpoint: POST /users/login
 */
export async function login(credentials: LoginRequest): Promise<User> {
  try {
    const response = await apiPost<any>('/users/login', credentials);

    const user = response.data || response;

    if (!user || !user.id) {
      throw new Error('Invalid login response');
    }

    // Save user to cookies (token would come from response if API provides it)
    cookieStorage.setUser(user);

    return user;
  } catch (error) {
    // Clear any partial data on failure
    cookieStorage.logout();
    throw error;
  }
}

/**
 * Check if user is currently logged in
 */
export function isLoggedIn(): boolean {
  return cookieStorage.isAuthenticated();
}

/**
 * Get current logged-in user
 */
export function getCurrentUser() {
  return cookieStorage.getUser();
}

/**
 * Logout user and clear cookies
 */
export function logout(): void {
  cookieStorage.logout();
}
