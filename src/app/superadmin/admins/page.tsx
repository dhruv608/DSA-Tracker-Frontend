"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { Admin } from '@/types/common/api.types';
import { City } from '@/types/superadmin/city.types';
import { Batch } from '@/types/superadmin/batch.types';
import { getPublicCities, getPublicBatches } from '@/services/public.service';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { AdminHeader } from '@/components/superadmin/admins/AdminHeader';
import { AdminTable } from '@/components/superadmin/admins/AdminTable';
import { AdminModal } from '@/components/superadmin/admins/AdminModal';
import { AdminCard } from '@/components/superadmin/admins/AdminCard';
import { AdminFilters } from '@/components/superadmin/admins/AdminFilters';
import { AdminShimmer } from '@/components/superadmin/admins/AdminShimmer';
import { createAdmin, deleteAdmin, getAllAdmins, updateAdmin } from '@/services/superadmin.service';
import { AdminCreateData } from '@/types/superadmin/index.types';
import { getAdminRoles } from '@/services/admin.service';

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

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [submitting, setSubmitting] = useState(false);
  
  // Modal loading state - for cities/batches dropdown data
  const [isModalDataLoading, setIsModalDataLoading] = useState(false);
  
  // Ref to prevent concurrent API calls
  const isFetching = useRef(false);

  const fetchData = async () => {
    // Skip if already fetching (prevents concurrent calls only)
    if (isFetching.current) {
      console.log("Already fetching admins data, skipping duplicate call");
      return;
    }

    isFetching.current = true;
    setLoading(true);
    try {
      const [adminsRes, rolesRes] = await Promise.all([
        getAllAdmins().catch(() => []),
        getAdminRoles().catch(() => [])
      ]);
      setAdmins(Array.isArray(adminsRes) ? adminsRes : []);
      setRoles(Array.isArray(rolesRes) ? rolesRes : []);
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

  const fetchModalData = async () => {
    if (cities.length > 0 && batches.length > 0) return;
    
    setIsModalDataLoading(true);
    try {
      const [citiesRes, batchesRes] = await Promise.all([
        getPublicCities(),
        getPublicBatches()
      ]);
      setCities(citiesRes);
      setBatches(batchesRes);
    } catch (err) {
      console.error("Failed to load modal data", err);
    } finally {
      setIsModalDataLoading(false);
    }
  };

  const openCreate = async () => {
    setModalMode('create');
    setTargetAdmin(null);
    await fetchModalData();
    setModalOpen(true);
  };

  const openEdit = async (admin: Admin) => {
    setModalMode('edit');
    setTargetAdmin(admin);
    await fetchModalData();
    setModalOpen(true);
  };

  const openDelete = (admin: Admin) => {
    setTargetAdmin(admin);
    setDelOpen(true);
  };

  const handleSubmit = async (data: AdminCreateData) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createAdmin(data);
      } else if (targetAdmin) {
        await updateAdmin(targetAdmin.id, data);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
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

  if (loading) {
    return <AdminShimmer viewMode={viewMode} />;
  }

  return (
    <div className="space-y-6">
      <AdminHeader totalAdmins={filtered.length} />

      <AdminFilters
        search={search}
        onSearchChange={setSearch}
        filterRole={filterRole}
        onRoleChange={v => { setFilterRole(v === 'all' ? '' : v); setCurrentPage(1); }}
        onCreateAdmin={openCreate}
        roles={roles}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="glass rounded-2xl overflow-hidden border border-border/20">
        {viewMode === 'table' ? (
          <div className="p-6">
            <AdminTable
              admins={paginatedAdmins}
              loading={false}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        ) : (
          <div className="p-6">
            {paginatedAdmins.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No matches found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedAdmins.map((admin) => (
                  <AdminCard
                    key={admin.id}
                    admin={admin}
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        admin={targetAdmin}
        cities={cities}
        batches={batches}
        roles={roles}
        onSubmit={handleSubmit}
        submitting={submitting}
        isLoading={isModalDataLoading}
      />

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
