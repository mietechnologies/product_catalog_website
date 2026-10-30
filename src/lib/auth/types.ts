/**
 * Auth types for the shared MieTech login.
 *
 * The catalog signs in against the main MieTech backend, which keeps the
 * session in an httpOnly cookie. The frontend never sees a token.
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  /** "admin", "customer", and later "retailer" */
  role: string;
}

/** Shape returned by POST /api/auth/login */
export interface AuthLoginResponse {
  status: string;
  message: string;
  user: AuthUser;
}

/** Shape returned by GET /api/auth/me */
export interface AuthSessionResponse {
  authenticated: boolean;
  user: AuthUser;
}

/** Auth state held in context */
export interface AuthState {
  user: AuthUser;
}
