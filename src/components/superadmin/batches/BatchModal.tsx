"use client";

import { useState, useEffect } from 'react';
import { Batch } from '@/types/superadmin/batch.types';
import { City } from '@/types/superadmin/city.types';
import { Modal } from '@/components/Modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers } from 'lucide-react';
import { BatchSubmitPayload } from '@/types/superadmin/index.types';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  batch?: Batch | null;
  cities: City[];
  onSubmit: (data: BatchSubmitPayload) => Promise<void>;
  submitting: boolean;
  isLoading?: boolean;
}

export function BatchModal({ 
  isOpen, 
  onClose, 
  mode, 
  batch, 
  cities, 
  onSubmit, 
  submitting,
  isLoading 
}: BatchModalProps) {
  const [formData, setFormData] = useState({ 
    batch_name: '', 
    year: new Date().getFullYear(), 
    city_id: '' 
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'create') {
      setFormData({ 
        batch_name: '', 
        year: new Date().getFullYear(), 
        city_id: '' 
      });
    } else if (batch) {
      setFormData({ 
        batch_name: batch.batch_name, 
        year: batch.year, 
        city_id: String(batch.city_id) 
      });
    }
  }, [mode, batch]);

  const handleSubmit = async () => {
    const payload = {
      batch_name: formData.batch_name,
      year: Number(formData.year),
      city_id: Number(formData.city_id)
    };
    await onSubmit(payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting && isFormValid) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormValid = formData.batch_name && formData.year && formData.city_id;

  return (
    <Modal
  isOpen={isOpen}
  onClose={onClose}
  title={mode === "create" ? "Create New Batch" : "Edit Batch"}
  subtitle="Batch will be linked to the selected city and year"
  icon={<Layers className="text-chart-3 w-7 h-7" />}
>
  <div className="space-y-6" onKeyDown={handleKeyDown}>

    {/* 🔹 FORM */}
    <div className="space-y-4">

      {/* Batch Name */}
      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-sm text-muted-foreground">
          Batch Name *
        </label>

        <Input
          placeholder="e.g. B3-2025"
          value={formData.batch_name}
          onChange={(e) =>
            setFormData({ ...formData, batch_name: e.target.value })
          }
          disabled={submitting}
          className="
            w-full
            bg-accent/40 backdrop-blur
            border border-border/30
            focus:ring-2 focus:ring-primary/30
          "
        />
      </div>

      {/* Year */}
      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-sm text-muted-foreground">
          Year *
        </label>

        <Input
          type="number"
          placeholder="e.g. 2025"
          value={formData.year || ""}
          onChange={(e) =>
            setFormData({ ...formData, year: Number(e.target.value) })
          }
          disabled={submitting}
          min="2000"
          max="2050"
          className="
            w-full
            bg-accent/40 backdrop-blur
            border border-border/30
            focus:ring-2 focus:ring-primary/30
          "
        />
      </div>

      {/* City */}
      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-sm text-muted-foreground">
          City *
        </label>

        <Select
          value={formData.city_id || ""}
          onValueChange={(v) =>
            setFormData({ ...formData, city_id: v })
          }
          disabled={submitting || isLoading}
        >
          <SelectTrigger className="
            w-full
            bg-accent/40 backdrop-blur
            border border-border/30
            hover:border-primary/40
          ">
            <SelectValue placeholder={isLoading ? "Loading cities..." : "Select City"} />
          </SelectTrigger>

          <SelectContent className="glass border-border/30">
            {cities.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.city_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* 🔹 ACTIONS */}
    <div className="
      flex items-center justify-end gap-3
      pt-4 border-t border-border/30
    ">
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
        className="
          rounded-full
          bg-primary text-primary-foreground
          hover:bg-primary/90
          shadow-md
        "
      >
        {submitting
          ? "Processing..."
          : mode === "create"
            ? "Create Batch"
            : "Update Batch"}
      </Button>
    </div>
  </div>
</Modal>
  );
}
