import { useState } from "react";
import { Link } from "react-router-dom";
import { CURRICULUM, TIERS, FLOW, KEY_PATTERNS, resolve } from "../curriculum.js";

function Stars({ n }) {
  return (
    <span className="lt-stars" title={n + " / 5 importance"}>
      {"⭐".repeat(n)}<span className="lt-stars-off">{"⭐".repeat(5 - n)}</span>
    </span>
  );
}

function Sub({ label }) {
  const to = resolve(label);
  if (to) return <Link to={`/lesson/${to}`} className="lt-sub lt-sub-link">{label}</Link>;
  return <span className="lt-sub">{label}</span>;
}

function Example({ q }) {
  const to = resolve(q);
  if (to) return <Link to={`/lesson/${to}`} className="lt-ex">{q} →</Link>;
  return <span className="lt-ex">{q}</span>;
}

function TopicCard({ topic, onOpen }) {
  const hasLink = !!(topic.to || (topic.lessons && topic.lessons.length));
  const className =
    "lt-topic" +
    (topic.must ? " must" : "") +
    (hasLink ? " linked" : " info");
  const body = (
    <>
      <div className="lt-topic-top">
        <span className="lt-topic-title">{topic.title}</span>
        {topic.must && <span className="lt-must">MUST</span>}
      </div>
      <Stars n={topic.star} />
    </>
  );
  if (topic.to) {
    return (
      <Link to={`/lesson/${topic.to}`} className={className} onClick={(e) => e.stopPropagation()}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={() => onOpen(topic)}>
      {body}
    </button>
  );
}

function TopicDetail({ topic, onClose }) {
  if (!topic) return null;
  return (
    <div className="lt-detail-scrim" onClick={onClose}>
      <aside className="lt-detail" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="lt-detail-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="eyebrow">{topic.must ? "Must-know concept" : "Concept"}</div>
        <h2 className="lt-detail-title">{topic.title}</h2>
        <Stars n={topic.star} />
        {topic.note && <p className="lt-detail-note">{topic.note}</p>}

        {topic.lessons && topic.lessons.length > 0 && (
          <div className="lt-detail-block">
            <span className="lt-detail-h">Visual lessons</span>
            <div className="lt-lessons">
              {topic.lessons.map((l) => (
                <Link key={l.id} to={`/lesson/${l.id}`} className="lt-lesson" onClick={onClose}>{l.title} →</Link>
              ))}
            </div>
          </div>
        )}

        {topic.subs && topic.subs.length > 0 && (
          <div className="lt-detail-block">
            <span className="lt-detail-h">Covers</span>
            <div className="lt-subs">
              {topic.subs.map((s, i) => <Sub key={i} label={s} />)}
            </div>
          </div>
        )}

        {topic.examples && topic.examples.length > 0 && (
          <div className="lt-detail-block">
            <span className="lt-detail-h">Typical questions</span>
            <div className="lt-exs">
              {topic.examples.map((e, i) => <Example key={i} q={e.q} />)}
            </div>
          </div>
        )}

        {topic.to && (
          <Link to={`/lesson/${topic.to}`} className="btn-primary lt-detail-go" onClick={onClose}>
            Open lesson →
          </Link>
        )}
      </aside>
    </div>
  );
}

export default function LearningTree() {
  const [tier, setTier] = useState("all");
  const [mustOnly, setMustOnly] = useState(false);
  const [open, setOpen] = useState(null);

  const tiers = tier === "all" ? TIERS : TIERS.filter((t) => t.id === tier);

  return (
    <div className="lt">
      {/* Interview learning flow — linear progression */}
      <div className="lt-flow">
        {FLOW.map((f, i) => (
          <span key={f} className="lt-flow-item">
            {i > 0 && <span className="lt-flow-arrow" aria-hidden="true">▾</span>}
            <span className="lt-flow-node">{f}</span>
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="lt-controls">
        <div className="map-levels" role="group" aria-label="Filter by tier">
          <button className={"map-chip" + (tier === "all" ? " on" : "")} onClick={() => setTier("all")}>All</button>
          {TIERS.map((t) => (
            <button key={t.id} className={"map-chip" + (tier === t.id ? " on" : "")} onClick={() => setTier(t.id)}>
              <span className="lt-tier-ico">{t.icon}</span> {t.name}
            </button>
          ))}
          <button className={"map-chip" + (mustOnly ? " on" : "")} onClick={() => setMustOnly((v) => !v)}>
            ⭐ Must-know
          </button>
        </div>
      </div>

      {/* Tiers → phases → topics */}
      {tiers.map((t) => {
        const phases = CURRICULUM.filter((p) => p.tier === t.id);
        return (
          <section className="lt-tier" key={t.id}>
            <div className="lt-tier-head">
              <span className="lt-tier-ico">{t.icon}</span>
              <h2 className="lt-tier-name">{t.name}</h2>
              <span className="lt-tier-blurb">{t.blurb}</span>
            </div>
            {phases.map((ph) => {
              const topics = mustOnly ? ph.topics.filter((x) => x.must) : ph.topics;
              if (!topics.length) return null;
              return (
                <div className="lt-phase" key={ph.phase}>
                  <div className="lt-phase-head">
                    <span className="lt-phase-num">{String(ph.phase).padStart(2, "0")}</span>
                    <span className="lt-phase-title">{ph.title}</span>
                    <span className="lt-phase-rule" />
                  </div>
                  <div className="lt-topics">
                    {topics.map((tp) => <TopicCard key={tp.id} topic={tp} onOpen={setOpen} />)}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      {/* Most important patterns */}
      <section className="lt-tier">
        <div className="lt-tier-head">
          <span className="lt-tier-ico">🎯</span>
          <h2 className="lt-tier-name">Most Important Patterns</h2>
          <span className="lt-tier-blurb">Master these and you cover most interview questions.</span>
        </div>
        <div className="lt-keypats">
          {KEY_PATTERNS.map((p) =>
            p.to ? (
              <Link key={p.q} to={`/lesson/${p.to}`} className="lt-keypat">{p.q} →</Link>
            ) : (
              <span key={p.q} className="lt-keypat muted">{p.q}</span>
            )
          )}
        </div>
      </section>

      <TopicDetail topic={open} onClose={() => setOpen(null)} />
    </div>
  );
}
