import {
  LayoutDashboard,
  Users,
  Filter,
  Heart,
  Layers,
  Settings,
  MapPin,
  Map,
  Search,
  MessageCircle,
  LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/types/user';

export interface AdminRoute {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  roles: UserRole[];
}

export const adminRoutes: AdminRoute[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Tổng quan hệ thống',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Tìm kiếm',
    href: '/admin/search',
    icon: Search,
    description: 'Tìm kiếm tổng hợp',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Chatbot',
    href: '/admin/chatbot',
    icon: MessageCircle,
    description: 'AI Chatbot',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Người dùng',
    href: '/admin/users',
    icon: Users,
    description: 'Quản lý người dùng',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Ngành',
    href: '/admin/nganhs',
    icon: Filter,
    description: 'Quản lý ngành',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Họ',
    href: '/admin/hos',
    icon: Heart,
    description: 'Quản lý họ',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Loài',
    href: '/admin/loais',
    icon: Layers,
    description: 'Quản lý loài',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Vùng Phân Bố',
    href: '/admin/vung-phan-bo',
    icon: MapPin,
    description: 'Quản lý vùng phân bố',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Bản đồ',
    href: '/admin/loai-map',
    icon: Map,
    description: 'Quản lý bản đồ loài',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
    description: 'Cài đặt',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
];

export function getRoutesForRole(role: UserRole): AdminRoute[] {
  return adminRoutes.filter(route => route.roles.includes(role));
}
