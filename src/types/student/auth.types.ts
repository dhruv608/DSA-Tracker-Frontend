/**
 * Authentication-related types for student
 */

export interface StudentLoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface StudentLoginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    username: string;
    email?: string;
    leetcode_id?: string;
    gfg_id?: string;
  };
}

export interface StudentRegisterData {
  username: string;
  email: string;
  password: string;
  batch_id?: number;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthError extends Error {
  response?: {
    status: number;
    data: {
      error?: string;
      message?: string;
    };
  };
  code?: string;
}
