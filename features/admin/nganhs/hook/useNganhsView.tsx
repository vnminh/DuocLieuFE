'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteNganh, loadNganhs } from "@/lib/api/nganhs";
import { Nganh, NganhFilters } from "@/types/nganhs";
import { useCallback, useEffect, useState } from "react";

export function useNganhsView() {
    const [nganhs, setNganhs] = useState<Nganh[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingNganh, setEditingNganh] = useState<Nganh | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [filters, setFilters] = useState<NganhFilters>({
        search: '',
        page: 1,
        limit: 10,
    });
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchNganhs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadNganhs(filters);
            setNganhs(response.nganhs);
            setTotal(response.total);
            if (response.pages) setTotalPages(response.pages)
        } catch (error) {
            console.error('Lỗi khi tải danh sách ngành:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchNganhs();
    }, [fetchNganhs]);

    const handleCreateNganh = () => {
        setEditingNganh(null);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditNganh = (nganh: Nganh) => {
        setEditingNganh(nganh);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewNganh = (nganh: Nganh) => {
        setEditingNganh(nganh);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleDeleteNganh = async (nganhId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ngành này?')) {
            try {
                await deleteNganh(nganhId);
                fetchNganhs();
            } catch (error) {
                console.error('Lỗi khi xóa ngành:', error);
                setErrorMessage('Xóa ngành thất bại');
            }
        }
    };

    const handleModalSuccess = () => {
        fetchNganhs();
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };


    return {
        handleCreateNganh,
        setSearchInput,
        formatDate,
        handleEditNganh,
        handleViewNganh,
        handleDeleteNganh,
        setShowModal,
        handleModalSuccess,
        setFilters,
        searchInput,
        filters,
        total,
        loading,
        nganhs,
        totalPages,
        showModal,
        editingNganh,
        isViewMode,
        errorMessage,
        setErrorMessage,
    }
}