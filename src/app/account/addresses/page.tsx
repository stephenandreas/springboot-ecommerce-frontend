"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, type AddressInput } from "@/lib/account";
import { ApiError } from "@/lib/api";
import type { Address } from "@/types";

const empty: AddressInput = { label: "", recipientName: "", phone: "", street: "", city: "", province: "", postalCode: "" };

export default function AddressesPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [editing, setEditing] = useState<{ id?: string; data: AddressInput } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    getAddresses(token).then(setAddresses).catch(() => setAddresses([]));
  }, [token]);
  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/account/addresses");
      return;
    }
    load();
  }, [isReady, token, router, load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateAddress(editing.id, editing.data, token);
      else await createAddress(editing.data, token);
      toast.success("Alamat disimpan");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    } finally {
      setSaving(false);
    }
  }

  async function act(fn: () => Promise<unknown>, msg: string) {
    if (!token) return;
    try {
      await fn();
      toast.success(msg);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    }
  }

  function set(patch: Partial<AddressInput>) {
    setEditing((e) => (e ? { ...e, data: { ...e.data, ...patch } } : e));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Alamat Saya</h1>
        {!editing && (
          <Button size="sm" className="rounded-full" onClick={() => setEditing({ data: { ...empty } })}>
            <Plus className="size-4" /> Tambah
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl bg-muted/50 p-5">
          <p className="font-medium">{editing.id ? "Edit Alamat" : "Alamat Baru"}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Label (Rumah/Kantor)" v={editing.data.label ?? ""} on={(v) => set({ label: v })} />
            <F label="Nama penerima" v={editing.data.recipientName} on={(v) => set({ recipientName: v })} req />
            <F label="No. telepon" v={editing.data.phone} on={(v) => set({ phone: v })} req />
            <F label="Kode pos" v={editing.data.postalCode} on={(v) => set({ postalCode: v })} req />
          </div>
          <F label="Alamat lengkap" v={editing.data.street} on={(v) => set({ street: v })} req />
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Kota" v={editing.data.city} on={(v) => set({ city: v })} req />
            <F label="Provinsi" v={editing.data.province} on={(v) => set({ province: v })} req />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(editing.data.isDefault)} onChange={(e) => set({ isDefault: e.target.checked })} className="size-4" />
            Jadikan alamat utama
          </label>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full" disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Batal</Button>
          </div>
        </form>
      ) : addresses === null ? (
        <div className="mt-6 space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : addresses.length === 0 ? (
        <div className="mt-6"><EmptyState icon={MapPin} title="Belum ada alamat" description="Tambahkan alamat pengiriman." /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    {a.recipientName}
                    {a.isDefault && <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">Utama</span>}
                    {a.label && <span className="text-xs text-muted-foreground">· {a.label}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{a.phone}</p>
                  <p className="mt-1 text-sm">{a.street}, {a.city}, {a.province} {a.postalCode}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" className="size-8" aria-label="Edit" onClick={() => setEditing({ id: a.id, data: {
                    label: a.label ?? "", recipientName: a.recipientName, phone: a.phone, street: a.street,
                    city: a.city, province: a.province, postalCode: a.postalCode, subdistrict: a.subdistrict ?? "", isDefault: a.isDefault,
                  } })}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive" aria-label="Hapus" onClick={() => confirm("Hapus alamat?") && act(() => deleteAddress(a.id, token!), "Alamat dihapus")}><Trash2 className="size-4" /></Button>
                </div>
              </div>
              {!a.isDefault && (
                <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs" onClick={() => act(() => setDefaultAddress(a.id, token!), "Alamat utama diubah")}>
                  <Star className="size-3.5" /> Jadikan utama
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function F({ label, v, on, req }: { label: string; v: string; on: (v: string) => void; req?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} required={req} />
    </div>
  );
}
