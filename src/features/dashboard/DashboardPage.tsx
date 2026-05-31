import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Activity, 
  UserPlus, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { Employee, Department, RecentActivity } from '../../types';

export function DashboardPage() {
  const navigate = useNavigate();

  // Queries
  const { data: employeesData, isLoading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useQuery<{ items: Employee[] }>({
    queryKey: ['employees', { page: 1, limit: 100 }],
    queryFn: async () => {
      const res = await api.get('/api/employees', { params: { limit: 100 } });
      return res.data;
    }
  });

  const { data: deptsData, isLoading: deptsLoading, error: deptsError, refetch: refetchDepts } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/api/departments');
      return res.data;
    }
  });

  const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useQuery<RecentActivity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await api.get('/api/activities');
      return res.data;
    },
    refetchInterval: 10000, // poll activities
  });

  const handleRetry = () => {
    refetchEmployees();
    refetchDepts();
    refetchActivities();
  };

  const hasError = !!employeesError || !!deptsError || !!activitiesError;
  const anyLoading = employeesLoading || deptsLoading || activitiesLoading;

  // Compute stats
  const stats = React.useMemo(() => {
    if (!employeesData?.items || !deptsData) {
      return { total: 0, active: 0, depts: 0, joinedThisMonth: 0 };
    }
    const list = employeesData.items;

    // Filter joining dates in "current" month (e.g. 2024-05, we compare prefix)
    const currentYearMonth = '2024-05'; // Simulated "current" date contextualized in metadata of 2026 or 2024. Let's filter joining dates that start with 2024-05 or 2024-04 
    const joinedThisMonth = list.filter(emp => emp.joiningDate.startsWith('2024-05')).length;

    return {
      total: list.length,
      active: list.filter(emp => emp.status === 'Active').length,
      depts: deptsData.length,
      joinedThisMonth,
    };
  }, [employeesData, deptsData]);

  if (hasError) {
    const errorMsg = (employeesError as any)?.message || (deptsError as any)?.message || (activitiesError as any)?.message || 'Failure loading data services.';
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">SaaS Command Panel</h1>
          <p className="text-sm text-zinc-500">Live analytics monitor</p>
        </div>
        <ErrorState message={errorMsg} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analytics Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time corporate performance markers and operations registry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/employees')} size="sm" variant="outline" className="gap-2">
            View Staff Directory <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {anyLoading ? (
        <CardSkeleton />
      ) : (
        /* Grid container for KPIs */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Total Employees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Personnel
              </CardTitle>
              <Users className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.total}</div>
              <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1.5 font-mono">
                <TrendingUp className="h-3 w-3 text-green-500" />
                Active indexing roster
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Active Employees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Active Staff
              </CardTitle>
              <FileCheck2 className="h-4 w-4 text-green-500/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.active}</div>
              <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% Active utilization rate
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Departments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Departments
              </CardTitle>
              <Building2 className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.depts}</div>
              <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                Cross-functional divisions
              </p>
            </CardContent>
          </Card>

          {/* Card 4: New Hires */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                New Additions
              </CardTitle>
              <UserPlus className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.joinedThisMonth}</div>
              <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                Joined in May 2024
              </p>
            </CardContent>
          </Card>

        </div>
      )}

      {/* Main Splits Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Department Breakdown list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Department Headcounts</CardTitle>
            <CardDescription className="text-xs">Distribution of staff by divisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {anyLoading ? (
              <div className="space-y-3">
                <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
              </div>
            ) : (
              deptsData?.map((dept) => {
                const percent = stats.total > 0 ? (dept.employeeCount / stats.total) * 100 : 0;
                return (
                  <div key={dept.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{dept.name}</span>
                      <span className="font-mono text-zinc-400">{dept.employeeCount} ({Math.round(percent)}%)</span>
                    </div>
                    {/* Render customized progress bar */}
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Activities Feed panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Operation Records</CardTitle>
              <CardDescription className="text-xs">Real-time event audits logging</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {anyLoading ? (
              <div className="space-y-3">
                <div className="h-8 bg-zinc-100 rounded animate-pulse" />
                <div className="h-8 bg-zinc-100 rounded animate-pulse" />
                <div className="h-8 bg-zinc-100 rounded animate-pulse" />
              </div>
            ) : !activitiesData || activitiesData.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-550 font-medium">No recent logs recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-zinc-150 dark:border-zinc-800 pb-2 text-zinc-400 uppercase tracking-wider font-semibold font-mono text-[10px]">
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Date/Time</th>
                      <th className="pb-2">Executor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60 font-medium">
                    {activitiesData.slice(0, 5).map((act) => (
                      <tr key={act.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                        <td className="py-2.5 pr-4 text-zinc-800 dark:text-zinc-200">
                          {act.message}
                        </td>
                        <td className="py-2.5 pr-4 text-zinc-400 font-mono text-[10px]">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-2.5">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            {act.performedBy}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default DashboardPage;
