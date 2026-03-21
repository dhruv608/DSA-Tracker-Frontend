"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllBatches, createBatch, updateBatch, deleteBatch, Batch } from '@/services/batch.service';
import { getAllCities, City } from '@/services/city.service';
import { Modal } from '@/components/Modal';
import { Search, Layers, Trash2, Edit } from 'lucide-react';

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [targetBatch, setTargetBatch] = useState<Batch | null>(null);
  const [isDelOpen, setDelOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ batch_name: '', year: new Date().getFullYear(), city_id: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchesRes, citiesRes] = await Promise.all([
        getAllBatches().catch(()=>[]),
        getAllCities().catch(()=>[])
      ]);
      setBatches(Array.isArray(batchesRes) ? batchesRes : []);
      setCities(Array.isArray(citiesRes) ? citiesRes : []);
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
    setFormData({ batch_name: '', year: new Date().getFullYear(), city_id: '' });
    setTargetBatch(null);
    setModalOpen(true);
  };

  const openEdit = (batch: Batch) => {
    setModalMode('edit');
    setTargetBatch(batch);
    setFormData({ batch_name: batch.batch_name, year: batch.year, city_id: String(batch.city_id) });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.batch_name || !formData.year || !formData.city_id) return;
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createBatch({ 
          batch_name: formData.batch_name, 
          year: Number(formData.year), 
          city_id: Number(formData.city_id) 
        });
      } else if (targetBatch) {
        await updateBatch(targetBatch.id, {
          batch_name: formData.batch_name,
          year: Number(formData.year),
          city_id: Number(formData.city_id)
        });
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
    if (!targetBatch) return;
    setSubmitting(true);
    try {
      await deleteBatch(targetBatch.id);
      setDelOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to delete batch.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return batches.filter(b => {
      const matchSearch = b.batch_name.toLowerCase().includes(search.toLowerCase());
      const matchCity = filterCity ? String(b.city_id) === filterCity : true;
      const matchYear = filterYear ? String(b.year) === filterYear : true;
      return matchSearch && matchCity && matchYear;
    });
  }, [batches, search, filterCity, filterYear]);

  const uniqueYears = useMemo(() => {
    const years = new Set(batches.map(b => b.year));
    return Array.from(years).sort((a,b) => b - a);
  }, [batches]);

  const getCityName = (id: number) => cities.find(c => c.id === id)?.city_name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-[210px] group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-[13px] shadow-sm font-sans"
            />
          </div>
          <select 
            value={filterCity} onChange={e => setFilterCity(e.target.value)}
            className="w-full sm:max-w-xs px-3 py-2 bg-background border border-border rounded-xl text-[13px] cursor-pointer focus:border-primary focus:ring-1 outline-none text-muted-foreground focus:text-foreground"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
          </select>
          <select 
            value={filterYear} onChange={e => setFilterYear(e.target.value)}
            className="w-full sm:max-w-xs px-3 py-2 bg-background border border-border rounded-xl text-[13px] cursor-pointer focus:border-primary focus:ring-1 outline-none text-muted-foreground focus:text-foreground"
          >
            <option value="">All Years</option>
            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(filterCity || filterYear || search) && (
            <button onClick={() => {setFilterCity(''); setFilterYear(''); setSearch('');}} className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-4">Clear</button>
          )}
        </div>
        
        <button 
          onClick={openCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-[13px] text-primary-foreground font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Layers className="w-4 h-4" />
          Create Batch
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground">Batches</h2>
          <span className="text-[11px] font-mono font-medium tracking-wide bg-background border border-border px-2.5 py-1 rounded-full text-muted-foreground">
            {filtered.length} found
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-[10px] uppercase font-mono tracking-[0.1em] text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium min-w-[140px]">Batch Name</th>
                <th className="px-6 py-4 font-medium">Year</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium text-center">Students</th>
                <th className="px-6 py-4 font-medium right-0">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading batches...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No matches found.</td>
                </tr>
              ) : (
                filtered.map((batch) => (
                  <tr key={batch.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{batch.batch_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-accent/30 text-accent-foreground border border-accent/60">
                        {batch.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-[13px]">
                      {batch.city?.city_name || getCityName(batch.city_id)}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-muted-foreground text-xs">
                      {batch._count?.students || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEdit(batch)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setTargetBatch(batch); setDelOpen(true); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalMode === 'create' ? "Create New Batch" : "Edit Batch"} 
        subtitle="Batch will be linked to the selected city and year" 
        icon={<Layers className="text-primary w-8 h-8" />}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Batch Name *</label>
            <input 
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 outline-none transition-all"
              placeholder="e.g. B3-2025"
              value={formData.batch_name}
              onChange={(e) => setFormData({...formData, batch_name: e.target.value})}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Year *</label>
              <select 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 outline-none transition-all appearance-none cursor-pointer"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                disabled={submitting}
              >
                {[new Date().getFullYear()-1, new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">City *</label>
              <select 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 outline-none transition-all appearance-none cursor-pointer"
                value={formData.city_id}
                onChange={(e) => setFormData({...formData, city_id: e.target.value})}
                disabled={submitting}
              >
                <option value="" disabled>Select City</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-[13px] font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={submitting || !formData.batch_name || !formData.city_id} 
              className="px-4 py-2 text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50"
            >
              {modalMode === 'create' ? 'Create Batch' : 'Update Batch'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isDelOpen} 
        onClose={() => setDelOpen(false)} 
        title="Delete Batch?" 
        subtitle="This action cannot be undone." 
        icon={<Trash2 className="text-destructive w-8 h-8" />}
      >
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Are you sure you want to delete <span className="text-destructive font-bold">{targetBatch?.batch_name}</span>?</p>
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl font-medium mt-2">
            ⚠️ Deleting a batch will also delete all associated students and classes.
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button onClick={() => setDelOpen(false)} className="px-4 py-2 text-[13px] font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="px-4 py-2 text-[13px] font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors disabled:opacity-50">Delete Batch</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
