"use client";

import React, { useEffect, useState } from 'react';
import { getAllCities, createCity, deleteCity, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Modal } from '@/components/Modal';
import { Search, Building2, Trash2 } from 'lucide-react';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDelOpen, setDelOpen] = useState(false);
  const [targetCity, setTargetCity] = useState<City | null>(null);

  // Forms
  const [cityName, setCityName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const respCities = await getAllCities();
      const respBatches = await getAllBatches();
      setCities(Array.isArray(respCities) ? respCities : []);
      setAllBatches(Array.isArray(respBatches) ? respBatches : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!cityName) return;
    setSubmitting(true);
    try {
      await createCity({ city_name: cityName });
      setCreateOpen(false);
      setCityName('');
      fetchData();
    } catch (err) {
      alert("Failed to create city");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!targetCity) return;
    setSubmitting(true);
    try {
      await deleteCity(targetCity.id);
      setDelOpen(false);
      setTargetCity(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete city. It may have linked batches.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = cities.filter(c => c.city_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full sm:max-w-xs group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            placeholder="Search cities by name..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Create City
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground">Cities</h2>
          <span className="text-[11px] font-mono font-medium tracking-wide bg-background border border-border px-2.5 py-1 rounded-full text-muted-foreground">
            {filteredCities.length} total
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-[10px] uppercase font-mono tracking-[0.1em] text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">City Name</th>
                <th className="px-6 py-4 font-medium">Total Batches</th>
                <th className="px-6 py-4 font-medium">Total Students</th>
                <th className="px-6 py-4 font-medium right-0">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading cities...</td>
                </tr>
              ) : filteredCities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No cities found.</td>
                </tr>
              ) : (
                filteredCities.map((city) => {
                  const batchesInCity = allBatches.filter(b => b.city_id === city.id);
                  const batchesCount = batchesInCity.length;
                  const studentsCount = batchesInCity.reduce((sum, b) => sum + (b._count?.students || 0), 0);
                  
                  return (
                    <tr key={city.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{city.city_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-accent/50 text-accent-foreground border border-accent">
                          {batchesCount} batches
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-primary/20 text-primary border border-primary/40">
                          {studentsCount} students
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setTargetCity(city); setDelOpen(true); }}
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

      {/* Modals */}
      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create New City" subtitle="City will be available for batch assignment immediately." icon={<Building2 className="text-primary w-8 h-8" />}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">City Name *</label>
            <input 
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Hyderabad"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={submitting || !cityName} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50">Confirm</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDelOpen} onClose={() => setDelOpen(false)} title="Delete City?" subtitle="This action cannot be undone." icon={<Trash2 className="text-destructive w-8 h-8" />}>
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Are you sure you want to delete <span className="text-destructive">{targetCity?.city_name}</span>?</p>
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl font-medium">
            ⚠️ Deleting a city will fail if there are active associated batches attached to it.
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button onClick={() => setDelOpen(false)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors">Delete City</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
