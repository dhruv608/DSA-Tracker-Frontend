/**
 * Dashboard-related types for superadmin
 */

export interface Stats {
  totalCities: number;
  totalBatches: number;
  totalAdmins: number;
  cityBreakdown?: CityBreakdown[];
}

export interface CityBreakdown {
  name: string;
  count: number;
}

export interface SuperAdminUser {
  name: string;
  role: string;
  email?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name?: string;
  }>;
  label?: string;
}
