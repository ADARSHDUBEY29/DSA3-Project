const fs = require('fs');

let s = fs.readFileSync('web/algo-visualizer.js', 'utf8');

console.log('Initially:');
console.log('Escaped backticks:', (s.match(/\\`/g) || []).length);
console.log('Escaped dollar-braces:', (s.match(/\\\${/g) || []).length);

// Replace \` with `
s = s.replace(/\\`/g, '`');
// Replace \${ with ${
s = s.replace(/\\\${/g, '${');

fs.writeFileSync('web/algo-visualizer.js', s, 'utf8');

// Now check syntax
try {
    new Function(s);
    console.log('🎉🎉🎉 Syntax check PASSED: web/algo-visualizer.js is 100% syntactically valid JavaScript!');
} catch (e) {
    console.error('Syntax error still present:', e.message);
}
