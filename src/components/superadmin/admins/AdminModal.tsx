"use client";

import { useState, useMemo, useEffect } from 'react';
import { Admin } from '@/types/common/api.types';
import { City } from '@/types/superadmin/city.types';
import { Batch } from '@/types/superadmin/batch.types';
import { Modal } from '@/components/Modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInputWithValidation } from "@/components/ui/PasswordStrengthIndicator";
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { AdminCreateData } from '@/types/superadmin/index.types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  admin?: Admin | null;
  cities: City[];
  batches: Batch[];
  roles: string[];
  onSubmit: (data: AdminCreateData) => Promise<void>;
  submitting: boolean;
  isLoading?: boolean;
}

export function AdminModal({
  isOpen,
  onClose,
  mode,
  admin,
  cities,
  batches,
  roles,
  onSubmit,
  submitting,
  isLoading
}: AdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TEACHER',
    batch_id: ''
  });
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const passwordValidation = usePasswordValidation(formData.password);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'create') {
      setFormData({ name: '', email: '', password: '', role: 'TEACHER', batch_id: '' });
      setSelectedCity('');
      setSelectedYear('');
    } else if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        password: '',
        role: admin.role,
        batch_id: admin.batch_id ? String(admin.batch_id) : ''
      });

      if (admin.batch) {
        setSelectedCity(String(admin.batch.city_id));
        setSelectedYear(String(admin.batch.year));
        setFormData(prev => ({ ...prev, batch_id: String(admin.batch!.id) }));
      } else if (admin.batch_id) {
        const b = batches.find(b => b.id === admin.batch_id);
        if (b) {
          setSelectedCity(String(b.city_id));
          setSelectedYear(String(b.year));
          setFormData(prev => ({ ...prev, batch_id: String(admin.batch_id) }));
        } else {
          setSelectedCity('');
          setSelectedYear('');
        }
      } else {
        setSelectedCity('');
        setSelectedYear('');
      }
    }
  }, [mode, admin, batches]);

  const availableYears = useMemo(() => {
    if (!selectedCity) return [];
    const cityBatches = batches.filter(b => b.city_id === Number(selectedCity));
    const years = new Set(cityBatches.map(b => b.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [selectedCity, batches]);

  const availableBatches = useMemo(() => {
    let filtered = batches;
    if (selectedCity) filtered = filtered.filter(b => b.city_id === Number(selectedCity));
    if (selectedYear) filtered = filtered.filter(b => String(b.year) === selectedYear);
    return filtered;
  }, [selectedCity, selectedYear, batches]);

  const handleSubmit = async () => {
    const payload: AdminCreateData = {
      name: formData.name,
      email: formData.email,
      role: formData.role as 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN'
    };
    if (formData.batch_id) payload.batch_id = Number(formData.batch_id);
    if (mode === 'create') payload.password = formData.password;

    await onSubmit(payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting && isFormValid) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormValid = mode === 'create'
    ? formData.name && 
      formData.email && 
      passwordValidation.meetsMinimumRequirements(formData.password) &&
      formData.role
    : formData.role;

 return (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={mode === "create" ? "Create New Admin" : "Edit Admin"}
    subtitle={
      mode === "create"
        ? "Assign city and batch to determine data access permissions"
        : "Name and email are read-only when editing."
    }
  >
    <div className="space-y-6" onKeyDown={handleKeyDown}>

      {/* 🔹 FORM GRID */}
      <div className="space-y-4">

        {/* Name */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm text-muted-foreground">
            Full Name {mode === "create" && "*"}
          </label>

          <Input
            placeholder="Satya Sai"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={submitting || mode === "edit"}
            className="w-full h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm text-muted-foreground">
            Email {mode === "create" && "*"}
          </label>

          <Input
            type="email"
            placeholder="admin@dsa.in"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={submitting || mode === "edit"}
            className="w-full h-11! pl-11 pr-4 border border-border  focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
          />
        </div>

        {/* Password */}
        {mode === "create" && (
          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label className="text-sm text-muted-foreground mt-3">
              Password *
            </label>

            <div className="w-full">
              <PasswordInputWithValidation
                password={formData.password}
                onPasswordChange={(password) =>
                  setFormData({ ...formData, password })
                }
                placeholder="Create a strong password"
                disabled={submitting}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Role */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm text-muted-foreground">
            Role *
          </label>

          <Select
            value={formData.role || "TEACHER"}
            onValueChange={(v) =>
              setFormData({ ...formData, role: v })
            }
            disabled={submitting}
          >
            <SelectTrigger className="w-full bg-accent/40 border border-border/30">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent className="glass">
              {roles.filter(r => r !== "SUPERADMIN").map(r => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🔸 ASSIGNMENT */}
      <div className="glass rounded-2xl p-5 border border-border/30 space-y-5">

        <h3 className="text-sm font-semibold text-foreground">
          Assignment
        </h3>

        {/* City + Year aligned */}
        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              City Filter
            </label>

            <Select
              value={selectedCity || "any"}
              onValueChange={(v) => {
                setSelectedCity(v === "any" ? "" : v);
                setSelectedYear("");
                setFormData({ ...formData, batch_id: "" });
              }}
              disabled={submitting || isLoading}
            >
              <SelectTrigger className="w-full bg-accent/40 border border-border/30">
                <SelectValue placeholder={isLoading ? "Loading cities..." : "Any City"} />
              </SelectTrigger>

              <SelectContent className="glass">
                <SelectItem value="any">Any City</SelectItem>
                {cities.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.city_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Year Filter
            </label>

            <Select
              value={selectedYear || "any"}
              onValueChange={(v) => {
                setSelectedYear(v === "any" ? "" : v);
                setFormData({ ...formData, batch_id: "" });
              }}
              disabled={submitting || isLoading || (!selectedCity && !selectedYear)}
            >
              <SelectTrigger className="w-full bg-accent/40 border border-border/30">
                <SelectValue placeholder="Any Year" />
              </SelectTrigger>

              <SelectContent className="glass">
                <SelectItem value="any">Any Year</SelectItem>
                {availableYears.map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Batch */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm text-muted-foreground">
            Batch
          </label>

          <Select
            value={formData.batch_id || "none"}
            onValueChange={(v) =>
              setFormData({
                ...formData,
                batch_id: v === "none" ? "" : v,
              })
            }
            disabled={
              submitting ||
              isLoading ||
              (!selectedCity && !selectedYear && !formData.batch_id)
            }
          >
            <SelectTrigger className="w-full bg-accent/40 border border-border/30">
              <SelectValue
                placeholder={
                  availableBatches.length === 0
                    ? "No batches match filters"
                    : "Select Batch (Optional)"
                }
              />
            </SelectTrigger>

            <SelectContent className="glass">
              <SelectItem value="none">Select Batch</SelectItem>
              {availableBatches.map(b => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.batch_name} ({b.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="rounded-full"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={submitting || !isFormValid}
          className="rounded-full bg-primary text-primary-foreground"
        >
          {mode === "create" ? "Create Admin" : "Update Admin"}
        </Button>
      </div>
    </div>
  </Modal>
);
}
