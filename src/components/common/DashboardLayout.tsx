import * as React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ShieldCheck, 
  HeartCrack,
  Clock
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark' || !('theme' in localStorage);
  });
  const [isErrorSimulated, setIsErrorSimulated] = React.useState(() => {
    return localStorage.getItem('ems_force_error') === 'true';
  });

  // Load profile from localStorage or fallback
  const profile = React.useMemo(() => {
    const raw = localStorage.getItem('ems_profile_v1');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    return {
      name: 'Kalil Linux',
      email: 'kalilinux108705@gmail.com',
      role: 'HR Global Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };
  }, [location.pathname]); // sync on path transitions in case they save profile

  // Dark Mode Toggle
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Error simulation state toggle
  const toggleErrorSimulation = () => {
    const nextVal = !isErrorSimulated;
    setIsErrorSimulated(nextVal);
    localStorage.setItem('ems_force_error', nextVal ? 'true' : 'false');
    if (nextVal) {
      toast.warning('API Failure Simulated. All page load actions will crash until disabled!');
    } else {
      toast.success('Simulated API recovered successfully. Reloading queries.');
    }
    // Refresh the page or force TanStack Query to refetch
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
      // navigate which triggers route reload
      navigate(location.pathname, { replace: true });
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('ems_auth_token_v1');
    toast.success('Logged out successfully from portal.');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/employees', icon: Users },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans flex text-zinc-900 dark:text-zinc-150 transition-colors duration-200">
      
      {/* 1. Sidebar - Desktop Screen size and up */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 gap-3.5 bg-zinc-50/30 dark:bg-zinc-950">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-none text-zinc-900 dark:text-zinc-50">Stellar HR Portal</span>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">Enterprise Version</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-90 w-full font-bold dark:bg-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200/20'
                    : 'text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/10 dark:bg-zinc-950/20">
          {/* Simulation Toggle Utility */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-455">API Status</span>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {isErrorSimulated ? 'Simulating 500' : 'Operational'}
              </span>
            </div>
            <button
              onClick={toggleErrorSimulation}
              title={isErrorSimulated ? 'Recover Simulated API' : 'Simulate API Server Down'}
              className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                isErrorSimulated 
                  ? 'bg-red-50 text-red-650 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/40' 
                  : 'bg-green-50 text-green-650 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/40'
              }`}
            >
              {isErrorSimulated ? <HeartCrack className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Theme & Profile Panel */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatarUrl} fallbackText={profile.name} size="sm" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 truncate max-w-[100px]">{profile.name}</span>
                <span className="text-[10px] text-zinc-400 truncate max-w-[100px]">{profile.role}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-450 dark:hover:bg-zinc-900 dark:hover:text-zinc-250 cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-450 dark:hover:bg-red-950/50 dark:hover:text-red-400 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Nav Header & Screen drawer */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-between px-6 z-40 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 -ml-1 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">Stellar HR</span>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Avatar src={profile.avatarUrl} fallbackText={profile.name} size="sm" />
          </div>
        </header>

        {/* Mobile Slide-out Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Overlay background */}
            <div 
              className="fixed inset-0 bg-zinc-950/60" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative flex flex-col w-72 bg-white dark:bg-zinc-950 h-full border-r border-zinc-200 dark:border-zinc-800 p-6 z-50">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-base">Portal Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 font-bold'
                          : 'text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                      }`
                    }
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="pt-6 border-t border-zinc-150 dark:border-zinc-800">
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="outline" 
                  className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-150 dark:border-red-900/30 gap-2"
                >
                  <LogOut className="h-4 w-4" /> Log Out Portal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Master Panel Contents Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
