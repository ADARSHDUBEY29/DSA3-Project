const fs = require('fs');

console.log('--- Cleaning scratch files to pure code without module.exports wrappers ---');

function cleanFile(filePath) {
    let s = fs.readFileSync(filePath, 'utf8');
    // Strip leading module.exports = `
    s = s.replace(/^\s*module\.exports\s*=\s*`/, '');
    // Strip trailing `;
    s = s.replace(/`\s*;\s*$/, '');
    return s;
}

const dir = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch';

// Read and clean each module
let m1 = cleanFile(dir + '/m1_traces.js');
let m2 = cleanFile(dir + '/m2_traces.js');
let m3 = cleanFile(dir + '/m3_traces.js');
let m4 = cleanFile(dir + '/m4_traces.js');
let m5 = cleanFile(dir + '/m5_traces.js');
let m6 = cleanFile(dir + '/m6_traces.js');
let helpers = cleanFile(dir + '/global_helpers.js');

// Now in m1: fix renderStringMatchFrame, renderZFrame, renderRabinKarpFrame
const m1RenderIndex = m1.indexOf('    // Rendering Helpers for Module 1');
if (m1RenderIndex !== -1) {
    const m1TracesOnly = m1.substring(0, m1RenderIndex);
    const m1NewHelpers = `    // Rendering Helpers for Module 1 (TravelSync ArrayVisualizer Engine)
    renderStringMatchFrame(text, pattern, activeI, activeJ, offset, table, status) {
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
        return vizHtml + '<div style="margin-top:14px; display:flex; gap:16px; font-size:12px; font-weight:600; color:var(--ts-text-secondary); align-items:center;">' +
            '<span>Active Z-Box Window: <strong style="color:var(--ts-amber); font-family:var(--font-code);">[L = ' + l + ', R = ' + r + ']</strong></span>' +
            '<span>Box Width: <strong>' + ((r >= l && r > 0) ? (r - l + 1) : 0) + ' characters</strong></span>' +
        '</div>';
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
        return vizHtml + '<div style="margin-top:14px; display:flex; gap:16px; font-size:12.5px; font-weight:600; align-items:center;">' +
            '<div style="padding:6px 14px; border-radius:8px; background:var(--ts-surface-alt); border:1px solid var(--ts-border);">' +
                'Pattern Hash: <strong style="color:var(--ts-blue); font-family:var(--font-code);">' + pHash + '</strong>' +
            '</div>' +
            '<div style="padding:6px 14px; border-radius:8px; background:' + (pHash === tHash ? 'rgba(20, 184, 166, 0.2)' : 'var(--ts-surface-alt)') + '; border:1px solid ' + (pHash === tHash ? 'var(--ts-teal)' : 'var(--ts-border)') + ';">' +
                'Window Hash: <strong style="color:' + (pHash === tHash ? 'var(--ts-teal)' : 'var(--ts-text-primary)') + '; font-family:var(--font-code);">' + tHash + '</strong>' +
            '</div>' +
            (status === 'match' ? '<span class="status-pill success">Exact Hash &amp; Character Match!</span>' : (status === 'spurious' ? '<span class="status-pill danger">Spurious Collision!</span>' : '<span class="status-pill neutral">Rolling Window</span>')) +
        '</div>';
    },

    renderAhoCorasickTrie(trieNodes, patterns, activeState, text, currentTextIdx, matches) {
        let streamHtml = '<div class="char-ribbon-scroll">';
        for (let i = 0; i < text.length; i++) {
            let cls = 'char-box';
            if (i === currentTextIdx) cls += ' active';
            streamHtml += '<div class="' + cls + '"><span class="char-idx">' + i + '</span><span class="char-val">' + text[i] + '</span></div>';
        }
        streamHtml += '</div>';

        return '<div class="viz-string-container">' +
            '<div class="viz-track-label">Input Text Stream [Index: ' + (currentTextIdx >= 0 ? currentTextIdx : 0) + ']:</div>' +
            streamHtml +
            '<div class="trie-automaton-view">' +
                '<div class="trie-states-grid">' +
                    trieNodes.slice(0, 12).map(n => 
                        '<div class="trie-node-card ' + (n.id === activeState ? 'trie-node-active' : '') + '">' +
                            '<div class="node-badge">State ' + n.id + '</div>' +
                            '<div class="node-char">' + (n.char === 'root' ? 'ROOT' : ("'" + n.char + "'")) + '</div>' +
                            '<div class="node-fail">fail &rarr; State ' + n.fail + '</div>' +
                            (n.output.length > 0 ? '<div class="node-output">Match: ' + n.output.join(', ') + '</div>' : '') +
                        '</div>'
                    ).join('') +
                '</div>' +
            '</div>' +
            '<div class="trie-matches-summary">' +
                '<strong>Recognized Keywords:</strong> ' + (matches.length > 0 ? matches.map(m => m.word + ' (@' + m.index + ')').join(', ') : 'Scanning text stream...') +
            '</div>' +
        '</div>';
    },
`;
    m1 = m1TracesOnly + m1NewHelpers;
}

// In m3: fix renderDpMatrix and renderMcmTable to use renderMatrixViz
const m3RenderIndex = m3.indexOf('    // Rendering Helpers for Module 3');
if (m3RenderIndex !== -1) {
    const m3TracesOnly = m3.substring(0, m3RenderIndex);
    const m3BitmaskIndex = m3.indexOf('    renderBitmaskTour(');
    const m3BitmaskPart = m3.substring(m3BitmaskIndex);
    const m3NewHelpers = `    // Rendering Helpers for Module 3 (TravelSync MatrixVisualizer Engine)
    renderDpMatrix(s1, s2, dp, activeI, activeJ, isFinal, title) {
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
        return tableHtml + (order ? ('<div style="margin-top:14px; padding:10px 16px; border-radius:8px; background:var(--ts-surface-alt); border:1px solid var(--ts-border); font-size:13px;">Optimal Matrix Parenthesization: <strong style="color:var(--ts-teal); font-family:var(--font-code);">' + order + '</strong></div>') : '');
    },
`;
    m3 = m3TracesOnly + m3NewHelpers + m3BitmaskPart;
}

// Read clean part 1 string
// Let's get part1 directly from clean_part1.js if created, or from build_visualizer up to brent
const buildVizPath = dir + '/build_visualizer.js';
const fullBuild = fs.readFileSync(buildVizPath, 'utf8');
const catalogEndMarker = '        brents_theorem: {';
const brentIdx = fullBuild.indexOf(catalogEndMarker);
const afterBrentIdx = fullBuild.indexOf('        }\n    },', brentIdx);
const catalogSection = fullBuild.substring(0, afterBrentIdx + '        }\n    },'.length).replace(/^\s*const parts = \[\];\s*parts\.push\(`/, '');

const part1Engine = `
    // Initialization
    init() {
        this.renderModuleTabs();
        this.selectModule('m1');
        this.renderExplorer();
        this._initialized = true;
    },

    // Switch active Module tab
    selectModule(modId) {
        this.currentModule = modId;
        document.querySelectorAll('.algo-mod-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.module === modId);
        });

        const panelView = document.getElementById('algoPanelView');
        const explorerView = document.getElementById('algoExplorerView');
        const chipsList = document.getElementById('algoSelectList');
        const heroBox = document.querySelector('.algo-hero-box');

        if (modId === 'explorer') {
            if (panelView) panelView.classList.add('hidden');
            if (chipsList) chipsList.classList.add('hidden');
            if (heroBox) heroBox.classList.add('hidden');
            if (explorerView) explorerView.classList.remove('hidden');
            this.renderExplorer();
            return;
        }

        if (panelView) panelView.classList.remove('hidden');
        if (chipsList) chipsList.classList.remove('hidden');
        if (heroBox) heroBox.classList.remove('hidden');
        if (explorerView) explorerView.classList.add('hidden');

        // Pick first algorithm in this module if current is not in this module
        const currentInMod = this.catalog[this.currentAlgo]?.module === modId;
        if (!currentInMod) {
            const firstAlgo = Object.values(this.catalog).find(a => a.module === modId);
            if (firstAlgo) {
                this.selectAlgo(firstAlgo.id);
            }
        } else {
            this.selectAlgo(this.currentAlgo);
        }
    },

    // Render Module Tabs bar (TravelSync Top Tabs)
    renderModuleTabs() {
        const bar = document.getElementById('algoModuleTabs');
        if (!bar) return;
        bar.innerHTML = [
            '<button class="algo-mod-tab active" data-module="m1" onclick="AlgoStudio.selectModule(\\'m1\\')"><span>🔍</span> String Intelligence</button>',
            '<button class="algo-mod-tab" data-module="m2" onclick="AlgoStudio.selectModule(\\'m2\\')"><span>📜</span> Document Intelligence</button>',
            '<button class="algo-mod-tab" data-module="m3" onclick="AlgoStudio.selectModule(\\'m3\\')"><span>⚡</span> Optimization Lab</button>',
            '<button class="algo-mod-tab" data-module="m4" onclick="AlgoStudio.selectModule(\\'m4\\')"><span>🌊</span> Network Flow</button>',
            '<button class="algo-mod-tab" data-module="m5" onclick="AlgoStudio.selectModule(\\'m5\\')"><span>🧩</span> Complexity Lab</button>',
            '<button class="algo-mod-tab" data-module="m6" onclick="AlgoStudio.selectModule(\\'m6\\')"><span>📊</span> Parallel & Randomized</button>',
            '<button class="algo-mod-tab" data-module="explorer" onclick="AlgoStudio.selectModule(\\'explorer\\')"><span>🧭</span> Algorithm Explorer (28)</button>'
        ].join('');
    },

    // Select specific algorithm to view in Lab
    selectAlgo(algoId) {
        this.pause();
        this.currentAlgo = algoId;
        const algo = this.catalog[algoId];
        if (!algo) return;

        // Render algo selector list for active module
        const listContainer = document.getElementById('algoSelectList');
        if (listContainer) {
            const modAlgos = Object.values(this.catalog).filter(a => a.module === algo.module);
            listContainer.innerHTML = modAlgos.map(a => 
                '<button class="algo-chip ' + (a.id === algoId ? 'active' : '') + '" onclick="AlgoStudio.selectAlgo(\\'' + a.id + '\\')">' +
                    '<span class="chip-name">' + a.name + '</span>' +
                    '<span class="chip-badge">' + a.badge + '</span>' +
                '</button>'
            ).join('');
        }

        // Populate Algorithm Header & Info
        const hTitle = document.getElementById('algoHeaderTitle');
        const hBadge = document.getElementById('algoHeaderBadge');
        const hProb = document.getElementById('algoProblemStatement');
        const hComp = document.getElementById('algoComplexityTag');
        if (hTitle) hTitle.textContent = algo.name;
        if (hBadge) hBadge.textContent = algo.badge;
        if (hProb) hProb.textContent = algo.problem;
        if (hComp) hComp.textContent = algo.complexity;

        // Render Input fields
        const inputContainer = document.getElementById('algoInputFields');
        if (inputContainer && algo.inputs) {
            inputContainer.innerHTML = algo.inputs.map(inp => 
                '<div class="algo-input-group">' +
                    '<label class="algo-input-label">' + inp.label + '</label>' +
                    '<input type="' + inp.type + '" id="' + inp.id + '" class="algo-input-control" value="' + inp.default + '">' +
                '</div>'
            ).join('');
        }

        // Execute algorithm to build initial frames and view
        this.execute();
    },

    // Populate with Prepared Campus Demo Data
    loadDemoData() {
        const algo = this.catalog[this.currentAlgo];
        if (!algo || !algo.demoData) return;
        Object.entries(algo.demoData).forEach(([key, val]) => {
            const el = document.getElementById(key);
            if (el) el.value = val;
        });
        this.execute();
    },

    // TravelSync ArrayVisualizer Engine
    renderArrayViz(rowNames, rows, focusCol = -1) {
        let html = '<div class="array-visualizer-container">';
        for (let r = 0; r < rows.length; r++) {
            const name = rowNames[r] || '';
            const row = rows[r] || [];
            html += '<div class="array-viz-row">';
            html += '<div class="array-viz-label">' + name + '</div>';
            html += '<div class="array-viz-cells">';
            for (let c = 0; c < row.length; c++) {
                const cell = row[c];
                if (!cell || cell.state === 'empty') {
                    html += '<div class="array-viz-cell cell-empty"></div>';
                } else {
                    const st = cell.state ? ('cell-' + cell.state) : 'cell-normal';
                    html += '<div class="array-viz-cell ' + st + '" title="' + name + '[' + c + ']: ' + cell.text + '">' + cell.text + '</div>';
                }
            }
            html += '</div></div>';
        }
        html += '</div>';
        return html;
    },

    // TravelSync MatrixVisualizer Engine
    renderMatrixViz(rowHeaders, colHeaders, values, states) {
        let html = '<div class="matrix-visualizer-container"><table class="matrix-table"><thead><tr>';
        html += '<th class="matrix-th"></th>';
        for (let c = 0; c < colHeaders.length; c++) {
            html += '<th class="matrix-th">' + colHeaders[c] + '</th>';
        }
        html += '</tr></thead><tbody>';

        for (let r = 0; r < rowHeaders.length; r++) {
            html += '<tr>';
            html += '<th class="matrix-th" style="text-align:right; padding-right:8px;">' + rowHeaders[r] + '</th>';
            for (let c = 0; c < colHeaders.length; c++) {
                const val = (values && values[r]) ? values[r][c] : '';
                const st = (states && states[r] && states[r][c]) ? ('cell-' + states[r][c]) : 'cell-normal';
                html += '<td class="matrix-td ' + st + '">' + (val !== undefined && val !== null ? val : '') + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        return html;
    },

    // TravelSync Algorithm Explorer Page Engine
    renderExplorer() {
        const container = document.getElementById('explorerGrid');
        if (!container) return;

        const searchInput = document.getElementById('explorerSearch');
        const filterSelect = document.getElementById('explorerModuleFilter');
        const q = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
        const modFilter = (filterSelect && filterSelect.value) ? filterSelect.value : 'all';

        const moduleNames = {
            m1: 'String Intelligence (M1)',
            m2: 'Document Intelligence (M2)',
            m3: 'Optimization Lab (M3)',
            m4: 'Network Flow (M4)',
            m5: 'Complexity Lab (M5)',
            m6: 'Parallel & Randomized (M6)'
        };

        const entries = Object.values(this.catalog);
        const filtered = entries.filter(e => {
            const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.problem.toLowerCase().includes(q) || e.badge.toLowerCase().includes(q);
            const matchesMod = (modFilter === 'all') || (e.module === modFilter);
            return matchesQuery && matchesMod;
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--ts-text-secondary); font-size:14px;">No algorithms matched your search filter.</div>';
            return;
        }

        const groups = {};
        filtered.forEach(e => {
            if (!groups[e.module]) groups[e.module] = [];
            groups[e.module].push(e);
        });

        let html = '';
        Object.entries(groups).forEach(([modKey, algos]) => {
            html += '<div style="margin-bottom:24px;">' +
                '<h3 style="font-size:16px; font-weight:700; color:var(--ts-blue); margin-bottom:12px; display:flex; align-items:center; gap:8px;">' +
                    '<span>📂</span> ' + (moduleNames[modKey] || modKey.toUpperCase()) +
                    '<span style="font-size:11px; padding:2px 8px; border-radius:12px; background:var(--ts-surface-alt); border:1px solid var(--ts-border); color:var(--ts-text-secondary);">' + algos.length + ' algorithms</span>' +
                '</h3>' +
                '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(420px, 1fr)); gap:14px;">' +
                    algos.map(a => 
                        '<div class="explorer-card" style="background:var(--ts-surface); border:1px solid var(--ts-border); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
                            '<div>' +
                                '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">' +
                                    '<h4 style="font-size:14px; font-weight:700; color:var(--ts-text-primary); margin:0;">' + a.name + '</h4>' +
                                    '<span class="algo-complexity-pill" style="font-size:11px;">' + a.badge + '</span>' +
                                '</div>' +
                                '<div style="font-size:12px; color:var(--ts-text-secondary); line-height:1.5; margin-bottom:12px;">' +
                                    a.problem +
                                '</div>' +
                                '<table style="width:100%; font-size:11.5px; border-collapse:collapse; margin-bottom:14px;">' +
                                    '<tr>' +
                                        '<td style="width:75px; color:var(--ts-text-secondary); font-weight:600; padding:3px 0;">Complexity:</td>' +
                                        '<td style="color:var(--ts-teal); font-family:var(--font-code); font-weight:600; padding:3px 0;">' + a.complexity + '</td>' +
                                    '</tr>' +
                                '</table>' +
                            '</div>' +
                            '<div style="display:flex; gap:8px; padding-top:12px; border-top:1px solid var(--ts-border);">' +
                                '<button class="btn-player primary" style="flex:1; justify-content:center;" onclick="AlgoStudio.runFromExplorer(\\'' + a.id + '\\')">▶ Run Demo</button>' +
                                '<button class="btn-player" style="flex:1; justify-content:center;" onclick="AlgoStudio.openFromExplorer(\\'' + a.id + '\\')">Visualize</button>' +
                            '</div>' +
                        '</div>'
                    ).join('') +
                '</div>' +
            '</div>';
        });

        container.innerHTML = html;
    },

    filterExplorer() {
        this.renderExplorer();
    },

    runFromExplorer(algoId) {
        const algo = this.catalog[algoId];
        if (!algo) return;
        this.selectModule(algo.module);
        this.selectAlgo(algoId);
        this.loadDemoData();
        this.play();
    },

    openFromExplorer(algoId) {
        const algo = this.catalog[algoId];
        if (!algo) return;
        this.selectModule(algo.module);
        this.selectAlgo(algoId);
    },

    // Execution dispatcher
    execute() {
        this.pause();
        const algoId = this.currentAlgo;
        let traceData = null;

        try {
            switch (algoId) {
                // M1: String
                case 'kmp': traceData = this.traceKMP(); break;
                case 'z_algo': traceData = this.traceZAlgorithm(); break;
                case 'rabin_karp': traceData = this.traceRabinKarp(); break;
                case 'aho_corasick': traceData = this.traceAhoCorasick(); break;

                // M2: Suffix
                case 'suffix_array': traceData = this.traceSuffixArray(); break;
                case 'sais': traceData = this.traceSAIS(); break;
                case 'kasai_lcp': traceData = this.traceKasaiLCP(); break;
                case 'suffix_automaton': traceData = this.traceSuffixAutomaton(); break;

                // M3: DP
                case 'levenshtein': traceData = this.traceLevenshtein(); break;
                case 'damerau_levenshtein': traceData = this.traceDamerauLevenshtein(); break;
                case 'matrix_chain': traceData = this.traceMatrixChain(); break;
                case 'bitmask_dp': traceData = this.traceBitmaskDP(); break;
                case 'optimal_bst': traceData = this.traceOptimalBST(); break;

                // M4: Flow
                case 'bipartite_matching': traceData = this.traceBipartiteMatching(); break;
                case 'ford_fulkerson': traceData = this.traceFordFulkerson(); break;
                case 'edmonds_karp': traceData = this.traceEdmondsKarp(); break;
                case 'dinic': traceData = this.traceDinic(); break;
                case 'konig': traceData = this.traceKonig(); break;

                // M5: NP & Approximations
                case 'dpll_sat': traceData = this.traceDPLL(); break;
                case 'reductions_3sat_clique': traceData = this.traceReductions3SatClique(); break;
                case 'reductions_pipeline': traceData = this.traceReductionsPipeline(); break;
                case 'vertex_cover_approx': traceData = this.traceVertexCoverApprox(); break;

                // M6: Randomized & Parallel
                case 'randomized_quicksort': traceData = this.traceRandomizedQuickSort(); break;
                case 'reservoir_sampling': traceData = this.traceReservoirSampling(); break;
                case 'miller_rabin': traceData = this.traceMillerRabin(); break;
                case 'blelloch_scan': traceData = this.traceBlellochScan(); break;
                case 'parallel_reduce': traceData = this.traceParallelReduce(); break;
                case 'brents_theorem': traceData = this.traceBrentsTheorem(); break;

                default:
                    traceData = { frames: [{ explanation: 'Algorithm ready.', render: () => '<div>Ready</div>' }], result: 'Complete', metrics: {} };
            }
        } catch (e) {
            console.error('Trace error for ' + algoId + ':', e);
            traceData = {
                frames: [{ explanation: 'Error during trace: ' + e.message, render: () => '<div style="color:#ef4444; padding:20px;">Error: ' + e.message + '</div>' }],
                result: 'Trace Error',
                metrics: { comparisons: 0, steps: 0, info: e.message }
            };
        }

        this.frames = traceData.frames || [];
        this.currentFrameIndex = 0;

        // Render Results Card
        const rOut = document.getElementById('algoResultOutput');
        const rComp = document.getElementById('algoResultComplexity');
        const rOps = document.getElementById('algoResultComparisons');
        const rIter = document.getElementById('algoResultIterations');
        const rInfo = document.getElementById('algoResultInfo');

        if (rOut) rOut.textContent = traceData.result || 'Executed successfully.';
        if (rComp) rComp.textContent = this.catalog[algoId]?.complexity || 'O(N)';
        if (rOps) rOps.textContent = traceData.metrics?.comparisons ?? traceData.metrics?.steps ?? this.frames.length;
        if (rIter) rIter.textContent = this.frames.length + ' Frame States';
        if (rInfo) rInfo.textContent = traceData.metrics?.info || ('Algorithm finished with ' + this.frames.length + ' step-by-step state frames.');

        // Render first frame
        this.renderCurrentFrame();
    },

    // Playback controller
    renderCurrentFrame() {
        if (!this.frames || this.frames.length === 0) return;
        const frame = this.frames[this.currentFrameIndex];
        if (!frame) return;

        const total = this.frames.length;
        const current = this.currentFrameIndex + 1;
        const counter = document.getElementById('algoStepCounter');
        if (counter) counter.textContent = 'Step ' + current + ' of ' + total;

        const pct = (current / total) * 100;
        const prog = document.getElementById('algoStepProgress');
        if (prog) prog.style.width = pct + '%';

        const exp = document.getElementById('algoStepExplanation');
        if (exp) exp.innerHTML = frame.explanation || 'Stepping through algorithm execution.';

        const canvas = document.getElementById('algoCanvas');
        if (canvas) {
            canvas.innerHTML = typeof frame.render === 'function' ? frame.render() : frame.render;
        }

        const btn = document.getElementById('btnPlayerPlay');
        if (btn) btn.textContent = this.isPlaying ? '⏸ Pause' : '▶ Run';
    },

    play() {
        if (this.isPlaying) {
            this.pause();
            return;
        }
        if (this.currentFrameIndex >= this.frames.length - 1) {
            this.currentFrameIndex = 0;
        }
        this.isPlaying = true;
        const btn = document.getElementById('btnPlayerPlay');
        if (btn) btn.textContent = '⏸ Pause';

        const delay = this.baseDelayMs / this.speed;
        this.playInterval = setInterval(() => {
            if (this.currentFrameIndex < this.frames.length - 1) {
                this.currentFrameIndex++;
                this.renderCurrentFrame();
            } else {
                this.pause();
            }
        }, delay);
    },

    pause() {
        this.isPlaying = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
        const btn = document.getElementById('btnPlayerPlay');
        if (btn) btn.textContent = '▶ Run';
    },

    next() {
        this.pause();
        if (this.currentFrameIndex < this.frames.length - 1) {
            this.currentFrameIndex++;
            this.renderCurrentFrame();
        }
    },

    previous() {
        this.pause();
        if (this.currentFrameIndex > 0) {
            this.currentFrameIndex--;
            this.renderCurrentFrame();
        }
    },

    reset() {
        this.pause();
        this.currentFrameIndex = 0;
        this.renderCurrentFrame();
    },

    setSpeed(spd) {
        this.speed = parseFloat(spd) || 1.0;
        const spdDisp = document.getElementById('algoSpeedDisplay');
        if (spdDisp) spdDisp.textContent = this.speed + 'x';
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    },
`;

const fullVisualizer = [catalogSection, part1Engine, m1, m2, m3, m4, m5, m6, helpers].join('\n');
fs.writeFileSync('web/algo-visualizer.js', fullVisualizer, 'utf8');

console.log('Successfully written clean web/algo-visualizer.js! Size:', fullVisualizer.length, 'bytes');

// Test that web/algo-visualizer.js is valid Javascript syntax
try {
    new Function(fullVisualizer);
    console.log('🎉 Syntax check PASSED: web/algo-visualizer.js is 100% syntactically valid JavaScript!');
} catch (e) {
    console.error('Syntax check FAILED on web/algo-visualizer.js:', e.message);
    process.exit(1);
}
