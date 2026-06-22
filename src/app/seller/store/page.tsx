"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Store as StoreIcon, Camera, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getMyStore, updateStore, uploadStoreLogo, uploadStoreBanner } from "@/lib/seller";
import { ApiError } from "@/lib/api";
import type { Store } from "@/types";

export default function StoreSettingsPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [store, setStore] = useState<Store | null | undefined>(undefined);
  const [form, setForm] = useState({ name: "", description: "", originCity: "", originProvince: "", originAddress: "" });
  const [saving, setSaving] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/seller/store");
      return;
    }
    getMyStore(token)
      .then((s) => {
        setStore(s);
        setForm({
          name: s.name ?? "", description: s.description ?? "",
          originCity: s.originCity ?? "", originProvince: s.originProvince ?? "", originAddress: "",
        });
      })
      .catch(() => setStore(null));
  }, [isReady, token, router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const s = await updateStore(form, token);
      setStore(s);
      toast.success("Toko diperbarui");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function upload(kind: "logo" | "banner", file: File) {
    if (!token) return;
    try {
      const s = kind === "logo" ? await uploadStoreLogo(file, token) : await uploadStoreBanner(file, token);
      setStore(s);
      toast.success(kind === "logo" ? "Logo diperbarui" : "Banner diperbarui");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Upload gagal");
    }
  }

  if (store === undefined) return <Skeleton className="h-80 w-full max-w-2xl rounded-2xl" />;
  if (store === null) return <p className="text-sm text-muted-foreground">Anda belum memiliki toko.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Pengaturan Toko</h1>

      {/* Banner + logo */}
      <div className="overflow-hidden rounded-2xl bg-muted/50">
        <div className="relative h-32 bg-muted">
          {store.bannerUrl && <Image src={store.bannerUrl} alt="" fill sizes="640px" className="object-cover" />}
          <Button type="button" variant="secondary" size="sm" className="absolute right-3 top-3 rounded-full bg-background/90" onClick={() => bannerRef.current?.click()}>
            <Camera className="size-4" /> Banner
          </Button>
          <input ref={bannerRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload("banner", e.target.files[0])} />
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="relative -mt-10 size-20 shrink-0 overflow-hidden rounded-2xl bg-background ring-4 ring-background">
            {store.logoUrl ? (
              <Image src={store.logoUrl} alt={store.name} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="brand-gradient grid h-full place-items-center text-background"><StoreIcon className="size-7" /></div>
            )}
          </div>
          <Button type="button" variant="secondary" size="sm" className="rounded-full bg-background" onClick={() => logoRef.current?.click()}>
            <Upload className="size-4" /> Ganti Logo
          </Button>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload("logo", e.target.files[0])} />
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={onSave} className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <FormField label="Nama toko" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
        <div className="space-y-1.5">
          <Label>Deskripsi</Label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Kota asal" value={form.originCity} onChange={(v) => setForm((f) => ({ ...f, originCity: v }))} />
          <FormField label="Provinsi asal" value={form.originProvince} onChange={(v) => setForm((f) => ({ ...f, originProvince: v }))} />
        </div>
        <FormField label="Alamat asal" value={form.originAddress} onChange={(v) => setForm((f) => ({ ...f, originAddress: v }))} />
        <Button type="submit" className="rounded-full" disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
      </form>
    </div>
  );
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
