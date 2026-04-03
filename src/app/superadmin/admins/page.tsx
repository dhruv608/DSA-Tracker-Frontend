"use client";

import { useEffect, useState, useMemo } from 'react';
import {  Admin, getAdminRoles } from '@/services/admin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { AdminHeader } from '@/components/superadmin/admins/AdminHeader';
import { AdminTable } from '@/components/superadmin/admins/AdminTable';
import { AdminModal } from '@/components/superadmin/admins/AdminModal';
import { AdminCard } from '@/components/superadmin/admins/AdminCard';
import { AdminFilters } from '@/components/superadmin/admins/AdminFilters';
import { handleToastError, showSuccess, showDeleteSuccess } from "@/utils/toast-system";
import { createAdmin, deleteAdmin, getAllAdmins, updateAdmin } from '@/services/superadmin.service';

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
      handleToastError(err);
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
    setTargetAdmin(null);
    setModalOpen(true);
  };

  const openEdit = (admin: Admin) => {
    setModalMode('edit');
    setTargetAdmin(admin);
    setModalOpen(true);
  };

  const openDelete = (admin: Admin) => {
    setTargetAdmin(admin);
    setDelOpen(true);
  };

  const handleSubmit = async (data: any) => {
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
            ) : paginatedAdmins.length === 0 ? (
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
