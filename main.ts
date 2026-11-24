// Entry envelope for post-x-promote-make-your-own-bounty-01 (Node 22, standard
// library only). The entry itself is our post on X — a quote of make.fun's
// make-your-own-bounty announcement with our own photo attached — and POST.json
// names that post. This program's whole job is to hand POST.json to the grader:
// copy it from the repository root into the output directory, byte for byte,
// and fail loudly if it is not there. Nothing else is scored.
//
// Local dry run:  MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = join(process.env.MAKEFUN_BOT_DIR ?? '/bot', 'POST.json');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(src)) {
  console.error(`POST.json not found at ${src}`);
  process.exit(1);
}
try {
  const parsed = JSON.parse(readFileSync(src, 'utf8'));
  const url = parsed?.url;
  if (typeof url !== 'string' || !(url.startsWith('https://x.com/') || url.startsWith('https://twitter.com/'))) {
    console.error(`POST.json at ${src} must contain a string "url" field starting with "https://x.com/" or "https://twitter.com/"`);
    process.exit(1);
  }
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error(`POST.json at ${src} is not valid JSON: ${err.message}`);
    process.exit(1);
  }
  throw err;
}
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'POST.json');
copyFileSync(src, dest);
if (statSync(dest).size !== statSync(src).size) {
  console.error(`Copy verification failed: ${dest} (${statSync(dest).size} bytes) differs in size from ${src} (${statSync(src).size} bytes)`);
  process.exit(1);
}
