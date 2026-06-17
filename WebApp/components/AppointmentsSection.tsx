
import React, { useState, useMemo } from 'react';
import { Appointment, AppointmentFormData, Patient } from '../types';
import AppointmentItem from './AppointmentItem';
import AppointmentForm from './AppointmentForm';
import { CalendarPlusIcon, CalendarDaysIcon } from './icons';

interface AppointmentsSectionProps {
  patientId: string; // Or full patient object if needed by underlying operations
  appointments: Appointment[];
  onAddAppointment: (newAppointmentData: Appointment) => void;
  onUpdateAppointment: (updatedAppointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void; // To mark as 'Cancelled'
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onCancelAppointment,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For form submission

  const handleOpenFormForAdd = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = async (formData: AppointmentFormData, id?: string) => {
    setIsLoading(true);
    try {
      if (id) { // Editing existing appointment
        const updatedAppointment: Appointment = {
          ...editingAppointment!, // This should have the original ID and status
          ...formData, // Form data overrides date, time, doctor, location, reason
          id: id, // Ensure ID is preserved
        };
        onUpdateAppointment(updatedAppointment);
      } else { // Adding new appointment
        const newAppointment: Appointment = {
          id: `appt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...formData,
          status: 'Scheduled', // Default status for new appointments
        };
        onAddAppointment(newAppointment);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving appointment:", error);
      // Optionally, set an error state to display in the form
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointmentStatus = (appointmentId: string) => {
    // This changes the status to 'Cancelled' rather than deleting
    const appointmentToCancel = appointments.find(app => app.id === appointmentId);
    if (appointmentToCancel) {
      onUpdateAppointment({ ...appointmentToCancel, status: 'Cancelled' });
    }
  };
  
  // Sort appointments: Scheduled first, then by date and time (soonest first)
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
      if (a.status !== 'Scheduled' && b.status === 'Scheduled') return 1;
      
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [appointments]);


  return (
    <>
      <div className="flex justify-between items-center mb-4">
         {/* Title is now part of DetailSection in PatientDetail.tsx */}
        <button
          onClick={handleOpenFormForAdd}
          className="flex items-center text-sm bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          aria-label="Add new appointment"
        >
          <CalendarPlusIcon className="w-5 h-5 mr-2" />
          Add New Appointment
        </button>
      </div>

      {sortedAppointments.length === 0 ? (
        <p className="text-slate-500 text-center py-4">No appointments scheduled.</p>
      ) : (
        <div className="space-y-4">
          {sortedAppointments.map(app => (
            <AppointmentItem
              key={app.id}
              appointment={app}
              onEdit={handleOpenFormForEdit}
              onCancelAppointment={handleCancelAppointmentStatus}
            />
          ))}
        </div>
      )}

      <AppointmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveAppointment}
        initialData={editingAppointment}
        isLoading={isLoading}
      />
    </>
  );
};

export default AppointmentsSection;
