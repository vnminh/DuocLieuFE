'use client';

import React from 'react';
import { Button } from '@/features/common-ui/button';
import { Badge } from '@/features/common-ui/badge';
import { Loai } from '@/types/loais';
import { Eye, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';

interface LoaiCardProps {
  loai: Loai;
  onView: (loai: Loai) => void;
  onEdit: (loai: Loai) => void;
  onDelete: (id: number) => void;
  formatDate: (date: Date) => string;
}

export function LoaiCard({ loai, onView, onEdit, onDelete, formatDate }: LoaiCardProps) {
  const { canEdit, canDelete } = usePermissions();
  const getMucDoQuyHiemBadge = (mucDo: string | undefined) => {
    switch (mucDo) {
      case 'RAT_CAO':
        return <Badge variant="danger">Rarity: Very High</Badge>;
      case 'CAO':
        return <Badge variant="warning">Rarity: High</Badge>;
      case 'TRUNG_BINH':
        return <Badge variant="info">Rarity: Medium</Badge>;
      default:
        return <Badge variant="success">Rarity: Low</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Card Header */}
      <div className="p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 text-lg truncate" title={loai.ten_khoa_hoc}>
          {loai.ten_khoa_hoc}
        </h3>
        {loai.ten_tieng_viet && (
          <p className="text-sm text-gray-600 truncate" title={loai.ten_tieng_viet}>
            {loai.ten_tieng_viet}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1">
        {/* Alternative Name */}
        {loai.ten_goi_khac && (
          <div>
            <span className="text-xs text-gray-500">Alternative Name:</span>
            <p className="text-sm text-gray-700 truncate">{loai.ten_goi_khac}</p>
          </div>
        )}

        {/* Taxonomy Info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{loai.ten_ho_khoa_hoc}</Badge>
          {loai.ho?.nganh?.ten_khoa_hoc && (
            <Badge variant="success">{loai.ho.nganh.ten_khoa_hoc}</Badge>
          )}
        </div>

        {/* Rarity Level */}
        {loai.dac_diem_sinh_hoc?.muc_do_quy_hiem && (
          <div>
            {getMucDoQuyHiemBadge(loai.dac_diem_sinh_hoc.muc_do_quy_hiem)}
          </div>
        )}

        {/* Location Count */}
        {loai.vi_tri_dia_li && loai.vi_tri_dia_li.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {loai.vi_tri_dia_li.length} location(s)
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          Created: {formatDate(loai.created_at)}
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="p-4 bg-gray-50 flex justify-end space-x-2 mt-auto">
        <Button size="sm" variant="secondary" onClick={() => onView(loai)}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        {canEdit && (
          <Button size="sm" variant="primary" onClick={() => onEdit(loai)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
        {canDelete && (
          <Button size="sm" variant="danger" onClick={() => onDelete(loai.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
