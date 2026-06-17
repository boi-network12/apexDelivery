'use client';

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContextType, AuthState } from '@/types/user';
import { API } from '@/config/api';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  
  // Store the email being used for login
  const [loginEmail, setLoginEmail] = useState<string>('');

  const fetchUser = useCallback(async () => {
    try {
      const token = authState.token || localStorage.getItem('token');
      if (!token) {
        setAuthState({ user: null, token: null, isAuthenticated: false });
        return;
      }

      const response = await axios.get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { userInfo } = response.data;
      setAuthState({ user: userInfo, token, isAuthenticated: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setAuthState({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('loginEmail');
        }
      }
    }
  }, [authState.token]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('loginEmail');

    if (storedUser && storedToken) {
      setAuthState({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
      });
      if (storedEmail) {
        setLoginEmail(storedEmail);
      }
      fetchUser();
    }
  }, [fetchUser]);

  useEffect(() => {
    if (authState.user && authState.token) {
      localStorage.setItem('user', JSON.stringify(authState.user));
      localStorage.setItem('token', authState.token);
      if (loginEmail) {
        localStorage.setItem('loginEmail', loginEmail);
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('loginEmail');
    }
  }, [authState, loginEmail]);

  // Request OTP with email
  const requestOtp = async (email: string) => {
    try {
      const response = await axios.post(`${API}/api/users/request-otp`, { email });
      setLoginEmail(email);
      return { success: true, message: response.data.message };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to request OTP',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  };

  // Verify OTP with email
  const verifyOtp = async (code: string, email: string) => {
    try {
      const response = await axios.post(`${API}/api/users/verify-otp`, { code, email });
      const { token, userInfo } = response.data;

      setAuthState({
        user: userInfo,
        token,
        isAuthenticated: true,
      });

      return { success: true, message: 'Verification successful!' };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || 'An error occurred',
        };
      }
      return { success: false, message: 'Unexpected error occurred' };
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    setLoginEmail('');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginEmail");
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      setAuthState, 
      logout, 
      fetchUser, 
      verifyOtp, 
      requestOtp,
      loginEmail,
      setLoginEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};