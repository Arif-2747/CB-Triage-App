
import React from 'react';
import { Appointment } from '../types';
import { CalendarDaysIcon, ClockIcon, BriefcaseIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon, PencilSquareIcon, XMarkIcon } from './icons';

interface AppointmentItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onEdit, onCancelAppointment }) => {
  const { id, date, time, doctorName, location, reason, status } = appointment;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options); // Ensure date is parsed as local
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours,10));
    date.setMinutes(parseInt(minutes,10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }

  const getStatusColor = () => {
    switch (status) {
      case 'Scheduled': return 'bg-sky-100 text-sky-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-sky-700">{reason}</h4>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor()}`}>{status}</span>
        </div>
        {status === 'Scheduled' && (
            <div className="flex space-x-2">
            <button
                onClick={() => onEdit(appointment)}
                className="p-1.5 text-slate-500 hover:text-sky-600 transition-colors"
                aria-label="Edit appointment"
            >
                <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => onCancelAppointment(id)}
                className="p-1.5 text-slate-500 hover:text-red-600 transition-colors"
                aria-label="Cancel appointment"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
            </div>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-slate-600">
        <p className="flex items-center">
          <CalendarDaysIcon className="w-4 h-4 mr-2 text-slate-400" />
          Date: <span className="font-medium ml-1">{formatDate(date)}</span>
        </p>
        <p className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-2 text-slate-400" />
          Time: <span className="font-medium ml-1">{formatTime(time)}</span>
        </p>
        <p className="flex items-center">
          <BriefcaseIcon className="w-4 h-4 mr-2 text-slate-400" />
          Doctor: <span className="font-medium ml-1">{doctorName}</span>
        </p>
        {location && (
          <p className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-slate-400" />
            Location: <span className="font-medium ml-1">{location}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentItem;
