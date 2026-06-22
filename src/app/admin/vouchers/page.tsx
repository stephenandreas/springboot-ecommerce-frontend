"use client";

import { useCallback, useEffect, useState } from "react";
import { Ticket, Plus, Ban } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getAdminVouchers, createAdminVoucher, deactivateAdminVoucher } from "@/lib/admin";
import type { StoreVoucherInput } from "@/lib/seller";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Voucher } from "@/types";

const blank = (): StoreVoucherInput => ({ code: "", type: "PERCENTAGE", value: 0, usageLimit: 100, validFrom: "", validUntil: "" });

export default function AdminVouchersPage() {
  const { token } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[] | null>(null);
  const [form, setForm] = useState<StoreVoucherInput>(blank());
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    getAdminVouchers(token).then(setVouchers).catch(() => setVouchers([]));
  }, [token]);
  useEffect(() => { load(); }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    try {
      await createAdminVoucher({
        ...form, value: Number(form.value), usageLimit: Number(form.usageLimit),
        validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : new Date().toISOString(),
        validUntil: new Date(form.validUntil).toISOString(),
      }, token);
      toast.success("Voucher dibuat"); setForm(blank()); setShow(false); load();
    } catch (err) { toast.error(err instanceof ApiError ? err.message : "Gagal"); }
    finally { setBusy(false); }
  }
  const set = (p: Partial<StoreVoucherInput>) => setForm((f) => ({ ...f, ...p }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Voucher Platform</h1>
        <Button size="sm" className="rounded-full" onClick={() => setShow((s) => !s)}><Plus className="size-4" /> Buat</Button>
      </div>

      {show && (
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl bg-muted/50 p-5 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Kode</Label><Input value={form.code} onChange={(e) => set({ code: e.target.value.toUpperCase() })} required className="uppercase" /></div>
          <div className="space-y-1.5">
            <Label>Tipe</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: (v as StoreVoucherInput["type"]) ?? "PERCENTAGE" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="PERCENTAGE">Persentase (%)</SelectItem><SelectItem value="FIXED">Nominal (Rp)</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Nilai</Label><Input type="number" value={String(form.value || "")} onChange={(e) => set({ value: Number(e.target.value) })} required /></div>
          <div className="space-y-1.5"><Label>Kuota</Label><Input type="number" value={String(form.usageLimit || "")} onChange={(e) => set({ usageLimit: Number(e.target.value) })} required /></div>
          <div className="space-y-1.5"><Label>Mulai</Label><Input type="datetime-local" value={form.validFrom} onChange={(e) => set({ validFrom: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Berakhir</Label><Input type="datetime-local" value={form.validUntil} onChange={(e) => set({ validUntil: e.target.value })} required /></div>
          <Button type="submit" className="rounded-full sm:col-span-2" disabled={busy}>{busy ? "Menyimpan…" : "Simpan"}</Button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {vouchers === null ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
          : vouchers.length === 0 ? <EmptyState icon={Ticket} title="Belum ada voucher" />
          : vouchers.map((v) => (
            <div key={v.id} className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
              <Ticket className="size-6 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-mono font-bold">{v.code}</p>
                <p className="text-xs text-muted-foreground">{v.type === "PERCENTAGE" ? `${v.value}%` : formatIDR(v.value)} · {v.usedCount}/{v.usageLimit}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deactivateAdminVoucher(v.id, token!).then(() => { toast.success("Dinonaktifkan"); load(); }).catch(() => toast.error("Gagal"))}><Ban className="size-4" /> Nonaktif</Button>
            </div>
          ))}
      </div>
    </div>
  );
}
