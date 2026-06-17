
import { Patient, BloodType, VitalSign, HealthMetric, TrendDirection, Appointment } from '../types';

// In-memory store for patient data
let patientsDB: Record<string, Patient> = {};
// Subscribers for patient updates
let patientUpdateSubscribers: Record<string, Array<(patient: Patient) => void>> = {};

// Function to notify subscribers about patient data changes
const notifySubscribers = (userId: string, patientData: Patient) => {
  if (patientUpdateSubscribers[userId]) {
    // Send a deep copy to each subscriber
    const patientDataCopy = JSON.parse(JSON.stringify(patientData)) as Patient;
     // Revive dates in the copy
    patientDataCopy.lastCheckup = patientDataCopy.lastCheckup ? new Date(patientDataCopy.lastCheckup) : undefined;
    patientDataCopy.vitalSigns = patientDataCopy.vitalSigns.map(vs => ({ ...vs, timestamp: new Date(vs.timestamp) }));
    patientDataCopy.healthMetrics = patientDataCopy.healthMetrics.map(hm => ({
      ...hm,
      data: hm.data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))
    }));
    // Appointments array will be copied as is, dates within appointments are strings so no revival needed for them here.

    patientUpdateSubscribers[userId].forEach(callback => {
      try {
        callback(patientDataCopy); 
      } catch (e) {
        console.error("Error in subscriber callback:", e);
      }
    });
  }
};

