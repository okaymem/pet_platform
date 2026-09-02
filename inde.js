const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let total = 0;

rl.on('line', (data) => {
    const [a, b] = data.trim().split(/\s+/).map(Number);
    total += a + b;
});

rl.on('close', () => {
    console.log(Number(total));
});