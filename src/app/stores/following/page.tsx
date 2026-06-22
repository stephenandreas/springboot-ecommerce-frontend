"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store as StoreIcon, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getFollowedStores } from "@/lib/stores";
import type { Store } from "@/types";

export default function FollowingPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [stores, setStores] = useState<Store[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/stores/following");
      return;
    }
    getFollowedStores(token)
      .then((p) => setStores(p.content))
      .catch(() => setStores([]));
  }, [isReady, token, router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Toko yang Diikuti</h1>
      <div className="mt-6 space-y-3">
        {stores === null ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : stores.length === 0 ? (
          <EmptyState icon={StoreIcon} title="Belum mengikuti toko" description="Toko yang Anda ikuti akan muncul di sini." />
        ) : (
          stores.map((s) => (
            <Link
              key={s.id}
              href={`/stores/${s.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-background">
                {s.logoUrl ? (
                  <Image src={s.logoUrl} alt={s.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="brand-gradient grid h-full place-items-center text-background">
                    <StoreIcon className="size-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3" /> {s.followerCount} pengikut
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
