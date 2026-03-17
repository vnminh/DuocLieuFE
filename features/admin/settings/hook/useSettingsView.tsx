'use client';

import { useState, useEffect, useCallback } from 'react';
import { cookieStorage } from '@/lib/cookieStorage';
import { getUserProfile, updateUserProfile, changePassword, resetPassword } from '@/lib/api/users';
import { User } from '@/types/user';

export function useSettingsView() {
  // Profile state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Reset password state
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  // Confirm dialog
  const [showConfirmSave, setShowConfirmSave] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = cookieStorage.getUser();
      if (!storedUser) {
        setLoading(false);
        return;
      }

      setUserId(storedUser.id);

      try {
        const profile = await getUserProfile(storedUser.id);
        setFullName(profile.full_name || '');
        setEmail(profile.email || '');
        setAddress(profile.address || '');
        setGender(profile.gender || '');
        if (profile.date_of_birth) {
          const date = new Date(profile.date_of_birth);
          setDateOfBirth(date.toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to cookie data
        setFullName(storedUser.full_name || '');
        setEmail(storedUser.email || '');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile
  const handleSaveProfile = useCallback(async () => {
    if (!userId) return;

    setSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      await updateUserProfile(userId, {
        full_name: fullName,
        email,
        address,
        date_of_birth: dateOfBirth || undefined,
        gender: gender || undefined,
      });

      // Update cookie storage with new data
      cookieStorage.updateUser({
        full_name: fullName,
        email,
      });

      setProfileSuccess('Cập nhật thông tin cá nhân thành công');
      setShowConfirmSave(false);
    } catch (error: any) {
      setProfileError(error?.message || 'Cập nhật thông tin cá nhân thất bại');
      setShowConfirmSave(false);
    } finally {
      setSaving(false);
    }
  }, [userId, fullName, email, address, dateOfBirth, gender]);

  // Change password
  const handleChangePassword = useCallback(async () => {
    if (!userId) return;

    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Mật khẩu hiện tại là bắt buộc');
      return;
    }
    if (!newPassword) {
      setPasswordError('Mật khẩu mới là bắt buộc');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Mật khẩu mới phải có ít nhất 1 chữ hoa');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('Mật khẩu mới phải có ít nhất 1 chữ thường');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('Mật khẩu mới phải có ít nhất 1 chữ số');
      return;
    }
    if (!confirmPassword) {
      setPasswordError('Vui lòng xác nhận mật khẩu mới');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(userId, {
        old_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess('Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (error: any) {
      setPasswordError(error?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setChangingPassword(false);
    }
  }, [userId, currentPassword, newPassword, confirmPassword]);

  // Reset password
  const handleResetPassword = useCallback(async () => {
    if (!email) return;

    if (!window.confirm('Hệ thống sẽ gửi mật khẩu ngẫu nhiên mới qua email của bạn. Tiếp tục?')) {
      return;
    }

    setResettingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');
    setResetSuccess('');

    try {
      await resetPassword(email);
      setResetSuccess('Mật khẩu mới đã được gửi qua email của bạn');
    } catch (error: any) {
      setPasswordError(error?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setResettingPassword(false);
    }
  }, [email]);

  // Cancel change password
  const handleCancelChangePassword = useCallback(() => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  }, []);

  return {
    // Profile
    loading,
    saving,
    profileError,
    profileSuccess,
    fullName,
    email,
    address,
    dateOfBirth,
    gender,
    setFullName,
    setEmail,
    setAddress,
    setDateOfBirth,
    setGender,
    // Confirm save
    showConfirmSave,
    setShowConfirmSave,
    handleSaveProfile,
    // Password change
    showChangePassword,
    setShowChangePassword,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    passwordError,
    passwordSuccess,
    changingPassword,
    handleChangePassword,
    handleCancelChangePassword,
    // Password reset
    resettingPassword,
    resetSuccess,
    handleResetPassword,
  };
}
