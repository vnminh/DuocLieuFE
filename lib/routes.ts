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
    description: 'Overview and statistics',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Search',
    href: '/admin/search',
    icon: Search,
    description: 'Search loais, hos, and nganhs',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Chatbot',
    href: '/admin/chatbot',
    icon: MessageCircle,
    description: 'AI Chatbot assistant',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Nganhs',
    href: '/admin/nganhs',
    icon: Filter,
    description: 'Manage nganhs',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Hos',
    href: '/admin/hos',
    icon: Heart,
    description: 'Manage hos',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Loais',
    href: '/admin/loais',
    icon: Layers,
    description: 'Manage loais',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Vùng Phân Bố',
    href: '/admin/vung-phan-bo',
    icon: MapPin,
    description: 'Manage vùng phân bố',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    name: 'Loai Map',
    href: '/admin/loai-map',
    icon: Map,
    description: 'Manage loai map',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System settings',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.USER],
  },
];

export function getRoutesForRole(role: UserRole): AdminRoute[] {
  return adminRoutes.filter(route => route.roles.includes(role));
}
