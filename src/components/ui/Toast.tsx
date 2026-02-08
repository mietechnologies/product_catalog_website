"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

type ToastVariant = "error" | "success" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  dismissing: boolean;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

// ── Context ──────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────

let nextId = 0;

const DURATION_MS = 5000;
const EXIT_MS = 300;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "error") => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, variant, dismissing: false }]);

      const timer = setTimeout(() => {
        dismiss(id);
        timers.current.delete(id);
      }, DURATION_MS);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  // Cleanup on unmount
  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Rendering ────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, string> = {
  error: "border-red-300 bg-red-50 text-red-800",
  success: "border-green-300 bg-green-50 text-green-800",
  info: "border-primary/30 bg-primary/5 text-primary",
};

const variantIcons: Record<ToastVariant, string> = {
  error:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  success:
    "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  info:
    "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
};

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
            variantStyles[t.variant],
            t.dismissing
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100",
          )}
          style={{ transitionDuration: `${EXIT_MS}ms` }}
        >
          {/* Icon */}
          <svg
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={variantIcons[t.variant]}
            />
          </svg>

          {/* Message */}
          <p className="flex-1 text-sm font-medium">{t.message}</p>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(t.id)}
            className="flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            <svg
              className="h-4 w-4"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
