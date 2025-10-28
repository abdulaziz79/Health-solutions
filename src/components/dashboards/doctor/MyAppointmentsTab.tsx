import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MyAppointmentsTab() {
  const { currentUser, appointments, patients, updateAppointment, addMedicalRecord } = useApp();
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [soapNote, setSoapNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    vitals: { temperature: '', bloodPressure: '', heartRate: '', weight: '' },
  });

  const myAppointments = appointments.filter(a => a.doctorId === currentUser?.id);
  const today = new Date().toISOString().split('T')[0];
  
  const todayAppts = myAppointments.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcomingAppts = myAppointments.filter(a => a.date > today).sort((a, b) => a.date.localeCompare(b.date));

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  const handleStartAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'in-progress' });
    setSelectedAppointment(appointmentId);
    toast.success('Appointment started');
  };

  const handleCompleteAppointment = () => {
    if (!selectedAppointment) return;

    const appointment = appointments.find(a => a.id === selectedAppointment);
    if (!appointment) return;

    // Create medical record
    addMedicalRecord({
      id: `mr${Date.now()}`,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      doctorId: currentUser?.id || '',
      date: new Date().toISOString().split('T')[0],
      type: 'soap-note',
      chiefComplaint: appointment.reason,
      subjective: soapNote.subjective,
      objective: soapNote.objective,
      assessment: soapNote.assessment,
      plan: soapNote.plan,
      vitalSigns: {
        temperature: parseFloat(soapNote.vitals.temperature) || undefined,
        bloodPressure: soapNote.vitals.bloodPressure || undefined,
        heartRate: parseInt(soapNote.vitals.heartRate) || undefined,
        weight: parseFloat(soapNote.vitals.weight) || undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update appointment
    updateAppointment(selectedAppointment, {
      status: 'completed',
      consultationNotes: `${soapNote.assessment} - ${soapNote.plan}`,
    });

    setSoapNote({
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      vitals: { temperature: '', bloodPressure: '', heartRate: '', weight: '' },
    });
    setSelectedAppointment(null);
    toast.success('Appointment completed and medical record saved');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      scheduled: 'outline',
      confirmed: 'default',
      'in-progress': 'secondary',
      completed: 'default',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>{today}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppts.map((appt) => {
                const patient = getPatient(appt.patientId);
                return (
                  <div key={appt.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4>{getPatientName(appt.patientId)}</h4>
                        <p className="text-sm text-muted-foreground">{appt.reason}</p>
                      </div>
                      <Badge variant={getStatusBadge(appt.status)}>
                        {appt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      {appt.time} ({appt.duration} min)
                    </div>
                    {patient && (
                      <div className="text-sm mb-3">
                        <p className="text-muted-foreground">Allergies: {patient.allergies.join(', ') || 'None'}</p>
                        <p className="text-muted-foreground">Current Meds: {patient.medications.join(', ') || 'None'}</p>
                      </div>
                    )}
                    {appt.status === 'scheduled' || appt.status === 'confirmed' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleStartAppointment(appt.id)}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Patient Chart - {getPatientName(appt.patientId)}</DialogTitle>
                            <DialogDescription>SOAP Note for {appt.date} at {appt.time}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="mb-2">Vital Signs</h4>
                              <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-1">
                                  <Label>Temp (°F)</Label>
                                  <Input
                                    value={soapNote.vitals.temperature}
                                    onChange={(e) => setSoapNote({ ...soapNote, vitals: { ...soapNote.vitals, temperature: e.target.value } })}
                                    placeholder="98.6"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>BP</Label>
                                  <Input
                                    value={soapNote.vitals.bloodPressure}
                                    onChange={(e) => setSoapNote({ ...soapNote, vitals: { ...soapNote.vitals, bloodPressure: e.target.value } })}
                                    placeholder="120/80"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>HR (bpm)</Label>
                                  <Input
                                    value={soapNote.vitals.heartRate}
                                    onChange={(e) => setSoapNote({ ...soapNote, vitals: { ...soapNote.vitals, heartRate: e.target.value } })}
                                    placeholder="72"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>Weight (lbs)</Label>
                                  <Input
                                    value={soapNote.vitals.weight}
                                    onChange={(e) => setSoapNote({ ...soapNote, vitals: { ...soapNote.vitals, weight: e.target.value } })}
                                    placeholder="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Subjective (Patient's description)</Label>
                              <Textarea
                                value={soapNote.subjective}
                                onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                                placeholder="Patient reports..."
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Objective (Clinical findings)</Label>
                              <Textarea
                                value={soapNote.objective}
                                onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                                placeholder="Physical examination reveals..."
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Assessment (Diagnosis)</Label>
                              <Textarea
                                value={soapNote.assessment}
                                onChange={(e) => setSoapNote({ ...soapNote, assessment: e.target.value })}
                                placeholder="Clinical assessment..."
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Plan (Treatment plan)</Label>
                              <Textarea
                                value={soapNote.plan}
                                onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                                placeholder="Treatment plan..."
                                rows={2}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Cancel</Button>
                            <Button onClick={handleCompleteAppointment}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Visit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : appt.status === 'completed' ? (
                      <Badge variant="default" className="w-full justify-center">Completed</Badge>
                    ) : null}
                  </div>
                );
              })}
              {todayAppts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No appointments today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next {upcomingAppts.length} appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppts.slice(0, 5).map((appt) => (
                <div key={appt.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm">{getPatientName(appt.patientId)}</h4>
                    <Badge variant="outline" className="text-xs">{appt.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{appt.reason}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appt.date} at {appt.time}
                  </p>
                </div>
              ))}
              {upcomingAppts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No upcoming appointments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
