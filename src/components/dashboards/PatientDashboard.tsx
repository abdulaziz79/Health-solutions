import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PatientDashboard() {
  const { currentUser, patients, appointments, prescriptions, labTests, invoices, medicalRecords, users, addAppointment, updateAppointment, addMessage } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ doctorId: '', date: '', time: '', type: '', reason: '' });
  const [newMsg, setNewMsg] = useState({ to: '', subject: '', body: '' });

  const myPatient = patients.find(p => p.userId === currentUser?.id);
  const myAppointments = appointments.filter(a => a.patientId === myPatient?.id);
  const myPrescriptions = prescriptions.filter(p => p.patientId === myPatient?.id && p.status === 'active');
  const myLabTests = labTests.filter(l => l.patientId === myPatient?.id && l.status === 'completed');
  const myInvoices = invoices.filter(i => i.patientId === myPatient?.id);
  const myRecords = medicalRecords.filter(r => r.patientId === myPatient?.id);

  const doctors = users.filter(u => u.role === 'doctor');

  const upcomingAppts = myAppointments.filter(a => a.date >= new Date().toISOString().split('T')[0] && a.status !== 'cancelled');

  const handleBookAppointment = () => {
    if (!newAppt.doctorId || !newAppt.date || !newAppt.time || !newAppt.reason) {
      toast.error('Please fill all fields');
      return;
    }

    addAppointment({
      id: `a${Date.now()}`,
      patientId: myPatient?.id || '',
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

    setIsBookingDialogOpen(false);
    setNewAppt({ doctorId: '', date: '', time: '', type: '', reason: '' });
    toast.success('Appointment booked successfully');
  };

  const handleCancelAppointment = (apptId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointment(apptId, { status: 'cancelled' });
      toast.success('Appointment cancelled');
    }
  };

  const handleSendMessage = () => {
    if (!newMsg.to || !newMsg.subject || !newMsg.body) {
      toast.error('Please fill all fields');
      return;
    }

    addMessage({
      id: `msg${Date.now()}`,
      from: currentUser?.id || '',
      to: newMsg.to,
      subject: newMsg.subject,
      body: newMsg.body,
      read: false,
      sentAt: new Date().toISOString(),
    });

    setIsMessageDialogOpen(false);
    setNewMsg({ to: '', subject: '', body: '' });
    toast.success('Message sent to your doctor');
  };

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      appointments: 'My Appointments',
      records: 'Medical Records',
      prescriptions: 'Prescriptions',
      billing: 'Billing & Invoices',
      messages: 'Messages',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-900">{upcomingAppts.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-900">{myPrescriptions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-900">{myLabTests.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Pending Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-900">${myInvoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0).toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>Book and manage your appointments</CardDescription>
                  </div>
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-2" />Book Appointment</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book New Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Doctor</Label>
                          <Select value={newAppt.doctorId} onValueChange={(v) => setNewAppt({ ...newAppt, doctorId: v })}>
                            <SelectTrigger><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
                            <SelectContent>
                              {doctors.map(d => (
                                <SelectItem key={d.id} value={d.id}>Dr. {d.lastName} - {d.specialization}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <input type="date" className="w-full border rounded p-2" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <select className="w-full border rounded p-2" value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}>
                            <option value="">Select time</option>
                            {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Reason for Visit</Label>
                          <Textarea value={newAppt.reason} onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleBookAppointment}>Book Appointment</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppts.map(appt => {
                    const doctor = users.find(u => u.id === appt.doctorId);
                    return (
                      <div key={appt.id} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4>Dr. {doctor?.lastName}</h4>
                            <p className="text-sm text-muted-foreground">{doctor?.specialization}</p>
                          </div>
                          <Badge>{appt.status}</Badge>
                        </div>
                        <p className="text-sm mb-2">{appt.date} at {appt.time}</p>
                        <p className="text-sm text-muted-foreground mb-3">{appt.reason}</p>
                        {appt.status === 'scheduled' && (
                          <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appt.id)}>Cancel</Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        );
      case 'records':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Your health history and visit summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myRecords.map(record => (
                  <div key={record.id} className="border rounded p-4">
                    <p className="mb-2">{new Date(record.date).toLocaleDateString()}</p>
                    <p className="text-sm mb-1"><strong>Assessment:</strong> {record.assessment}</p>
                    <p className="text-sm"><strong>Plan:</strong> {record.plan}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'prescriptions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myPrescriptions.map(rx => (
                  <div key={rx.id} className="border rounded p-4">
                    <h4>{rx.medication} - {rx.dosage}</h4>
                    <p className="text-sm text-muted-foreground">{rx.frequency}</p>
                    <p className="text-sm text-muted-foreground">{rx.instructions}</p>
                    <p className="text-sm text-muted-foreground mt-2">Refills remaining: {rx.refills}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'billing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Billing & Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myInvoices.map(inv => (
                  <div key={inv.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4>Invoice #{inv.id}</h4>
                        <p className="text-sm text-muted-foreground">{inv.date}</p>
                      </div>
                      <Badge variant={inv.status === 'paid' ? 'default' : 'destructive'}>{inv.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Total: ${inv.total}</p>
                      {inv.status === 'pending' && (
                        <Button size="sm" onClick={() => {
                          toast.success('Payment processed (simulated)');
                        }}>Pay Now</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'messages':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Messages</CardTitle>
                <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" />New Message</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to Doctor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>To</Label>
                        <Select value={newMsg.to} onValueChange={(v) => setNewMsg({ ...newMsg, to: v })}>
                          <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                          <SelectContent>
                            {doctors.map(d => (
                              <SelectItem key={d.id} value={d.id}>Dr. {d.lastName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <input type="text" className="w-full border rounded p-2" value={newMsg.subject} onChange={(e) => setNewMsg({ ...newMsg, subject: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea value={newMsg.body} onChange={(e) => setNewMsg({ ...newMsg, body: e.target.value })} rows={5} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSendMessage}>Send</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">Secure messaging with your healthcare team</p>
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
            <p className="text-muted-foreground">Welcome, {currentUser?.firstName}!</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
