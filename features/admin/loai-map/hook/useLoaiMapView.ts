'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadMapData, loadLoaisWithCoordinates } from '@/lib/api/loai-map';
import { getLoaiById } from '@/lib/api/loais';
import {
  VungPhanBoMapData,
  LoaiWithCoordinates,
} from '../types/loai-map';
import { Loai } from '@/types/loais';

// Default center for Vietnam
export const VIETNAM_CENTER: [number, number] = [14.0, 108.0]; // [lat, lng] for Leaflet
export const DEFAULT_ZOOM = 6;

export function useLoaiMapView() {
  const [vungPhanBos, setVungPhanBos] = useState<VungPhanBoMapData[]>([]);
  const [selectedVungPhanBo, setSelectedVungPhanBo] = useState<VungPhanBoMapData | null>(null);
  const [loais, setLoais] = useState<LoaiWithCoordinates[]>([]);
  const [selectedLoai, setSelectedLoai] = useState<LoaiWithCoordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLoais, setLoadingLoais] = useState(false);

  // Modal states for loai detail
  const [showLoaiModal, setShowLoaiModal] = useState(false);
  const [viewingLoai, setViewingLoai] = useState<Loai | null>(null);
  const [loadingLoaiDetail, setLoadingLoaiDetail] = useState(false);

  // Load initial map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await loadMapData();
        setVungPhanBos(data);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Handle selecting a vung-phan-bo
  const handleSelectVungPhanBo = useCallback(async (vung: VungPhanBoMapData | null) => {
    setSelectedVungPhanBo(vung);
    setSelectedLoai(null);

    if (vung) {
      setLoadingLoais(true);
      try {
        const result = await loadLoaisWithCoordinates(vung.id);
        setLoais(result.loais);
      } catch (error) {
        console.error('Error loading loais:', error);
        setLoais([]);
      } finally {
        setLoadingLoais(false);
      }
    } else {
      setLoais([]);
    }
  }, []);

  // Handle clicking on a loai in the sidebar or map
  const handleSelectLoai = useCallback((loai: LoaiWithCoordinates | null) => {
    setSelectedLoai(loai);
  }, []);

  // Close popup
  const closePopup = useCallback(() => {
    setSelectedLoai(null);
  }, []);

  // Handle viewing loai detail (fetch full loai data and show modal)
  const handleViewLoaiDetail = useCallback(async (loai: LoaiWithCoordinates) => {
    setLoadingLoaiDetail(true);
    try {
      console.log('[DEBUG] LoaiId clicked', loai.id)
      const fullLoai = await getLoaiById(loai.id);
      setViewingLoai(fullLoai);
      setShowLoaiModal(true);
    } catch (error) {
      console.error('Error loading loai detail:', error);
    } finally {
      setLoadingLoaiDetail(false);
    }
  }, []);

  // Close loai modal
  const closeLoaiModal = useCallback(() => {
    setShowLoaiModal(false);
    setViewingLoai(null);
  }, []);

  return {
    vungPhanBos,
    selectedVungPhanBo,
    loais,
    selectedLoai,
    loading,
    loadingLoais,
    handleSelectVungPhanBo,
    handleSelectLoai,
    closePopup,
    // Modal states
    showLoaiModal,
    viewingLoai,
    loadingLoaiDetail,
    handleViewLoaiDetail,
    closeLoaiModal,
  };
}
