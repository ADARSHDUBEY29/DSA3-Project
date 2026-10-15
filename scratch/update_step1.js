const fs = require('fs');

console.log('--- Step 1: Upgrading build_visualizer.js ---');

const buildVisualizerPath = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/build_visualizer.js';
let buildVizCode = fs.readFileSync(buildVisualizerPath, 'utf8');

// Update renderModuleTabs inside build_visualizer.js to include Algorithm Explorer
const oldTabsMarker = `renderModuleTabs() {
        const bar = document.getElementById('algoModuleTabs');
        if (!bar) return;
        bar.innerHTML = \`
            <button class="algo-mod-tab active" data-module="m1" onclick="AlgoStudio.selectModule('m1')">
                <span>🔍</span> M1: String Algorithms
            </button>
            <button class="algo-mod-tab" data-module="m2" onclick="AlgoStudio.selectModule('m2')">
                <span>📜</span> M2: Suffix Structures
            </button>
            <button class="algo-mod-tab" data-module="m3" onclick="AlgoStudio.selectModule('m3')">
                <span>⚡</span> M3: Advanced DP
            </button>
            <button class="algo-mod-tab" data-module="m4" onclick="AlgoStudio.selectModule('m4')">
                <span>🌊</span> M4: Network Flow
            </button>
            <button class="algo-mod-tab" data-module="m5" onclick="AlgoStudio.selectModule('m5')">
                <span>🧩</span> M5: NP & Complexity
            </button>
            <button class="algo-mod-tab" data-module="m6" onclick="AlgoStudio.selectModule('m6')">
                <span>📊</span> M6: Parallel & Randomized
            </button>
        \`;
    },`;

const newTabsReplacement = `renderModuleTabs() {
        const bar = document.getElementById('algoModuleTabs');
        if (!bar) return;
        bar.innerHTML = \`
            <button class="algo-mod-tab active" data-module="m1" onclick="AlgoStudio.selectModule('m1')">
                <span>🔍</span> String Intelligence
            </button>
            <button class="algo-mod-tab" data-module="m2" onclick="AlgoStudio.selectModule('m2')">
                <span>📜</span> Document Intelligence
            </button>
            <button class="algo-mod-tab" data-module="m3" onclick="AlgoStudio.selectModule('m3')">
                <span>⚡</span> Optimization Lab
            </button>
            <button class="algo-mod-tab" data-module="m4" onclick="AlgoStudio.selectModule('m4')">
                <span>🌊</span> Network Flow
            </button>
            <button class="algo-mod-tab" data-module="m5" onclick="AlgoStudio.selectModule('m5')">
                <span>🧩</span> Complexity Lab
            </button>
            <button class="algo-mod-tab" data-module="m6" onclick="AlgoStudio.selectModule('m6')">
                <span>📊</span> Parallel & Randomized
            </button>
            <button class="algo-mod-tab" data-module="explorer" onclick="AlgoStudio.selectModule('explorer')">
                <span>🧭</span> Algorithm Explorer (28)
            </button>
        \`;
    },`;

buildVizCode = buildVizCode.replace(oldTabsMarker, newTabsReplacement);

// Update selectModule in build_visualizer.js
const oldSelectModMarker = `selectModule(modId) {
        this.currentModule = modId;
        document.querySelectorAll('.algo-mod-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.module === modId);
        });

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
    },`;

const newSelectModReplacement = `selectModule(modId) {
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

    // TravelSync ArrayVisualizer Engine
    renderArrayViz(rowNames, rows, focusCol = -1) {
        let html = '<div class="array-visualizer-container">';
        for (let r = 0; r < rows.length; r++) {
            const name = rowNames[r] || '';
            const row = rows[r] || [];
            html += '<div class="array-viz-row">';
            html += \`<div class="array-viz-label">\${name}</div>\`;
            html += '<div class="array-viz-cells">';
            for (let c = 0; c < row.length; c++) {
                const cell = row[c];
                if (!cell || cell.state === 'empty') {
                    html += '<div class="array-viz-cell cell-empty"></div>';
                } else {
                    const st = cell.state ? \`cell-\${cell.state}\` : 'cell-normal';
                    html += \`<div class="array-viz-cell \${st}" title="\${name}[\${c}]: \${cell.text}">\${cell.text}</div>\`;
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
            html += \`<th class="matrix-th">\${colHeaders[c]}</th>\`;
        }
        html += '</tr></thead><tbody>';

        for (let r = 0; r < rowHeaders.length; r++) {
            html += '<tr>';
            html += \`<th class="matrix-th" style="text-align:right; padding-right:8px;">\${rowHeaders[r]}</th>\`;
            for (let c = 0; c < colHeaders.length; c++) {
                const val = (values && values[r]) ? values[r][c] : '';
                const st = (states && states[r] && states[r][c]) ? \`cell-\${states[r][c]}\` : 'cell-normal';
                html += \`<td class="matrix-td \${st}">\${val !== undefined && val !== null ? val : ''}</td>\`;
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
        const q = (searchInput?.value || '').trim().toLowerCase();
        const modFilter = filterSelect?.value || 'all';

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

        // Group by module
        const groups = {};
        filtered.forEach(e => {
            if (!groups[e.module]) groups[e.module] = [];
            groups[e.module].push(e);
        });

        let html = '';
        Object.entries(groups).forEach(([modKey, algos]) => {
            html += \`
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:16px; font-weight:700; color:var(--ts-blue); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                        <span>📂</span> \${moduleNames[modKey] || modKey.toUpperCase()}
                        <span style="font-size:11px; padding:2px 8px; border-radius:12px; background:var(--ts-surface-alt); border:1px solid var(--ts-border); color:var(--ts-text-secondary);">\${algos.length} algorithms</span>
                    </h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(420px, 1fr)); gap:14px;">
                        \${algos.map(a => \`
                            <div class="explorer-card" style="background:var(--ts-surface); border:1px solid var(--ts-border); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                        <h4 style="font-size:14px; font-weight:700; color:var(--ts-text-primary); margin:0;">\${a.name}</h4>
                                        <span class="algo-complexity-pill" style="font-size:11px;">\${a.badge}</span>
                                    </div>
                                    <div style="font-size:12px; color:var(--ts-text-secondary); line-height:1.5; margin-bottom:12px;">
                                        \${a.problem}
                                    </div>
                                    <table style="width:100%; font-size:11.5px; border-collapse:collapse; margin-bottom:14px;">
                                        <tr>
                                            <td style="width:75px; color:var(--ts-text-secondary); font-weight:600; padding:3px 0;">Complexity:</td>
                                            <td style="color:var(--ts-teal); font-family:var(--font-code); font-weight:600; padding:3px 0;">\${a.complexity}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div style="display:flex; gap:8px; padding-top:12px; border-top:1px solid var(--ts-border);">
                                    <button class="btn-player primary" style="flex:1; justify-content:center;" onclick="AlgoStudio.runFromExplorer('\${a.id}')">
                                        ▶ Run Demo
                                    </button>
                                    <button class="btn-player" style="flex:1; justify-content:center;" onclick="AlgoStudio.openFromExplorer('\${a.id}')">
                                        Visualize
                                    </button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
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
    },`;

buildVizCode = buildVizCode.replace(oldSelectModMarker, newSelectModReplacement);

fs.writeFileSync(buildVisualizerPath, buildVizCode, 'utf8');
console.log('Successfully updated scratch/build_visualizer.js');
