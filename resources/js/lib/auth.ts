export interface AuthUser {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  profile_photo_path?: string | null;
}

export interface AuthData {
  user: AuthUser | null;
  permissions: string[];
  primaryRole: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  primaryRole: string;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isAuthenticated: boolean;
}