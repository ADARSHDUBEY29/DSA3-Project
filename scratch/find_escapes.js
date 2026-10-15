const fs = require('fs');

const s = fs.readFileSync('web/algo-visualizer.js', 'utf8');
const lines = s.split('\n');

lines.forEach((l, idx) => {
    if (l.includes("\\\\'")) {
        console.log(`Line ${idx + 1}: ${l.trim()}`);
    }
});
