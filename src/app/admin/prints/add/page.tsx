"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { createPrint, uploadVariantImages } from "@/lib/api/client";
import { PRINT_CATEGORIES, type CreatePrintPayload } from "@/lib/types";

const categoryOptions = PRINT_CATEGORIES.map((c) => ({ value: c, label: c }));

/** Split "Halloween, Trunk or Treat" into ["Halloween", "Trunk or Treat"] */
function parseCollections(value: string): string[] {
  return value
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export default function AddPrintPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [collections, setCollections] = useState("");
  const [fileName, setFileName] = useState("");
  const [cost, setCost] = useState("");
  const [wholesale, setWholesale] = useState("");
  const [msrp, setMsrp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating…");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  if (ready && !auth) {
    router.push("/login");
    return null;
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-neutral">Loading…</p>
      </div>
    );
  }

  const canSubmit =
    name.trim() !== "" && category !== "" && fileName.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !auth) return;

    setLoading(true);
    setLoadingText("Creating…");

    const price: Record<string, number> = {};
    if (cost) price.cost = parseFloat(cost);
    if (wholesale) price.wholesale = parseFloat(wholesale);
    if (msrp) price.msrp = parseFloat(msrp);

    const collectionList = parseCollections(collections);

    const payload: CreatePrintPayload = {
      productType: "print",
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
      category,
      fileName: fileName.trim(),
      ...(collectionList.length > 0 && { collections: collectionList }),
      ...(Object.keys(price).length > 0 && { price }),
    };

    const result = await createPrint(payload, auth.token);

    if (!result.ok) {
      setLoading(false);
      toast(result.error, "error");
      return;
    }

    if (files.length > 0) {
      setLoadingText("Uploading images…");
      const uploadResult = await uploadVariantImages(
        result.data.productCode,
        files,
        auth.token,
      );
      if (!uploadResult.ok) {
        toast(`Image upload failed: ${uploadResult.error}`, "error");
      }
    }

    setLoading(false);
    toast("Print created successfully", "success");
    router.push(`/product/${result.data.productCode}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-2">Add Print</h1>
      <p className="text-sm text-neutral mb-8">
        For figurines, toys, decor, and other prints that don&apos;t need
        sizes or variants.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-dark mb-4">
            Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grinning Jack-o'-Lantern"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Description{" "}
                <span className="font-normal text-neutral">(optional)</span>
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the print"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-neutral-dark mb-1"
                >
                  Category
                </label>
                <Select
                  id="category"
                  options={categoryOptions}
                  placeholder="Select a category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="fileName"
                  className="block text-sm font-medium text-neutral-dark mb-1"
                >
                  File Name
                </label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="model.stl"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="collections"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Collections{" "}
                <span className="font-normal text-neutral">
                  (optional, comma-separated)
                </span>
              </label>
              <Input
                id="collections"
                value={collections}
                onChange={(e) => setCollections(e.target.value)}
                placeholder="e.g. Halloween, Trunk or Treat"
              />
            </div>

            {/* Pricing */}
            <fieldset>
              <legend className="block text-sm font-medium text-neutral-dark mb-2">
                Pricing{" "}
                <span className="font-normal text-neutral">(optional)</span>
              </legend>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cost" className="block text-xs text-neutral mb-1">
                    Cost
                  </label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label htmlFor="wholesale" className="block text-xs text-neutral mb-1">
                    Wholesale
                  </label>
                  <Input
                    id="wholesale"
                    type="number"
                    step="0.01"
                    min="0"
                    value={wholesale}
                    onChange={(e) => setWholesale(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label htmlFor="msrp" className="block text-xs text-neutral mb-1">
                    MSRP
                  </label>
                  <Input
                    id="msrp"
                    type="number"
                    step="0.01"
                    min="0"
                    value={msrp}
                    onChange={(e) => setMsrp(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </fieldset>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Photos{" "}
                <span className="font-normal text-neutral">(optional)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files;
                  if (selected) setFiles(Array.from(selected));
                }}
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Photos
                </Button>
                {files.length > 0 && (
                  <>
                    <span className="text-sm text-neutral">
                      {files.length} image{files.length !== 1 && "s"} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFiles([]);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-sm text-neutral hover:text-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || loading}
        >
          {loading ? loadingText : "Create Print"}
        </Button>
      </form>
    </div>
  );
}
