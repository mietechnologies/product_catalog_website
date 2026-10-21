"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { updateVariant } from "@/lib/api/client";
import { cn, isHttpUrl } from "@/lib/utils";
import { PRODUCT_SIZES } from "@/lib/types";
import type { Attribution, UpdateVariantPayload } from "@/lib/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface EditVariantInitial {
  name: string;
  description: string;
  size: string;
  cost: number;
  wholesale: number;
  msrp: number;
  attribution?: Attribution | null;
}

interface EditVariantModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
  initial: EditVariantInitial;
  onSuccess: () => void;
}

export default function EditVariantModal({
  open,
  onClose,
  productCode,
  initial,
  onSuccess,
}: EditVariantModalProps) {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [size, setSize] = useState(initial.size);
  const [cost, setCost] = useState(initial.cost ? String(initial.cost) : "");
  const [wholesale, setWholesale] = useState(initial.wholesale ? String(initial.wholesale) : "");
  const [msrp, setMsrp] = useState(initial.msrp ? String(initial.msrp) : "");
  const initialCreator = initial.attribution?.creator ?? "";
  const initialModelUrl = initial.attribution?.modelUrl ?? "";
  const [creator, setCreator] = useState(initialCreator);
  const [modelUrl, setModelUrl] = useState(initialModelUrl);

  useEffect(() => setMounted(true), []);

  // Re-sync form when initial values change (e.g. modal re-opened with new data)
  useEffect(() => {
    setName(initial.name);
    setDescription(initial.description);
    setSize(initial.size);
    setCost(initial.cost ? String(initial.cost) : "");
    setWholesale(initial.wholesale ? String(initial.wholesale) : "");
    setMsrp(initial.msrp ? String(initial.msrp) : "");
    setCreator(initialCreator);
    setModelUrl(initialModelUrl);
  }, [initial.name, initial.description, initial.size, initial.cost, initial.wholesale, initial.msrp, initialCreator, initialModelUrl]);

  const trimmedModelUrl = modelUrl.trim();
  const modelUrlInvalid = trimmedModelUrl !== "" && !isHttpUrl(trimmedModelUrl);

  async function handleSave() {
    if (!auth) return;

    // Build payload with only changed fields
    const payload: UpdateVariantPayload = {};
    if (name !== initial.name) payload.name = name;
    if (description !== initial.description) payload.description = description;
    if (size !== initial.size) payload.size = size;

    const costNum = cost ? parseFloat(cost) : undefined;
    const wholesaleNum = wholesale ? parseFloat(wholesale) : undefined;
    const msrpNum = msrp ? parseFloat(msrp) : undefined;

    const priceChanges: UpdateVariantPayload["price"] = {};
    if (costNum !== (initial.cost || undefined)) priceChanges.cost = costNum;
    if (wholesaleNum !== (initial.wholesale || undefined)) priceChanges.wholesale = wholesaleNum;
    if (msrpNum !== (initial.msrp || undefined)) priceChanges.msrp = msrpNum;

    if (Object.keys(priceChanges).length > 0) payload.price = priceChanges;

    const trimmedCreator = creator.trim();
    if (trimmedCreator !== initialCreator || trimmedModelUrl !== initialModelUrl) {
      payload.attribution =
        trimmedCreator || trimmedModelUrl
          ? {
              ...(trimmedCreator && { creator: trimmedCreator }),
              ...(trimmedModelUrl && { modelUrl: trimmedModelUrl }),
            }
          : null;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    const result = await updateVariant(productCode, payload, auth.token);
    setSaving(false);

    if (result.ok) {
      toast("Variant updated successfully", "success");
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
            <h2 className="text-lg font-bold text-gray-900">Edit Variant</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
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

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={PRODUCT_SIZES.map((s) => ({ value: s, label: s }))}
                className="w-full"
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

            {/* Attribution (shared by every variant of this miniature) */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Attribution <span className="text-neutral text-xs">(optional)</span>
                </h3>
                <p className="text-xs text-neutral mt-0.5">
                  Credits the 3D model&apos;s creator. Applies to all variants. Leave blank for in-house models.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-attribution-creator" className="block text-sm font-medium text-gray-700 mb-1">
                    Creator
                  </label>
                  <Input
                    id="edit-attribution-creator"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="e.g. Jane Sculptor"
                  />
                </div>
                <div>
                  <label htmlFor="edit-attribution-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Model URL
                  </label>
                  <Input
                    id="edit-attribution-url"
                    type="url"
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    placeholder="https://…"
                    aria-invalid={modelUrlInvalid}
                  />
                </div>
              </div>
              {modelUrlInvalid && (
                <p className="text-xs text-red-600">Model URL must start with http:// or https://</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || modelUrlInvalid}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>,
    document.body,
  );
}
