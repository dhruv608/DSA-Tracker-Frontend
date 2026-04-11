"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAllBatches, createBatch, updateBatch, deleteBatch, Batch } from '@/services/batch.service';
import { City } from '@/types/superadmin/city.types';
import { getPublicCities } from '@/services/public.service';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { BatchHeader } from '@/components/superadmin/batches/BatchHeader';
import { BatchFilters } from '@/components/superadmin/batches/BatchFilters';
import { BatchTable } from '@/components/superadmin/batches/BatchTable';
import { BatchCard } from '@/components/superadmin/batches/BatchCard';
import { BatchModal } from '@/components/superadmin/batches/BatchModal';
import { BatchShimmer } from '@/components/superadmin/batches/BatchShimmer';
import { BatchSubmitPayload } from '@/types/superadmin/index.types';

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
  const [limit, setLimit] = useState(5);

  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [targetBatch, setTargetBatch] = useState<Batch | null>(null);
  const [isDelOpen, setDelOpen] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [submitting, setSubmitting] = useState(false);
  
  // Modal loading state - for cities dropdown data
  const [isModalDataLoading, setIsModalDataLoading] = useState(false);
  
  // Ref to prevent concurrent API calls
  const isFetching = useRef(false);

  const fetchData = async () => {
    // Skip if already fetching (prevents concurrent calls only)
    if (isFetching.current) {
      console.log("Already fetching batches data, skipping duplicate call");
      return;
    }

    isFetching.current = true;
    setLoading(true);
    try {
      const batchesRes = await getAllBatches().catch(() => []);
      setBatches(Array.isArray(batchesRes) ? batchesRes : []);
    } catch (err) {
      // Error is handled by API client interceptor
      console.error(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const openDelete = (batch: Batch) => {
    setTargetBatch(batch);
    setDelOpen(true);
  };

  const handleSubmit = async (data: BatchSubmitPayload) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createBatch(data);
        // showSuccess('BATCH_CREATED');
      } else if (targetBatch) {
        await updateBatch(targetBatch.id, data);
        // showSuccess('BATCH_UPDATED');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      // handleToastError(err, 'Batch operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!targetBatch) return;
    setSubmitting(true);
    try {
      await deleteBatch(targetBatch.id);
      // showDeleteSuccess('Batch');
      setDelOpen(false);
      fetchData();
    } catch (err) {
      //   handleToastError(err, 'Batch deletion failed');
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
    return Array.from(years).sort((a, b) => b - a);
  }, [batches]);

  // Extract unique cities from batches for filter dropdown
  const uniqueCities = useMemo(() => {
    const cityMap = new Map<number, City>();
    batches.forEach(b => {
      if (b.city && !cityMap.has(b.city.id)) {
        cityMap.set(b.city.id, { id: b.city.id, city_name: b.city.city_name });
      }
    });
    return Array.from(cityMap.values());
  }, [batches]);

  const paginatedBatches = useMemo(() => {
    return filtered.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filtered, currentPage, limit]);

  const fetchModalData = async () => {
    if (cities.length > 0) return;
    
    setIsModalDataLoading(true);
    try {
      const citiesRes = await getPublicCities();
      setCities(citiesRes);
    } catch (err) {
      console.error("Failed to load cities", err);
    } finally {
      setIsModalDataLoading(false);
    }
  };

  const openCreate = async () => {
    setModalMode('create');
    setTargetBatch(null);
    await fetchModalData();
    setModalOpen(true);
  };

  const openEdit = async (batch: Batch) => {
    setModalMode('edit');
    setTargetBatch(batch);
    await fetchModalData();
    setModalOpen(true);
  };

  if (loading) {
    return <BatchShimmer viewMode={viewMode} />;
  }

  return (
    <div className="space-y-6">
      <BatchHeader totalBatches={filtered.length} />

      <BatchFilters
        search={search}
        onSearchChange={setSearch}
        filterCity={filterCity}
        onCityChange={(v) => { setFilterCity(v === 'all' ? '' : v); setCurrentPage(1); }}
        filterYear={filterYear}
        onYearChange={(v) => { setFilterYear(v === 'all' ? '' : v); setCurrentPage(1); }}
        onCreateBatch={openCreate}
        cities={cities}
        years={uniqueYears}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="glass rounded-2xl overflow-hidden border border-border">
        {viewMode === 'table' ? (
          <div className="p-6">
            <BatchTable
              batches={paginatedBatches}
              loading={false}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        ) : (
          <div className="p-6">
            {paginatedBatches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No matches found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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

      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        batch={targetBatch}
        cities={cities}
        onSubmit={handleSubmit}
        submitting={submitting}
        isLoading={isModalDataLoading}
      />

      <DeleteModal
        isOpen={isDelOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        submitting={submitting}
        title="Delete Batch"
        itemName={targetBatch?.batch_name}
        warningText="Deleting a batch will also delete all associated students and classes."
      />
    </div>
  );
}
