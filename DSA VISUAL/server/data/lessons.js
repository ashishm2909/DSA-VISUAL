// Lesson catalog: drives both the navigation sidebar and the input controls.
// `kind` selects the frontend renderer. `operations` defines runnable actions.
// `theory` / `example` power the per-lesson Concept panel.

import { patterns } from "./patterns.js";

export const categories = [
  {
    id: "structures",
    title: "Core Data Structures",
    lessons: [
      {
        id: "array-search",
        title: "Array · Search",
        kind: "array",
        description: "Find the index of a value by scanning elements left to right.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Linear array search checks each element from left to right until it matches the target, returning its index (or -1). It needs no ordering, so it works on any array — but in the worst case it scans every element, giving O(n) time.",
        example: "arr = [5, 2, 9, 1, 7], target = 9\ni=0 → 5\ni=1 → 2\ni=2 → 9  ✓  return 2",
        pseudocode: [
          "for i = 0 to n-1",
          "  if array[i] == target",
          "    return i",
          "return -1",
        ],
        operations: [
          { id: "search", label: "Search", fields: [{ name: "target", label: "Target", type: "number", default: 5 }] },
        ],
      },
      {
        id: "array-insert",
        title: "Array · Insert",
        kind: "array",
        description: "Insert a value at an index, shifting later elements right.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Insertion shifts every element from the target index one position to the right, then writes the new value into the freed slot. The shift is what costs O(n); the index must be within 0..n.",
        example: "arr = [5, 2, 9, 1], insert value = 8 at index = 2\nshift [9,1] right → [5, 2, _, 9, 1]\nwrite 8        → [5, 2, 8, 9, 1]",
        pseudocode: [
          "shift elements from index..end right by 1",
          "array[index] = value",
        ],
        operations: [
          { id: "insert", label: "Insert", fields: [
            { name: "index", label: "Index", type: "number", default: 2 },
            { name: "value", label: "Value", type: "number", default: 99 },
          ] },
        ],
      },
      {
        id: "array-delete",
        title: "Array · Delete",
        kind: "array",
        description: "Remove the element at an index, shifting later elements left.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Deletion removes the element at the index and shifts the following elements left to close the gap, keeping the array contiguous. O(n) because of the shift.",
        example: "arr = [5, 2, 9, 1], delete index = 1\nremove 2, shift [9,1] left → [5, 9, 1]",
        pseudocode: [
          "remove array[index]",
          "shift elements left by 1",
        ],
        operations: [
          { id: "delete", label: "Delete", fields: [{ name: "index", label: "Index", type: "number", default: 1 }] },
        ],
      },
      {
        id: "array-reverse",
        title: "Array · Reverse",
        kind: "array",
        description: "Reverse the array in place using two pointers.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Reverse swaps the element at `left` with the one at `right`, then moves both pointers inward until they meet. It runs in O(n) with O(1) extra space and never uses a second array.",
        example: "arr = [5, 2, 9, 1]\nswap(5,1) → [1, 2, 9, 5]\nswap(2,9) → [1, 9, 2, 5]  ✓",
        pseudocode: [
          "while left < right",
          "  swap(left, right)",
        ],
        operations: [{ id: "reverse", label: "Reverse", fields: [] }],
      },
      {
        id: "stack-push",
        title: "Stack · Push",
        kind: "stack",
        description: "Add an element to the top of the stack (LIFO).",
        complexity: { time: "O(1)", space: "O(1)" },
        theory: "A stack is LIFO (last in, first out). Push increments the top pointer and stores the value there — O(1). Only the top is ever accessed, which is why undo and recursion map so naturally to stacks.",
        example: "stack = []\npush 7 → [7]\npush 3 → [7, 3]   (top = 3)",
        pseudocode: ["top = top + 1", "stack[top] = value"],
        operations: [{ id: "push", label: "Push", fields: [{ name: "value", label: "Value", type: "number", default: 7 }] }],
      },
      {
        id: "stack-pop",
        title: "Stack · Pop",
        kind: "stack",
        description: "Remove and return the top element (LIFO).",
        complexity: { time: "O(1)", space: "O(1)" },
        theory: "Pop reads the top element and decrements the top pointer, O(1). Popping an empty stack underflows, so real implementations first check `top < 0`.",
        example: "stack = [7, 3, 5]\npop → returns 5, stack = [7, 3]   (top = 3)",
        pseudocode: ["value = stack[top]", "top = top - 1"],
        operations: [{ id: "pop", label: "Pop", fields: [] }],
      },
      {
        id: "stack-peek",
        title: "Stack · Peek",
        kind: "stack",
        description: "View the top element without removing it.",
        complexity: { time: "O(1)", space: "O(1)" },
        theory: "Peek returns the top value without removing it — O(1). It is handy whenever you must inspect the most recent item (e.g. matching parentheses or the top of a call stack) without disturbing state.",
        example: "stack = [7, 3, 5]\npeek → 5   (stack unchanged)",
        pseudocode: ["return stack[top]"],
        operations: [{ id: "peek", label: "Peek", fields: [] }],
      },
      {
        id: "queue-enqueue",
        title: "Queue · Enqueue",
        kind: "queue",
        description: "Add an element at the rear of the queue (FIFO).",
        complexity: { time: "O(1)", space: "O(1)" },
        theory: "A queue is FIFO (first in, first out). Enqueue adds at the rear — O(1) with a rear pointer. Think of a line at a ticket counter: the first person in is the first served.",
        example: "queue = []\nenqueue 8 → [8]\nenqueue 4 → [8, 4]   (rear = 4)",
        pseudocode: ["rear = rear + 1", "queue[rear] = value"],
        operations: [{ id: "enqueue", label: "Enqueue", fields: [{ name: "value", label: "Value", type: "number", default: 8 }] }],
      },
      {
        id: "queue-dequeue",
        title: "Queue · Dequeue",
        kind: "queue",
        description: "Remove the element at the front of the queue (FIFO).",
        complexity: { time: "O(1)", space: "O(1)" },
        theory: "Dequeue removes from the front — O(1) with a front pointer. The oldest element leaves first, which is why queues back breadth-first search and print/spool buffers.",
        example: "queue = [8, 4, 2]\ndequeue → returns 8, queue = [4, 2]   (front = 4)",
        pseudocode: ["value = queue[front]", "front = front + 1"],
        operations: [{ id: "dequeue", label: "Dequeue", fields: [] }],
      },
      {
        id: "linked-insert",
        title: "Linked List · Insert",
        kind: "linkedlist",
        description: "Insert a node at a given position by rewiring pointers.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "A linked list stores nodes that point to one another. To insert at position `i` you traverse to the predecessor, then rewire `prev.next = newNode; newNode.next = curr`. The walk is O(n); the link change itself is O(1).",
        example: "1 → 2 → 3, insert 9 at position 1\ntraverse to node 1\n1 → 9 → 2 → 3",
        pseudocode: ["traverse to position", "new.next = curr.next", "curr.next = new"],
        operations: [{ id: "insert", label: "Insert", fields: [
          { name: "index", label: "Position", type: "number", default: 2 },
          { name: "value", label: "Value", type: "number", default: 42 },
        ] }],
      },
      {
        id: "linked-delete",
        title: "Linked List · Delete",
        kind: "linkedlist",
        description: "Delete a node at a given position by rewiring pointers.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Deletion walks to the node before the target and sets `prev.next = curr.next`, dropping the node from the chain. O(n) to walk, O(1) to rewire — and no shifting is needed as with arrays.",
        example: "1 → 2 → 3, delete position 1\ntraverse to node 1\n1 → 3",
        pseudocode: ["traverse to position", "prev.next = curr.next"],
        operations: [{ id: "delete", label: "Delete", fields: [{ name: "index", label: "Position", type: "number", default: 1 }] }],
      },
      {
        id: "linked-search",
        title: "Linked List · Search",
        kind: "linkedlist",
        description: "Search for a value by walking the list node by node.",
        complexity: { time: "O(n)", space: "O(1)" },
        theory: "Search walks node-by-node comparing values until a match or the end (null). O(n) time, O(1) space — unlike an array there is no random access, so you must follow pointers from the head.",
        example: "1 → 4 → 2 → 7, target = 2\npos 0 → 1\npos 1 → 4\npos 2 → 2  ✓  found at position 2",
        pseudocode: ["while node != null", "  if node.value == target return node", "  node = node.next"],
        operations: [{ id: "search", label: "Search", fields: [{ name: "target", label: "Target", type: "number", default: 3 }] }],
      },
    ],
  },
  {
    id: "sorting",
    title: "Sorting",
    lessons: [
      { id: "sort-bubble", title: "Bubble Sort", kind: "sorting", description: "Repeatedly swap adjacent out-of-order elements.", complexity: { time: "O(n²)", space: "O(1)" },
        theory: "Bubble sort steps through the array swapping adjacent out-of-order pairs, so the largest value 'bubbles' to the end each pass. O(n²) time, O(1) space — easy to understand but slow, which is why it is mostly pedagogical.",
        example: "[5, 2, 9, 1]\npass 1 → [2, 5, 1, 9]\npass 2 → [2, 1, 5, 9]\npass 3 → [1, 2, 5, 9]  ✓",
        pseudocode: ["for i in 0..n-1", "  for j in 0..n-1-i", "    if a[j] > a[j+1] swap", "  mark a[n-1-i] sorted"] },
      { id: "sort-selection", title: "Selection Sort", kind: "sorting", description: "Repeatedly select the minimum and place it at the front.", complexity: { time: "O(n²)", space: "O(1)" },
        theory: "Selection sort finds the minimum in the unsorted suffix and swaps it to the front, shrinking the unsorted region each pass. O(n²) time, O(1) space; it performs few writes, which matters on slow memory.",
        example: "[5, 2, 9, 1]\nswap 5↔1 → [1, 2, 9, 5]\nswap 9↔5 → [1, 2, 5, 9]  ✓",
        pseudocode: ["for i in 0..n-1", "  min = i", "  for j in i+1..n", "    if a[j] < a[min] min=j", "  swap a[i],a[min]"] },
      { id: "sort-insertion", title: "Insertion Sort", kind: "sorting", description: "Build the sorted array one element at a time.", complexity: { time: "O(n²)", space: "O(1)" },
        theory: "Insertion sort keeps a sorted prefix and, for each new element, shifts larger items right until the correct slot is found. O(n²) average but O(n) on nearly-sorted data; stable and in-place — the algorithm behind sorting small chunks.",
        example: "[5, 2, 9, 1]\ninsert 2 → [2, 5, 9, 1]\ninsert 1 → [1, 2, 5, 9]  ✓",
        pseudocode: ["for i in 1..n-1", "  key = a[i]", "  while j>=0 and a[j]>key shift", "  a[j+1] = key"] },
      { id: "sort-merge", title: "Merge Sort", kind: "sorting", description: "Divide and conquer: split, sort, then merge.", complexity: { time: "O(n log n)", space: "O(n)" },
        theory: "Merge sort recursively divides the array in half, sorts each half, then merges two already-sorted runs. O(n log n) time guaranteed and stable, but it needs O(n) extra space for the merge buffer.",
        example: "[5, 2, 9, 1]\n[5,2] | [9,1] → [2,5] | [1,9]\nmerge → [1, 2, 5, 9]  ✓",
        pseudocode: ["if lo>=hi return", "mid = (lo+hi)/2", "sort(lo,mid); sort(mid+1,hi)", "merge(lo,mid,hi)"] },
      { id: "sort-quick", title: "Quick Sort", kind: "sorting", description: "Partition around a pivot, then recurse.", complexity: { time: "O(n log n) avg", space: "O(log n)" },
        theory: "Quick sort picks a pivot, partitions so smaller values sit left and larger right, then recurses on each side. O(n log n) average and O(n²) worst case; it is in-place and very cache-friendly, which is why it is the default in many standard libraries.",
        example: "[5, 2, 9, 1]  pivot=1\n<1: []   >1: [5,2,9]  → [1, 2, 5, 9]  ✓",
        pseudocode: ["pivot = a[hi]", "i = lo", "for j in lo..hi-1 if a[j]<pivot swap", "swap a[i],a[hi]; return i"] },
    ].map((l) => ({ ...l, operations: [{ id: "run", label: "Run", fields: [] }] })),
  },
  {
    id: "searching",
    title: "Searching",
    lessons: [
      { id: "search-linear", title: "Linear Search", kind: "searching", description: "Scan every element until the target is found.", complexity: { time: "O(n)", space: "O(1)" },
        theory: "Linear search scans every element until it finds the target or reaches the end. No ordering is required, so it works on any array; O(n) time makes it ideal for small or unsorted data where sorting would cost more than the search.",
        example: "[5, 2, 9, 1, 7], target = 7\ni=0 → 5\ni=1 → 2\ni=2 → 9\ni=3 → 1\ni=4 → 7  ✓  found at index 4",
        pseudocode: ["for i in 0..n-1", "  if a[i]==target return i", "return -1"],
        operations: [{ id: "search", label: "Search", fields: [{ name: "target", label: "Target", type: "number", default: 6 }] }] },
      { id: "search-binary", title: "Binary Search", kind: "searching", description: "Repeatedly halve a sorted array to locate the target.", complexity: { time: "O(log n)", space: "O(1)" },
        theory: "Binary search requires a sorted array. It compares the middle element and discards the half that cannot contain the target, halving the search space every step — O(log n). Using it on unsorted data gives wrong answers, so pre-sorting is mandatory.",
        example: "[1, 3, 5, 7, 9, 11, 13], target = 9\nmid=7 < 9 → lo=4\nmid=11 > 9 → hi=4\nmid=9 == 9  ✓  index 4",
        pseudocode: ["lo=0; hi=n-1", "while lo<=hi", "  mid=(lo+hi)/2", "  if a[mid]==t return mid", "  if a[mid]<t lo=mid+1 else hi=mid-1"],
        operations: [{ id: "search", label: "Search", fields: [{ name: "target", label: "Target", type: "number", default: 7 }] }] },
    ],
  },
  {
    id: "graph",
    title: "Graph Algorithms",
    lessons: [
      { id: "graph-bfs", title: "Breadth-First Search", kind: "graph", description: "Explore neighbors level by level using a queue.", complexity: { time: "O(V+E)", space: "O(V)" },
        theory: "BFS explores nodes level by level using a queue, visiting all neighbors of the current node before going deeper. On an unweighted graph it finds the shortest path, and it naturally reveals connected components. O(V+E) time, O(V) space.",
        example: "edges 0-1, 0-2, 1-3  (start 0)\nvisit 0\nenqueue 1,2 → visit 1,2\nenqueue 3 → visit 3\norder: 0, 1, 2, 3",
        pseudocode: ["queue = [start]", "while queue", "  u = dequeue; visit u", "  for v in adj[u] if !visited enqueue v"],
        operations: [{ id: "run", label: "Run BFS", fields: [] }] },
      { id: "graph-dfs", title: "Depth-First Search", kind: "graph", description: "Explore as deep as possible, then backtrack using a stack.", complexity: { time: "O(V+E)", space: "O(V)" },
        theory: "DFS dives as deep as possible along one branch using a stack, backtracking when it hits a dead end. It is the tool of choice for connectivity, cycle detection, and topological order. O(V+E) time, O(V) space.",
        example: "edges 0-1, 0-2, 1-3  (start 0)\n0 → 1 → 3 (dead end)\nbacktrack → 2\norder: 0, 1, 3, 2",
        pseudocode: ["stack = [start]", "while stack", "  u = pop; if visited continue", "  visit u; push unvisited neighbors"],
        operations: [{ id: "run", label: "Run DFS", fields: [] }] },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    lessons: [
      { id: "dp-fib", title: "Fibonacci (Tabulation)", kind: "dp", description: "Build the Fibonacci sequence bottom-up in a table.", complexity: { time: "O(n)", space: "O(n)" },
        theory: "Tabulation builds the Fibonacci table bottom-up: dp[0]=0, dp[1]=1, and dp[i]=dp[i-1]+dp[i-2]. Storing subresults avoids the exponential recomputation of naive recursion. O(n) time, O(n) space — or O(1) if you keep only the last two values.",
        example: "n = 5\ndp = 0, 1, 1, 2, 3, 5\nFib(5) = 5",
        pseudocode: ["dp[0]=0; dp[1]=1", "for i in 2..n", "  dp[i]=dp[i-1]+dp[i-2]"],
        operations: [{ id: "run", label: "Run", fields: [{ name: "n", label: "N (max 20)", type: "number", default: 10 }] }] },
      { id: "dp-knapsack", title: "0/1 Knapsack", kind: "dp", description: "Fill a value table choosing to take or skip each item.", complexity: { time: "O(n·W)", space: "O(n·W)" },
        theory: "0/1 Knapsack fills a value table dp[i][c]: for each item you may take it (if it fits) or skip it, keeping the maximum value. O(n·W) time and space; reading the table back traces the exact items that achieve the optimum.",
        example: "items (w,v): (2,3), (3,4), (4,5),  W = 5\ndp best at W=5 = 7  (take items 1 & 2: 2+3=5 wt, 3+4=7 val)",
        pseudocode: ["for i in 1..n", "  for c in 0..W", "    dp[i][c]=max(skip, take)"],
        operations: [{ id: "run", label: "Run", fields: [{ name: "capacity", label: "Capacity", type: "number", default: 7 }] }] },
    ],
  },
  {
    id: "patterns",
    title: "DSA Interview Patterns",
    description: "Recurring problem-solving patterns and the most-asked company questions that map to each.",
    lessons: patterns,
  },
];

// Flat lookup by lesson id.
export const lessonsById = categories
  .flatMap((c) => c.lessons.map((l) => ({ ...l, categoryId: c.id, categoryTitle: c.title })))
  .reduce((acc, l) => { acc[l.id] = l; return acc; }, {});

export const defaultArray = () => [5, 2, 9, 1, 7, 3, 8, 6, 4];

// Default graph used by the graph lessons (client sends this unless edited).
export const defaultGraph = {
  nodes: [
    { id: 0, label: "A" }, { id: 1, label: "B" }, { id: 2, label: "C" },
    { id: 3, label: "D" }, { id: 4, label: "E" }, { id: 5, label: "F" },
  ],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5]],
};

export function lessonList() {
  return categories.map((c) => ({ ...c, lessons: c.lessons.map((l) => ({ id: l.id, title: l.title })) }));
}
