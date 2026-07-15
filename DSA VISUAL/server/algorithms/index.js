import * as structures from "./structures.js";
import * as sorting from "./sorting.js";
import * as searching from "./searching.js";
import * as graph from "./graph.js";
import * as dp from "./dp.js";

// Maps a lesson id -> generator function(input) => { kind, steps }.
export const registry = {
  "array-search": structures.arraySearch,
  "array-insert": structures.arrayInsert,
  "array-delete": structures.arrayDelete,
  "array-reverse": structures.arrayReverse,

  "stack-push": structures.stackPush,
  "stack-pop": structures.stackPop,
  "stack-peek": structures.stackPeek,

  "queue-enqueue": structures.queueEnqueue,
  "queue-dequeue": structures.queueDequeue,

  "linked-insert": structures.linkedInsert,
  "linked-delete": structures.linkedDelete,
  "linked-search": structures.linkedSearch,

  "sort-bubble": sorting.bubbleSort,
  "sort-selection": sorting.selectionSort,
  "sort-insertion": sorting.insertionSort,
  "sort-merge": sorting.mergeSort,
  "sort-quick": sorting.quickSort,

  "search-linear": searching.linearSearch,
  "search-binary": searching.binarySearch,

  "graph-bfs": graph.graphBFS,
  "graph-dfs": graph.graphDFS,

  "dp-fib": dp.dpFibonacci,
  "dp-knapsack": dp.dpKnapsack,
};

export function runLesson(lessonId, input) {
  const gen = registry[lessonId];
  if (!gen) throw new Error(`Unknown lesson: ${lessonId}`);
  return gen(input || {});
}
