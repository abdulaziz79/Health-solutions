import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patient,
  Appointment,
  MedicalRecord,
  Prescription,
  LabTest,
  Invoice,
  Organization,
  Message,
  AuditLog,
} from '../types';
import {
  mockUsers,
  mockPatients,
  mockAppointments,
  mockMedicalRecords,
  mockPrescriptions,
  mockLabTests,
  mockInvoices,
  mockMessages,
  mockOrganization,
  mockAuditLogs,
} from '../mock-data';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  labTests: LabTest[];
  invoices: Invoice[];
  messages: Message[];
  organization: Organization;
  auditLogs: AuditLog[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  impersonateUser: (userId: string) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  addMedicalRecord: (record: MedicalRecord) => void;
  updateMedicalRecord: (recordId: string, updates: Partial<MedicalRecord>) => void;
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (prescriptionId: string, updates: Partial<Prescription>) => void;
  addLabTest: (labTest: LabTest) => void;
  updateLabTest: (labTestId: string, updates: Partial<LabTest>) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  updateOrganization: (updates: Partial<Organization>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password && u.isActive);
    if (user) {
      setCurrentUser({ ...user, lastLogin: new Date().toISOString() });
      addAuditLog({
        userId: user.id,
        action: 'LOGIN',
        resource: 'user',
        resourceId: user.id,
        details: 'User logged in',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        action: 'LOGOUT',
        resource: 'user',
        resourceId: currentUser.id,
        details: 'User logged out',
      });
    }
    setCurrentUser(null);
  };

  const impersonateUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && currentUser?.role === 'super_admin') {
      addAuditLog({
        userId: currentUser.id,
        action: 'IMPERSONATE',
        resource: 'user',
        resourceId: userId,
        details: `Admin impersonated user ${user.email}`,
      });
      setCurrentUser(user);
    }
  };

  const addUser = (user: User) => {
    setUsers([...users, user]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'user',
      resourceId: user.id,
      details: `Created user ${user.email}`,
    });
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, ...updates } : u)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'user',
      resourceId: userId,
      details: `Updated user ${userId}`,
    });
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'DELETE',
      resource: 'user',
      resourceId: userId,
      details: `Deleted user ${userId}`,
    });
  };

  const addPatient = (patient: Patient) => {
    setPatients([...patients, patient]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'patient',
      resourceId: patient.id,
      details: `Created patient ${patient.firstName} ${patient.lastName}`,
    });
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients(patients.map(p => (p.id === patientId ? { ...p, ...updates } : p)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'patient',
      resourceId: patientId,
      details: `Updated patient ${patientId}`,
    });
  };

  const deletePatient = (patientId: string) => {
    setPatients(patients.filter(p => p.id !== patientId));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'DELETE',
      resource: 'patient',
      resourceId: patientId,
      details: `Deleted patient ${patientId}`,
    });
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'appointment',
      resourceId: appointment.id,
      details: `Created appointment ${appointment.id}`,
    });
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(a => (a.id === appointmentId ? { ...a, ...updates } : a)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'appointment',
      resourceId: appointmentId,
      details: `Updated appointment ${appointmentId}`,
    });
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'DELETE',
      resource: 'appointment',
      resourceId: appointmentId,
      details: `Deleted appointment ${appointmentId}`,
    });
  };

  const addMedicalRecord = (record: MedicalRecord) => {
    setMedicalRecords([...medicalRecords, record]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'medical_record',
      resourceId: record.id,
      details: `Created medical record ${record.id}`,
    });
  };

  const updateMedicalRecord = (recordId: string, updates: Partial<MedicalRecord>) => {
    setMedicalRecords(medicalRecords.map(r => (r.id === recordId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'medical_record',
      resourceId: recordId,
      details: `Updated medical record ${recordId}`,
    });
  };

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions([...prescriptions, prescription]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'prescription',
      resourceId: prescription.id,
      details: `Created prescription ${prescription.medication} for patient ${prescription.patientId}`,
    });
  };

  const updatePrescription = (prescriptionId: string, updates: Partial<Prescription>) => {
    setPrescriptions(prescriptions.map(p => (p.id === prescriptionId ? { ...p, ...updates } : p)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'prescription',
      resourceId: prescriptionId,
      details: `Updated prescription ${prescriptionId}`,
    });
  };

  const addLabTest = (labTest: LabTest) => {
    setLabTests([...labTests, labTest]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'lab_test',
      resourceId: labTest.id,
      details: `Created lab test ${labTest.type} for patient ${labTest.patientId}`,
    });
  };

  const updateLabTest = (labTestId: string, updates: Partial<LabTest>) => {
    setLabTests(labTests.map(t => (t.id === labTestId ? { ...t, ...updates } : t)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'lab_test',
      resourceId: labTestId,
      details: `Updated lab test ${labTestId}`,
    });
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'invoice',
      resourceId: invoice.id,
      details: `Created invoice ${invoice.id}`,
    });
  };

  const updateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map(i => (i.id === invoiceId ? { ...i, ...updates } : i)));
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'invoice',
      resourceId: invoiceId,
      details: `Updated invoice ${invoiceId}`,
    });
  };

  const addMessage = (message: Message) => {
    setMessages([...messages, message]);
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'CREATE',
      resource: 'message',
      resourceId: message.id,
      details: `Sent message ${message.id}`,
    });
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(messages.map(m => (m.id === messageId ? { ...m, ...updates } : m)));
  };

  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganization({ ...organization, ...updates });
    addAuditLog({
      userId: currentUser?.id || 'system',
      action: 'UPDATE',
      resource: 'organization',
      resourceId: organization.id,
      details: 'Updated organization settings',
    });
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `audit${auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        patients,
        appointments,
        medicalRecords,
        prescriptions,
        labTests,
        invoices,
        messages,
        organization,
        auditLogs,
        login,
        logout,
        impersonateUser,
        addUser,
        updateUser,
        deleteUser,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addMedicalRecord,
        updateMedicalRecord,
        addPrescription,
        updatePrescription,
        addLabTest,
        updateLabTest,
        addInvoice,
        updateInvoice,
        addMessage,
        updateMessage,
        updateOrganization,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
