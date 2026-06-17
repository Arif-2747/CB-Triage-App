

import React, { useState, useEffect } from 'react';
import { Patient, PatientMedicalFormData, BloodType } from '../types';
import { LoadingIcon, UserIcon, CalendarDaysIcon, TagIcon, BuildingOfficeIcon, DocumentTextIcon, AllergyIcon, PillIcon } from './icons'; // Added AllergyIcon, PillIcon

interface MedicalDetailsFormProps {
  initialPatientData: Patient;
  onSave: (updatedData: Partial<Patient>) => void;
  onCancel?: () => void; // Optional: for "edit" mode to close modal/form
  isLoading: boolean;
  isRegistrationStep?: boolean; // To adjust button text or behavior slightly
}

const InputField: React.FC<{label: string, id: string, children: React.ReactNode, icon?: React.ReactNode}> = ({label, id, children, icon}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4 inline mr-1.5 text-slate-500"})}
          {label}
        </label>
        {children}
    </div>
);

const MedicalDetailsForm: React.FC<MedicalDetailsFormProps> = ({
  initialPatientData,
  onSave,
  onCancel,
  isLoading,
  isRegistrationStep = false,
}) => {
  const [formData, setFormData] = useState<PatientMedicalFormData>({
    name: initialPatientData.name || '',
    age: initialPatientData.age?.toString() || '',
    sex: initialPatientData.sex || '',
    bloodType: initialPatientData.bloodType || '',
    allergies: initialPatientData.allergies?.join('\n') || '',
    medications: initialPatientData.medications?.join('\n') || '',
    roomNumber: initialPatientData.roomNumber || '',
    notes: initialPatientData.notes || '',
    insuranceProvider: initialPatientData.insuranceProvider || '',
    previousMedicalHistory: initialPatientData.previousMedicalHistory || '',
  });

  useEffect(() => {
    setFormData({
      name: initialPatientData.name || '',
      age: initialPatientData.age?.toString() || '',
      sex: initialPatientData.sex || '',
      bloodType: initialPatientData.bloodType || '',
      allergies: initialPatientData.allergies?.join('\n') || '',
      medications: initialPatientData.medications?.join('\n') || '',
      roomNumber: initialPatientData.roomNumber || '',
      notes: initialPatientData.notes || '',
      insuranceProvider: initialPatientData.insuranceProvider || '',
      previousMedicalHistory: initialPatientData.previousMedicalHistory || '',
    });
  }, [initialPatientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData: Partial<Patient> = {
      // Preserve fields not directly edited by this form but are part of Patient structure
      id: initialPatientData.id,
      profileImageUrl: initialPatientData.profileImageUrl,
      vitalSigns: initialPatientData.vitalSigns,
      healthMetrics: initialPatientData.healthMetrics,
      lastCheckup: initialPatientData.lastCheckup,

      // Process form fields
      name: formData.name.trim(),
      age: formData.age ? parseInt(formData.age, 10) : undefined,
      sex: formData.sex || undefined,
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies.split(/[\n,]+/).map(s => s.trim()).filter(Boolean),
      medications: formData.medications.split(/[\n,]+/).map(s => s.trim()).filter(Boolean),
      roomNumber: formData.roomNumber.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      insuranceProvider: formData.insuranceProvider.trim() || undefined,
      previousMedicalHistory: formData.previousMedicalHistory.trim() || undefined,
    };
    onSave(processedData);
  };

  const commonInputClasses = "w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors bg-slate-50";
  const commonTextareaClasses = `${commonInputClasses} min-h-[80px]`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Full Name" id="name" icon={<UserIcon/>}>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={commonInputClasses}
            placeholder="e.g., John Doe"
            required
          />
        </InputField>
        <InputField label="Age" id="age" icon={<CalendarDaysIcon/>}>
          <input
            type="number"
            name="age"
            id="age"
            value={formData.age}
            onChange={handleChange}
            className={commonInputClasses}
            placeholder="e.g., 30"
            min="0"
          />
        </InputField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Sex" id="sex" icon={<TagIcon/>}>
          <select
            name="sex"
            id="sex"
            value={formData.sex}
            onChange={handleChange}
            className={commonInputClasses}
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </InputField>
        <InputField label="Blood Type" id="bloodType" icon={<TagIcon/>}>
          <select
            name="bloodType"
            id="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className={commonInputClasses}
          >
            <option value="">Select Blood Type</option>
            {Object.values(BloodType).map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </InputField>
      </div>
      
      {!isRegistrationStep && (
        <InputField label="Room Number (Optional)" id="roomNumber" icon={<BuildingOfficeIcon/>}>
            <input
              type="text"
              name="roomNumber"
              id="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className={commonInputClasses}
              placeholder="e.g., A-101"
            />
          </InputField>
      )}

      <InputField label="Insurance Provider (Optional)" id="insuranceProvider" icon={<BuildingOfficeIcon />}>
        <input
            type="text"
            name="insuranceProvider"
            id="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
            className={commonInputClasses}
            placeholder="e.g., HealthNet, Blue Cross"
        />
      </InputField>

      <InputField label="Allergies" id="allergies" icon={<AllergyIcon/>}>
        <textarea
          name="allergies"
          id="allergies"
          value={formData.allergies}
          onChange={handleChange}
          className={commonTextareaClasses}
          placeholder="e.g., Penicillin, Peanuts (one per line or comma-separated)"
        />
        <p className="text-xs text-slate-500 mt-1">Enter each allergy on a new line or separate by commas.</p>
      </InputField>

      <InputField label="Medications" id="medications" icon={<PillIcon/>}>
        <textarea
          name="medications"
          id="medications"
          value={formData.medications}
          onChange={handleChange}
          className={commonTextareaClasses}
          placeholder="e.g., Aspirin 81mg, Lisinopril 10mg (one per line or comma-separated)"
        />
        <p className="text-xs text-slate-500 mt-1">Enter each medication on a new line or separate by commas.</p>
      </InputField>

      <InputField label="Previous Medical History (Optional)" id="previousMedicalHistory" icon={<DocumentTextIcon />}>
        <textarea
          name="previousMedicalHistory"
          id="previousMedicalHistory"
          value={formData.previousMedicalHistory}
          onChange={handleChange}
          className={`${commonTextareaClasses} min-h-[100px]`}
          placeholder="Describe any significant past illnesses, surgeries, or conditions..."
        />
      </InputField>
      
      <InputField label="Additional Notes (Optional)" id="notes" icon={<DocumentTextIcon/>}>
        <textarea
          name="notes"
          id="notes"
          value={formData.notes}
          onChange={handleChange}
          className={commonTextareaClasses}
          placeholder="Any other relevant medical information or initial notes..."
        />
      </InputField>


      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        {onCancel && !isRegistrationStep && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex justify-center items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : (isRegistrationStep ? 'Complete Registration' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};

export default MedicalDetailsForm;