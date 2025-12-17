'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteUser, loadUsers, toggleUserBlock } from "@/lib/api/users";
import { User, UserFilters, UserStatus } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export function useUsersView() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filters, setFilters] = useState<UserFilters>({
        search: '',
        status: undefined,
        page: 1,
        limit: 10
    });
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadUsers(filters);
            setUsers(response.users);
            setTotal(response.total);
        } catch (error) {
            console.error('Error loading users:', error);
            // Show error message to user
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUser = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleToggleBlock = async (userId: number) => {
        try {
            await toggleUserBlock(userId);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling user block:', error);
            alert('Failed to update user status');
        }
    };

    const handleModalSuccess = () => {
        fetchUsers();
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilters(prev => ({
            ...prev,
            status: value ? value as UserStatus : undefined,
            page: 1
        }));
    };

    const getStatusBadge = (status: UserStatus) => {
        return (
            <Badge variant={status === UserStatus.ACTIVE ? 'success' : 'danger'}>
                {status}
            </Badge>
        );
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const totalPages = Math.ceil(total / (filters.limit || 10));

    return {
        handleCreateUser,
        setSearchInput,
        handleStatusFilterChange,
        getStatusBadge,
        formatDate,
        handleEditUser,
        handleToggleBlock,
        handleDeleteUser,
        setShowModal,
        handleModalSuccess,
        setFilters,
        searchInput,
        filters,
        total,
        loading,
        users,
        totalPages,
        showModal,
        editingUser,
    }
}