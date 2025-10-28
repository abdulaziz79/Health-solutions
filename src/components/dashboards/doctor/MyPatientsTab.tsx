import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Search, FileText } from 'lucide-react';

export function MyPatientsTab() {
  const { currentUser, patients, appointments, medicalRecords, prescriptions } = useApp();
  const [search, setSearch] = useState('');

  // Get patients who have appointments with this doctor
  const myPatientIds = new Set(
    appointments.filter(a => a.doctorId === currentUser?.id).map(a => a.patientId)
  );
  const myPatients = patients.filter(p => myPatientIds.has(p.id));

  const filteredPatients = myPatients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const getPatientRecords = (patientId: string) =>
    medicalRecords.filter(r => r.patientId === patientId && r.doctorId === currentUser?.id);

  const getPatientPrescriptions = (patientId: string) =>
    prescriptions.filter(p => p.patientId === patientId && p.doctorId === currentUser?.id && p.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Patients</CardTitle>
        <CardDescription>Patients under your care</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Conditions</TableHead>
              <TableHead>Active Rx</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => {
              const records = getPatientRecords(patient.id);
              const rxs = getPatientPrescriptions(patient.id);
              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {patient.conditions.slice(0, 2).map(c => (
                        <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{rxs.length}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          View Chart
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{patient.firstName} {patient.lastName} - Medical Chart</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="mb-2">Allergies</h4>
                            <div className="flex gap-2">
                              {patient.allergies.map(a => (
                                <Badge key={a} variant="destructive">{a}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-2">Current Medications</h4>
                            <div className="space-y-1">
                              {rxs.map(rx => (
                                <p key={rx.id} className="text-sm">• {rx.medication} {rx.dosage} - {rx.frequency}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-2">Medical History</h4>
                            <div className="space-y-2">
                              {records.map(record => (
                                <div key={record.id} className="border rounded p-3 text-sm">
                                  <p className="mb-1">{new Date(record.date).toLocaleDateString()}</p>
                                  <p><span>Assessment:</span> {record.assessment}</p>
                                  <p><span>Plan:</span> {record.plan}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
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
}
