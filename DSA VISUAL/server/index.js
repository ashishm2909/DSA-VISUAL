import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { lessonList, lessonsById, categories, defaultGraph } from "./data/lessons.js";
import { runLesson } from "./algorithms/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Catalog (navigation + lesson metadata).
app.get("/api/lessons", (_req, res) => {
  res.json({ categories, defaultArray: [5, 2, 9, 1, 7, 3, 8, 6, 4], defaultGraph });
});

app.get("/api/lesson/:id", (req, res) => {
  const lesson = lessonsById[req.params.id];
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  res.json(lesson);
});

// Run a lesson's algorithm and return animation steps.
app.post("/api/run", (req, res) => {
  try {
    const { lessonId, input } = req.body || {};
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });
    const meta = lessonsById[lessonId];
    if (meta && meta.kind === "pattern") {
      return res.json({ kind: "pattern", steps: [] });
    }
    const result = runLesson(lessonId, input || {});
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Text-to-speech proxy: streams a natural Google voice (no API key needed).
// Falls back gracefully if the upstream is unreachable; the client then
// uses the browser's built-in speechSynthesis.
app.get("/api/tts", async (req, res) => {
  const text = String(req.query.text || "").slice(0, 400);
  const lang = String(req.query.lang || "en").slice(0, 5);
  if (!text) return res.status(400).json({ error: "text is required" });
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}`;
  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!upstream.ok) return res.status(502).json({ error: "TTS upstream failed" });
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buf);
  } catch {
    res.status(502).json({ error: "TTS unavailable" });
  }
});

// Serve built client in production.
const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res, next) => {
  const idx = path.join(clientDist, "index.html");
  res.sendFile(idx, (err) => { if (err) next(); });
});

app.listen(PORT, () => {
  console.log(`DSA Visual server running on http://localhost:${PORT}`);
});
