import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim().split('\n');

const devices = input.map(line => {
  const [device, outputs] = line.split(':').map(x => x.trim());

  return {
    device,
    outputs: outputs.split(" "),
  };
})

function buildGraph(devices) {
  const graph = {};

  for (const {device, outputs} of devices) {
    if (!graph[device]) {
      graph[device] = [];
    }
    
    for (const output of outputs) {
      graph[device].push(output);
    }
  }

  return graph;
}

const graph = buildGraph(devices);

const cache = new Map();

function countPaths(start, end) {
  const key = `${start},${end}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  let paths = 0;
  
  if (graph[start]) {
    for (const neighbor of graph[start]) {
      if (neighbor === end) {
        paths += 1;
      } else if (graph[neighbor]) {
        paths += countPaths(neighbor, end);
      }
    }
  }

  cache.set(key, paths);
  return paths;
}

console.log(countPaths('you', 'out'));

const startToDac = countPaths('svr', 'dac');
const startToFft = countPaths('svr', 'fft');
const dacToFft = countPaths('dac', 'fft');
const fftToDac = countPaths('fft', 'dac');
const fftToOut = countPaths('fft', 'out');
const dacToOut = countPaths('dac', 'out');

const part2 = startToDac * dacToFft * fftToOut + startToFft * fftToDac * dacToOut;
console.log(part2);