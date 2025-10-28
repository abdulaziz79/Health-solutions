import { useState } from 'react';
import { useApp } from '../lib/context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Stethoscope } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (role: string) => {
    const credentials = {
      super_admin: { email: 'admin@medicore.com', password: 'admin123' },
      doctor: { email: 'dr.smith@medicore.com', password: 'doctor123' },
      lab_tech: { email: 'lab.tech@medicore.com', password: 'lab123' },
      patient: { email: 'patient@example.com', password: 'patient123' },
      receptionist: { email: 'receptionist@medicore.com', password: 'reception123' },
      nurse: { email: 'nurse@medicore.com', password: 'nurse123' },
    };

    const cred = credentials[role as keyof typeof credentials];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      login(cred.email, cred.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-blue-900 mb-2">MediCore Nexus Enterprise</h1>
          <p className="text-muted-foreground">Complete Role-Based Healthcare Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@medicore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Quick Login (Demo)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => quickLogin('super_admin')}>
                  🛡️ Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('doctor')}>
                  👨‍⚕️ Doctor
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('lab_tech')}>
                  🔬 Lab Tech
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('patient')}>
                  👤 Patient
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('receptionist')}>
                  🎯 Reception
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('nurse')}>
                  🗂️ Nurse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          All features are fully functional. Click any role above to explore.
        </p>
      </div>
    </div>
  );
}
