'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteUser, loadUsers, toggleUserBlock } from "@/lib/api/users";
import { User, UserFilters, UserRole, UserStatus } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export function useUsersView() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({
        search: '',
        status: undefined,
        page: 1,
        limit: 10
    });
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            if (response.pages) setTotalPages(response.pages);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
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
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewUser = (user: User) => {
        setEditingUser(user);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                setErrorMessage('Xóa người dùng thất bại');
            }
        }
    };

    const handleToggleBlock = async (userId: number, user_role:UserRole) => {
        try {
            await toggleUserBlock(userId, user_role);
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái người dùng:', error);
            setErrorMessage('Cập nhật trạng thái người dùng thất bại');
        }
    };

    const handleModalSuccess = () => {
        fetchUsers();
        setEditingUser(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
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


    return {
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
        errorMessage,
        setErrorMessage,
    }
}