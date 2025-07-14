// Constante pentru rutele de navigare
export const ROUTES = {
  // Auth routes
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main tabs
  HOME: 'Home',
  INCIDENTS: 'Incidents',
  RISK_ASSESSMENTS: 'RiskAssessments',
  TRAININGS: 'Trainings',
  ATTENDANCE: 'Attendance',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  
  // Incident routes
  INCIDENT_DETAILS: 'IncidentDetails',
  REPORT_INCIDENT: 'ReportIncident',
  
  // Risk assessment routes
  RISK_ASSESSMENT_DETAILS: 'RiskAssessmentDetails',
  CREATE_RISK_ASSESSMENT: 'CreateRiskAssessment',
  
  // Training routes
  TRAINING_DETAILS: 'TrainingDetails',
  CREATE_TRAINING: 'CreateTraining',
  
  // Attendance routes
  ATTENDANCE_DETAILS: 'AttendanceDetails',
};

// Constante pentru API și servicii
export const API_CONFIG = {
  BASE_URL: 'https://api.ssmapp.ro',
  TIMEOUT: 10000, // 10 secunde
  RETRY_ATTEMPTS: 3,
};

// Constante pentru validare
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Constante pentru stocarea locală
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@SSM_AUTH_TOKEN',
  USER_DATA: '@SSM_USER_DATA',
  SETTINGS: '@SSM_SETTINGS',
  LANGUAGE: '@SSM_LANGUAGE',
};

// Constante pentru severitate și status
export const SEVERITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const STATUS = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
};

// Constante pentru roluri
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Constante pentru permisiuni
export const PERMISSIONS = {
  CREATE_INCIDENT: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  UPDATE_INCIDENT: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_INCIDENT: [ROLES.ADMIN],
  CREATE_RISK_ASSESSMENT: [ROLES.ADMIN, ROLES.MANAGER],
  UPDATE_RISK_ASSESSMENT: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_RISK_ASSESSMENT: [ROLES.ADMIN],
  CREATE_TRAINING: [ROLES.ADMIN, ROLES.MANAGER],
  UPDATE_TRAINING: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_TRAINING: [ROLES.ADMIN],
};

// Constante pentru limita de încărcare
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}; 