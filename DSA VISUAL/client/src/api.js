const base = "/api";

export async function fetchLessons() {
  const res = await fetch(`${base}/lessons`);
  if (!res.ok) throw new Error("Failed to load lessons");
  return res.json();
}

export async function fetchLesson(id) {
  const res = await fetch(`${base}/lesson/${id}`);
  if (!res.ok) throw new Error("Lesson not found");
  return res.json();
}

export async function runLesson(lessonId, input) {
  const res = await fetch(`${base}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId, input }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Run failed");
  }
  return res.json();
}
