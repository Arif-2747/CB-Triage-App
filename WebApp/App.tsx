
import React, { useState, useEffect, useCallback } from 'react';
import { Patient, User, AuthViewType } from './types';
// Removed getCurrentUser, logoutUser from authService imports as App state manages session
import { loginUser as attemptLogin, registerUser } from './services/authService'; 
import { initializeUserPatientData, subscribeToPatientUpdates, updateUserPatientData } from './services/patientService';
import PatientDetail from './components/PatientDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MedicalDetailsPage from './components/MedicalDetailsPage';
import { LoadingIcon, LogoutIcon, InfoIcon } from './components/icons'; 
import AuthLayout from './components/AuthLayout';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For initial app setup
  const [authView, setAuthView] = useState<AuthViewType>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [tempUserForRegistration, setTempUserForRegistration] = useState<User | null>(null);

  // App starts in a logged-out state as there's no persistent session.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Effect for handling real-time patient data updates
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      // If user logs out, patientData should be cleared, and subscription cleaned up by return.
      if (patientData) setPatientData(null); 
      return;
    }

    const handleSubscribedUpdate = (updatedPatient: Patient) => {
      setPatientData(updatedPatient);
      // Also update patientData within the currentUser object for consistency
      setCurrentUser(prevUser => {
        if (prevUser && prevUser.id === updatedPatient.id) {
          return { ...prevUser, patientData: updatedPatient };
        }
        return prevUser;
      });
    };

    const unsubscribe = subscribeToPatientUpdates(currentUser.id, handleSubscribedUpdate);
    
    if (currentUser.patientData && (!patientData || patientData.id !== currentUser.patientData.id) ) {
        setPatientData(currentUser.patientData);
    }

    return () => {
      unsubscribe();
    };
  }, [currentUser?.id]);


  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user); 
    setPatientData(user.patientData);
    setAuthError(null);
    setTempUserForRegistration(null);
  };

  const handleCredentialsSuccess = (user: User) => {
    setTempUserForRegistration(user);
    setAuthView('registerMedicalDetails');
    setAuthError(null);
  };
  
  const handleMedicalDetailsSuccess = (userWithMedicalDetails: User) => {
    updateUserPatientData(userWithMedicalDetails.id, userWithMedicalDetails.patientData);
    setCurrentUser(userWithMedicalDetails);
    setAuthError(null);
    setTempUserForRegistration(null);
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('login');
    setTempUserForRegistration(null);
    setAuthError(null);
  };

  const switchAuthView = (view: AuthViewType) => {
    setAuthView(view);
    setAuthError(null);
  };
  
  const handlePatientDataUpdate = (updatedLocalPatientData: Patient) => {
    if (currentUser) {
      updateUserPatientData(currentUser.id, updatedLocalPatientData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <LoadingIcon className="w-16 h-16 animate-spin" />
        <p className="ml-4 text-xl">Loading Application...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthLayout>
        {authView === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => switchAuthView('registerCredentials')}
            setAuthError={setAuthError}
            authError={authError}
          />
        )}
        {authView === 'registerCredentials' && (
          <RegisterPage 
            onCredentialsSuccess={handleCredentialsSuccess}
            onSwitchToLogin={() => switchAuthView('login')}
            setAuthError={setAuthError}
            authError={authError}
          />
        )}
        {authView === 'registerMedicalDetails' && tempUserForRegistration && (
           <MedicalDetailsPage
            user={tempUserForRegistration}
            onMedicalDetailsComplete={handleMedicalDetailsSuccess}
            onSwitchToLogin={() => {
                setTempUserForRegistration(null); 
                switchAuthView('login');
            }}
          />
        )}
      </AuthLayout>
    );
  }
  
  // Logged-in view, constrained to 16:9
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-800" role="application"> {/* Outer letterbox container - removed padding */}
      <div className="aspect-video w-full max-w-full h-full max-h-full bg-slate-100 shadow-2xl rounded-lg overflow-hidden flex flex-col font-sans"> {/* 16:9 App Shell */}
        <header className="bg-sky-700 text-white p-4 shadow-md flex justify-between items-center shrink-0">
            <h1 className="text-xl font-bold">CB - TRIAGE</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors text-sm"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
        </header>

        {(!patientData && currentUser?.patientData?.id !== patientData?.id) ? (
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200 flex items-center justify-center">
                <div className="text-center">
                    <LoadingIcon className="w-12 h-12 animate-spin text-sky-600 mx-auto" />
                    <p className="ml-2 text-lg text-slate-700 mt-3">Loading Patient Data...</p>
                </div>
            </main>
        ) : (
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200">
              {patientData && <PatientDetail patient={patientData} onUpdatePatientData={handlePatientDataUpdate} />}
            </main>
        )}
      
        <footer className="p-4 border-t border-slate-300 text-xs text-slate-500 bg-slate-100 shrink-0">
            <div className="text-center">
              Logged in as: {currentUser.email}
            </div>
        </footer>
      </div> {/* End of 16:9 App Shell */}
    </div> /* End of Outer letterbox container */
  );
};
