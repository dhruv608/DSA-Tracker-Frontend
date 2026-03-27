"use client";

import { useState, useEffect } from 'react';
import { City } from '@/services/city.service';
import { Modal } from '@/components/Modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2 } from 'lucide-react';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  city?: City | null;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

export function CityModal({ 
  isOpen, 
  onClose, 
  mode, 
  city, 
  onSubmit, 
  submitting 
}: CityModalProps) {
  const [cityName, setCityName] = useState('');

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'create') {
      setCityName('');
    } else if (city) {
      setCityName(city.city_name);
    }
  }, [mode, city]);

  const handleSubmit = async () => {
    const payload = { city_name: cityName };
    await onSubmit(payload);
  };

  const isFormValid = cityName.trim();

  return (
    <Modal
  isOpen={isOpen}
  onClose={onClose}
  title={mode === "create" ? "Create New City" : "Edit City"}
  subtitle={
    mode === "create"
      ? "City will be available for batch assignment immediately."
      : "Update city name. This will reflect across all associated batches."
  }
  icon={<Building2 className="text-chart-2 w-7 h-7" />}
>
  <div className="space-y-6">

    {/* 🔹 FORM */}
    <div className="space-y-4">

      <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-sm text-muted-foreground">
          City Name *
        </label>

        <Input
          placeholder="e.g. Hyderabad"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          disabled={submitting}
          className="
            w-full
            bg-accent/40 backdrop-blur
            border border-border/30
            focus:ring-2 focus:ring-primary/30
            transition
          "
        />
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
            ? "Create City"
            : "Update City"}
      </Button>
    </div>
  </div>
</Modal>
  );
}
