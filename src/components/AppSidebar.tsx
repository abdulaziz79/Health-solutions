import { useApp } from '../lib/context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Stethoscope, LogOut, Users, Calendar, Pill, TestTube, MessageSquare, Building2, Database, Shield, FileText, CreditCard, Activity, DollarSign, PlayCircle } from 'lucide-react';
import { cn } from './ui/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { currentUser, logout, appointments, labTests } = useApp();

  const getRoleBadgeColor = () => {
    const colors: Record<string, string> = {
      super_admin: 'bg-red-100 text-red-800',
      doctor: 'bg-blue-100 text-blue-800',
      lab_tech: 'bg-purple-100 text-purple-800',
      patient: 'bg-green-100 text-green-800',
      receptionist: 'bg-orange-100 text-orange-800',
      nurse: 'bg-pink-100 text-pink-800',
    };
    return colors[currentUser?.role || ''] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = () => {
    const icons: Record<string, string> = {
      super_admin: '🛡️',
      doctor: '👨‍⚕️',
      lab_tech: '🔬',
      patient: '👤',
      receptionist: '🎯',
      nurse: '🗂️',
    };
    return icons[currentUser?.role || ''] || '👤';
  };

  const getMenuItems = (): MenuItem[] => {
    switch (currentUser?.role) {
      case 'super_admin':
        return [
          { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
          { id: 'organization', label: 'Organization', icon: <Building2 className="w-5 h-5" /> },
          { id: 'data', label: 'Data Management', icon: <Database className="w-5 h-5" /> },
          { id: 'override', label: 'Global Override', icon: <Shield className="w-5 h-5" /> },
          { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-5 h-5" /> },
        ];
      case 'doctor':
        const todayAppts = appointments.filter(
          a => a.doctorId === currentUser?.id && a.date === new Date().toISOString().split('T')[0]
        );
        return [
          { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" />, badge: todayAppts.length },
          { id: 'patients', label: 'My Patients', icon: <Users className="w-5 h-5" /> },
          { id: 'prescriptions', label: 'Prescriptions', icon: <Pill className="w-5 h-5" /> },
          { id: 'labs', label: 'Lab Orders', icon: <TestTube className="w-5 h-5" /> },
          { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
        ];
      case 'lab_tech':
        const pendingTests = labTests.filter(t => (!t.assignedTo || t.assignedTo === currentUser?.id) && t.status === 'pending');
        const inProgressTests = labTests.filter(t => (!t.assignedTo || t.assignedTo === currentUser?.id) && t.status === 'in-progress');
        const completedTests = labTests.filter(t => (!t.assignedTo || t.assignedTo === currentUser?.id) && t.status === 'completed');
        return [
          { id: 'pending', label: 'Pending Tests', icon: <TestTube className="w-5 h-5" />, badge: pendingTests.length },
          { id: 'inprogress', label: 'In Progress', icon: <PlayCircle className="w-5 h-5" />, badge: inProgressTests.length },
          { id: 'completed', label: 'Completed', icon: <FileText className="w-5 h-5" />, badge: completedTests.length },
        ];
      case 'patient':
        return [
          { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
          { id: 'records', label: 'Medical Records', icon: <FileText className="w-5 h-5" /> },
          { id: 'prescriptions', label: 'Prescriptions', icon: <Pill className="w-5 h-5" /> },
          { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
          { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
        ];
      case 'receptionist':
        return [
          { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
          { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
          { id: 'billing', label: 'Billing', icon: <DollarSign className="w-5 h-5" /> },
        ];
      case 'nurse':
        return [
          { id: 'patients', label: 'Patient List', icon: <Users className="w-5 h-5" /> },
          { id: 'vitals', label: 'Vital Signs', icon: <Activity className="w-5 h-5" /> },
          { id: 'medications', label: 'Medications', icon: <Pill className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo & Brand */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-blue-900">MediCore Nexus</h2>
            <p className="text-xs text-muted-foreground">Enterprise Healthcare</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getRoleIcon()}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
              <Badge className={`text-xs ${getRoleBadgeColor()}`}>
                {currentUser?.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
