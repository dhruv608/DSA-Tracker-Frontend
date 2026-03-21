"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllBatches, createBatch, updateBatch, deleteBatch, Batch } from '@/services/batch.service';
import { getAllCities, City } from '@/services/city.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Pagination } from '@/components/Pagination';
import { Search, Layers, Trash2, Edit, MapPin, Calendar } from 'lucide-react';

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

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

  const paginatedBatches = useMemo(() => {
    return filtered.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filtered, currentPage]);

  const getCityName = (id: number) => cities.find(c => c.id === id)?.city_name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Batch Management</h2>
        <p className="text-sm text-muted-foreground">Organize class batches across different cities and academic years.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-xs group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input 
              placeholder="Search batches..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select 
              value={filterCity} 
              onChange={v => { setFilterCity(String(v)); setCurrentPage(1); }}
              options={[{ label: 'All Cities', value: '' }, ...cities.map(c => ({ label: c.city_name, value: String(c.id) }))]}
              className="w-[160px]"
              icon={<MapPin className="w-4 h-4" />}
            />
            <Select 
              value={filterYear} 
              onChange={v => { setFilterYear(String(v)); setCurrentPage(1); }}
              options={[{ label: 'All Years', value: '' }, ...uniqueYears.map(y => ({ label: String(y), value: String(y) }))]}
              className="w-[140px]"
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          {(filterCity || filterYear || search) && (
            <button onClick={() => {setFilterCity(''); setFilterYear(''); setSearch('');}} className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-4">Clear</button>
          )}
        </div>
        
        <Button onClick={openCreate} className="w-full sm:w-auto shrink-0">
          <Layers className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <h2 className="font-semibold">Batches</h2>
          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-background border rounded-md">
            {filtered.length} found
          </span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground animate-pulse">Loading batches...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matches found.</TableCell>
              </TableRow>
            ) : (
              paginatedBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batch_name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                      {batch.year}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {batch.city?.city_name || getCityName(batch.city_id)}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground font-mono">
                    {batch._count?.students || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(batch)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setTargetBatch(batch); setDelOpen(true); }} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
        title={modalMode === 'create' ? "Create New Batch" : "Edit Batch"} 
        subtitle="Batch will be linked to the selected city and year" 
        icon={<Layers className="text-primary w-8 h-8" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Batch Name *</label>
            <Input 
              placeholder="e.g. B3-2025"
              value={formData.batch_name}
              onChange={(e) => setFormData({...formData, batch_name: e.target.value})}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Year *</label>
              <Select 
                value={formData.year}
                onChange={v => setFormData({...formData, year: Number(v)})}
                options={[new Date().getFullYear()-1, new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2].map(y => ({ label: String(y), value: y }))}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">City *</label>
              <Select 
                value={formData.city_id}
                onChange={v => setFormData({...formData, city_id: String(v)})}
                options={cities.map(c => ({ label: c.city_name, value: String(c.id) }))}
                placeholder="Select City"
                disabled={submitting}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting || !formData.batch_name || !formData.city_id}>
              {modalMode === 'create' ? 'Create Batch' : 'Update Batch'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDelOpen} onClose={() => setDelOpen(false)} title="Delete Batch?" subtitle="This action cannot be undone." icon={<Trash2 className="text-destructive w-6 h-6" />}>
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Are you sure you want to delete <span className="text-destructive font-bold">{targetBatch?.batch_name}</span>?</p>
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mt-2">
            ⚠️ Deleting a batch will also delete all associated students and classes.
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-6">
            <Button variant="outline" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>Delete Batch</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
