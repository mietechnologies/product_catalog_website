"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createRetailer } from "@/lib/auth/api";
import PasswordChecklist, {
  allRequirementsMet,
} from "@/components/auth/PasswordChecklist";

export default function CreateRetailerPage() {
  const { toast } = useToast();

  const [merchantName, setMerchantName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    merchantName.trim() !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    allRequirementsMet(password, confirmPassword) &&
    !loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    const result = await createRetailer({
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      merchantName: merchantName.trim(),
      password,
    });
    setLoading(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    setSubmitted(true);
  }

  // ── Success message ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-primary mb-2">
            Application Submitted
          </h1>
          <p className="text-neutral mb-6">
            Your retailer account has been created and is pending review. An
            administrator will review your submission and approve your account.
            You will be able to sign in once approved.
          </p>

          <Link
            href="/login"
            className="inline-block font-medium text-primary hover:text-primary-light transition-colors"
          >
            Back to Sign In
          </Link>
        </Card>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Retailer Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Merchant Name */}
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
              autoComplete="organization"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Acme Game Shop"
              required
            />
          </div>

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
              placeholder="you@example.com"
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
            {loading ? "Submitting\u2026" : "Create Retailer Account"}
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
