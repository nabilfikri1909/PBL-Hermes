"use client";

import type { ReactNode } from "react";

/** Re-mounts on every navigation, so each route fades + rises in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}