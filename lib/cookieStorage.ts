/**
 * Cookie Storage Utility for User Authentication
 * Manages user session data in browser cookies
 */

import { User, UserRole } from '@/types/user';

export interface StoredUserData {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  status: string;
  avatar?: string;
}

class CookieStorage {
  private userCookieName = 'auth_user';
  private tokenCookieName = 'auth_token';
  private cookieOptions = {
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  /**
   * Set user data in cookies
   */
  setUser(user: User, token?: string): void {
    const userData: StoredUserData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    };

    // Set user data cookie
    this.setCookie(this.userCookieName, JSON.stringify(userData));

    // Set token cookie if provided
    if (token) {
      this.setToken(token);
    }
  }

  /**
   * Get user data from cookies
   */
  getUser(): StoredUserData | null {
    const userStr = this.getCookie(this.userCookieName);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user cookie:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.setCookie(this.tokenCookieName, token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.getCookie(this.tokenCookieName);
  }

  /**
   * Clear all authentication data
   */
  logout(): void {
    this.deleteCookie(this.userCookieName);
    this.deleteCookie(this.tokenCookieName);
  }

  /**
   * Update user data without clearing token
   */
  updateUser(userData: Partial<StoredUserData>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      this.setUser({ ...currentUser, ...userData } as User);
    }
  }

  /**
   * Set a cookie
   */
  private setCookie(name: string, value: string): void {
    try {
      // Format: name=value; path=/; max-age=604800; SameSite=Lax
      let cookieString = `${name}=${encodeURIComponent(value)}`;
      cookieString += `; path=${this.cookieOptions.path}`;
      cookieString += `; max-age=${this.cookieOptions.maxAge}`;
      cookieString += '; SameSite=Lax';

      if (typeof document !== 'undefined') {
        document.cookie = cookieString;
      }
    } catch (error) {
      console.error('Failed to set cookie:', error);
    }
  }

  /**
   * Get a cookie value
   */
  private getCookie(name: string): string | null {
    try {
      if (typeof document === 'undefined') {
        return null;
      }

      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(';');

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get cookie:', error);
      return null;
    }
  }

  /**
   * Delete a cookie
   */
  private deleteCookie(name: string): void {
    try {
      if (typeof document !== 'undefined') {
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch (error) {
      console.error('Failed to delete cookie:', error);
    }
  }
}

// Export singleton instance
export const cookieStorage = new CookieStorage();

// Export class for testing
export default CookieStorage;
