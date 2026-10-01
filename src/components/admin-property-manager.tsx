"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { ManagedProperty } from "@/lib/property-listings";

type UploadedImage = { url: string; publicId: string };

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : undefined;
}

export function AdminPropertyManager({
  initialProperties,
}: {
  initialProperties: ManagedProperty[];
}) {
  const router = useRouter();
  const [properties, setProperties] = useState(initialProperties);
  const [editingProperty, setEditingProperty] =
    useState<ManagedProperty | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  function submitProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentProperty = editingProperty;

    startTransition(async () => {
      try {
        const files = formData
          .getAll("files")
          .filter(
            (value): value is File => value instanceof File && value.size > 0,
          );
        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            const uploadData = new FormData();
            uploadData.set("file", file);
            const response = await fetch("/api/uploads", {
              method: "POST",
              body: uploadData,
            });
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error ?? "Image upload failed.");
            }
            return result.image as UploadedImage;
          }),
        );

        const title = String(formData.get("title") ?? "").trim();
        const imageUrls = String(formData.get("imageUrls") ?? "")
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean);
        const retainedImages = imageUrls.map((url) => {
          const existing = currentProperty?.images.find(
            (image) => image.url === url,
          );
          return {
            url,
            publicId: existing?.publicId ?? undefined,
            altText: existing?.altText ?? title,
          };
        });

        const payload = {
          title,
          category: String(formData.get("category")),
          propertyType: String(formData.get("propertyType") ?? "").trim(),
          price: Number(formData.get("price")),
          currency: String(formData.get("currency") ?? "NGN").trim(),
          status: String(formData.get("status")),
          location: String(formData.get("location") ?? "").trim(),
          address: String(formData.get("address") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          bedrooms: optionalNumber(formData.get("bedrooms")),
          bathrooms: optionalNumber(formData.get("bathrooms")),
          toilets: optionalNumber(formData.get("toilets")),
          propertySize:
            String(formData.get("propertySize") ?? "").trim() || undefined,
          landSize: String(formData.get("landSize") ?? "").trim() || undefined,
          featured: formData.has("featured"),
          published: formData.has("published"),
          features: String(formData.get("features") ?? "")
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),
          images: [
            ...retainedImages,
            ...uploadedImages.map((image) => ({ ...image, altText: title })),
          ],
        };

        const response = await fetch(
          currentProperty
            ? `/api/properties/${currentProperty.id}`
            : "/api/properties",
          {
            method: currentProperty ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Property could not be saved.");
        }

        setMessage(currentProperty ? "Property updated." : "Property created.");
        setEditingProperty(null);
        form.reset();
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Property could not be saved.",
        );
      }
    });
  }

  function deleteProperty(property: ManagedProperty) {
    if (!window.confirm(`Delete “${property.title}” and its listing images?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/properties/${property.id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Property could not be deleted.");
        }
        setProperties((current) =>
          current.filter((item) => item.id !== property.id),
        );
        if (editingProperty?.id === property.id) setEditingProperty(null);
        setMessage("Property deleted.");
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Property could not be deleted.",
        );
      }
    });
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F2C59]">
            Property listings
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {properties.length} total listings
          </p>
        </div>
        {!editingProperty ? (
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              document
                .getElementById("property-editor")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17457f]"
          >
            <Plus size={17} /> Add property
          </button>
        ) : null}
      </div>

      {message ? (
        <p role="status" className="mb-5 text-sm text-slate-700">
          {message}
        </p>
      ) : null}

      <form
        id="property-editor"
        key={editingProperty?.id ?? "new-property"}
        onSubmit={submitProperty}
        className="mb-10 scroll-mt-8 border-y border-slate-200 py-6"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-[#0F2C59]">
            {editingProperty ? "Edit property" : "New property"}
          </h3>
          {editingProperty ? (
            <button
              type="button"
              onClick={() => {
                setEditingProperty(null);
                setMessage(null);
              }}
              className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[#0F2C59]"
            >
              <X size={16} /> Cancel
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Title
            <input
              name="title"
              required
              minLength={3}
              defaultValue={editingProperty?.title}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Category
            <select
              name="category"
              defaultValue={editingProperty?.category ?? "RENT"}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="RENT">Rent</option>
              <option value="BUY_PROPERTY">Buy property</option>
              <option value="BUY_LAND">Buy land</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Property type
            <input
              name="propertyType"
              required
              minLength={2}
              defaultValue={editingProperty?.propertyType}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={editingProperty?.price ?? ""}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Currency
            <input
              name="currency"
              required
              defaultValue={editingProperty?.currency ?? "NGN"}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              name="status"
              defaultValue={editingProperty?.status ?? "AVAILABLE"}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="TAKEN">Taken</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              required
              minLength={2}
              defaultValue={editingProperty?.location}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Address
            <input
              name="address"
              required
              minLength={5}
              defaultValue={editingProperty?.address}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-3">
            Description
            <textarea
              name="description"
              required
              minLength={10}
              rows={4}
              defaultValue={editingProperty?.description}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Bedrooms
            <input
              name="bedrooms"
              type="number"
              min="0"
              defaultValue={editingProperty?.bedrooms ?? ""}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Bathrooms
            <input
              name="bathrooms"
              type="number"
              min="0"
              defaultValue={editingProperty?.bathrooms ?? ""}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Toilets
            <input
              name="toilets"
              type="number"
              min="0"
              defaultValue={editingProperty?.toilets ?? ""}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Property size
            <input
              name="propertySize"
              defaultValue={editingProperty?.propertySize}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Land size
            <input
              name="landSize"
              defaultValue={editingProperty?.landSize}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-3">
            Features, separated by commas
            <input
              name="features"
              defaultValue={editingProperty?.features.join(", ")}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-3">
            Image URLs, one per line
            <textarea
              name="imageUrls"
              rows={3}
              defaultValue={editingProperty?.images
                .map((image) => image.url)
                .join("\n")}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-3">
            Upload photos
            <input
              name="files"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold file:text-slate-700"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              name="published"
              type="checkbox"
              defaultChecked={editingProperty?.published ?? false}
              className="size-4 accent-[#0F2C59]"
            />
            Publish on the site
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={editingProperty?.featured ?? false}
              className="size-4 accent-[#0F2C59]"
            />
            Feature on the home page
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {editingProperty ? <Save size={17} /> : <ImagePlus size={17} />}
          {isPending
            ? "Saving..."
            : editingProperty
              ? "Save changes"
              : "Create property"}
        </button>
      </form>

      {properties.length === 0 ? (
        <p className="border-y border-slate-200 py-8 text-sm text-slate-600">
          There are no property posts yet.
        </p>
      ) : (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {properties.map((property) => (
            <article
              key={property.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                {property.images[0]?.url ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={property.images[0].url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <ImagePlus size={20} />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="truncate font-semibold text-[#0F2C59]">
                    {property.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {property.location} · {property.status} ·{" "}
                    {property.images.length} photos
                  </p>
                  <p className="text-xs text-slate-500">
                    {property.published ? "Published" : "Draft"}
                    {property.featured ? " · Featured" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title={`Edit ${property.title}`}
                  aria-label={`Edit ${property.title}`}
                  onClick={() => {
                    setEditingProperty(property);
                    setMessage(null);
                    document
                      .getElementById("property-editor")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-300 text-[#0F2C59] hover:bg-slate-50"
                >
                  <Pencil size={17} />
                </button>
                <button
                  type="button"
                  title={`Delete ${property.title}`}
                  aria-label={`Delete ${property.title}`}
                  disabled={isPending}
                  onClick={() => deleteProperty(property)}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
