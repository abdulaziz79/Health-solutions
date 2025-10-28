import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Edit, Trash2, MapPin, Building } from 'lucide-react';
import { Location, Department, AppointmentType } from '../../../lib/types';
import { toast } from 'sonner@2.0.3';

export function OrganizationManagementTab() {
  const { organization, updateOrganization } = useApp();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isAppointmentTypeDialogOpen, setIsAppointmentTypeDialogOpen] = useState(false);

  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: null,
      sunday: null,
    },
  });

  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({});
  const [newAppointmentType, setNewAppointmentType] = useState<Partial<AppointmentType>>({});

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address || !newLocation.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const location: Location = {
      id: `loc${organization.locations.length + 1}`,
      name: newLocation.name,
      address: newLocation.address,
      phone: newLocation.phone,
      hours: newLocation.hours || {},
    };

    updateOrganization({
      locations: [...organization.locations, location],
    });

    setIsLocationDialogOpen(false);
    setNewLocation({ hours: {} });
    toast.success('Location added successfully');
  };

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.locationId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const department: Department = {
      id: `dept${organization.departments.length + 1}`,
      name: newDepartment.name,
      locationId: newDepartment.locationId,
      rooms: newDepartment.rooms || [],
    };

    updateOrganization({
      departments: [...organization.departments, department],
    });

    setIsDepartmentDialogOpen(false);
    setNewDepartment({});
    toast.success('Department added successfully');
  };

  const handleAddAppointmentType = () => {
    if (!newAppointmentType.name || !newAppointmentType.duration || !newAppointmentType.cost) {
      toast.error('Please fill in all required fields');
      return;
    }

    const appointmentType: AppointmentType = {
      id: `at${organization.appointmentTypes.length + 1}`,
      name: newAppointmentType.name,
      duration: newAppointmentType.duration,
      cost: newAppointmentType.cost,
    };

    updateOrganization({
      appointmentTypes: [...organization.appointmentTypes, appointmentType],
    });

    setIsAppointmentTypeDialogOpen(false);
    setNewAppointmentType({});
    toast.success('Appointment type added successfully');
  };

  const handleDeleteLocation = (locationId: string) => {
    updateOrganization({
      locations: organization.locations.filter(l => l.id !== locationId),
    });
    toast.success('Location deleted successfully');
  };

  const handleDeleteDepartment = (deptId: string) => {
    updateOrganization({
      departments: organization.departments.filter(d => d.id !== deptId),
    });
    toast.success('Department deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Locations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Locations</CardTitle>
              <CardDescription>Manage organization locations and facilities</CardDescription>
            </div>
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                  <DialogDescription>Create a new facility location</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Location Name *</Label>
                    <Input
                      value={newLocation.name || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      placeholder="e.g., Main Medical Center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Input
                      value={newLocation.address || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      placeholder="Full address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={newLocation.phone || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, phone: e.target.value })}
                      placeholder="+1-555-0100"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddLocation}>Add Location</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organization.locations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <h3 className="mb-1">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                      <p className="text-sm text-muted-foreground">{location.phone}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteLocation(location.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Manage departments and rooms</CardDescription>
            </div>
            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>Create a new department</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Department Name *</Label>
                    <Input
                      value={newDepartment.name || ''}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      placeholder="e.g., Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={newDepartment.locationId || ''}
                      onChange={(e) => setNewDepartment({ ...newDepartment, locationId: e.target.value })}
                    >
                      <option value="">Select location</option>
                      {organization.locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rooms (comma-separated)</Label>
                    <Input
                      placeholder="e.g., 101, 102, 103"
                      onChange={(e) => setNewDepartment({ ...newDepartment, rooms: e.target.value.split(',').map(r => r.trim()) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDepartment}>Add Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization.departments.map((dept) => {
                const location = organization.locations.find(l => l.id === dept.locationId);
                return (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>{location?.name || 'Unknown'}</TableCell>
                    <TableCell>{dept.rooms.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDepartment(dept.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Appointment Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointment Types</CardTitle>
              <CardDescription>Configure appointment types, duration, and fees</CardDescription>
            </div>
            <Dialog open={isAppointmentTypeDialogOpen} onOpenChange={setIsAppointmentTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Appointment Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={newAppointmentType.name || ''}
                      onChange={(e) => setNewAppointmentType({ ...newAppointmentType, name: e.target.value })}
                      placeholder="e.g., Follow-up Visit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes) *</Label>
                    <Input
                      type="number"
                      value={newAppointmentType.duration || ''}
                      onChange={(e) => setNewAppointmentType({ ...newAppointmentType, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost ($) *</Label>
                    <Input
                      type="number"
                      value={newAppointmentType.cost || ''}
                      onChange={(e) => setNewAppointmentType({ ...newAppointmentType, cost: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAppointmentTypeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddAppointmentType}>Add Type</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization.appointmentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.duration} min</TableCell>
                  <TableCell>${type.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
