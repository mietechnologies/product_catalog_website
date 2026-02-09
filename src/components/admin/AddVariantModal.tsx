"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { addVariant } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { PRODUCT_SIZES } from "@/lib/types";
import type { AddVariantPayload, ProductSize } from "@/lib/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface AddVariantModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
  onSuccess: () => void;
}

export default function AddVariantModal({
  open,
  onClose,
  productCode,
  onSuccess,
}: AddVariantModalProps) {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [fileName, setFileName] = useState("");
  const [size, setSize] = useState<ProductSize>(PRODUCT_SIZES[0]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [wholesale, setWholesale] = useState("");
  const [msrp, setMsrp] = useState("");

  useEffect(() => setMounted(true), []);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setFileName("");
      setSize(PRODUCT_SIZES[0]);
      setDescription("");
      setCost("");
      setWholesale("");
      setMsrp("");
    }
  }, [open]);

  async function handleSave() {
    if (!auth) return;

    if (!name.trim()) {
      toast("Name is required");
      return;
    }
    if (!fileName.trim()) {
      toast("File Name is required");
      return;
    }

    const payload: AddVariantPayload = {
      name: name.trim(),
      size,
      fileName: fileName.trim(),
    };

    if (description.trim()) {
      payload.description = description.trim();
    }

    const costNum = cost ? parseFloat(cost) : undefined;
    const wholesaleNum = wholesale ? parseFloat(wholesale) : undefined;
    const msrpNum = msrp ? parseFloat(msrp) : undefined;

    if (costNum !== undefined || wholesaleNum !== undefined || msrpNum !== undefined) {
      payload.price = {};
      if (costNum !== undefined) payload.price.cost = costNum;
      if (wholesaleNum !== undefined) payload.price.wholesale = wholesaleNum;
      if (msrpNum !== undefined) payload.price.msrp = msrpNum;
    }

    setSaving(true);
    const result = await addVariant(productCode, payload, auth.token);
    setSaving(false);

    if (result.ok) {
      toast("Variant added successfully", "success");
      onSuccess();
      onClose();
    } else {
      toast(result.error);
    }
  }

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <Card
          className={cn(
            "w-full max-w-lg transition-all duration-200",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <div className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Add Variant</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Painted" />
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
              <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="e.g. silver-dragon-painted" />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value as ProductSize)}
                options={PRODUCT_SIZES.map((s) => ({ value: s, label: s }))}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-neutral text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-neutral/30 bg-white px-3 py-2 text-sm",
                  "placeholder:text-neutral-light",
                  "hover:border-neutral",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
                  "transition-colors resize-none",
                )}
              />
            </div>

            {/* Price fields */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost <span className="text-neutral text-xs">(opt)</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wholesale <span className="text-neutral text-xs">(opt)</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={wholesale}
                  onChange={(e) => setWholesale(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MSRP <span className="text-neutral text-xs">(opt)</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={msrp}
                  onChange={(e) => setMsrp(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Add Variant"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>,
    document.body,
  );
}
