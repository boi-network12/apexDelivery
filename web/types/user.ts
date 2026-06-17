export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  ipAddress: string;
  lastLogin: string;
  isVerified?: boolean;
}

export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  ipAddress?: string;
  lastLogin?: Date;
  isVerified?: boolean;
}

export interface AuthContextType {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  verifyOtp: (code: string, email: string) => Promise<{ success: boolean; message: string }>;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
}
