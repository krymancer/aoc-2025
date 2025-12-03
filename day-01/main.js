import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim();
const lines = input.split("\n");

function rotate(value, rotation, direction) {
    const raw = value + (rotation * direction);
    return ( (raw % 100) + 100 ) % 100;
}

let dial = 50;
let password = 0;

for(const line of lines) {
 const direction = line[0] === "L" ? -1 : 1;
 const rotation = parseInt(line.slice(1));
 
 const value = rotate(dial, rotation, direction);

 if(value === 0) ++password;
 dial = value;
}

console.log(password);


dial = 50;
password = 0;

for(const line of lines) {
 const rotation = parseInt(line.slice(1));
 const direction = line[0] === "L" ? -1 : 1;

 let clicks;
 if(dial === 0) {
  clicks = 100;
 } else if(direction === 1) {
  clicks = (100 - dial);
 } else {
  clicks = dial;
 }

 let passes = 0;

 if( rotation >= clicks ) {
  passes = 1;
  const remaining = rotation - clicks;
  passes += Math.floor(remaining / 100);
 }

 password += passes;
 dial = rotate(dial, rotation, direction);
}

console.log(password);