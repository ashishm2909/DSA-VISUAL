import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchLesson, runLesson } from "../api.js";
import { renderState } from "../renderers.jsx";
import { translate } from "../translate.js";
import PseudoCode from "./PseudoCode.jsx";
import StepInfo from "./StepInfo.jsx";
import PlaybackControls from "./PlaybackControls.jsx";
import Legend from "./Legend.jsx";

const ARRAY_KINDS = ["array", "stack", "queue", "linkedlist", "sorting", "searching"];
const DEFAULT_GRAPH_TEXT = "0-1, 0-2, 1-3, 2-3, 3-4, 4-5";
const LANG_TAGS = { en: "en-US", hi: "hi-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN", mr: "mr-IN", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN" };

const labelFor = (id) => String.fromCharCode(65 + (id % 26)) + (id >= 26 ? Math.floor(id / 26) : "");

function parseGraph(text) {
  const ids = new Set();
  const edges = [];
  for (const raw of text.split(",").map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = raw.split(/[-,]/).map((s) => s.trim());
    const ai = Number(a), bi = Number(b);
    if (Number.isNaN(ai) || Number.isNaN(bi)) continue;
    ids.add(ai); ids.add(bi);
    edges.push([ai, bi]);
  }
  const idList = [...ids].sort((x, y) => x - y);
  const nodes = idList.map((id) => ({ id, label: labelFor(id) }));
  return { nodes, edges, idList };
}

export default function LessonView({ lessonId, defaultGraph }) {
  const [lesson, setLesson] = useState(null);
  const [dataInput, setDataInput] = useState("5, 2, 9, 1, 7, 3, 8, 6, 4");
  const [fields, setFields] = useState({});
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1600);
  const [error, setError] = useState(null);
  const [voice, setVoice] = useState(false);
  const [lang, setLang] = useState("en");
  const [displayDesc, setDisplayDesc] = useState("");
  const [graphText, setGraphText] = useState(DEFAULT_GRAPH_TEXT);
  const [startNode, setStartNode] = useState(0);
  const timer = useRef(null);
  const audioRef = useRef(null);
  const fieldsRef = useRef({});

  const parsedGraph = useMemo(() => parseGraph(graphText), [graphText]);
  useEffect(() => {
    if (!parsedGraph.idList.includes(startNode)) setStartNode(parsedGraph.idList[0] ?? 0);
  }, [parsedGraph, startNode]);

  useEffect(() => {
    setLesson(null); setError(null);
    fetchLesson(lessonId).then(setLesson).catch((e) => setError(e.message));
  }, [lessonId]);

  useEffect(() => {
    setResult(null); setStep(0); setPlaying(false); setFields({});
  }, [lessonId]);

  const parseData = () =>
    dataInput.split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number).filter((n) => !Number.isNaN(n));

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const randomizeFields = (ops, arrLen = 9) => {
    const nf = {};
    for (const op of ops) {
      nf[op.id] = {};
      for (const f of op.fields) {
        if (f.type !== "number") { nf[op.id][f.name] = f.default ?? ""; continue; }
        const n = f.name;
        if (n === "index" || n === "position") nf[op.id][n] = randInt(0, Math.max(0, arrLen - 1));
        else if (n === "target") nf[op.id][n] = randInt(1, 9);
        else if (n === "n") nf[op.id][n] = randInt(5, 18);
        else if (n === "capacity") nf[op.id][n] = randInt(4, 12);
        else nf[op.id][n] = randInt(1, 99);
      }
    }
    return nf;
  };

  const randomize = useCallback(() => {
    if (!lesson) return;
    if (ARRAY_KINDS.includes(lesson.kind)) {
      const len = randInt(6, 9);
      const arr = Array.from({ length: len }, () => randInt(1, 9));
      setDataInput(arr.join(", "));
      const nf = randomizeFields(lesson.operations, len);
      fieldsRef.current = nf; setFields(nf);
    } else if (lesson.kind === "graph") {
      const nodeCount = randInt(5, 6);
      const edges = [];
      for (let i = 1; i < nodeCount; i++) edges.push(`${i - 1}-${i}`);
      const extra = randInt(1, 3);
      for (let k = 0; k < extra; k++) {
        const a = randInt(0, nodeCount - 1), b = randInt(0, nodeCount - 1);
        if (a !== b) edges.push(`${a}-${b}`);
      }
      setGraphText(edges.join(", "));
      setStartNode(randInt(0, nodeCount - 1));
      const nf = randomizeFields(lesson.operations);
      fieldsRef.current = nf; setFields(nf);
    } else {
      const nf = randomizeFields(lesson.operations);
      fieldsRef.current = nf; setFields(nf);
    }
  }, [lesson]);

  const run = useCallback(async (op) => {
    if (!lesson) return;
    setError(null);
    const input = {};
    if (ARRAY_KINDS.includes(lesson.kind)) input.array = parseData();
    if (lesson.kind === "graph") {
      input.graph = { nodes: parsedGraph.nodes, edges: parsedGraph.edges };
      input.start = startNode;
    }
    const fv = fieldsRef.current[op.id] || {};
    for (const f of op.fields) input[f.name] = f.type === "number" ? Number(fv[f.name]) : fv[f.name];
    try {
      const res = await runLesson(lessonId, input);
      setResult(res);
      setStep(0);
      setPlaying(true);
      if (ARRAY_KINDS.includes(lesson.kind) && res.steps.length) {
        const last = res.steps[res.steps.length - 1].state.items;
        setDataInput(last.map((it) => it.value).join(", "));
      }
    } catch (e) {
      setError(e.message);
    }
  }, [lesson, lessonId, fields, dataInput, parsedGraph, startNode]);

  // Auto-run the first operation once a lesson loads so the visualization
  // is visible immediately (no blank "Run an operation" placeholder).
  const runRef = useRef(run);
  useEffect(() => { runRef.current = run; }, [run]);
  useEffect(() => {
    if (lesson && lesson.operations?.length) {
      randomize();
      const op = lesson.operations[0];
      const t = setTimeout(() => runRef.current(op), 80);
      return () => clearTimeout(t);
    }
  }, [lesson]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing || !result) return;
    if (step >= result.steps.length - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setStep((s) => s + 1), speed);
    return () => clearTimeout(timer.current);
  }, [playing, step, result, speed]);

  // Preload browser voices (used only as a fallback if the TTS service is down).
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", onVoices);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", onVoices);
  }, []);

  const baseLang = (lang || "en").split("-")[0];

  const stopAudio = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch { /* ignore */ }
      audioRef.current = null;
    }
  };

  // Fallback narration via the browser's built-in engine (resumes a paused
  // engine and prefers a voice matching the chosen language).
  const speakBrowser = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume?.();
    const u = new SpeechSynthesisUtterance(text);
    const wanted = LANG_TAGS[lang] || "en-US";
    const voices = synth.getVoices() || [];
    const match =
      voices.find((v) => v.lang === wanted) ||
      voices.find((v) => v.lang && v.lang.split("-")[0] === wanted.split("-")[0]);
    if (match) u.voice = match;
    u.lang = wanted;
    u.rate = 0.85; u.pitch = 1;
    synth.speak(u);
  };

  // Primary narration: stream a natural voice from the server TTS endpoint and
  // play it through an <audio> element at a slow, clear pace. Falls back to the
  // browser engine if the request fails.
  const playTTS = useCallback(async (text) => {
    if (!text) return;
    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(baseLang)}`);
      if (!res.ok) throw new Error("tts");
      const blob = await res.blob();
      if (!blob.type.startsWith("audio")) throw new Error("not audio");
      const url = URL.createObjectURL(blob);
      stopAudio();
      const a = new Audio(url);
      a.playbackRate = 0.85;
      a.onended = () => { URL.revokeObjectURL(url); if (audioRef.current === a) audioRef.current = null; };
      audioRef.current = a;
      await a.play().catch(() => speakBrowser(text));
    } catch {
      speakBrowser(text);
    }
  }, [baseLang]);

  // Translate the step text, show it, and narrate it aloud in the chosen language.
  const desc = result?.steps[step]?.description;
  useEffect(() => {
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    if (!desc) {
      setDisplayDesc("");
      stopAudio(); synth?.cancel();
      return;
    }
    if (!voice) { stopAudio(); synth?.cancel(); }
    let cancelled = false;
    const say = (text) => { if (voice) playTTS(text); };
    if (lang === "en") {
      setDisplayDesc(desc);
      say(desc);
    } else {
      translate(desc, lang).then((t) => {
        if (cancelled) return;
        setDisplayDesc(t);
        say(t);
      });
    }
    return () => { cancelled = true; };
  }, [desc, lang, voice, playTTS]);

  // Stop any speech when leaving the lesson.
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  if (!lesson) return <div className="loading">{error ? `Error: ${error}` : "Loading…"}</div>;

  const total = result ? result.steps.length : 0;
  const current = result ? result.steps[step] : null;
  const canBack = step > 0;
  const canForward = result && step < total - 1;
  const setField = (opId, name, value) => setFields((f) => ({ ...f, [opId]: { ...(f[opId] || {}), [name]: value } }));

  return (
    <div className="lesson">
      <div className="lesson-grid">
        <div className="lesson-main">
          <nav className="crumbs">
            <Link to="/">Home</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{lesson.categoryTitle}</span>
          </nav>

          <header className="lesson-head">
            <div>
              <div className="eyebrow">{lesson.categoryTitle}</div>
              <h1>{lesson.title}</h1>
            </div>
            <div className="badges">
              <span className="badge"><b>Time</b>{lesson.complexity.time}</span>
              <span className="badge"><b>Space</b>{lesson.complexity.space}</span>
            </div>
          </header>
          <p className="desc">{lesson.description}</p>

          {lesson.theory && (
            <section className="theory">
              <div className="panel-title">Concept</div>
              <p className="theory-body">{lesson.theory}</p>
              {lesson.example && (
                <div className="theory-example">
                  <div className="panel-title">Worked example</div>
                  <pre>{lesson.example}</pre>
                </div>
              )}
            </section>
          )}

          {lesson.kind === "pattern" && lesson.questions?.length > 0 && (
            <section className="questions">
              <div className="panel-title">★ Most-asked interview questions</div>
              <div className="q-summary">
                <span className="q-summary-count">{lesson.questions.length} curated problems</span>
                {["Easy", "Medium", "Hard"].map((lv) => {
                  const n = lesson.questions.filter((q) => (q.level || "Medium") === lv).length;
                  if (!n) return null;
                  return <span className={"q-pill lv-" + lv} key={lv}>{n} {lv}</span>;
                })}
              </div>
              <ul className="q-list">
                {lesson.questions.map((item, i) => (
                  <li className={"q-card lv-" + (item.level || "Medium")} key={i}>
                    <div className="q-main">
                      <span className="q-idx">{String(i + 1).padStart(2, "0")}</span>
                      <span className="q-title">{item.q}</span>
                      <span className={"q-level lv-" + (item.level || "Medium")}>{item.level}</span>
                    </div>
                    <div className="q-meta">
                      {item.companies?.map((c) => <span className="q-company" key={c}>{c}</span>)}
                      {item.tags?.map((t) => <span className="q-tag" key={t}>{t}</span>)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.kind !== "pattern" && (<>
          <section className="controls-panel">
            {ARRAY_KINDS.includes(lesson.kind) && (
              <div className="control-group">
                <span className="group-label">Input</span>
                <div className="data-edit">
                  <label>Data <span className="hint">comma separated</span></label>
                  <input value={dataInput} onChange={(e) => setDataInput(e.target.value)} />
                </div>
              </div>
            )}
            {lesson.kind === "graph" && (
              <div className="control-group">
                <span className="group-label">Graph</span>
                <div className="graph-edit">
                  <label>Edges <span className="hint">u-v, comma separated</span></label>
                  <div className="graph-edit-row">
                    <input value={graphText} onChange={(e) => setGraphText(e.target.value)} />
                    <select value={startNode} onChange={(e) => setStartNode(Number(e.target.value))}>
                      {parsedGraph.idList.map((id) => (
                        <option key={id} value={id}>start: {labelFor(id)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="control-group">
              <span className="group-label">Operations</span>
              <div className="ops">
                {lesson.operations.map((op) => (
                  <div className="op" key={op.id}>
                    {op.fields.map((f) => (
                      <input
                        key={f.name}
                        className="op-field"
                        type={f.type === "number" ? "number" : "text"}
                        placeholder={f.label}
                        value={fields[op.id]?.[f.name] ?? f.default}
                        onChange={(e) => setField(op.id, f.name, e.target.value)}
                      />
                    ))}
                    <button className="run-btn" onClick={() => run(op)}>{op.label}</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="control-group">
              <span className="group-label">Actions</span>
              <button className="random-btn" onClick={randomize} title="Fill inputs with random values">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Random
              </button>
            </div>
            {error && <div className="banner error">{error}</div>}
          </section>

          <section className="stage">
            <div className="viz">
              <div className="viz-inner">{renderState(current?.state, lesson.kind)}</div>
            </div>
          </section>

          <StepInfo step={step} total={total} description={displayDesc || current?.description} />

          <PlaybackControls
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onStepBack={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}
            onStepForward={() => { setPlaying(false); setStep((s) => Math.min(total - 1, s + 1)); }}
            onReset={() => { setPlaying(false); setStep(0); }}
            speed={speed}
            onSpeed={setSpeed}
            disabled={!result}
            canBack={canBack}
            canForward={canForward}
            voice={voice}
            onToggleVoice={() => setVoice((v) => !v)}
            lang={lang}
            onLang={setLang}
          />
          </>)}
        </div>

        {lesson.kind !== "pattern" && (
          <aside className="lesson-side">
            <PseudoCode lines={lesson.pseudocode} active={current?.codeLine} />
            <div className="legend-title">Legend</div>
            <Legend kind={lesson.kind} />
          </aside>
        )}
      </div>
    </div>
  );
}
