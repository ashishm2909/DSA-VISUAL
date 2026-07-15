// Lightweight client-side translation for voice + on-screen explanations.
// Uses the free MyMemory endpoint with localStorage caching and an English fallback.

const PREFIX = "dsa_tr_";

export async function translate(text, target) {
  if (!target || target === "en") return text;
  const key = target + " " + text;
  try {
    const cached = localStorage.getItem(PREFIX + key);
    if (cached) return cached;
  } catch { /* ignore */ }
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    const out = data?.responseData?.translatedText;
    if (out && typeof out === "string" && !out.startsWith("MYMEMORY")) {
      try { localStorage.setItem(PREFIX + key, out); } catch { /* ignore */ }
      return out;
    }
  } catch { /* ignore */ }
  return text;
}
