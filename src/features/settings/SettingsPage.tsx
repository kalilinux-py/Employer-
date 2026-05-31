import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { 
  Settings, 
  Settings2, 
  Shield, 
  HelpCircle, 
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BellRing,
  Smartphone,
  Cpu,
  Clock
} from 'lucide-react';
import { api } from '../../lib/api';
import { SystemSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { toast } from 'sonner';

export function SettingsPage() {
  const queryClient = useQueryClient();

  // Settings Queries
  const { data: settings, isLoading, refetch } = useQuery<SystemSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/api/settings');
      return res.data;
    }
  });

  // Local state for simulation variables
  const [latency, setLatency] = React.useState(() => {
    return localStorage.getItem('ems_latency') || '600';
  });

  // Forms Binding
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SystemSettings>({
    defaultValues: {
      companyName: '',
      supportEmail: '',
      currency: 'USD ($)',
      dateFormat: 'YYYY-MM-DD',
      enableNotifications: true,
      enableMfa: false
    }
  });

  // Sync loaded values
  React.useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: async (updated: SystemSettings) => {
      const res = await api.put('/api/settings', updated);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      localStorage.setItem('ems_settings_v1', JSON.stringify(data));
      toast.success('System settings have been updated and cached globally.');
    },
    onError: (err: any) => {
      toast.error(`System update failed: ${err.message}`);
    }
  });

  const onSubmit = (data: SystemSettings) => {
    updateSettingsMutation.mutate(data);
  };

  // Sonner Showcase Trigger Handles
  const showSuccessToast = () => {
    toast.success('Record Saved', {
      description: 'The employee account was modified cleanly in the cloud ledger.',
    });
  };

  const showErrorToast = () => {
    toast.error('API Server Timeout', {
      description: 'The database cluster did not respond within 5000ms. Retrying.',
    });
  };

  const showWarningToast = () => {
    toast.warning('Pending Payroll Recalculations', {
      description: 'A new department addition has queued re-indexing of active tax variables.',
    });
  };

  const showInfoToast = () => {
    toast.info('Session Terminated Elsewhere', {
      description: 'You active login token was refreshed from coordinates (GMT-05:00) EST.',
    });
  };

  // Latency changes handle
  const handleLatencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLatency(val);
    localStorage.setItem('ems_latency', val);
    toast.success(`Network latency threshold recalibrated: ${val}ms flight delay.`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Clock className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="space-y-1 py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Operational Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Reconfigure administrative layouts, adjust simulation latency thresholds, and audit alert signals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column options: Toast triggers & simulation parameters */}
        <div className="space-y-6 md:col-span-1">
          
          {/* Toast Notification Auditor widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <BellRing className="h-4 w-4" /> Sonner Signals
              </CardTitle>
              <CardDescription className="text-xs">
                Audit system sonner signals used throughout database hooks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pb-6">
              <Button onClick={showSuccessToast} variant="outline" size="sm" className="w-full text-left justify-start gap-2 h-9">
                <CheckCircle className="h-4 w-4 text-green-500" /> Success Toast
              </Button>
              <Button onClick={showErrorToast} variant="outline" size="sm" className="w-full text-left justify-start gap-2 h-9">
                <XCircle className="h-4 w-4 text-red-500" /> Error Toast
              </Button>
              <Button onClick={showWarningToast} variant="outline" size="sm" className="w-full text-left justify-start gap-2 h-9">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> Warning Toast
              </Button>
              <Button onClick={showInfoToast} variant="outline" size="sm" className="w-full text-left justify-start gap-2 h-9">
                <Info className="h-4 w-4 text-blue-500" /> Information Toast
              </Button>
            </CardContent>
          </Card>

          {/* Simulation variables (Latency thresholds) widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> API Latency
              </CardTitle>
              <CardDescription className="text-xs">
                Adjust simulated network routing flights in this sandbox session.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6 space-y-1">
              <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider font-mono">Simulated Flight Delay</label>
              <Select value={latency} onChange={handleLatencyChange} className="text-xs">
                <option value="0">Swift (0ms flight delay)</option>
                <option value="150">Fast (150ms delay)</option>
                <option value="600">Standard (600ms delay)</option>
                <option value="1500">Throttled (1500ms delay)</option>
                <option value="3000">Heavy Loading (3000ms delay)</option>
              </Select>
              <p className="text-[10px] text-zinc-450 mt-2 italic">
                Skeletons and spinners reflect latency values instantly on page transitions.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Right column options: Primary settings Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Flesh out core portal variables. These properties serve as baseline values for reporting charts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field: Company Name */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">Default Company Title</label>
                  <Input
                    type="text"
                    error={!register('companyName')}
                    {...register('companyName', { required: 'Company title required' })}
                  />
                  {errors.companyName && <p className="text-[11px] text-red-500 font-medium">{errors.companyName.message}</p>}
                </div>

                {/* Field: Support Email */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">HR Operations Support Email</label>
                  <Input
                    type="email"
                    error={!!errors.supportEmail}
                    {...register('supportEmail', { 
                      required: 'Email support address is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid address syntax' }
                    })}
                  />
                  {errors.supportEmail && <p className="text-[11px] text-red-500 font-medium">{errors.supportEmail.message}</p>}
                </div>

                {/* Field: Currency standard */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">Corporate Currency System</label>
                  <Select {...register('currency')}>
                    <option value="USD ($)">USD ($) - US Dollars</option>
                    <option value="EUR (€)">EUR (€) - Euro Ledger</option>
                    <option value="SGD (S$)">SGD (S$) - Singapore Dollars</option>
                    <option value="GBP (£)">GBP (£) - British Pounds</option>
                  </Select>
                </div>

                {/* Field: Date layouts */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">Registry Date Representation</label>
                  <Select {...register('dateFormat')}>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-31)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/31/2026)</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 31-05-2026)</option>
                  </Select>
                </div>

                {/* Checkbox: Enable notifications */}
                <div className="col-span-2 pt-4 border-t border-zinc-100 dark:border-zinc-850/50 space-y-3.5 text-sm">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="enableNotifications"
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-900 mt-1 cursor-pointer"
                      {...register('enableNotifications')}
                    />
                    <div className="flex flex-col">
                      <label htmlFor="enableNotifications" className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer flex items-center gap-1.5">
                        Enable Event Notification Broadcasts
                      </label>
                      <span className="text-[11px] text-zinc-450 leading-normal">
                        Triggers Sonner banner flashes instantly on employee record deletions or status changes.
                      </span>
                    </div>
                  </div>

                  {/* Checkbox: MFA authorization lock */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="enableMfa"
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-900 mt-1 cursor-pointer"
                      {...register('enableMfa')}
                    />
                    <div className="flex flex-col">
                      <label htmlFor="enableMfa" className="font-semibold text-xs text-zinc-850 dark:text-zinc-200 cursor-pointer">
                        Require Multi-Factor Security (MFA) Check-in
                      </label>
                      <span className="text-[11px] text-zinc-450 leading-normal">
                        Restricts directory additions to certified administrative devices.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit footer pane */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 mt-6">
                <Button 
                  type="submit" 
                  size="sm" 
                  isLoading={updateSettingsMutation.isPending}
                >
                  Save Global Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
export default SettingsPage;
