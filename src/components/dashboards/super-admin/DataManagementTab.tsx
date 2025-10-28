import { useApp } from '../../../lib/context/AppContext';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Download, Database, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DataManagementTab() {
  const { patients, appointments, labTests, invoices, prescriptions, medicalRecords } = useApp();

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${data.length} records to ${filename}.csv`);
  };

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Database },
    { label: 'Total Appointments', value: appointments.length, icon: Database },
    { label: 'Lab Tests', value: labTests.length, icon: Database },
    { label: 'Invoices', value: invoices.length, icon: Database },
    { label: 'Prescriptions', value: prescriptions.length, icon: Database },
    { label: 'Medical Records', value: medicalRecords.length, icon: Database },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Statistics</CardTitle>
          <CardDescription>Overview of all system data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-blue-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Export system data to CSV files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => exportToCSV(patients, 'patients')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Patients ({patients.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToCSV(appointments, 'appointments')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Appointments ({appointments.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToCSV(labTests, 'lab_tests')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Lab Tests ({labTests.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToCSV(invoices, 'invoices')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Invoices ({invoices.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToCSV(prescriptions, 'prescriptions')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Prescriptions ({prescriptions.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToCSV(medicalRecords, 'medical_records')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Medical Records ({medicalRecords.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Management</CardTitle>
          <CardDescription>Create and restore system backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            onClick={() => {
              const backup = {
                timestamp: new Date().toISOString(),
                data: { patients, appointments, labTests, invoices, prescriptions, medicalRecords }
              };
              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `medicore_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              window.URL.revokeObjectURL(url);
              toast.success('Backup created successfully');
            }}
          >
            <Database className="w-4 h-4 mr-2" />
            Create Full System Backup
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Last backup: Never (simulated environment)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
