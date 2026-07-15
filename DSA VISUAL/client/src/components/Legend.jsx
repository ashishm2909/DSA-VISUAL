const LABELS = {
  compare: "Comparing",
  swap: "Swapping",
  active: "Current element",
  sorted: "Sorted / placed",
  found: "Match found",
  visited: "Visited",
  inqueue: "In queue (next)",
  current: "Being visited",
  pivot: "Pivot",
  left: "Range start",
  right: "Range end",
};

const BY_KIND = {
  array: ["compare", "swap", "active", "found", "sorted"],
  searching: ["compare", "found", "visited", "left", "right"],
  linkedlist: ["compare", "current", "active", "found"],
  stack: ["active", "current", "sorted"],
  queue: ["active", "inqueue", "current"],
  sorting: ["compare", "swap", "active", "sorted"],
  graph: ["inqueue", "current", "visited", "path"],
  dp: ["compare", "active", "sorted"],
};

export default function Legend({ kind }) {
  const keys = BY_KIND[kind] || Object.keys(LABELS);
  return (
    <div className="legend">
      {keys.map((k) => (
        <span className="legend-item" key={k}>
          <span className={"legend-dot c-" + k} />
          {LABELS[k] || k}
        </span>
      ))}
    </div>
  );
}
