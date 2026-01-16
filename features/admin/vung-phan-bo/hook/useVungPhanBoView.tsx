'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteVungPhanBo, loadVungPhanBos } from "@/lib/api/vung-phan-bo";
import { VungPhanBo, VungPhanBoFilters } from "@/types/vung-phan-bo";
import { useCallback, useEffect, useState } from "react";

export function useVungPhanBoView() {
    const [vungPhanBos, setVungPhanBos] = useState<VungPhanBo[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingVungPhanBo, setEditingVungPhanBo] = useState<VungPhanBo | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [filters, setFilters] = useState<VungPhanBoFilters>({
        search: '',
        page: 1,
        limit: 10,
    });
    const [searchInput, setSearchInput] = useState('');
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchVungPhanBos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadVungPhanBos(filters);
            setVungPhanBos(response.vungPhanBos);
            setTotal(response.total);
            if (response.pages) setTotalPages(response.pages)
        } catch (error) {
            console.error('Error loading vung phan bos:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchVungPhanBos();
    }, [fetchVungPhanBos]);

    const handleCreateVungPhanBo = () => {
        setEditingVungPhanBo(null);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditVungPhanBo = (vungPhanBo: VungPhanBo) => {
        setEditingVungPhanBo(vungPhanBo);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewVungPhanBo = (vungPhanBo: VungPhanBo) => {
        setEditingVungPhanBo(vungPhanBo);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleDeleteVungPhanBo = async (vungPhanBoId: number) => {
        if (window.confirm('Are you sure you want to delete this vung phan bo?')) {
            try {
                await deleteVungPhanBo(vungPhanBoId);
                fetchVungPhanBos();
            } catch (error) {
                console.error('Error deleting vung phan bo:', error);
                alert('Failed to delete vung phan bo');
            }
        }
    };

    const handleModalSuccess = () => {
        fetchVungPhanBos();
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };


    return {
        handleCreateVungPhanBo,
        setSearchInput,
        formatDate,
        handleEditVungPhanBo,
        handleViewVungPhanBo,
        handleDeleteVungPhanBo,
        setShowModal,
        handleModalSuccess,
        setFilters,
        searchInput,
        filters,
        total,
        loading,
        vungPhanBos,
        totalPages,
        showModal,
        editingVungPhanBo,
        isViewMode,
    }
}
