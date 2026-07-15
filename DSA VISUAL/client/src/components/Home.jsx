import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { runLesson } from "../api.js";
import { renderState } from "../renderers.jsx";
import PatternTreeMap from "./PatternTreeMap.jsx";

function Preview({ lessonId, input, kind, speed = 850 }) {
  const [steps, setSteps] = useState(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    let alive = true;
    runLesson(lessonId, input)
      .then((r) => { if (alive) { setSteps(r.steps); setI(0); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [lessonId, JSON.stringify(input)]);

  useEffect(() => {
    if (!steps) return;
    if (i >= steps.length - 1) {
      const t = setTimeout(() => setI(0), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((p) => p + 1), speed);
    return () => clearTimeout(t);
  }, [steps, i, speed]);

  if (!steps) return <div className="preview-loading"><span /></div>;
  return (
    <div className={"preview-stage" + (kind === "graph" ? " is-graph" : "")}>
      {renderState(steps[i].state, kind)}
    </div>
  );
}

const KIND_LABEL = {
  array: "Array", stack: "Stack", queue: "Queue", linkedlist: "Linked List",
  sorting: "Sorting", searching: "Searching", graph: "Graph", dp: "DP",
};

export default function Home({ catalog }) {
  const categories = catalog?.categories || [];
  const visualizers = categories.filter((c) => c.id !== "patterns");
  const patternsCat = categories.find((c) => c.id === "patterns");
  const patterns = patternsCat?.lessons || [];
  const lessonCount = categories.reduce((n, c) => n + c.lessons.length, 0);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, catalog]);

  return (
    <div className="home">
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Interactive DSA learning</div>
          <h1>Watch algorithms <span className="accent">think</span> in real time.</h1>
          <p className="lead">
            DSA Visual turns abstract algorithms into living, step-by-step animations.
            Pick a concept, run it on your data, and watch every move.
          </p>
          <div className="hero-cta">
            <a className="btn-primary" href="#visualizers">Explore visualizers</a>
            <Link className="btn-ghost" to="/roadmap">View roadmap →</Link>
          </div>
          <div className="hero-stats">
            <div><strong>{lessonCount}</strong><span>Lessons</span></div>
            <div><strong>{patterns.length}</strong><span>Patterns</span></div>
            <div><strong>9</strong><span>Topics</span></div>
          </div>
        </div>

        <div className="hero-demo">
          <div className="demo-frame">
            <div className="demo-bar">
              <span className="dot" /><span className="dot" /><span className="dot" />
              <span className="demo-title">live · bubble sort</span>
              <span className="demo-status">running</span>
            </div>
            <div className="demo-body">
              <Preview lessonId="sort-bubble" input={{ array: [8, 3, 5, 1, 9, 2, 7, 4] }} kind="sorting" speed={780} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Interactive Pattern Tree Map ---------------- */}
      <section className="section">
        <PatternTreeMap />
      </section>

      {/* ---------------- Interactive lesson map (teaser → /map) ---------------- */}
      <section className="section map">
        <Link to="/map" className="map-teaser">
          <div className="map-teaser-copy">
            <div className="eyebrow">DSA Roadmap</div>
            <h2 className="map-teaser-title">Learn DSA like a language — as one tree</h2>
            <p className="map-teaser-desc">
              From Foundations to Expert, every concept and pattern links to a real lesson.
              Filter by tier, focus on the must-know 80/20, and open any node to start.
            </p>
            <span className="map-teaser-go">Open the learning path →</span>
          </div>
          <div className="map-teaser-art" aria-hidden="true">
            <span className="mt-node root">Basics</span>
            <span className="mt-line" />
            <span className="mt-node">Foundations</span>
            <span className="mt-line" />
            <span className="mt-node">Core</span>
            <span className="mt-line" />
            <span className="mt-node">Advanced</span>
          </div>
        </Link>
      </section>

      {/* ---------------- Visualizer grid ---------------- */}
      <section className="section" id="visualizers">
        <div className="section-head">
          <span className="sec-idx">B</span>
          <h2 className="section-title">All Visualizers</h2>
          <span className="sec-rule" />
          <span className="section-sub">Browse the full library</span>
        </div>

        <div className="viz-cats">
          {visualizers.map((cat, ci) => (
            <div className="viz-cat" key={cat.id}>
              <div className="viz-cat-head">
                <span className="viz-cat-idx">{String(ci + 1).padStart(2, "0")}</span>
                <h3 className="viz-cat-title">{cat.title}</h3>
                <span className="viz-cat-count">{cat.lessons.length}</span>
              </div>
              <div className="viz-grid">
                {cat.lessons.map((l) => (
                  <Link key={l.id} to={`/lesson/${l.id}`} className="viz-card">
                    <div className="viz-card-top">
                      <span className="viz-card-kind">{KIND_LABEL[l.kind] || l.kind}</span>
                      {l.complexity && <span className="viz-card-chev">→</span>}
                    </div>
                    <h4 className="viz-card-title">{l.title}</h4>
                    <p className="viz-card-desc">{l.description}</p>
                    {l.complexity && (
                      <div className="viz-card-badges">
                        <span className="pattern-badge"><b>T</b> {l.complexity.time}</span>
                        <span className="pattern-badge"><b>S</b> {l.complexity.space}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {patterns.length > 0 && (
          <div className="viz-cat">
            <div className="viz-cat-head">
              <span className="viz-cat-idx accent">P</span>
              <h3 className="viz-cat-title">Interview Patterns</h3>
              <span className="viz-cat-count">{patterns.length}</span>
            </div>
            <div className="viz-grid">
              {patterns.map((l) => (
                <Link key={l.id} to={`/lesson/${l.id}`} className={"viz-card is-pattern lv-" + (l.level || "Medium")}>
                  <div className="viz-card-top">
                    <span className="viz-card-kind pattern">Pattern</span>
                    <span className={"q-level lv-" + (l.level || "Medium")}>{l.level || "Medium"}</span>
                  </div>
                  <h4 className="viz-card-title">{l.title}</h4>
                  <p className="viz-card-desc">{l.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="section">
        <div className="section-head">
          <span className="sec-idx">C</span>
          <h2 className="section-title">How it works</h2>
          <span className="sec-rule" />
          <span className="section-sub">Three steps to confidence</span>
        </div>
        <div className="steps">
          <div className="step">
            <span className="step-num">/ 01</span>
            <h3>Pick a concept</h3>
            <p>Choose any topic — arrays, stacks, sorting, graphs, DP — or jump straight to an interview pattern.</p>
          </div>
          <div className="step">
            <span className="step-num">/ 02</span>
            <h3>Run &amp; edit</h3>
            <p>Type your own data or hit Random, then run an operation. The algorithm executes on your exact values.</p>
          </div>
          <div className="step">
            <span className="step-num">/ 03</span>
            <h3>Watch &amp; learn</h3>
            <p>Play, pause, or step through. Each step explains what happened and highlights the matching pseudocode line.</p>
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="section">
        <div className="cta-card">
          <div className="cta-glow" aria-hidden="true" />
          <div className="eyebrow">Start now</div>
          <h2 className="cta-title">Ready to watch algorithms <span className="accent">think</span>?</h2>
          <p className="cta-sub">Pick any concept, hit run, and see every comparison, swap, and pointer move — explained step by step.</p>
          <div className="hero-cta">
            <a className="btn-primary" href="#visualizers">Explore visualizers</a>
            <Link className="btn-ghost" to="/lesson/array-reverse">Open first lesson →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
