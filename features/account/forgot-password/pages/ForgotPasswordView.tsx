'use client';

import React from 'react';
import Link from 'next/link';
import { useForgotPasswordView } from '../hook/useForgotPasswordView';
import { Input } from '@/features/common-ui/input';
import { Button } from '@/features/common-ui/button';

export default function ForgotPasswordView() {
  const {
    formData,
    errors,
    isLoading,
    submitError,
    isSuccess,
    handleInputChange,
    handleSubmit,
    handleBackToLogin,
  } = useForgotPasswordView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email and we'll send you a new password
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-700 text-sm font-medium">
                A new password has been sent to your email!
              </p>
            </div>
            <p className="text-green-600 text-sm mt-2">
              Please check your inbox and use the new password to login.
            </p>
            <Button
              type="button"
              onClick={handleBackToLogin}
              className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Login
            </Button>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{submitError}</p>
          </div>
        )}

        {/* Forgot Password Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isLoading}
                error={errors.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  Sending...
                </span>
              ) : (
                'Send New Password'
              )}
            </Button>
          </form>
        )}

        {/* Back to Login Link */}
        {!isSuccess && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link
                href="/account/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Back to Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
