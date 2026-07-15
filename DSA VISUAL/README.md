# DSA Visual

An interactive platform to **visually understand Data Structures & Algorithms**.
Every algorithm is broken into individual steps that are animated and explained,
so you can see *why* it works — not just read the code.

## Features
- **Core Data Structures** — Array (search/insert/delete/reverse), Stack, Queue, Linked List
- **Sorting** — Bubble, Selection, Insertion, Merge, Quick
- **Searching** — Linear, Binary
- **Graph Algorithms** — BFS, DFS
- **Dynamic Programming** — Fibonacci (tabulation), 0/1 Knapsack
- **DSA Interview Patterns** — 17 recurring problem-solving patterns (Sliding Window,
  Two Pointers, Fast & Slow Pointers, Merge Intervals, Cyclic Sort, In-place Linked
  List Reversal, Tree BFS/DFS, Two Heaps, Subsets/Backtracking, Modified Binary
  Search, Top K Elements, K-way Merge, 0/1 Knapsack, Topological Sort, Union Find,
  Trie). Each pattern explains the mental model and lists the most-asked,
  company-favorite LeetCode-style questions that map to it.
- Step-by-step playback (play / pause / step / reset) with adjustable speed
- Live pseudocode highlighting synced to the current step
- Edit the input data and re-run any operation

## Tech Stack
- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node + Express (algorithm step generators)
- **Architecture:** algorithms run server-side and emit a list of *steps*
  (state snapshots). The client renders each step and plays them back — a clean
  separation that keeps the heavy logic reusable and testable.

## Getting Started

```bash
# install all workspace dependencies
npm install

# run backend (port 4000) + frontend (port 5173) together
npm run dev
```

Open http://localhost:5173

### Production build
```bash
npm run build      # builds client into client/dist
npm start          # serves the API + built client from port 4000
```
Then open http://localhost:4000

## How it works (for contributors)
1. Add an algorithm generator in `server/algorithms/*` that returns
   `{ kind, steps: [{ description, codeLine, state }] }`.
2. Register it in `server/algorithms/index.js` under a lesson `id`.
3. Add the lesson (title, `kind`, pseudocode, operations) in `server/data/lessons.js`.
4. Add/adjust the renderer for that `kind` in `client/src/renderers.jsx`.

The frontend automatically picks up new lessons in the sidebar and renders them
using the matching renderer — no frontend routing changes required.

## Project Structure
```
server/
  index.js              # Express API (/api/lessons, /api/lesson/:id, /api/run)
  data/lessons.js       # lesson catalog (drives sidebar + inputs)
  algorithms/           # step generators (structures, sorting, searching, graph, dp)
client/
  src/
    App.jsx, api.js
    components/         # Sidebar, LessonView, PseudoCode, StepInfo, PlaybackControls
    renderers.jsx       # per-kind visualization renderers
```
