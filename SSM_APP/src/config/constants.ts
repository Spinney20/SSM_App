// Constante pentru aplicație

// Roluri utilizatori
export const USER_ROLES = {
  WORKER: 'worker',
  TEAM_LEADER: 'team_leader',
  SSM_RESPONSIBLE: 'ssm_responsible',
  ADMIN: 'admin',
};

// Tipuri de incidente
export const INCIDENT_TYPES = {
  NEAR_MISS: 'near_miss',
  MINOR_INJURY: 'minor_injury',
  MAJOR_INJURY: 'major_injury',
  PROPERTY_DAMAGE: 'property_damage',
  ENVIRONMENTAL: 'environmental',
  OTHER: 'other',
};

// Statusuri pentru incidente
export const INCIDENT_STATUS = {
  REPORTED: 'reported',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Tipuri de notificări
export const NOTIFICATION_TYPES = {
  INCIDENT_REPORTED: 'incident_reported',
  INCIDENT_STATUS_CHANGED: 'incident_status_changed',
  TRAINING_REMINDER: 'training_reminder',
  TRAINING_EXPIRED: 'training_expired',
  DOCUMENT_EXPIRED: 'document_expired',
  TASK_ASSIGNED: 'task_assigned',
};

// Colecții Firestore
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  INCIDENTS: 'incidents',
  RISK_ASSESSMENTS: 'risk_assessments',
  TRAININGS: 'trainings',
  TRAINING_RESULTS: 'training_results',
  ATTENDANCE: 'attendance',
  NOTIFICATIONS: 'notifications',
};

// Constante pentru navigare
export const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  PROFILE: 'Profile',
  INCIDENTS: 'Incidents',
  INCIDENT_DETAILS: 'IncidentDetails',
  REPORT_INCIDENT: 'ReportIncident',
  RISK_ASSESSMENTS: 'RiskAssessments',
  TRAININGS: 'Trainings',
  ATTENDANCE: 'Attendance',
  NOTIFICATIONS: 'Notifications',
  SETTINGS: 'Settings',
  ADMIN_USERS: 'AdminUsers',
  CREATE_USER: 'CreateUser',
  EDIT_USER: 'EditUser',
};

// Constante pentru storage
export const STORAGE_PATHS = {
  INCIDENT_PHOTOS: 'incident_photos',
  PROFILE_PHOTOS: 'profile_photos',
  TRAINING_MATERIALS: 'training_materials',
  RISK_ASSESSMENT_FILES: 'risk_assessment_files',
};

export default {
  USER_ROLES,
  INCIDENT_TYPES,
  INCIDENT_STATUS,
  NOTIFICATION_TYPES,
  COLLECTIONS,
  ROUTES,
  STORAGE_PATHS,
}; 