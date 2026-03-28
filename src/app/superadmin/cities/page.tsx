"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllCities, createCity, deleteCity, updateCity, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { CityHeader } from '@/components/superadmin/cities/CityHeader';
import { CityFilters } from '@/components/superadmin/cities/CityFilters';
import { CityTable } from '@/components/superadmin/cities/CityTable';
import { CityCard } from '@/components/superadmin/cities/CityCard';
import { CityModal } from '@/components/superadmin/cities/CityModal';
import { handleError } from "@/utils/handleError";

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  
  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [targetCity, setTargetCity] = useState<City | null>(null);
  const [isDelOpen, setDelOpen] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const respCities = await getAllCities();
      const respBatches = await getAllBatches();
      setCities(Array.isArray(respCities) ? respCities : []);
      setAllBatches(Array.isArray(respBatches) ? respBatches : []);
    } catch (err) {
      handleError(err);
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
    setTargetCity(null);
    setModalOpen(true);
  };

  const openEdit = (city: City) => {
    setModalMode('edit');
    setTargetCity(city);
    setModalOpen(true);
  };

  const openDelete = (city: City) => {
    setTargetCity(city);
    setDelOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createCity(data);
      } else if (targetCity) {
        await updateCity(targetCity.id, data);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('City operation failed:', err);
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
      fetchData();
    } catch (err) {
      console.error('City deletion failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = useMemo(() => {
    return cities.filter(c => c.city_name.toLowerCase().includes(search.toLowerCase()));
  }, [cities, search]);

  const paginatedCities = useMemo(() => {
    return filteredCities.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filteredCities, currentPage, limit]);

  return (
    <div className="space-y-6">
      <CityHeader totalCities={filteredCities.length} />

      <CityFilters
        search={search}
        onSearchChange={(value) => { setSearch(value); setCurrentPage(1); }}
        onCreateCity={openCreate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="glass rounded-2xl overflow-hidden border border-border/20">
        {viewMode === 'table' ? (
          <div className="p-6">
            <CityTable
              cities={paginatedCities}
              batches={allBatches}
              loading={loading}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        ) : (
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass rounded-xl p-4 border border-border/20 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : paginatedCities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No cities found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCities.map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    batches={allBatches}
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
          totalItems={filteredCities.length} 
          limit={limit} 
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
          showLimitSelector={true}
          loading={loading}
        />
      </div>

      <CityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        city={targetCity}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <DeleteModal
        isOpen={isDelOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        submitting={submitting}
        title="Delete City"
        itemName={targetCity?.city_name}
        warningText="Deleting a city will fail if there are active associated batches attached to it."
      />
    </div>
  );
}
