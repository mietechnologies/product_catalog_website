"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { createOrder } from "../api";

interface LineItem {
  productCode: string;
  quantity: number;
}

export default function CreateOrderScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [items, setItems] = useState<LineItem[]>([
    { productCode: "", quantity: 1 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in or if admin
  useEffect(() => {
    if (ready && (!auth || auth.user.role === "admin")) {
      router.replace(auth ? "/" : "/login");
    }
  }, [ready, auth, router]);

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { productCode: "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const canSubmit =
    !submitting && items.length > 0 && items.every((item) => item.productCode.trim() !== "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !canSubmit) return;

    setSubmitting(true);
    const result = await createOrder(
      items.map((item) => ({
        productCode: item.productCode.trim(),
        quantity: item.quantity,
      })),
    );
    setSubmitting(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    toast("Order placed successfully!", "success");
    router.push("/");
  }

  if (!ready || !auth || auth.user.role === "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6">Create Order</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Line items */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-dark">
              Line Items
            </label>

            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Product Code"
                    value={item.productCode}
                    onChange={(e) => updateItem(index, "productCode", e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              + Add another item
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
