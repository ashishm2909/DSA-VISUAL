import { STATUS, itemsFromArray, cloneItems, mark, makeStep } from "./step.js";

// ---------- ARRAY ----------
export function arraySearch(input) {
  const arr = input.array || [];
  const target = input.target;
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Scan the array from left to right to find the first occurrence of ${target}.`, 0, { items: cloneItems(items) })];
  for (let i = 0; i < items.length; i++) {
    mark(items, i, STATUS.COMPARE);
    steps.push(makeStep(`Compare the value at index ${i} (which is ${arr[i]}) against our target ${target}.`, 1, { items: cloneItems(items) }));
    if (arr[i] === target) {
      mark(items, i, STATUS.FOUND);
      steps.push(makeStep(`Match! ${target} is found at index ${i}.`, 2, { items: cloneItems(items) }));
      return { kind: "array", steps };
    }
    mark(items, i, STATUS.DEFAULT);
  }
  steps.push(makeStep(`${target} was not found — we checked every index.`, 3, { items: cloneItems(items) }));
  return { kind: "array", steps };
}

export function arrayInsert(input) {
  const arr = input.array || [];
  const index = Math.max(0, Math.min(arr.length, input.index ?? 0));
  const value = input.value;
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Insert ${value} at index ${index}.`, 0, { items: cloneItems(items) })];
  for (let i = arr.length - 1; i >= index; i--) {
    mark(items, i, STATUS.SWAP);
    steps.push(makeStep(`Shift element at index ${i} to ${i + 1}.`, 1, { items: cloneItems(items) }));
    mark(items, i, STATUS.DEFAULT);
  }
  items.splice(index, 0, { value, status: STATUS.ACTIVE });
  steps.push(makeStep(`Place ${value} into index ${index}.`, 2, { items: cloneItems(items) }));
  return { kind: "array", steps };
}

export function arrayDelete(input) {
  const arr = input.array || [];
  const index = input.index ?? 0;
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Delete element at index ${index}.`, 0, { items: cloneItems(items) })];
  if (index < 0 || index >= items.length) {
    steps.push(makeStep(`Index ${index} is out of bounds.`, 1, { items: cloneItems(items) }));
    return { kind: "array", steps };
  }
  mark(items, index, STATUS.SWAP);
  steps.push(makeStep(`Remove ${arr[index]} from index ${index}.`, 1, { items: cloneItems(items) }));
  items.splice(index, 1);
  for (let i = index; i < items.length; i++) {
    mark(items, i, STATUS.SWAP);
    steps.push(makeStep(`Shift element from index ${i + 1} to ${i}.`, 2, { items: cloneItems(items) }));
    mark(items, i, STATUS.DEFAULT);
  }
  steps.push(makeStep(`Element deleted. Array size is now ${items.length}.`, 3, { items: cloneItems(items) }));
  return { kind: "array", steps };
}

export function arrayReverse(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Reverse the array in place.`, 0, { items: cloneItems(items) })];
  let l = 0, r = items.length - 1;
  while (l < r) {
    mark(items, [l, r], STATUS.SWAP);
    steps.push(makeStep(`Swap index ${l} and ${r}.`, 1, { items: cloneItems(items) }));
    const tmp = items[l].value; items[l].value = items[r].value; items[r].value = tmp;
    mark(items, [l, r], STATUS.DEFAULT);
    l++; r--;
  }
  steps.push(makeStep(`Array reversed.`, 2, { items: cloneItems(items) }));
  return { kind: "array", steps };
}

// ---------- STACK ----------
export function stackPush(input) {
  const arr = input.array || [];
  const value = input.value;
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Add ${value} on top of the stack (Last-In-First-Out).`, 0, { items: cloneItems(items), top: items.length - 1 })];
  items.push({ value, status: STATUS.ACTIVE });
  steps.push(makeStep(`${value} added on top.`, 1, { items: cloneItems(items), top: items.length - 1 }));
  return { kind: "stack", steps };
}

export function stackPop(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Pop from the stack.`, 0, { items: cloneItems(items), top: items.length - 1 })];
  if (items.length === 0) {
    steps.push(makeStep(`Stack is empty (underflow).`, 1, { items: cloneItems(items), top: -1 }));
    return { kind: "stack", steps };
  }
  mark(items, items.length - 1, STATUS.SWAP);
  steps.push(makeStep(`Remove top element ${arr[arr.length - 1]}.`, 1, { items: cloneItems(items), top: items.length - 1 }));
  items.pop();
  steps.push(makeStep(`Pop complete.`, 2, { items: cloneItems(items), top: items.length - 1 }));
  return { kind: "stack", steps };
}

