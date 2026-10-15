const fs = require('fs');

const s = fs.readFileSync('web/algo-visualizer.js', 'utf8');
const lines = s.split('\n');

let inBacktick = false;
let startLine = 0;

for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    for (let j = 0; j < l.length; j++) {
        if (l[j] === '`') {
            if (!inBacktick) {
                inBacktick = true;
                startLine = i + 1;
            } else {
                inBacktick = false;
            }
        }
    }
}

if (inBacktick) {
    console.log('Unclosed backtick started at line:', startLine);
    console.log('Line content:', lines[startLine - 1]);
    for (let k = startLine - 1; k < Math.min(lines.length, startLine + 15); k++) {
        console.log((k + 1) + ': ' + lines[k]);
    }
} else {
    console.log('All backticks matched!');
}
