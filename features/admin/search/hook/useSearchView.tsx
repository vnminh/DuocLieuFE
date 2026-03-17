'use client'

import { useCallback, useEffect, useState } from 'react';
import { loadLoais, deleteLoai } from '@/lib/api/loais';
import { loadHos, loadAllHos, deleteHo } from '@/lib/api/hos';
import { loadNganhs, loadAllNganhs, deleteNganh } from '@/lib/api/nganhs';
import { loadAllVungPhanBos } from '@/lib/api/vung-phan-bo';
import { Loai } from '@/types/loais';
import { Ho } from '@/types/hos';
import { Nganh } from '@/types/nganhs';
import { VungPhanBo } from '@/types/vung-phan-bo';

export type SearchType = 'loais' | 'hos' | 'nganhs';

export function useSearchView() {
  const [searchType, setSearchType] = useState<SearchType>('loais');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Results for each type
  const [loais, setLoais] = useState<Loai[]>([]);
  const [hos, setHos] = useState<Ho[]>([]);
  const [nganhs, setNganhs] = useState<Nganh[]>([]);

  // Filter dropdown data
  const [allNganhs, setAllNganhs] = useState<Nganh[]>([]);
  const [allHos, setAllHos] = useState<Ho[]>([]);
  const [filteredHos, setFilteredHos] = useState<Ho[]>([]);
  const [allVungPhanBos, setAllVungPhanBos] = useState<VungPhanBo[]>([]);

  // Filter states
  const [filterNganh, setFilterNganh] = useState('');
  const [filterHo, setFilterHo] = useState('');
  const [filterVungPhanBo, setFilterVungPhanBo] = useState('');

  // Modal states
  const [showLoaiModal, setShowLoaiModal] = useState(false);
  const [showHoModal, setShowHoModal] = useState(false);
  const [showNganhModal, setShowNganhModal] = useState(false);
  const [editingLoai, setEditingLoai] = useState<Loai | null>(null);
  const [editingHo, setEditingHo] = useState<Ho | null>(null);
  const [editingNganh, setEditingNganh] = useState<Nganh | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Load filter dropdown data
  useEffect(() => {
    Promise.all([
      loadAllNganhs(),
      loadAllHos(),
      loadAllVungPhanBos()
    ]).then(([nganhsData, hosData, vungPhanBoData]) => {
      setAllNganhs(nganhsData);
      setAllHos(hosData.hos);
      setFilteredHos(hosData.hos);
      setAllVungPhanBos(vungPhanBoData);
    }).catch(console.error);
  }, []);

  // Filter hos based on selected nganh (for loais search)
  useEffect(() => {
    if (filterNganh) {
      const filtered = allHos.filter(ho => ho.ten_nganh_khoa_hoc === filterNganh);
      setFilteredHos(filtered);
      // Reset ho filter if current ho doesn't belong to selected nganh
      if (filterHo) {
        const currentHoExists = filtered.some(ho => ho.ten_khoa_hoc === filterHo);
        if (!currentHoExists) {
          setFilterHo('');
        }
      }
    } else {
      setFilteredHos(allHos);
    }
  }, [filterNganh, allHos, filterHo]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page and filters when search type changes
  useEffect(() => {
    setPage(1);
    setFilterNganh('');
    setFilterHo('');
    setFilterVungPhanBo('');
  }, [searchType]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (searchType === 'loais') {
        const response = await loadLoais({
          search: debouncedSearch,
          ten_nganh_khoa_hoc: filterNganh || undefined,
          ten_ho_khoa_hoc: filterHo || undefined,
          vung_phan_bo: filterVungPhanBo || undefined,
          page,
          limit,
        });
        setLoais(response.loais);
        setTotal(response.total);
        setTotalPages(response.pages);
        setHos([]);
        setNganhs([]);
      } else if (searchType === 'hos') {
        const response = await loadHos({
          search: debouncedSearch,
          ten_nganh_khoa_hoc: filterNganh || undefined,
          page,
          limit,
        });
        setHos(response.hos);
        setTotal(response.total);
        setTotalPages(response.pages);
        setLoais([]);
        setNganhs([]);
      } else if (searchType === 'nganhs') {
        const response = await loadNganhs({
          search: debouncedSearch,
          page,
          limit,
        });
        setNganhs(response.nganhs);
        setTotal(response.total);
        setTotalPages(response.pages);
        setLoais([]);
        setHos([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  }, [searchType, debouncedSearch, filterNganh, filterHo, filterVungPhanBo, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setSearchInput('');
    setDebouncedSearch('');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleFilterChange = (filterName: 'nganh' | 'ho' | 'vungPhanBo') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPage(1);
    if (filterName === 'nganh') {
      setFilterNganh(value);
    } else if (filterName === 'ho') {
      setFilterHo(value);
    } else if (filterName === 'vungPhanBo') {
      setFilterVungPhanBo(value);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setFilterNganh('');
    setFilterHo('');
    setFilterVungPhanBo('');
    setPage(1);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getResultsCount = () => {
    if (searchType === 'loais') return loais.length;
    if (searchType === 'hos') return hos.length;
    return nganhs.length;
  };

  // Loai handlers
  const handleViewLoai = (loai: Loai) => {
    setEditingLoai(loai);
    setIsViewMode(true);
    setShowLoaiModal(true);
  };

  const handleEditLoai = (loai: Loai) => {
    setEditingLoai(loai);
    setIsViewMode(false);
    setShowLoaiModal(true);
  };

  const handleDeleteLoai = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loài này?')) {
      try {
        await deleteLoai(id);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi xóa loài:', error);
      }
    }
  };

  const handleLoaiModalSuccess = () => {
    setShowLoaiModal(false);
    setEditingLoai(null);
    fetchData();
  };

  // Ho handlers
  const handleViewHo = (ho: Ho) => {
    setEditingHo(ho);
    setIsViewMode(true);
    setShowHoModal(true);
  };

  const handleEditHo = (ho: Ho) => {
    setEditingHo(ho);
    setIsViewMode(false);
    setShowHoModal(true);
  };

  const handleDeleteHo = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa họ này?')) {
      try {
        await deleteHo(id);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi xóa họ:', error);
      }
    }
  };

  const handleHoModalSuccess = () => {
    setShowHoModal(false);
    setEditingHo(null);
    fetchData();
  };

  // Nganh handlers
  const handleViewNganh = (nganh: Nganh) => {
    setEditingNganh(nganh);
    setIsViewMode(true);
    setShowNganhModal(true);
  };

  const handleEditNganh = (nganh: Nganh) => {
    setEditingNganh(nganh);
    setIsViewMode(false);
    setShowNganhModal(true);
  };

  const handleDeleteNganh = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngành này?')) {
      try {
        await deleteNganh(id);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi xóa ngành:', error);
      }
    }
  };

  const handleNganhModalSuccess = () => {
    setShowNganhModal(false);
    setEditingNganh(null);
    fetchData();
  };

  const hasActiveFilters = searchInput || filterNganh || filterHo || filterVungPhanBo;

  return {
    searchType,
    searchInput,
    loading,
    page,
    limit,
    total,
    totalPages,
    loais,
    hos,
    nganhs,
    allNganhs,
    allHos,
    filteredHos,
    allVungPhanBos,
    filterNganh,
    filterHo,
    filterVungPhanBo,
    hasActiveFilters,
    // Modal states
    showLoaiModal,
    showHoModal,
    showNganhModal,
    editingLoai,
    editingHo,
    editingNganh,
    isViewMode,
    // Setters
    setSearchInput,
    setShowLoaiModal,
    setShowHoModal,
    setShowNganhModal,
    // Handlers
    handleSearchTypeChange,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    clearFilters,
    formatDate,
    getResultsCount,
    // Loai handlers
    handleViewLoai,
    handleEditLoai,
    handleDeleteLoai,
    handleLoaiModalSuccess,
    // Ho handlers
    handleViewHo,
    handleEditHo,
    handleDeleteHo,
    handleHoModalSuccess,
    // Nganh handlers
    handleViewNganh,
    handleEditNganh,
    handleDeleteNganh,
    handleNganhModalSuccess,
  };
}
