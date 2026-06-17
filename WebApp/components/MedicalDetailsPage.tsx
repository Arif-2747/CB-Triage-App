
import React, { useState } from 'react';
import { User, Patient } from '../types';
import { updateUserPatientData } from '../services/patientService';
import MedicalDetailsForm from './MedicalDetailsForm';
import { LoadingIcon } from './icons'; // Assuming you have a LoadingIcon

interface MedicalDetailsPageProps {
  user: User; // The user object created after credential registration
  onMedicalDetailsComplete: (userWithMedicalDetails: User) => void;
  onSwitchToLogin: () => void; // To allow going back or logging in if they abandon this step
}

const MedicalDetailsPage: React.FC<MedicalDetailsPageProps> = ({ user, onMedicalDetailsComplete, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveDetails = async (formDataFromForm: Partial<Patient>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Merge form data with existing patient data shell
      // MedicalDetailsForm provides formDataFromForm with already processed fields (e.g., allergies as string[])
      const updatedPatientData: Patient = {
        ...user.patientData, // Base default data
        ...formDataFromForm, // Overrides from form
        id: user.id,         // Ensure ID is correct (formDataFromForm also includes this from initialPatientData)
      };
      
      // The updateUserPatientData call will be implicitly handled by App.tsx
      // when onMedicalDetailsComplete updates the currentUser and patientData state,
      // which then triggers effects to persist data.
      // For directness here, or if App.tsx logic changes, you could call it:
      // updateUserPatientData(user.id, updatedPatientData); 
      
      const updatedUser: User = { ...user, patientData: updatedPatientData };
      
      onMedicalDetailsComplete(updatedUser);

    } catch (e) {
      console.error("Error saving medical details:", e);
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
      setIsLoading(false); // Ensure loading is stopped on error
    }
    // If successful, page transition will occur, no need to setIsLoading(false) here
  };

  return (
    <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-sky-700">Medical Details (Step 2/2)</h2>
      <p className="text-center text-sm text-slate-600">
        Please provide some basic medical information. You can update this later.
      </p>
      
      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md text-center">{error}</p>
      )}

      <MedicalDetailsForm
        initialPatientData={user.patientData} // Pass the default patient data shell
        onSave={handleSaveDetails}
        isLoading={isLoading}
        isRegistrationStep={true}
        // No onCancel for registration step, or it could go back to login
      />
      <p className="mt-8 text-sm text-center text-slate-600">
        Changed your mind or already registered?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
          Go to Login
        </button>
      </p>
    </div>
  );
};

export default MedicalDetailsPage;
