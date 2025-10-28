import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Plus } from 'lucide-react';
import { commonLabTests } from '../../../lib/mock-data';
import { toast } from 'sonner@2.0.3';

export function LabOrdersTab() {
  const { currentUser, patients, appointments, labTests, addLabTest, updateLabTest } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ patientId: '', type: '', priority: 'routine' as 'routine' | 'urgent' | 'stat' });

  const myPatients = patients.filter(p =>
    appointments.some(a => a.doctorId === currentUser?.id && a.patientId === p.id)
  );

  const myLabTests = labTests.filter(t => t.orderedBy === currentUser?.id);

  const handleOrderTest = () => {
    if (!newOrder.patientId || !newOrder.type) {
      toast.error('Please select patient and test type');
      return;
    }

    const test = commonLabTests.find(t => t.name === newOrder.type);
    addLabTest({
      id: `lt${Date.now()}`,
      patientId: newOrder.patientId,
      orderedBy: currentUser?.id || '',
      type: newOrder.type,
      category: test?.category || 'General',
      priority: newOrder.priority,
      status: 'pending',
      orderedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });

    setIsDialogOpen(false);
    setNewOrder({ patientId: '', type: '', priority: 'routine' });
    toast.success('Lab test ordered successfully');
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
            <CardTitle>Lab Orders</CardTitle>
            <CardDescription>Order and review lab tests</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Order Lab Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Order Lab Test</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <Select value={newOrder.patientId} onValueChange={(v) => setNewOrder({ ...newOrder, patientId: v })}>
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
                  <Label>Test Type *</Label>
                  <Select value={newOrder.type} onValueChange={(v) => setNewOrder({ ...newOrder, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLabTests.map(test => (
                        <SelectItem key={test.name} value={test.name}>
                          {test.name} ({test.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newOrder.priority} onValueChange={(v: any) => setNewOrder({ ...newOrder, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleOrderTest}>Order Test</Button>
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
              <TableHead>Test</TableHead>
              <TableHead>Ordered</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Results</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myLabTests.map(test => (
              <TableRow key={test.id}>
                <TableCell>{getPatientName(test.patientId)}</TableCell>
                <TableCell>{test.type}</TableCell>
                <TableCell>{test.orderedDate}</TableCell>
                <TableCell>
                  <Badge variant={test.priority === 'stat' ? 'destructive' : 'outline'}>
                    {test.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
                    {test.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {test.status === 'completed' && test.results && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">View Results</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{test.type} Results</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          {test.results.map((result, idx) => (
                            <div key={idx} className={`border rounded p-3 ${result.isAbnormal ? 'bg-red-50 border-red-200' : ''}`}>
                              <div className="flex justify-between">
                                <span>{result.parameter}</span>
                                <span className={result.isAbnormal ? 'text-red-600' : ''}>{result.value} {result.unit}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Normal: {result.normalRange}</p>
                            </div>
                          ))}
                        </div>
                        {test.interpretation && (
                          <div className="mt-4">
                            <Label>Interpretation</Label>
                            <p className="text-sm mt-1">{test.interpretation}</p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
