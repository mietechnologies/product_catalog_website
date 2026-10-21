/**
 * Retail module — retailer accounts, wholesale ordering, and order management.
 *
 * Everything retail-specific lives under src/modules/retail, plus the thin
 * route files in src/app/(retail). The whole module is gated by the `retail`
 * feature flag (see src/lib/features.ts): routes 404 and nav links disappear
 * when it is off.
 *
 * Core code should only import the integration points exported here.
 */

export {
  RetailCustomerMenuLinks,
  RetailAdminMenuLinks,
} from "./components/RetailMenuLinks";
export { default as RetailerSignupPrompt } from "./components/RetailerSignupPrompt";
