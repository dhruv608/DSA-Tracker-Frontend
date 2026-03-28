export interface AdminStudent {
  id: number;
  name: string;
  email: string;
  username: string;
  enrollment_id: string;
  profile_image_url?: string | null;
  leetcode_id?: string | null;
  gfg_id?: string | null;
  totalSolved: number;
}

export interface AdminStudentsResponse {
  students: AdminStudent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
