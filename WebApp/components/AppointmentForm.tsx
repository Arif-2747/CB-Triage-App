
import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentFormData } from '../types';
import { LoadingIcon, XMarkIcon, CalendarDaysIcon, ClockIcon, BriefcaseIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon } from './icons';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: AppointmentFormData, id?: string) => void;
  initialData?: Appointment | null;
  isLoading: boolean;
}

const InputField: React.FC<{label: string, id: string, children: React.ReactNode, icon?: React.ReactNode, required?: boolean}> = 
  ({label, id, children, icon, required}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4 inline mr-1.5 text-slate-500"})}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: '',
    time: '',
    doctorName: '',
    location: '',
    reason: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        time: initialData.time,
        doctorName: initialData.doctorName,
        location: initialData.location,
        reason: initialData.reason,
      });
    } else {
      // Set default date to today for new appointments
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      setFormData({
        date: `${year}-${month}-${day}`,
        time: '09:00', // Default time
        doctorName: '',
        location: '',
        reason: '',
      });
    }
  }, [initialData, isOpen]); // Reset form when initialData changes or form is (re)opened

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.doctorName || !formData.reason) {
        alert("Please fill in all required fields: Date, Time, Doctor, and Reason.");
        return;
    }
    onSave(formData, initialData?.id);
  };

  if (!isOpen) {
    return null;
  }

  const commonInputClasses = "w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors bg-slate-50";

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-sky-700">
            {initialData ? 'Edit Appointment' : 'Add New Appointment'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close form"
          >
            <XMarkIcon className="w-7 h-7"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Date" id="appointment-date" icon={<CalendarDaysIcon/>} required>
              <input
                type="date"
                name="date"
                id="appointment-date"
                value={formData.date}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </InputField>
            <InputField label="Time" id="appointment-time" icon={<ClockIcon/>} required>
              <input
                type="time"
                name="time"
                id="appointment-time"
                value={formData.time}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </InputField>
          </div>
          <InputField label="Doctor / Specialist" id="appointment-doctor" icon={<BriefcaseIcon/>} required>
            <input
              type="text"
              name="doctorName"
              id="appointment-doctor"
              value={formData.doctorName}
              onChange={handleChange}
              className={commonInputClasses}
              placeholder="e.g., Dr. Smith, Cardiologist"
              required
            />
          </InputField>
          <InputField label="Location / Clinic" id="appointment-location" icon={<MapPinIcon/>}>
            <input
              type="text"
              name="location"
              id="appointment-location"
              value={formData.location}
              onChange={handleChange}
              className={commonInputClasses}
              placeholder="e.g., City General Hospital, Room 203"
            />
          </InputField>
          <InputField label="Reason for Appointment" id="appointment-reason" icon={<ChatBubbleLeftEllipsisIcon/>} required>
            <textarea
              name="reason"
              id="appointment-reason"
              value={formData.reason}
              onChange={handleChange}
              className={`${commonInputClasses} min-h-[80px]`}
              placeholder="e.g., Annual Checkup, Follow-up, Consultation"
              required
              rows={3}
            />
          </InputField>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex justify-center items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : (initialData ? 'Save Changes' : 'Add Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
