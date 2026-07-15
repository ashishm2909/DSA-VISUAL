// Shared step/state helpers for the visualization engine.
//
// Every algorithm generator returns:
//   { kind: string, steps: Step[] }
//
// A Step looks like:
//   {
//     description: string,            // plain-language explanation of this step
//     codeLine: number | null,        // active pseudocode line index (0-based)
//     state: KindState               // snapshot of the world at this step
//   }
//
// KindState always carries `items` (a 1D array of cells) plus kind-specific
// extras (nodes/edges for graphs, table for DP, pointers for structures).
//
// Cell statuses drive coloring in the frontend renderers:
//   default | compare | swap | active | sorted | found | visited
//   inqueue | current | path | pivot | left | right | done

export const STATUS = {
  DEFAULT: "default",
  COMPARE: "compare",
  SWAP: "swap",
  ACTIVE: "active",
  SORTED: "sorted",
  FOUND: "found",
  VISITED: "visited",
  INQUEUE: "inqueue",
  CURRENT: "current",
  PATH: "path",
  PIVOT: "pivot",
  LEFT: "left",
  RIGHT: "right",
  DONE: "done",
};

// Build a fresh items array cloning values with a given status.
export function itemsFromArray(values, status = STATUS.DEFAULT) {
  return values.map((v) => ({ value: v, status }));
}

// Clone items (so each step owns its own snapshot). Preserves extra fields.
export function cloneItems(items) {
  return items.map((it) => ({ ...it }));
}

// Set status on given indices (mutates the passed array).
export function mark(items, indices, status) {
  if (!Array.isArray(indices)) indices = [indices];
  for (const i of indices) if (items[i]) items[i].status = status;
  return items;
}

export function makeStep(description, codeLine, state) {
  return { description, codeLine: codeLine ?? null, state };
}
