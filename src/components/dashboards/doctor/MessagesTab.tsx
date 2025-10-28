import { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Plus, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MessagesTab() {
  const { currentUser, messages, patients, addMessage, updateMessage } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({ to: '', subject: '', body: '' });

  const myMessages = messages.filter(m => m.to === currentUser?.id || m.from === currentUser?.id);

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

    setIsDialogOpen(false);
    setNewMsg({ to: '', subject: '', body: '' });
    toast.success('Message sent');
  };

  const getPatients = () => {
    return patients.filter(p => p.userId);
  };

  const getUserName = (userId: string) => {
    const patient = patients.find(p => p.userId === userId);
    if (patient) return `${patient.firstName} ${patient.lastName}`;
    return 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Secure messaging with patients</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>To (Patient)</Label>
                  <select
                    className="w-full border rounded p-2"
                    value={newMsg.to}
                    onChange={(e) => setNewMsg({ ...newMsg, to: e.target.value })}
                  >
                    <option value="">Select patient</option>
                    {getPatients().map(p => (
                      <option key={p.userId} value={p.userId}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={newMsg.subject} onChange={(e) => setNewMsg({ ...newMsg, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea value={newMsg.body} onChange={(e) => setNewMsg({ ...newMsg, body: e.target.value })} rows={5} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSendMessage}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {myMessages.map(msg => (
            <div
              key={msg.id}
              className={`border rounded p-4 ${!msg.read && msg.to === currentUser?.id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                if (msg.to === currentUser?.id && !msg.read) {
                  updateMessage(msg.id, { read: true });
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4>{msg.subject}</h4>
                    {!msg.read && msg.to === currentUser?.id && <Badge variant="default">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {msg.from === currentUser?.id ? `To: ${getUserName(msg.to)}` : `From: ${getUserName(msg.from)}`}
                  </p>
                </div>
                {msg.from === currentUser?.id ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              </div>
              <p className="text-sm">{msg.body}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(msg.sentAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
