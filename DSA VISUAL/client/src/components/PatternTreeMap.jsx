import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CURRICULUM, FLOW, LINKS } from "../curriculum.js";

const TIER_META = {
  beginner: { color: "#34c98b", bg: "rgba(52,201,139,0.06)", border: "rgba(52,201,139,0.35)", icon: "🌱", label: "Beginner" },
  intermediate: { color: "#4cc9e0", bg: "rgba(76,201,224,0.06)", border: "rgba(76,201,224,0.35)", icon: "🚀", label: "Intermediate" },
  advanced: { color: "#ff8a5b", bg: "rgba(255,138,91,0.06)", border: "rgba(255,138,91,0.35)", icon: "🔥", label: "Advanced" },
  expert: { color: "#c084fc", bg: "rgba(192,132,252,0.06)", border: "rgba(192,132,252,0.35)", icon: "👑", label: "Expert" },
};

export default function PatternTreeMap() {
  const [activeTopic, setActiveTopic] = useState(null);
  const wrapRef = useRef(null);

  const tiers = useMemo(() => {
    const map = {};
    for (const phase of CURRICULUM) {
      const key = phase.tier;
      if (!map[key]) {
        map[key] = {
          id: key,
          ...TIER_META[key],
          topics: [],
        };
      }
      map[key].topics.push(...phase.topics.map((tp) => ({ ...tp, phaseTitle: phase.title })));
    }
    return Object.values(map);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setActiveTopic(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTopicData = activeTopic ? tiers.flatMap((t) => t.topics).find((tp) => tp.id === activeTopic) : null;

  return (
    <div className="ptm" ref={wrapRef}>
      <div className="ptm-header">
        <div className="eyebrow">Learning Path</div>
        <h2 className="ptm-title">DSA Pattern Map</h2>
        <p className="ptm-sub">Master topics tier by tier. Click any card to explore lessons and subtopics.</p>
      </div>

      <div className="ptm-layout">
        {/* Left: Card-based learning path */}
        <div className="ptm-cards">
          {tiers.map((tier) => (
            <div key={tier.id} className="ptm-tier-card" style={{ borderColor: tier.border, background: tier.bg }}>
              <div className="ptm-tier-header" style={{ color: tier.color }}>
                <span className="ptm-tier-icon">{tier.icon}</span>
                <span className="ptm-tier-name">{tier.label}</span>
                <span className="ptm-tier-count">{tier.topics.length} topics</span>
              </div>
              <div className="ptm-topics-grid">
                {tier.topics.map((tp) => {
                  const isActive = activeTopic === tp.id;
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      className={"ptm-topic-card" + (isActive ? " active" : "")}
                      style={{ "--topic-color": tier.color }}
                      onClick={() => setActiveTopic(isActive ? null : tp.id)}
                    >
                      {tp.must && <span className="ptm-must-tag">⭐ MUST</span>}
                      <span className="ptm-topic-name">{tp.title}</span>
                      <span className="ptm-topic-meta">{tp.star}★</span>
                      {tp.subs && tp.subs.length > 0 && (
                        <div className="ptm-subtopic-chips">
                          {tp.subs.slice(0, 4).map((s, i) => (
                            <span key={i} className="ptm-chip">{s}</span>
                          ))}
                          {tp.subs.length > 4 && <span className="ptm-chip-more">+{tp.subs.length - 4}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detail panel */}
        <div className="ptm-detail-wrap">
          {activeTopicData ? (
            <div className="ptm-panel">
              <div className="ptm-panel-header">
                <span className="ptm-panel-icon">📘</span>
                <div>
                  <div className="ptm-panel-title">{activeTopicData.title}</div>
                  <div className="ptm-panel-sub">{activeTopicData.phaseTitle} · {activeTopicData.star}★ Importance</div>
                </div>
                <button className="ptm-panel-close" onClick={() => setActiveTopic(null)}>✕</button>
              </div>
              <div className="ptm-panel-body">
                {activeTopicData.must && <span className="ptm-panel-badge must">⭐ MUST KNOW</span>}
                {activeTopicData.note && <p className="ptm-panel-note">{activeTopicData.note}</p>}
                {activeTopicData.lessons?.length > 0 && (
                  <div className="ptm-panel-block">
                    <div className="ptm-panel-h">📚 Lessons</div>
                    <div className="ptm-panel-list">
                      {activeTopicData.lessons.map((l) => (
                        <Link key={l.id} to={`/lesson/${l.id}`} className="ptm-panel-link" onClick={() => setActiveTopic(null)}>
                          <span className="ptm-link-arrow">→</span> {l.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {activeTopicData.subs?.length > 0 && (
                  <div className="ptm-panel-block">
                    <div className="ptm-panel-h">📝 Subtopics</div>
                    <div className="ptm-panel-chips">
                      {activeTopicData.subs.map((s, i) => {
                        const linked = LINKS[s.toLowerCase()];
                        return linked ? (
                          <Link key={i} to={`/lesson/${linked}`} className="ptm-panel-chip link" onClick={() => setActiveTopic(null)}>{s}</Link>
                        ) : (
                          <span key={i} className="ptm-panel-chip">{s}</span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {activeTopicData.examples?.length > 0 && (
                  <div className="ptm-panel-block">
                    <div className="ptm-panel-h">💬 Common Questions</div>
                    <div className="ptm-panel-list">
                      {activeTopicData.examples.map((ex, i) => (
                        <span key={i} className="ptm-panel-q">{ex.q}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ptm-placeholder">
              <div className="ptm-placeholder-icon">📚</div>
              <div className="ptm-placeholder-title">Select a topic</div>
              <div className="ptm-placeholder-sub">Click any card to view lessons, subtopics and common questions.</div>
              <div className="ptm-legend-mini">
                {tiers.map((t) => (
                  <div key={t.id} className="ptm-legend-item">
                    <span className="ptm-legend-dot" style={{ background: t.color }}></span>
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
