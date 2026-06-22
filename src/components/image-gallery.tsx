"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {list.length ? (
          <Image
            src={list[active]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-10" />
            <span className="text-sm">Tanpa gambar</span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Gambar ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border",
              )}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
