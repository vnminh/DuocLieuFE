'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadMapData, loadLoaisWithCoordinates } from '@/lib/api/loai-map';
import {
  VungPhanBoMapData,
  LoaiWithCoordinates,
} from '../types/loai-map';

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
  };
}
