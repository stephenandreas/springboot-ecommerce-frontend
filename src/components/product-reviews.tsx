"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";
import { useAuth } from "@/lib/auth-context";
import { getProductReviews, getProductRating, markReviewHelpful } from "@/lib/reviews";
import { ApiError } from "@/lib/api";
import type { ProductRating, Review } from "@/types";

export function ProductReviews({ productId }: { productId: string }) {
  const { token } = useAuth();
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [helped, setHelped] = useState<Set<string>>(new Set());

  useEffect(() => {
    getProductRating(productId).then(setRating).catch(() => setRating({ avg: 0, count: 0 }));
    getProductReviews(productId).then((p) => setReviews(p.content)).catch(() => setReviews([]));
  }, [productId]);

  async function helpful(id: string) {
    if (!token) return toast.info("Masuk untuk menandai ulasan");
    setHelped((s) => new Set(s).add(id));
    try {
      await markReviewHelpful(id, token);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">{(rating?.avg ?? 0).toFixed(1)}</span>
        <div>
          <StarRating value={rating?.avg ?? 0} showValue={false} size="md" />
          <p className="text-xs text-muted-foreground">{rating?.count ?? 0} ulasan</p>
        </div>
      </div>

      {reviews === null ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada ulasan. Jadilah yang pertama setelah membeli.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {r.buyerName}
                  {r.verifiedPurchase && <BadgeCheck className="size-3.5 text-success" />}
                </span>
                <StarRating value={r.rating} showValue={false} />
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
              {r.sellerReply && (
                <div className="mt-3 rounded-lg bg-background p-3 text-sm">
                  <p className="font-medium">Balasan penjual</p>
                  <p className="text-muted-foreground">{r.sellerReply}</p>
                </div>
              )}
              <Button
                variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs"
                disabled={helped.has(r.id)}
                onClick={() => helpful(r.id)}
              >
                <ThumbsUp className="size-3.5" /> Membantu ({r.helpfulCount + (helped.has(r.id) ? 1 : 0)})
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
