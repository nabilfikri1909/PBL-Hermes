import type { FinalReport } from "./types";

/** A fresh report object — never share the same nested arrays between records. */
export function EMPTY_REPORT_FACTORY(): FinalReport {
  return { fileName: null, summary: "", submittedAt: null, expenses: [], validatedAt: null };
}