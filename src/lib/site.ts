/** The main MieTech website, which owns account management for the shared login. */
export const MAIN_SITE_URL = (
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://mietechnologies.com"
).replace(/\/$/, "");

export const MAIN_SITE_ADMIN_URL = `${MAIN_SITE_URL}/admin`;
