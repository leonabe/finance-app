"use client";

import { RECHARTS_READY } from "@/lib/charts/recharts-ready";

/** Invisible marker that loads Recharts on the client only. */
export function RechartsReadyMarker() {
  return <span data-recharts-ready={RECHARTS_READY ? "true" : "false"} hidden />;
}
