/**
 * Login View Hook
 * Manages login form state and API interactions
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/login';

export function useLoginView() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoginError(null);

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      try {
        await login(formData);
        // Redirect to dashboard or home page
        router.push('/admin/users');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Đăng nhập thất bại';
        setLoginError(message);
        setFormData((prev) => ({
          ...prev,
          password: '',
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
    loginError,
    handleInputChange,
    handleLogin,
    setFormData,
    setLoginError,
  };
}
