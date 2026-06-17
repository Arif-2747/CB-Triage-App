import { User, Patient } from '../types';
import { initializeUserPatientData, getUserPatientData as getPatientDataFromService } from './patientService';

// In-memory store for user credentials and basic info
let usersDB: User[] = [];

// Helper to simulate password hashing (DO NOT USE IN PRODUCTION)
const simpleHash = (password: string): string => `simulated_hash_${password}`;

export interface UserCredential {
  email: string;
  password?: string;
}

// Example: To pre-populate data for easier development/testing
// export const __initializeAuthWithDefaultUser = () => {
//     if (usersDB.length === 0) {
//         const defaultEmail = "test@example.com";
//         const defaultPassword = "password";
//         const userId = `user_default_${Date.now()}`;
//         const patientData = initializeUserPatientData(userId, null, defaultEmail);
//         usersDB.push({
//             id: userId,
//             email: defaultEmail,
//             passwordHash: simpleHash(defaultPassword),
//             patientData: patientData
//         });
//         // console.log("Auth service initialized with a default user: test@example.com / password");
//     }
// };
// Call __initializeAuthWithDefaultUser() here or from App.tsx if you want a default user on app start.


export const registerUser = (credentials: UserCredential): User | null => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required for registration.");
  }
  if (usersDB.find(u => u.email === credentials.email)) {
    return null; // User already exists
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  // Initialize patient data first using patientService. This will store it in patientService's DB.
  const patientDataForNewUser = initializeUserPatientData(userId, null, credentials.email);
  
  const newUser: User = {
    id: userId,
    email: credentials.email,
    passwordHash: simpleHash(credentials.password),
    patientData: patientDataForNewUser, // Use the initialized patient data (which is a copy)
  };

  usersDB.push(newUser);
  return JSON.parse(JSON.stringify(newUser)); // Return a deep copy
};

export const loginUser = (credentials: UserCredential): User | null => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required for login.");
  }
  const userFound = usersDB.find(u => u.email === credentials.email);

  if (userFound && userFound.passwordHash === simpleHash(credentials.password)) {
    // Fetch fresh patient data for the user upon login from patientService
    let patientData = getPatientDataFromService(userFound.id); 
    
    if (!patientData) {
        // This case should ideally not be hit if registration ensures patient data creation.
        console.warn(`Patient data missing for user ${userFound.id} during login. Re-initializing.`);
        patientData = initializeUserPatientData(userFound.id, null, userFound.email);
    }
    
    // Return a deep copy of the user object with the fresh patient data
    return JSON.parse(JSON.stringify({ ...userFound, patientData }));
  }
  return null; // Login failed
};

// getCurrentUser and logoutUser are now effectively managed by App.tsx's state,
// as there's no persistent session storage (like localStorage) being used here.
// Keeping them would be misleading.
// export const logoutUser = (): void => { /* App state handles this */ };
// export const getCurrentUser = (): User | null => { /* App state handles this */ return null; };

// For debugging or if other modules need read-only access to users (use with caution)
// export const getAllUsers_DEBUG = (): User[] => {
//     return JSON.parse(JSON.stringify(usersDB));
// };
