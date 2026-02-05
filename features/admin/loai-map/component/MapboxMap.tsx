'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { VungPhanBoMapData, LoaiWithCoordinates } from '../types/loai-map';
import { VIETNAM_CENTER, DEFAULT_ZOOM } from '../hook/useLoaiMapView';

// Set your Mapbox access token here
// You can get one from https://account.mapbox.com/access-tokens/
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// Color mapping for rarity levels
const RARITY_COLORS: Record<string, string> = {
  'THAP': '#22c55e',
  'TRUNG_BINH': '#eab308',
  'CAO': '#f97316',
  'RAT_CAO': '#ef4444',
};

interface MapboxMapProps {
  vungPhanBos: VungPhanBoMapData[];
  selectedVungPhanBo: VungPhanBoMapData | null;
  loais: LoaiWithCoordinates[];
  selectedLoai: LoaiWithCoordinates | null;
  onSelectVungPhanBo: (vung: VungPhanBoMapData | null) => void;
  onSelectLoai: (loai: LoaiWithCoordinates | null) => void;
}

function MapboxMapComponent({
  vungPhanBos,
  selectedVungPhanBo,
  loais,
  selectedLoai,
  onSelectVungPhanBo,
  onSelectLoai,
}: MapboxMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [VIETNAM_CENTER[1], VIETNAM_CENTER[0]], // Mapbox uses [lng, lat]
      zoom: DEFAULT_ZOOM,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding sources and layers
    map.on('load', () => {
      // Add empty source for polygons
      map.addSource('vung-phan-bo', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add fill layer for polygons
      map.addLayer({
        id: 'vung-phan-bo-fill',
        type: 'fill',
        source: 'vung-phan-bo',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': ['case', ['get', 'isSelected'], 0.3, 0.1],
        },
      });

      // Add outline layer for polygons
      map.addLayer({
        id: 'vung-phan-bo-outline',
        type: 'line',
        source: 'vung-phan-bo',
        paint: {
          'line-color': ['case', ['get', 'isSelected'], '#d81d1d', '#e63c3c'],
          'line-width': ['case', ['get', 'isSelected'], 4, 2],
          'line-dasharray': [2, 2],
        },
      });

      // Handle click on polygon (skip if already selected to allow marker clicks)
      map.on('click', 'vung-phan-bo-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const vungId = feature.properties?.id;
          const isAlreadySelected = feature.properties?.isSelected;
          
          // Skip if this polygon is already selected
          if (isAlreadySelected) return;
          
          const vung = vungPhanBos.find(v => v.id === vungId);
          if (vung) {
            onSelectVungPhanBo(vung);
          }
        }
      });

      // Change cursor on hover
      map.on('mouseenter', 'vung-phan-bo-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'vung-phan-bo-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      // Show tooltip on hover
      map.on('mousemove', 'vung-phan-bo-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const name = feature.properties?.name;
          
          if (popupRef.current) {
            popupRef.current.remove();
          }
          
          popupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'polygon-tooltip',
          })
            .setLngLat(e.lngLat)
            .setHTML(`<div class="px-2 py-1 text-sm font-medium text-gray-700">${name}</div>`)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'vung-phan-bo-fill', () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update polygon click handler when vungPhanBos changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Remove existing click handler and add new one
    map.off('click', 'vung-phan-bo-fill', () => {});
    
    const clickHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const vungId = feature.properties?.id;
        
        // Skip if this polygon is already selected to allow marker clicks
        if (feature.properties?.isSelected) return;
        
        const vung = vungPhanBos.find(v => v.id === vungId);
        if (vung) {
          onSelectVungPhanBo(vung);
        }
      }
    };
    
    if (map.getLayer('vung-phan-bo-fill')) {
      map.on('click', 'vung-phan-bo-fill', clickHandler);
    }
  }, [vungPhanBos, onSelectVungPhanBo]);

  // Draw vung-phan-bo polygons
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Wait for map style to load
    const updateSource = () => {
      const source = map.getSource('vung-phan-bo') as mapboxgl.GeoJSONSource;
      if (!source) return;

      const features = vungPhanBos
        .filter(vung => vung.danh_sach_diem_bien && vung.danh_sach_diem_bien.length >= 3)
        .map(vung => ({
          type: 'Feature' as const,
          properties: {
            id: vung.id,
            name: vung.ten_dia_phan_hanh_chinh,
            isSelected: selectedVungPhanBo?.id === vung.id,
          },
          geometry: {
            type: 'Polygon' as const,
            // Swap coordinates: data is [lat, lon], Mapbox expects [lng, lat]
            coordinates: [vung.danh_sach_diem_bien!.map(point => [point[1], point[0]])],
          },
        }));

      source.setData({
        type: 'FeatureCollection',
        features,
      });
    };

    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.on('load', updateSource);
    }
  }, [vungPhanBos, selectedVungPhanBo]);

  // Zoom to selected polygon
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (selectedVungPhanBo) {
      if (selectedVungPhanBo.danh_sach_diem_bien && selectedVungPhanBo.danh_sach_diem_bien.length >= 3) {
        // Calculate bounds from polygon points
        // Swap coordinates: data is [lat, lon], Mapbox expects [lng, lat]
        const bounds = new mapboxgl.LngLatBounds();
        selectedVungPhanBo.danh_sach_diem_bien.forEach(point => {
          bounds.extend([point[1], point[0]]);
        });
        map.fitBounds(bounds, { padding: 50 });
      } else if (selectedVungPhanBo.center) {
        // Swap coordinates: data is [lat, lon], Mapbox expects [lng, lat]
        map.flyTo({
          center: [selectedVungPhanBo.center[1], selectedVungPhanBo.center[0]],
          zoom: 10,
        });
      }
    } else {
      // Reset to default view when deselected
      map.flyTo({
        center: [VIETNAM_CENTER[1], VIETNAM_CENTER[0]],
        zoom: DEFAULT_ZOOM,
      });
    }
  }, [selectedVungPhanBo]);

  // Draw loai markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    loais.forEach((loai) => {
      loai.vi_tri_dia_li.forEach((viTri) => {
        const color = RARITY_COLORS[loai.dac_diem_sinh_hoc?.muc_do_quy_hiem || 'THAP'];
        
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'mapbox-marker';
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';

        // Create popup content
        const popupContent = `
          <div class="p-2">
            <h4 class="font-semibold text-gray-900 text-sm">${loai.ten_khoa_hoc}</h4>
            ${loai.ten_tieng_viet ? `<p class="text-xs text-gray-600">${loai.ten_tieng_viet}</p>` : ''}
            <p class="text-xs mt-1">
              <span class="inline-block px-2 py-0.5 rounded-full text-white text-xs" style="background-color: ${color}">
                ${getRarityLabel(loai.dac_diem_sinh_hoc?.muc_do_quy_hiem)}
              </span>
            </p>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          className: 'loai-popup',
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([viTri.kinh_do, viTri.vi_do])
          .setPopup(popup)
          .addTo(map);

        // Handle click on marker
        el.addEventListener('click', () => {
          onSelectLoai(loai);
        });

        markersRef.current.push(marker);
      });
    });
  }, [loais, onSelectLoai]);

  // Zoom to selected loai
  useEffect(() => {
    if (selectedLoai && mapRef.current && selectedLoai.vi_tri_dia_li.length > 0) {
      const firstViTri = selectedLoai.vi_tri_dia_li[0];
      mapRef.current.flyTo({
        center: [firstViTri.kinh_do, firstViTri.vi_do],
        zoom: 12,
      });
    }
  }, [selectedLoai]);

  return (
    <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
  );
}

function getRarityLabel(mucDo: string | undefined): string {
  switch (mucDo) {
    case 'RAT_CAO': return 'Rất cao';
    case 'CAO': return 'Cao';
    case 'TRUNG_BINH': return 'Trung bình';
    default: return 'Thấp';
  }
}

// Use dynamic import with SSR disabled since Mapbox requires window
const MapboxMap = dynamic(() => Promise.resolve(MapboxMapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default MapboxMap;
