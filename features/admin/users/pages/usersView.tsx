'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/features/common-ui/button';
import { Input } from '@/features/common-ui/input';
import { Select } from '@/features/common-ui/select';
import { Badge } from '@/features/common-ui/badge';
import { Pagination } from '@/features/common-ui/pagination';
import { UserFormModal } from '@/features/admin/users/component/UserFormModal';
import { User, UserStatus, UserFilters, UserRole } from '@/types/user';
import { loadUsers, deleteUser, toggleUserBlock } from '@/lib/api/users';
import { useUsersView } from '../hook/useUsersView';
import { cookieStorage } from '@/lib/cookieStorage';
import { Plus, Upload, Eye } from 'lucide-react';

export default function UsersView() {
  const {
      handleCreateUser,
      setSearchInput,
      handleStatusFilterChange,
      getStatusBadge,
      formatDate,
      handleEditUser,
      handleViewUser,
      handleToggleBlock,
      handleDeleteUser,
      setShowModal,
      handleModalSuccess,
      handleCloseModal,
      setFilters,
      searchInput,
      filters,
      total,
      loading,
      users,
      totalPages,
      showModal,
      editingUser,
      isViewMode,
    } = useUsersView();

  const [csvMode, setCsvMode] = useState(false);

  const handleOpenCsvMode = () => {
    setCsvMode(true);
    setShowModal(true);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search by name or email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
          />
          
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={handleStatusFilterChange}
          >
            <option value="" className='text-gray-400'>All Statuses</option>
            <option value={UserStatus.ACTIVE} className='text-gray-700'>Active</option>
            <option value={UserStatus.BLOCKED} className='text-gray-700'>Blocked</option>
          </Select>

          <div className="flex items-end col-start-1">
            <div className="text-sm text-gray-600">
              Total: {total} users
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar}
                                alt={user.full_name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=3b82f6&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                            {user.address && (
                              <div className="text-sm text-gray-500">
                                {user.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={user.status === UserStatus.ACTIVE ? 'secondary' : 'primary'}
                          onClick={() => handleToggleBlock(user.id, cookieStorage.getUser()?.role || UserRole.USER)}
                        >
                          {user.status === UserStatus.ACTIVE ? 'Block' : 'Unblock'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No users found</p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={filters.page!}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={filters.limit!}
              itemsCount={users.length}
              itemName="users"
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
            />
          </>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        key={editingUser?.id || 'new'}
        isOpen={showModal}
        onClose={() => {
          handleCloseModal();
          setCsvMode(false);
        }}
        onSuccess={handleModalSuccess}
        user={editingUser}
        viewMode={isViewMode}
      />
    </div>
  );
}