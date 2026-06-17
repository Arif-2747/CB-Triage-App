import React, { useState } from 'react';
import { loginUser, UserCredential } from '../services/authService';
import { User } from '../types';
import { EmailIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, LoadingIcon } from './icons';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister, authError, setAuthError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      const user = loginUser({ email, password });
      if (user) {
        onLoginSuccess(user);
      } else {
        setAuthError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-sky-700">Welcome Back!</h2>
      <p className="text-center text-sm text-slate-600">
        Log in to access your health dashboard.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-login" className="text-sm font-medium text-slate-700 sr-only">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EmailIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password-login" className="text-sm font-medium text-slate-700 sr-only">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password-login"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-sky-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {authError && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md text-center">{authError}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </div>
      </form>
      <p className="mt-8 text-sm text-center text-slate-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
          Register here
        </button>
      </p>
      <p className="mt-2 text-xs text-center text-slate-500">
        Note: This is a demo. Password is not securely stored.
      </p>
    </div>
  );
};

export default LoginPage;
