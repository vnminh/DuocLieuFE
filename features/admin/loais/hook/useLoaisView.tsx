'use client'
import { Badge } from "@/features/common-ui/badge";
import { deleteLoai, loadLoais } from "@/lib/api/loais";
import { loadAllHos } from "@/lib/api/hos";
import { loadAllNganhs } from "@/lib/api/nganhs";
import { loadAllVungPhanBos } from "@/lib/api/vung-phan-bo";
import { Loai, LoaiFilters } from "@/types/loais";
import { Ho } from "@/types/hos";
import { Nganh } from "@/types/nganhs";
import { VungPhanBo } from "@/types/vung-phan-bo";
import { useCallback, useEffect, useState } from "react";

export function useLoaisView() {
    const [loais, setLoais] = useState<Loai[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingLoai, setEditingLoai] = useState<Loai | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [displayMode, setDisplayMode] = useState<'list' | 'card'>('list');
    const [hos, setHos] = useState<Ho[]>([]);
    const [nganhs, setNganhs] = useState<Nganh[]>([]);
    const [vungPhanBos, setVungPhanBos] = useState<VungPhanBo[]>([]);
    const [filteredHos, setFilteredHos] = useState<Ho[]>([]);
    const [filters, setFilters] = useState<LoaiFilters>({
        search: '',
        ten_ho_khoa_hoc: '',
        ten_nganh_khoa_hoc: '',
        vung_phan_bo: '',
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

    useEffect(() => {
        Promise.all([
            loadAllHos(),
            loadAllNganhs(),
            loadAllVungPhanBos()
        ]).then(([hosData, nganhsData, vungPhanBoData]) => {
            setHos(hosData.hos);
            setNganhs(nganhsData);
            setVungPhanBos(vungPhanBoData);
            setFilteredHos(hosData.hos);
        }).catch(console.error);
    }, []);

    // Filter hos based on selected nganh
    useEffect(() => {
        if (filters.ten_nganh_khoa_hoc) {
            const filtered = hos.filter(ho => ho.ten_nganh_khoa_hoc === filters.ten_nganh_khoa_hoc);
            setFilteredHos(filtered);
            
            // Reset ho selection if current ho doesn't belong to selected nganh
            if (filters.ten_ho_khoa_hoc) {
                const currentHoExists = filtered.some(ho => ho.ten_khoa_hoc === filters.ten_ho_khoa_hoc);
                if (!currentHoExists) {
                    setFilters(prev => ({ ...prev, ten_ho_khoa_hoc: '', page: 1 }));
                }
            }
        } else {
            setFilteredHos(hos);
        }
    }, [filters.ten_nganh_khoa_hoc, hos]);

    const fetchLoais = useCallback(async () => {
        setLoading(true);
        try {
            const response = await loadLoais(filters);
            setLoais(response.loais);
            setTotal(response.total);
            if (response.pages) setTotalPages(response.pages);
        } catch (error) {
            console.error('Error loading loais:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchLoais();
    }, [fetchLoais]);

    const handleCreateLoai = () => {
        setEditingLoai(null);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditLoai = (loai: Loai) => {
        setEditingLoai(loai);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewLoai = (loai: Loai) => {
        setEditingLoai(loai);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleDeleteLoai = async (loaiId: number) => {
        if (window.confirm('Are you sure you want to delete this loai?')) {
            try {
                await deleteLoai(loaiId);
                fetchLoais();
            } catch (error) {
                console.error('Error deleting loai:', error);
                setErrorMessage('Failed to delete loai');
            }
        }
    };

    const handleModalSuccess = () => {
        fetchLoais();
    };

    const handleFilterChange = (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined,
            page: 1
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            ten_ho_khoa_hoc: '',
            ten_nganh_khoa_hoc: '',
            vung_phan_bo: '',
            page: 1,
            limit: 10
        });
        setSearchInput('');
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const hasActiveFilters = filters.search || filters.ten_ho_khoa_hoc || filters.ten_nganh_khoa_hoc || filters.vung_phan_bo;

    return {
        handleCreateLoai,
        setSearchInput,
        handleFilterChange,
        clearFilters,
        formatDate,
        handleEditLoai,
        handleViewLoai,
        handleDeleteLoai,
        setShowModal,
        handleModalSuccess,
        setFilters,
        searchInput,
        filters,
        total,
        loading,
        loais,
        hos,
        nganhs,
        vungPhanBos,
        filteredHos,
        totalPages,
        showModal,
        editingLoai,
        hasActiveFilters,
        isViewMode,
        displayMode,
        setDisplayMode,
        errorMessage,
        setErrorMessage,
    }
}