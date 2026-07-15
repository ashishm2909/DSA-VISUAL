import { Link } from "react-router-dom";
import { useMemo } from "react";

// A small roadmap step in the "basic → advanced" tree.
const TREE_STEPS = [
  { n: "1", title: "Basics", hint: "Arrays · Strings · Sorting · Searching" },
  { n: "2", title: "Foundations", hint: "First pointer & window tricks" },
  { n: "3", title: "Core", hint: "Trees · Graphs · Backtracking" },
  { n: "4", title: "Advanced", hint: "Heaps · DP · Union Find" },
];

function DifficultyBadge({ level }) {
  return <span className={"diff-badge lv-" + (level || "Medium")}>{level}</span>;
}

function PatternCard({ p, showStage }) {
  return (
    <Link to={`/lesson/${p.id}`} className="pattern-card is-pattern">
      <div className="pattern-head">
        <span className="pattern-name">{p.title}</span>
        <DifficultyBadge level={p.level} />
      </div>
      <p className="pattern-desc">{p.description}</p>
      <div className="pattern-meta">
        <span className="pattern-badge pattern-q"><b>★</b> {p.questions?.length || 0} Qs</span>
        {showStage && <span className="pattern-badge">{p.stageName}</span>}
        <span className="pattern-badge"><b>Time</b> {p.complexity?.time}</span>
      </div>
    </Link>
  );
}

export default function Roadmap({ catalog }) {
  const categories = catalog?.categories || [];
  const patternsCat = categories.find((c) => c.id === "patterns");
  const patterns = patternsCat?.lessons || [];

  const basics = useMemo(
    () => categories.filter((c) => c.id !== "patterns").flatMap((c) => c.lessons).slice(0, 6),
    [categories]
  );

  const byStage = useMemo(() => {
    const stages = [1, 2, 3].map((id) => ({
      id,
      name: ["", "Foundations", "Core", "Advanced"][id],
      blurb: ["", "Arrays, strings, hashing & the first pointer tricks — your interview warm-up.",
        "Linked lists, trees, graphs & the patterns behind most medium questions.",
        "Heaps, unions, DP & topological thinking for the hardest FAANG rounds."][id],
      items: patterns.filter((p) => p.stage === id),
    }));
    return stages;
  }, [patterns]);

  const byLevel = useMemo(() => {
    const order = ["Easy", "Medium", "Hard"];
    return order.map((lv) => ({ level: lv, items: patterns.filter((p) => p.level === lv) }));
  }, [patterns]);

  return (
    <div className="roadmap">
      <header className="rm-head">
        <div className="eyebrow">DSA Roadmap</div>
        <h1>From Zero to FAANG-Ready</h1>
        <p className="rm-lead">
          Follow the path from the basics to advanced patterns. Each stop links to a visualizer
          or an interview pattern with the most-asked company questions, tagged by difficulty.
        </p>
      </header>

      {/* The learning tree: basic → advanced */}
      <section className="section">
        <div className="section-head">
          <span className="sec-idx">01</span>
          <h2 className="section-title">Your Learning Tree</h2>
          <span className="sec-rule" />
          <span className="section-sub">Start at the root, grow outward.</span>
        </div>

        <div className="rm-tree">
          {TREE_STEPS.map((s, i) => (
            <div className="rm-step" key={s.n}>
              <div className="rm-step-node">
                <span className="rm-step-n">{s.n}</span>
                <span className="rm-step-title">{s.title}</span>
              </div>
              <span className="rm-step-hint">{s.hint}</span>
              {i < TREE_STEPS.length - 1 && <span className="rm-step-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>

        <div className="rm-basics">
          <span className="rm-basics-label">Start here:</span>
          {basics.map((l) => (
            <Link key={l.id} to={`/lesson/${l.id}`} className="rm-basic-chip">{l.title}</Link>
          ))}
          <Link to="/#visualizers" className="rm-basic-chip more">All visualizers →</Link>
        </div>
      </section>

      {/* Patterns grouped basic → advanced (by stage) */}
      <section className="section">
        <div className="section-head">
          <span className="sec-idx">02</span>
          <h2 className="section-title">Patterns: Basic → Advanced</h2>
          <span className="sec-rule" />
          <span className="section-sub">Master each stage in order.</span>
        </div>
        {byStage.map((stage) => (
          <div className="rm-stage" key={stage.id}>
            <div className="rm-stage-head">
              <span className="rm-stage-dot" />
              <h3>{stage.name}</h3>
              <span className="rm-stage-count">{stage.items.length} patterns</span>
            </div>
            <p className="rm-stage-blurb">{stage.blurb}</p>
            <div className="pattern-grid patterns-home">
              {stage.items.map((p) => <PatternCard key={p.id} p={p} showStage={false} />)}
            </div>
          </div>
        ))}
      </section>

      {/* Patterns grouped by difficulty */}
      <section className="section">
        <div className="section-head">
          <span className="sec-idx">03</span>
          <h2 className="section-title">Interview Patterns by Difficulty</h2>
          <span className="sec-rule" />
          <span className="section-sub">Warm up easy, then attack hard.</span>
        </div>
        <div className="rm-levels">
          {byLevel.map((grp) => (
            <div className={"rm-level lv-" + grp.level} key={grp.level}>
              <div className="rm-level-head">
                <DifficultyBadge level={grp.level} />
                <span className="rm-level-name">{grp.level}</span>
                <span className="rm-level-count">{grp.items.length}</span>
              </div>
              <div className="rm-level-list">
                {grp.items.map((p) => (
                  <Link key={p.id} to={`/lesson/${p.id}`} className="rm-level-item">
                    <span className="rm-level-item-title">{p.title}</span>
                    <span className="rm-level-item-q">{p.questions?.length || 0} Qs</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
