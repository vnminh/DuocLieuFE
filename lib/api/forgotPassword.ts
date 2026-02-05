/**
 * Forgot Password API
 * Handles password reset requests
 */

import { apiPost } from './client';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  data: {
    email: string;
    emailSent: boolean;
  };
}

/**
 * Request password reset - sends new password to user's email
 * Endpoint: POST /users/reset-password
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  try {
    const response = await apiPost<ForgotPasswordResponse>(
      '/users/reset-password',
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}
