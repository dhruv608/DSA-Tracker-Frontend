/**
 * City management form types for superadmin
 */

export interface CityFormData {
  city_name: string;
}

export interface CitySubmitPayload {
  city_name: string;
}

export interface City {
  id: number;
  city_name: string;
  createdAt?: string;
  updatedAt?: string;
  total_batches?: number;
  total_students?: number;
}
