"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <TriangleAlert className="size-10 text-destructive" />
      <h1 className="mt-4 text-lg font-semibold">Terjadi kesalahan</h1>
      <p className="mt-1 text-sm text-muted-foreground">Maaf, sesuatu tidak berjalan semestinya.</p>
      <Button className="mt-6" onClick={reset}>
        Coba lagi
      </Button>
    </div>
  );
}
