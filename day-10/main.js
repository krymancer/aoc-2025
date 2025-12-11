import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim().split('\n');

function parseLine(line) {
  const lightsMatch = line.match(/\[([.#]+)\]/);
  const lights = lightsMatch[1].split('').map(c => c === '#' ? 1 : 0);
  
  const buttonsMatch = line.match(/\(([0-9,]+)\)/g);
  const buttons = buttonsMatch.map(b => {
    const indices = b.slice(1, -1).split(',').map(Number);
    return indices;
  });
  
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  const joltages = joltageMatch[1].split(',').map(Number);
  
  return { lights, buttons, joltages };
}

function solveGaussianGF2(target, buttons) {
  const n = target.length;
  const m = buttons.length;
  
  let minPresses = Infinity;
  
  for (let mask = 0; mask < (1 << m); mask++) {
    const state = Array(n).fill(0);
    let presses = 0;
    
    for (let j = 0; j < m; j++) {
      if (mask & (1 << j)) {
        presses++;
        for (const light of buttons[j]) {
          state[light] ^= 1;
        }
      }
    }
    
    let valid = true;
    for (let i = 0; i < n; i++) {
      if (state[i] !== target[i]) {
        valid = false;
        break;
      }
    }
    
    if (valid && presses < minPresses) {
      minPresses = presses;
    }
  }
  
  return minPresses === Infinity ? 0 : minPresses;
}

let totalPresses = 0;

for (const line of input) {
  const { lights, buttons } = parseLine(line);
  const presses = solveGaussianGF2(lights, buttons);
  totalPresses += presses;
}

console.log(totalPresses);

function solveJoltage(target, buttons) {
  const n = target.length;
  const m = buttons.length;
  
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = Array(m + 1).fill(0);
    for (let j = 0; j < m; j++) {
      if (buttons[j].includes(i)) {
        row[j] = 1;
      }
    }
    row[m] = target[i];
    matrix.push(row);
  }
  
  for (let r = 0; r < n && r < m; r++) {
    let pivot = -1;
    for (let p = r; p < n; p++) {
      if (matrix[p][r] !== 0) {
        pivot = p;
        break;
      }
    }
    
    if (pivot === -1) continue;
    
    if (pivot !== r) {
      [matrix[r], matrix[pivot]] = [matrix[pivot], matrix[r]];
    }
    
    for (let p = r + 1; p < n; p++) {
      if (matrix[p][r] === 0) continue;
      
      const deltaNom = matrix[p][r];
      const deltaDen = matrix[r][r];
      
      for (let c = 0; c < m; c++) {
        matrix[p][c] = deltaDen * matrix[p][c] - matrix[r][c] * deltaNom;
      }
      matrix[p][m] = matrix[p][m] * deltaDen - matrix[r][m] * deltaNom;
    }
  }
  
  const maximums = buttons.map(btn => {
    return Math.min(...btn.map(idx => target[idx]));
  });
  
  let best = Infinity;
  const stack = [[n - 1, {}]];
  
  while (stack.length > 0) {
    const [row, pressed] = stack.pop();
    
    if (row < 0) {
      const total = Object.values(pressed).reduce((sum, val) => sum + val, 0);
      best = Math.min(best, total);
      continue;
    }
    
    let rowTotal = matrix[row][m];
    let needBruteForce = false;
    let paramCol = -1;
    
    for (let c = 0; c < m; c++) {
      if (matrix[row][c] !== 0) {
        if (pressed.hasOwnProperty(c)) {
          rowTotal -= matrix[row][c] * pressed[c];
        } else {
          needBruteForce = true;
          if (paramCol === -1) paramCol = c;
        }
      }
    }
    
    if (!needBruteForce) {
      if (rowTotal === 0) {
        stack.push([row - 1, pressed]);
      }
      continue;
    }
    
    const max = maximums[paramCol];
    for (let p = 0; p <= max; p++) {
      const newPressed = {...pressed};
      newPressed[paramCol] = p;
      stack.push([row, newPressed]);
    }
  }
  
  return best === Infinity ? 0 : best;
}

let totalJoltagePresses = 0;

for (const line of input) {
  const { joltages, buttons } = parseLine(line);
  const presses = solveJoltage(joltages, buttons);
  totalJoltagePresses += presses;
}

console.log(totalJoltagePresses);
