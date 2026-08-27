# DSA Visual

DSA Visual is an interactive learning platform for understanding data structures
and algorithms through animation, pseudocode, and state changes. Instead of only
reading a finished implementation, learners can watch each operation happen and
connect the code to the result on screen.

## Why Use This Project?

- **Makes abstract ideas visible:** Arrays, linked lists, stacks, queues, graphs,
  sorting, searching, and dynamic programming are shown as changing states.
- **Explains the reasoning:** Every animation step includes an explanation and a
  matching pseudocode highlight.
- **Supports active learning:** Change the input values, run the operation again,
  pause playback, step forward, or reset the lesson.
- **Builds interview confidence:** The pattern library connects common strategies
  to frequently asked coding problems.
- **Useful at different skill levels:** Beginners can learn the fundamentals,
  while experienced learners can compare algorithms and review patterns quickly.

## What You Can Learn

### Data Structures

Practice array search, insertion, deletion, and reversal, as well as Stack, Queue,
and Linked List operations.

### Algorithms

Explore Bubble, Selection, Insertion, Merge, and Quick Sort; Linear and Binary
Search; BFS and DFS; Fibonacci tabulation; and 0/1 Knapsack.

### Interview Patterns

Review 17 reusable approaches, including Sliding Window, Two Pointers, Fast and
Slow Pointers, Merge Intervals, Cyclic Sort, Tree BFS/DFS, Backtracking, Modified
Binary Search, Top K Elements, Topological Sort, Union Find, and Trie.

## How To Use It

1. Start the application by following the setup instructions in
   [README_DEVELOPMENT.md](README_DEVELOPMENT.md).
2. Open the frontend in a browser and choose a lesson from the lesson map.
3. Read the displayed pseudocode and explanation before running an operation.
4. Enter or edit input data where the lesson allows it.
5. Use Play, Pause, Next Step, Previous Step, Reset, and the playback speed control
   to inspect the algorithm.
6. Compare the highlighted pseudocode with the visual state after each step.

## Who Is It For?

- Students learning data structures and algorithms for the first time
- Developers revising fundamentals before technical interviews
- Instructors looking for a visual classroom demonstration tool
- Self-learners who want to understand algorithm behavior, not memorize code

## Project Value

DSA Visual turns an algorithm into a sequence of observable decisions. This helps
learners understand control flow, data movement, comparisons, and intermediate
states. That understanding transfers to writing code, debugging solutions, and
choosing an appropriate algorithm for a problem.

## Technology At A Glance

- React 18, Vite, and React Router for the frontend
- Node.js and Express for the API and algorithm step generators
- Three.js with React Three Fiber for interactive 3D graph visualization
- A step-based architecture that keeps algorithm logic separate from rendering

For installation, architecture, API details, and development instructions, see
[README_DEVELOPMENT.md](README_DEVELOPMENT.md).
