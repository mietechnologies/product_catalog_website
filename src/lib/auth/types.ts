/** Auth types for the MIETech admin system */

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  merchantName?: string;
  accountType: string;
  accountStatus?: string;
  approvedDate?: string;
  createdAt: string;
}

/** Shape returned by POST /api/users/login and POST /api/users/admin */
export interface AuthResponse {
  status: string;
  token: string;
  data: { user: AuthUser };
}

/** A retailer account returned by the pending-retailers endpoint */
export interface PendingRetailer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  merchantName: string;
  accountType: string;
  accountStatus: string;
  createdAt: string;
}

/** Persisted auth state (localStorage + context) */
export interface AuthState {
  user: AuthUser;
  token: string;
}
