import React from 'react';
import { HeartIcon } from './icons'; // Or any other relevant app icon

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-cyan-500 to-teal-400 flex flex-col items-center justify-center p-4 selection:bg-sky-800 selection:text-white">
      <div className="mb-8 text-center">
        <HeartIcon className="w-16 h-16 text-white inline-block mb-3 animate-pulse" />
        <h1 className="text-4xl font-bold text-white tracking-tight">
          CB - TRIAGE
        </h1>
        <p className="text-sky-100 mt-1">Your health, managed.</p>
      </div>
      {children}
      <footer className="mt-12 text-center text-xs text-sky-100/80">
        <p>&copy; {new Date().getFullYear()} Health Dashboard Inc. All rights reserved.</p>
        <p className="mt-1">This is a demonstration application. Do not use real personal data.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;