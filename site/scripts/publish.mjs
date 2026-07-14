// Copies the static export (out/) into ../docs, which GitHub Pages serves.
// Usage: pnpm run publish:site   (then git add/commit/push)
import { rmSync, cpSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "out");
const docs = join(here, "..", "..", "docs");

if (!existsSync(out)) {
  console.error("out/ not found — run `pnpm build` first.");
  process.exit(1);
}
rmSync(docs, { recursive: true, force: true });
cpSync(out, docs, { recursive: true });
writeFileSync(join(docs, ".nojekyll"), "");
console.log("Published out/ → docs/. Commit and push to deploy.");
