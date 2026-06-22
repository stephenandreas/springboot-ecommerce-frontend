"use client";

import { useEffect, useState } from "react";

/**
 * Renders an HH:MM:SS countdown. Pass `target` (ISO timestamp) to count down to a real
 * deadline (e.g. a flash sale's discountEndsAt); otherwise it loops a rolling `windowHours`.
 */
export function CountdownTimer({ windowHours = 4, target }: { windowHours?: number; target?: string | null }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const span = windowHours * 3600_000;
    const targetMs = target ? new Date(target).getTime() : null;
    const tick = () => {
      const now = Date.now();
      const end = targetMs ?? Math.ceil(now / span) * span; // fixed deadline or next rolling window
      setRemaining(Math.max(0, end - now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [windowHours, target]);

  const total = Math.max(0, Math.floor((remaining ?? 0) / 1000));
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-1" role="timer" aria-label={`Berakhir dalam ${hh} jam ${mm} menit`}>
      {[hh, mm, ss].map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-sm font-bold text-foreground">:</span>}
          <span className="grid min-w-7 place-items-center rounded bg-foreground px-1 py-0.5 font-mono text-sm font-bold text-background tabular-nums">
            {remaining === null ? "--" : part}
          </span>
        </span>
      ))}
    </div>
  );
}
