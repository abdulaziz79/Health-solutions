import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Activity, Pill } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function NurseDashboard() {
  const { currentUser, appointments, patients, prescriptions, addMedicalRecord } = useApp();
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [vitals, setVitals] = useState({ temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '', oxygenSaturation: '', weight: '' });
  const [nursingNote, setNursingNote] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today && (a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'checked-in'));

  const handleSaveVitals = () => {
    if (!selectedPatient) return;

    addMedicalRecord({
      id: `mr${Date.now()}`,
      patientId: selectedPatient,
      doctorId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'progress-note',
      subjective: nursingNote,
      vitalSigns: {
        temperature: parseFloat(vitals.temperature) || undefined,
        bloodPressure: vitals.bloodPressure || undefined,
        heartRate: parseInt(vitals.heartRate) || undefined,
        respiratoryRate: parseInt(vitals.respiratoryRate) || undefined,
        oxygenSaturation: parseFloat(vitals.oxygenSaturation) || undefined,
        weight: parseFloat(vitals.weight) || undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setVitals({ temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '', oxygenSaturation: '', weight: '' });
    setNursingNote('');
    setSelectedPatient(null);
    toast.success('Vital signs recorded');
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      patients: "Today's Patient List",
      vitals: 'Vital Signs',
      medications: 'Medication Schedule',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
      case 'vitals':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Today's Patient List</CardTitle>
              <CardDescription>Record vital signs and nursing assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Allergies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppts.map(appt => {
                    const patient = getPatient(appt.patientId);
                    return (
                      <TableRow key={appt.id}>
                        <TableCell>{appt.time}</TableCell>
                        <TableCell>{getPatientName(appt.patientId)}</TableCell>
                        <TableCell>
                          {patient && patient.allergies.length > 0 ? (
                            <div className="flex gap-1">
                              {patient.allergies.map(a => (
                                <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell><Badge>{appt.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedPatient(appt.patientId)}>
                                <Activity className="w-4 h-4 mr-2" />
                                Record Vitals
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Record Vital Signs - {getPatientName(appt.patientId)}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {patient && (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-2">
                                    <p className="text-sm">
                                      <strong>Allergies:</strong> {patient.allergies.join(', ') || 'None'}
                                    </p>
                                    <p className="text-sm">
                                      <strong>Current Medications:</strong> {patient.medications.join(', ') || 'None'}
                                    </p>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Temperature (°F)</Label>
                                    <Input value={vitals.temperature} onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })} placeholder="98.6" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Blood Pressure</Label>
                                    <Input value={vitals.bloodPressure} onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })} placeholder="120/80" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Heart Rate (bpm)</Label>
                                    <Input value={vitals.heartRate} onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })} placeholder="72" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Respiratory Rate</Label>
                                    <Input value={vitals.respiratoryRate} onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })} placeholder="16" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>O₂ Saturation (%)</Label>
                                    <Input value={vitals.oxygenSaturation} onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })} placeholder="98" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Weight (lbs)</Label>
                                    <Input value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} placeholder="180" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Nursing Notes</Label>
                                  <Textarea
                                    value={nursingNote}
                                    onChange={(e) => setNursingNote(e.target.value)}
                                    rows={3}
                                    placeholder="Patient assessment, observations, concerns..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                                <Button onClick={handleSaveVitals}>Save Vitals</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case 'medications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Medication Schedule</CardTitle>
              <CardDescription>Active medications for today's patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayAppts.map(appt => {
                  const patientRx = prescriptions.filter(p => p.patientId === appt.patientId && p.status === 'active');
                  if (patientRx.length === 0) return null;
                  return (
                    <div key={appt.id} className="border rounded p-3">
                      <h4 className="mb-2">{getPatientName(appt.patientId)}</h4>
                      <div className="space-y-1">
                        {patientRx.map(rx => (
                          <div key={rx.id} className="flex items-center gap-2 text-sm">
                            <Pill className="w-4 h-4" />
                            <span>{rx.medication} {rx.dosage} - {rx.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
            <p className="text-muted-foreground">Welcome, {currentUser?.firstName} - {todayAppts.length} patients today</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
