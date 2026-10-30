"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { loginAdmin } from "@/lib/auth/api";
import { RetailerSignupPrompt } from "@/modules/retail";
import { MAIN_SITE_URL } from "@/lib/site";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() !== "" && password !== "";

  async function doLogin() {
    if (!canSubmit || loading) return;

    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    signIn(result.data.user);
    toast("Signed in successfully", "success");
    router.push("/");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    doLogin();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") doLogin();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onKeyDown={handleKeyDown}
              placeholder="admin@example.com"
              required
            />
          </div>

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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || loading}
          >
            {loading ? "Signing in\u2026" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral space-y-2">
          <RetailerSignupPrompt />
          <p>
            Uses your MieTech account. Signing in here also signs you in on{" "}
            <a
              href={MAIN_SITE_URL}
              className="font-medium text-primary hover:text-primary-light transition-colors"
            >
              the main site
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
