import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim();

const data = input.split('\n\n');

const trees = data.pop().split('\n').map(line => {
  const [area, presents] = line.split(':').map(x => x.trim());
  return {
    area,
    presents: presents.split(' '),
  }
});

let valid = 0;

for(const tree of trees) {
  const [w,h] = tree.area.split('x').map(Number);
  const area = w * h;
  const presents = tree.presents;

  const shapes = presents.reduce((present,acc)=> {
    return Number(present) + Number(acc);
  }, 0);

  if(area >= 9 * shapes) valid++
}

console.log(valid);
