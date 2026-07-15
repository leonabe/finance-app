"use client";

/**
 * Client-safe re-export proving Recharts is installed and importable.
 * Recharts needs React client APIs (createContext); do not import from RSC.
 */

import { ResponsiveContainer } from "recharts";

export { ResponsiveContainer };

export const RECHARTS_READY = true as const;
