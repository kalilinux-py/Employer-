import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  Mail, 
  Phone,
  Calendar,
  XCircle,
  HelpCircle,
  Users
} from 'lucide-react';
import { api } from '../../lib/api';
import { Employee, Department, EmployeeStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { toast } from 'sonner';

export function EmployeesPage() {
  const queryClient = useQueryClient();

  // Search, Filtering, & Pagination State
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [departmentId, setDepartmentId] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const limit = 6;

  // Sync debounced search to avoid rapid refetch
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 on search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  // Queries
  const { data: employeesData, isLoading: employeesLoading, error: employeesError } = useQuery<{
    items: Employee[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasPrev: boolean;
      hasNext: boolean;
    };
  }>({
    queryKey: ['employees', { search: debouncedSearch, departmentId, status, page, limit }],
    queryFn: async () => {
      const res = await api.get('/api/employees', {
        params: { search: debouncedSearch, departmentId, status, page, limit }
      });
      return res.data;
    }
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/api/departments');
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newEmp: Omit<Employee, 'id' | 'departmentName'>) => {
      const res = await api.post('/api/employees', newEmp);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] }); // count incremented
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Success: Record for ${data.name} established.`);
      setIsAddOpen(false);
    },
    onError: (err: any) => {
      toast.error(`Error adding employee: ${err.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const res = await api.put(`/api/employees/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] }); // counts may have changed
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Success: Records for ${data.name} amended.`);
      setIsEditOpen(false);
      setSelectedEmployee(null);
    },
    onError: (err: any) => {
      toast.error(`Error updating record: ${err.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/employees/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Record successfully purged from registry.');
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
    },
    onError: (err: any) => {
      toast.error(`Error purging record: ${err.message}`);
    }
  });

  // Forms
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd, isSubmitting: isSubmittingAdd }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      departmentId: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active' as EmployeeStatus
    }
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      departmentId: '',
      joiningDate: '',
      status: 'Active' as EmployeeStatus
    }
  });

  // Form submit triggers
  const onAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: any) => {
    if (!selectedEmployee) return;
    updateMutation.mutate({ id: selectedEmployee.id, data });
  };

  // Open Actions Handles
  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    resetEdit({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      departmentId: employee.departmentId,
      joiningDate: employee.joiningDate,
      status: employee.status
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('all');
    setStatus('all');
    setPage(1);
    toast.success('Filtering states reset to default directory.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Employee Directory
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track, query, and manage your global staff payroll records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { resetAdd(); setIsAddOpen(true); }} size="sm" className="gap-1.5 shadow">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-50/20 dark:bg-zinc-950"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Dept:</span>
            <Select 
              value={departmentId} 
              onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
              className="min-w-[140px] text-xs h-9 bg-zinc-50/20"
            >
              <option value="all">All Departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Status:</span>
            <Select 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="min-w-[120px] text-xs h-9 bg-zinc-50/20"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </div>

          {(search || departmentId !== 'all' || status !== 'all') && (
            <Button onClick={handleResetFilters} variant="ghost" size="sm" className="h-9 px-3 text-xs text-zinc-500 hover:text-zinc-800">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* 3. Core Directory Data Content display */}
      {employeesLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : employeesError ? (
        <ErrorState message={(employeesError as any).message} onRetry={() => queryClient.invalidateQueries({ queryKey: ['employees'] })} />
      ) : !employeesData || employeesData.items.length === 0 ? (
        <EmptyState
          title="No Employee Records Found"
          description="We couldn't find any workforce accounts matching your active query. Try expanding filters or add a new record."
          actionText={search || departmentId !== 'all' || status !== 'all' ? "Reset All Filters" : "Create First Employee"}
          onAction={search || departmentId !== 'all' || status !== 'all' ? handleResetFilters : () => setIsAddOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-850 shadow-sm bg-white dark:bg-zinc-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Employee details</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesData.items.map((emp) => (
                  <TableRow key={emp.id} className="group">
                    {/* Column 1: Details */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={emp.avatarUrl} 
                            alt={emp.name} 
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 min-w-10 rounded-full object-cover border border-zinc-150/40"
                          />
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${
                            emp.status === 'Active' ? 'bg-green-500' : emp.status === 'On Leave' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <div className="flex flex-col text-left truncate">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 transition-colors">{emp.name}</span>
                          <span className="text-xs text-zinc-450 font-mono truncate">{emp.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Column 2: Department */}
                    <TableCell>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-1 select-none border border-zinc-200/20">
                        {emp.departmentName}
                      </span>
                    </TableCell>

                    {/* Column 3: Position */}
                    <TableCell className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {emp.position}
                    </TableCell>

                    {/* Column 4: Joining Date */}
                    <TableCell className="text-xs font-medium text-zinc-550 dark:text-zinc-400 font-mono">
                      {emp.joiningDate}
                    </TableCell>

                    {/* Column 5: Status */}
                    <TableCell>
                      <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'destructive'} className="text-[10px] uppercase font-mono px-2 tracking-wider">
                        {emp.status}
                      </Badge>
                    </TableCell>

                    {/* Column 6: Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button 
                          onClick={() => handleOpenEdit(emp)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
                          title="Modify Record"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={() => handleOpenDelete(emp)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                          title="Delete Account"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination bar controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-400 font-mono">
              Displaying {employeesData.items.length} of {employeesData.pagination.totalCount} accounts
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!employeesData.pagination.hasPrev}
                variant="outline"
                size="sm"
                className="h-8 text-xs cursor-pointer"
              >
                Prev
              </Button>
              <div className="text-xs font-bold px-3 font-mono">
                {employeesData.pagination.page} / {employeesData.pagination.totalPages || 1}
              </div>
              <Button
                onClick={() => setPage(p => Math.min(employeesData.pagination.totalPages, p + 1))}
                disabled={!employeesData.pagination.hasNext}
                variant="outline"
                size="sm"
                className="h-8 text-xs cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALS & FORMS DIALOGS */}

      {/* Dialog: ADD Employee */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Employee Account"
        description="Flesh out directory variables. Department aggregates recalculate on successful submission."
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Field: Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Full Name</label>
              <Input
                type="text"
                placeholder="Sarah Connor"
                error={!!errorsAdd.name}
                {...registerAdd('name', { required: 'Name is required' })}
              />
              {errorsAdd.name && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.name.message}</p>}
            </div>

            {/* Field: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Corporate Email</label>
              <Input
                type="email"
                placeholder="sarah.c@stellarsaas.com"
                error={!!errorsAdd.email}
                {...registerAdd('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[S|A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid corporate syntax' }
                })}
              />
              {errorsAdd.email && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.email.message}</p>}
            </div>

            {/* Field: Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Contact Phone</label>
              <Input
                type="text"
                placeholder="+1 (555) 555-1212"
                error={!!errorsAdd.phone}
                {...registerAdd('phone', { required: 'Phone reference is required' })}
              />
              {errorsAdd.phone && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.phone.message}</p>}
            </div>

            {/* Field: Position Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Position Level</label>
              <Input
                type="text"
                placeholder="DevOps Lead"
                error={!!errorsAdd.position}
                {...registerAdd('position', { required: 'Position title is required' })}
              />
              {errorsAdd.position && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.position.message}</p>}
            </div>

            {/* Field: Department (Dynamic select box loaded from query client) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Operating Department</label>
              <Select
                error={!!errorsAdd.departmentId}
                {...registerAdd('departmentId', { required: 'Department allocation is required' })}
              >
                <option value="">Choose department...</option>
                {departments?.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Select>
              {errorsAdd.departmentId && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.departmentId.message}</p>}
            </div>

            {/* Field: Joining Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Joining Date</label>
              <Input
                type="date"
                error={!!errorsAdd.joiningDate}
                {...registerAdd('joiningDate', { required: 'Joining date is needed' })}
              />
              {errorsAdd.joiningDate && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.joiningDate.message}</p>}
            </div>

            {/* Field: Status */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Employment Status</label>
              <Select {...registerAdd('status')}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </div>

          </div>

          {/* Dialog Action Footers */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingAdd || createMutation.isPending}>
              Create Account
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Dialog: EDIT Employee */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedEmployee(null); }}
        title="Amending Directory Record"
        description="Rewrite operating status, positions, departments or credentials. State history locks automatically."
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Field: Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Full Name</label>
              <Input
                type="text"
                error={!!errorsEdit.name}
                {...registerEdit('name', { required: 'Name is required' })}
              />
              {errorsEdit.name && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.name.message}</p>}
            </div>

            {/* Field: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Corporate Email</label>
              <Input
                type="email"
                error={!!errorsEdit.email}
                {...registerEdit('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[S|A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid corporate syntax' }
                })}
              />
              {errorsEdit.email && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.email.message}</p>}
            </div>

            {/* Field: Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Contact Phone</label>
              <Input
                type="text"
                error={!!errorsEdit.phone}
                {...registerEdit('phone', { required: 'Phone reference is required' })}
              />
              {errorsEdit.phone && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.phone.message}</p>}
            </div>

            {/* Field: Position Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Position Level</label>
              <Input
                type="text"
                error={!!errorsEdit.position}
                {...registerEdit('position', { required: 'Position details are required' })}
              />
              {errorsEdit.position && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.position.message}</p>}
            </div>

            {/* Field: Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Operating Division</label>
              <Select
                error={!!errorsEdit.departmentId}
                {...registerEdit('departmentId', { required: 'Allocation division required' })}
              >
                {departments?.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Select>
              {errorsEdit.departmentId && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.departmentId.message}</p>}
            </div>

            {/* Field: Joining Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Joining Date</label>
              <Input
                type="date"
                error={!!errorsEdit.joiningDate}
                {...registerEdit('joiningDate', { required: 'Joining date is needed' })}
              />
              {errorsEdit.joiningDate && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.joiningDate.message}</p>}
            </div>

            {/* Field: Status */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Employment Status</label>
              <Select {...registerEdit('status')}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </div>

          </div>

          {/* Dialog Action Footers */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => { setIsEditOpen(false); setSelectedEmployee(null); }}
            >
              Cancel Amendments
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingEdit || updateMutation.isPending}>
              Commit Updates
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Dialog: DELETE confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedEmployee(null); }}
        title="Confirm Record Deletion"
        description="Caution: This operation is destructive and cannot be undone. All active payroll integrations for this account will freeze."
      >
        <div className="space-y-5">
          {selectedEmployee && (
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-4 text-left flex gap-3 text-sm">
              <XCircle className="h-5 w-5 text-red-550 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-50">{selectedEmployee.name}</p>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 font-mono mt-0.5">{selectedEmployee.position} • {selectedEmployee.departmentName}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-zinc-500 leading-normal">
            By purging this resource from the server, you revoke system login authorization. Standard operational history retains denormalized entries for audit compliance.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsDeleteOpen(false); setSelectedEmployee(null); }}
            >
              Keep Record
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => { if (selectedEmployee) deleteMutation.mutate(selectedEmployee.id); }}
            >
              Confirm Purge
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
export default EmployeesPage;
