/**
 * juahcheon.github.io/img 전체를 web/public/img 로 재귀 복사합니다.
 * (webp, touslesjours_img, tt_img, *.jfif, *.png 등 포함)
 *
 * LEGACY_ROOT 환경변수로 저장소 루트를 바꿀 수 있습니다 (기본: D:\factory\juahcheon.github.io).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const publicImg = path.join(webRoot, "public", "img");

const LEGACY =
  process.env.LEGACY_ROOT?.replace(/[/\\]+$/, "") ||
  "D:\\factory\\juahcheon.github.io";

const legacyImg = path.join(LEGACY, "img");

console.log("[sync-legacy] LEGACY =", LEGACY);
console.log("[sync-legacy] from   =", legacyImg);
console.log("[sync-legacy] to     =", publicImg);

if (!fs.existsSync(legacyImg)) {
  console.error("[sync-legacy] FATAL: 폴더가 없습니다:", legacyImg);
  process.exit(1);
}

fs.mkdirSync(publicImg, { recursive: true });
fs.cpSync(legacyImg, publicImg, { recursive: true });
console.log("[sync-legacy] ok: img 전체 복사 완료");

const rootExtras = ["ms-icon-144x144.png", "browserconfig.xml"];
for (const name of rootExtras) {
  const from = path.join(LEGACY, name);
  if (fs.existsSync(from)) {
    const to = path.join(webRoot, "public", name);
    fs.copyFileSync(from, to);
    console.log("[sync-legacy] ok:", name);
  }
}
