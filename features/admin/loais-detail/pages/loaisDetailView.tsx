'use client';

import React from 'react';
import { ArrowLeft, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/features/common-ui/button';
import { useLoaisDetailView } from '../hook/useLoaisDetailView';

export default function LoaisDetailView() {
  const {
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
  } = useLoaisDetailView();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
            {loai && (
              <p className="text-gray-600">
                {loai.ten_khoa_hoc}
                {loai.ten_tieng_viet && ` - ${loai.ten_tieng_viet}`}
              </p>
            )}
          </div>
        </div>
        <Button variant="secondary" onClick={handleRefresh} disabled={loadingImages}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loadingImages ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Collection Info */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Collection Path</p>
            <p className="font-mono text-sm text-gray-800">{collectionUri || 'Not configured'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Images</p>
            <p className="text-2xl font-bold text-blue-600">{imageCount}</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {imageCount === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Found</h3>
          <p className="text-gray-600">
            {collectionUri
              ? 'The image collection folder is empty or the path is invalid.'
              : 'No image collection URI has been configured for this loai.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: imageCount }, (_, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              onClick={() => setSelectedImage(index)}
            >
              {imageLoadStates[index] === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {imageLoadStates[index] === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">Failed to load</span>
                  </div>
                </div>
              )}
              <img
                src={getImageUrl(index)}
                alt={`${loai?.ten_khoa_hoc || 'Loai'} - Image ${index + 1}`}
                className={`w-full h-full object-cover ${imageLoadStates[index] === 'loaded' ? '' : 'invisible'}`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl"
            onClick={closeLightbox}
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl disabled:opacity-30"
            onClick={handlePrevImage}
            disabled={selectedImage === 0}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl disabled:opacity-30"
            onClick={handleNextImage}
            disabled={selectedImage === imageCount - 1}
          >
            ›
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageUrl(selectedImage)}
              alt={`${loai?.ten_khoa_hoc || 'Loai'} - Image ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} / {imageCount}
          </div>
        </div>
      )}
    </div>
  );
}
