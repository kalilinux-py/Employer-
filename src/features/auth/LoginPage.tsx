import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Building2, HelpCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if already authenticated on load
  React.useEffect(() => {
    if (localStorage.getItem('ems_auth_token_v1')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', data);
      toast.success(`Welcome back, ${response.data.user.name}! Successfully authenticated.`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'admin@saas.com');
    setValue('password', 'admin123');
    toast.info('Seed credentials autofilled. Click "Sign in" to access.');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-150 transition-colors duration-200">
      
      {/* Visual Ambient Left Side banner */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 dark:bg-zinc-950 p-12 flex-col justify-between border-r border-zinc-800 relative overflow-hidden select-none">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[radial-gradient(#303030_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 font-bold shadow-md">
            <Building2 className="h-5.5 w-5.5" />
          </div>
          <span className="font-bold text-lg text-white font-sans tracking-tight">Stellar HR Portal</span>
        </div>

        <div className="space-y-4 relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-300" />
            Vite-Powered Enterprise Core
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Comprehensive team workspace controls.
          </h1>
          <p className="text-sm text-zinc-400">
            Secure multi-department indexing, record auditing, and configuration states paired with local TanStack Query cache.
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 relative z-10">
          Copyright &copy; 2026 Stellar SaaS Corp. All rights reserved.
        </div>
      </div>

      {/* Auth Entry Right Side Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-8 bg-white dark:bg-zinc-955 rounded-2xl border border-zinc-200 dark:border-zinc-850 p-8 shadow-sm">
          
          <div className="text-center space-y-2">
            {/* Logo display on mobile view */}
            <div className="flex md:hidden h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50 mx-auto mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sign in to admin workstation
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your corporate credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <Input
                type="text"
                placeholder="you@company.com"
                error={!!errors.email}
                disabled={isLoading}
                {...register('email', { 
                  required: 'Corporate email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address syntax'
                  }
                })}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <span className="text-[10px] text-zinc-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={!!errors.password}
                disabled={isLoading}
                {...register('password', { 
                  required: 'Account password is required',
                  minLength: {
                    value: 4,
                    message: 'Password must be at least 4 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-150/60 dark:border-zinc-800/60 flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0" />
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-none">
                  SaaS Trial Playground
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  To log interface features instantly with full CRUD write access, use the demo credentials.
                </p>
                <button
                  onClick={handleFillDemo}
                  type="button"
                  className="inline-flex items-center text-xs font-bold text-zinc-900 hover:text-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-100 underline decoration-dotted cursor-pointer"
                >
                  Autofill Seed Credentials
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
export default LoginPage;
