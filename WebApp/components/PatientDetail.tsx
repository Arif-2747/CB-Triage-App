
import React, { useState } from 'react';
import { Patient, Appointment, AppointmentFormData } from '../types';
import MedicalDetailsForm from './MedicalDetailsForm';
import AppointmentsSection from './AppointmentsSection'; // New import
import { UserIcon, MedicalNotesIcon, PillIcon, AllergyIcon, PencilSquareIcon, XMarkIcon, CalendarDaysIcon } from './icons';

interface PatientDetailProps {
  patient: Patient | null;
  onUpdatePatientData: (updatedData: Patient) => void;
}

const DetailSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; actionButton?: React.ReactNode }> = ({ title, icon, children, actionButton }) => (
  <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg md:text-xl font-semibold text-slate-700 flex items-center">
        {icon && <span className="mr-2 text-sky-600">{icon}</span>}
        {title}
      </h3>
      {actionButton}
    </div>
    {children}
  </div>
);

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onUpdatePatientData }) => {
  const [isEditingMedicalDetails, setIsEditingMedicalDetails] = useState(false);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p className="text-xl">No patient data available.</p>
      </div>
    );
  }
  
  const handleSaveMedicalDetails = (formDataFromForm: Partial<Patient>) => {
    const updatedPatient: Patient = {
        ...patient,
        ...formDataFromForm,
    };
    onUpdatePatientData(updatedPatient);
    setIsEditingMedicalDetails(false);
  };

  // Appointment Handlers
  const handleAddAppointment = (newAppointmentData: Appointment) => {
    if (!patient) return;
    const updatedAppointments = [...(patient.appointments || []), newAppointmentData];
    onUpdatePatientData({ ...patient, appointments: updatedAppointments });
  };

  const handleUpdateAppointment = (updatedAppointmentData: Appointment) => {
    if (!patient) return;
    const updatedAppointments = (patient.appointments || []).map(app =>
      app.id === updatedAppointmentData.id ? updatedAppointmentData : app
    );
    onUpdatePatientData({ ...patient, appointments: updatedAppointments });
  };

  const handleCancelAppointment = (appointmentId: string) => { // This now means changing status to Cancelled
    if (!patient) return;
    const appointmentToCancel = (patient.appointments || []).find(app => app.id === appointmentId);
    if (appointmentToCancel) {
        handleUpdateAppointment({ ...appointmentToCancel, status: 'Cancelled' });
    }
  };


  const {
    name, age, sex, bloodType, profileImageUrl, roomNumber,
    lastCheckup, allergies, medications, notes, appointments
  } = patient;

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <DetailSection 
        title="Patient Profile"
        icon={<UserIcon className="w-6 h-6"/>}
        actionButton={
          <button
            onClick={() => setIsEditingMedicalDetails(true)}
            className="flex items-center text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 font-medium py-2 px-3 rounded-md transition-colors"
            aria-label="Edit patient profile"
          >
            <PencilSquareIcon className="w-4 h-4 mr-1.5" />
            Edit Profile
          </button>
        }
      >
        <div className="flex flex-col sm:flex-row items-center">
           <img 
            src={profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff&size=128`} 
            alt={name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover mb-4 sm:mb-0 sm:mr-6 bg-sky-500"
          />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{name}</h2>
            <p className="text-slate-600 text-sm md:text-base">
              {age ? `${age} years old` : 'Age not specified'}
              {sex && `, ${sex}`}
              {roomNumber && ` | Room ${roomNumber}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {bloodType && <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-full">Blood Type: {bloodType}</span>}
              {lastCheckup && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Last Checkup: {new Date(lastCheckup).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      </DetailSection>

      {/* Modal for Editing Medical Details */}
      {isEditingMedicalDetails && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            aria-modal="true"
            role="dialog"
        >
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-sky-700">Edit Medical Details</h3>
              <button 
                onClick={() => setIsEditingMedicalDetails(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close edit modal"
              >
                <XMarkIcon className="w-7 h-7"/>
              </button>
            </div>
            <MedicalDetailsForm
              initialPatientData={patient}
              onSave={handleSaveMedicalDetails}
              onCancel={() => setIsEditingMedicalDetails(false)}
              isLoading={false} 
            />
          </div>
        </div>
      )}

      {/* Appointments Section */}
      <DetailSection title="Appointments" icon={<CalendarDaysIcon className="w-6 h-6" />}>
        <AppointmentsSection
            patientId={patient.id}
            appointments={appointments || []}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onCancelAppointment={handleCancelAppointment}
        />
      </DetailSection>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies */}
        <DetailSection title="Allergies" icon={<AllergyIcon className="w-6 h-6" />}>
          {allergies && allergies.length > 0 ? (
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {allergies.map(allergy => <li key={allergy}>{allergy}</li>)}
            </ul>
          ) : <p className="text-slate-500">No known allergies.</p>}
        </DetailSection>

        {/* Medications */}
        <DetailSection title="Medications" icon={<PillIcon className="w-6 h-6" />}>
          {medications && medications.length > 0 ? (
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {medications.map(med => <li key={med}>{med}</li>)}
            </ul>
          ) : <p className="text-slate-500">No current medications.</p>}
        </DetailSection>
      </div>

      {/* Notes */}
      {notes && (
        <DetailSection title="Doctor's Notes" icon={<MedicalNotesIcon className="w-6 h-6" />}>
          <p className="text-slate-700 whitespace-pre-wrap">{notes}</p>
        </DetailSection>
      )}
      {patient.previousMedicalHistory && (
         <DetailSection title="Previous Medical History" icon={<MedicalNotesIcon className="w-6 h-6" />}>
            <p className="text-slate-700 whitespace-pre-wrap">{patient.previousMedicalHistory}</p>
        </DetailSection>
      )}
      {patient.insuranceProvider && (
        <DetailSection title="Insurance Information" icon={<UserIcon className="w-6 h-6" />}>
            <p className="text-slate-700">{patient.insuranceProvider}</p>
        </DetailSection>
      )}

    </div>
  );
};

export default PatientDetail;
