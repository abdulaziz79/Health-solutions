import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Search, Eye, FileText, TestTube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export function GlobalOverrideTab() {
  const { patients, appointments, medicalRecords, labTests, prescriptions, users } = useApp();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const patientAppointments = selectedPatient
    ? appointments.filter(a => a.patientId === selectedPatient)
    : [];

  const patientRecords = selectedPatient
    ? medicalRecords.filter(r => r.patientId === selectedPatient)
    : [];

  const patientLabs = selectedPatient
    ? labTests.filter(l => l.patientId === selectedPatient)
    : [];

  const patientPrescriptions = selectedPatient
    ? prescriptions.filter(p => p.patientId === selectedPatient)
    : [];

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Patient Access</CardTitle>
          <CardDescription>
            Super Admin override - View and access any patient's complete medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {patient.conditions.slice(0, 2).map((condition) => (
                          <Badge key={condition} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {patient.conditions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.conditions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPatient(patient.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Records
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Complete Medical Record - {patient.firstName} {patient.lastName}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Patient Info */}
                            <div>
                              <h3 className="mb-2">Patient Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Date of Birth</p>
                                  <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Blood Type</p>
                                  <p>{patient.bloodType || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Phone</p>
                                  <p>{patient.phone}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Email</p>
                                  <p>{patient.email}</p>
                                </div>
                              </div>
                            </div>

                            {/* Allergies */}
                            <div>
                              <h4 className="mb-2">Allergies</h4>
                              <div className="flex gap-2">
                                {patient.allergies.map((allergy) => (
                                  <Badge key={allergy} variant="destructive">{allergy}</Badge>
                                ))}
                                {patient.allergies.length === 0 && (
                                  <p className="text-sm text-muted-foreground">No known allergies</p>
                                )}
                              </div>
                            </div>

                            {/* Medical Records */}
                            <div>
                              <h4 className="mb-2">Medical Records ({patientRecords.length})</h4>
                              <div className="space-y-2">
                                {patientRecords.map((record) => (
                                  <div key={record.id} className="border rounded p-3 text-sm">
                                    <div className="flex justify-between mb-2">
                                      <p>{new Date(record.date).toLocaleDateString()}</p>
                                      <p className="text-muted-foreground">{getDoctorName(record.doctorId)}</p>
                                    </div>
                                    <p><span className="text-muted-foreground">Chief Complaint:</span> {record.chiefComplaint}</p>
                                    <p><span className="text-muted-foreground">Assessment:</span> {record.assessment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Prescriptions */}
                            <div>
                              <h4 className="mb-2">Active Prescriptions ({patientPrescriptions.length})</h4>
                              <div className="space-y-2">
                                {patientPrescriptions.map((rx) => (
                                  <div key={rx.id} className="border rounded p-3 text-sm">
                                    <p className="mb-1">{rx.medication} - {rx.dosage}</p>
                                    <p className="text-muted-foreground">{rx.frequency} • {rx.instructions}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Lab Tests */}
                            <div>
                              <h4 className="mb-2">Lab Tests ({patientLabs.length})</h4>
                              <div className="space-y-2">
                                {patientLabs.map((lab) => (
                                  <div key={lab.id} className="border rounded p-3 text-sm">
                                    <div className="flex justify-between">
                                      <p>{lab.type}</p>
                                      <Badge variant={lab.status === 'completed' ? 'default' : 'outline'}>
                                        {lab.status}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{lab.orderedDate}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
