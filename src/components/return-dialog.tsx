"use client";

import { useState } from "react";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { requestReturn } from "@/lib/returns";
import { ApiError } from "@/lib/api";

export function ReturnDialog({ orderId, subOrderId, token }: { orderId: string; subOrderId: string; token: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!reason.trim()) return toast.error("Isi alasan retur");
    setSubmitting(true);
    try {
      await requestReturn(orderId, subOrderId, reason.trim(), token);
      toast.success("Pengajuan retur terkirim");
      setDone(true);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal mengajukan retur");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <span className="text-xs text-muted-foreground">Retur diajukan</span>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Undo2 className="size-3.5" /> Ajukan Retur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajukan Retur</DialogTitle>
          <DialogDescription>Jelaskan alasan pengembalian produk ini.</DialogDescription>
        </DialogHeader>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Mis. barang rusak / tidak sesuai"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <DialogFooter>
          <Button onClick={submit} disabled={submitting} className="rounded-full">
            {submitting ? "Mengirim…" : "Kirim Pengajuan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
