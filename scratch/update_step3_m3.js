const fs = require('fs');

console.log('--- Step 3: Upgrading scratch/m3_traces.js ---');

const m3Path = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m3_traces.js';
let m3Code = fs.readFileSync(m3Path, 'utf8');

const oldStart = '    renderDpMatrix(s1, s2, dp, activeI, activeJ, isFinal, title) {';
const oldEnd = '    renderBitmaskTour(pods, mask, activePod, cost, isComplete = false) {';

const newMatrixMethods = `    renderDpMatrix(s1, s2, dp, activeI, activeJ, isFinal, title) {
        const colHeaders = ['ε', ...s2.split('')];
        const rowHeaders = ['ε', ...s1.split('')];
        const states = [];
        const values = [];

        for (let i = 0; i <= s1.length; i++) {
            const rowStates = [];
            const rowValues = [];
            for (let j = 0; j <= s2.length; j++) {
                rowValues.push(dp[i][j]);
                let st = 'normal';
                if (i === activeI && j === activeJ) {
                    st = isFinal ? 'match' : 'active';
                } else if (i <= activeI && j <= activeJ) {
                    st = 'normal';
                } else {
                    st = 'muted';
                }
                rowStates.push(st);
            }
            states.push(rowStates);
            values.push(rowValues);
        }

        return this.renderMatrixViz(rowHeaders, colHeaders, values, states);
    },

    renderMcmTable(m, s, n, activeI, activeJ, p, isFinal = false, order = '') {
        const colHeaders = [];
        const rowHeaders = [];
        for (let j = 1; j <= n; j++) colHeaders.push('A' + j);
        for (let i = 1; i <= n; i++) rowHeaders.push('A' + i);

        const states = [];
        const values = [];

        for (let i = 1; i <= n; i++) {
            const rowStates = [];
            const rowValues = [];
            for (let j = 1; j <= n; j++) {
                if (j < i) {
                    rowValues.push('-');
                    rowStates.push('muted');
                } else {
                    const val = m[i][j] === Infinity ? '∞' : m[i][j];
                    rowValues.push(val);
                    let st = 'normal';
                    if (i === activeI && j === activeJ) {
                        st = isFinal ? 'match' : 'active';
                    } else if (m[i][j] > 0 && m[i][j] !== Infinity) {
                        st = 'normal';
                    } else {
                        st = 'muted';
                    }
                    rowStates.push(st);
                }
            }
            states.push(rowStates);
            values.push(rowValues);
        }

        const tableHtml = this.renderMatrixViz(rowHeaders, colHeaders, values, states);
        return \`
            \${tableHtml}
            \${order ? \`<div style="margin-top:14px; padding:10px 16px; border-radius:8px; background:var(--ts-surface-alt); border:1px solid var(--ts-border); font-size:13px;">Optimal Matrix Parenthesization: <strong style="color:var(--ts-teal); font-family:var(--font-code);">\${order}</strong></div>\` : ''}
        \`;
    },`;

const startIdx = m3Code.indexOf(oldStart);
const endIdx = m3Code.indexOf(oldEnd);

if (startIdx !== -1 && endIdx !== -1) {
    m3Code = m3Code.substring(0, startIdx) + newMatrixMethods + '\n\n' + m3Code.substring(endIdx);
    fs.writeFileSync(m3Path, m3Code, 'utf8');
    console.log('Successfully upgraded scratch/m3_traces.js rendering methods!');
} else {
    console.error('Could not find start or end marker in m3_traces.js', { startIdx, endIdx });
}
