const fs = require('fs');

console.log('--- Step 2: Upgrading scratch/m1_traces.js ---');

const m1Path = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m1_traces.js';
let m1Code = fs.readFileSync(m1Path, 'utf8');

const oldRenderMethodsMarker = '    renderStringMatchFrame(text, pattern, activeI, activeJ, offset, table, status) {';
const endMarker = '    renderAhoCorasickTrie(trieNodes, patterns, activeState, text, currentTextIdx, matches) {';

const newRenderMethods = `    renderStringMatchFrame(text, pattern, activeI, activeJ, offset, table, status) {
        const n = text.length;
        const m = pattern.length;
        const align = Math.max(0, offset);

        // Row 1: Index
        const indexRow = [];
        for (let i = 0; i < n; i++) {
            indexRow.push({ text: String(i), state: 'muted' });
        }

        // Row 2: Text
        const textRow = [];
        for (let i = 0; i < n; i++) {
            let st = 'normal';
            if (i === activeI) {
                st = (status === 'match' || status === 'found') ? 'match' : (status === 'mismatch' ? 'mismatch' : 'active');
            } else if (i >= align && i < align + activeJ) {
                st = 'done';
            }
            textRow.push({ text: text[i], state: st });
        }

        // Row 3: Pattern (shifted by empty slots!)
        const patternRow = [];
        for (let k = 0; k < align; k++) {
            patternRow.push(null);
        }
        for (let k = 0; k < m; k++) {
            let st = 'normal';
            if (k === activeJ && activeI >= 0) {
                st = (status === 'match' || status === 'found') ? 'match' : (status === 'mismatch' ? 'mismatch' : 'active');
            } else if (k < activeJ) {
                st = 'done';
            }
            patternRow.push({ text: pattern[k], state: st });
        }

        const rowNames = ['Index', 'Text', 'Pattern'];
        const rows = [indexRow, textRow, patternRow];

        if (table && table.length > 0) {
            const patCopy = [];
            const auxRow = [];
            for (let k = 0; k < m; k++) {
                patCopy.push({ text: pattern[k], state: 'normal' });
                auxRow.push({ text: String(table[k]), state: (k === activeJ ? 'highlight' : 'muted') });
            }
            rowNames.push('Pattern');
            rows.push(patCopy);
            rowNames.push('π Table (LPS)');
            rows.push(auxRow);
        }

        return this.renderArrayViz(rowNames, rows, activeI >= 0 ? activeI : align);
    },

    renderZFrame(text, z, activeIdx, l, r) {
        const n = text.length;
        const indexRow = [];
        const textRow = [];
        const zRow = [];

        for (let i = 0; i < n; i++) {
            indexRow.push({ text: String(i), state: 'muted' });
            let tSt = 'normal';
            if (i === activeIdx) tSt = 'active';
            else if (i >= l && i <= r && r > 0) tSt = 'window';
            textRow.push({ text: text[i], state: tSt });

            let zSt = 'normal';
            if (i === activeIdx) zSt = 'highlight';
            else if (z[i] > 0) zSt = 'done';
            zRow.push({ text: String(z[i]), state: zSt });
        }

        const vizHtml = this.renderArrayViz(['Index', 'Text', 'Z[i] Array'], [indexRow, textRow, zRow], activeIdx);
        return \`
            \${vizHtml}
            <div style="margin-top:14px; display:flex; gap:16px; font-size:12px; font-weight:600; color:var(--ts-text-secondary); align-items:center;">
                <span>Active Z-Box Window: <strong style="color:var(--ts-amber); font-family:var(--font-code);">[L = \${l}, R = \${r}]</strong></span>
                <span>Box Width: <strong>\${(r >= l && r > 0) ? (r - l + 1) : 0} characters</strong></span>
            </div>
        \`;
    },

    renderRabinKarpFrame(text, pattern, windowStart, pHash, tHash, status) {
        const n = text.length;
        const m = pattern.length;
        const indexRow = [];
        const textRow = [];
        const patternRow = [];

        for (let i = 0; i < n; i++) {
            indexRow.push({ text: String(i), state: 'muted' });
            let st = 'normal';
            if (i >= windowStart && i < windowStart + m) {
                st = (status === 'match') ? 'match' : (status === 'spurious' ? 'mismatch' : 'window');
            }
            textRow.push({ text: text[i], state: st });
        }

        for (let k = 0; k < windowStart; k++) {
            patternRow.push(null);
        }
        for (let k = 0; k < m; k++) {
            patternRow.push({ text: pattern[k], state: status === 'match' ? 'match' : 'normal' });
        }

        const vizHtml = this.renderArrayViz(['Index', 'Text', 'Pattern'], [indexRow, textRow, patternRow], windowStart);
        return \`
            \${vizHtml}
            <div style="margin-top:14px; display:flex; gap:16px; font-size:12.5px; font-weight:600; align-items:center;">
                <div style="padding:6px 14px; border-radius:8px; background:var(--ts-surface-alt); border:1px solid var(--ts-border);">
                    Pattern Hash: <strong style="color:var(--ts-blue); font-family:var(--font-code);">\${pHash}</strong>
                </div>
                <div style="padding:6px 14px; border-radius:8px; background:\${pHash === tHash ? 'rgba(20, 184, 166, 0.2)' : 'var(--ts-surface-alt)'}; border:1px solid \${pHash === tHash ? 'var(--ts-teal)' : 'var(--ts-border)'};">
                    Window Hash: <strong style="color:\${pHash === tHash ? 'var(--ts-teal)' : 'var(--ts-text-primary)'}; font-family:var(--font-code);">\${tHash}</strong>
                </div>
                \${status === 'match' ? '<span class="status-pill success">Exact Hash &amp; Character Match!</span>' : (status === 'spurious' ? '<span class="status-pill danger">Spurious Collision!</span>' : '<span class="status-pill neutral">Rolling Window</span>')}
            </div>
        \`;
    },`;

const startIdx = m1Code.indexOf(oldRenderMethodsMarker);
const endIdx = m1Code.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    m1Code = m1Code.substring(0, startIdx) + newRenderMethods + '\n\n' + m1Code.substring(endIdx);
    fs.writeFileSync(m1Path, m1Code, 'utf8');
    console.log('Successfully upgraded scratch/m1_traces.js rendering methods!');
} else {
    console.error('Could not find start or end marker in m1_traces.js', { startIdx, endIdx });
}
