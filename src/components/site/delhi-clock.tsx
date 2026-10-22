"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Delhi time, updated once a minute. Renders a placeholder on the server so hydration never mismatches. */
export function DelhiClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <p className="type-meta text-graphite">
      Delhi{" "}
      <time dateTime={now ? now.toISOString() : undefined} className="tabular-nums text-ink">
        {now ? formatter.format(now) : "--:--"}
      </time>{" "}
      IST
    </p>
  );
}
