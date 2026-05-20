/**
 * api/data/portfolio.json → web/data/portfolio.json (로컬 개발용).
 * Vercel 배포에는 web/data 만 포함되므로, 배포 전 web/data 를 커밋하거나 이 스크립트를 실행하세요.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "..", "..", "api", "data", "portfolio.json");
const dest = path.join(__dirname, "..", "data", "portfolio.json");

if (!fs.existsSync(src)) {
  console.warn("[sync:content] source not found:", src);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log("[sync:content] copied → web/data/portfolio.json");
