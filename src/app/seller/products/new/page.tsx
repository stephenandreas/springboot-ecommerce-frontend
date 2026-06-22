"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { getCategories } from "@/lib/categories";
import { createProduct, publishProduct, uploadImage, addProductImage, type SkuInput } from "@/lib/seller";
import { ApiError } from "@/lib/api";
import type { Category } from "@/types";

const emptySku = (): SkuInput => ({ name: "", price: 0, stock: 0, weight: 500 });

export default function NewProductPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", brand: "", description: "", categoryId: "" });
  const [skus, setSkus] = useState<SkuInput[]>([emptySku()]);
  const [image, setImage] = useState<File | null>(null);
  const [publish, setPublish] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && !token) router.replace("/login?next=/seller/products/new");
  }, [isReady, token, router]);
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  function setSku(i: number, patch: Partial<SkuInput>) {
    setSkus((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.categoryId) return toast.error("Pilih kategori");
    setSubmitting(true);
    try {
      const cleanSkus = skus.map((s) => ({
        ...s,
        price: Number(s.price),
        stock: Number(s.stock),
        weight: Number(s.weight) || undefined,
        discountPrice: s.discountPrice ? Number(s.discountPrice) : undefined,
      }));
      const product = await createProduct({ ...form, skus: cleanSkus }, token);
      if (image) {
        const url = await uploadImage(image, token);
        await addProductImage(product.id, url, true, token);
      }
      if (publish) await publishProduct(product.id, token);
      toast.success("Produk dibuat");
      router.push("/seller/products");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat produk");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" asChild>
          <Link href="/seller/products"><ArrowLeft className="size-5" /></Link>
        </Button>
        <h1 className="text-xl font-semibold">Tambah Produk</h1>
      </div>

      <div className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <Field label="Nama produk" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Merek" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} />
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v ?? "" }))}>
              <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Field label="Deskripsi" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} textarea />
        <div className="space-y-1.5">
          <Label>Gambar utama</Label>
          <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-muted/50 p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium">Varian / SKU</p>
          <Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => setSkus((a) => [...a, emptySku()])}>
            <Plus className="size-4" /> Varian
          </Button>
        </div>
        {skus.map((s, i) => (
          <div key={i} className="space-y-3 rounded-xl bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Varian {i + 1}</span>
              {skus.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => setSkus((a) => a.filter((_, j) => j !== i))}>
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama varian" value={s.name} onChange={(v) => setSku(i, { name: v })} required />
              <Field label="Berat (gram)" type="number" value={String(s.weight ?? "")} onChange={(v) => setSku(i, { weight: Number(v) })} />
              <Field label="Harga (Rp)" type="number" value={String(s.price || "")} onChange={(v) => setSku(i, { price: Number(v) })} required />
              <Field label="Stok" type="number" value={String(s.stock || "")} onChange={(v) => setSku(i, { stock: Number(v) })} required />
              <Field label="Harga diskon (opsional)" type="number" value={String(s.discountPrice ?? "")} onChange={(v) => setSku(i, { discountPrice: v ? Number(v) : null })} />
              <Field label="Diskon berakhir (opsional)" type="datetime-local" value={s.discountEndsAt ?? ""} onChange={(v) => setSku(i, { discountEndsAt: v ? new Date(v).toISOString() : null })} />
            </div>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="size-4" />
        Langsung publikasikan
      </label>

      <Button type="submit" size="lg" className="rounded-full" disabled={submitting}>
        {submitting ? "Menyimpan…" : "Simpan Produk"}
      </Button>
    </form>
  );
}

function Field({
  label, value, onChange, type = "text", required, textarea,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; textarea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      )}
    </div>
  );
}
