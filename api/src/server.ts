import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: true }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/v1/portfolio", async (_req, res) => {
  try {
    const path = join(__dirname, "..", "data", "portfolio.json");
    const raw = await readFile(path, "utf-8");
    res.type("application/json").send(raw);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load portfolio data" });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio API http://localhost:${PORT}`);
});
