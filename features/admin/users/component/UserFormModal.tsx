'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { CsvUpload } from '@/features/common-ui/csv-upload';
import { User, UserStatus, Role, CreateUserData, UpdateUserData, UserRole } from '@/types/user';
import { createUser, updateUser, uploadUsersCsv } from '@/lib/api/users';
import { UserFormModalProps } from '../types/users';
import { useUsersFormModal } from '../hook/useUserFormModal';


export function UserFormModal({ isOpen, onClose, onSuccess, user, viewMode }: UserFormModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');
  
  console.log(user);

  const {
      handleSubmit,
      handleInputChange,
      isEditMode,
      formData,
      errors,
      loading,
    } = useUsersFormModal({ isOpen, onClose, onSuccess, user, viewMode });

  console.log('formData =',formData)
  
  useEffect(() => {
    if (isOpen) {
      setActiveTab(isEditMode ? 'form' : 'form');
    }
  }, [isOpen, isEditMode]);

  const handleCsvUpload = async (file: File) => {
    const result = await uploadUsersCsv(file);
    if (result.success > 0) {
      onSuccess();
    }
    return result;
  };

  const csvColumns = ['full_name', 'email', 'password', 'address', 'date_of_birth', 'gender', 'status', 'role'];
  const sampleCsvData = {
    full_name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    address: '123 Main St',
    date_of_birth: '1990-01-15',
    gender: 'Male',
    status: 'ACTIVE',
    role: 'USER'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode ? 'View User' : (isEditMode ? 'Edit User' : 'Create User')}
      className="max-w-2xl"
    >
      {/* Tabs */}
      {!isEditMode && !viewMode && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'form'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'csv'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            CSV Upload
          </button>
        </div>
      )}

      {/* Form Tab */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Full Name *"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              error={errors.full_name}
              placeholder="Enter full name"
              disabled={viewMode}
            />

            <Input
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter email address"
              disabled={viewMode}
            />

            {!isEditMode && (
              <Input
                label="Password *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Enter password"
              />
            )}

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              disabled={viewMode}
            />

            <Input
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              disabled={viewMode}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={viewMode}
            >
              <option value="" className='text-gray-400'>Select gender</option>
              <option value="Male" className='text-gray-700'>Male</option>
              <option value="Female" className='text-gray-700'>Female</option>
              <option value="Other" className='text-gray-700'>Other</option>
            </Select>

            <Input
              label="Avatar URL"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="Enter avatar URL"
              disabled={viewMode}
            />

            <Select
              label="Status *"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              error={errors.status}
              disabled={viewMode}
            >
              <option value={UserStatus.ACTIVE}>Active</option>
              <option value={UserStatus.BLOCKED}>Blocked</option>
            </Select>

            <Select
              label="Role *"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
              disabled={viewMode}
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.STAFF}>Staff</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </Select>
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {viewMode ? 'Close' : 'Cancel'}
            </Button>
            {!viewMode && (
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
              </Button>
            )}
          </div>
        </form>
      )}

      {/* CSV Upload Tab */}
      {activeTab === 'csv' && (
        <CsvUpload
          onUpload={handleCsvUpload}
          acceptedColumns={csvColumns}
          sampleData={sampleCsvData}
        />
      )}
    </Modal>
  );
}