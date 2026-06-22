"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getStoreBySlug, toggleFollowStore } from "@/lib/stores";
import { ApiError } from "@/lib/api";

export function FollowButton({
  storeId,
  slug,
  initialCount,
}: {
  storeId: string;
  slug: string;
  initialCount: number;
}) {
  const { token } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  // The server render is anonymous (isFollowing unknown), so sync the real state once we have a token.
  useEffect(() => {
    if (!token) return;
    getStoreBySlug(slug, token).then((s) => {
      if (s) {
        setFollowing(Boolean(s.isFollowing));
        setCount(s.followerCount);
      }
    });
  }, [token, slug]);

  async function onClick() {
    if (!token) {
      router.push("/login?next=" + encodeURIComponent(location.pathname));
      return;
    }
    setBusy(true);
    const prev = following;
    setFollowing(!prev);
    setCount((c) => c + (prev ? -1 : 1));
    try {
      const res = await toggleFollowStore(storeId, token);
      setFollowing(res.following);
      setCount(res.followerCount);
    } catch (err) {
      setFollowing(prev);
      setCount((c) => c + (prev ? 1 : -1));
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={busy}
      variant={following ? "secondary" : "default"}
      className="rounded-full"
    >
      {following ? <Check className="size-4" /> : <Heart className="size-4" />}
      {following ? "Diikuti" : "Ikuti"}
      <span className="opacity-70">· {count}</span>
    </Button>
  );
}
