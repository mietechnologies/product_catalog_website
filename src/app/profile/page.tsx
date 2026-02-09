"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchMe, updateMe, updatePassword } from "@/lib/auth/api";
import type { AuthUser } from "@/lib/auth/types";
import PasswordChecklist, {
  allRequirementsMet,
} from "@/components/auth/PasswordChecklist";

type Mode = "view" | "edit" | "password";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready, updateUser } = useAuth();

  const [mode, setMode] = useState<Mode>("view");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [saving, setSaving] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (ready && !auth) {
      router.replace("/login");
    }
  }, [ready, auth, router]);

  // Fetch profile
  useEffect(() => {
    if (!auth) return;

    async function load() {
      setLoading(true);
      const result = await fetchMe(auth!.token);
      if (result.ok) {
        setUser(result.data.user);
      } else {
        toast(result.error, "error");
      }
      setLoading(false);
    }

    load();
  }, [auth, toast]);

  function enterEditMode() {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setMerchantName(user.merchantName ?? "");
    setMode("edit");
  }

  function enterPasswordMode() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMode("password");
  }

  const canSaveProfile =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    (!user?.merchantName || merchantName.trim() !== "") &&
    !saving;

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!canSaveProfile || !auth) return;

    setSaving(true);
    const fields: Record<string, string> = {};
    if (firstName.trim() !== user?.firstName) fields.firstName = firstName.trim();
    if (lastName.trim() !== user?.lastName) fields.lastName = lastName.trim();
    if (email.trim() !== user?.email) fields.email = email.trim();
    if (merchantName.trim() !== (user?.merchantName ?? ""))
      fields.merchantName = merchantName.trim();

    if (Object.keys(fields).length === 0) {
      setSaving(false);
      setMode("view");
      return;
    }

    const result = await updateMe(auth.token, fields);
    setSaving(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    setUser(result.data.user);
    updateUser(result.data.user);
    toast("Profile updated", "success");
    setMode("view");
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!auth) return;

    setChangingPassword(true);
    const result = await updatePassword(auth.token, currentPassword, newPassword);
    setChangingPassword(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    updateUser(result.data.user, result.data.token);
    toast("Password changed", "success");
    setMode("view");
  }

  if (!ready || !auth) return null;

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="text-neutral text-center">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  // ── Password change form ──────────────────────────────────────────
  if (mode === "password") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center">
            Change Password
          </h1>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Confirm New Password
              </label>
              <Input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <PasswordChecklist
              password={newPassword}
              confirmPassword={confirmPassword}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  !currentPassword ||
                  !allRequirementsMet(newPassword, confirmPassword) ||
                  changingPassword
                }
              >
                {changingPassword ? "Changing\u2026" : "Change Password"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("view")}
                className="flex-1 rounded-lg border border-neutral/30 px-4 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // ── Edit profile form ─────────────────────────────────────────────
  if (mode === "edit") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center">
            Edit Profile
          </h1>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {user.merchantName !== undefined && (
              <div>
                <label
                  htmlFor="merchantName"
                  className="block text-sm font-medium text-neutral-dark mb-1"
                >
                  Merchant / Business Name
                </label>
                <Input
                  id="merchantName"
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="Business name"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-neutral-dark mb-1"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-neutral-dark mb-1"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={!canSaveProfile}
              >
                {saving ? "Saving\u2026" : "Save Changes"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("view")}
                className="flex-1 rounded-lg border border-neutral/30 px-4 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // ── View profile ──────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Profile
        </h1>

        <dl className="space-y-4">
          {user.merchantName && (
            <div>
              <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
                Merchant Name
              </dt>
              <dd className="mt-0.5 text-neutral-dark">{user.merchantName}</dd>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
                First Name
              </dt>
              <dd className="mt-0.5 text-neutral-dark">{user.firstName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
                Last Name
              </dt>
              <dd className="mt-0.5 text-neutral-dark">{user.lastName}</dd>
            </div>
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
            <dd className="mt-0.5 text-neutral-dark capitalize">
              {user.accountType}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
              Created
            </dt>
            <dd className="mt-0.5 text-neutral-dark">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>

          {user.approvedDate && (
            <div>
              <dt className="text-xs font-medium text-neutral uppercase tracking-wide">
                Approved
              </dt>
              <dd className="mt-0.5 text-neutral-dark">
                {new Date(user.approvedDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex gap-3 mt-8">
          <Button onClick={enterEditMode} className="flex-1">
            Edit Profile
          </Button>
          <button
            onClick={enterPasswordMode}
            className="flex-1 rounded-lg border border-neutral/30 px-4 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral/5 transition-colors"
          >
            Change Password
          </button>
        </div>
      </Card>
    </div>
  );
}
