"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAllCities, createCity, deleteCity, updateCity, City } from '@/services/city.service';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { CityHeader } from '@/components/superadmin/cities/CityHeader';
import { CityFilters } from '@/components/superadmin/cities/CityFilters';
import { CityTable } from '@/components/superadmin/cities/CityTable';
import { CityCard } from '@/components/superadmin/cities/CityCard';
import { CityModal } from '@/components/superadmin/cities/CityModal';
import { CityShimmer } from '@/components/superadmin/cities/CityShimmer';
import { CitySubmitPayload } from '@/types/superadmin/index.types';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
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
  
  // Ref to prevent concurrent API calls
  const isFetching = useRef(false);

  const fetchData = async () => {
    // Skip if already fetching (prevents concurrent calls only)
    if (isFetching.current) {
      console.log("Already fetching cities data, skipping duplicate call");
      return;
    }

    isFetching.current = true;
    setLoading(true);
    try {
      const respCities = await getAllCities();
      setCities(Array.isArray(respCities) ? respCities : []);
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

  const handleSubmit = async (data: CitySubmitPayload) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createCity(data);
      } else if (targetCity) {
        await updateCity(targetCity.id, data);
      }
      setModalOpen(false);
      fetchData();
    }finally {
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
    }finally {
      setSubmitting(false);
    }
  };

  const filteredCities = useMemo(() => {
    return cities.filter(c => c.city_name.toLowerCase().includes(search.toLowerCase()));
  }, [cities, search]);

  const paginatedCities = useMemo(() => {
    return filteredCities.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filteredCities, currentPage, limit]);

  if (loading) {
    return <CityShimmer viewMode={viewMode} />;
  }

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
              loading={false}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        ) : (
          <div className="p-6">
            {paginatedCities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No cities found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCities.map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
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
