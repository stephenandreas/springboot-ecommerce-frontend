import { Ticket } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { listVouchers } from "@/lib/vouchers";
import { formatIDR } from "@/lib/format";

export const metadata = { title: "Voucher" };

export default async function VouchersPage() {
  const vouchers = await listVouchers();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-xl font-semibold">Voucher Tersedia</h1>
      <p className="mt-1 text-sm text-muted-foreground">Salin kode lalu masukkan saat checkout.</p>

      <div className="mt-6 space-y-3">
        {vouchers.length === 0 ? (
          <EmptyState icon={Ticket} title="Belum ada voucher" description="Voucher aktif akan muncul di sini." />
        ) : (
          vouchers.map((v) => (
            <div key={v.id} className="flex items-center gap-4 overflow-hidden rounded-2xl bg-muted/50">
              <div className="flex h-full items-center self-stretch bg-primary px-5 text-primary-foreground">
                <Ticket className="size-6" />
              </div>
              <div className="min-w-0 flex-1 py-4">
                <p className="text-lg font-bold">
                  {v.type === "PERCENTAGE" ? `Diskon ${v.value}%` : `Potongan ${formatIDR(v.value)}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {v.minOrderAmount ? `Min. belanja ${formatIDR(v.minOrderAmount)}` : "Tanpa min. belanja"}
                  {v.maxDiscount ? ` · maks ${formatIDR(v.maxDiscount)}` : ""}
                </p>
              </div>
              <div className="px-4">
                <span className="rounded-lg border-2 border-dashed border-primary/40 px-3 py-1.5 font-mono text-sm font-bold tracking-wider">
                  {v.code}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
