"use client";

import { useEffect, useState, useMemo } from 'react';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, Admin, getAdminRoles } from '@/services/admin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from '@/components/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/Pagination';
import { ActionButtons } from '@/components/ActionButtons';
import { DeleteModal } from '@/components/DeleteModal';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, Filter } from 'lucide-react';
import { AdminFilters } from '@/components/superadmin/admins/AdminFilters';


export default function AdminsPage() {

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [targetAdmin, setTargetAdmin] = useState<Admin | null>(null);
  const [isDelOpen, setDelOpen] = useState(false);

  // Dynamic Form State for "Create Admin"
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'TEACHER', batch_id: ''
  });
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsRes, citiesRes, batchesRes, rolesRes] = await Promise.all([
        getAllAdmins().catch(() => []),
        getAllCities().catch(() => []),
        getAllBatches().catch(() => []),
        getAdminRoles().catch(() => [])
      ]);
      setAdmins(Array.isArray(adminsRes) ? adminsRes : []);
      setCities(Array.isArray(citiesRes) ? citiesRes : []);
      setBatches(Array.isArray(batchesRes) ? batchesRes : []);
      setRoles(Array.isArray(rolesRes) ? rolesRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', password: '', role: 'TEACHER', batch_id: '' });
    setSelectedCity('');
    setSelectedYear('');
    setTargetAdmin(null);
    setModalOpen(true);
  };

  const openEdit = (admin: Admin) => {
    setModalMode('edit');
    setTargetAdmin(admin);
    // When editing, password is not updated here, name/email are readonly per wireframe.
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      batch_id: admin.batch_id ? String(admin.batch_id) : ''
    });

    // Auto-select city and year based on admin's batch information
    if (admin.batch) {
      // Use the nested batch object if available
      setSelectedCity(String(admin.batch.city_id));
      setSelectedYear(String(admin.batch.year));
      setFormData(prev => ({ ...prev, batch_id: String(admin.batch!.id) }));
    } else if (admin.batch_id) {
      // Fallback to finding batch in batches array
      const b = batches.find(b => b.id === admin.batch_id);
      if (b) {
        setSelectedCity(String(b.city_id));
        setSelectedYear(String(b.year));
        setFormData(prev => ({ ...prev, batch_id: String(admin.batch_id) }));
      } else {
        // If batch not found in local array, reset dropdowns
        setSelectedCity('');
        setSelectedYear('');
      }
    } else {
      // No batch assigned
      setSelectedCity('');
      setSelectedYear('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    // If edit, we just update role & batch_id (refer to admin.controller logic)
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const payload: any = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };
        if (formData.batch_id) payload.batch_id = Number(formData.batch_id);

        await createAdmin(payload);
      } else if (targetAdmin) {
        // Edit mode (patch)
        const payload: any = { role: formData.role };
        if (formData.batch_id) payload.batch_id = Number(formData.batch_id);
        await updateAdmin(targetAdmin.id, payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!targetAdmin) return;
    setSubmitting(true);
    try {
      await deleteAdmin(targetAdmin.id);
      setDelOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to delete admin.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return admins.filter(a => {
      const matchSearch = (a.name + a.email).toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole ? a.role === filterRole : true;
      return matchSearch && matchRole;
    });
  }, [admins, search, filterRole]);

  const paginatedAdmins = useMemo(() => {
    return filtered.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filtered, currentPage, limit]);

  // Derived arrays for dynamic dropdowns
  const availableYears = useMemo(() => {
    if (!selectedCity) return [];
    const cityBatches = batches.filter(b => b.city_id === Number(selectedCity));
    const years = new Set(cityBatches.map(b => b.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [selectedCity, batches]);

  const availableBatches = useMemo(() => {
    let filtered = batches;
    if (selectedCity) filtered = filtered.filter(b => b.city_id === Number(selectedCity));
    if (selectedYear) filtered = filtered.filter(b => String(b.year) === selectedYear);
    return filtered;
  }, [selectedCity, selectedYear, batches]);

  return (
    <div className="space-y-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Admin Management</h2>
        <p className="text-sm text-muted-foreground">Create and manage all administrators, assign cities and batches.</p>
      </div>

      <AdminFilters
        search={search}
        onSearchChange={setSearch}
        filterRole={filterRole}
        onRoleChange={v => { setFilterRole(v === 'all' ? '' : v); setCurrentPage(1); }}
        onCreateAdmin={openCreate}
        roles={roles}
      />

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300">


        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (

              <TableSkeleton row={
                <TableRow>
                  <TableCell><Skeleton className="h-5 w-[160px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              } />
            )
              : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No matches found </TableCell>
                </TableRow>
              )
                : (
                  paginatedAdmins.map((admin) => {
                    let badgeClass = "bg-accent/50 text-accent-foreground border-accent/60";
                    if (admin.role === 'TEACHER') badgeClass = "bg-primary/20 text-primary-foreground border-primary/40 text-primary";
                    else if (admin.role === 'INTERN') badgeClass = "bg-chart-5/20 text-chart-5 border-chart-5/40";
                    else if (admin.role === 'SUPERADMIN') badgeClass = "bg-destructive/10 text-destructive border-destructive/20";

                    const adminBatch = admin.batch;
                    const adminCity = admin.city;

                    return (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <span className="font-semibold text-foreground truncate max-w-[200px] block">{admin.name}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs truncate max-w-[200px]">
                          {admin.email}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/30 text-primary`}>
                            {admin.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {admin.role === 'SUPERADMIN' ? <span className="opacity-50">—</span> : (adminCity?.city_name || <span className="opacity-50">Unassigned</span>)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {admin.role === 'SUPERADMIN' ? <span className="opacity-50">—</span> : (adminBatch?.batch_name || <span className="opacity-50">Unassigned</span>)}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-1">
                          <ActionButtons
                            onEdit={() => openEdit(admin)}
                            onDelete={() => { setTargetAdmin(admin); setDelOpen(true); }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
          </TableBody>
        </Table>


        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          limit={limit}
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
          showLimitSelector={true}
          loading={loading}
        />

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? "Create New Admin" : "Edit Admin"}
        subtitle={modalMode === 'create' ? "Assign city and batch to determine data access permissions" : "Name and email are read-only when editing."}
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Full Name {modalMode === 'create' && '*'}</label>
              <Input
                placeholder="e.g. Satya Sai"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting || modalMode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email {modalMode === 'create' && '*'}</label>
              <Input
                type="email"
                placeholder="admin@dsa.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={submitting || modalMode === 'edit'}
              />
            </div>
            {modalMode === 'create' && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password *</label>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={submitting}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Role *</label>
              <Select
                value={formData.role || "TEACHER"}
                onValueChange={v => setFormData({ ...formData, role: v })}
                disabled={submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(r => r !== 'SUPERADMIN').map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Assignment</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-xs font-medium leading-none text-muted-foreground">City Filter (Optional)</label>
                <Select
                  value={selectedCity || "any"}
                  onValueChange={(v) => {
                    setSelectedCity(v === 'any' ? '' : v);
                    setSelectedYear(''); // reset dependencies
                    setFormData({ ...formData, batch_id: '' });
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Any City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any City</SelectItem>
                    {cities.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.city_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium leading-none text-muted-foreground">Year Filter (Optional)</label>
                <Select
                  value={selectedYear || "any"}
                  onValueChange={(v) => {
                    setSelectedYear(v === 'any' ? '' : v);
                    setFormData({ ...formData, batch_id: '' });
                  }}
                  disabled={submitting || (!selectedCity && !selectedYear)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Any Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Year</SelectItem>
                    {availableYears.map(y => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Batch Assignment</label>
              <Select
                value={formData.batch_id || "none"}
                onValueChange={v => setFormData({ ...formData, batch_id: v === 'none' ? '' : v })}
                disabled={submitting || (!selectedCity && !selectedYear && !formData.batch_id)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={availableBatches.length === 0 ? "No batches match filters" : "Select Batch (Optional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{availableBatches.length === 0 ? "No batches match filters" : "Select Batch (Optional)"}</SelectItem>
                  {availableBatches.map(b => (
                    <SelectItem key={b.id} value={String(b.id)}>{b.batch_name} ({b.year})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || (modalMode === 'create' && (!formData.name || !formData.email || !formData.password || !formData.role))}
            >
              {modalMode === 'create' ? 'Create Admin' : 'Update Admin'}
            </Button>
          </div>
        </div>
      </Modal>


      <DeleteModal
        isOpen={isDelOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        submitting={submitting}
        title="Delete Admin"
        itemName={targetAdmin?.name}
        warningText="The admin will lose access immediately to all system platforms."
      />

    </div>
  );
}
