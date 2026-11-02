/**
 * Production server launcher.
 *
 * `next start -p <port>` hard-codes a port, which mismatched the Dockerfile
 * (ENV PORT=3000 + EXPOSE 3000 while the app listened on 3210). This wrapper
 * makes PORT the single source of truth and falls back to 3210 for local runs.
 *
 *   PORT=3000 npm start   → listens on 3000 (container default)
 *   npm start             → listens on 3210 (local default, matches `npm run dev`)
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const port = process.env.PORT || "3210";

const child = spawn(process.execPath, [nextBin, "start", "-p", port], { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
