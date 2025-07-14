// Tipuri pentru modelele de date

import { USER_ROLES, INCIDENT_TYPES, INCIDENT_STATUS, NOTIFICATION_TYPES } from '../config/constants';
import { FieldValue } from 'firebase/firestore';

// Tipul pentru timestamp Firestore
export type Timestamp = Date | number | FieldValue;

// Tipul pentru utilizator
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'worker' | 'team_leader' | 'ssm_responsible' | 'admin';
  employeeCode?: string;
  photoURL?: string;
  phoneNumber?: string;
  projects?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipul pentru proiect
export interface Project {
  id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  startDate: Timestamp;
  endDate?: Timestamp;
  status: 'active' | 'completed' | 'paused';
  teams?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipul pentru incident
export interface Incident {
  id: string;
  userId: string;
  projectId: string;
  type: 'near_miss' | 'minor_injury' | 'major_injury' | 'property_damage' | 'environmental' | 'other';
  description: string;
  location: {
    address?: string;
    latitude: number;
    longitude: number;
  };
  photos?: string[];
  videos?: string[];
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  reportedAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
  assignedTo?: string;
  actionsTaken?: string;
  preventiveMeasures?: string;
}

// Tipul pentru evaluare de risc
export interface RiskAssessment {
  id: string;
  userId: string;
  projectId: string;
  checklistId: string;
  score: number;
  items: RiskAssessmentItem[];
  signature: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipul pentru element din evaluarea de risc
export interface RiskAssessmentItem {
  id: string;
  question: string;
  answer: boolean;
  risk: 'low' | 'medium' | 'high';
  observation?: string;
}

// Tipul pentru instruire
export interface Training {
  id: string;
  title: string;
  description: string;
  materialURL: string;
  materialType: 'pdf' | 'video' | 'other';
  testId?: string;
  validityDays: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipul pentru rezultat instruire
export interface TrainingResult {
  id: string;
  userId: string;
  trainingId: string;
  score: number;
  passed: boolean;
  completedAt: Timestamp;
  expiresAt: Timestamp;
}

// Tipul pentru prezență
export interface Attendance {
  id: string;
  userId: string;
  projectId: string;
  checkIn: {
    time: Timestamp;
    location: {
      latitude: number;
      longitude: number;
    };
    selfieURL?: string;
  };
  checkOut?: {
    time: Timestamp;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  date: string; // Format YYYY-MM-DD
  hours?: number;
}

// Tipul pentru notificare
export interface Notification {
  id: string;
  userId: string;
  type: 'incident_reported' | 'incident_status_changed' | 'training_reminder' | 'training_expired' | 'document_expired' | 'task_assigned';
  title: string;
  message: string;
  read: boolean;
  relatedId?: string; // ID-ul incidentului, instruirii etc.
  createdAt: Timestamp;
}

// Tipul pentru starea autentificării
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 