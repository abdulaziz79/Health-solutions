// Core type definitions for MediCore Nexus

export type UserRole = 'super_admin' | 'doctor' | 'lab_tech' | 'patient' | 'receptionist' | 'nurse';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  specialization?: string; // for doctors
  department?: string;
  licenseNumber?: string; // for doctors/nurses
}

export interface Patient {
  id: string;
  userId?: string; // linked to user account if patient has portal access
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'checked-in';
  reason: string;
  notes?: string;
  consultationNotes?: string;
  createdAt: string;
  createdBy: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  doctorId: string;
  date: string;
  type: 'soap-note' | 'progress-note' | 'consultation' | 'procedure';
  chiefComplaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refills: number;
  status: 'active' | 'completed' | 'discontinued';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  orderedBy: string; // doctor ID
  assignedTo?: string; // lab tech ID
  type: string;
  category: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  orderedDate: string;
  completedDate?: string;
  results?: LabResult[];
  interpretation?: string;
  criticalFlag?: boolean;
  specimenIssues?: string;
  createdAt: string;
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  read: boolean;
  sentAt: string;
  replyTo?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Organization {
  id: string;
  name: string;
  locations: Location[];
  departments: Department[];
  appointmentTypes: AppointmentType[];
  insuranceProviders: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
}

export interface Department {
  id: string;
  name: string;
  locationId: string;
  rooms: string[];
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  cost: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'impersonate'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete', 'override'] },
    { resource: 'patients', actions: ['create', 'read', 'update', 'delete', 'export'] },
    { resource: 'medical_records', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'lab_results', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'prescriptions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'billing', actions: ['create', 'read', 'update', 'delete', 'export'] },
    { resource: 'organization', actions: ['configure', 'manage'] },
  ],
  doctor: [
    { resource: 'users', actions: ['read_my_patients'] },
    { resource: 'appointments', actions: ['create_my_schedule', 'read_my_schedule', 'update_my_appointments'] },
    { resource: 'patients', actions: ['read_my_patients', 'update_medical_records'] },
    { resource: 'medical_records', actions: ['create', 'read_my_patients', 'update_my_patients'] },
    { resource: 'lab_results', actions: ['create_orders', 'read_my_orders', 'update_interpretations'] },
    { resource: 'prescriptions', actions: ['create', 'read_my_patients', 'update_my_prescriptions'] },
    { resource: 'billing', actions: ['read_my_services'] },
  ],
  lab_tech: [
    { resource: 'users', actions: ['read_patient_for_tests'] },
    { resource: 'patients', actions: ['read_test_subjects'] },
    { resource: 'medical_records', actions: ['read_relevant_sections'] },
    { resource: 'lab_results', actions: ['create', 'read', 'update_my_tests', 'delete_draft'] },
    { resource: 'billing', actions: ['read_test_codes'] },
  ],
  patient: [
    { resource: 'users', actions: ['read_my_profile'] },
    { resource: 'appointments', actions: ['create_my_appointments', 'read_my_appointments', 'update_my_appointments'] },
    { resource: 'patients', actions: ['read_my_data', 'update_my_demographics'] },
    { resource: 'medical_records', actions: ['read_my_records'] },
    { resource: 'lab_results', actions: ['read_my_results'] },
    { resource: 'prescriptions', actions: ['read_my_prescriptions', 'request_refills'] },
    { resource: 'billing', actions: ['read_my_bills', 'make_payments'] },
  ],
  receptionist: [
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    { resource: 'billing', actions: ['create', 'read', 'update'] },
  ],
  nurse: [
    { resource: 'patients', actions: ['read_assigned', 'update_vitals'] },
    { resource: 'medical_records', actions: ['create_nursing_notes', 'read_assigned'] },
    { resource: 'prescriptions', actions: ['read_assigned', 'document_administration'] },
    { resource: 'appointments', actions: ['read_assigned', 'update_status'] },
  ],
};
