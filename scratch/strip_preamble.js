const fs = require('fs');

let s = fs.readFileSync('web/algo-visualizer.js', 'utf8');

const marker = '// =============================================================================\n// EduTrack // Interactive Algorithm Lab';
const idx = s.indexOf(marker);
if (idx !== -1) {
    s = s.substring(idx);
    fs.writeFileSync('web/algo-visualizer.js', s, 'utf8');
    console.log('Successfully stripped header preamble from web/algo-visualizer.js!');
} else {
    console.error('Could not find marker in algo-visualizer.js');
}

// Now test syntax
try {
    new Function(s);
    console.log('🎉🎉🎉 Syntax check PASSED: web/algo-visualizer.js is 100% syntactically valid JavaScript!');
} catch (e) {
    console.error('Syntax error still present:', e.message);
}
