import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { User } from '../types';
import { EmailIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, LoadingIcon } from './icons';

interface RegisterPageProps {
  onCredentialsSuccess: (user: User) => void; // Changed from onRegisterSuccess
  onSwitchToLogin: () => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onCredentialsSuccess, onSwitchToLogin, authError, setAuthError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const newUser = registerUser({ email, password });
      if (newUser) {
        onCredentialsSuccess(newUser); // Call new prop for multi-step flow
      } else {
        setAuthError('This email is already registered. Please try logging in.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        setAuthError(error.message || 'An unexpected error occurred during registration.');
      } else {
        setAuthError('An unexpected error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-sky-700">Create Account (Step 1/2)</h2>
      <p className="text-center text-sm text-slate-600">
        First, set up your login credentials.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-register" className="text-sm font-medium text-slate-700 sr-only">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EmailIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="email-register"
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
          <label htmlFor="password-register" className="text-sm font-medium text-slate-700 sr-only">Password</label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password-register"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
              placeholder="Password (min. 6 characters)"
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

        <div>
          <label htmlFor="confirm-password-register" className="text-sm font-medium text-slate-700 sr-only">Confirm Password</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="confirm-password-register"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-sky-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
            {isLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : 'Next: Medical Details'}
          </button>
        </div>
      </form>
      <p className="mt-8 text-sm text-center text-slate-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
          Log in here
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
