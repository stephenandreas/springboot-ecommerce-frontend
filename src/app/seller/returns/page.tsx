"use client";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getSellerReturns } from "@/lib/returns";
import { formatIDR } from "@/lib/format";
import type { ReturnRequest } from "@/types";

export default function SellerReturnsPage() {
  const { token } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[] | null>(null);

  useEffect(() => {
    if (!token) return;
    getSellerReturns(token).then(setReturns).catch(() => setReturns([]));
  }, [token]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Retur Masuk</h1>
      <div className="mt-6 space-y-3">
        {returns === null ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : returns.length === 0 ? (
          <EmptyState icon={Undo2} title="Belum ada retur" />
        ) : returns.map((r) => (
          <div key={r.id} className="rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs text-muted-foreground">Pesanan #{r.orderId.slice(0, 8)}</p>
              <Badge variant="secondary">{r.status}</Badge>
            </div>
            <p className="mt-2 text-sm">{r.reason}</p>
            {r.refundAmount != null && r.refundAmount > 0 && <p className="mt-1 text-sm text-muted-foreground">Refund {formatIDR(r.refundAmount)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
