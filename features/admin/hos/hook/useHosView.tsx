'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteHo, loadHos } from "@/lib/api/hos";
import { loadAllNganhs } from "@/lib/api/nganhs";
import { Ho, HoFilters } from "@/types/hos";
import { Nganh } from "@/types/nganhs";
import { useCallback, useEffect, useState } from "react";

export function useHosView() {
    const [hos, setHos] = useState<Ho[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingHo, setEditingHo] = useState<Ho | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [nganhs, setNganhs] = useState<Nganh[]>([]);
    const [filters, setFilters] = useState<HoFilters>({
        search: '',
        ten_nganh_khoa_hoc: '',
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

    useEffect(() => {
        loadAllNganhs().then(setNganhs).catch(console.error);
    }, []);

    const fetchHos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadHos(filters);
            setHos(response.hos);
            setTotal(response.total);
            if (response.pages) setTotalPages(response.pages);
        } catch (error) {
            console.error('Error loading hos:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchHos();
    }, [fetchHos]);

    const handleCreateHo = () => {
        setEditingHo(null);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditHo = (ho: Ho) => {
        setEditingHo(ho);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewHo = (ho: Ho) => {
        setEditingHo(ho);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleDeleteHo = async (hoId: number) => {
        if (window.confirm('Are you sure you want to delete this ho?')) {
            try {
                await deleteHo(hoId);
                fetchHos();
            } catch (error) {
                console.error('Error deleting ho:', error);
                alert('Failed to delete ho');
            }
        }
    };

    const handleModalSuccess = () => {
        fetchHos();
    };

    const handleNganhFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilters(prev => ({
            ...prev,
            ten_nganh_khoa_hoc: value || undefined,
            page: 1
        }));
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };


    return {
        handleCreateHo,
        setSearchInput,
        handleNganhFilterChange,
        formatDate,
        handleEditHo,
        handleViewHo,
        handleDeleteHo,
        setShowModal,
        handleModalSuccess,
        setFilters,
        searchInput,
        filters,
        total,
        loading,
        hos,
        nganhs,
        totalPages,
        showModal,
        editingHo,
        isViewMode,
    }
}