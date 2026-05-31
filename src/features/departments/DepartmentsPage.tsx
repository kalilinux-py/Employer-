import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  PercentCircle, 
  Users2, 
  Briefcase,
  AlertTriangle 
} from 'lucide-react';
import { api } from '../../lib/api';
import { Department } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { toast } from 'sonner';

export function DepartmentsPage() {
  const queryClient = useQueryClient();

  // Dialog Visibility states
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  
  const [selectedDept, setSelectedDept] = React.useState<Department | null>(null);

  // Queries
  const { data: departments, isLoading, error, refetch } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/api/departments');
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newDept: Omit<Department, 'id' | 'employeeCount'>) => {
      const res = await api.post('/api/departments', newDept);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Success: Division "${data.name}" established under manager ${data.managerName}.`);
      setIsAddOpen(false);
    },
    onError: (err: any) => {
      toast.error(`Establishment failed: ${err.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<Department, 'id' | 'employeeCount'> }) => {
      const res = await api.put(`/api/departments/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] }); // denormalized names might have synced
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Success: Charter for "${data.name}" updated successfully.`);
      setIsEditOpen(false);
      setSelectedDept(null);
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/departments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Department charter de-registered successfully.');
      setIsDeleteOpen(false);
      setSelectedDept(null);
    },
    onError: (err: any) => {
      toast.error(`Purging division failed: ${err.message}`);
    }
  });

  // Forms Binding
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd, isSubmitting: isSubmittingAdd }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      managerName: '',
      budget: ''
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
      description: '',
      managerName: '',
      budget: ''
    }
  });

  // Submit triggers
  const onAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: any) => {
    if (!selectedDept) return;
    updateMutation.mutate({ id: selectedDept.id, data });
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    resetEdit({
      name: dept.name,
      description: dept.description,
      managerName: dept.managerName,
      budget: dept.budget
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (dept: Department) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Corporate Divisions
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Define corporate structures, manager charters, and operational budgeting ceilings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { resetAdd(); setIsAddOpen(true); }} size="sm" className="gap-1.5 shadow">
            <Plus className="h-4 w-4" /> Add Department
          </Button>
        </div>
      </div>

      {/* 2. Core Grid List view */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : error ? (
        <ErrorState message={(error as any).message} onRetry={refetch} />
      ) : !departments || departments.length === 0 ? (
        <EmptyState
          title="No Departments Drafted"
          description="Establish your corporate organizational architecture. Added divisions resolve filter scopes."
          actionText="Draft First Division"
          onAction={() => setIsAddOpen(true)}
          icon={<Building2 className="h-10 w-10 text-zinc-400" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-850 shadow-sm bg-white dark:bg-zinc-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Department Name</TableHead>
                  <TableHead className="w-[380px]">Operational Scope & Charter</TableHead>
                  <TableHead>Director / Manager</TableHead>
                  <TableHead>Total staff</TableHead>
                  <TableHead>Budget Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id} className="group">
                    {/* Column 1: Name */}
                    <TableCell className="font-bold text-zinc-900 dark:text-zinc-50 select-text">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                          <Building2 className="h-4 w-4" />
                        </div>
                        {dept.name}
                      </div>
                    </TableCell>

                    {/* Column 2: Scope description */}
                    <TableCell className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm font-medium leading-relaxed">
                      {dept.description}
                    </TableCell>

                    {/* Column 3: Manager */}
                    <TableCell className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {dept.managerName}
                    </TableCell>

                    {/* Column 4: Employee Count badge */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-350">
                        <Users2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        {dept.employeeCount} headcount
                      </div>
                    </TableCell>

                    {/* Column 5: Financial budget */}
                    <TableCell className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                      {dept.budget}
                    </TableCell>

                    {/* Column 6: Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button 
                          onClick={() => handleOpenEdit(dept)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={() => handleOpenDelete(dept)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                          title="Dissolve Division"
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
        </div>
      )}

      {/* 3. MODALS & DIALOG ACTIONS */}

      {/* Dialog: ADD Department */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Establish Department Charter"
        description="Configure target budgets and division alignment. Budget caps evaluate quarterly."
      >
        <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
          <div className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Department Name</label>
              <Input
                type="text"
                placeholder="Product Operations"
                error={!!errorsAdd.name}
                {...registerAdd('name', { required: 'Division name is required' })}
              />
              {errorsAdd.name && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.name.message}</p>}
            </div>

            {/* Manager Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Managing Director Name</label>
              <Input
                type="text"
                placeholder="Elizabeth Bennet"
                error={!!errorsAdd.managerName}
                {...registerAdd('managerName', { required: 'Director reference is required' })}
              />
              {errorsAdd.managerName && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.managerName.message}</p>}
            </div>

            {/* Budget Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Authorized Budget Roster Limit</label>
              <Input
                type="text"
                placeholder="$450,000"
                error={!!errorsAdd.budget}
                {...registerAdd('budget', { required: 'Financial authorization ceiling is required' })}
              />
              {errorsAdd.budget && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.budget.message}</p>}
            </div>

            {/* Description Scope */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Charter Scope (Description)</label>
              <textarea
                placeholder="Define strategic alignment, scope limits, resource parameters..."
                className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-500"
                {...registerAdd('description', { required: 'Operational scope description is required' })}
              />
              {errorsAdd.description && <p className="text-[10px] text-red-500 font-medium">{errorsAdd.description.message}</p>}
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850 mt-6">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
              Discard Charter
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingAdd || createMutation.isPending}>
              Charter Division
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Dialog: EDIT Department */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedDept(null); }}
        title="Amending Department Charter"
        description="Amending budget details or manager director reference. Registered headcount metrics are locked."
      >
        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
          <div className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Department Name</label>
              <Input
                type="text"
                error={!!errorsEdit.name}
                {...registerEdit('name', { required: 'Division name is required' })}
              />
              {errorsEdit.name && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.name.message}</p>}
            </div>

            {/* Manager Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Managing Director Name</label>
              <Input
                type="text"
                error={!!errorsEdit.managerName}
                {...registerEdit('managerName', { required: 'Director reference is required' })}
              />
              {errorsEdit.managerName && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.managerName.message}</p>}
            </div>

            {/* Budget Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Authorized Budget Limit</label>
              <Input
                type="text"
                error={!!errorsEdit.budget}
                {...registerEdit('budget', { required: 'Budget limit ceiling is required' })}
              />
              {errorsEdit.budget && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.budget.message}</p>}
            </div>

            {/* Description Scope */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Charter Scope (Description)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-500"
                {...registerEdit('description', { required: 'Scope description required' })}
              />
              {errorsEdit.description && <p className="text-[10px] text-red-500 font-medium">{errorsEdit.description.message}</p>}
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => { setIsEditOpen(false); setSelectedDept(null); }}
            >
              Cancel Amendments
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingEdit || updateMutation.isPending}>
              Commit updates
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Dialog: DELETE Dept Confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedDept(null); }}
        title="Confirm Department Dissolution"
        description="Caution: Dissolving division charters is a highly sensitive action. System will reject requests if active headcounts exist."
      >
        <div className="space-y-5">
          {selectedDept && (
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-4 text-left flex gap-3 text-sm">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-50">{selectedDept.name}</p>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 font-mono mt-0.5">Manager: {selectedDept.managerName} • Current Headcount: {selectedDept.employeeCount}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 leading-relaxed">
            The database will block the deletion of this department if there are registered staff members currently allocated to it. You must re-assign accounts in the directory page first before completing character dissolution.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsDeleteOpen(false); setSelectedDept(null); }}
            >
              Retain Charter
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => { if (selectedDept) deleteMutation.mutate(selectedDept.id); }}
            >
              Confirm Dissolution
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
export default DepartmentsPage;
