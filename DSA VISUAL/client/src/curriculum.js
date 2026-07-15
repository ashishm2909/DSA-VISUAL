// Full DSA learning curriculum, structured as a beginner-friendly decision
// tree: each phase builds on the previous one. Every topic links to a real
// lesson or pattern page where one exists; otherwise it is an info node that
// still lists its sub-topics and typical questions.
//
// `to`     -> primary lesson/pattern id to open
// `lessons`-> list of { id, title } real lessons under this topic
// `subs`   -> sub-topics (strings). Keywords that match a real page auto-link.
// `examples`-> { q, to? } typical interview questions (some link to patterns)
// `star`   -> 1..5 importance (⭐)
// `must`   -> part of the 80/20 "must know" set

// Keyword -> lesson/pattern id, so sub-topics and examples can auto-link.
export const LINKS = {
  "sliding window": "pattern-sliding-window",
  "two pointer": "pattern-two-pointers",
  "two pointers": "pattern-two-pointers",
  "binary search": "pattern-binary-search",
  "fast slow pointer": "pattern-fast-slow",
  "fast slow": "pattern-fast-slow",
  "reverse": "pattern-reverse-list",
  "trie": "pattern-trie",
  "bfs": "graph-bfs",
  "breadth-first search": "graph-bfs",
  "dfs": "graph-dfs",
  "depth-first search": "graph-dfs",
  "topological sort": "pattern-topological",
  "union find": "pattern-union-find",
  "top k": "pattern-top-k",
  "merge k": "pattern-k-way-merge",
  "knapsack": "pattern-knapsack",
  "tree bfs": "pattern-tree-bfs",
  "tree dfs": "pattern-tree-dfs",
  "merge intervals": "pattern-merge-intervals",
  "backtracking": "pattern-subsets",
  "subsets": "pattern-subsets",
  "monotonic stack": "pattern-top-k",
  "heap": "pattern-top-k",
  "container with most water": "pattern-two-pointers",
  "longest substring": "pattern-sliding-window",
  "minimum window": "pattern-sliding-window",
  "two sum": "pattern-two-pointers",
  "linked list cycle": "pattern-fast-slow",
  "reverse linked list": "pattern-reverse-list",
  "level order": "pattern-tree-bfs",
  "max depth": "pattern-tree-dfs",
  "validate bst": "pattern-tree-dfs",
};

export function resolve(text) {
  if (!text) return null;
  const key = String(text).toLowerCase().trim();
  if (LINKS[key]) return LINKS[key];
  for (const [k, id] of Object.entries(LINKS)) {
    if (key.includes(k)) return id;
  }
  return null;
}

export const TIERS = [
  { id: "beginner", name: "Beginner", icon: "🌱", blurb: "Foundations: programming, arrays, strings, hashing." },
  { id: "intermediate", name: "Intermediate", icon: "🚀", blurb: "Linked lists, stacks, queues, trees, heaps." },
  { id: "advanced", name: "Advanced", icon: "🔥", blurb: "Graphs, backtracking, dynamic programming." },
  { id: "expert", name: "Expert", icon: "👑", blurb: "Segment trees, tries, advanced graphs & math." },
];