export function stackPeek(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Peek at the top of the stack.`, 0, { items: cloneItems(items), top: items.length - 1 })];
  if (items.length === 0) {
    steps.push(makeStep(`Stack is empty.`, 1, { items: cloneItems(items), top: -1 }));
    return { kind: "stack", steps };
  }
  mark(items, items.length - 1, STATUS.FOUND);
  steps.push(makeStep(`Top element is ${arr[arr.length - 1]}.`, 1, { items: cloneItems(items), top: items.length - 1 }));
  return { kind: "stack", steps };
}

// ---------- QUEUE ----------
export function queueEnqueue(input) {
  const arr = input.array || [];
  const value = input.value;
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Enqueue ${value} into the queue.`, 0, { items: cloneItems(items), front: 0, rear: items.length - 1 })];
  items.push({ value, status: STATUS.ACTIVE });
  steps.push(makeStep(`${value} added at the rear.`, 1, { items: cloneItems(items), front: 0, rear: items.length - 1 }));
  return { kind: "queue", steps };
}

export function queueDequeue(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Dequeue from the queue.`, 0, { items: cloneItems(items), front: 0, rear: items.length - 1 })];
  if (items.length === 0) {
    steps.push(makeStep(`Queue is empty (underflow).`, 1, { items: cloneItems(items), front: -1, rear: -1 }));
    return { kind: "queue", steps };
  }
  mark(items, 0, STATUS.SWAP);
  steps.push(makeStep(`Remove front element ${arr[0]}.`, 1, { items: cloneItems(items), front: 0, rear: items.length - 1 }));
  items.shift();
  steps.push(makeStep(`Dequeue complete.`, 2, { items: cloneItems(items), front: 0, rear: items.length - 1 }));
  return { kind: "queue", steps };
}

// ---------- LINKED LIST ----------
export function linkedInsert(input) {
  const arr = input.array || [];
  const index = Math.max(0, Math.min(arr.length, input.index ?? 0));
  const value = input.value;
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Insert node ${value} at position ${index}.`, 0, { items: cloneItems(items) })];
  for (let i = 0; i < index && i < items.length; i++) {
    mark(items, i, STATUS.CURRENT);
    steps.push(makeStep(`Traverse to position ${i}.`, 1, { items: cloneItems(items) }));
    mark(items, i, STATUS.DEFAULT);
  }
  items.splice(index, 0, { value, status: STATUS.ACTIVE });
  steps.push(makeStep(`Link new node ${value} into position ${index}.`, 2, { items: cloneItems(items) }));
  return { kind: "linkedlist", steps };
}

export function linkedDelete(input) {
  const arr = input.array || [];
  const index = input.index ?? 0;
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Delete node at position ${index}.`, 0, { items: cloneItems(items) })];
  if (index < 0 || index >= items.length) {
    steps.push(makeStep(`Position ${index} is out of bounds.`, 1, { items: cloneItems(items) }));
    return { kind: "linkedlist", steps };
  }
  for (let i = 0; i < index; i++) {
    mark(items, i, STATUS.CURRENT);
    steps.push(makeStep(`Traverse to position ${i}.`, 1, { items: cloneItems(items) }));
    mark(items, i, STATUS.DEFAULT);
  }
  mark(items, index, STATUS.SWAP);
  steps.push(makeStep(`Unlink node ${arr[index]} at position ${index}.`, 2, { items: cloneItems(items) }));
  items.splice(index, 1);
  steps.push(makeStep(`Node deleted.`, 3, { items: cloneItems(items) }));
  return { kind: "linkedlist", steps };
}

export function linkedSearch(input) {
  const arr = input.array || [];
  const target = input.target;
  const items = itemsFromArray(arr, STATUS.DEFAULT);
  const steps = [makeStep(`Search for ${target} in the linked list.`, 0, { items: cloneItems(items) })];
  for (let i = 0; i < items.length; i++) {
    mark(items, i, STATUS.COMPARE);
    steps.push(makeStep(`Compare node ${i} (value ${arr[i]}) with ${target}.`, 1, { items: cloneItems(items) }));
    if (arr[i] === target) {
      mark(items, i, STATUS.FOUND);
      steps.push(makeStep(`Found ${target} at position ${i}.`, 2, { items: cloneItems(items) }));
      return { kind: "linkedlist", steps };
    }
    mark(items, i, STATUS.DEFAULT);
  }
  steps.push(makeStep(`${target} not found in the list.`, 3, { items: cloneItems(items) }));
  return { kind: "linkedlist", steps };
}
