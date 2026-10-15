const fs = require('fs');

console.log('--- Creating robust part1.js and assemble_all.js ---');

const part1Path = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/part1.js';
const buildVizPath = 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/build_visualizer.js';

// Read original build_visualizer.js up to line 456 (end of catalog)
const full = fs.readFileSync(buildVizPath, 'utf8');

// Find catalog start and end
const catalogEndMarker = '        brents_theorem: {';
const brentIdx = full.indexOf(catalogEndMarker);
const afterBrentIdx = full.indexOf('        }\n    },', brentIdx);
const catalogSection = full.substring(0, afterBrentIdx + '        }\n    },'.length);

// Clean Part 1 content with AlgoStudio and TravelSync engines
const part1Content = catalogSection + `

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

// Save part 1
fs.writeFileSync('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/clean_part1.js', 'module.exports = ' + JSON.stringify(part1Content) + ';', 'utf8');

// Also create the assemble script
const m1 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m1_traces.js');
const m2 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m2_traces.js');
const m3 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m3_traces.js');
const m4 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m4_traces.js');
const m5 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m5_traces.js');
const m6 = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/m6_traces.js');
const helpers = require('C:/Users/Adarsh/.gemini/antigravity-ide/brain/3fcfd10b-fa0c-4094-8d8f-e3d84cfd6ea3/scratch/global_helpers.js');

const fullCompiled = [part1Content, m1, m2, m3, m4, m5, m6, helpers].join('\n');
fs.writeFileSync('web/algo-visualizer.js', fullCompiled, 'utf8');

console.log('Successfully recompiled web/algo-visualizer.js! Size:', fullCompiled.length, 'bytes');
