import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { updateProfile } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type OrderItem = { id: string; delivery_number: string; delivery_date: string; status: string };

export default function UserProfile() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ full_name: string; email: string; phone: string; gender: 'male'|'female'|'other'|''; address: string; avatar_url: string }>({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    avatar_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      if (!profile) { setLoading(false); return; }
      try {
        const { data } = await supabase
          .from('deliveries')
          .select('id, delivery_number, delivery_date, status')
          .eq('created_by', profile.id)
          .order('delivery_date', { ascending: false });
        setOrders(Array.isArray(data) ? (data as OrderItem[]) : []);
        setForm({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          gender: (profile.gender as any) || '',
          address: profile.address || '',
          avatar_url: profile.avatar_url || '',
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [profile]);

  const onChange = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const onAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to upload avatar', variant: 'destructive' });
      return;
    }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(data.path);
    onChange('avatar_url', pub.publicUrl);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload: any = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        gender: form.gender || null,
        address: form.address || null,
        avatar_url: form.avatar_url || null,
      };
      await updateProfile(profile.id, payload);
      toast({ title: 'Saved', description: 'Profile updated successfully' });
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <Card className="bg-gradient-to-r from-lime-500/10 to-emerald-500/10">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-24 w-full bg-muted" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={e => onChange('full_name', e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => onChange('email', e.target.value)} placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => onChange('phone', e.target.value)} placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => onChange('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={e => onChange('address', e.target.value)} placeholder="Address" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <Input type="file" accept="image/*" onChange={onAvatarSelected} />
                  {form.avatar_url && (
                    <img src={form.avatar_url} alt="avatar" className="h-24 w-24 rounded-lg object-cover" />
                  )}
                </div>
                <Button onClick={saveProfile} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save Profile'}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-sky-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full bg-muted" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground">No orders yet</div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{o.delivery_number}</p>
                    <p className="text-sm text-muted-foreground">{new Date(o.delivery_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status</p>
                    <p className="font-bold">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}