import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const [mode, setMode] = useState<'admin' | 'user'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'admin') {
        const secret = import.meta.env.VITE_ADMIN_PASSWORD || '';
        if (!adminPassword || adminPassword !== secret) {
          toast({ title: 'Error', description: 'Invalid admin password', variant: 'destructive' });
          return;
        }
        localStorage.setItem('admin_mode', 'true');
        await supabase.auth.signOut();
        toast({ title: 'Success', description: 'Admin mode enabled' });
        navigate('/dashboard');
        return;
      }

      if (!username || !password || (isRegister && !confirmPassword)) {
        toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
        return;
      }
      if (isRegister && password !== confirmPassword) {
        toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        toast({ title: 'Error', description: 'Username can only contain letters, numbers, and underscores', variant: 'destructive' });
        return;
      }
      const email = `${username}@miaoda.com`;

      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: 'Success', description: 'Account created successfully! You are now logged in.' });
        navigate('/shop');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Success', description: 'Logged in successfully!' });
        navigate('/shop');
      }
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'An error occurred', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Choose Login Type</CardTitle>
          <CardDescription>Select admin or user login</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'admin' | 'user')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="user">User</TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input id="adminPassword" type="password" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} disabled={loading} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : 'Enter Admin Mode'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="user" className="space-y-4 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                </div>
                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input id="confirm_password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-2 text-center text-sm">
                <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline" disabled={loading}>
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
