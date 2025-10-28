import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Pill } from 'lucide-react';
import { commonMedications } from '../../../lib/mock-data';
import { toast } from 'sonner@2.0.3';

export function PrescriptionsTab() {
  const { currentUser, patients, prescriptions, addPrescription, updatePrescription, appointments } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRx, setNewRx] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refills: 0,
  });

  const myPatients = patients.filter(p =>
    appointments.some(a => a.doctorId === currentUser?.id && a.patientId === p.id)
  );

  const myPrescriptions = prescriptions.filter(p => p.doctorId === currentUser?.id);

  const handleCreatePrescription = () => {
    if (!newRx.patientId || !newRx.medication || !newRx.dosage) {
      toast.error('Please fill required fields');
      return;
    }

    addPrescription({
      id: `rx${Date.now()}`,
      patientId: newRx.patientId,
      doctorId: currentUser?.id || '',
      medication: newRx.medication,
      dosage: newRx.dosage,
      frequency: newRx.frequency,
      duration: newRx.duration,
      instructions: newRx.instructions,
      refills: newRx.refills,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });

    setIsDialogOpen(false);
    setNewRx({ patientId: '', medication: '', dosage: '', frequency: '', duration: '', instructions: '', refills: 0 });
    toast.success('Prescription created successfully');
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>Manage patient prescriptions</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write Prescription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <Select value={newRx.patientId} onValueChange={(v) => setNewRx({ ...newRx, patientId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {myPatients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Medication *</Label>
                  <Select value={newRx.medication} onValueChange={(v) => setNewRx({ ...newRx, medication: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonMedications.map(m => (
                        <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dosage *</Label>
                  <Input value={newRx.dosage} onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })} placeholder="e.g., 10mg" />
                </div>
                <div className="space-y-2">
                  <Label>Frequency *</Label>
                  <Select value={newRx.frequency} onValueChange={(v) => setNewRx({ ...newRx, frequency: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={newRx.duration} onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })} placeholder="e.g., 30 days" />
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Input value={newRx.instructions} onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })} placeholder="Take with food" />
                </div>
                <div className="space-y-2">
                  <Label>Refills</Label>
                  <Input type="number" value={newRx.refills} onChange={(e) => setNewRx({ ...newRx, refills: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePrescription}>Create Prescription</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myPrescriptions.map(rx => (
              <TableRow key={rx.id}>
                <TableCell>{getPatientName(rx.patientId)}</TableCell>
                <TableCell>{rx.medication}</TableCell>
                <TableCell>{rx.dosage}</TableCell>
                <TableCell>{rx.frequency}</TableCell>
                <TableCell>{rx.status}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => {
                    updatePrescription(rx.id, { status: 'discontinued' });
                    toast.success('Prescription discontinued');
                  }}>
                    Discontinue
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
