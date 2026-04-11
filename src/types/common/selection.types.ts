/**
 * Common selection types for city and batch shared across all roles
 */

export interface CitySelection {
  id: number;
  name: string;
}

export interface BatchSelection {
  id: number;
  slug: string;
  name: string;
  batch_name?: string; // Alias for backward compatibility
  year: number;
}
