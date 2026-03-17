'use client';

import React from 'react';
import Link from 'next/link';
import { useSignupView } from '../hook/useSignupView';
import { Input } from '@/features/common-ui/input';
import { Button } from '@/features/common-ui/button';
import { Select } from '@/features/common-ui/select';

export default function SignupView() {
  const {
    formData,
    errors,
    isLoading,
    signupError,
    handleInputChange,
    handleSignup,
  } = useSignupView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
          <p className="text-gray-600 mt-2">Tham gia và bắt đầu khám phá</p>
        </div>

        {/* Error Message */}
        {signupError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{signupError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <Input
              label="Họ và tên"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              disabled={isLoading}
              error={errors.full_name}
            />
          </div>

          {/* Email Address */}
          <div>
            <Input
              label="Địa chỉ Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              disabled={isLoading}
              error={errors.email}
            />
          </div>

          {/* Password */}
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.password}
            />
            <p className="text-xs text-gray-500 mt-2">
              Mật khẩu phải có chữ hoa, chữ thường, số (tối thiểu 8 ký tự)
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.confirm_password}
            />
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính (Không bắt buộc)
              </label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </Select>
            </div>

            {/* Date of Birth */}
            <div>
              <Input
                label="Ngày sinh (Không bắt buộc)"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Input
              label="Địa chỉ (Không bắt buộc)"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Tên Đường"
              disabled={isLoading}
            />
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
                Đang tạo tài khoản...
              </span>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Bạn đã có tài khoản?{' '}
            <Link
              href="/account/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
