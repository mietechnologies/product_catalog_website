"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { useAuth } from "@/lib/auth/AuthContext";
import { MAIN_SITE_ADMIN_URL } from "@/lib/site";

/**
 * Read-only profile. The catalog shares its login with the main MieTech site,
 * which is where accounts and passwords are managed.
 */
export default function ProfilePage() {
  const router = useRouter();
  const { auth, ready } = useAuth();

  useEffect(() => {
    if (ready && !auth) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  if (!ready || !auth) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card className="p-6 sm:p-8">
          <p className="text-center text-neutral">Loading profile…</p>
        </Card>
      </div>
    );
  }

  const { user } = auth;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Profile
        </h1>

        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
              Name
            </dt>
            <dd className="mt-0.5 text-neutral-dark">{user.name}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
              Email
            </dt>
            <dd className="mt-0.5 text-neutral-dark">{user.email}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
              Account Type
            </dt>
            <dd className="mt-0.5 text-neutral-dark capitalize">{user.role}</dd>
          </div>
        </dl>

        <p className="mt-8 text-sm text-neutral text-center">
          This account is shared with the main MieTech site. Manage it from the{" "}
          <a
            href={MAIN_SITE_ADMIN_URL}
            className="font-medium text-primary hover:text-primary-light transition-colors"
          >
            MieTech admin
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
