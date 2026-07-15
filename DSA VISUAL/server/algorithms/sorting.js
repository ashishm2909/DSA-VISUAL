import { STATUS, itemsFromArray, cloneItems, mark, makeStep } from "./step.js";

export function bubbleSort(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Start Bubble Sort on ${arr.length} elements.`, 0, { items: cloneItems(items) })];
  let n = items.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      mark(items, [j, j + 1], STATUS.COMPARE);
      steps.push(makeStep(`Compare neighbours ${arr[j]} and ${arr[j + 1]}. If the left one is larger they are out of order.`, 1, { items: cloneItems(items) }));
      if (arr[j] > arr[j + 1]) {
        mark(items, [j, j + 1], STATUS.SWAP);
        steps.push(makeStep(`${arr[j]} > ${arr[j + 1]}, so swap them to bubble the larger value right.`, 2, { items: cloneItems(items) }));
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        items[j].value = arr[j]; items[j + 1].value = arr[j + 1];
        swapped = true;
      }
      mark(items, [j, j + 1], STATUS.DEFAULT);
    }
    mark(items, n - 1 - i, STATUS.SORTED);
    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++) mark(items, k, STATUS.SORTED);
      steps.push(makeStep(`No swaps this pass — array is sorted.`, 3, { items: cloneItems(items) }));
      break;
    }
  }
  for (let k = 0; k < items.length; k++) mark(items, k, STATUS.SORTED);
  steps.push(makeStep(`Bubble Sort complete.`, 4, { items: cloneItems(items) }));
  return { kind: "sorting", steps };
}

export function selectionSort(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Start Selection Sort.`, 0, { items: cloneItems(items) })];
  for (let i = 0; i < items.length - 1; i++) {
    let min = i;
    mark(items, i, STATUS.ACTIVE);
    steps.push(makeStep(`Assume minimum is at index ${i}.`, 1, { items: cloneItems(items) }));
    for (let j = i + 1; j < items.length; j++) {
      mark(items, [j, min], STATUS.COMPARE);
      steps.push(makeStep(`Compare ${arr[j]} with current min ${arr[min]}.`, 2, { items: cloneItems(items) }));
      if (arr[j] < arr[min]) min = j;
      mark(items, [j, min], STATUS.DEFAULT);
    }
    if (min !== i) {
      mark(items, [i, min], STATUS.SWAP);
      steps.push(makeStep(`Swap min ${arr[min]} into index ${i}.`, 3, { items: cloneItems(items) }));
      [arr[i], arr[min]] = [arr[min], arr[i]];
      items[i].value = arr[i]; items[min].value = arr[min];
    }
    mark(items, i, STATUS.SORTED);
  }
  mark(items, items.length - 1, STATUS.SORTED);
  steps.push(makeStep(`Selection Sort complete.`, 4, { items: cloneItems(items) }));
  return { kind: "sorting", steps };
}

export function insertionSort(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Start Insertion Sort.`, 0, { items: cloneItems(items) })];
  for (let i = 1; i < items.length; i++) {
    const key = arr[i];
    mark(items, i, STATUS.ACTIVE);
    steps.push(makeStep(`Take ${key} to insert into the sorted portion.`, 1, { items: cloneItems(items) }));
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      mark(items, [j, j + 1], STATUS.SWAP);
      steps.push(makeStep(`${arr[j]} > ${key}, shift it right.`, 2, { items: cloneItems(items) }));
      arr[j + 1] = arr[j];
      items[j + 1].value = arr[j + 1];
      mark(items, [j, j + 1], STATUS.DEFAULT);
      j--;
    }
    arr[j + 1] = key;
    items[j + 1].value = key;
    mark(items, j + 1, STATUS.SORTED);
    steps.push(makeStep(`Insert ${key} at position ${j + 1}.`, 3, { items: cloneItems(items) }));
  }
  for (let k = 0; k < items.length; k++) mark(items, k, STATUS.SORTED);
  steps.push(makeStep(`Insertion Sort complete.`, 4, { items: cloneItems(items) }));
  return { kind: "sorting", steps };
}

export function mergeSort(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Start Merge Sort.`, 0, { items: cloneItems(items) })];
  const a = arr.slice();
  function merge(lo, mid, hi) {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      mark(items, k, STATUS.SWAP);
      steps.push(makeStep(`Merge: choose min(${left[i]}, ${right[j]}).`, 1, { items: cloneItems(items) }));
      if (left[i] <= right[j]) { a[k] = left[i++]; } else { a[k] = right[j++]; }
      items[k].value = a[k];
      mark(items, k, STATUS.DEFAULT);
      k++;
    }
    while (i < left.length) { a[k] = left[i++]; items[k].value = a[k]; k++; }
    while (j < right.length) { a[k] = right[j++]; items[k].value = a[k]; k++; }
  }
  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    steps.push(makeStep(`Split range [${lo}..${hi}] at ${mid}.`, 2, { items: cloneItems(items) }));
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }
  sort(0, a.length - 1);
  for (let k = 0; k < items.length; k++) mark(items, k, STATUS.SORTED);
  steps.push(makeStep(`Merge Sort complete.`, 3, { items: cloneItems(items) }));
  return { kind: "sorting", steps };
}

export function quickSort(input) {
  const arr = input.array || [];
  const items = itemsFromArray(arr);
  const steps = [makeStep(`Start Quick Sort.`, 0, { items: cloneItems(items) })];
  const a = arr.slice();
  function partition(lo, hi) {
    const pivot = a[hi];
    mark(items, hi, STATUS.PIVOT);
    steps.push(makeStep(`Pivot = ${pivot} (at index ${hi}).`, 1, { items: cloneItems(items) }));
    let i = lo;
    for (let j = lo; j < hi; j++) {
      mark(items, [j, hi], STATUS.COMPARE);
      steps.push(makeStep(`Compare ${a[j]} with pivot ${pivot}.`, 2, { items: cloneItems(items) }));
      if (a[j] < pivot) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          items[i].value = a[i]; items[j].value = a[j];
          mark(items, [i, j], STATUS.SWAP);
          steps.push(makeStep(`${a[j]} < pivot, swap into position ${i}.`, 3, { items: cloneItems(items) }));
        }
        i++;
      }
      mark(items, [j, hi], STATUS.DEFAULT);
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    items[i].value = a[i]; items[hi].value = a[hi];
    mark(items, i, STATUS.SORTED);
    steps.push(makeStep(`Place pivot at its final index ${i}.`, 4, { items: cloneItems(items) }));
    return i;
  }
  function sort(lo, hi) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }
  sort(0, a.length - 1);
  for (let k = 0; k < items.length; k++) mark(items, k, STATUS.SORTED);
  steps.push(makeStep(`Quick Sort complete.`, 5, { items: cloneItems(items) }));
  return { kind: "sorting", steps };
}
