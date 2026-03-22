import { create } from 'zustand';

export interface AdminCity {
  id: number;
  name: string;
}

export interface AdminBatch {
  id: number;
  slug: string;
  name: string;
}

interface AdminStore {
  selectedCity: AdminCity | null;
  selectedBatch: AdminBatch | null;
  isLoadingContext: boolean;
  setSelectedCity: (city: AdminCity | null) => void;
  setSelectedBatch: (batch: AdminBatch | null) => void;
  setIsLoadingContext: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedCity: null,
  selectedBatch: null,
  isLoadingContext: true,
  setSelectedCity: (city) => set({ selectedCity: city, selectedBatch: null }), // always nullify batch when city changes
  setSelectedBatch: (batch) => set({ selectedBatch: batch }),
  setIsLoadingContext: (loading) => set({ isLoadingContext: loading }),
}));
