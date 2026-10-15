const fs = require('fs');

const s = fs.readFileSync('web/algo-visualizer.js', 'utf8');
const lines = s.split('\n');

let p = 0;
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let initialP = p;
    for (let j = 0; j < l.length; j++) {
        if (l[j] === '(') p++;
        else if (l[j] === ')') p--;
    }
    if (p > 0 && initialP === 0) {
        console.log(`Paren opened at line ${i + 1}: ${l.trim()}`);
    } else if (p === 0 && initialP > 0) {
        console.log(`Paren closed at line ${i + 1}`);
    }
}
console.log('Final parens balance:', p);
