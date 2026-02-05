'use client'

import { getLoaiDetail, getLoaiImageCount, getLoaiImageUrl } from '@/lib/api/loais';
import { Loai } from '@/types/loais';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useLoaisDetailView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loaiId = Number(searchParams.get('id'));

  const [loai, setLoai] = useState<Loai | null>(null);
  const [imageCount, setImageCount] = useState(0);
  const [collectionUri, setCollectionUri] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const loaiData = await getLoaiDetail(loaiId);
        setLoai(loaiData);

        const imageData = await getLoaiImageCount(loaiId);
        setImageCount(imageData.count);
        setCollectionUri(imageData.collection_uri);

        const initialLoadStates: Record<number, 'loading' | 'loaded' | 'error'> = {};
        for (let i = 0; i < imageData.count; i++) {
          initialLoadStates[i] = 'loading';
        }
        setImageLoadStates(initialLoadStates);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loaiId) {
      fetchData();
    }
  }, [loaiId]);

  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'loaded' }));
  };

  const handleImageError = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
  };

  const handleRefresh = async () => {
    setLoadingImages(true);
    try {
      const imageData = await getLoaiImageCount(loaiId);
      setImageCount(imageData.count);
      setCollectionUri(imageData.collection_uri);

      const initialLoadStates: Record<number, 'loading' | 'loaded' | 'error'> = {};
      for (let i = 0; i < imageData.count; i++) {
        initialLoadStates[i] = 'loading';
      }
      setImageLoadStates(initialLoadStates);
    } catch (error) {
      console.error('Error refreshing images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getImageUrl = (index: number) => {
    return getLoaiImageUrl(loaiId, index);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(prev => (prev !== null && prev < imageCount - 1 ? prev + 1 : prev));
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return {
    loai,
    imageCount,
    collectionUri,
    loading,
    loadingImages,
    imageLoadStates,
    selectedImage,
    setSelectedImage,
    handleImageLoad,
    handleImageError,
    handleRefresh,
    handleBack,
    getImageUrl,
    handlePrevImage,
    handleNextImage,
    closeLightbox,
  };
}
