import { useApp } from '../lib/context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, Stethoscope, User } from 'lucide-react';

export function Header() {
  const { currentUser, logout } = useApp();

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

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-blue-900">MediCore Nexus</h1>
            <p className="text-xs text-muted-foreground">Enterprise Healthcare Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span>{getRoleIcon()}</span>
                <p className="text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
              </div>
              <Badge className={`text-xs ${getRoleBadgeColor()}`}>
                {currentUser?.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
