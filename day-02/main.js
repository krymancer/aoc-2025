import fs from "fs";

let max = 0n;

const ranges = fs.
readFileSync("input.txt", "utf-8")
.trim()
.split(",")
.map(range => {
  const [start, end] = range.split("-");
  const maxCandidate = BigInt(end);
  if (maxCandidate > max) max = maxCandidate;
  return [BigInt(start), maxCandidate];
});

const L = Math.ceil(max.toString().length/2) * 2;

const seqLens = Array.from(
  {length: L/2},
  (_, i) => i + 1
);

const invIDs = seqLens.flatMap(S => {
  const minS = BigInt(10) ** BigInt(S - 1);
  const maxS = (BigInt(10) ** BigInt(S)) - 1n;

  const seqs = [];

  for(let s = minS; s <= maxS; s++) seqs.push(s);

  return seqs.map(s => BigInt(`${s}${s}`));
});

const sum = invIDs.reduce((acc, val) => {
  const inRange = ranges.some(([start,end]) => {
    return val >= start && val <= end;
  });

  return inRange ? acc + val : acc;
}, 0n);

console.log(`${sum}`);
