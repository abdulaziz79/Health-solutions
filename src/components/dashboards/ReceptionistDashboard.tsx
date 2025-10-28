import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ReceptionistDashboard() {
  const { currentUser, patients, appointments, users, invoices, addPatient, addAppointment, updateAppointment } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [isApptDialogOpen, setIsApptDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<any>({});
  const [newAppt, setNewAppt] = useState({ patientId: '', doctorId: '', date: '', time: '', type: '', reason: '' });

  const doctors = users.filter(u => u.role === 'doctor');
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today);

  const handleRegisterPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.email) {
      toast.error('Please fill required fields');
      return;
    }

    addPatient({
      id: `p${Date.now()}`,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      dateOfBirth: newPatient.dateOfBirth || '1990-01-01',
      gender: newPatient.gender || 'other',
      email: newPatient.email,
      phone: newPatient.phone || '',
      address: newPatient.address || '',
      emergencyContact: { name: '', phone: '', relationship: '' },
      allergies: [],
      medications: [],
      conditions: [],
      createdAt: new Date().toISOString(),
    });

    setIsPatientDialogOpen(false);
    setNewPatient({});
    toast.success('Patient registered successfully');
  };

  const handleScheduleAppointment = () => {
    if (!newAppt.patientId || !newAppt.doctorId || !newAppt.date || !newAppt.time) {
      toast.error('Please fill all fields');
      return;
    }

    addAppointment({
      id: `a${Date.now()}`,
      patientId: newAppt.patientId,
      doctorId: newAppt.doctorId,
      date: newAppt.date,
      time: newAppt.time,
      duration: 30,
      type: newAppt.type || 'Consultation',
      status: 'scheduled',
      reason: newAppt.reason,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || '',
    });

    setIsApptDialogOpen(false);
    setNewAppt({ patientId: '', doctorId: '', date: '', time: '', type: '', reason: '' });
    toast.success('Appointment scheduled');
  };

  const handleCheckIn = (apptId: string) => {
    updateAppointment(apptId, { status: 'checked-in' });
    toast.success('Patient checked in');
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName}` : 'Unknown';
  };

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      appointments: "Today's Appointments",
      patients: 'Patient Registration',
      billing: 'Billing Overview',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>{today}</CardDescription>
                </div>
                <Dialog open={isApptDialogOpen} onOpenChange={setIsApptDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" />Schedule Appointment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Patient</Label>
                        <Select value={newAppt.patientId} onValueChange={(v) => setNewAppt({ ...newAppt, patientId: v })}>
                          <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                          <SelectContent>
                            {patients.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Doctor</Label>
                        <Select value={newAppt.doctorId} onValueChange={(v) => setNewAppt({ ...newAppt, doctorId: v })}>
                          <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                          <SelectContent>
                            {doctors.map(d => (
                              <SelectItem key={d.id} value={d.id}>Dr. {d.lastName} - {d.specialization}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input value={newAppt.reason} onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsApptDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleScheduleAppointment}>Schedule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppts.map(appt => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.time}</TableCell>
                      <TableCell>{getPatientName(appt.patientId)}</TableCell>
                      <TableCell>{getDoctorName(appt.doctorId)}</TableCell>
                      <TableCell>{appt.type}</TableCell>
                      <TableCell><Badge>{appt.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        {appt.status === 'scheduled' && (
                          <Button size="sm" onClick={() => handleCheckIn(appt.id)}>Check In</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case 'patients':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Patient Registration</CardTitle>
                <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" />Register Patient</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Patient</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input value={newPatient.firstName || ''} onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input value={newPatient.lastName || ''} onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" value={newPatient.email || ''} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={newPatient.phone || ''} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input type="date" value={newPatient.dateOfBirth || ''} onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={newPatient.gender || ''} onValueChange={(v) => setNewPatient({ ...newPatient, gender: v })}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPatientDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleRegisterPatient}>Register</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Total Patients: {patients.length}
              </div>
            </CardContent>
          </Card>
        );
      case 'billing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Outstanding</p>
                  <p className="text-blue-900">${invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Collected Today</p>
                  <p className="text-blue-900">${invoices.filter(i => i.status === 'paid' && i.date === today).reduce((sum, inv) => sum + inv.amountPaid, 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
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
            <p className="text-muted-foreground">Welcome, {currentUser?.firstName} - {todayAppts.length} appointments today</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
