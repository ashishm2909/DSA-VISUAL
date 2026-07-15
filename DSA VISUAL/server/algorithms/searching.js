import { STATUS, itemsFromArray, cloneItems, mark, makeStep } from "./step.js";

export function linearSearch(input) {
  const arr = input.array || [];
  const target = input.target;
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Linear search for ${target} from left to right.`, 0, { items: cloneItems(items) })];
  for (let i = 0; i < items.length; i++) {
    mark(items, i, STATUS.COMPARE);
    steps.push(makeStep(`Check index ${i} = ${arr[i]}.`, 1, { items: cloneItems(items) }));
    if (arr[i] === target) {
      mark(items, i, STATUS.FOUND);
      steps.push(makeStep(`Found ${target} at index ${i}.`, 2, { items: cloneItems(items) }));
      return { kind: "searching", steps };
    }
    mark(items, i, STATUS.VISITED);
  }
  steps.push(makeStep(`${target} not found.`, 3, { items: cloneItems(items) }));
  return { kind: "searching", steps };
}

export function binarySearch(input) {
  const arr = input.array || [];
  const target = input.target;
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Binary search for ${target} in a sorted array by repeatedly halving the search range.`, 0, { items: cloneItems(items) })];
  let lo = 0, hi = items.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    mark(items, [lo, hi], STATUS.LEFT);
    mark(items, mid, STATUS.COMPARE);
    steps.push(makeStep(`Look at the middle index ${mid}, whose value is ${arr[mid]} (current range ${lo}..${hi}).`, 1, { items: cloneItems(items) }));
    if (arr[mid] === target) {
      mark(items, mid, STATUS.FOUND);
      steps.push(makeStep(`Found ${target} at index ${mid}.`, 2, { items: cloneItems(items) }));
      return { kind: "searching", steps };
    }
    if (arr[mid] < target) { lo = mid + 1; steps.push(makeStep(`${arr[mid]} < ${target}, search right half.`, 3, { items: cloneItems(items) })); }
    else { hi = mid - 1; steps.push(makeStep(`${arr[mid]} > ${target}, search left half.`, 3, { items: cloneItems(items) })); }
    for (let k = lo; k <= hi; k++) mark(items, k, STATUS.DEFAULT);
  }
  steps.push(makeStep(`${target} not found.`, 4, { items: cloneItems(items) }));
  return { kind: "searching", steps };
}
