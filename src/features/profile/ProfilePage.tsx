import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Mail, Shield, Building2, Globe, FileCheck2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { UserProfile } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { toast } from 'sonner';

export function ProfilePage() {
  const queryClient = useQueryClient();

  // Queries
  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/api/profile');
      return res.data;
    }
  });

  // Form Binding
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserProfile>({
    defaultValues: {
      name: '',
      email: '',
      role: '',
      timezone: '',
      companyName: ''
    }
  });

  // Sync loaded profile values into Hook Form
  React.useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: UserProfile) => {
      const res = await api.put('/api/profile', updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      // Update local storage so layout immediately picks up change
      localStorage.setItem('ems_profile_v1', JSON.stringify(data));
      // Dispatch storage event to trigger cross tab or top component updates
      window.dispatchEvent(new Event('storage'));
      toast.success('Your profile identity has been successfully updated!');
    },
    onError: (err: any) => {
      toast.error(`Amending profile failed: ${err.message}`);
    }
  });

  const onSubmit = (data: UserProfile) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Title */}
      <div className="space-y-1 py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Profile Workstation</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your personal credentials, global administrative scopes, and portal viewports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Side panel */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center flex flex-col items-center">
            <Avatar 
              src={profile?.avatarUrl} 
              fallbackText={profile?.name || 'Admin'} 
              size="lg" 
              className="mb-4 shadow border-2 border-zinc-100 dark:border-zinc-800"
            />
            <CardTitle>{profile?.name}</CardTitle>
            <CardDescription className="text-xs uppercase font-mono mt-1 tracking-wider text-zinc-400">
              {profile?.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pb-6 border-t border-zinc-100 dark:border-zinc-800/60 pt-6 text-sm text-zinc-650 dark:text-zinc-405 leading-relaxed">
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <Mail className="h-4 w-4" />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <Building2 className="h-4 w-4" />
              <span>{profile?.companyName}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <Globe className="h-4 w-4" />
              <span>Timezone: {profile?.timezone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form Details panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personnel Information</CardTitle>
            <CardDescription>
              Write adjustments to your identity variables. Changes sync instantly across the active session frame.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field: Full Name */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Administrative Name</label>
                  <Input
                    type="text"
                    error={!!errors.name}
                    {...register('name', { required: 'Full Name is required' })}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Field: Email */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Administrative Email</label>
                  <Input
                    type="email"
                    error={!!errors.email}
                    {...register('email', { 
                      required: 'Administrative email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid corporate syntax' }
                    })}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Field: Administrative Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Authorized Access Role</label>
                  <Input
                    type="text"
                    disabled
                    className="bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-400"
                    {...register('role')}
                  />
                </div>

                {/* Field: Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Parent Organization</label>
                  <Input
                    type="text"
                    error={!!errors.companyName}
                    {...register('companyName', { required: 'Parent Company is required' })}
                  />
                  {errors.companyName && <p className="text-[11px] text-red-500 font-medium">{errors.companyName.message}</p>}
                </div>

                {/* Field: Timezone */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Portal Timezone Context</label>
                  <Select {...register('timezone')}>
                    <option value="GMT-08:00">(GMT-08:00) Pacific Standard Time</option>
                    <option value="GMT-05:00">(GMT-05:00) Eastern Standard Time</option>
                    <option value="GMT+00:00">(GMT+00:00) Greenwich Mean Time</option>
                    <option value="GMT+01:00">(GMT+01:00) Central European Time</option>
                    <option value="GMT+08:00">(GMT+08:00) Singapore Standard Time</option>
                  </Select>
                </div>

              </div>

              {/* Submit panel Button */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 mt-6">
                <Button 
                  type="submit" 
                  size="sm" 
                  isLoading={updateProfileMutation.isPending}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
export default ProfilePage;
