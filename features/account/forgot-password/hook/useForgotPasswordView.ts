/**
 * Forgot Password View Hook
 * Manages forgot password form state and API interactions
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword, ForgotPasswordRequest } from '@/lib/api/forgotPassword';

export function useForgotPasswordView() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
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
      // Clear previous error and success states
      setSubmitError(null);
      setIsSuccess(false);
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSuccess(false);

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      try {
        await forgotPassword(formData);
        setIsSuccess(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.';
        setSubmitError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm]
  );

  const handleBackToLogin = useCallback(() => {
    router.push('/account/login');
  }, [router]);

  return {
    formData,
    errors,
    isLoading,
    submitError,
    isSuccess,
    handleInputChange,
    handleSubmit,
    handleBackToLogin,
    setFormData,
    setSubmitError,
  };
}
