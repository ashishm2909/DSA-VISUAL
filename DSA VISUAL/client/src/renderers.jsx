import React from "react";
import Graph3D from "./components/Graph3D.jsx";

function cls(status) { return "cell c-" + (status || "default"); }

// ---- 1D box row (array, searching, linked list) ----
function BoxRow({ items, withArrows, headLabel }) {
  return (
    <div className={"box-row" + (withArrows ? " linked" : "")}>
      {headLabel && <div className="ptr">HEAD</div>}
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <div className={cls(it.status)}>
            <span className="val">{it.value}</span>
            <span className="idx">{i}</span>
          </div>
          {withArrows && i < items.length - 1 && <div className="arrow">→</div>}
          {withArrows && i === items.length - 1 && <div className="ptr null">NULL</div>}
        </React.Fragment>
      ))}
      {items.length === 0 && <div className="empty">empty</div>}
    </div>
  );
}

// ---- vertical stack ----
function BoxCol({ items, top }) {
  const reversed = [...items].reverse();
  return (
    <div className="box-col">
      <div className="stack-base">TOP</div>
      {reversed.map((it, ri) => {
        const i = items.length - 1 - ri;
        return (
          <div key={i} className={cls(it.status)}>
            <span className="val">{it.value}</span>
            {i === top && <span className="tag">top</span>}
          </div>
        );
      })}
      <div className="stack-base">BASE</div>
      {items.length === 0 && <div className="empty">empty</div>}
    </div>
  );
}

// ---- queue ----
function Queue({ items, front, rear }) {
  return (
    <div className="queue">
      <div className="ptr">FRONT</div>
      <div className="box-row">
        {items.map((it, i) => (
          <div key={i} className={cls(it.status)}>
            <span className="val">{it.value}</span>
            {i === front && <span className="tag">front</span>}
            {i === rear && <span className="tag">rear</span>}
          </div>
        ))}
        {items.length === 0 && <div className="empty">empty</div>}
      </div>
      <div className="ptr">REAR</div>
    </div>
  );
}

// ---- sorting bars ----
function Bars({ items }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="bars">
      {items.map((it, i) => (
        <div key={i} className="bar-wrap">
          <div className={cls(it.status) + " bar"} style={{ height: `${(it.value / max) * 100}%` }}>
            <span className="bar-val">{it.value}</span>
          </div>
          <span className="idx">{i}</span>
        </div>
      ))}
    </div>
  );
}

// ---- graph ----
function Graph({ nodes, edges, queue, stack }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="graph-wrap">
      <svg viewBox="0 0 440 400" className="graph-svg">
        {edges.map((e, i) => {
          const a = byId[e.from], b = byId[e.to];
          if (!a || !b) return null;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={"edge " + (e.status || "default")} />;
        })}
        {nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <circle r="22" className={"node " + (n.status || "default")} />
            <text className="node-label" textAnchor="middle" dy="5">{n.label}</text>
          </g>
        ))}
      </svg>
      {(queue || stack) && (
        <div className="aux">
          <span className="aux-label">{queue ? "Queue:" : "Stack:"}</span>
          {(queue || stack).map((id, i) => (
            <span key={i} className="chip">{byId[id]?.label ?? id}</span>
          ))}
          {(queue || stack).length === 0 && <span className="chip muted">—</span>}
        </div>
      )}
    </div>
  );
}

// ---- dp table ----
function DpTable({ table }) {
  return (
    <div className="dp-scroll">
      <table className="dp-table">
        <tbody>
          {table.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className={cls(cell.status)}>{cell.value === "" ? "" : cell.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function renderState(state, kind) {
  if (!state) return <div className="placeholder">Run an operation to see the visualization.</div>;
  switch (kind) {
    case "array":
    case "searching":
      return <BoxRow items={state.items} />;
    case "linkedlist":
      return <BoxRow items={state.items} withArrows headLabel />;
    case "stack":
      return <BoxCol items={state.items} top={state.top} />;
    case "queue":
      return <Queue items={state.items} front={state.front} rear={state.rear} />;
    case "sorting":
      return <Bars items={state.items} />;
    case "graph":
      return <Graph3D nodes={state.nodes} edges={state.edges} queue={state.queue} stack={state.stack} />;
    case "dp":
      return <DpTable table={state.table} />;
    case "pattern":
      return null;
    default:
      return <div className="placeholder">No renderer for "{kind}".</div>;
  }
}
