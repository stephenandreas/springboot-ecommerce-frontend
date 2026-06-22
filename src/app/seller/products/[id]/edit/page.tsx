"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getSellerProducts, updateProduct, updateSku } from "@/lib/seller";
import { ApiError } from "@/lib/api";
import type { Product, ProductSku } from "@/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", brand: "", description: "" });
  const [skus, setSkus] = useState<ProductSku[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace(`/login?next=/seller/products/${id}/edit`);
      return;
    }
    getSellerProducts(token, 0, 100).then((p) => {
      const found = p.content.find((x) => x.id === id) ?? null;
      setProduct(found);
      if (found) {
        setForm({ name: found.name, brand: found.brand ?? "", description: found.description ?? "" });
        setSkus(found.skus ?? []);
      }
    });
  }, [isReady, token, id, router]);

  function setSku(i: number, patch: Partial<ProductSku>) {
    setSkus((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !product) return;
    setSaving(true);
    try {
      await updateProduct(product.id, form, token);
      for (const s of skus) {
        await updateSku(product.id, s.skuId, {
          price: Number(s.price),
          stock: Number(s.stock),
          discountPrice: s.discountPrice ? Number(s.discountPrice) : 0, // 0 clears
          discountEndsAt: s.discountEndsAt ?? null,
        }, token);
      }
      toast.success("Produk diperbarui");
      router.push("/seller/products");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal menyimpan");
      setSaving(false);
    }
  }

  if (!isReady || (token && product === null)) {
    return <Skeleton className="h-64 w-full max-w-2xl rounded-2xl" />;
  }
  if (product === null) {
    return <p className="text-sm text-muted-foreground">Produk tidak ditemukan.</p>;
  }

  return (
    <form onSubmit={onSave} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" asChild>
          <Link href="/seller/products"><ArrowLeft className="size-5" /></Link>
        </Button>
        <h1 className="text-xl font-semibold">Edit Produk</h1>
      </div>

      <div className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <div className="space-y-1.5">
          <Label>Nama</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Merek</Label>
          <Input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Deskripsi</Label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-muted/50 p-5">
        <p className="font-medium">Harga, Stok & Diskon</p>
        {skus.map((s, i) => (
          <div key={s.skuId} className="space-y-3 rounded-xl bg-background p-4">
            <span className="text-sm font-medium">{s.name}</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField label="Harga (Rp)" value={s.price} onChange={(v) => setSku(i, { price: v })} />
              <NumberField label="Stok" value={s.stock} onChange={(v) => setSku(i, { stock: v })} />
              <NumberField label="Harga diskon (0 = nonaktif)" value={s.discountPrice ?? 0} onChange={(v) => setSku(i, { discountPrice: v })} />
              <div className="space-y-1.5">
                <Label>Diskon berakhir</Label>
                <Input
                  type="datetime-local"
                  value={s.discountEndsAt ? s.discountEndsAt.slice(0, 16) : ""}
                  onChange={(e) => setSku(i, { discountEndsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" size="lg" className="rounded-full" disabled={saving}>
        {saving ? "Menyimpan…" : "Simpan Perubahan"}
      </Button>
    </form>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="number" value={String(value ?? "")} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
