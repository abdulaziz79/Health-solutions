import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { UserManagementTab } from './super-admin/UserManagementTab';
import { OrganizationManagementTab } from './super-admin/OrganizationManagementTab';
import { DataManagementTab } from './super-admin/DataManagementTab';
import { GlobalOverrideTab } from './super-admin/GlobalOverrideTab';
import { AuditLogsTab } from './super-admin/AuditLogsTab';

export function SuperAdminDashboard() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('users');

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      users: 'User Management',
      organization: 'Organization Management',
      data: 'Data Management',
      override: 'Global Override',
      audit: 'Audit Logs',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementTab />;
      case 'organization':
        return <OrganizationManagementTab />;
      case 'data':
        return <DataManagementTab />;
      case 'override':
        return <GlobalOverrideTab />;
      case 'audit':
        return <AuditLogsTab />;
      default:
        return <UserManagementTab />;
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
              Complete system control and management - Welcome, {currentUser?.firstName}
            </p>
          </div>
          {getTabContent()}
        </div>
      </div>
    </>
  );
}