// Template for new patient profile
const createDefaultPatientProfile = (userId: string, userNameOrEmail: string): Patient => ({
  id: userId,
  name: userNameOrEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'New User',
  age: undefined,
  sex: undefined,
  bloodType: undefined,
  profileImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userNameOrEmail.split('@')[0])}&background=random&color=fff&size=128`,
  lastCheckup: new Date(),
  allergies: [],
  medications: [],
  vitalSigns: [
    { name: 'Heart Rate', value: 70, unit: 'bpm', timestamp: new Date(), trend: 'stable', normalRange: '60-100' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', timestamp: new Date(), trend: 'stable', normalRange: '<140/90' },
    { name: 'Temperature', value: 36.6, unit: '°C', timestamp: new Date(), trend: 'stable', normalRange: '36.1-37.2' },
    { name: 'Oxygen Saturation', value: 98, unit: '%', timestamp: new Date(), trend: 'stable', normalRange: '95-100%' },
  ],
  healthMetrics: [
    {
      name: 'Blood Glucose', unit: 'mg/dL', currentValue: 100,
      targetRange: { min: 80, max: 130 },
      data: Array.from({ length: 10 }, (_, i) => ({ timestamp: new Date(Date.now() - (10 - i) * 3600000), value: 90 + Math.random() * 20 })),
    },
  ],
  notes: 'Patient profile initialized. Please complete your medical details.',
  roomNumber: undefined,
  insuranceProvider: undefined,
  previousMedicalHistory: undefined,
  appointments: [], // Initialize appointments
});

export const getUserPatientData = (userId: string): Patient | null => {
  const patient = patientsDB[userId];
  if (patient) {
    const patientCopy = JSON.parse(JSON.stringify(patient)) as Patient;
    patientCopy.lastCheckup = patientCopy.lastCheckup ? new Date(patientCopy.lastCheckup) : undefined;
    patientCopy.vitalSigns = patientCopy.vitalSigns.map(vs => ({ ...vs, timestamp: new Date(vs.timestamp) }));
    patientCopy.healthMetrics = patientCopy.healthMetrics.map(hm => ({
      ...hm,
      data: hm.data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))
    }));
    patientCopy.allergies = Array.isArray(patientCopy.allergies) ? patientCopy.allergies : [];
    patientCopy.medications = Array.isArray(patientCopy.medications) ? patientCopy.medications : [];
    patientCopy.appointments = Array.isArray(patientCopy.appointments) ? patientCopy.appointments : [];
    return patientCopy;
  }
  return null;
};

export const updateUserPatientData = (userId: string, patientData: Patient): void => {
  const dataToSave: Patient = {
    ...patientData,
    allergies: Array.isArray(patientData.allergies) ? patientData.allergies : [],
    medications: Array.isArray(patientData.medications) ? patientData.medications : [],
    appointments: Array.isArray(patientData.appointments) ? patientData.appointments : [],
  };
  // Store a deep copy to ensure internal state is not mutated externally
  patientsDB[userId] = JSON.parse(JSON.stringify(dataToSave));
  notifySubscribers(userId, patientsDB[userId]);
};

export const initializeUserPatientData = (userId: string, existingData?: Patient | null, userNameOrEmail?: string): Patient => {
  let patientProfile: Patient;
  const currentPatientDataInDB = patientsDB[userId];

  if (!currentPatientDataInDB) {
    patientProfile = createDefaultPatientProfile(userId, userNameOrEmail || `User ${userId}`);
    patientsDB[userId] = JSON.parse(JSON.stringify(patientProfile)); // Store a copy
    notifySubscribers(userId, patientsDB[userId]); // Notify about the new profile
  } else {
    // If data exists, ensure it's complete and return a copy
    patientProfile = JSON.parse(JSON.stringify(currentPatientDataInDB));
    patientProfile.name = patientProfile.name || userNameOrEmail?.split('@')[0] || `User ${userId}`;
    patientProfile.allergies = Array.isArray(patientProfile.allergies) ? patientProfile.allergies : [];
    patientProfile.medications = Array.isArray(patientProfile.medications) ? patientProfile.medications : [];
    patientProfile.appointments = Array.isArray(patientProfile.appointments) ? patientProfile.appointments : [];
  }
  return JSON.parse(JSON.stringify(patientsDB[userId])); // Return a fresh copy from DB
};

const updateTrend = (oldValue: number, newValue: number): TrendDirection => {
  if (newValue > oldValue) return 'up';
  if (newValue < oldValue) return 'down';
  return 'stable';
};

const userIntervals: Record<string, number | null> = {};

export const subscribeToPatientUpdates = (
  userId: string,
  callback: (updatedPatient: Patient) => void
): (() => void) => {
  if (!patientUpdateSubscribers[userId]) {
    patientUpdateSubscribers[userId] = [];
  }
  // Prevent duplicate subscriptions of the same callback instance
  if (!patientUpdateSubscribers[userId].includes(callback)) {
    patientUpdateSubscribers[userId].push(callback);
  }
  
  if (patientsDB[userId]) {
    setTimeout(() => {
      if (patientUpdateSubscribers[userId]?.includes(callback) && patientsDB[userId]) {
        notifySubscribers(userId, patientsDB[userId]);
      }
    }, 0);
  }

  if (userIntervals[userId]) {
    clearInterval(userIntervals[userId]!);
  }

  userIntervals[userId] = setInterval(() => {
    const currentPatientData = patientsDB[userId];
    if (!currentPatientData) {
      return; 
    }
    
    let patientCopy = JSON.parse(JSON.stringify(currentPatientData)) as Patient;
    patientCopy.lastCheckup = patientCopy.lastCheckup ? new Date(patientCopy.lastCheckup) : undefined;
    patientCopy.vitalSigns = patientCopy.vitalSigns.map(vs => ({ ...vs, timestamp: new Date(vs.timestamp) }));
    patientCopy.healthMetrics = patientCopy.healthMetrics.map(hm => ({
        ...hm,
        data: hm.data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }))
    }));
    patientCopy.appointments = Array.isArray(patientCopy.appointments) ? patientCopy.appointments : [];


    // Vital sign and health metric simulation (will not be visible on PatientDetail anymore but service keeps generating)
    if (patientCopy.vitalSigns.length > 0) {
      const vitalIndex = Math.floor(Math.random() * patientCopy.vitalSigns.length);
      const vitalToUpdate = patientCopy.vitalSigns[vitalIndex];

      if (vitalToUpdate.name === 'Heart Rate') {
        const oldValue = typeof vitalToUpdate.value === 'number' ? vitalToUpdate.value : 70;
        const newValue = Math.max(50, Math.min(130, oldValue + Math.floor(Math.random() * 11) - 5));
        vitalToUpdate.value = newValue;
        vitalToUpdate.trend = updateTrend(oldValue, newValue);
      } else if (vitalToUpdate.name === 'Blood Pressure') {
        const parts = (vitalToUpdate.value as string).split('/');
        const oldSystolic = parseInt(parts[0]);
        const newSystolic = Math.max(90, Math.min(180, oldSystolic + Math.floor(Math.random() * 11) - 5));
        const newDiastolic = Math.max(60, Math.min(110, parseInt(parts[1]) + Math.floor(Math.random() * 7) - 3));
        vitalToUpdate.value = `${newSystolic}/${newDiastolic}`;
        vitalToUpdate.trend = updateTrend(oldSystolic, newSystolic);
      } else if (vitalToUpdate.name === 'Temperature') {
        const oldValue = typeof vitalToUpdate.value === 'number' ? vitalToUpdate.value : 37.0;
        const newValue = parseFloat(Math.max(35.0, Math.min(41.0, oldValue + (Math.random() * 0.6) - 0.3)).toFixed(1));
        vitalToUpdate.value = newValue;
        vitalToUpdate.trend = updateTrend(oldValue, newValue);
      } else if (vitalToUpdate.name === 'Oxygen Saturation') {
        const oldValue = typeof vitalToUpdate.value === 'number' ? vitalToUpdate.value : 98;
        const newValue = Math.max(90, Math.min(100, oldValue + Math.floor(Math.random() * 3) - 1));
        vitalToUpdate.value = newValue;
        vitalToUpdate.trend = updateTrend(oldValue, newValue);
      }
      vitalToUpdate.timestamp = new Date();
    }
    
    if (patientCopy.healthMetrics.length > 0) {
      const metricIndex = Math.floor(Math.random() * patientCopy.healthMetrics.length);
      const metricToUpdate = patientCopy.healthMetrics[metricIndex];
      const lastValue = metricToUpdate.currentValue;
      let newValue = lastValue;

      if (metricToUpdate.name === 'Blood Glucose') {
        newValue = Math.max(60, Math.min(250, lastValue + Math.floor(Math.random() * 21) - 10));
      } else if (metricToUpdate.name === 'Peak Flow') { 
         newValue = Math.max(200, Math.min(700, lastValue + Math.floor(Math.random() * 51) - 25));
      }
      
      metricToUpdate.data.push({ timestamp: new Date(), value: newValue });
      if (metricToUpdate.data.length > 20) { 
        metricToUpdate.data.shift();
      }
      metricToUpdate.currentValue = newValue;
    }
    
    updateUserPatientData(userId, patientCopy);

  }, 2500) as any as number;

  return () => {
    if (userIntervals[userId]) {
      clearInterval(userIntervals[userId]!);
      userIntervals[userId] = null;
    }
    if (patientUpdateSubscribers[userId]) {
      patientUpdateSubscribers[userId] = patientUpdateSubscribers[userId].filter(cb => cb !== callback);
      if (patientUpdateSubscribers[userId].length === 0) {
        delete patientUpdateSubscribers[userId];
      }
    }
  };
};
