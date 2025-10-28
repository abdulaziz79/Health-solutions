import { AppProvider, useApp } from './lib/context/AppContext';
import { LoginPage } from './components/LoginPage';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { LabTechDashboard } from './components/dashboards/LabTechDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { ReceptionistDashboard } from './components/dashboards/ReceptionistDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const getDashboard = () => {
    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'lab_tech':
        return <LabTechDashboard />;
      case 'patient':
        return <PatientDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {getDashboard()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}