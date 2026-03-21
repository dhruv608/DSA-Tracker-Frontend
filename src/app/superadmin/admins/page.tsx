"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, Admin } from '@/services/admin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Pagination } from '@/components/Pagination';
import { Search, Users, Trash2, Edit, Filter } from 'lucide-react';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

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
      const [adminsRes, citiesRes, batchesRes] = await Promise.all([
        getAllAdmins().catch(()=>[]),
        getAllCities().catch(()=>[]),
        getAllBatches().catch(()=>[])
      ]);
      setAdmins(Array.isArray(adminsRes) ? adminsRes : []);
      setCities(Array.isArray(citiesRes) ? citiesRes : []);
      setBatches(Array.isArray(batchesRes) ? batchesRes : []);
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
    
    // Auto-select city and year if possible based on batch_id
    if (admin.batch_id) {
      const b = batches.find(b => b.id === admin.batch_id);
      if (b) {
        setSelectedCity(String(b.city_id));
        setSelectedYear(String(b.year));
      }
    } else {
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
      const matchSearch = (a.name+a.email).toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole ? a.role === filterRole : true;
      return matchSearch && matchRole;
    });
  }, [admins, search, filterRole]);

  const paginatedAdmins = useMemo(() => {
    return filtered.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filtered, currentPage]);

  // Derived arrays for dynamic dropdowns
  const availableYears = useMemo(() => {
    if (!selectedCity) return [];
    const cityBatches = batches.filter(b => b.city_id === Number(selectedCity));
    const years = new Set(cityBatches.map(b => b.year));
    return Array.from(years).sort((a,b)=>b-a);
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

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:max-w-xs group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input 
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9"
            />
          </div>
          <Select 
            value={filterRole} 
            onChange={v => { setFilterRole(String(v)); setCurrentPage(1); }}
            options={[
              { label: 'All Roles', value: '' },
              { label: 'SUPERADMIN', value: 'SUPERADMIN' },
              { label: 'ADMIN', value: 'ADMIN' },
              { label: 'TEACHER', value: 'TEACHER' },
              { label: 'INTERN', value: 'INTERN' },
            ]}
            className="w-full sm:max-w-[150px]"
            icon={<Filter className="w-4 h-4" />}
          />
          {(filterRole || search) && (
             <button onClick={() => {setFilterRole(''); setSearch('');}} className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-4">Clear</button>
          )}
        </div>
        
        <Button onClick={openCreate} className="w-full sm:w-auto shrink-0">
          <Users className="w-4 h-4 mr-2" />
          Create Admin
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <h2 className="font-semibold">Admins</h2>
          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-background border rounded-md">
            {filtered.length} found
          </span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>City &amp; Batch</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground animate-pulse">Loading admins...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matches found.</TableCell>
              </TableRow>
            ) : (
              paginatedAdmins.map((admin) => {
                let badgeClass = "bg-accent/30 text-accent-foreground border-accent/60";
                if (admin.role === 'TEACHER') badgeClass = "bg-primary/20 text-primary-foreground border-primary/40 text-primary";
                else if (admin.role === 'INTERN') badgeClass = "bg-chart-5/20 text-chart-5 border-chart-5/40";
                else if (admin.role === 'SUPERADMIN') badgeClass = "bg-destructive/10 text-destructive border-destructive/20";

                const adminBatch = batches.find(b => b.id === admin.batch_id);
                const adminCity = cities.find(c => c.id === adminBatch?.city_id);

                return (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <span className="font-semibold text-foreground truncate max-w-[200px] block">{admin.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs truncate max-w-[200px]">
                      {admin.email}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${badgeClass}`}>
                        {admin.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {adminCity ? `${adminCity.city_name} — ` : ''} 
                      {adminBatch ? adminBatch.batch_name : 'No batch'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(admin)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setTargetAdmin(admin); setDelOpen(true); }} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        {!loading && filtered.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalItems={filtered.length} 
            limit={limit} 
            onPageChange={setCurrentPage} 
          />
        )}
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
              <label className="text-sm font-medium leading-none">Full Name {modalMode==='create'&&'*'}</label>
              <Input 
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={submitting || modalMode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email {modalMode==='create'&&'*'}</label>
              <Input 
                type="email"
                placeholder="admin@dsa.in"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={submitting}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Role *</label>
              <Select 
                value={formData.role}
                onChange={v => setFormData({...formData, role: String(v)})}
                options={[
                  { label: 'TEACHER', value: 'TEACHER' },
                  { label: 'INTERN', value: 'INTERN' },
                  { label: 'ADMIN', value: 'ADMIN' },
                  { label: 'SUPERADMIN', value: 'SUPERADMIN' }
                ]}
                disabled={submitting}
              />
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Assignment</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-xs font-medium leading-none text-muted-foreground">City Filter (Optional)</label>
                <Select 
                  value={selectedCity}
                  onChange={(v) => {
                    setSelectedCity(String(v));
                    setSelectedYear(''); // reset dependencies
                    setFormData({...formData, batch_id: ''});
                  }}
                  options={[{ label: 'Any City', value: '' }, ...cities.map(c => ({ label: c.city_name, value: String(c.id) }))]}
                  className="w-full"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium leading-none text-muted-foreground">Year Filter (Optional)</label>
                <Select 
                  value={selectedYear}
                  onChange={(v) => {
                    setSelectedYear(String(v));
                    setFormData({...formData, batch_id: ''});
                  }}
                  options={[{ label: 'Any Year', value: '' }, ...availableYears.map(y => ({ label: String(y), value: String(y) }))]}
                  className="w-full"
                  disabled={submitting || !selectedCity || availableYears.length === 0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Batch Assignment</label>
              <Select 
                value={formData.batch_id}
                onChange={v => setFormData({...formData, batch_id: String(v)})}
                options={[
                  { label: availableBatches.length === 0 ? "No batches match filters" : "Select Batch (Optional)", value: '' },
                  ...availableBatches.map(b => ({ label: `${b.batch_name} (${b.year})`, value: String(b.id) }))
                ]}
                disabled={submitting || availableBatches.length === 0}
              />
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

      <Modal isOpen={isDelOpen} onClose={() => setDelOpen(false)} title="Delete Admin?" subtitle="This action cannot be undone." icon={<Trash2 className="text-destructive w-6 h-6" />}>
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Are you sure you want to delete <span className="text-destructive font-bold">{targetAdmin?.name}</span>?</p>
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mt-2">
            ⚠️ The admin will lose access immediately to all system platforms.
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>Delete Admin</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
