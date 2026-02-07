'use client';

import React from 'react';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Button } from '@/features/common-ui/button';
import { useSettingsView } from '../hook/useSettingsView';
import { Save, KeyRound, RotateCcw, X, Check } from 'lucide-react';

export default function SettingsView() {
  const {
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
    showConfirmSave,
    setShowConfirmSave,
    handleSaveProfile,
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
    resettingPassword,
    resetSuccess,
    handleResetPassword,
  } = useSettingsView();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and account settings</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
        </div>

        <div className="p-6 space-y-4">
          {profileError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              {profileSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          {!showConfirmSave ? (
            <Button onClick={() => setShowConfirmSave(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">Are you sure you want to save?</span>
              <Button onClick={handleSaveProfile} disabled={saving}>
                <Check className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Confirm'}
              </Button>
              <Button variant="secondary" onClick={() => setShowConfirmSave(false)} disabled={saving}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account password</p>
        </div>

        <div className="p-6 space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              {passwordSuccess}
            </div>
          )}
          {resetSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              {resetSuccess}
            </div>
          )}

          {!showChangePassword ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={handleResetPassword}
                disabled={resettingPassword}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {resettingPassword ? 'Sending...' : 'Reset Password'}
              </Button>
              <Button onClick={() => setShowChangePassword(true)}>
                <KeyRound className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <div className="flex items-center space-x-3">
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  <Save className="w-4 h-4 mr-2" />
                  {changingPassword ? 'Saving...' : 'Save Password'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancelChangePassword}
                  disabled={changingPassword}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
