// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  position?: string;
  phoneNumber?: string;
  createdAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Incident types
export interface Incident {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  reporterId: string;
  reporterName: string;
  imageUrl?: string;
  involvedPersons?: InvolvedPerson[];
  actions?: IncidentAction[];
}

export interface InvolvedPerson {
  name: string;
  role?: string;
  contactInfo?: string;
}

export interface IncidentAction {
  id: string;
  description: string;
  date: string;
  performedBy: string;
}

// Risk Assessment types
export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  date: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string[];
  hazards: Hazard[];
}

export interface Hazard {
  id: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  controlMeasures: string[];
}

// Training types
export interface Training {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number; // in minutes
  location?: string;
  instructor: string;
  attendees: string[];
  materials?: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on-hold';
  manager: string;
  team: string[];
  location: string;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late';
  location?: string;
  notes?: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'incident' | 'training' | 'risk' | 'system';
  relatedItemId?: string;
  userId: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  IncidentDetails: { incidentId: string };
  ReportIncident: undefined;
  RiskAssessmentDetails: { assessmentId: string };
  TrainingDetails: { trainingId: string };
}; 