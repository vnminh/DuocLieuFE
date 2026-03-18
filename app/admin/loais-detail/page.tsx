'use client';

import { Suspense } from 'react';
import LoaisDetailView from '@/features/admin/loais-detail/pages/loaisDetailView';

export default function LoaisDetailPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoaisDetailView />
    </Suspense>
  );
}
