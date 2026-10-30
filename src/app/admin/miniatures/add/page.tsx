"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { createMiniature, uploadVariantImages } from "@/lib/api/client";
import { isHttpUrl } from "@/lib/utils";
import {
  CREATURE_TYPES,
  PRODUCT_SIZES,
  type CreateMiniaturePayload,
} from "@/lib/types";

interface VariantForm {
  name: string;
  description: string;
  size: string;
  fileName: string;
  cost: string;
  wholesale: string;
  msrp: string;
  files: File[];
}

function emptyVariant(): VariantForm {
  return {
    name: "",
    description: "",
    size: "",
    fileName: "",
    cost: "",
    wholesale: "",
    msrp: "",
    files: [],
  };
}

const categoryOptions = CREATURE_TYPES.map((c) => ({ value: c, label: c }));
const sizeOptions = PRODUCT_SIZES.map((s) => ({ value: s, label: s }));

export default function AddMiniaturePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, ready } = useAuth();

  const [baseName, setBaseName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [creator, setCreator] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant()]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating…");
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

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

  const modelUrlInvalid = modelUrl.trim() !== "" && !isHttpUrl(modelUrl.trim());

  const canSubmit =
    baseName.trim() !== "" &&
    category !== "" &&
    !modelUrlInvalid &&
    variants.every(
      (v) => v.name.trim() !== "" && v.size !== "" && v.fileName.trim() !== "",
    );

  function updateVariant(
    index: number,
    field: keyof VariantForm,
    value: string,
  ) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, emptyVariant()]);
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !auth) return;

    setLoading(true);
    setLoadingText("Creating…");

    const payload: CreateMiniaturePayload = {
      baseName: baseName.trim(),
      ...(description.trim() && { description: description.trim() }),
      category,
      ...((creator.trim() || modelUrl.trim()) && {
        attribution: {
          ...(creator.trim() && { creator: creator.trim() }),
          ...(modelUrl.trim() && { modelUrl: modelUrl.trim() }),
        },
      }),
      variants: variants.map((v) => {
        const price: Record<string, number> = {};
        if (v.cost) price.cost = parseFloat(v.cost);
        if (v.wholesale) price.wholesale = parseFloat(v.wholesale);
        if (v.msrp) price.msrp = parseFloat(v.msrp);

        return {
          name: v.name.trim(),
          ...(v.description.trim() && { description: v.description.trim() }),
          size: v.size,
          fileName: v.fileName.trim(),
          ...(Object.keys(price).length > 0 && { price }),
        };
      }),
    };

    const result = await createMiniature(payload);

    if (!result.ok) {
      setLoading(false);
      toast(result.error, "error");
      return;
    }

    // Upload images for variants that have files selected
    const variantsWithFiles = variants
      .map((v, i) => ({ index: i, files: v.files }))
      .filter((v) => v.files.length > 0);

    if (variantsWithFiles.length > 0) {
      setLoadingText("Uploading images…");

      // Product codes come back in the order the variants were sent
      const created = result.data.product;

      await Promise.all(
        variantsWithFiles.map(async ({ index, files }) => {
          const productCode = created.variants[index]?.productCode;
          if (!productCode) return;

          const uploadResult = await uploadVariantImages(
            productCode,
            files,
          );
          if (!uploadResult.ok) {
            toast(
              `Image upload failed for variant ${index + 1}: ${uploadResult.error}`,
              "error",
            );
          }
        }),
      );
    }

    setLoading(false);
    toast("Miniature created successfully", "success");
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-8">Add Miniature</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Miniature details ─────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-dark mb-4">
            Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="baseName"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Base Name
              </label>
              <Input
                id="baseName"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                placeholder="e.g. Silver Dragon"
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
                placeholder="Brief description of the miniature"
              />
            </div>

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
                required
              />
            </div>
          </div>
        </Card>

        {/* ── Attribution ───────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-dark">
            Attribution{" "}
            <span className="text-sm font-normal text-neutral">(optional)</span>
          </h2>
          <p className="text-sm text-neutral mt-1 mb-4">
            Credit the creator of a third-party 3D model. Leave blank for
            in-house models.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="attributionCreator"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Creator
              </label>
              <Input
                id="attributionCreator"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g. Jane Sculptor"
              />
            </div>

            <div>
              <label
                htmlFor="attributionModelUrl"
                className="block text-sm font-medium text-neutral-dark mb-1"
              >
                Model URL
              </label>
              <Input
                id="attributionModelUrl"
                type="url"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                placeholder="https://…"
                aria-invalid={modelUrlInvalid}
              />
              {modelUrlInvalid && (
                <p className="mt-1 text-xs text-red-600">
                  Model URL must start with http:// or https://
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* ── Variants ──────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-dark mb-4">
            Variants
          </h2>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-primary">
                    Variant {index + 1}
                  </h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="rounded-lg p-1.5 text-neutral hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label={`Remove variant ${index + 1}`}
                    >
                      <svg
                        className="h-4 w-4"
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`v${index}-name`}
                      className="block text-sm font-medium text-neutral-dark mb-1"
                    >
                      Name
                    </label>
                    <Input
                      id={`v${index}-name`}
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, "name", e.target.value)
                      }
                      placeholder="e.g. Wyrmling"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`v${index}-description`}
                      className="block text-sm font-medium text-neutral-dark mb-1"
                    >
                      Description{" "}
                      <span className="font-normal text-neutral">
                        (optional)
                      </span>
                    </label>
                    <Input
                      id={`v${index}-description`}
                      value={variant.description}
                      onChange={(e) =>
                        updateVariant(index, "description", e.target.value)
                      }
                      placeholder="Variant-specific description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`v${index}-size`}
                        className="block text-sm font-medium text-neutral-dark mb-1"
                      >
                        Size
                      </label>
                      <Select
                        id={`v${index}-size`}
                        options={sizeOptions}
                        placeholder="Select size"
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(index, "size", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`v${index}-fileName`}
                        className="block text-sm font-medium text-neutral-dark mb-1"
                      >
                        File Name
                      </label>
                      <Input
                        id={`v${index}-fileName`}
                        value={variant.fileName}
                        onChange={(e) =>
                          updateVariant(index, "fileName", e.target.value)
                        }
                        placeholder="model.stl"
                        required
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <fieldset>
                    <legend className="block text-sm font-medium text-neutral-dark mb-2">
                      Pricing{" "}
                      <span className="font-normal text-neutral">
                        (optional)
                      </span>
                    </legend>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor={`v${index}-cost`}
                          className="block text-xs text-neutral mb-1"
                        >
                          Cost
                        </label>
                        <Input
                          id={`v${index}-cost`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.cost}
                          onChange={(e) =>
                            updateVariant(index, "cost", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`v${index}-wholesale`}
                          className="block text-xs text-neutral mb-1"
                        >
                          Wholesale
                        </label>
                        <Input
                          id={`v${index}-wholesale`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.wholesale}
                          onChange={(e) =>
                            updateVariant(index, "wholesale", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`v${index}-msrp`}
                          className="block text-xs text-neutral mb-1"
                        >
                          MSRP
                        </label>
                        <Input
                          id={`v${index}-msrp`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.msrp}
                          onChange={(e) =>
                            updateVariant(index, "msrp", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Photos{" "}
                      <span className="font-normal text-neutral">
                        (optional)
                      </span>
                    </label>
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current.set(index, el);
                        else fileInputRefs.current.delete(index);
                      }}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files;
                        if (!selected) return;
                        setVariants((prev) =>
                          prev.map((v, i) =>
                            i === index
                              ? { ...v, files: Array.from(selected) }
                              : v,
                          ),
                        );
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          fileInputRefs.current.get(index)?.click()
                        }
                      >
                        {/* Camera icon */}
                        <svg
                          className="h-4 w-4"
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
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                          />
                        </svg>
                        Select Photos
                      </Button>
                      {variant.files.length > 0 && (
                        <>
                          <span className="text-sm text-neutral">
                            {variant.files.length} image
                            {variant.files.length !== 1 && "s"} selected
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setVariants((prev) =>
                                prev.map((v, i) =>
                                  i === index ? { ...v, files: [] } : v,
                                ),
                              );
                              const input =
                                fileInputRefs.current.get(index);
                              if (input) input.value = "";
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
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 w-full"
            onClick={addVariant}
          >
            + Add Variant
          </Button>
        </section>

        {/* ── Submit ────────────────────────────────────────── */}
        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || loading}
        >
          {loading ? loadingText : "Create Miniature"}
        </Button>
      </form>
    </div>
  );
}
