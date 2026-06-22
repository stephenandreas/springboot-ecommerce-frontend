"use client";

import { useState } from "react";
import { Star, PencilLine } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { createReview } from "@/lib/reviews";
import { ApiError } from "@/lib/api";

export function WriteReviewDialog({
  productId,
  productName,
  orderId,
  token,
}: {
  productId: string;
  productName: string;
  orderId: string;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await createReview({ productId, orderId, rating, comment: comment.trim() || undefined }, token);
      toast.success("Ulasan terkirim");
      setDone(true);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal mengirim ulasan");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <span className="text-xs text-success">Sudah diulas</span>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="h-7 rounded-full bg-background px-3 text-xs">
          <PencilLine className="size-3.5" /> Ulas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tulis Ulasan</DialogTitle>
          <DialogDescription className="line-clamp-1">{productName}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-1 py-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} aria-label={`${n} bintang`}>
              <Star className={cn("size-8 transition-colors", n <= (hover || rating) ? "fill-rating text-rating" : "text-muted-foreground/30")} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Bagikan pengalaman Anda (opsional)"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <DialogFooter>
          <Button onClick={submit} disabled={submitting} className="rounded-full">
            {submitting ? "Mengirim…" : "Kirim Ulasan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
