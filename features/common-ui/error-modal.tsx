'use client';

import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export function ErrorModal({ isOpen, onClose, message, title = 'Error' }: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">{message}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onClose}>
          OK
        </Button>
      </div>
    </Modal>
  );
}
