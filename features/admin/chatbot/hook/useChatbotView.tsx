'use client'

import { useState, useRef } from 'react';
import { ChatMessage, sendMessage, sendMessageWithImage, uploadChatImage } from '@/lib/api/chatbot';

export function useChatbotView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // Create preview URL
    const result = await uploadChatImage(file);
    setImagePreview(result.imageUrl);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      imageUrl: imagePreview || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      let response;
      if (selectedImage) {
        response = await sendMessageWithImage(inputValue, selectedImage);
      } else {
        response = await sendMessage(inputValue);
      }

      if (response.success) {
        setMessages(prev => [...prev, response.message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      handleRemoveImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return {
    messages,
    inputValue,
    selectedImage,
    imagePreview,
    loading,
    fileInputRef,
    setInputValue,
    handleImageSelect,
    handleRemoveImage,
    handleSendMessage,
    handleKeyDown,
    handleUploadClick,
  };
}
