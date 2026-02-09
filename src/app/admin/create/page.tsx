"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { createAdmin, validateApiKey } from "@/lib/auth/api";
import PasswordChecklist, {
  allRequirementsMet,
} from "@/components/auth/PasswordChecklist";

export default function CreateAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  // API key gate state
  const [apiKey, setApiKey] = useState("");
  const [apiKeyVerified, setApiKeyVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    allRequirementsMet(password, confirmPassword) &&
    !loading;

  async function handleVerifyApiKey(e: FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setVerifying(true);
    setApiKeyError("");

    const valid = await validateApiKey(apiKey.trim());
    setVerifying(false);

    if (valid) {
      setApiKeyVerified(true);
    } else {
      setApiKeyError("Invalid or inactive API key.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    const result = await createAdmin(
      {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      },
      apiKey.trim(),
    );
    setLoading(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    const { token, data } = result.data;
    signIn(data.user, token);
    toast("Admin account created", "success");
    router.push("/");
  }

  // ── API Key gate overlay ──────────────────────────────────────────
  if (!apiKeyVerified) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-primary mb-2 text-center">
            API Key Required
          </h1>
          <p className="text-sm text-neutral text-center mb-6">
            Enter a valid API key to access admin account creation.
          </p>

          <form onSubmit={handleVerifyApiKey} className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setApiKeyError("");
                }}
                placeholder="Enter the backend API key"
                required
              />
              {apiKeyError && (
                <p className="mt-1 text-sm text-red-600">{apiKeyError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!apiKey.trim() || verifying}
            >
              {verifying ? "Verifying\u2026" : "Continue"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    );
  }

  // ── Registration form (shown after API key verified) ──────────────
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Create Admin Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
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
                placeholder="Jane"
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
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
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
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Password checklist */}
          <PasswordChecklist
            password={password}
            confirmPassword={confirmPassword}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit}
          >
            {loading ? "Creating account\u2026" : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-light transition-colors"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
