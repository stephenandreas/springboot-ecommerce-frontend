"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { syncCartToBackend } from "@/lib/cart";
import { checkout, initiatePayment, type StoreShippingInput } from "@/lib/orders";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";

const COURIERS = ["JNE", "JNT", "SICEPAT", "POS", "ANTERAJA"];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, byStore, subtotal, clear } = useCart();
  const { token, isReady } = useAuth();
  const groups = byStore();

  const [couriers, setCouriers] = useState<Record<string, string>>({});
  const [voucher, setVoucher] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingProvince: "",
    shippingPostalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (isReady && !token) router.replace("/login?next=/checkout");
  }, [isReady, token, router]);

  useEffect(() => {
    if (isReady && lines.length === 0 && !submitting) router.replace("/cart");
  }, [isReady, lines.length, submitting, router]);

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await syncCartToBackend(lines, token);
      const storeShippings: StoreShippingInput[] = groups.map((g) => ({
        storeId: g.storeId,
        courierName: couriers[g.storeId] ?? "JNE",
        courierService: "REG",
      }));
      const order = await checkout({ ...form, storeVoucherCode: voucher.trim() || undefined, storeShippings }, token);
      await initiatePayment(order.id, token).catch(() => undefined);
      clear();
      toast.success("Pesanan dibuat", { description: "Lanjutkan pembayaran di halaman pesanan." });
      router.push(`/orders/${order.id}`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Checkout gagal. Coba lagi.";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-4">
              <p className="font-medium">Alamat Pengiriman</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama penerima" value={form.shippingName} onChange={(v) => update("shippingName", v)} required />
                <Field label="No. telepon" value={form.shippingPhone} onChange={(v) => update("shippingPhone", v)} required />
              </div>
              <Field label="Alamat lengkap" value={form.shippingAddress} onChange={(v) => update("shippingAddress", v)} required />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Kota" value={form.shippingCity} onChange={(v) => update("shippingCity", v)} required />
                <Field label="Provinsi" value={form.shippingProvince} onChange={(v) => update("shippingProvince", v)} />
                <Field label="Kode pos" value={form.shippingPostalCode} onChange={(v) => update("shippingPostalCode", v)} required />
              </div>
              <Field label="Catatan (opsional)" value={form.notes} onChange={(v) => update("notes", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-4">
              <p className="font-medium">Pengiriman per Toko</p>
              {groups.map((g) => (
                <div key={g.storeId} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{g.storeName}</p>
                    <p className="text-xs text-muted-foreground">{g.lines.length} item · {formatIDR(g.subtotal)}</p>
                  </div>
                  <Select value={couriers[g.storeId] ?? "JNE"} onValueChange={(v) => setCouriers((c) => ({ ...c, [g.storeId]: v ?? "JNE" }))}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COURIERS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c} REG
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="font-semibold">Ringkasan</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Ongkir final dihitung server saat pesanan dibuat.</p>
              <Separator />
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Kode Voucher</label>
                <Input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode"
                  className="uppercase"
                />
                <Link href="/vouchers" target="_blank" className="text-xs text-primary hover:underline">
                  Lihat voucher tersedia
                </Link>
              </div>
              <Separator />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Memproses…" : "Buat Pesanan"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}
