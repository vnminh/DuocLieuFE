'use client'

import { getLoaiDetail, getLoaiImageUrl, uploadLoaiPreviewImage, deleteLoaiPreviewImage } from '@/lib/api/loais-detail';
import { Loai } from '@/types/loais';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useLoaisDetailView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loaiId = Number(searchParams.get('id'));

  const [loai, setLoai] = useState<Loai | null>(null);
  const [imageCount, setImageCount] = useState(0);
  const [collectionUri, setCollectionUri] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [imageStatus, setImageStatus] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const loaiData = await getLoaiDetail(loaiId);
        setLoai(loaiData);

        const count = loaiData.hinh_anh?.so_luong_anh_preview ?? 0;
        const uri = loaiData.hinh_anh?.collection_uri ?? '';
        setImageCount(count);
        setCollectionUri(uri);
        setImageStatus({});
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

  const handleImageError = (index: number) => {
    setImageStatus(prev => ({ ...prev, [index]: false }));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const loaiData = await getLoaiDetail(loaiId);
      setLoai(loaiData);

      const count = loaiData.hinh_anh?.so_luong_anh_preview ?? 0;
      const uri = loaiData.hinh_anh?.collection_uri ?? '';
      setImageCount(count);
      setCollectionUri(uri);
      setImageStatus({});
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getImageUrl = (index: number) => {
    if (!loai) return '';
    return getLoaiImageUrl(loai.id, index);
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !loai) return;

    setUploading(true);
    try {
      const result = await uploadLoaiPreviewImage(loai.id, file);
      setImageCount(result.count);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!loai) return;

    if (!confirm(`Are you sure you want to delete image ${index + 1}?`)) {
      return;
    }

    setDeleting(index);
    try {
      const result = await deleteLoaiPreviewImage(loai.id, index);
      setImageCount(result.count);
      setImageStatus({});
      // Close lightbox if viewing deleted image
      if (selectedImage === index) {
        setSelectedImage(null);
      } else if (selectedImage !== null && selectedImage > index) {
        setSelectedImage(selectedImage - 1);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setErrorMessage('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  return {
    loai,
    imageCount,
    collectionUri,
    loading,
    uploading,
    deleting,
    imageStatus,
    selectedImage,
    fileInputRef,
    setSelectedImage,
    handleImageError,
    handleRefresh,
    handleBack,
    getImageUrl,
    handlePrevImage,
    handleNextImage,
    closeLightbox,
    handleUploadClick,
    handleFileChange,
    handleDeleteImage,
    errorMessage,
    setErrorMessage,
  };
}
