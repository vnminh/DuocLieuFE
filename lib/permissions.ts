import { UserRole } from '@/types/user';
import { cookieStorage } from './cookieStorage';

export interface RolePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  canEditUsers: boolean;
  canAddUsers: boolean;
  canDeleteUsers: boolean;
}

export function getPermissions(role?: UserRole): RolePermissions {
  switch (role) {
    case UserRole.ADMIN:
      return { canView: true, canEdit: true, canDelete: true, canAdd: true, canEditUsers: true, canAddUsers: true, canDeleteUsers: true };
    case UserRole.STAFF:
      return { canView: true, canEdit: true, canDelete: false, canAdd: true, canEditUsers: false, canAddUsers: false, canDeleteUsers: false };
    case UserRole.USER:
      return { canView: true, canEdit: false, canDelete: false, canAdd: false, canEditUsers: false, canAddUsers: false, canDeleteUsers: false };
    default:
      return { canView: true, canEdit: false, canDelete: false, canAdd: false, canEditUsers: false, canAddUsers: false, canDeleteUsers: false };
  }
}

export function usePermissions(): RolePermissions {
  const user = cookieStorage.getUser();
  return getPermissions(user?.role);
}
