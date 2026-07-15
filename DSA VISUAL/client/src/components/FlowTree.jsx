import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

// Interactive "flow tree": Basics root → 3 stage nodes → pattern leaf nodes,
// drawn with SVG connectors. Hovering a node highlights the path that touches
// it; an optional query/levels filter dims everything that doesn't match.
const COL = { root: 78, stage: 384, leaf: 768 };
const ROW = 54;
const MARGIN = 44;
const GAP = 60;

export default function FlowTree({ patterns, query = "", levels = null }) {
  const [hover, setHover] = useState(null);

  const { nodes, edges, H } = useMemo(() => {
    const stages = [
      { id: 1, name: "Foundations", sub: "Arrays · Strings · Hashing" },
      { id: 2, name: "Core", sub: "Trees · Graphs · Backtracking" },
      { id: 3, name: "Advanced", sub: "Heaps · DP · Union Find" },
    ];
    const byStage = stages.map((s) => ({ ...s, items: patterns.filter((p) => p.stage === s.id) }));
    const maxRows = Math.max(...byStage.map((s) => s.items.length), 1);
    const bandH = maxRows * ROW;
    const H = MARGIN * 2 + byStage.length * bandH + (byStage.length - 1) * GAP;

    const ns = [];
    const es = [];
    const rootY = H / 2;
    ns.push({ id: "root", type: "root", x: COL.root, y: rootY, label: "Start: Basics", sub: "Arrays · Strings · Sorting" });
    byStage.forEach((stage, i) => {
      const top = MARGIN + i * (bandH + GAP);
      const stageY = top + bandH / 2;
      ns.push({ id: "stage-" + stage.id, type: "stage", x: COL.stage, y: stageY, label: stage.name, sub: stage.sub, scroll: "stage-" + stage.id });
      es.push({ from: "root", to: "stage-" + stage.id });
      stage.items.forEach((p, j) => {
        const y = top + j * ROW + ROW / 2;
        ns.push({ id: p.id, type: "leaf", x: COL.leaf, y, label: p.title, level: p.level, to: "/lesson/" + p.id });
        es.push({ from: "stage-" + stage.id, to: p.id });
      });
    });
    return { nodes: ns, edges: es, H };
  }, [patterns]);

  const patternById = useMemo(() => Object.fromEntries(patterns.map((p) => [p.id, p])), [patterns]);
  const q = (query || "").trim().toLowerCase();
  const lvlSet = levels && levels.length ? new Set(levels) : null;
  const filterActive = !!(q || lvlSet);

  const passFilter = (n) => {
    if (n.type !== "leaf") return true;
    const p = patternById[n.id];
    const okName = !q || (p && p.title.toLowerCase().includes(q));
    const okLvl = !lvlSet || (p && lvlSet.has(p.level || "Medium"));
    return okName && okLvl;
  };

  const isLit = (id) => {
    if (hover) {
      if (id === hover) return true;
      return edges.some((e) => (e.from === hover && e.to === id) || (e.to === hover && e.from === id));
    }
    if (filterActive) return passFilter(nodes.find((n) => n.id === id));
    return true;
  };
  const edgeLit = (e) => {
    if (hover) return e.from === hover || e.to === hover;
    if (filterActive) {
      const to = nodes.find((n) => n.id === e.to);
      return passFilter(to);
    }
    return false;
  };

  const path = (e) => {
    const a = nodes.find((n) => n.id === e.from);
    const b = nodes.find((n) => n.id === e.to);
    const dx = (b.x - a.x) / 2;
    return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flow-tree" style={{ aspectRatio: `1000 / ${H}` }}>
      <svg className="flow-svg" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="xMidYMid meet">
        {edges.map((e, i) => (
          <path key={i} d={path(e)} className={"flow-edge" + (edgeLit(e) ? " lit" : "") + (filterActive && !edgeLit(e) ? " off" : "")} />
        ))}
      </svg>
      {nodes.map((n) => {
        const lit = isLit(n.id);
        const dim = !lit || (filterActive && n.type !== "root" && !passFilter(n));
        const style = { left: (n.x / 1000) * 100 + "%", top: (n.y / H) * 100 + "%" };
        if (n.type === "root")
          return <Link key={n.id} to="/" className={"flow-node root" + (dim ? " dim" : "")} style={style} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
            <span className="flow-node-label">{n.label}</span>
            <span className="flow-node-sub">{n.sub}</span>
          </Link>;
        if (n.type === "stage")
          return <button key={n.id} type="button" onClick={() => scrollTo(n.scroll)} className={"flow-node stage" + (dim ? " dim" : "")} style={style} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
            <span className="flow-node-label">{n.label}</span>
            <span className="flow-node-sub">{n.sub}</span>
          </button>;
        return <Link key={n.id} to={n.to} className={"flow-node leaf lv-" + (n.level || "Medium") + (dim ? " dim" : "")} style={style} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
          <span className="flow-node-label">{n.label}</span>
          <span className="flow-node-badge">{(n.level || "Medium")[0]}</span>
        </Link>;
      })}
    </div>
  );
}
