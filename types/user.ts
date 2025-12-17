export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum VerificationPurpose {
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION'
}

export enum UserRole {
  USER='USER',
  STAFF='STAFF',
  ADMIN='ADMIN'
}
export interface User {
  id: number;
  full_name: string;
  email: string;
  password?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: string;
  avatar?: string;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
  role: UserRole;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}


export interface UserFilters {
  search?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  address?: string;
  date_of_birth?: Date;
  gender?: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: string;
  avatar?: string;
  status?: UserStatus;
  role: UserRole;
}