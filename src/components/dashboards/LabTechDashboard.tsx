import { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AppSidebar } from '../AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function LabTechDashboard() {
  const { currentUser, labTests, patients, updateLabTest } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [interpretation, setInterpretation] = useState('');

  const myTests = labTests.filter(t => !t.assignedTo || t.assignedTo === currentUser?.id);
  const pendingTests = myTests.filter(t => t.status === 'pending');
  const inProgressTests = myTests.filter(t => t.status === 'in-progress');
  const completedTests = myTests.filter(t => t.status === 'completed');

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const handleStartTest = (testId: string) => {
    updateLabTest(testId, { status: 'in-progress', assignedTo: currentUser?.id });
    setSelectedTest(testId);
    toast.success('Test started');
  };

  const handleCompleteTest = () => {
    if (!selectedTest || results.length === 0) {
      toast.error('Please enter test results');
      return;
    }

    updateLabTest(selectedTest, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
      results,
      interpretation,
    });

    setResults([]);
    setInterpretation('');
    setSelectedTest(null);
    toast.success('Test completed and results saved');
  };

  const addResultRow = () => {
    setResults([...results, { parameter: '', value: '', unit: '', normalRange: '', isAbnormal: false }]);
  };

  const updateResultRow = (index: number, field: string, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };

  const renderTestTable = (tests: any[], showActions: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Test Type</TableHead>
          <TableHead>Ordered</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tests.map(test => (
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
            {showActions && (
              <TableCell className="text-right">
                {test.status === 'pending' && (
                  <Button size="sm" onClick={() => handleStartTest(test.id)}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                )}
                {test.status === 'in-progress' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedTest(test.id)}>
                        Enter Results
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Enter Test Results - {test.type}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label>Test Results</Label>
                            <Button size="sm" variant="outline" onClick={addResultRow}>Add Parameter</Button>
                          </div>
                          <div className="space-y-2">
                            {results.map((result, idx) => (
                              <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                                <Input
                                  placeholder="Parameter"
                                  value={result.parameter}
                                  onChange={(e) => updateResultRow(idx, 'parameter', e.target.value)}
                                />
                                <Input
                                  placeholder="Value"
                                  value={result.value}
                                  onChange={(e) => updateResultRow(idx, 'value', e.target.value)}
                                />
                                <Input
                                  placeholder="Unit"
                                  value={result.unit}
                                  onChange={(e) => updateResultRow(idx, 'unit', e.target.value)}
                                />
                                <Input
                                  placeholder="Normal Range"
                                  value={result.normalRange}
                                  onChange={(e) => updateResultRow(idx, 'normalRange', e.target.value)}
                                />
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={result.isAbnormal}
                                    onChange={(e) => updateResultRow(idx, 'isAbnormal', e.target.checked)}
                                  />
                                  Abnormal
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Technical Notes / Interpretation</Label>
                          <Textarea
                            value={interpretation}
                            onChange={(e) => setInterpretation(e.target.value)}
                            rows={3}
                            placeholder="Any technical notes, specimen issues, or preliminary interpretation..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedTest(null)}>Cancel</Button>
                        <Button onClick={handleCompleteTest}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Test
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      pending: 'Pending Tests',
      inprogress: 'In Progress',
      completed: 'Completed Tests',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pending Tests</CardTitle>
              <CardDescription>Tests waiting to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestTable(pendingTests, true)}
            </CardContent>
          </Card>
        );
      case 'inprogress':
        return (
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Tests currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestTable(inProgressTests, true)}
            </CardContent>
          </Card>
        );
      case 'completed':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
              <CardDescription>Recently completed tests</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTestTable(completedTests, false)}
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
            <p className="text-muted-foreground">
              Welcome, {currentUser?.firstName} - {pendingTests.length} pending tests
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
