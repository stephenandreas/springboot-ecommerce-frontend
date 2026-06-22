"use client";

import { useEffect, useState } from "react";

/** Counts down to `target` (epoch ms). Renders HH:MM:SS chips. Loops to a fresh window when elapsed. */
export function CountdownTimer({ windowHours = 4 }: { windowHours?: number }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const span = windowHours * 3600_000;
    const tick = () => {
      const now = Date.now();
      const end = Math.ceil(now / span) * span; // next window boundary
      setRemaining(end - now);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [windowHours]);

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
