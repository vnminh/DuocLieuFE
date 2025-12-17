'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteNganh, loadNganhs } from "@/lib/api/nganhs";
import { Nganh, NganhFilters } from "@/types/nganhs";
import { useCallback, useEffect, useState } from "react";

export function useNganhsView() {
    const [nganhs, setNganhs] = useState<Nganh[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingNganh, setEditingNganh] = useState<Nganh | null>(null);
    const [filters, setFilters] = useState<NganhFilters>({
        search: '',
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

    const fetchNganhs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadNganhs(filters);
            setNganhs(response.nganhs);
            setTotal(response.total);
        } catch (error) {
            console.error('Error loading nganhs:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchNganhs();
    }, [fetchNganhs]);

    const handleCreateNganh = () => {
        setEditingNganh(null);
        setShowModal(true);
    };

    const handleEditNganh = (nganh: Nganh) => {
        setEditingNganh(nganh);
        setShowModal(true);
    };

    const handleDeleteNganh = async (nganhId: number) => {
        if (window.confirm('Are you sure you want to delete this nganh?')) {
            try {
                await deleteNganh(nganhId);
                fetchNganhs();
            } catch (error) {
                console.error('Error deleting nganh:', error);
                alert('Failed to delete nganh');
            }
        }
    };

    const handleModalSuccess = () => {
        fetchNganhs();
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const totalPages = Math.ceil(total / (filters.limit || 10));

    return {
        handleCreateNganh,
        setSearchInput,
        formatDate,
        handleEditNganh,
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
    }
}