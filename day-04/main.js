import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n").map(x => x.trim());
const grid = input.map(line => line.split(''));

function checkNeighbors(grid, x, y) {
    const directions = [
        [-1, -1], [-1, 0], [-1,  1],
        [ 0, -1], /*x,y*/  [ 0,  1],
        [ 1, -1], [ 1, 0], [ 1,  1]
    ];

    const neighbors = [];

    for(let [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if(nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
            if(grid[nx][ny] === '@') {
                neighbors.push([nx, ny]);
            }
        }
    }

    return neighbors;
}

function countNeighbors (grid, x, y) {
    return checkNeighbors(grid, x, y).length;
}

const allNeighbors = [];
for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
        if(grid[i][j] !== '@') continue;
        const count = countNeighbors(grid, i, j);
        allNeighbors.push({ position: [i, j], count });
    }
}

const forkliftAccessible = allNeighbors.filter(cell => cell.count < 4);

console.log(forkliftAccessible.length);