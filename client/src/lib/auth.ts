import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    
    return data;
  },

  async verify(): Promise<{ valid: boolean; user?: AuthUser }> {
    try {
      const response = await apiRequest("POST", "/api/auth/verify");
      return await response.json();
    } catch (error) {
      return { valid: false };
    }
  },

  logout(): void {
    localStorage.removeItem("auth_token");
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
