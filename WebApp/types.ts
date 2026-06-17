
export enum BloodType {
  APositive = "A+",
  ANegative = "A-",
  BPositive = "B+",
  BNegative = "B-",
  ABPositive = "AB+",
  ABNegative = "AB-",
  OPositive = "O+",
  ONegative = "O-",
}

export type TrendDirection = 'up' | 'down' | 'stable';

export interface VitalSign {
  name: string;
  value: string | number;
  unit: string;
  timestamp: Date;
  trend?: TrendDirection;
  normalRange?: string;
}

export interface HealthMetricRecord {
  timestamp: Date;
  value: number;
}

export interface HealthMetric {
  name: string;
  unit: string;
  data: HealthMetricRecord[];
  currentValue: number;
  targetRange?: { min: number; max: number };
}

export interface Appointment {
  id: string;
  date: string; // Store as YYYY-MM-DD string for input type="date"
  time: string; // Store as HH:mm string for input type="time"
  doctorName: string;
  location: string;
  reason: string;
  status: 'Scheduled' | 'Cancelled' | 'Completed';
}

export interface Patient {
  id: string; // Will be same as User.id
  name: string; // User's full name, editable
  age?: number;
  sex?: 'Male' | 'Female' | 'Other';
  bloodType?: BloodType;
  profileImageUrl?: string;
  roomNumber?: string;
  lastCheckup?: Date;
  allergies: string[];
  medications: string[];
  vitalSigns: VitalSign[];
  healthMetrics: HealthMetric[];
  notes?: string;
  insuranceProvider?: string;
  previousMedicalHistory?: string;
  appointments: Appointment[]; // Added appointments
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, this would be a proper hash
  patientData: Patient;
}

export type AuthViewType = 'login' | 'registerCredentials' | 'registerMedicalDetails';

// For MedicalDetailsForm
export interface PatientMedicalFormData {
  name: string;
  age: string; // Input as string, convert to number
  sex: 'Male' | 'Female' | 'Other' | '';
  bloodType: BloodType | '';
  allergies: string; // Comma or newline separated
  medications: string; // Comma or newline separated
  roomNumber: string;
  notes: string;
  insuranceProvider: string;
  previousMedicalHistory: string;
}

// For AppointmentForm
export interface AppointmentFormData {
  date: string;
  time: string;
  doctorName: string;
  location: string;
  reason: string;
}
