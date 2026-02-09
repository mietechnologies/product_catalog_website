"use client";

import { cn } from "@/lib/utils";

interface PasswordChecklistProps {
  password: string;
  confirmPassword: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

export default function PasswordChecklist({
  password,
  confirmPassword,
}: PasswordChecklistProps) {
  const requirements: Requirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    {
      label: "One number or special character",
      met: /[\d\W]/.test(password),
    },
    {
      label: "Passwords match",
      met: password.length > 0 && password === confirmPassword,
    },
  ];

  return (
    <ul className="space-y-1.5 text-sm" aria-label="Password requirements">
      {requirements.map((req) => (
        <li key={req.label} className="flex items-center gap-2">
          <svg
            className={cn(
              "h-4 w-4 flex-shrink-0",
              req.met ? "text-green-500" : "text-neutral-light",
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            {req.met ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            ) : (
              <circle cx="12" cy="12" r="9" />
            )}
          </svg>
          <span
            className={cn(
              req.met ? "text-green-700" : "text-neutral",
            )}
          >
            {req.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Returns true when all password requirements are met */
export function allRequirementsMet(
  password: string,
  confirmPassword: string,
): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[\d\W]/.test(password) &&
    password.length > 0 &&
    password === confirmPassword
  );
}