export const CURRICULUM = [
  {
    tier: "beginner", phase: 1, title: "Programming Foundation",
    topics: [
      { id: "prog-basics", title: "Programming Basics", star: 4, subs: ["Variables", "Loops", "Functions"], note: "Before any data structure, be comfortable writing loops, functions and reading code." },
      { id: "recursion", title: "Recursion", star: 5, must: true, subs: ["Base case", "Call stack", "Dry run"], note: "Master recursion early — trees, DFS, backtracking and DP all build on it.", examples: [{ q: "Fibonacci" }, { q: "Factorial" }, { q: "Power set" }] },
      { id: "complexity", title: "Complexity (Big-O)", star: 5, must: true, subs: ["Time complexity", "Space complexity", "Big O", "Dry run"], note: "Without Big-O and dry-running, every later topic becomes difficult." },
    ],
  },
  {
    tier: "beginner", phase: 2, title: "Arrays",
    topics: [
      { id: "arrays", title: "Arrays", to: "array-reverse", star: 5, must: true,
        lessons: [
          { id: "array-search", title: "Array · Search" },
          { id: "array-insert", title: "Array · Insert" },
          { id: "array-delete", title: "Array · Delete" },
          { id: "array-reverse", title: "Array · Reverse" },
        ],
        subs: ["Traversal", "Prefix Sum", "Sliding Window", "Two Pointer", "Binary Search", "Matrix", "Interval Problems"],
        examples: [
          { q: "Maximum Sum Subarray" }, { q: "Move Zeroes" }, { q: "Merge Intervals" },
          { q: "Rotate Array" }, { q: "Container With Most Water" }, { q: "Product Except Self" },
        ] },
      { id: "sorting", title: "Sorting", to: "sort-bubble", star: 4,
        lessons: [
          { id: "sort-bubble", title: "Bubble Sort" },
          { id: "sort-selection", title: "Selection Sort" },
          { id: "sort-insertion", title: "Insertion Sort" },
          { id: "sort-merge", title: "Merge Sort" },
          { id: "sort-quick", title: "Quick Sort" },
        ],
        subs: ["Bubble", "Selection", "Insertion", "Merge (divide & conquer)", "Quick (partition)"] },
      { id: "searching", title: "Searching", to: "search-linear", star: 4,
        lessons: [
          { id: "search-linear", title: "Linear Search" },
          { id: "search-binary", title: "Binary Search" },
        ],
        subs: ["Linear scan", "Binary Search"], examples: [{ q: "Binary Search" }] },
    ],
  },
  {
    tier: "beginner", phase: 3, title: "Strings",
    topics: [
      { id: "strings", title: "Strings", star: 4,
        subs: ["Character Frequency", "Hashing", "Sliding Window", "Palindrome", "KMP", "Rabin Karp", "Trie"],
        examples: [{ q: "Longest Substring" }, { q: "Minimum Window" }, { q: "Anagrams" }, { q: "Palindrome" }, { q: "Pattern Matching" }] },
    ],
  },
  {
    tier: "beginner", phase: 4, title: "Hashing",
    topics: [
      { id: "hashing", title: "Hashing", star: 5, must: true,
        subs: ["HashMap", "HashSet", "Frequency Count", "Prefix Sum + HashMap", "Lookup Optimization"],
        examples: [{ q: "Two Sum" }, { q: "Longest Consecutive" }, { q: "Subarray Sum = K" }, { q: "Majority Element" }, { q: "Group Anagrams" }] },
    ],
  },
  {
    tier: "intermediate", phase: 5, title: "Linked List",
    topics: [
      { id: "linked-list", title: "Linked List", to: "linked-insert", star: 5, must: true,
        lessons: [
          { id: "linked-insert", title: "Linked List · Insert" },
          { id: "linked-delete", title: "Linked List · Delete" },
          { id: "linked-search", title: "Linked List · Search" },
        ],
        subs: ["Traversal", "Reverse", "Fast Slow Pointer", "Merge", "Detect Cycle", "LRU Cache"],
        examples: [{ q: "Reverse Linked List" }, { q: "Linked List Cycle" }, { q: "Middle of the List" }] },
    ],
  },
  {
    tier: "intermediate", phase: 6, title: "Stack & Queue",
    topics: [
      { id: "stack", title: "Stack", to: "stack-push", star: 5, must: true,
        lessons: [
          { id: "stack-push", title: "Stack · Push" },
          { id: "stack-pop", title: "Stack · Pop" },
          { id: "stack-peek", title: "Stack · Peek" },
        ],
        subs: ["Valid Parentheses", "Monotonic Stack", "Next Greater Element", "Histogram"] },
      { id: "queue", title: "Queue", to: "queue-enqueue", star: 4,
        lessons: [
          { id: "queue-enqueue", title: "Queue · Enqueue" },
          { id: "queue-dequeue", title: "Queue · Dequeue" },
        ],
        subs: ["Circular Queue", "Deque", "BFS", "Sliding Window Maximum"] },
    ],
  },
  {
    tier: "intermediate", phase: 7, title: "Trees",
    topics: [
      { id: "trees", title: "Trees", star: 5, must: true,
        subs: ["Binary Tree", "DFS", "BFS", "Traversals (Pre/In/Post)", "Height", "Diameter", "LCA", "BST", "Balanced Trees"],
        examples: [{ q: "Level Order" }, { q: "Max Depth" }, { q: "Validate BST" }, { q: "Diameter of Binary Tree" }] },
    ],
  },
  {
    tier: "intermediate", phase: 8, title: "Heap",
    topics: [
      { id: "heap", title: "Heap", star: 4,
        subs: ["Max Heap", "Min Heap", "Priority Queue", "Top K", "Merge K Lists"],
        examples: [{ q: "Kth Largest Element" }, { q: "Top K Frequent Elements" }, { q: "Merge K Sorted Lists" }] },
    ],
  },
  {
    tier: "advanced", phase: 9, title: "Graph",
    topics: [
      { id: "graph", title: "Graph", to: "graph-bfs", star: 5, must: true,
        lessons: [
          { id: "graph-bfs", title: "Breadth-First Search" },
          { id: "graph-dfs", title: "Depth-First Search" },
        ],
        subs: ["Representation", "BFS", "DFS", "Topological Sort", "Union Find", "Dijkstra", "Bellman Ford", "Floyd Warshall", "MST (Prim/Kruskal)", "SCC"],
        examples: [{ q: "Number of Islands" }, { q: "Course Schedule" }, { q: "Shortest Path" }] },
    ],
  },
  {
    tier: "advanced", phase: 10, title: "Backtracking",
    topics: [
      { id: "backtracking", title: "Backtracking", to: "pattern-subsets", star: 4,
        subs: ["Permutations", "Combinations", "Sudoku", "N Queens", "Word Search"],
        examples: [{ q: "Subsets" }, { q: "Permutations" }, { q: "Generate Parentheses" }, { q: "N Queens" }] },
    ],
  },
  {
    tier: "advanced", phase: 11, title: "Dynamic Programming",
    topics: [
      { id: "dp", title: "Dynamic Programming", to: "dp-fib", star: 5, must: true,
        lessons: [
          { id: "dp-fib", title: "Fibonacci (Tabulation)" },
          { id: "dp-knapsack", title: "0/1 Knapsack" },
        ],
        subs: ["Memoization", "Tabulation", "Fibonacci", "Knapsack", "LCS", "LIS", "Coin Change", "Matrix DP", "Digit DP", "Tree DP"],
        note: "DP becomes much easier after mastering recursion.",
        examples: [{ q: "Climbing Stairs" }, { q: "Coin Change" }, { q: "Longest Common Subsequence" }] },
    ],
  },
  {
    tier: "expert", phase: 12, title: "Advanced Topics",
    topics: [
      { id: "advanced", title: "Advanced DSA", star: 3,
        subs: ["Trie", "Segment Tree", "Fenwick Tree", "Suffix Array", "Suffix Tree", "Sparse Table", "Bit Manipulation", "Math", "Geometry"] },
    ],
  },
];

// The linear "interview learning flow" (each builds on the previous).
export const FLOW = [
  "Programming", "Complexity", "Arrays", "Strings", "Hashing",
  "Linked List", "Stack", "Queue", "Trees", "Heap",
  "Graph", "Backtracking", "Dynamic Programming", "Advanced DSA",
];

// The 80/20 "most important patterns" — each links to a real pattern/lesson.
export const KEY_PATTERNS = [
  { q: "Two Pointer", to: "pattern-two-pointers" },
  { q: "Sliding Window", to: "pattern-sliding-window" },
  { q: "Prefix Sum", to: null },
  { q: "Binary Search", to: "pattern-binary-search" },
  { q: "Fast Slow Pointer", to: "pattern-fast-slow" },
  { q: "BFS", to: "graph-bfs" },
  { q: "DFS", to: "graph-dfs" },
  { q: "Backtracking", to: "pattern-subsets" },
  { q: "Dynamic Programming", to: "dp-fib" },
  { q: "Heap", to: "pattern-top-k" },
  { q: "Monotonic Stack", to: "pattern-top-k" },
  { q: "Union Find", to: "pattern-union-find" },
  { q: "Topological Sort", to: "pattern-topological" },
  { q: "Trie", to: "pattern-trie" },
];
