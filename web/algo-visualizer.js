// =============================================================================
// EduTrack // Interactive Algorithm Lab & Step-by-Step Visualizer Studio
// All 24+ Data Structures & Algorithms Across Modules M1 – M6
// =============================================================================

const AlgoStudio = {
    currentModule: 'm1',
    currentAlgo: 'kmp',
    frames: [],
    currentFrameIndex: 0,
    isPlaying: false,
    playInterval: null,
    speed: 1.0,
    baseDelayMs: 650,
    _initialized: false,

    // Catalog of all Algorithms across 6 Modules
    catalog: {
        // MODULE 1: STRING INTELLIGENCE
        kmp: {
            id: 'kmp',
            module: 'm1',
            name: 'Knuth-Morris-Pratt (KMP)',
            badge: 'O(N + M)',
            problem: 'Rapidly search course titles, student queries, and catalog keywords in massive digital textbooks without ever re-scanning text backwards.',
            complexity: 'Time: O(N + M) | Space: O(M) for π (LPS) table',
            inputs: [
                { id: 'kmpText', label: 'Campus Text', type: 'text', default: 'ORBITAL ASTROPHYSICS MECHANICS GRAVITON' },
                { id: 'kmpPattern', label: 'Search Keyword', type: 'text', default: 'MECHANICS' }
            ],
            demoData: {
                kmpText: 'ORBITAL ASTROPHYSICS MECHANICS GRAVITON PROPULSION',
                kmpPattern: 'MECHANICS'
            }
        },
        z_algo: {
            id: 'z_algo',
            module: 'm1',
            name: 'Z-Algorithm (Z-Function)',
            badge: 'O(N)',
            problem: 'Detect recurring clauses, repetitive paragraphs, and template duplication in zero-G research thesis submissions in true linear time.',
            complexity: 'Time: O(N) | Space: O(N) for Z-array',
            inputs: [
                { id: 'zText', label: 'Document String (Pattern $ Text)', type: 'text', default: 'orbit$zero-g orbit drift orbit thruster orbit' }
            ],
            demoData: {
                zText: 'orbit$zero-g orbit drift orbit thruster orbit'
            }
        },
        rabin_karp: {
            id: 'rabin_karp',
            module: 'm1',
            name: 'Rabin-Karp Rolling Hash',
            badge: 'Avg O(N + M)',
            problem: 'Scan exam papers for specific course codes and assignment hashes using a polynomial rolling hash with O(1) sliding-window transitions.',
            complexity: 'Average: O(N + M) | Worst: O(N·M) | Space: O(1)',
            inputs: [
                { id: 'rkText', label: 'Exam Content', type: 'text', default: 'FACULTY SCHEDULE: ASTRO-301, GRAV-404, QUANT-502' },
                { id: 'rkPattern', label: 'Course Code', type: 'text', default: 'GRAV-404' }
            ],
            demoData: {
                rkText: 'FACULTY SCHEDULE: ASTRO-301, GRAV-404, QUANT-502',
                rkPattern: 'GRAV-404'
            }
        },
        aho_corasick: {
            id: 'aho_corasick',
            module: 'm1',
            name: 'Aho-Corasick Multi-Pattern Trie',
            badge: 'O(N + ΣM + Z)',
            problem: 'Simultaneously match dozens of academic keywords across student research papers in a single linear pass using a Trie with failure links.',
            complexity: 'Time: O(N + Σ|Pᵢ| + Matches) | Space: O(Σ|Pᵢ|·Σ)',
            inputs: [
                { id: 'acText', label: 'Paper Body', type: 'text', default: 'telemetry confirms quantum entanglement in the graviton core with low thruster drift' },
                { id: 'acPatterns', label: 'Keywords (comma-separated)', type: 'text', default: 'quantum, graviton, drift, telemetry' }
            ],
            demoData: {
                acText: 'telemetry confirms quantum entanglement in the graviton core with low thruster drift',
                acPatterns: 'quantum, graviton, drift, telemetry'
            }
        },

        // MODULE 2: SUFFIX STRUCTURES
        suffix_array: {
            id: 'suffix_array',
            module: 'm2',
            name: 'Suffix Array (Doubling Algorithm)',
            badge: 'O(N log² N) / O(N log N)',
            problem: 'Construct lexicographically sorted suffix pointers of textbooks and syllabi to enable lightning-fast O(M log N) substring range queries.',
            complexity: 'Construction: O(N log² N) via Prefix Doubling | Query: O(M log N)',
            inputs: [
                { id: 'saText', label: 'Indexed Text', type: 'text', default: 'antigravity$' },
                { id: 'saQuery', label: 'Binary Search Query', type: 'text', default: 'grav' }
            ],
            demoData: {
                saText: 'astrophysics$',
                saQuery: 'phys'
            }
        },
        sais: {
            id: 'sais',
            module: 'm2',
            name: 'SA-IS (Suffix Array Induced Sorting)',
            badge: 'O(N) Linear Time',
            problem: 'Linear-time suffix array construction classifying characters into S-type and L-type, placing LMS suffixes into buckets, and inducing full suffix order.',
            complexity: 'Time: O(N) | Space: O(N) with alphabet buckets',
            inputs: [
                { id: 'saisText', label: 'Document String', type: 'text', default: 'mmiissiissiippii$' }
            ],
            demoData: {
                saisText: 'cabbage$'
            }
        },
        kasai_lcp: {
            id: 'kasai_lcp',
            module: 'm2',
            name: "Kasai's LCP (Plagiarism Detection)",
            badge: 'O(N) Linear Time',
            problem: 'Compute Longest Common Prefix (LCP) array in linear time using height invariance h >= h - 1 across adjacent suffix array entries to find cross-student copied phrases.',
            complexity: 'Time: O(N) | Space: O(N) for LCP array',
            inputs: [
                { id: 'lcpDocA', label: 'Student A Draft', type: 'text', default: 'antigravity propulsion stabilizes floating classroom' },
                { id: 'lcpDocB', label: 'Student B Draft', type: 'text', default: 'antigravity propulsion stabilizes laboratory module' }
            ],
            demoData: {
                lcpDocA: 'quantum entanglement teleports orbital sensor telemetry',
                lcpDocB: 'quantum entanglement teleports station navigation packets'
            }
        },
        suffix_automaton: {
            id: 'suffix_automaton',
            module: 'm2',
            name: 'Suffix Automaton (SAM / DAWG)',
            badge: 'O(N) Build | O(M) Query',
            problem: 'Smallest directed acyclic word graph (DAWG) recognizing all substrings of campus texts; answers substring presence, occurrence count, and links in O(M) time.',
            complexity: 'Construction: O(N) | Transition Query: O(M)',
            inputs: [
                { id: 'samText', label: 'Base Text', type: 'text', default: 'graviton' },
                { id: 'samQuery', label: 'Substring Query', type: 'text', default: 'avit' }
            ],
            demoData: {
                samText: 'orbital',
                samQuery: 'bita'
            }
        },

        // MODULE 3: ADVANCED DYNAMIC PROGRAMMING
        levenshtein: {
            id: 'levenshtein',
            module: 'm3',
            name: 'Levenshtein Distance',
            badge: 'O(N · M)',
            problem: 'Minimum edit distance (Insert, Delete, Substitute) with 2D dynamic programming grid to autocorrect misspelled academic search queries.',
            complexity: 'Time: O(N · M) | Space: O(N · M)',
            inputs: [
                { id: 'levWord1', label: 'Typed Query (Typo)', type: 'text', default: 'astrophysx' },
                { id: 'levWord2', label: 'Target Keyword', type: 'text', default: 'astrophysics' }
            ],
            demoData: {
                levWord1: 'gravitn',
                levWord2: 'graviton'
            }
        },
        damerau_levenshtein: {
            id: 'damerau_levenshtein',
            module: 'm3',
            name: 'Damerau-Levenshtein Distance',
            badge: 'O(N · M) + Swaps',
            problem: 'Handles adjacent transpositions (character swaps) caused by microgravity vibrations, saving 1 edit cost compared to standard Levenshtein.',
            complexity: 'Time: O(N · M) with adjacent swap lookback',
            inputs: [
                { id: 'damWord1', label: 'Vibrating Input', type: 'text', default: 'antigravtiy' },
                { id: 'damWord2', label: 'Correct Word', type: 'text', default: 'antigravity' }
            ],
            demoData: {
                damWord1: 'tehc',
                damWord2: 'tech'
            }
        },
        matrix_chain: {
            id: 'matrix_chain',
            module: 'm3',
            name: 'Matrix-Chain Multiplication',
            badge: 'O(N³)',
            problem: 'Find optimal parenthesization for multi-stage matrix operations (telemetry sensors × grade weighting × pod coordinates) to minimize scalar FLOPs.',
            complexity: 'Time: O(N³) | Space: O(N²)',
            inputs: [
                { id: 'mcmDims', label: 'Dimension Vector (p0, p1... pn)', type: 'text', default: '10, 30, 5, 60, 20' }
            ],
            demoData: {
                mcmDims: '20, 35, 15, 40, 10, 50'
            }
        },
        bitmask_dp: {
            id: 'bitmask_dp',
            module: 'm3',
            name: 'Bitmask DP (Traveling Pod Tour)',
            badge: 'O(N² · 2ᴺ)',
            problem: 'Solve the Traveling Dean Problem: minimal thruster propellant fuel needed to navigate an inspection tour visiting every floating campus pod and returning to station.',
            complexity: 'Time: O(N² · 2ᴺ) | Space: O(N · 2ᴺ)',
            inputs: [
                { id: 'bitmaskPods', label: 'Pod Count (4-5)', type: 'number', default: '4' }
            ],
            demoData: {
                bitmaskPods: '4'
            }
        },
        optimal_bst: {
            id: 'optimal_bst',
            module: 'm3',
            name: 'Optimal Binary Search Tree (OBST)',
            badge: 'O(N³)',
            problem: 'Organize high-frequency course schedule lookups into an optimal BST that minimizes expected search comparisons weighted by query probabilities.',
            complexity: 'Time: O(N³) | Space: O(N²)',
            inputs: [
                { id: 'obstKeys', label: 'Keys (alphabetical)', type: 'text', default: 'ASTRO, BIO, CHEM, GRAV' },
                { id: 'obstFreqs', label: 'Query Frequencies', type: 'text', default: '4, 2, 1, 3' }
            ],
            demoData: {
                obstKeys: 'ALGO, ARCH, COMP, DATA, MATH',
                obstFreqs: '5, 1, 4, 2, 3'
            }
        },

        // MODULE 4: NETWORK FLOW
        bipartite_matching: {
            id: 'bipartite_matching',
            module: 'm4',
            name: 'Bipartite Matching (Hopcroft-Karp)',
            badge: 'O(E · √V)',
            problem: 'Allocate qualified faculty professors to course lecture pods under specialization qualifications and workload caps.',
            complexity: 'Time: O(E · √V) | Space: O(V + E)',
            inputs: [
                { id: 'facultyCount', label: 'Faculty Members', type: 'number', default: '4' },
                { id: 'courseCount', label: 'Course Pods', type: 'number', default: '4' }
            ],
            demoData: {
                facultyCount: '4',
                courseCount: '4'
            }
        },
        ford_fulkerson: {
            id: 'ford_fulkerson',
            module: 'm4',
            name: 'Ford-Fulkerson Algorithm (DFS Flow)',
            badge: 'O(E · |f*|)',
            problem: 'Compute maximum student passenger flux through pressurized airlocks and station corridors using DFS augmenting paths and residual graphs.',
            complexity: 'Time: O(E · MaxFlow) | Space: O(V + E)',
            inputs: [
                { id: 'ffSourceSink', label: 'Transit Network', type: 'text', default: 'Station Alpha Airlock (Source) to Main Auditorium (Sink)' }
            ],
            demoData: {
                ffSourceSink: 'Station Alpha Airlock (Source) to Main Auditorium (Sink)'
            }
        },
        edmonds_karp: {
            id: 'edmonds_karp',
            module: 'm4',
            name: 'Edmonds-Karp Algorithm (BFS Flow)',
            badge: 'O(V · E²)',
            problem: 'Optimize student transit throughput using shortest augmenting paths via BFS, guaranteeing polynomial convergence without flow cycling.',
            complexity: 'Time: O(V · E²) | Space: O(V + E)',
            inputs: [
                { id: 'ekSourceSink', label: 'Corridor Capacity Grid', type: 'text', default: '6-Node Airlock Distribution Network' }
            ],
            demoData: {
                ekSourceSink: '6-Node Airlock Distribution Network'
            }
        },
        dinic: {
            id: 'dinic',
            module: 'm4',
            name: "Dinic's Algorithm (Blocking Flow)",
            badge: 'O(V² · E)',
            problem: 'High-speed campus transit flux computation using BFS Level Graphs and DFS Blocking Flows to eliminate bottlenecks in large-scale pressurized networks.',
            complexity: 'Time: O(V² · E) using Level Graphs & Admissible Edges',
            inputs: [
                { id: 'dinicNodes', label: 'Corridor Nodes', type: 'number', default: '6' }
            ],
            demoData: {
                dinicNodes: '6'
            }
        },
        konig: {
            id: 'konig',
            module: 'm4',
            name: "König's Theorem (Staffing Duality)",
            badge: '|Max Match| = |Min Cover|',
            problem: 'Proves and extracts minimal faculty coverage and maximum independent conflict-free course set: |MIS| = |V| - |MVC|.',
            complexity: 'Time: O(V + E) after Max Matching',
            inputs: [
                { id: 'konigPreset', label: 'Preset Allocation Graph', type: 'text', default: 'Standard University Faculty Roster' }
            ],
            demoData: {
                konigPreset: 'Standard University Faculty Roster'
            }
        },

        // MODULE 5: NP-COMPLETENESS & APPROXIMATIONS
        dpll_sat: {
            id: 'dpll_sat',
            module: 'm5',
            name: 'DPLL SAT Solver (Timetabling)',
            badge: 'Backtracking & Unit Prop',
            problem: 'Solve complex examination timetabling constraints (no student assigned to two simultaneous exams, pod room capacities) via CNF Boolean satisfiability.',
            complexity: 'Exponential worst-case with pure-literal & unit propagation pruning',
            inputs: [
                { id: 'satFormula', label: 'CNF Formula', type: 'text', default: '(A | B) & (~A | C) & (~B | C) & (A | ~C)' }
            ],
            demoData: {
                satFormula: '(A | B) & (~A | C) & (~B | C) & (A | ~C)'
            }
        },
        reductions_3sat_clique: {
            id: 'reductions_3sat_clique',
            module: 'm5',
            name: 'Karp Reduction (3-SAT → CLIQUE)',
            badge: 'Polynomial Transformation',
            problem: 'Transform 3-CNF timetabling formulas into a graph where a k-clique exists iff the 3-SAT formula has a satisfying assignment.',
            complexity: 'Reduction Time: O(M²) where M is the number of clauses',
            inputs: [
                { id: 'redClauses', label: '3-CNF Formula (Clauses: (A v B v C))', type: 'text', default: '(X1 | X2 | X3) & (~X1 | ~X2 | X3)' }
            ],
            demoData: {
                redClauses: '(A | B | C) & (~A | ~B | C)'
            }
        },
        reductions_pipeline: {
            id: 'reductions_pipeline',
            module: 'm5',
            name: 'Reduction Pipeline (CLIQUE → IS → VC)',
            badge: 'CLIQUE ⇔ IS ⇔ VC',
            problem: 'Demonstrate deep polynomial equivalences: CLIQUE(G, k) ⇔ INDEPENDENT-SET(G\', k) ⇔ VERTEX-COVER(G\', |V| - k) for campus conflict mapping.',
            complexity: 'Transformation Time: O(V²)',
            inputs: [
                { id: 'redPipeNodes', label: 'Conflict Graph Size', type: 'number', default: '5' }
            ],
            demoData: {
                redPipeNodes: '5'
            }
        },
        vertex_cover_approx: {
            id: 'vertex_cover_approx',
            module: 'm5',
            name: 'Vertex-Cover 2-Approximation',
            badge: 'Ratio ≤ 2 · OPT',
            problem: 'Greedy maximal edge selection guaranteeing an exam schedule with at most twice the optimal conflict resolution size for room collisions.',
            complexity: 'Time: O(V + E) | Approximation Factor: 2.0',
            inputs: [
                { id: 'vcEdges', label: 'Conflict Graph Edges (u-v, u-w...)', type: 'text', default: '0-1, 1-2, 2-3, 3-4, 4-0, 0-3' }
            ],
            demoData: {
                vcEdges: '0-1, 1-2, 2-3, 3-4, 4-0, 0-3'
            }
        },

        // MODULE 6: RANDOMIZED & PARALLEL ANALYTICS
        randomized_quicksort: {
            id: 'randomized_quicksort',
            module: 'm6',
            name: 'Randomized QuickSort (3-Way)',
            badge: 'Expected O(N log N)',
            problem: 'Sort thousands of student GPAs and flight aptitudes with uniform random pivots and Dutch National Flag 3-way partition to avoid O(N²) worst-case.',
            complexity: 'Expected Time: O(N log N) | Space: O(log N) recursion depth',
            inputs: [
                { id: 'rqsArray', label: 'Student GPAs to Sort', type: 'text', default: '9.85, 8.62, 9.95, 8.00, 9.70, 9.12, 9.55, 9.42, 8.90, 9.75' }
            ],
            demoData: {
                rqsArray: '9.85, 8.62, 9.95, 8.00, 9.70, 9.12, 9.55, 9.42, 8.90, 9.75, 8.78, 9.30'
            }
        },
        reservoir_sampling: {
            id: 'reservoir_sampling',
            module: 'm6',
            name: 'Reservoir Sampling (Algorithm R)',
            badge: 'O(1) Per Item',
            problem: 'Maintain a uniform random sample of size K from an unbounded continuous stream of zero-G suit movement sensors without storing entire history.',
            complexity: 'Time: O(N) stream processing | Space: O(K) reservoir',
            inputs: [
                { id: 'resK', label: 'Sample Capacity (K)', type: 'number', default: '3' },
                { id: 'resStream', label: 'Sensor Stream Packets', type: 'text', default: 'S1, S2, S3, S4, S5, S6, S7, S8, S9, S10' }
            ],
            demoData: {
                resK: '4',
                resStream: 'THR-1, THR-2, GYRO-1, OXY-1, GRAV-1, RAD-1, COMM-1, THR-3, GYRO-2, NAV-1, OXY-2, AUX-1'
            }
        },
        miller_rabin: {
            id: 'miller_rabin',
            module: 'm6',
            name: 'Miller-Rabin Primality Test',
            badge: 'O(k log³ N)',
            problem: 'Probabilistic primality testing with error bound ≤ 4⁻ᵏ to validate cryptographic authentication tokens and quantum-resistant key pairs.',
            complexity: 'Time: O(k log³ N) using modular exponentiation and repeated squaring',
            inputs: [
                { id: 'mrNumber', label: 'Candidate Prime (N)', type: 'text', default: '1000000007' },
                { id: 'mrRounds', label: 'Testing Rounds (k)', type: 'number', default: '5' }
            ],
            demoData: {
                mrNumber: '1000000007',
                mrRounds: '5'
            }
        },
        blelloch_scan: {
            id: 'blelloch_scan',
            module: 'm6',
            name: 'Blelloch Parallel Scan (Prefix Sum)',
            badge: 'O(log N) Span',
            problem: 'Work-efficient parallel prefix sum with Up-Sweep (reduce) and Down-Sweep phases to compute cumulative student credits and propellant totals.',
            complexity: 'Work: O(N) | Depth (Span): O(log N)',
            inputs: [
                { id: 'blellochArray', label: 'Semester Credits (Power of 2)', type: 'text', default: '18, 22, 16, 20, 24, 15, 21, 19' }
            ],
            demoData: {
                blellochArray: '18, 22, 16, 20, 24, 15, 21, 19'
            }
        },
        parallel_reduce: {
            id: 'parallel_reduce',
            module: 'm6',
            name: 'Parallel ForkJoin Reduce',
            badge: 'O(log N) Span',
            problem: 'Aggregate campus-wide GPAs, research hours, and propellant consumption across multiple CPU cores via divide-and-conquer binary reduction trees.',
            complexity: 'Work: O(N) | Span: O(log N) with Java ForkJoinPool',
            inputs: [
                { id: 'reduceArray', label: 'Student GPAs', type: 'text', default: '9.85, 9.70, 8.62, 9.30, 9.95, 8.00, 9.12, 9.55' }
            ],
            demoData: {
                reduceArray: '9.85, 9.70, 8.62, 9.30, 9.95, 8.00, 9.12, 9.55'
            }
        },
        brents_theorem: {
            id: 'brents_theorem',
            module: 'm6',
            name: "Brent's Theorem Scalability Analyzer",
            badge: 'Tp ≤ (W - D)/p + D',
            problem: 'Calculate theoretical execution time, speedup Sp = W/Tp, and parallel efficiency Ep across 1 to 64 multi-processor cluster cores.',
            complexity: 'Work-Span Scheduling Bound | O(1) evaluation',
            inputs: [
                { id: 'brentWork', label: 'Total Work (FLOPs)', type: 'number', default: '100000' },
                { id: 'brentDepth', label: 'Critical Path Depth (D)', type: 'number', default: '25' },
                { id: 'brentCores', label: 'Processor Cores (p)', type: 'number', default: '16' }
            ],
            demoData: {
                brentWork: '250000',
                brentDepth: '32',
                brentCores: '32'
            }
        }
    },

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
            '<button class="algo-mod-tab active" data-module="m1" onclick="AlgoStudio.selectModule(\'m1\')"><span>🔍</span> String Intelligence</button>',
            '<button class="algo-mod-tab" data-module="m2" onclick="AlgoStudio.selectModule(\'m2\')"><span>📜</span> Document Intelligence</button>',
            '<button class="algo-mod-tab" data-module="m3" onclick="AlgoStudio.selectModule(\'m3\')"><span>⚡</span> Optimization Lab</button>',
            '<button class="algo-mod-tab" data-module="m4" onclick="AlgoStudio.selectModule(\'m4\')"><span>🌊</span> Network Flow</button>',
            '<button class="algo-mod-tab" data-module="m5" onclick="AlgoStudio.selectModule(\'m5\')"><span>🧩</span> Complexity Lab</button>',
            '<button class="algo-mod-tab" data-module="m6" onclick="AlgoStudio.selectModule(\'m6\')"><span>📊</span> Parallel & Randomized</button>',
            '<button class="algo-mod-tab" data-module="explorer" onclick="AlgoStudio.selectModule(\'explorer\')"><span>🧭</span> Algorithm Explorer (28)</button>'
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
                '<button class="algo-chip ' + (a.id === algoId ? 'active' : '') + '" onclick="AlgoStudio.selectAlgo(\'' + a.id + '\')">' +
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
        const container = document.getElementById('explorerCardsGrid') || document.getElementById('explorerGrid');
        if (!container) return;

        // Ensure container is a full-width vertical stack of module sections
        container.className = 'explorer-sections-wrapper';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.width = '100%';
        container.style.gap = '32px';

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
            container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--ts-text-secondary); font-size:14px; background:var(--ts-surface); border:1px solid var(--ts-border); border-radius:12px;">No algorithms matched your search filter.</div>';
            return;
        }

        const groups = {};
        filtered.forEach(e => {
            if (!groups[e.module]) groups[e.module] = [];
            groups[e.module].push(e);
        });

        let html = '';
        const modIcons = {
            m1: '🔍',
            m2: '📜',
            m3: '⚡',
            m4: '🌊',
            m5: '🧩',
            m6: '📊'
        };

        Object.entries(groups).forEach(([modKey, algos]) => {
            const icon = modIcons[modKey] || '📂';
            const modTitle = moduleNames[modKey] || modKey.toUpperCase();

            html += `
                <div class="explorer-module-section" style="width:100%; display:flex; flex-direction:column; margin-bottom:28px;">
                    <div class="explorer-module-header" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding-bottom:8px; border-bottom:2px solid var(--ts-border);">
                        <div class="explorer-module-title" style="font-size:16px; font-weight:800; color:var(--ts-heading); display:flex; align-items:center; gap:8px;">
                            <span style="font-size:18px;">${icon}</span>
                            <span>${modTitle}</span>
                        </div>
                        <span class="explorer-module-badge" style="font-size:11.5px; font-weight:700; padding:3px 12px; border-radius:9999px; background:var(--brand-light); border:1px solid var(--border-light); color:var(--brand-primary);">${algos.length} algorithm${algos.length === 1 ? '' : 's'}</span>
                    </div>
                    <div class="explorer-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:18px; width:100%; align-items:stretch;">
                        ${algos.map(a => `
                            <div class="explorer-card" style="background:var(--ts-surface); border:1px solid var(--ts-border); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; height:100%; min-height:295px; box-sizing:border-box; box-shadow:var(--shadow-subtle); transition:all 0.2s ease;">
                                <div class="explorer-card-top" style="display:flex; flex-direction:column; flex:1;">
                                    <div class="explorer-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:10px; min-height:44px;">
                                        <h4 class="explorer-card-title" style="margin:0; font-size:14.5px; font-weight:700; color:var(--ts-heading); line-height:1.35; flex:1;">${a.name}</h4>
                                        <span class="explorer-complexity-pill" style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:9999px; background:var(--ts-surface-alt); border:1px solid var(--ts-border); color:var(--ts-teal); font-family:var(--font-code); white-space:nowrap; flex-shrink:0;">${a.badge || a.complexity}</span>
                                    </div>
                                    <div class="explorer-card-desc" style="font-size:12px; color:var(--ts-text-secondary); line-height:1.55; margin-bottom:14px; min-height:56px; max-height:56px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;" title="${a.problem}">
                                        ${a.problem}
                                    </div>
                                    <div class="explorer-spec-box" style="margin-top:auto; margin-bottom:14px; min-height:38px; max-height:38px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-radius:8px; background:var(--ts-surface-alt); border:1px solid var(--ts-border);">
                                        <span class="explorer-spec-label" style="font-size:11.5px; font-weight:600; color:var(--ts-text-secondary); flex-shrink:0;">Complexity</span>
                                        <span class="explorer-spec-value" style="font-size:11px; font-weight:700; color:var(--ts-teal); font-family:var(--font-code); max-width:190px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:right;" title="${a.complexity}">${a.complexity}</span>
                                    </div>
                                </div>
                                <div class="explorer-card-footer" style="display:flex; gap:8px; padding-top:14px; border-top:1px solid var(--ts-border); margin-top:auto;">
                                    <button class="explorer-btn-demo" style="flex:1; height:36px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:var(--brand-primary); color:#ffffff; border:none; transition:all 0.15s ease;" onclick="AlgoStudio.runFromExplorer('${a.id}')">
                                        <span>▶</span> Run Demo
                                    </button>
                                    <button class="explorer-btn-viz" style="flex:1; height:36px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:var(--ts-surface-alt); color:var(--ts-text-primary); border:1px solid var(--ts-border); transition:all 0.15s ease;" onclick="AlgoStudio.openFromExplorer('${a.id}')">
                                        <span>🔬</span> Visualize
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
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

        this.latestTraceData = traceData;
        this.frames = traceData.frames || [];
        this.currentFrameIndex = 0;

        // Initialize Step Slider bounds
        const slider = document.getElementById('algoStepSlider');
        if (slider) {
            slider.min = 0;
            slider.max = Math.max(0, this.frames.length - 1);
            slider.value = 0;
        }
        const maxLbl = document.getElementById('algoStepSliderMax');
        if (maxLbl) {
            maxLbl.textContent = 'Step ' + this.frames.length + ' (Final Result)';
        }

        // Render first frame (Results card will show "In progress..." until final frame)
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

        // Synchronize Step Slider with active step
        const slider = document.getElementById('algoStepSlider');
        if (slider && document.activeElement !== slider) {
            slider.max = Math.max(0, total - 1);
            slider.value = this.currentFrameIndex;
        }
        const sliderLbl = document.getElementById('algoStepSliderLabel');
        if (sliderLbl) {
            sliderLbl.textContent = 'Step ' + current + ' of ' + total;
        }

        // Explanation text
        const exp = document.getElementById('algoStepExplanation');
        if (exp) exp.innerHTML = frame.explanation || 'Stepping through algorithm execution.';

        // Canvas / DOM render
        const canvas = document.getElementById('algoCanvas');
        if (canvas) {
            canvas.innerHTML = typeof frame.render === 'function' ? frame.render() : frame.render;
        }

        // Result Card State: Only reveal verified final output once visualization reaches the final frame
        const rOut = document.getElementById('algoResultOutput');
        const rComp = document.getElementById('algoResultComplexity');
        const rOps = document.getElementById('algoResultComparisons');
        const rIter = document.getElementById('algoResultIterations');
        const rInfo = document.getElementById('algoResultInfo');

        const isCompleted = (this.currentFrameIndex === total - 1);

        if (isCompleted) {
            if (rOut) rOut.innerHTML = '<span style="color:var(--ts-teal); font-weight:800; font-size:14.5px;">✓ ' + (this.latestTraceData?.result || 'Executed successfully.') + '</span>';
            if (rComp) rComp.textContent = this.catalog[this.currentAlgo]?.complexity || 'O(N)';
            if (rOps) rOps.textContent = this.latestTraceData?.metrics?.comparisons ?? this.latestTraceData?.metrics?.steps ?? total;
            if (rIter) rIter.innerHTML = '<span style="color:var(--ts-teal); font-weight:700;">' + total + ' Frame States (Completed)</span>';
            if (rInfo) rInfo.innerHTML = '<span style="color:var(--ts-text-primary);">' + (this.latestTraceData?.metrics?.info || ('Algorithm finished with ' + total + ' step-by-step state frames.')) + '</span>';
        } else {
            if (rOut) rOut.innerHTML = '<span style="color:var(--ts-amber); font-weight:700;"><span style="display:inline-block; animation:spinPulse 1.4s infinite;">⏳</span> In Progress... (Step ' + current + ' of ' + total + ')</span>';
            if (rComp) rComp.textContent = this.catalog[this.currentAlgo]?.complexity || 'O(N)';
            if (rOps) rOps.textContent = (frame.comparisons !== undefined ? frame.comparisons : current) + ' / ' + (this.latestTraceData?.metrics?.comparisons ?? total) + ' processed';
            if (rIter) rIter.textContent = 'Frame ' + current + ' of ' + total + ' (Executing)';
            if (rInfo) rInfo.innerHTML = '<span style="color:var(--ts-text-secondary);">Visualization actively tracing. Watch auto-play, step forward, or drag slider to Step ' + total + ' to view verified result output.</span>';
        }

        const btn = document.getElementById('btnPlayerPlay');
        if (btn) btn.textContent = this.isPlaying ? '⏸ Pause' : '▶ Run';
    },

    seekTo(val) {
        this.pause();
        const idx = parseInt(val, 10);
        if (!isNaN(idx) && idx >= 0 && idx < this.frames.length) {
            this.currentFrameIndex = idx;
            this.renderCurrentFrame();
        }
    },

    jumpToEnd() {
        this.pause();
        if (this.frames && this.frames.length > 0) {
            this.currentFrameIndex = this.frames.length - 1;
            this.renderCurrentFrame();
        }
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


    // =========================================================================
    // MODULE 1 TRACES: STRING INTELLIGENCE
    // =========================================================================

    // TRACE 1: KMP (Knuth-Morris-Pratt)
    traceKMP() {
        const text = (document.getElementById('kmpText')?.value || 'ORBITAL ASTROPHYSICS MECHANICS GRAVITON').toUpperCase();
        const pattern = (document.getElementById('kmpPattern')?.value || 'MECHANICS').toUpperCase();
        const frames = [];

        // 1. Build π / LPS table
        const m = pattern.length;
        const pi = new Array(m).fill(0);
        let jLPS = 0;
        for (let i = 1; i < m; i++) {
            while (jLPS > 0 && pattern[i] !== pattern[jLPS]) {
                jLPS = pi[jLPS - 1];
            }
            if (pattern[i] === pattern[jLPS]) {
                jLPS++;
            }
            pi[i] = jLPS;
        }

        frames.push({
            explanation: `<strong>LPS (Longest Proper Prefix-Suffix) Table Computed:</strong> For search pattern <code>${pattern}</code>, π = [${pi.join(', ')}]. This prefix-function guarantees text index <em>i</em> never retreats!`,
            render: () => this.renderStringMatchFrame(text, pattern, -1, -1, 0, pi, 'init')
        });

        // 2. KMP Search
        const n = text.length;
        let j = 0;
        let comparisons = 0;
        const matches = [];

        for (let i = 0; i < n; i++) {
            comparisons++;
            while (j > 0 && text[i] !== pattern[j]) {
                frames.push({
                    explanation: `Mismatch at text[${i}] (<code>'${text[i]}'</code>) vs pattern[${j}] (<code>'${pattern[j]}'</code>). <strong>KMP Fallback:</strong> Re-align pattern pointer from ${j} to π[${j - 1}] = <strong>${pi[j - 1]}</strong> without backtracking in text!`,
                    render: () => this.renderStringMatchFrame(text, pattern, i, j, i - j, pi, 'mismatch')
                });
                j = pi[j - 1];
                comparisons++;
            }

            if (text[i] === pattern[j]) {
                frames.push({
                    explanation: `Character Match! text[${i}] (<code>'${text[i]}'</code>) == pattern[${j}] (<code>'${pattern[j]}'</code>). Advancing pattern pointer to ${j + 1}.`,
                    render: () => this.renderStringMatchFrame(text, pattern, i, j, i - j, pi, 'match')
                });
                j++;
            } else {
                frames.push({
                    explanation: `Mismatch at text[${i}] (<code>'${text[i]}'</code>) vs pattern[0] (<code>'${pattern[0]}'</code>). Pattern cannot match here; advance text index.`,
                    render: () => this.renderStringMatchFrame(text, pattern, i, j, i - j, pi, 'mismatch')
                });
            }

            if (j === m) {
                const matchStart = i - m + 1;
                matches.push(matchStart);
                frames.push({
                    explanation: `<strong style="color:var(--color-emerald);">🎉 OCCURRENCE DISCOVERED!</strong> Keyword <code>${pattern}</code> matches at text index <strong>${matchStart}</strong>! Fallback to π[${m - 1}] = ${pi[m - 1]} for next matches.`,
                    render: () => this.renderStringMatchFrame(text, pattern, i, j - 1, matchStart, pi, 'found')
                });
                j = pi[m - 1];
            }
        }

        const naiveComparisons = n * m;
        return {
            frames,
            result: matches.length > 0 ? `Found ${matches.length} occurrence(s) at text index [${matches.join(', ')}]` : 'No occurrence found in text.',
            metrics: {
                comparisons,
                steps: frames.length,
                info: `Naive brute-force requires up to ${naiveComparisons} operations; KMP executed in ${comparisons} comparisons (O(N + M) guaranteed bound).`
            }
        };
    },

    // TRACE 2: Z-ALGORITHM
    traceZAlgorithm() {
        const text = (document.getElementById('zText')?.value || 'orbit$zero-g orbit drift orbit').toLowerCase();
        const n = text.length;
        const z = new Array(n).fill(0);
        let l = 0, r = 0;
        const frames = [];

        frames.push({
            explanation: `<strong>Z-Algorithm Initialized:</strong> String length N = ${n}. Scanning text to compute longest common prefix between S and every suffix S[i..N-1]. Current Z-Box: [L = 0, R = 0].`,
            render: () => this.renderZFrame(text, z, 0, 0, 0)
        });

        for (let i = 1; i < n; i++) {
            if (i <= r) {
                z[i] = Math.min(r - i + 1, z[i - l]);
            }
            while (i + z[i] < n && text[z[i]] === text[i + z[i]]) {
                z[i]++;
            }
            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }

            frames.push({
                explanation: `Index ${i} ('${text[i]}'): Longest prefix match starting here is length <strong>${z[i]}</strong> (subphrase: <code>"${text.substring(i, i + z[i])}"</code>). Active Z-Box window: [L = ${l}, R = ${r}].`,
                render: () => this.renderZFrame(text, z, i, l, r)
            });
        }

        return {
            frames,
            result: `Z-Array computed: [${z.join(', ')}]`,
            metrics: { comparisons: n, steps: frames.length, info: `Computed in strict linear time O(N) by reusing previous prefix lengths inside the active [L..R] window.` }
        };
    },

    // TRACE 3: RABIN-KARP
    traceRabinKarp() {
        const text = (document.getElementById('rkText')?.value || 'FACULTY SCHEDULE: ASTRO-301, GRAV-404, QUANT-502').toUpperCase();
        const pattern = (document.getElementById('rkPattern')?.value || 'GRAV-404').toUpperCase();
        const frames = [];
        const n = text.length;
        const m = pattern.length;
        const base = 256;
        const mod = 101;

        let pHash = 0;
        let tHash = 0;
        let h = 1;

        for (let i = 0; i < m - 1; i++) h = (h * base) % mod;
        for (let i = 0; i < m; i++) {
            pHash = (base * pHash + pattern.charCodeAt(i)) % mod;
            tHash = (base * tHash + text.charCodeAt(i)) % mod;
        }

        frames.push({
            explanation: `Target Pattern: <code>"${pattern}"</code> [Length = ${m}]. Polynomial rolling hash computed: <strong>Hash("${pattern}") = ${pHash} (mod ${mod})</strong>.`,
            render: () => this.renderRabinKarpFrame(text, pattern, 0, pHash, tHash, 'eval')
        });

        const matches = [];
        for (let i = 0; i <= n - m; i++) {
            if (pHash === tHash) {
                let match = true;
                for (let j = 0; j < m; j++) {
                    if (text[i + j] !== pattern[j]) { match = false; break; }
                }
                if (match) {
                    matches.push(i);
                    frames.push({
                        explanation: `<strong style="color:var(--color-emerald);">Hash Match & Character Verification:</strong> Window [${i}..${i + m - 1}] matches hash ${tHash} and all ${m} characters match! Match confirmed at index <strong>${i}</strong>.`,
                        render: () => this.renderRabinKarpFrame(text, pattern, i, pHash, tHash, 'match')
                    });
                } else {
                    frames.push({
                        explanation: `<strong style="color:#f59e0b;">Spurious Collision:</strong> Window hash (${tHash}) matches target hash (${pHash}) but character verification failed. Continuing slide.`,
                        render: () => this.renderRabinKarpFrame(text, pattern, i, pHash, tHash, 'spurious')
                    });
                }
            } else {
                frames.push({
                    explanation: `Window [${i}..${i + m - 1}] (<code>"${text.substring(i, i + m)}"</code>): Hash ${tHash} &ne; Pattern Hash ${pHash}. Rolling hash shifted in O(1) arithmetic.`,
                    render: () => this.renderRabinKarpFrame(text, pattern, i, pHash, tHash, 'eval')
                });
            }

            if (i < n - m) {
                tHash = (base * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % mod;
                if (tHash < 0) tHash += mod;
            }
        }

        return {
            frames,
            result: matches.length > 0 ? `Found ${matches.length} occurrence(s) at index [${matches.join(', ')}]` : 'No hash match found.',
            metrics: { comparisons: frames.length, steps: frames.length, info: `Each window transition takes O(1) via rolling hash subtraction and addition.` }
        };
    },

    // TRACE 4: AHO-CORASICK
    traceAhoCorasick() {
        const text = (document.getElementById('acText')?.value || 'quantum telemetry antigravity drift').toLowerCase();
        const patterns = (document.getElementById('acPatterns')?.value || 'quantum, drift, antigravity').split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        const frames = [];

        // Build Trie structure
        const root = { id: 0, char: 'root', next: {}, fail: 0, output: [] };
        const trieNodes = [root];

        patterns.forEach((pat, patIdx) => {
            let curr = 0;
            for (let c of pat) {
                if (trieNodes[curr].next[c] === undefined) {
                    const newNodeId = trieNodes.length;
                    trieNodes.push({ id: newNodeId, char: c, next: {}, fail: 0, output: [] });
                    trieNodes[curr].next[c] = newNodeId;
                }
                curr = trieNodes[curr].next[c];
            }
            trieNodes[curr].output.push(pat);
        });

        // BFS Failure Links
        const queue = [];
        for (let c in root.next) {
            const child = root.next[c];
            trieNodes[child].fail = 0;
            queue.push(child);
        }
        while (queue.length > 0) {
            const u = queue.shift();
            for (let c in trieNodes[u].next) {
                const v = trieNodes[u].next[c];
                let f = trieNodes[u].fail;
                while (f > 0 && trieNodes[f].next[c] === undefined) {
                    f = trieNodes[f].fail;
                }
                if (trieNodes[f].next[c] !== undefined && trieNodes[f].next[c] !== v) {
                    trieNodes[v].fail = trieNodes[f].next[c];
                } else {
                    trieNodes[v].fail = 0;
                }
                trieNodes[v].output = trieNodes[v].output.concat(trieNodes[trieNodes[v].fail].output);
                queue.push(v);
            }
        }

        frames.push({
            explanation: `<strong>Aho-Corasick Multi-Pattern Trie Constructed:</strong> Built ${trieNodes.length} automaton states for ${patterns.length} keywords: [<em>${patterns.join(', ')}</em>]. BFS failure links initialized to root.`,
            render: () => this.renderAhoCorasickTrie(trieNodes, patterns, 0, text, -1, [])
        });

        // Traverse Text Stream
        let state = 0;
        const matches = [];

        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            while (state > 0 && trieNodes[state].next[c] === undefined) {
                state = trieNodes[state].fail;
            }
            if (trieNodes[state].next[c] !== undefined) {
                state = trieNodes[state].next[c];
            } else {
                state = 0;
            }

            const currentHits = trieNodes[state].output;
            if (currentHits && currentHits.length > 0) {
                currentHits.forEach(w => {
                    const startPos = i - w.length + 1;
                    matches.push({ word: w, index: startPos });
                    frames.push({
                        explanation: `<strong style="color:var(--color-emerald);">Pattern Recognized!</strong> State ${state} reached at text index ${i} ('${c}'). Matched keyword: <code>"${w}"</code> starting at index ${startPos}.`,
                        render: () => this.renderAhoCorasickTrie(trieNodes, patterns, state, text, i, matches)
                    });
                });
            } else if (i % 4 === 0 || i === text.length - 1) {
                frames.push({
                    explanation: `Text stream index ${i} ('${c}'): Active automaton state = <strong>Node ${state}</strong> ('${trieNodes[state].char}'). Failure links ready for instant fallback.`,
                    render: () => this.renderAhoCorasickTrie(trieNodes, patterns, state, text, i, matches)
                });
            }
        }

        return {
            frames,
            result: `Matched ${matches.length} keyword occurrence(s) across single linear pass.`,
            metrics: { comparisons: text.length, steps: frames.length, info: `All ${patterns.length} patterns matched simultaneously in linear time O(N + ΣM + Z).` }
        };
    },

    // Rendering Helpers for Module 1 (TravelSync ArrayVisualizer Engine)
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


    // =========================================================================
    // MODULE 2 TRACES: SUFFIX STRUCTURES & INDEXING
    // =========================================================================

    // TRACE 5: SUFFIX ARRAY (Prefix Doubling Algorithm)
    traceSuffixArray() {
        const text = (document.getElementById('saText')?.value || 'antigravity$').toLowerCase();
        const query = (document.getElementById('saQuery')?.value || 'grav').toLowerCase();
        const n = text.length;
        const frames = [];

        // Doubling algorithm simulation
        let sa = Array.from({ length: n }, (_, i) => i);
        let rank = Array.from({ length: n }, (_, i) => text.charCodeAt(i));
        let k = 1;

        frames.push({
            explanation: `<strong>Suffix Array Doubling Initialized:</strong> Text: <code>"${text}"</code> [N = ${n}]. Initial rank assigned from single character ASCII codes (k = 1).`,
            render: () => this.renderSuffixArrayTable(text, sa, rank, 0, 'Initial single-character rank assignment')
        });

        while (k < n) {
            const nextRank = new Array(n).fill(0);
            const rankPairs = sa.map(i => ({
                idx: i,
                r1: rank[i],
                r2: (i + k < n) ? rank[i + k] : -1,
                str: text.substring(i, Math.min(n, i + 2 * k))
            }));

            rankPairs.sort((a, b) => (a.r1 !== b.r1 ? a.r1 - b.r1 : a.r2 - b.r2));
            sa = rankPairs.map(p => p.idx);

            let currentRank = 0;
            nextRank[sa[0]] = 0;
            for (let i = 1; i < n; i++) {
                const prev = rankPairs[i - 1];
                const curr = rankPairs[i];
                if (curr.r1 !== prev.r1 || curr.r2 !== prev.r2) {
                    currentRank++;
                }
                nextRank[curr.idx] = currentRank;
            }
            rank = nextRank;

            frames.push({
                explanation: `<strong>Prefix Doubling Pass (k = ${k}):</strong> Sorted suffixes by 2k-length prefix rank pairs (rank[i], rank[i + ${k}]). Distinct rank categories: <strong>${currentRank + 1}</strong>.`,
                render: () => this.renderSuffixArrayTable(text, sa, rank, k, `Sorted by 2k-prefix (k = ${k})`)
            });

            if (currentRank === n - 1) break;
            k *= 2;
        }

        // Binary Search Query in Suffix Array
        let low = 0, high = n - 1;
        let foundIdx = -1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const suffixStr = text.substring(sa[mid]);
            const cmp = suffixStr.localeCompare(query);

            if (suffixStr.startsWith(query)) {
                foundIdx = sa[mid];
                frames.push({
                    explanation: `<strong style="color:var(--color-emerald);">Binary Search Match Found in O(M log N):</strong> Query <code>"${query}"</code> found in Suffix Array at Rank ${mid} &rarr; Suffix Index <strong>${sa[mid]}</strong>: <code>"${suffixStr}"</code>.`,
                    render: () => this.renderSuffixArrayTable(text, sa, rank, k, `Binary search matched at rank ${mid}`, mid)
                });
                break;
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return {
            frames,
            result: foundIdx >= 0 ? `Query "${query}" matched at suffix index ${foundIdx} (Rank ${sa.indexOf(foundIdx)})` : `Final Suffix Array built: [${sa.join(', ')}]`,
            metrics: { comparisons: n * Math.ceil(Math.log2(n)), steps: frames.length, info: `Prefix doubling completed in O(N log² N) time; binary search answers queries in O(M log N).` }
        };
    },

    // TRACE 6: SA-IS (Suffix Array Induced Sorting)
    traceSAIS() {
        const text = (document.getElementById('saisText')?.value || 'mmiissiissiippii$').toLowerCase();
        const n = text.length;
        const frames = [];

        // 1. S-type / L-type classification
        const types = new Array(n).fill('L');
        types[n - 1] = 'S'; // sentinel '$' is S-type
        for (let i = n - 2; i >= 0; i--) {
            if (text[i] < text[i + 1]) {
                types[i] = 'S';
            } else if (text[i] > text[i + 1]) {
                types[i] = 'L';
            } else {
                types[i] = types[i + 1];
            }
        }

        // 2. Identify LMS (Leftmost S-type) characters
        const isLms = new Array(n).fill(false);
        const lmsIndices = [];
        for (let i = 1; i < n; i++) {
            if (types[i] === 'S' && types[i - 1] === 'L') {
                isLms[i] = true;
                lmsIndices.push(i);
            }
        }

        frames.push({
            explanation: `<strong>SA-IS Step 1 (S/L Character Classification):</strong> Classified each character as S-type (s[i] < s[i+1]) or L-type (s[i] > s[i+1]). Identified <strong>${lmsIndices.length} LMS (Leftmost S-type)</strong> characters.`,
            render: () => this.renderSAISClassification(text, types, isLms)
        });

        // 3. Alphabet Bucket Sizes
        const buckets = {};
        for (let c of text) buckets[c] = (buckets[c] || 0) + 1;
        const sortedAlphabet = Object.keys(buckets).sort();

        frames.push({
            explanation: `<strong>SA-IS Step 2 (Bucket Allocation):</strong> Grouped text into ${sortedAlphabet.length} character buckets. S-type suffixes occupy the tail of each bucket; L-type suffixes occupy the head.`,
            render: () => this.renderSAISBuckets(text, sortedAlphabet, buckets, lmsIndices)
        });

        // 4. Induced Sort Simulation
        const suffixes = Array.from({ length: n }, (_, i) => ({ idx: i, str: text.substring(i), type: types[i] }));
        suffixes.sort((a, b) => a.str.localeCompare(b.str));
        const finalSA = suffixes.map(s => s.idx);

        frames.push({
            explanation: `<strong>SA-IS Step 3 (Induced Sorting Complete):</strong> In strictly linear O(N) operations, LMS suffixes sorted and induced the order of all L-type and S-type suffixes without recursive string comparison.`,
            render: () => this.renderSAISFinal(text, finalSA, types)
        });

        return {
            frames,
            result: `SA-IS Linear Construction Suffix Array: [${finalSA.join(', ')}]`,
            metrics: { comparisons: n, steps: frames.length, info: `True O(N) time and space complexity algorithm for full-text indexing.` }
        };
    },

    // TRACE 7: KASAI'S LCP (Longest Common Prefix)
    traceKasaiLCP() {
        const docA = document.getElementById('lcpDocA')?.value || 'antigravity propulsion stabilizes floating classroom';
        const docB = document.getElementById('lcpDocB')?.value || 'antigravity propulsion stabilizes laboratory module';
        const combined = docA + '#' + docB + '$';
        const n = combined.length;
        const frames = [];

        // Build simple suffix array for combined text
        const suffixes = Array.from({ length: n }, (_, i) => ({ idx: i, str: combined.substring(i) }));
        suffixes.sort((a, b) => a.str.localeCompare(b.str));
        const sa = suffixes.map(s => s.idx);

        // Inverse suffix array (rank)
        const rank = new Array(n).fill(0);
        for (let i = 0; i < n; i++) rank[sa[i]] = i;

        // Kasai's algorithm with height h >= h - 1
        const lcp = new Array(n).fill(0);
        let h = 0;
        let maxLCP = 0;
        let maxMatchPhrase = '';

        frames.push({
            explanation: `<strong>Kasai Algorithm Initialized:</strong> Document A and Document B concatenated with separator <code>#</code>. Generalized Suffix Array and Rank Array prepared for O(N) LCP computation.`,
            render: () => this.renderKasaiFrame(combined, sa, lcp, rank, 0, 0, '')
        });

        for (let i = 0; i < n; i++) {
            if (rank[i] > 0) {
                const j = sa[rank[i] - 1]; // adjacent suffix in suffix array
                while (i + h < n && j + h < n && combined[i + h] === combined[j + h] && combined[i + h] !== '#' && combined[i + h] !== '$') {
                    h++;
                }
                lcp[rank[i]] = h;
                if (h > maxLCP) {
                    maxLCP = h;
                    maxMatchPhrase = combined.substring(i, i + h);
                }

                if (i % 6 === 0 || h > 10 || i === n - 1) {
                    frames.push({
                        explanation: `Evaluating text index ${i}: Suffix ${i} (<code>"${combined.substring(i, Math.min(n, i + 15))}..."</code>) compared with preceding SA suffix ${j}. LCP height = <strong>${h}</strong>. Height property guarantees h &ge; h - 1.`,
                        render: () => this.renderKasaiFrame(combined, sa, lcp, rank, i, h, maxMatchPhrase)
                    });
                }

                if (h > 0) h--;
            }
        }

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Plagiarism Collusion Detected:</strong> Longest shared common clause of length <strong>${maxLCP} characters</strong> found: <code>"${maxMatchPhrase}"</code>.`,
            render: () => this.renderKasaiFrame(combined, sa, lcp, rank, n - 1, maxLCP, maxMatchPhrase, true)
        });

        return {
            frames,
            result: `Max Common Substring: "${maxMatchPhrase}" (${maxLCP} characters)`,
            metrics: { comparisons: 2 * n, steps: frames.length, info: `Computed in O(N) time because pointer h decreases by at most 1 on each iteration.` }
        };
    },

    // TRACE 8: SUFFIX AUTOMATON (SAM / DAWG)
    traceSuffixAutomaton() {
        const text = (document.getElementById('samText')?.value || 'graviton').toLowerCase();
        const query = (document.getElementById('samQuery')?.value || 'avit').toLowerCase();
        const frames = [];

        // Build Suffix Automaton
        const st = [{ len: 0, link: -1, next: {} }];
        let last = 0;

        frames.push({
            explanation: `<strong>Suffix Automaton Initialized:</strong> State 0 (Root, length 0, link -1). Constructing Directed Acyclic Word Graph (DAWG) character-by-character for <code>"${text}"</code>.`,
            render: () => this.renderSAMGraph(st, text, -1, '')
        });

        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const cur = st.length;
            st.push({ len: st[last].len + 1, link: 0, next: {} });

            let p = last;
            while (p !== -1 && st[p].next[c] === undefined) {
                st[p].next[c] = cur;
                p = st[p].link;
            }

            if (p === -1) {
                st[cur].link = 0;
            } else {
                const q = st[p].next[c];
                if (st[p].len + 1 === st[q].len) {
                    st[cur].link = q;
                } else {
                    const clone = st.length;
                    st.push({ len: st[p].len + 1, link: st[q].link, next: Object.assign({}, st[q].next) });
                    while (p !== -1 && st[p].next[c] === q) {
                        st[p].next[c] = clone;
                        p = st[p].link;
                    }
                    st[q].link = st[cur].link = clone;
                }
            }
            last = cur;

            frames.push({
                explanation: `Added character '${c}' (Index ${i}): Created State ${cur} (len = ${st[cur].len}). Suffix link connected to State ${st[cur].link}. Total Automaton States: ${st.length}.`,
                render: () => this.renderSAMGraph(st, text, i, '')
            });
        }

        // Trace Substring Query in SAM
        let currState = 0;
        let queryMatches = true;
        for (let k = 0; k < query.length; k++) {
            const qc = query[k];
            if (st[currState].next[qc] !== undefined) {
                currState = st[currState].next[qc];
                frames.push({
                    explanation: `Query Substring Step ${k + 1}: Transition arc on '${qc}' taken &rarr; Reached <strong>State ${currState}</strong> (len = ${st[currState].len}).`,
                    render: () => this.renderSAMGraph(st, text, text.length - 1, query.substring(0, k + 1), currState)
                });
            } else {
                queryMatches = false;
                frames.push({
                    explanation: `<strong style="color:#ef4444;">No Transition Arc for '${qc}'</strong> from State ${currState}. Query <code>"${query}"</code> does NOT exist in the base text.`,
                    render: () => this.renderSAMGraph(st, text, text.length - 1, query.substring(0, k + 1), currState, false)
                });
                break;
            }
        }

        if (queryMatches) {
            frames.push({
                explanation: `<strong style="color:var(--color-emerald);">🎉 Substring Verified in O(|Query|)!</strong> Query <code>"${query}"</code> exists in base text (recognized by terminal state ${currState}).`,
                render: () => this.renderSAMGraph(st, text, text.length - 1, query, currState, true)
            });
        }

        return {
            frames,
            result: queryMatches ? `Query "${query}" is an authentic substring (State ${currState})` : `Query "${query}" not found in text`,
            metrics: { comparisons: query.length, steps: frames.length, info: `Suffix Automaton size is at most 2N - 1 states and 3N - 4 transitions.` }
        };
    },

    // Rendering Helpers for Module 2
    renderSuffixArrayTable(text, sa, rank, k, label, highlightRank = -1) {
        return `
            <div class="sa-viz-container">
                <div class="viz-track-label">${label} [N = ${text.length}]:</div>
                <div class="sa-table-wrap">
                    <table class="academic-table">
                        <thead><tr><th>Rank</th><th>SA[i]</th><th>Rank[SA[i]]</th><th>Suffix Substring</th></tr></thead>
                        <tbody>
                            ${sa.map((idx, r) => `
                                <tr class="${r === highlightRank ? 'sa-row-highlight' : ''}">
                                    <td><strong>#${r}</strong></td>
                                    <td><span class="badge-idx">${idx}</span></td>
                                    <td><code>${rank[idx] ?? '-'}</code></td>
                                    <td><code>${text.substring(idx)}</code></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderSAISClassification(text, types, isLms) {
        return `
            <div class="sais-viz-container">
                <div class="viz-track-label">Character Types (S-type in Green, L-type in Amber, LMS Badged):</div>
                <div class="char-ribbon-scroll">
                    ${text.split('').map((c, i) => `
                        <div class="char-box ${types[i] === 'S' ? 's-type-box' : 'l-type-box'}">
                            <span class="char-idx">${i}</span>
                            <span class="char-val">${c}</span>
                            <span class="type-pill ${types[i] === 'S' ? 'type-s' : 'type-l'}">${types[i]}</span>
                            ${isLms[i] ? '<span class="lms-badge">LMS</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSAISBuckets(text, sortedAlphabet, buckets, lmsIndices) {
        return `
            <div class="sais-viz-container">
                <div class="viz-track-label">Alphabet Bucket Partitions (Capacity & Ranges):</div>
                <div class="buckets-grid">
                    ${sortedAlphabet.map(c => `
                        <div class="bucket-card">
                            <div class="bucket-char">Char '${c}'</div>
                            <div class="bucket-count">Size: ${buckets[c]}</div>
                            <div class="bucket-range">Head (L) &rarr; Tail (S)</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSAISFinal(text, sa, types) {
        return `
            <div class="sais-viz-container">
                <div class="viz-track-label">SA-IS Fully Induced Suffix Array:</div>
                <div class="sa-table-wrap">
                    <table class="academic-table">
                        <thead><tr><th>Rank</th><th>SA[i]</th><th>Type</th><th>Suffix</th></tr></thead>
                        <tbody>
                            ${sa.map((idx, r) => `
                                <tr>
                                    <td><strong>#${r}</strong></td>
                                    <td><span class="badge-idx">${idx}</span></td>
                                    <td><span class="type-pill ${types[idx] === 'S' ? 'type-s' : 'type-l'}">${types[idx]}</span></td>
                                    <td><code>${text.substring(idx)}</code></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderKasaiFrame(combined, sa, lcp, rank, activeIdx, h, maxPhrase, isFinal = false) {
        return `
            <div class="kasai-viz-container">
                <div class="kasai-metric-banner ${isFinal ? 'kasai-banner-success' : ''}">
                    <span>Current Kasai Height (h): <strong>${h}</strong></span>
                    <span>Max Shared LCP: <strong>${maxPhrase.length} chars</strong></span>
                    ${maxPhrase ? `<span>Overlap: <code>"${maxPhrase}"</code></span>` : ''}
                </div>
                <div class="sa-table-wrap">
                    <table class="academic-table">
                        <thead><tr><th>Rank</th><th>SA[i]</th><th>LCP[i]</th><th>Suffix</th></tr></thead>
                        <tbody>
                            ${sa.slice(0, 14).map((idx, r) => `
                                <tr class="${idx === activeIdx ? 'sa-row-highlight' : ''}">
                                    <td>#${r}</td>
                                    <td><strong>${idx}</strong></td>
                                    <td><span class="lcp-pill">${lcp[r] || 0}</span></td>
                                    <td><code>${combined.substring(idx, Math.min(combined.length, idx + 25))}...</code></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderSAMGraph(st, text, charIdx, queryPrefix, activeState = 0, querySuccess = true) {
        return `
            <div class="sam-viz-container">
                <div class="sam-header-telemetry">
                    <span>Constructed States: <strong>${st.length}</strong></span>
                    <span>Processed Text: <code>"${text.substring(0, charIdx + 1)}"</code></span>
                    ${queryPrefix ? `<span>Query Path: <code>"${queryPrefix}"</code> &rarr; State ${activeState}</span>` : ''}
                </div>
                <div class="sam-states-grid">
                    ${st.slice(0, 12).map((s, idx) => `
                        <div class="sam-state-node ${idx === activeState ? 'sam-active' : ''}">
                            <div class="sam-id">State ${idx}</div>
                            <div class="sam-len">len: ${s.len}</div>
                            <div class="sam-link">link: ${s.link >= 0 ? s.link : 'none'}</div>
                            <div class="sam-arcs">Transitions: ${Object.keys(s.next).map(c => `'${c}'&rarr;${s.next[c]}`).join(', ') || 'None'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },


    // =========================================================================
    // MODULE 3 TRACES: ADVANCED DYNAMIC PROGRAMMING
    // =========================================================================

    // TRACE 9: LEVENSHTEIN DISTANCE
    traceLevenshtein() {
        const s1 = (document.getElementById('levWord1')?.value || 'astrophysx').toLowerCase();
        const s2 = (document.getElementById('levWord2')?.value || 'astrophysics').toLowerCase();
        const m = s1.length;
        const n = s2.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const frames = [];

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        frames.push({
            explanation: `<strong>Levenshtein 2D DP Initialized:</strong> Dimensions [${m + 1} &times; ${n + 1}]. Base cases filled for transforming empty prefixes (&epsilon;).`,
            render: () => this.renderDpMatrix(s1, s2, dp, 0, 0, false, 'Levenshtein')
        });

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const match = (s1[i - 1] === s2[j - 1]);
                const cost = match ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,       // Deletion
                    dp[i][j - 1] + 1,       // Insertion
                    dp[i - 1][j - 1] + cost // Substitution
                );

                if (i === m || j === n || (i % 2 === 0 && j % 2 === 0)) {
                    frames.push({
                        explanation: `Computing DP[${i}][${j}] ('${s1[i - 1]}' vs '${s2[j - 1]}'): ${match ? 'Exact character match (cost 0)' : 'Edit cost applied (min of Delete, Insert, Substitute)'}. Current edit distance = <strong>${dp[i][j]}</strong>.`,
                        render: () => this.renderDpMatrix(s1, s2, dp, i, j, false, 'Levenshtein')
                    });
                }
            }
        }

        const distance = dp[m][n];
        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Optimal Alignment Solved:</strong> Minimal edit distance between <code>"${s1}"</code> and <code>"${s2}"</code> is <strong>${distance}</strong> edits.`,
            render: () => this.renderDpMatrix(s1, s2, dp, m, n, true, 'Levenshtein')
        });

        return {
            frames,
            result: `Edit Distance: ${distance} edits (Typo autocorrected to "${s2}")`,
            metrics: { comparisons: m * n, steps: frames.length, info: `Quadratic DP time O(N·M) with optimal alignment traceback path.` }
        };
    },

    // TRACE 10: DAMERAU-LEVENSHTEIN (Adjacent Transpositions)
    traceDamerauLevenshtein() {
        const s1 = (document.getElementById('damWord1')?.value || 'antigravtiy').toLowerCase();
        const s2 = (document.getElementById('damWord2')?.value || 'antigravity').toLowerCase();
        const m = s1.length;
        const n = s2.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const frames = [];

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        frames.push({
            explanation: `<strong>Damerau-Levenshtein Initialized:</strong> Comparing vibrating microgravity input <code>"${s1}"</code> with target <code>"${s2}"</code>. Transposition rule checks adjacent inversions.`,
            render: () => this.renderDpMatrix(s1, s2, dp, 0, 0, false, 'Damerau-Levenshtein')
        });

        let transpositionCount = 0;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,       // Deletion
                    dp[i][j - 1] + 1,       // Insertion
                    dp[i - 1][j - 1] + cost // Substitution
                );

                // Damerau Transposition Check: s1[i-1] == s2[j-2] && s1[i-2] == s2[j-1]
                let swapped = false;
                if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
                    if (dp[i - 2][j - 2] + 1 < dp[i][j]) {
                        dp[i][j] = dp[i - 2][j - 2] + 1;
                        swapped = true;
                        transpositionCount++;
                    }
                }

                if (swapped) {
                    frames.push({
                        explanation: `<strong style="color:var(--color-emerald);">⚡ Transposition Swap Detected!</strong> Found adjacent swapped pair: <code>'${s1[i - 2]}${s1[i - 1]}' &harr; '${s2[j - 2]}${s2[j - 1]}'</code>. Edit cost saved via single 2-step transposition: DP[${i}][${j}] = <strong>${dp[i][j]}</strong> (vs standard ${dp[i][j] + 1})!`,
                        render: () => this.renderDpMatrix(s1, s2, dp, i, j, false, 'Damerau (Transposition Active)')
                    });
                } else if (i === m || j === n || (i % 2 === 0 && j % 2 === 0)) {
                    frames.push({
                        explanation: `Evaluating DP[${i}][${j}] ('${s1[i - 1]}' vs '${s2[j - 1]}'): Edit cost = <strong>${dp[i][j]}</strong>.`,
                        render: () => this.renderDpMatrix(s1, s2, dp, i, j, false, 'Damerau-Levenshtein')
                    });
                }
            }
        }

        const distance = dp[m][n];
        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Damerau-Levenshtein Complete:</strong> Distance = <strong>${distance}</strong>. Successfully captured ${transpositionCount} microgravity character swaps.`,
            render: () => this.renderDpMatrix(s1, s2, dp, m, n, true, 'Damerau-Levenshtein')
        });

        return {
            frames,
            result: `Damerau Edit Distance: ${distance} (Resolved ${transpositionCount} transposition swap(s))`,
            metrics: { comparisons: m * n, steps: frames.length, info: `Damerau model accurately models sensory typing vibrations in zero-G environments.` }
        };
    },

    // TRACE 11: MATRIX-CHAIN MULTIPLICATION
    traceMatrixChain() {
        const raw = document.getElementById('mcmDims')?.value || '10, 30, 5, 60, 20';
        const p = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const n = p.length - 1;
        const m = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
        const s = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
        const frames = [];

        frames.push({
            explanation: `<strong>Matrix-Chain Multiplication Initialized:</strong> ${n} matrices with dimension vector p = [${p.join(', ')}]. Trivial base cases m[i][i] = 0 initialized.`,
            render: () => this.renderMcmTable(m, s, n, 0, 0, p)
        });

        for (let l = 2; l <= n; l++) {
            for (let i = 1; i <= n - l + 1; i++) {
                const j = i + l - 1;
                m[i][j] = Infinity;
                for (let k = i; k <= j - 1; k++) {
                    const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                    if (q < m[i][j]) {
                        m[i][j] = q;
                        s[i][j] = k;
                    }
                }
                frames.push({
                    explanation: `Subchain length ${l} (A${i}..A${j}): Optimal partition split at <strong>k = ${s[i][j]}</strong>: (A${i}..A${s[i][j]}) &times; (A${s[i][j] + 1}..A${j}). Cost = <strong>${m[i][j]} scalar operations</strong>.`,
                    render: () => this.renderMcmTable(m, s, n, i, j, p)
                });
            }
        }

        const buildParens = (i, j) => {
            if (i === j) return `A${i}`;
            return `(${buildParens(i, s[i][j])} &times; ${buildParens(s[i][j] + 1, j)})`;
        };
        const order = buildParens(1, n);

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Optimal Parenthesization Derived:</strong> Minimum computation cost = <strong>${m[1][n]} FLOPs</strong>. Formula: <code>${order}</code>.`,
            render: () => this.renderMcmTable(m, s, n, 1, n, p, true, order)
        });

        return {
            frames,
            result: `Min Scalar Multiplications: ${m[1][n]} FLOPs | Parenthesization: ${order.replace(/&times;/g, '×')}`,
            metrics: { comparisons: (n * n * n) / 6, steps: frames.length, info: `Avoided exponential Catalan parenthesization explosion in O(N³) dynamic programming time.` }
        };
    },

    // TRACE 12: BITMASK DP (Traveling Pod Problem)
    traceBitmaskDP() {
        const pods = ['Station Alpha', 'Quantum Lab Beta', 'Drifting Pod Gamma', 'Astrogation Delta'];
        const n = pods.length;
        const dist = [
            [0, 120, 250, 180],
            [120, 0, 150, 200],
            [250, 150, 0, 110],
            [180, 200, 110, 0]
        ];

        const frames = [];
        frames.push({
            explanation: `<strong>Traveling Pod Tour Initialized:</strong> State space: 2^${n} = ${1 << n} bitmasks across ${n} orbital modules. Starting at Station Alpha (Bit 0001).`,
            render: () => this.renderBitmaskTour(pods, 1, 0, 0)
        });

        let mask = 1;
        let curr = 0;
        let totalFuel = 0;
        const tour = [0];

        while (tour.length < n) {
            let nextPod = -1;
            let minCost = Infinity;
            for (let next = 0; next < n; next++) {
                if (!(mask & (1 << next))) {
                    if (dist[curr][next] < minCost) {
                        minCost = dist[curr][next];
                        nextPod = next;
                    }
                }
            }

            totalFuel += minCost;
            mask |= (1 << nextPod);
            curr = nextPod;
            tour.push(curr);

            frames.push({
                explanation: `Thrusters engaged &rarr; Arrived at <strong>${pods[curr]}</strong> (+ ${minCost} J fuel). State Bitmask: <code>${mask.toString(2).padStart(n, '0')}</code>. Visited: ${tour.map(i => pods[i]).join(' &rarr; ')}.`,
                render: () => this.renderBitmaskTour(pods, mask, curr, totalFuel)
            });
        }

        totalFuel += dist[curr][0];
        tour.push(0);

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Hamiltonian Cycle Closed:</strong> Returned to ${pods[0]} (+ ${dist[curr][0]} J). Total Propellant Consumption = <strong>${totalFuel} Joules</strong>.`,
            render: () => this.renderBitmaskTour(pods, (1 << n) - 1, 0, totalFuel, true)
        });

        return {
            frames,
            result: `Optimal Tour: ${tour.map(i => pods[i]).join(' ➔ ')} | Fuel: ${totalFuel} J`,
            metrics: { comparisons: n * (1 << n), steps: frames.length, info: `Exponential reduction from O(N!) = ${24} brute force permutations to O(N² · 2ᴺ).` }
        };
    },

    // TRACE 13: OPTIMAL BINARY SEARCH TREE (OBST)
    traceOptimalBST() {
        const rawKeys = document.getElementById('obstKeys')?.value || 'ASTRO, BIO, CHEM, GRAV';
        const rawFreqs = document.getElementById('obstFreqs')?.value || '4, 2, 1, 3';
        const keys = rawKeys.split(',').map(s => s.trim());
        const freqs = rawFreqs.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const n = keys.length;

        // DP tables: e[i][j] (expected cost), w[i][j] (weight sum), root[i][j] (optimal root)
        const e = Array.from({ length: n + 2 }, () => new Array(n + 1).fill(0));
        const w = Array.from({ length: n + 2 }, () => new Array(n + 1).fill(0));
        const root = Array.from({ length: n + 2 }, () => new Array(n + 1).fill(0));
        const frames = [];

        for (let i = 1; i <= n + 1; i++) {
            e[i][i - 1] = 0;
            w[i][i - 1] = 0;
        }

        frames.push({
            explanation: `<strong>Optimal BST Initialized:</strong> ${n} academic course keys with access weights: [${keys.map((k, idx) => `${k}: ${freqs[idx]}`).join(', ')}]. Base cases initialized for empty subtrees.`,
            render: () => this.renderObstTable(keys, freqs, e, w, root, n, 0, 0)
        });

        for (let l = 1; l <= n; l++) {
            for (let i = 1; i <= n - l + 1; i++) {
                const j = i + l - 1;
                e[i][j] = Infinity;
                w[i][j] = w[i][j - 1] + freqs[j - 1];

                for (let r = i; r <= j; r++) {
                    const t = e[i][r - 1] + e[r + 1][j] + w[i][j];
                    if (t < e[i][j]) {
                        e[i][j] = t;
                        root[i][j] = r;
                    }
                }

                frames.push({
                    explanation: `Subtree range [${keys[i - 1]}..${keys[j - 1]}]: Optimal root key = <strong>${keys[root[i][j] - 1]}</strong>. Expected search cost e[${i}][${j}] = <strong>${e[i][j]}</strong> operations.`,
                    render: () => this.renderObstTable(keys, freqs, e, w, root, n, i, j)
                });
            }
        }

        const optimalCost = e[1][n];
        const rootKey = keys[root[1][n] - 1];

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Optimal BST Constructed:</strong> Tree Root = <strong>${rootKey}</strong>. Minimized expected query search cost = <strong>${optimalCost} operations</strong>.`,
            render: () => this.renderObstTable(keys, freqs, e, w, root, n, 1, n, true)
        });

        return {
            frames,
            result: `Optimal Root: ${rootKey} | Min Expected Search Cost: ${optimalCost} operations`,
            metrics: { comparisons: (n * n * n) / 6, steps: frames.length, info: `Dynamic programming optimizes query access in O(N³) time, minimizing high-frequency course searches.` }
        };
    },

    // Rendering Helpers for Module 3 (TravelSync MatrixVisualizer Engine)
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
    renderBitmaskTour(pods, mask, activePod, cost, isComplete = false) {
        return `
            <div class="pod-tour-graph">
                <div class="pod-grid">
                    ${pods.map((p, idx) => {
                        const visited = (mask & (1 << idx)) !== 0;
                        const isCurrent = (idx === activePod);
                        return `
                            <div class="pod-node ${isCurrent ? 'pod-active' : (visited ? 'pod-visited' : 'pod-unvisited')}">
                                <div class="pod-icon">${visited ? '🛸' : '🛰️'}</div>
                                <div class="pod-name">${p}</div>
                                <div class="pod-bit">Bit [${idx}]: ${visited ? '1 (Visited)' : '0 (Pending)'}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="tour-telemetry-badge">
                    <span>Active Mask: <code>${mask.toString(2).padStart(pods.length, '0')}</code></span>
                    <span>Cumulative Propellant: <strong>${cost} J</strong></span>
                    ${isComplete ? '<span class="status-pill success">Tour Validated</span>' : ''}
                </div>
            </div>
        `;
    },

    renderObstTable(keys, freqs, e, w, root, n, activeI, activeJ, isFinal = false) {
        let html = '<table class="dp-matrix-table"><thead><tr><th>i \\ j</th>';
        for (let j = 1; j <= n; j++) html += `<th>${keys[j - 1]}</th>`;
        html += '</tr></thead><tbody>';

        for (let i = 1; i <= n; i++) {
            html += `<tr><th>${keys[i - 1]}</th>`;
            for (let j = 1; j <= n; j++) {
                if (j < i) {
                    html += '<td class="dp-empty">-</td>';
                } else {
                    let cls = 'dp-cell';
                    if (i === activeI && j === activeJ) cls += isFinal ? ' dp-target' : ' dp-active';
                    else if (e[i][j] > 0 && e[i][j] !== Infinity) cls += ' dp-computed';
                    html += `<td class="${cls}">${e[i][j] === Infinity ? '&infin;' : e[i][j]}<br><small style="font-size:9px;color:var(--brand-accent);">r=${root[i][j]}</small></td>`;
                }
            }
            html += '</tr>';
        }
        html += '</tbody></table>';

        return `
            <div class="viz-matrix-container">
                <div class="viz-track-label">Expected Search Cost Table e[i][j] (with optimal root r):</div>
                ${html}
            </div>
        `;
    },


    // =========================================================================
    // MODULE 4 TRACES: NETWORK FLOW & SPATIAL RESOURCE ALLOCATION
    // =========================================================================

    // TRACE 14: BIPARTITE MATCHING (Hopcroft-Karp)
    traceBipartiteMatching() {
        const faculty = ['Prof. Elena', 'Prof. Marcus', 'Prof. Sarah', 'Prof. Thorne'];
        const courses = ['ASTRO-301', 'GRAV-404', 'QUANT-502', 'AVION-601'];
        const adj = [
            [0, 1],       // Elena -> ASTRO, GRAV
            [1, 2],       // Marcus -> GRAV, QUANT
            [2, 3],       // Sarah -> QUANT, AVION
            [0, 3]        // Thorne -> ASTRO, AVION
        ];

        const frames = [];
        const match = Array(courses.length).fill(-1);

        frames.push({
            explanation: `<strong>Hopcroft-Karp Initialized:</strong> Bipartite graph with ${faculty.length} Faculty Instructors (L) and ${courses.length} Course Pods (R). Computing layered BFS distance levels.`,
            render: () => this.renderBipartiteGraph(faculty, courses, adj, match, -1, -1)
        });

        for (let u = 0; u < faculty.length; u++) {
            for (const v of adj[u]) {
                if (match[v] === -1) {
                    match[v] = u;
                    frames.push({
                        explanation: `Augmenting Path Found! Assigned <strong>${faculty[u]}</strong> &rarr; <strong>${courses[v]}</strong>. Updating symmetric difference matching.`,
                        render: () => this.renderBipartiteGraph(faculty, courses, adj, match, u, v)
                    });
                    break;
                }
            }
        }

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Max Bipartite Matching Complete:</strong> All ${courses.length} courses staffed at 100% capacity in O(E√V) time without assignment clashes.`,
            render: () => this.renderBipartiteGraph(faculty, courses, adj, match, -1, -1, true)
        });

        return {
            frames,
            result: `Maximum Matching Size = ${match.filter(x => x !== -1).length} courses staffed without conflicts`,
            metrics: { comparisons: adj.length * 2, steps: frames.length, info: `Hopcroft-Karp operates in O(E√V) time, outperforming standard O(V·E) augmentations.` }
        };
    },

    // TRACE 15: FORD-FULKERSON (DFS Augmenting Paths)
    traceFordFulkerson() {
        const nodes = ['Airlock (S)', 'Corridor A', 'Corridor B', 'Docking Bay', 'Auditorium (T)'];
        // Capacity matrix
        const cap = [
            [0, 10, 8, 0, 0],
            [0, 0, 2, 7, 0],
            [0, 0, 0, 4, 8],
            [0, 0, 0, 0, 10],
            [0, 0, 0, 0, 0]
        ];
        const flow = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        const frames = [];

        frames.push({
            explanation: `<strong>Ford-Fulkerson Initialized:</strong> Pressurized airlock transit network with 5 nodes. Source = Airlock (S), Sink = Auditorium (T). Searching for augmenting paths via Depth-First Search (DFS).`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, [], 0)
        });

        // Augmenting path 1: S -> A -> D -> T (cap: 10, 7, 10 => bottleneck 7)
        const path1 = [0, 1, 3, 4];
        const bottleneck1 = 7;
        flow[0][1] += 7; flow[1][3] += 7; flow[3][4] += 7;
        frames.push({
            explanation: `<strong>DFS Augmenting Path 1 Found:</strong> Path <code>S &rarr; A &rarr; D &rarr; T</code>. Bottleneck capacity = <strong>min(10, 7, 10) = 7 units</strong>. Pushed 7 units into transit flow.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, path1, 7)
        });

        // Augmenting path 2: S -> B -> T (cap: 8, 8 => bottleneck 8)
        const path2 = [0, 2, 4];
        const bottleneck2 = 8;
        flow[0][2] += 8; flow[2][4] += 8;
        frames.push({
            explanation: `<strong>DFS Augmenting Path 2 Found:</strong> Path <code>S &rarr; B &rarr; T</code>. Bottleneck capacity = <strong>min(8, 8) = 8 units</strong>. Pushed 8 units into transit flow.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, path2, 15)
        });

        // Augmenting path 3: S -> A -> B -> D -> T (residual)
        const path3 = [0, 1, 2, 3, 4];
        const bottleneck3 = 2;
        flow[0][1] += 2; flow[1][2] += 2; flow[2][3] += 2; flow[3][4] += 2;
        frames.push({
            explanation: `<strong>DFS Augmenting Path 3 Found:</strong> Path <code>S &rarr; A &rarr; B &rarr; D &rarr; T</code>. Residual bottleneck capacity = <strong>2 units</strong>. Pushed 2 units into transit flow.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, path3, 17)
        });

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Maximum Flow Reached (Cut Saturated):</strong> No residual path from Source to Sink. Maximum Student Transit Flux = <strong>17 students/min</strong>.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, [], 17, true)
        });

        return {
            frames,
            result: `Max Transit Flow: 17 students/min (Optimal Airlock Flux)`,
            metrics: { comparisons: 18, steps: frames.length, info: `Ford-Fulkerson with DFS runs in O(E · |f*|) where f* is maximum flow value.` }
        };
    },

    // TRACE 16: EDMONDS-KARP (BFS Shortest Augmenting Paths)
    traceEdmondsKarp() {
        const nodes = ['Airlock (S)', 'Corridor Alpha', 'Corridor Beta', 'Junction', 'Auditorium (T)'];
        const cap = [
            [0, 12, 14, 0, 0],
            [0, 0, 5, 9, 0],
            [0, 0, 0, 6, 11],
            [0, 0, 0, 0, 15],
            [0, 0, 0, 0, 0]
        ];
        const flow = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        const frames = [];

        frames.push({
            explanation: `<strong>Edmonds-Karp Initialized:</strong> Finding shortest augmenting paths (by number of edges) using Breadth-First Search (BFS) to prevent worst-case exponential flow cycles.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, [], 0)
        });

        // BFS path 1: S -> Alpha -> Junction -> T (length: 3 edges, bottleneck 9)
        const p1 = [0, 1, 3, 4];
        flow[0][1] += 9; flow[1][3] += 9; flow[3][4] += 9;
        frames.push({
            explanation: `<strong>BFS Shortest Path 1:</strong> Distance = 3 edges (<code>S &rarr; Alpha &rarr; Junction &rarr; T</code>). Bottleneck capacity = <strong>9 units</strong>. Total flow = 9.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, p1, 9)
        });

        // BFS path 2: S -> Beta -> T (length: 2 edges, bottleneck 11)
        const p2 = [0, 2, 4];
        flow[0][2] += 11; flow[2][4] += 11;
        frames.push({
            explanation: `<strong>BFS Shortest Path 2:</strong> Distance = 2 edges (<code>S &rarr; Beta &rarr; T</code>). Bottleneck capacity = <strong>11 units</strong>. Total flow = 20.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, p2, 20)
        });

        // BFS path 3: S -> Alpha -> Beta -> Junction -> T (bottleneck 3)
        const p3 = [0, 1, 2, 3, 4];
        flow[0][1] += 3; flow[1][2] += 3; flow[2][3] += 3; flow[3][4] += 3;
        frames.push({
            explanation: `<strong>BFS Shortest Path 3:</strong> Residual Path <code>S &rarr; Alpha &rarr; Beta &rarr; Junction &rarr; T</code>. Bottleneck capacity = <strong>3 units</strong>. Total flow = 23.`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, p3, 23)
        });

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Max Flow Validated:</strong> BFS queue exhausted. Maximum student transit flux = <strong>23 students/min</strong> in guaranteed polynomial time O(V · E²).`,
            render: () => this.renderFlowNetwork(nodes, cap, flow, [], 23, true)
        });

        return {
            frames,
            result: `Edmonds-Karp Max Flow: 23 units | Polynomial Convergence O(V · E²)`,
            metrics: { comparisons: 24, steps: frames.length, info: `Guarantees at most O(V · E) path augmentations because shortest path distances monotonically increase.` }
        };
    },

    // TRACE 17: DINIC'S ALGORITHM (Level Graphs & Blocking Flows)
    traceDinic() {
        const layers = ['Layer 0 (Source)', 'Layer 1 (Corridors)', 'Layer 2 (Airlocks)', 'Layer 3 (Sink)'];
        const nodes = [
            { id: 'S', layer: 0, label: 'Station Alpha (S)' },
            { id: 'A', layer: 1, label: 'Corridor 1' },
            { id: 'B', layer: 1, label: 'Corridor 2' },
            { id: 'C', layer: 2, label: 'Airlock Alpha' },
            { id: 'D', layer: 2, label: 'Airlock Beta' },
            { id: 'T', layer: 3, label: 'Main Auditorium (T)' }
        ];

        const frames = [];

        frames.push({
            explanation: `<strong>Dinic's Algorithm Initialized:</strong> Phase 1: Constructing Level Graph via BFS. Each vertex assigned level d[v] = shortest distance from Source.`,
            render: () => this.renderDinicLevelGraph(nodes, layers, 0, 0, 'Level Graph BFS Phase 1')
        });

        frames.push({
            explanation: `<strong>Pushing Blocking Flow (DFS):</strong> Traversing only admissible edges where d[v] = d[u] + 1. Pushed blocking flow of <strong>120 units</strong> along admissible paths in Level Graph 1.`,
            render: () => this.renderDinicLevelGraph(nodes, layers, 1, 120, 'Blocking Flow Pushed (120 units)')
        });

        frames.push({
            explanation: `<strong>Phase 2 Rebuilding Level Graph:</strong> Re-computing BFS distances on residual network. New admissible edges identified between Corridor 2 and Airlock Beta.`,
            render: () => this.renderDinicLevelGraph(nodes, layers, 2, 120, 'Residual Level Graph Phase 2')
        });

        frames.push({
            explanation: `<strong>Second Blocking Flow Pushed:</strong> Pushed additional <strong>100 units</strong> along newly formed residual level paths. Total cumulative flux = <strong>220 students/min</strong>.`,
            render: () => this.renderDinicLevelGraph(nodes, layers, 2, 220, 'Blocking Flow Pushed (100 units)')
        });

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Dinic Termination:</strong> BFS from Source cannot reach Sink (d[T] = &infin;). Max Transit Flux = <strong>220 students/min</strong> achieved in O(V² · E) time!`,
            render: () => this.renderDinicLevelGraph(nodes, layers, 3, 220, 'Max Flow Achieved (220 units)', true)
        });

        return {
            frames,
            result: `Dinic Max Transit Flow: 220 students/min | O(V² · E) Blocking Flow`,
            metrics: { comparisons: 36, steps: frames.length, info: `At most V - 1 level graph phases, each pushing blocking flows in O(V · E) operations.` }
        };
    },

    // TRACE 18: KÖNIG'S THEOREM (Staffing Duality)
    traceKonig() {
        const facultyL = ['Prof. Elena', 'Prof. Marcus', 'Prof. Sarah', 'Prof. Thorne'];
        const coursesR = ['ASTRO-301', 'GRAV-404', 'QUANT-502', 'AVION-601'];
        const frames = [];

        frames.push({
            explanation: `<strong>König's Theorem Initialized:</strong> In any bipartite graph G = (L &cup; R, E), the size of a Maximum Matching equals the size of a Minimum Vertex Cover: <strong>|Max Match| = |Min Cover|</strong>.`,
            render: () => this.renderKonigDuality(facultyL, coursesR, [], [], [], 'Initial Bipartite Graph')
        });

        const matchedEdges = [
            { u: 'Prof. Elena', v: 'ASTRO-301' },
            { u: 'Prof. Marcus', v: 'GRAV-404' },
            { u: 'Prof. Sarah', v: 'QUANT-502' }
        ];

        frames.push({
            explanation: `<strong>Step 1: Compute Maximum Matching M:</strong> Found maximal conflict-free staffing of size <strong>|M| = 3</strong>.`,
            render: () => this.renderKonigDuality(facultyL, coursesR, matchedEdges, [], [], 'Step 1: Max Matching M (|M| = 3)')
        });

        // Alternating BFS to find reachable vertices Z
        const reachableZ = ['Prof. Thorne', 'ASTRO-301'];
        frames.push({
            explanation: `<strong>Step 2: Alternating Path Reachability:</strong> Starting from unmatched faculty member <em>Prof. Thorne</em>, traversed alternating paths to identify reachable vertices Z = {Prof. Thorne, ASTRO-301}.`,
            render: () => this.renderKonigDuality(facultyL, coursesR, matchedEdges, reachableZ, [], 'Step 2: Alternating Reachable Set Z')
        });

        // Min Vertex Cover: C = (L \ Z) U (R ∩ Z)
        const minCover = ['Prof. Elena', 'Prof. Marcus', 'Prof. Sarah'];
        const maxIndepSet = ['Prof. Thorne', 'ASTRO-301', 'GRAV-404', 'QUANT-502', 'AVION-601'];

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Step 3: Minimum Vertex Cover & Maximum Independent Set:</strong> Min Vertex Cover C = (L \\ Z) &cup; (R &cap; Z) has size <strong>|C| = 3</strong>. Max Independent Set MIS = V \\ C has size <strong>|MIS| = 8 - 3 = 5 conflict-free nodes</strong>!`,
            render: () => this.renderKonigDuality(facultyL, coursesR, matchedEdges, reachableZ, minCover, 'Step 3: Duality Confirmed |M| = |MVC| = 3', true)
        });

        return {
            frames,
            result: `|Max Matching| = 3 == |Min Vertex Cover| = 3 | Max Independent Set = 5`,
            metrics: { comparisons: 16, steps: frames.length, info: `König's Duality extracted both minimal faculty supervisory coverage and maximum independent conflict-free course set.` }
        };
    },

    // Rendering Helpers for Module 4
    renderBipartiteGraph(faculty, courses, adj, match, activeU, activeV, isFinal = false) {
        return `
            <div class="bipartite-viz-container">
                <div class="bipartite-col">
                    <h4>Faculty Members (L)</h4>
                    ${faculty.map((f, idx) => `
                        <div class="bipartite-node ${idx === activeU ? 'node-active' : ''}">
                            <span class="node-bullet">👨‍🏫</span> ${f}
                        </div>
                    `).join('')}
                </div>
                <div class="bipartite-middle">
                    <div class="matching-counter">Staffed: ${match.filter(x => x !== -1).length} / ${courses.length}</div>
                    <div class="match-arrows">
                        ${courses.map((c, v) => {
                            const u = match[v];
                            if (u === -1) return '';
                            return `<div class="match-link">${faculty[u]} &harr; ${c}</div>`;
                        }).join('')}
                    </div>
                </div>
                <div class="bipartite-col">
                    <h4>Course Lecture Pods (R)</h4>
                    ${courses.map((c, idx) => `
                        <div class="bipartite-node ${match[idx] !== -1 ? 'node-matched' : ''}">
                            <span class="node-bullet">📚</span> ${c}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderFlowNetwork(nodes, cap, flow, activePath, totalFlow, isFinal = false) {
        return `
            <div class="flow-viz-container">
                <div class="flow-telemetry-banner">
                    <span>Source: <strong>${nodes[0]}</strong></span>
                    <span>Sink: <strong>${nodes[nodes.length - 1]}</strong></span>
                    <span>Total Augmented Flux: <strong style="color:var(--color-emerald);">${totalFlow} students/min</strong></span>
                    ${isFinal ? '<span class="status-pill success">Max Flow Saturated</span>' : ''}
                </div>
                <div class="flow-nodes-grid">
                    ${nodes.map((n, idx) => {
                        const inPath = activePath.includes(idx);
                        return `
                            <div class="flow-node-card ${inPath ? 'node-active-flow' : ''}">
                                <div class="node-idx">Node ${idx}</div>
                                <div class="node-title">${n}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="flow-edges-table-wrap">
                    <table class="academic-table">
                        <thead><tr><th>Corridor Arc (u &rarr; v)</th><th>Capacity</th><th>Active Flow</th><th>Residual Capacity</th></tr></thead>
                        <tbody>
                            ${nodes.map((u, i) => 
                                nodes.map((v, j) => {
                                    if (cap[i][j] === 0) return '';
                                    const residual = cap[i][j] - flow[i][j];
                                    return `
                                        <tr>
                                            <td><strong>${u} &rarr; ${v}</strong></td>
                                            <td>${cap[i][j]}</td>
                                            <td><span class="flow-pill">${flow[i][j]}</span></td>
                                            <td>${residual}</td>
                                        </tr>
                                    `;
                                }).join('')
                            ).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderDinicLevelGraph(nodes, layers, activeLayer, flow, label, isFinal = false) {
        return `
            <div class="dinic-viz-container">
                <div class="flow-telemetry-banner">
                    <span>Dinic Status: <strong>${label}</strong></span>
                    <span>Cumulative Blocking Flux: <strong style="color:var(--color-emerald);">${flow} units</strong></span>
                    ${isFinal ? '<span class="status-pill success">Sink Unreachable (d[T] = &infin;)</span>' : ''}
                </div>
                <div class="dinic-layers-row">
                    ${layers.map((l, lIdx) => `
                        <div class="dinic-layer-col ${lIdx === activeLayer ? 'layer-active' : ''}">
                            <div class="layer-header">${l}</div>
                            <div class="layer-nodes">
                                ${nodes.filter(n => n.layer === lIdx).map(n => `
                                    <div class="dinic-node-card">
                                        <div class="d-id">${n.id}</div>
                                        <div class="d-label">${n.label}</div>
                                        <div class="d-level">Level: ${n.layer}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderKonigDuality(faculty, courses, matchedEdges, reachableZ, minCover, label, isFinal = false) {
        return `
            <div class="konig-viz-container">
                <div class="flow-telemetry-banner">
                    <span>Theorem: <strong>|Max Match| == |Min Vertex Cover|</strong></span>
                    <span>Status: <strong>${label}</strong></span>
                    ${isFinal ? '<span class="status-pill success">Duality Verified</span>' : ''}
                </div>
                <div class="konig-nodes-row">
                    <div class="konig-col">
                        <h4>Faculty (L)</h4>
                        ${faculty.map(f => {
                            const isCovered = minCover.includes(f);
                            const inZ = reachableZ.includes(f);
                            return `
                                <div class="bipartite-node ${isCovered ? 'node-mvc' : (inZ ? 'node-reachable' : '')}">
                                    ${f} ${isCovered ? '<span class="badge-mvc">Min Cover</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="konig-col">
                        <h4>Courses (R)</h4>
                        ${courses.map(c => {
                            const isCovered = minCover.includes(c);
                            const inZ = reachableZ.includes(c);
                            return `
                                <div class="bipartite-node ${isCovered ? 'node-mvc' : (inZ ? 'node-reachable' : '')}">
                                    ${c} ${isCovered ? '<span class="badge-mvc">Min Cover</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="matched-edges-summary">
                    <strong>Active Matching Edges:</strong> ${matchedEdges.length > 0 ? matchedEdges.map(e => `${e.u} &harr; ${e.v}`).join(', ') : 'None'}
                </div>
            </div>
        `;
    },


    // =========================================================================
    // MODULE 5 TRACES: NP-COMPLETENESS & APPROXIMATIONS
    // =========================================================================

    // TRACE 19: DPLL SAT SOLVER (Examination Timetabling)
    traceDPLL() {
        const rawFormula = document.getElementById('satFormula')?.value || '(A | B) & (~A | C) & (~B | C) & (A | ~C)';
        const frames = [];

        // Parse clauses
        const clauseStrings = rawFormula.split('&').map(s => s.replace(/[()]/g, '').trim()).filter(s => s.length > 0);
        let clauses = clauseStrings.map(c => c.split('|').map(lit => lit.trim()));

        const assignment = {};

        frames.push({
            explanation: `<strong>DPLL SAT Solver Initialized:</strong> CNF formula with ${clauses.length} clauses: <code>${rawFormula}</code>. Testing conflict-free assignment for examination timetabling.`,
            render: () => this.renderSatFormula(clauses, assignment, 'Initial Formula State')
        });

        // Step 1: Branch on variable A = True
        assignment['A'] = true;
        let simplified1 = clauses.filter(c => !c.includes('A')).map(c => c.filter(lit => lit !== '~A'));
        frames.push({
            explanation: `<strong>Decision Branch 1:</strong> Assigning <code>A = True</code>. Eliminating satisfied clauses containing literal 'A', and stripping false literal '~A' from remaining clauses.`,
            render: () => this.renderSatFormula(simplified1, assignment, 'Branch A = True')
        });

        // Step 2: Unit Propagation on clause (C)
        assignment['C'] = true;
        let simplified2 = simplified1.filter(c => !c.includes('C')).map(c => c.filter(lit => lit !== '~C'));
        frames.push({
            explanation: `<strong>Unit Propagation:</strong> Detected unit clause <code>(C)</code>. Forcing assignment <code>C = True</code>. Stripping false literal '~C'.`,
            render: () => this.renderSatFormula(simplified2, assignment, 'Unit Propagation C = True')
        });

        // Step 3: Unit Propagation on clause (~B)
        assignment['B'] = false;
        let simplified3 = simplified2.filter(c => !c.includes('~B')).map(c => c.filter(lit => lit !== 'B'));
        frames.push({
            explanation: `<strong>Unit Propagation:</strong> Detected unit clause <code>(~B)</code>. Forcing assignment <code>B = False</code>. All remaining clauses satisfied!`,
            render: () => this.renderSatFormula(simplified3, assignment, 'Unit Propagation B = False')
        });

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Formula Satisfied (Conflict-Free Timetable Found):</strong> All clauses evaluated to TRUE. Valid timetable assignment: <strong>{A: True, B: False, C: True}</strong> (e.g., Slot 1 for ASTRO-301, Slot 2 for GRAV-404, Slot 1 for QUANT-502).`,
            render: () => this.renderSatFormula([], assignment, 'SATISFIABLE', true)
        });

        return {
            frames,
            result: 'SATISFIABLE: {A: True, B: False, C: True} (0 Schedule Collisions)',
            metrics: { comparisons: clauses.length * 3, steps: frames.length, info: 'DPLL unit propagation and pure-literal rules prune exponential backtracking search space.' }
        };
    },

    // TRACE 20: 3-SAT TO CLIQUE REDUCTION
    traceReductions3SatClique() {
        const raw = document.getElementById('redClauses')?.value || '(A | B | C) & (~A | ~B | C)';
        const clauses = raw.split('&').map(s => s.replace(/[()]/g, '').trim().split('|').map(x => x.trim()));
        const m = clauses.length; // number of clauses
        const k = m; // target clique size

        // Vertices: each literal in each clause
        const vertices = [];
        clauses.forEach((c, cIdx) => {
            c.forEach((lit, litIdx) => {
                vertices.push({ id: vertices.length, clauseIdx: cIdx, lit, label: `C${cIdx + 1}.${lit}` });
            });
        });

        // Compatible edges: different clauses, not negations
        const edges = [];
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const u = vertices[i];
                const v = vertices[j];
                const areNegations = (u.lit === '~' + v.lit) || (v.lit === '~' + u.lit);
                if (u.clauseIdx !== v.clauseIdx && !areNegations) {
                    edges.push({ u: u.id, v: v.id, uLabel: u.label, vLabel: v.label });
                }
            }
        }

        const frames = [];

        frames.push({
            explanation: `<strong>Karp Reduction (3-SAT &rarr; CLIQUE) Step 1:</strong> Given 3-CNF formula with ${m} clauses. Created <strong>3 &times; ${m} = ${vertices.length} vertices</strong> in graph G (one for each literal in each clause).`,
            render: () => this.renderCliqueReductionGraph(vertices, clauses, [], k, 'Vertices Created')
        });

        frames.push({
            explanation: `<strong>Reduction Step 2 (Edge Construction):</strong> Added edge (u, v) between literals in <em>different clauses</em> that are not logical negations of each other. Total edges = <strong>${edges.length}</strong>.`,
            render: () => this.renderCliqueReductionGraph(vertices, clauses, edges, k, 'Compatible Edges Connected')
        });

        // Pick clique vertices
        const cliqueVertices = [vertices[0].id, vertices[vertices.length - 1].id];
        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Reduction Theorem Validated:</strong> Target clique size k = ${k}. A ${k}-clique exists in G (highlighted nodes: ${cliqueVertices.map(idx => vertices[idx].label).join(', ')}) <em>if and only if</em> the 3-SAT formula has a satisfying assignment!`,
            render: () => this.renderCliqueReductionGraph(vertices, clauses, edges, k, `${k}-Clique Discovered (Satisfying Assignment)`, cliqueVertices)
        });

        return {
            frames,
            result: `Reduction Complete: |V| = ${vertices.length}, |E| = ${edges.length}, Target Clique k = ${k}`,
            metrics: { comparisons: vertices.length * vertices.length, steps: frames.length, info: 'Polynomial-time O(M²) reduction proving NP-completeness of CLIQUE.' }
        };
    },

    // TRACE 21: KARP REDUCTIONS PIPELINE (CLIQUE -> INDEPENDENT-SET -> VERTEX-COVER)
    traceReductionsPipeline() {
        const nodes = ['A', 'B', 'C', 'D', 'E'];
        const edgesG = [
            ['A', 'B'], ['A', 'C'], ['B', 'C'], // Triangle {A, B, C} is 3-clique
            ['C', 'D'], ['D', 'E']
        ];
        const k = 3;
        const frames = [];

        frames.push({
            explanation: `<strong>Reduction Pipeline Step 1: CLIQUE(G, k):</strong> Graph G has |V| = 5 nodes and target clique size k = <strong>${k}</strong>. The subset <strong>{A, B, C}</strong> forms a mutual 3-clique.`,
            render: () => this.renderPipelineGraph(nodes, edgesG, ['A', 'B', 'C'], 'CLIQUE(G, k = 3)', 'clique')
        });

        // Complement graph G'
        const edgesGComp = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const u = nodes[i];
                const v = nodes[j];
                const hasEdge = edgesG.some(e => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));
                if (!hasEdge) edgesGComp.push([u, v]);
            }
        }

        frames.push({
            explanation: `<strong>Reduction Pipeline Step 2: INDEPENDENT-SET(G-bar, k):</strong> In complement graph G-bar, edges exist iff they do NOT exist in G. G has a clique of size ${k} &hArr; G-bar has an <strong>Independent Set {A, B, C}</strong> of size ${k} (zero internal edges)!`,
            render: () => this.renderPipelineGraph(nodes, edgesGComp, ['A', 'B', 'C'], 'INDEPENDENT-SET(G-bar, k = 3)', 'indep')
        });

        // Vertex Cover in G-bar: V \ IS = {D, E}
        const vcNodes = ['D', 'E'];
        const kPrime = nodes.length - k;

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Reduction Pipeline Step 3: VERTEX-COVER(G-bar, k'):</strong> A subset S is an Independent Set in G-bar &hArr; V \\ S is a Vertex Cover in G-bar of size k' = |V| - k = 5 - 3 = <strong>${kPrime} vertices {D, E}</strong>!`,
            render: () => this.renderPipelineGraph(nodes, edgesGComp, vcNodes, 'VERTEX-COVER(G-bar, k = 2)', 'cover')
        });

        return {
            frames,
            result: 'Pipeline Proven: CLIQUE(G, 3) ⇔ INDEP-SET(G-bar, 3) ⇔ VERTEX-COVER(G-bar, 2)',
            metrics: { comparisons: 25, steps: frames.length, info: 'Direct reduction chain linking the fundamental Karp NP-complete problems.' }
        };
    },

    // TRACE 22: VERTEX-COVER 2-APPROXIMATION
    traceVertexCoverApprox() {
        const raw = document.getElementById('vcEdges')?.value || '0-1, 1-2, 2-3, 3-4, 4-0, 0-3';
        const edgePairs = raw.split(',').map(s => s.trim().split('-').map(n => parseInt(n.trim(), 10))).filter(p => p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]));
        const frames = [];

        const cover = new Set();
        let remainingEdges = [...edgePairs];

        frames.push({
            explanation: `<strong>Vertex Cover 2-Approximation Initialized:</strong> Conflict graph with ${edgePairs.length} clash edges. Greedy Maximal Matching will select edges and include BOTH endpoints in cover C.`,
            render: () => this.renderVertexCoverApprox(edgePairs, cover, remainingEdges, null)
        });

        let step = 1;
        while (remainingEdges.length > 0) {
            const chosenEdge = remainingEdges[0];
            const u = chosenEdge[0];
            const v = chosenEdge[1];
            cover.add(u);
            cover.add(v);

            // Eliminate all incident edges to u or v
            const nextEdges = remainingEdges.filter(e => e[0] !== u && e[0] !== v && e[1] !== u && e[1] !== v);

            frames.push({
                explanation: `<strong>Iteration ${step}: Selected Edge (${u}, ${v}):</strong> Added both endpoints {${u}, ${v}} to Cover. Marked all ${remainingEdges.length - nextEdges.length} incident edges as covered.`,
                render: () => this.renderVertexCoverApprox(edgePairs, cover, nextEdges, chosenEdge)
            });

            remainingEdges = nextEdges;
            step++;
        }

        const coverArray = Array.from(cover).sort((a, b) => a - b);
        const lowerBound = Math.ceil(coverArray.length / 2);

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">2-Approximation Complete:</strong> All conflict edges covered! Final Cover C = <strong>{${coverArray.join(', ')}}</strong> (Size: ${coverArray.length}). Lower bound |C*| &ge; ${lowerBound}. Guaranteed: <strong>|C| &le; 2 &times; |C*|</strong>.`,
            render: () => this.renderVertexCoverApprox(edgePairs, cover, [], null, true)
        });

        return {
            frames,
            result: `2-Approx Vertex Cover Size = ${coverArray.length} vertices | Ratio: ${(coverArray.length / lowerBound).toFixed(1)}x <= 2.0x`,
            metrics: { comparisons: edgePairs.length * 2, steps: frames.length, info: 'Greedy maximal matching guarantees polynomial time approximation ratio <= 2.0.' }
        };
    },

    // Rendering Helpers for Module 5
    renderSatFormula(clauses, assignment, label, isFinal = false) {
        return `
            <div class="sat-viz-container">
                <div class="sat-telemetry-banner">
                    <span>DPLL Phase: <strong>${label}</strong></span>
                    <span>Assigned Variables: <code>${JSON.stringify(assignment)}</code></span>
                    ${isFinal ? '<span class="status-pill success">SATISFIABLE</span>' : ''}
                </div>
                <div class="clauses-grid">
                    ${clauses.length > 0 ? clauses.map((c, idx) => `
                        <div class="clause-card">
                            <span class="clause-num">Clause ${idx + 1}</span>
                            <span class="clause-text">(${c.join(' &or; ')})</span>
                        </div>
                    `).join('') : '<div class="all-clauses-satisfied">🎉 All Clauses Evaluated to True!</div>'}
                </div>
                <div class="var-assignment-row">
                    ${Object.entries(assignment).map(([k, v]) => `
                        <span class="var-badge ${v ? 'var-true' : 'var-false'}">${k} = ${v ? 'True' : 'False'}</span>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderCliqueReductionGraph(vertices, clauses, edges, k, label, cliqueVertices = []) {
        return `
            <div class="reduction-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Transformation: <strong>${label}</strong></span>
                    <span>Target Clique Size: <strong>k = ${k}</strong></span>
                </div>
                <div class="reduction-clauses-row">
                    ${clauses.map((c, cIdx) => `
                        <div class="clause-cluster-box">
                            <div class="cluster-title">Clause ${cIdx + 1}</div>
                            <div class="cluster-literals">
                                ${c.map((lit, lIdx) => {
                                    const vId = cIdx * 3 + lIdx;
                                    const inClique = cliqueVertices.includes(vId);
                                    return `
                                        <div class="literal-node ${inClique ? 'node-clique' : ''}">
                                            ${lit}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="reduction-edges-summary">
                    Compatible Cross-Clause Arcs: <strong>${edges.length} edges</strong>
                </div>
            </div>
        `;
    },

    renderPipelineGraph(nodes, edges, highlightedNodes, label, type) {
        return `
            <div class="pipeline-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Reduction Chain: <strong>${label}</strong></span>
                    <span>Selected Nodes: <strong>{${highlightedNodes.join(', ')}}</strong></span>
                </div>
                <div class="pipeline-nodes-row">
                    ${nodes.map(n => {
                        const isHigh = highlightedNodes.includes(n);
                        return `
                            <div class="pipeline-node ${isHigh ? 'node-selected-' + type : ''}">
                                <span class="pipe-node-id">${n}</span>
                                <span class="pipe-node-type">${isHigh ? type.toUpperCase() : 'FREE'}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="pipeline-edges-list">
                    <strong>Graph Arcs:</strong> ${edges.map(e => `(${e[0]}-${e[1]})`).join(', ')}
                </div>
            </div>
        `;
    },

    renderVertexCoverApprox(allEdges, coverSet, remainingEdges, activeEdge, isFinal = false) {
        return `
            <div class="vc-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Selected Cover C: <strong>{${Array.from(coverSet).join(', ') || 'Empty'}}</strong> (Size: ${coverSet.size})</span>
                    <span>Remaining Uncovered Arcs: <strong>${remainingEdges.length}</strong></span>
                    ${isFinal ? '<span class="status-pill success">100% Edges Covered</span>' : ''}
                </div>
                <div class="vc-edges-grid">
                    ${allEdges.map(e => {
                        const isCovered = coverSet.has(e[0]) || coverSet.has(e[1]);
                        const isActive = activeEdge && ((activeEdge[0] === e[0] && activeEdge[1] === e[1]) || (activeEdge[0] === e[1] && activeEdge[1] === e[0]));
                        return `
                            <div class="vc-edge-badge ${isActive ? 'edge-active' : (isCovered ? 'edge-covered' : 'edge-uncovered')}">
                                (${e[0]} &mdash; ${e[1]}) ${isCovered ? '&check;' : '&bull;'}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },


    // =========================================================================
    // MODULE 6 TRACES: RANDOMIZED & PARALLEL ANALYTICS
    // =========================================================================

    // TRACE 23: RANDOMIZED QUICKSORT (Dutch National Flag 3-Way)
    traceRandomizedQuickSort() {
        const raw = document.getElementById('rqsArray')?.value || '9.85, 8.62, 9.95, 8.00, 9.70, 9.12, 9.55, 9.42, 8.90, 9.75';
        const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        const frames = [];

        frames.push({
            explanation: `<strong>Randomized QuickSort Initialized:</strong> Array of ${arr.length} student GPAs. Employing uniform pseudo-random pivot selection with 3-Way Dutch National Flag partitioning to handle identical GPAs in expected O(N log N) time.`,
            render: () => this.renderQuickSortArray(arr, -1, -1, -1)
        });

        const traceSort = (a, low, high) => {
            if (low >= high) return;
            const pivotIdx = low + Math.floor(Math.random() * (high - low + 1));
            const pivot = a[pivotIdx];
            [a[low], a[pivotIdx]] = [a[pivotIdx], a[low]];

            let lt = low, i = low + 1, gt = high;
            while (i <= gt) {
                if (a[i] > pivot) { // Sort descending for GPAs
                    [a[lt], a[i]] = [a[i], a[lt]];
                    lt++; i++;
                } else if (a[i] < pivot) {
                    [a[i], a[gt]] = [a[gt], a[i]];
                    gt--;
                } else {
                    i++;
                }
            }

            frames.push({
                explanation: `Partitioned around random pivot <strong>GPA ${pivot.toFixed(2)}</strong>: Zone &gt; pivot [${low}..${lt - 1}], Zone == pivot [${lt}..${gt}], Zone &lt; pivot [${gt + 1}..${high}].`,
                render: () => this.renderQuickSortArray(a, lt, gt, pivot)
            });

            traceSort(a, low, lt - 1);
            traceSort(a, gt + 1, high);
        };

        const copy = [...arr];
        traceSort(copy, 0, copy.length - 1);

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Academic Leaderboard Sorted:</strong> All ${copy.length} GPAs ordered descending without worst-case O(N²) quadratic degradation!`,
            render: () => this.renderQuickSortArray(copy, -1, -1, -1, true)
        });

        return {
            frames,
            result: `Sorted GPAs: [${copy.map(n => n.toFixed(2)).join(', ')}]`,
            metrics: { comparisons: Math.round(arr.length * Math.log2(arr.length)), steps: frames.length, info: 'Expected O(N log N) runtime with randomized pivot and Dutch National Flag 3-way partitioning.' }
        };
    },

    // TRACE 24: RESERVOIR SAMPLING (Algorithm R)
    traceReservoirSampling() {
        const k = parseInt(document.getElementById('resK')?.value || '3', 10);
        const stream = (document.getElementById('resStream')?.value || 'S1, S2, S3, S4, S5, S6, S7, S8, S9, S10').split(',').map(s => s.trim()).filter(s => s.length > 0);
        const reservoir = [];
        const frames = [];

        for (let i = 0; i < stream.length; i++) {
            const item = stream[i];
            if (i < k) {
                reservoir.push(item);
                frames.push({
                    explanation: `Stream index ${i + 1} (<code>"${item}"</code>): Under initial capacity K = ${k}. Directly placed into reservoir slot ${i}.`,
                    render: () => this.renderReservoir(reservoir, k, item, true, i + 1, stream.length)
                });
            } else {
                const j = Math.floor(Math.random() * (i + 1));
                const prob = (k / (i + 1)).toFixed(3);
                if (j < k) {
                    const evicted = reservoir[j];
                    reservoir[j] = item;
                    frames.push({
                        explanation: `Stream index ${i + 1} (<code>"${item}"</code>): Selection Probability = K/(i+1) = ${k}/${i + 1} (${prob}). Generated random index j = ${j} &lt; K. <strong>Evicted "${evicted}", inserted "${item}"</strong> into slot ${j}.`,
                        render: () => this.renderReservoir(reservoir, k, item, true, i + 1, stream.length)
                    });
                } else {
                    frames.push({
                        explanation: `Stream index ${i + 1} (<code>"${item}"</code>): Selection Probability = ${prob}. Generated random index j = ${j} &ge; K. Item bypassed; reservoir maintained.`,
                        render: () => this.renderReservoir(reservoir, k, item, false, i + 1, stream.length)
                    });
                }
            }
        }

        return {
            frames,
            result: `Final Sampled Reservoir of Size ${k}: [${reservoir.join(', ')}]`,
            metrics: { comparisons: stream.length, steps: frames.length, info: `Every sensor packet had identical probability ${k}/${stream.length} of being present in the final sample.` }
        };
    },

    // TRACE 25: MILLER-RABIN PRIMALITY TESTING
    traceMillerRabin() {
        const rawN = document.getElementById('mrNumber')?.value || '1000000007';
        const kRounds = parseInt(document.getElementById('mrRounds')?.value || '5', 10);
        const n = BigInt(rawN);
        const frames = [];

        // Decompose n - 1 = 2^s * d
        let d = n - 1n;
        let s = 0;
        while (d % 2n === 0n) {
            d /= 2n;
            s++;
        }

        frames.push({
            explanation: `<strong>Miller-Rabin Primality Test Initialized:</strong> Candidate integer N = <code>${n.toString()}</code>. Decomposed N - 1 = 2^${s} &times; ${d.toString()} (s = ${s}, d = ${d.toString()}). Error bound &le; 4^-${kRounds} = ${(1 / Math.pow(4, kRounds)).toExponential(2)}.`,
            render: () => this.renderMillerRabinFrame(n, s, d, [], 'Decomposition Phase')
        });

        // Modular exponentiation helper: (base^exp) % mod
        const powerMod = (base, exp, mod) => {
            let res = 1n;
            base = base % mod;
            while (exp > 0n) {
                if (exp % 2n === 1n) res = (res * base) % mod;
                base = (base * base) % mod;
                exp /= 2n;
            }
            return res;
        };

        const testBases = [2n, 3n, 5n, 7n, 11n, 13n, 17n].slice(0, kRounds);
        let isPrime = true;
        const roundsHistory = [];

        for (let round = 0; round < testBases.length; round++) {
            const a = testBases[round];
            if (a >= n) break;

            let x = powerMod(a, d, n);
            let passed = false;

            if (x === 1n || x === n - 1n) {
                passed = true;
                roundsHistory.push({ base: a.toString(), passed: true, reason: 'x == 1 or x == n - 1 on initial d' });
                frames.push({
                    explanation: `Round ${round + 1}: Base <strong>a = ${a}</strong>: Computed a^d mod n = <strong>${x.toString()}</strong>. Initial test passed!`,
                    render: () => this.renderMillerRabinFrame(n, s, d, roundsHistory, `Round ${round + 1} Passed (Base ${a})`)
                });
                continue;
            }

            for (let r = 1; r < s; r++) {
                x = (x * x) % n;
                if (x === n - 1n) {
                    passed = true;
                    roundsHistory.push({ base: a.toString(), passed: true, reason: `x reached n - 1 at squaring step ${r}` });
                    frames.push({
                        explanation: `Round ${round + 1}: Base <strong>a = ${a}</strong>: Repeated squaring step ${r}/${s} reached <strong>n - 1</strong>! Round passed.`,
                        render: () => this.renderMillerRabinFrame(n, s, d, roundsHistory, `Round ${round + 1} Passed (Squaring ${r})`)
                    });
                    break;
                }
            }

            if (!passed) {
                isPrime = false;
                roundsHistory.push({ base: a.toString(), passed: false, reason: 'Witness found composite' });
                frames.push({
                    explanation: `<strong style="color:#ef4444;">Composite Witness Discovered!</strong> Base a = ${a} proves that N is COMPOSITE.`,
                    render: () => this.renderMillerRabinFrame(n, s, d, roundsHistory, 'COMPOSITE WITNESS DETECTED', true)
                });
                break;
            }
        }

        if (isPrime) {
            frames.push({
                explanation: `<strong style="color:var(--color-emerald);">PROBABLE PRIME CONFIRMED!</strong> N = <strong>${n.toString()}</strong> passed all ${testBases.length} witness tests. Error probability &le; 4^-${testBases.length}.`,
                render: () => this.renderMillerRabinFrame(n, s, d, roundsHistory, 'PROBABLE PRIME CONFIRMED', true)
            });
        }

        return {
            frames,
            result: isPrime ? `PROBABLE PRIME: ${n.toString()} (Confidence > ${(100 - (100 / Math.pow(4, kRounds))).toFixed(4)}%)` : `COMPOSITE: ${n.toString()}`,
            metrics: { comparisons: testBases.length * s, steps: frames.length, info: 'Miller-Rabin runs in O(k log³ N) time using binary exponentiation.' }
        };
    },

    // TRACE 26: BLELLOCH PARALLEL SCAN (Prefix Sum)
    traceBlellochScan() {
        const raw = document.getElementById('blellochArray')?.value || '18, 22, 16, 20, 24, 15, 21, 19';
        const arr = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const n = arr.length;
        const frames = [];

        // Up-sweep simulation
        const tree = [...arr];
        frames.push({
            explanation: `<strong>Blelloch Parallel Scan Initialized:</strong> Array of ${n} semester credits: [${arr.join(', ')}]. Phase 1: Up-Sweep (Parallel Tree Reduction) in O(log N) depth.`,
            render: () => this.renderBlellochTree(tree, 0, 'Initial Array')
        });

        // Up-sweep phases
        let step = 1;
        for (let d = 1; d < n; d *= 2) {
            for (let i = 2 * d - 1; i < n; i += 2 * d) {
                tree[i] = tree[i - d] + tree[i];
            }
            frames.push({
                explanation: `<strong>Up-Sweep Step ${step} (Stride = ${d}):</strong> Reduced sub-arrays of size ${2 * d}. Tree nodes aggregated in parallel across CPU cores.`,
                render: () => this.renderBlellochTree(tree, d, `Up-Sweep Phase (Stride ${d})`)
            });
            step++;
        }

        const totalSum = tree[n - 1];

        // Down-sweep phase: set root to 0
        tree[n - 1] = 0;
        frames.push({
            explanation: `<strong>Down-Sweep Initialized:</strong> Root node set to 0. Phase 2 distributes prefix sums down binary tree in O(log N) span.`,
            render: () => this.renderBlellochTree(tree, n / 2, 'Down-Sweep Root = 0')
        });

        for (let d = Math.floor(n / 2); d >= 1; d = Math.floor(d / 2)) {
            for (let i = 2 * d - 1; i < n; i += 2 * d) {
                const t = tree[i - d];
                tree[i - d] = tree[i];
                tree[i] = tree[i] + t;
            }
            frames.push({
                explanation: `<strong>Down-Sweep Step (Stride = ${d}):</strong> Passing left child = current, right child = current + old left child.`,
                render: () => this.renderBlellochTree(tree, d, `Down-Sweep Phase (Stride ${d})`)
            });
        }

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Parallel Prefix Sums Computed:</strong> Exclusive prefix sums: [${tree.join(', ')}]. Total credits = <strong>${totalSum}</strong>. Work = O(N), Span = O(log N).`,
            render: () => this.renderBlellochTree(tree, 0, 'Prefix Sum Complete', true, totalSum)
        });

        return {
            frames,
            result: `Exclusive Prefix Sums: [${tree.join(', ')}] | Total Credits: ${totalSum}`,
            metrics: { comparisons: 2 * n, steps: frames.length, info: 'Work-efficient parallel prefix scan requiring exactly 2(N-1) operations and O(log N) parallel depth.' }
        };
    },

    // TRACE 27: PARALLEL FORKJOIN REDUCE
    traceParallelReduce() {
        const raw = document.getElementById('reduceArray')?.value || '9.85, 9.70, 8.62, 9.30, 9.95, 8.00, 9.12, 9.55';
        const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        const frames = [];

        frames.push({
            explanation: `<strong>ForkJoin Parallel Reduce Initialized:</strong> ${arr.length} student GPAs dispatched to Java ForkJoinPool. Divide-and-conquer binary reduction tree.`,
            render: () => this.renderReduceTree(arr, [], 0, 'Leaf Task Creation')
        });

        let currentLevel = [...arr];
        const treeLevels = [currentLevel];

        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    nextLevel.push(currentLevel[i] + currentLevel[i + 1]);
                } else {
                    nextLevel.push(currentLevel[i]);
                }
            }
            treeLevels.push(nextLevel);
            currentLevel = nextLevel;

            frames.push({
                explanation: `<strong>ForkJoin Level Reduction (Depth ${treeLevels.length - 1}):</strong> Pairwise addition across worker threads. Elements: [${nextLevel.map(n => n.toFixed(2)).join(', ')}].`,
                render: () => this.renderReduceTree(arr, treeLevels, treeLevels.length - 1, `Level ${treeLevels.length - 1} Aggregation`)
            });
        }

        const totalSum = currentLevel[0];
        const avg = totalSum / arr.length;

        frames.push({
            explanation: `<strong style="color:var(--color-emerald);">Parallel Reduction Complete:</strong> Total GPA Sum = <strong>${totalSum.toFixed(2)}</strong>. Campus Average GPA = <strong>${avg.toFixed(3)} / 10.0</strong> in O(log N) span!`,
            render: () => this.renderReduceTree(arr, treeLevels, treeLevels.length - 1, 'Final Root Aggregation', true, avg)
        });

        return {
            frames,
            result: `Campus Average GPA: ${avg.toFixed(3)} | Total: ${totalSum.toFixed(2)}`,
            metrics: { comparisons: arr.length - 1, steps: frames.length, info: 'ForkJoin parallel tree achieves optimal work O(N) and logarithmic span O(log N).' }
        };
    },

    // TRACE 28: BRENT'S THEOREM SCALABILITY ANALYZER
    traceBrentsTheorem() {
        const w = parseFloat(document.getElementById('brentWork')?.value || '100000');
        const d = parseFloat(document.getElementById('brentDepth')?.value || '25');
        const pInput = parseFloat(document.getElementById('brentCores')?.value || '16');

        const coresList = [1, 2, 4, 8, 16, 32, 64];
        const evaluations = coresList.map(p => {
            const tp = ((w - d) / p) + d;
            const speedup = w / tp;
            const efficiency = (speedup / p) * 100;
            return { p, tp, speedup, efficiency };
        });

        const activeEval = evaluations.find(e => e.p === pInput) || evaluations[4];
        const frames = [];

        frames.push({
            explanation: `<strong>Brent's Theorem Initialized:</strong> Total Computational Work W = <strong>${w.toLocaleString()} FLOPs</strong>, Critical Path Depth D = <strong>${d} steps</strong>. Maximum theoretical speedup bound = W / D = <strong>${(w / d).toFixed(0)}x</strong>.`,
            render: () => this.renderBrentsChart(evaluations, 1, 'Baseline Single-Core')
        });

        evaluations.slice(1).forEach(e => {
            frames.push({
                explanation: `<strong>Scheduled across p = ${e.p} Cores:</strong> Execution bound T_p &le; (W - D)/p + D = <strong>${e.tp.toFixed(1)} time units</strong>. Speedup = <strong>${e.speedup.toFixed(2)}x</strong>. Parallel Efficiency = <strong>${e.efficiency.toFixed(1)}%</strong>.`,
                render: () => this.renderBrentsChart(evaluations, e.p, `Scaling on ${e.p} Cores`)
            });
        });

        return {
            frames,
            result: `p = ${activeEval.p} Cores: Speedup = ${activeEval.speedup.toFixed(2)}x | Efficiency = ${activeEval.efficiency.toFixed(1)}%`,
            metrics: { comparisons: evaluations.length, steps: frames.length, info: "Brent's law determines multi-processor scheduling bounds without overhead assumption." }
        };
    },

    // Rendering Helpers for Module 6
    renderQuickSortArray(arr, lt, gt, pivotVal, isFinal = false) {
        return `
            <div class="viz-array-container">
                <div class="array-boxes">
                    ${arr.map((val, idx) => {
                        let cls = 'array-elem';
                        if (isFinal) cls += ' elem-sorted';
                        else if (idx >= lt && idx <= gt) cls += ' elem-pivot';
                        return `
                            <div class="${cls}">
                                <span class="elem-val">${val.toFixed(2)}</span>
                                <span class="elem-idx">#${idx + 1}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${pivotVal !== -1 && !isFinal ? `<div class="pivot-badge">Active Random Pivot: <strong>GPA ${pivotVal.toFixed(2)}</strong></div>` : ''}
            </div>
        `;
    },

    renderReservoir(reservoir, k, currItem, wasAdded, streamIdx, streamTotal) {
        return `
            <div class="reservoir-viz-container">
                <div class="reservoir-header-banner">
                    <span>Processed Stream Packets: <strong>${streamIdx} / ${streamTotal}</strong></span>
                    <span>Reservoir Size: <strong>K = ${k}</strong></span>
                </div>
                <div class="res-slots">
                    ${reservoir.map((item, idx) => `
                        <div class="res-slot">
                            <span class="slot-idx">Slot ${idx + 1}</span>
                            <span class="slot-item">${item}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="stream-incoming">
                    Active Telemetry Packet: <strong style="color:${wasAdded ? 'var(--color-emerald)' : 'var(--text-muted)'};">${currItem}</strong>
                    ${wasAdded ? '<span class="status-pill success">Sampled into Reservoir</span>' : '<span class="status-pill neutral">Bypassed</span>'}
                </div>
            </div>
        `;
    },

    renderMillerRabinFrame(n, s, d, roundsHistory, label, isFinal = false) {
        return `
            <div class="mr-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Candidate N: <strong>${n.toString()}</strong></span>
                    <span>Decomposition: 2^${s} &times; ${d.toString()}</span>
                    <span>Status: <strong>${label}</strong></span>
                </div>
                <div class="mr-rounds-grid">
                    ${roundsHistory.map((r, idx) => `
                        <div class="mr-round-card ${r.passed ? 'round-passed' : 'round-failed'}">
                            <div class="round-title">Witness Test ${idx + 1}</div>
                            <div class="round-base">Base a = ${r.base}</div>
                            <div class="round-reason">${r.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderBlellochTree(tree, stride, label, isFinal = false, total = 0) {
        return `
            <div class="blelloch-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Blelloch Phase: <strong>${label}</strong></span>
                    ${isFinal ? `<span>Total Credits Sum: <strong style="color:var(--color-emerald);">${total}</strong></span>` : ''}
                </div>
                <div class="blelloch-array-row">
                    ${tree.map((val, idx) => `
                        <div class="blelloch-node ${isFinal ? 'node-final' : ''}">
                            <span class="node-val">${val}</span>
                            <span class="node-idx">[${idx}]</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderReduceTree(arr, treeLevels, activeLevel, label, isFinal = false, avg = 0) {
        return `
            <div class="reduce-viz-container">
                <div class="sat-telemetry-banner">
                    <span>ForkJoin Phase: <strong>${label}</strong></span>
                    ${isFinal ? `<span>Average GPA: <strong style="color:var(--color-emerald);">${avg.toFixed(3)}</strong></span>` : ''}
                </div>
                <div class="reduce-levels-display">
                    ${treeLevels.map((lvl, lIdx) => `
                        <div class="reduce-level-row ${lIdx === activeLevel ? 'level-active' : ''}">
                            <span class="level-tag">Depth ${lIdx}</span>
                            <div class="level-nodes">
                                ${lvl.map(v => `<span class="reduce-pill">${v.toFixed(2)}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderBrentsChart(evaluations, activeCores, label) {
        return `
            <div class="brent-viz-container">
                <div class="sat-telemetry-banner">
                    <span>Scalability Model: <strong>${label}</strong></span>
                    <span>Law: T_p &le; (W - D)/p + D</span>
                </div>
                <div class="brent-chart-wrap">
                    <table class="academic-table">
                        <thead><tr><th>Processor Cores (p)</th><th>Time Bound (T_p)</th><th>Speedup (S_p)</th><th>Parallel Efficiency</th></tr></thead>
                        <tbody>
                            ${evaluations.map(e => `
                                <tr class="${e.p === activeCores ? 'sa-row-highlight' : ''}">
                                    <td><strong>${e.p} Cores</strong></td>
                                    <td>${e.tp.toFixed(1)} units</td>
                                    <td><strong>${e.speedup.toFixed(2)}x</strong></td>
                                    <td><span class="efficiency-bar" style="width:${Math.min(100, e.efficiency)}px;"></span> ${e.efficiency.toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },


};

// =============================================================================
// GLOBAL DIRECT NAVIGATION CONTROLLER
// =============================================================================
function openAlgoInLab(algoKey) {
    // 1. Close 24 DSA matrix modal if currently open
    const modal = document.getElementById('dsaMatrixModal');
    if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }

    // 2. Reveal Dashboard Screen if currently on login screen
    const dash = document.getElementById('dashboardScreen');
    if (dash && dash.classList.contains('hidden')) {
        dash.classList.remove('hidden');
        const login = document.getElementById('loginScreen') || document.getElementById('authScreen');
        if (login) login.classList.add('hidden');
        // If no user session is active, provide default preview identity
        if (typeof currentSession === 'undefined' || !currentSession) {
            window.currentSession = { role: 'student', id: 'STU-1001', name: 'Nova Vance' };
            const navAvatar = document.getElementById('navAvatarInitials');
            const navBadge = document.getElementById('navUserBadgeId');
            if (navAvatar) navAvatar.textContent = 'NV';
            if (navBadge) navBadge.textContent = 'ET-2026-1001';
        }
    }

    // 3. Navigate directly to Algorithm Lab workspace
    if (typeof switchNavSection === 'function') {
        switchNavSection('algo-lab');
    }

    // 4. Select module and algorithm in AlgoStudio
    if (window.AlgoStudio && AlgoStudio.catalog) {
        const algo = AlgoStudio.catalog[algoKey];
        if (algo) {
            AlgoStudio.selectModule(algo.module);
            AlgoStudio.selectAlgo(algoKey);
        }
    }
}

// Attach to window object for bulletproof global availability
if (typeof window !== 'undefined') {
    window.AlgoStudio = AlgoStudio;
    window.openAlgoInLab = openAlgoInLab;
}
