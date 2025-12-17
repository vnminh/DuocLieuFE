'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/features/common-ui/modal';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { User, UserStatus, Role, CreateUserData, UpdateUserData, UserRole } from '@/types/user';
import { createUser, updateUser } from '@/lib/api/users';
import { UserFormModalProps } from '../types/users';
import { useUsersFormModal } from '../hook/useUserFormModal';


export function UserFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
  
  const {
      handleSubmit,
      handleInputChange,
      isEditMode,
      formData,
      errors,
      loading,
    } = useUsersFormModal({ isOpen, onClose, onSuccess, user });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit User' : 'Create User'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Full Name *"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            error={errors.full_name}
            placeholder="Enter full name"
          />

          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Enter email address"
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
          />

          <Input
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />

          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
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
          />

          <Select
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            error={errors.status}
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}