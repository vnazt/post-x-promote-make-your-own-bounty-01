// Entry envelope for post-x-promote-make-your-own-bounty-01 (Node 22, standard
// library only). The entry itself is our post on X — a quote of make.fun's
// make-your-own-bounty announcement with our own photo attached — and POST.json
// names that post. This program's whole job is to hand POST.json to the grader:
// copy it from the repository root into the output directory, byte for byte,
// and fail loudly if it is not there. Nothing else is scored.
//
// Local dry run:  MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const src = join(process.env.MAKEFUN_BOT_DIR ?? '/bot', 'POST.json');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(src)) {
  console.error(`POST.json not found at ${src}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'POST.json'));
