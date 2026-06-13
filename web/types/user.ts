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
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  verifyOtp: (code: string) => Promise<VerifyOtpResult>; 
  requestOtp: () => Promise<VerifyOtpResult>;
}
