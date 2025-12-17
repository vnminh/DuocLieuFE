/**
 * Login View Hook
 * Manages login form state and API interactions
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/login';
import { User } from '@/types/user';

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
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        const message = error instanceof Error ? error.message : 'Login failed';
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
