import { STATUS, makeStep } from "./step.js";

function cell(value, status = STATUS.DEFAULT) { return { value, status }; }

export function dpFibonacci(input) {
  const n = Math.max(0, Math.min(input.n ?? 10, 20));
  const table = [[cell(0)]];
  const steps = [makeStep(`Compute Fibonacci numbers up to F(${n}).`, 0, { table: cloneTable(table) })];
  if (n >= 1) { table.push([cell(1)]); steps.push(makeStep(`Base cases: F(0)=0, F(1)=1.`, 1, { table: cloneTable(table) })); }
  for (let i = 2; i <= n; i++) {
    table[i - 1][0].status = STATUS.COMPARE;
    table[i - 2][0].status = STATUS.COMPARE;
    steps.push(makeStep(`F(${i}) equals F(${i - 1}) + F(${i - 2}) — each number is the sum of the two before it.`, 2, { table: cloneTable(table) }));
    const val = table[i - 1][0].value + table[i - 2][0].value;
    table.push([cell(val, STATUS.ACTIVE)]);
    steps.push(makeStep(`So F(${i}) = ${val}.`, 3, { table: cloneTable(table) }));
    table[i - 1][0].status = STATUS.DEFAULT;
    table[i - 2][0].status = STATUS.DEFAULT;
    table[i][0].status = STATUS.SORTED;
  }
  steps.push(makeStep(`Fibonacci table complete.`, 4, { table: cloneTable(table) }));
  return { kind: "dp", steps };
}

export function dpKnapsack(input) {
  const items = input.items || [
    { w: 1, v: 1 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 7 },
  ];
  const W = input.capacity ?? 7;
  const dp = Array.from({ length: items.length + 1 }, () => Array(W + 1).fill(0));
  const table = dp.map((row, r) => row.map((v) => cell(r === 0 ? v : "", r === 0 ? STATUS.SORTED : STATUS.DEFAULT)));
  const steps = [makeStep(`0/1 Knapsack: capacity ${W}, ${items.length} items.`, 0, { table: cloneTable(table) })];
  for (let i = 1; i <= items.length; i++) {
    const { w, v } = items[i - 1];
    for (let c = 0; c <= W; c++) {
      if (c < w) {
        dp[i][c] = dp[i - 1][c];
        table[i][c] = cell(dp[i][c]);
        steps.push(makeStep(`Item ${i} (w=${w}) doesn't fit at capacity ${c}; carry over ${dp[i][c]}.`, 1, { table: cloneTable(table) }));
      } else {
        const take = dp[i - 1][c - w] + v;
        const skip = dp[i - 1][c];
        table[i - 1][c].status = STATUS.COMPARE;
        if (c - w >= 0) table[i - 1][c - w].status = STATUS.COMPARE;
        table[i][c].status = STATUS.COMPARE;
        steps.push(makeStep(`At (item ${i}, cap ${c}): take ${take} vs skip ${skip}.`, 2, { table: cloneTable(table) }));
        dp[i][c] = Math.max(take, skip);
        table[i][c] = cell(dp[i][c], STATUS.ACTIVE);
        table[i - 1][c].status = STATUS.DEFAULT;
        if (c - w >= 0) table[i - 1][c - w].status = STATUS.DEFAULT;
        steps.push(makeStep(`Choose max = ${dp[i][c]}.`, 3, { table: cloneTable(table) }));
      }
      table[i][c].status = STATUS.DEFAULT;
    }
  }
  for (let c = 0; c <= W; c++) table[items.length][c].status = STATUS.SORTED;
  steps.push(makeStep(`Maximum value achievable = ${dp[items.length][W]}.`, 4, { table: cloneTable(table) }));
  return { kind: "dp", steps };
}

function cloneTable(table) {
  return table.map((row) => row.map((c) => ({ ...c })));
}
