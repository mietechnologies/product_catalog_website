// Builds .design-sync/pkg/dist from the app's src/: ESM bundle (react external, next/* shimmed),
// rewritten .d.ts tree, and the compiled Tailwind stylesheet. Run from the repo root.
import { build } from "../../.ds-sync/node_modules/esbuild/lib/main.js";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, rmSync, statSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";

const root = resolve(".");
const pkg = resolve(".design-sync/pkg");
const dist = join(pkg, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

await build({
  entryPoints: [join(pkg, "entry.ts")],
  outfile: join(dist, "index.es.js"),
  bundle: true, format: "esm", platform: "browser", jsx: "automatic", target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  alias: {
    "@": join(root, "src"),
    "next/link": join(pkg, "shims/next-link.tsx"),
    "next/image": join(pkg, "shims/next-image.tsx"),
  },
  nodePaths: [join(root, "node_modules")],
  logLevel: "warning",
});

// Declarations, then rewrite "@/..." and next/* specifiers to relative paths so ts-morph can resolve them.
execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", join(pkg, "tsconfig.dts.json")], { stdio: "inherit" });
const types = join(dist, "types");
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of walk(types).filter((p) => p.endsWith(".d.ts"))) {
  let t = readFileSync(f, "utf8");
  const rel = (target) => { let r = relative(dirname(f), join(types, target)); if (!r.startsWith(".")) r = "./" + r; return r; };
  t = t.replace(/(from\s+|import\()["']@\/([^"']+)["']/g, (_, a, p) => `${a}"${rel("src/" + p)}"`);
  t = t.replace(/(from\s+)["']next\/link["']/g, (_, a) => `${a}"${rel(".design-sync/pkg/shims/next-link")}"`);
  t = t.replace(/(from\s+)["']next\/image["']/g, (_, a) => `${a}"${rel(".design-sync/pkg/shims/next-image")}"`);
  writeFileSync(f, t);
}
// Entry's types live at dist/types/.design-sync/pkg/entry.d.ts; surface them as dist/types/index.d.ts.
const entryDts = readFileSync(join(types, ".design-sync/pkg/entry.d.ts"), "utf8")
  .replace(/from "\.\.\/\.\.\/src\//g, 'from "./src/');
writeFileSync(join(types, "index.d.ts"), entryDts);

// Tailwind v4 compile of the app stylesheet (theme tokens + every utility the components use).
const req = createRequire(join(root, "package.json"));
const postcss = req("postcss");
const tailwind = req("@tailwindcss/postcss");
const cssSrc = join(pkg, "ds.css");
const out = await postcss([tailwind({ base: root })]).process(readFileSync(cssSrc, "utf8"), { from: cssSrc });
writeFileSync(join(dist, "styles.css"), out.css);
console.log("built", dist);
