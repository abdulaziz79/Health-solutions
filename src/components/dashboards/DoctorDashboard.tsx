import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { MyPatientsTab } from './doctor/MyPatientsTab';
import { MyAppointmentsTab } from './doctor/MyAppointmentsTab';
import { PrescriptionsTab } from './doctor/PrescriptionsTab';
import { LabOrdersTab } from './doctor/LabOrdersTab';
import { MessagesTab } from './doctor/MessagesTab';

export function DoctorDashboard() {
  const { currentUser, appointments } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');

  const todayAppointments = appointments.filter(
    a => a.doctorId === currentUser?.id && a.date === new Date().toISOString().split('T')[0]
  );

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      appointments: 'My Appointments',
      patients: 'My Patients',
      prescriptions: 'Prescriptions',
      labs: 'Lab Orders',
      messages: 'Messages',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <MyAppointmentsTab />;
      case 'patients':
        return <MyPatientsTab />;
      case 'prescriptions':
        return <PrescriptionsTab />;
      case 'labs':
        return <LabOrdersTab />;
      case 'messages':
        return <MessagesTab />;
      default:
        return <MyAppointmentsTab />;
    }
  };

  return (
    <>
      <div className="w-64 flex-shrink-0">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-blue-900 mb-2">{getTabTitle()}</h1>
            <p className="text-muted-foreground">
              Welcome, Dr. {currentUser?.lastName} - You have {todayAppointments.length} appointments today
            </p>
          </div>
          {getTabContent()}
        </div>
      </div>
    </>
  );
}