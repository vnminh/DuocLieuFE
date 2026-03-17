/**
 * Signup View Hook
 * Manages signup form state and API interactions
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signup, SignupRequest } from '@/lib/api/signup';

export interface SignupFormData extends SignupRequest {
  confirm_password: string;
}

export function useSignupView() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    address: '',
    gender: '',
    date_of_birth: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Họ và tên là bắt buộc';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ số';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleSignup = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignupError(null);

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      try {
        await signup(formData);
        // Redirect to search page (default page for USER role)
        router.push('/admin/search');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Đăng ký thất bại';
        setSignupError(message);
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirm_password: '',
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, router]
  );

  return {
    formData,
    errors,
    isLoading,
    signupError,
    handleInputChange,
    handleSignup,
    setFormData,
    setSignupError,
  };
}
