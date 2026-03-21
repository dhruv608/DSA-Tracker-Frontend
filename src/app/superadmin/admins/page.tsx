"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, Admin } from '@/services/admin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Modal } from '@/components/Modal';
import { Search, Users, Trash2, Edit } from 'lucide-react';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

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
      
      {/* Banner matching wireframe style indirectly via Tailwind classes */}
      <div className="bg-gradient-to-br from-accent/50 to-background border border-border/80 rounded-2xl p-6 mb-8 flex items-center gap-5 overflow-hidden relative shadow-sm">
        <div className="flex-1 relative z-10">
          <h2 className="text-xl font-bold font-serif italic text-foreground mb-1">Admin Management</h2>
          <p className="text-[13px] text-muted-foreground">Create and manage all administrators · assign cities and batches</p>
        </div>
        <div className="relative z-10 p-4 bg-background/50 backdrop-blur rounded-full shrink-0 animate-bounce transition-all duration-3000 border border-border">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-xs group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-[13px] shadow-sm font-sans"
            />
          </div>
          <select 
            value={filterRole} onChange={e => setFilterRole(e.target.value)}
            className="w-full sm:max-w-[150px] px-3 py-2 bg-background border border-border rounded-xl text-[13px] cursor-pointer focus:border-primary outline-none"
          >
            <option value="">All Roles</option>
            <option value="SUPERADMIN">SUPERADMIN</option>
            <option value="TEACHER">TEACHER</option>
            <option value="INTERN">INTERN</option>
          </select>
          {(filterRole || search) && (
            <button onClick={() => {setFilterRole(''); setSearch('');}} className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-4">Clear</button>
          )}
        </div>
        
        <button 
          onClick={openCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-[13px] text-primary-foreground font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Users className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground">Admins</h2>
          <span className="text-[11px] font-mono font-medium tracking-wide bg-background border border-border px-2.5 py-1 rounded-full text-muted-foreground">
            {filtered.length} found
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-[10px] uppercase font-mono tracking-[0.1em] text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium min-w-[200px]">Admin Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">City &amp; Batch</th>
                <th className="px-6 py-4 font-medium right-0">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading admins...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No matches found.</td>
                </tr>
              ) : (
                filtered.map((admin) => {
                  let badgeClass = "bg-accent/30 text-accent-foreground border-accent/60";
                  if (admin.role === 'TEACHER') badgeClass = "bg-primary/20 text-primary-foreground border-primary/40 text-primary";
                  else if (admin.role === 'INTERN') badgeClass = "bg-chart-5/20 text-chart-5 border-chart-5/40";
                  else if (admin.role === 'SUPERADMIN') badgeClass = "bg-destructive/10 text-destructive border-destructive/20";

                  const adminBatch = batches.find(b => b.id === admin.batch_id);
                  const adminCity = cities.find(c => c.id === adminBatch?.city_id);

                  return (
                    <tr key={admin.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground truncate max-w-[200px] block">{admin.name}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-[12px] truncate max-w-[200px]">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${badgeClass}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-muted-foreground whitespace-nowrap">
                        {adminCity ? `${adminCity.city_name} — ` : ''} 
                        {adminBatch ? adminBatch.batch_name : 'No batch'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEdit(admin)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setTargetAdmin(admin); setDelOpen(true); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalMode === 'create' ? "Create New Admin" : "Edit Admin"} 
        subtitle={modalMode === 'create' ? "Assign city and batch to determine data access permissions" : "Name and email are read-only when editing."}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name {modalMode==='create'&&'*'}</label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none transition-all disabled:opacity-60 disabled:bg-muted/50"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={submitting || modalMode === 'edit'}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email {modalMode==='create'&&'*'}</label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none transition-all disabled:opacity-60 disabled:bg-muted/50"
                type="email"
                placeholder="admin@dsa.in"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={submitting || modalMode === 'edit'}
              />
            </div>
            {modalMode === 'create' && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Password *</label>
                <input 
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none transition-all"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={submitting}
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role *</label>
              <select 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                disabled={submitting}
              >
                <option value="TEACHER">TEACHER</option>
                <option value="INTERN">INTERN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mt-2">
            <h3 className="text-xs font-semibold text-foreground mb-3 tracking-wide">ASSIGNMENT</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">City Filter (Optional)</label>
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:border-primary outline-none cursor-pointer"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedYear(''); // reset dependencies
                    setFormData({...formData, batch_id: ''});
                  }}
                  disabled={submitting}
                >
                  <option value="">Any City</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Year Filter (Optional)</label>
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:border-primary outline-none cursor-pointer disabled:opacity-50"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setFormData({...formData, batch_id: ''});
                  }}
                  disabled={submitting || !selectedCity || availableYears.length === 0}
                >
                  <option value="">Any Year</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Batch Assignment</label>
              <select 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary outline-none cursor-pointer disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSdib25lJyBoZWlnaHQ9JzIwJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyBzdHJva2Utd2lkdGg9JzInIHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9JzIwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwb2x5bGluZSBwb2ludHM9JzYgOSAxMiAxNSAxOCA5Jy8+PC9zdmc+')] bg-no-repeat bg-[position:calc(100%-12px)_center]"
                value={formData.batch_id}
                onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
                disabled={submitting || availableBatches.length === 0}
              >
                <option value="">{availableBatches.length === 0 ? "No batches match filters" : "Select Batch (Optional)"}</option>
                {availableBatches.map(b => (
                  <option key={b.id} value={b.id}>{b.batch_name} ({b.year})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-[13px] font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={submitting || (modalMode === 'create' && (!formData.name || !formData.email || !formData.password || !formData.role))} 
              className="px-4 py-2 text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50"
            >
              {modalMode === 'create' ? 'Create Admin' : 'Update Admin'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isDelOpen} 
        onClose={() => setDelOpen(false)} 
        title="Delete Admin?" 
        subtitle="This action cannot be undone." 
        icon={<Trash2 className="text-destructive w-8 h-8" />}
      >
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Are you sure you want to delete <span className="text-destructive font-bold">{targetAdmin?.name}</span>?</p>
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl font-medium mt-2">
            ⚠️ The admin will lose access immediately to all system platforms.
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button onClick={() => setDelOpen(false)} className="px-4 py-2 text-[13px] font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="px-4 py-2 text-[13px] font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors disabled:opacity-50">Delete Admin</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
