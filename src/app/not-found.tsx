import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <Compass className="size-10 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">404</h1>
      <p className="mt-1 text-sm text-muted-foreground">Halaman yang Anda cari tidak ditemukan.</p>
      <Button className="mt-6" render={<Link href="/" />}>
        Kembali ke Beranda
      </Button>
    </div>
  );
}
