import { STATUS, cloneItems, makeStep } from "./step.js";

// Circular layout so the 3D scene reads clearly.
function layout(graph) {
  const n = Math.max(1, graph.nodes.length);
  const R = 160;
  return graph.nodes.map((node, i) => {
    const ang = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: node.id,
      label: node.label ?? String(node.id),
      x: 220 + R * Math.cos(ang),
      y: 200 + R * Math.sin(ang),
      status: STATUS.DEFAULT,
    };
  });
}

function snapshot(nodes, edges, extra = {}) {
  return { nodes: nodes.map((n) => ({ ...n })), edges: edges.map((e) => ({ ...e })), ...extra };
}

export function graphBFS(input) {
  const graph = input.graph;
  if (!graph.nodes || graph.nodes.length === 0) {
    return { kind: "graph", steps: [makeStep("The graph is empty — add some nodes and edges to begin.", 0, { nodes: [], edges: [] })] };
  }
  const letter = (id) => (graph.nodes.find((n) => n.id === id)?.label ?? id);
  const start = input.start ?? graph.nodes[0].id;
  const adj = new Map(graph.nodes.map((n) => [n.id, []]));
  for (const [u, v] of graph.edges) {
    adj.get(u).push(v);
    adj.get(v).push(u);
  }
  const nodes = layout(graph);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges = graph.edges.map(([u, v]) => ({ from: u, to: v, status: STATUS.DEFAULT }));
  const visited = new Set();
  const queue = [start];
  let order = 0;
  const setEdge = (u, v, s) => {
    const e = edges.find((e) => (e.from === u && e.to === v) || (e.from === v && e.to === u));
    if (e) e.status = s;
  };
  const steps = [makeStep(
    `Breadth-First Search explores level by level. We start at node ${letter(start)} and use a queue to remember what to visit next.`,
    0, snapshot(nodes, edges, { start }),
  )];
  nodeById.get(start).status = STATUS.INQUEUE;
  steps.push(makeStep(`Enqueue the start node ${letter(start)} — it is the first in line.`, 1, snapshot(nodes, edges, { start, queue: [...queue] })));
  while (queue.length) {
    const cur = queue.shift();
    nodeById.get(cur).status = STATUS.CURRENT;
    visited.add(cur);
    steps.push(makeStep(`Dequeue ${letter(cur)} and mark it visited — we are now "here".`, 2, snapshot(nodes, edges, { start, queue: [...queue], current: cur })));
    for (const nb of adj.get(cur)) {
      if (!visited.has(nb) && !queue.includes(nb)) {
        nodeById.get(nb).status = STATUS.INQUEUE;
        setEdge(cur, nb, STATUS.PATH);
        queue.push(nb);
        steps.push(makeStep(`Neighbor ${letter(nb)} is unvisited, so we enqueue it to visit after this level.`, 3, snapshot(nodes, edges, { start, queue: [...queue], current: cur })));
      }
    }
    nodeById.get(cur).status = STATUS.VISITED;
    nodeById.get(cur).order = ++order;
  }
  steps.push(makeStep(`Done. BFS visited every reachable node in order of distance from ${letter(start)}.`, 4, snapshot(nodes, edges, { start })));
  return { kind: "graph", steps };
}

export function graphDFS(input) {
  const graph = input.graph;
  if (!graph.nodes || graph.nodes.length === 0) {
    return { kind: "graph", steps: [makeStep("The graph is empty — add some nodes and edges to begin.", 0, { nodes: [], edges: [] })] };
  }
  const letter = (id) => (graph.nodes.find((n) => n.id === id)?.label ?? id);
  const start = input.start ?? graph.nodes[0].id;
  const adj = new Map(graph.nodes.map((n) => [n.id, []]));
  for (const [u, v] of graph.edges) {
    adj.get(u).push(v);
    adj.get(v).push(u);
  }
  const nodes = layout(graph);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges = graph.edges.map(([u, v]) => ({ from: u, to: v, status: STATUS.DEFAULT }));
  const visited = new Set();
  let order = 0;
  const setEdge = (u, v, s) => {
    const e = edges.find((e) => (e.from === u && e.to === v) || (e.from === v && e.to === u));
    if (e) e.status = s;
  };
  const steps = [makeStep(
    `Depth-First Search dives as deep as possible, then backtracks. We start at ${letter(start)} and use a stack.`,
    0, snapshot(nodes, edges, { start }),
  )];
  const stack = [start];
  nodeById.get(start).status = STATUS.INQUEUE;
  while (stack.length) {
    const cur = stack.pop();
    if (visited.has(cur)) continue;
    visited.add(cur);
    nodeById.get(cur).status = STATUS.CURRENT;
    steps.push(makeStep(`Pop ${letter(cur)} from the stack and visit it.`, 1, snapshot(nodes, edges, { start, stack: [...stack], current: cur })));
    for (const nb of [...adj.get(cur)].reverse()) {
      if (!visited.has(nb)) {
        nodeById.get(nb).status = STATUS.INQUEUE;
        setEdge(cur, nb, STATUS.PATH);
        stack.push(nb);
        steps.push(makeStep(`Push unvisited neighbor ${letter(nb)} onto the stack to explore next.`, 2, snapshot(nodes, edges, { start, stack: [...stack], current: cur })));
      }
    }
    nodeById.get(cur).status = STATUS.VISITED;
    nodeById.get(cur).order = ++order;
  }
  steps.push(makeStep(`Done. DFS reached the deepest nodes first and backtracked to finish.`, 3, snapshot(nodes, edges, { start })));
  return { kind: "graph", steps };
}
