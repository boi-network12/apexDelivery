'use client';

import { useAuth } from '@/context/AuthContext';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Auth = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true); // Show email input initially

  const { verifyOtp, fetchUser, authState, requestOtp, loginEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState.token && !authState.user) {
      fetchUser();
    }
  }, [authState.token, authState.user, fetchUser]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, authState.user, router]);

  // Pre-fill email if it was previously used
  useEffect(() => {
    if (loginEmail) {
      setEmail(loginEmail);
    }
  }, [loginEmail]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoadingRequest(true);

    if (!email) {
      setError('Please enter your email address');
      setLoadingRequest(false);
      return;
    }

    const result = await requestOtp(email);
    setLoadingRequest(false);

    if (result.success) {
      setMessage(result.message);
      setShowEmailInput(false); // Hide email input after successful request
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoadingVerify(true);

    if (!email) {
      setError('Email is required');
      setLoadingVerify(false);
      return;
    }

    const result = await verifyOtp(code, email);
    setLoadingVerify(false);

    if (result.success) {
      setMessage(result.message);
      setCode('');
      router.push('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleBackToEmail = () => {
    setShowEmailInput(true);
    setError('');
    setMessage('');
  };

  const renderEmailInput = () => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center drop-shadow">
        📧 Enter Your Email
      </h2>
      <form onSubmit={handleRequestOtp} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
          className="w-full p-4 text-lg rounded-xl border border-gray-300 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
          outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loadingRequest}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
          text-white py-3 rounded-xl font-semibold flex items-center justify-center 
          hover:opacity-90 transition disabled:opacity-60"
        >
          {loadingRequest ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            <Mail className="mr-2 h-5 w-5" />
          )}
          {loadingRequest ? 'Requesting...' : 'Request OTP'}
        </button>
      </form>
    </div>
  );

  const renderVerifyOtp = () => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
      <h2 className="text-3xl font-extrabold text-white mb-2 text-center drop-shadow">
        🔐 Verify Your Email
      </h2>
      <p className="text-white/70 text-center mb-6">
        OTP sent to <span className="font-semibold text-white">{email}</span>
      </p>
      
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
          className="w-full p-4 text-lg rounded-xl border border-gray-300 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
          outline-none transition-all text-center tracking-widest"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loadingVerify}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 
            text-white py-3 rounded-xl font-semibold flex items-center justify-center 
            hover:opacity-90 transition disabled:opacity-60"
          >
            {loadingVerify ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : null}
            {loadingVerify ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={handleBackToEmail}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 
            text-white py-3 rounded-xl font-semibold flex items-center justify-center 
            hover:opacity-90 transition"
          >
            Change Email
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={handleRequestOtp}
        className="w-full mt-4 text-white/60 hover:text-white text-sm transition"
      >
        Resend OTP
      </button>
    </div>
  );

  const renderAlert = (type: 'success' | 'error', text: string) => (
    <div
      className={`mt-6 px-4 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 animate-fade-in
        ${type === 'success' 
          ? 'bg-green-100 text-green-700 border border-green-300' 
          : 'bg-red-100 text-red-700 border border-red-300'}`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex flex-col items-center justify-center px-4 py-10">
      {authState.isAuthenticated && authState.user ? (
        <div className="text-center text-white animate-fade-in">
          <h2 className="text-2xl font-semibold">Redirecting to Dashboard...</h2>
          <p className="text-gray-300 mt-2">Please wait while we load your account.</p>
        </div>
      ) : (
        <>
          {showEmailInput ? renderEmailInput() : renderVerifyOtp()}
        </>
      )}

      {message && renderAlert('success', message)}
      {error && renderAlert('error', error)}
    </div>
  );
};

export default Auth;