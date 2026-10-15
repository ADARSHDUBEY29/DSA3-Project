# EduTrack // Intelligent University Academic Platform
### An Antigravity Orbital Campus Management & Algorithmic Optimization System

**EduTrack** models an advanced orbital academic platform for an antigravity campus operating in microgravity orbit. The system coordinates floating lecture pods, manages continuous zero-G student activity and thruster telemetry data, and optimizes 3D transit schedules between drifting academic modules.

The platform integrates **24 classical and advanced Data Structures & Algorithms** across **6 core modules (M1 – M6)**, providing fast academic information retrieval, large-scale document indexing, plagiarism detection, error-tolerant search, spatial resource allocation, constraint satisfiability, and parallel analytics.

---

## 🚀 Algorithmic Architecture (Where Each DSA Fits)

### 🔍 Module 1: String Algorithms (Information Retrieval)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **Knuth-Morris-Pratt (KMP)** | [`KMP.java`](src/org/edutrack/m1_string/KMP.java) | Rapid pattern matching across course titles, student queries, and academic keywords using the $\pi$ (LPS) prefix function. | $O(N + M)$ |
| **Z-Algorithm (Z-Function)** | [`ZAlgorithm.java`](src/org/edutrack/m1_string/ZAlgorithm.java) | Identifies recurring academic phrases, redundant course clauses, and repeated text fragments in zero-G research papers in linear time. | $O(N)$ |
| **Rabin-Karp** | [`RabinKarp.java`](src/org/edutrack/m1_string/RabinKarp.java) | Rolling polynomial hash ($p = 10^9+7$) to search assignment codes, course IDs (`GRAV-404`, `ASTRO-301`), and verify hash matches. | Average $O(N + M)$ |
| **Aho-Corasick** | [`AhoCorasick.java`](src/org/edutrack/m1_string/AhoCorasick.java) | Trie with BFS failure transitions and dictionary output links for simultaneous multi-keyword search across academic documents in a single pass. | $O(N + \sum M_i + Z)$ |

---

### 📜 Module 2: Suffix Structures (Document Similarity & Indexing)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **Suffix Array** | [`SuffixArray.java`](src/org/edutrack/m2_suffix/SuffixArray.java) | Full text indexing of orbital library textbooks and research notes with $O(M \log N)$ binary search substring range queries. | Construction: $O(N \log^2 N)$, Query: $O(M \log N)$ |
| **SA-IS** | [`SAIS.java`](src/org/edutrack/m2_suffix/SAIS.java) | Suffix Array Induced Sorting: true linear-time algorithm classifying S/L types and LMS character buckets to index massive digital textbooks. | $O(N)$ Time & Space |
| **Kasai's LCP** | [`KasaiLCP.java`](src/org/edutrack/m2_suffix/KasaiLCP.java) | Linear-time Longest Common Prefix array computation over generalized suffix arrays to detect plagiarism and cross-student collusion. | $O(N)$ |
| **Suffix Automaton (SAM)** | [`SuffixAutomaton.java`](src/org/edutrack/m2_suffix/SuffixAutomaton.java) | Smallest directed acyclic word graph (DAWG) recognizing all substrings; queries substring existence and occurrence frequencies in $O(M)$ time. | $O(N)$ Construction, $O(M)$ Query |

---

### ⚡ Module 3: Advanced Dynamic Programming (Error Correction & Optimization)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **Levenshtein Distance** | [`Levenshtein.java`](src/org/edutrack/m3_dp/Levenshtein.java) | Minimum edit distance with full alignment traceback to autocorrect misspelled student search queries against academic keywords. | $O(N \cdot M)$ |
| **Damerau-Levenshtein** | [`DamerauLevenshtein.java`](src/org/edutrack/m3_dp/DamerauLevenshtein.java) | Handles adjacent transpositions (swaps) caused by typing under microgravity vibrations and sensory suits. | $O(N \cdot M)$ |
| **Matrix-Chain Multiplication** | [`MatrixChainMultiplication.java`](src/org/edutrack/m3_dp/MatrixChainMultiplication.java) | Finds optimal parenthesization for multi-stage tensor joins (telemetry tensors $\times$ grade matrices $\times$ pod allocation). | $O(N^3)$ |
| **Bitmask DP** | [`BitmaskDP.java`](src/org/edutrack/m3_dp/BitmaskDP.java) | Solves the **Traveling Pod Problem**: finding the minimal thruster propellant fuel needed to navigate a tour across drifting floating pods. | $O(N^2 \cdot 2^N)$ |
| **Optimal BST (OBST)** | [`OptimalBST.java`](src/org/edutrack/m3_dp/OptimalBST.java) | Dynamic programming to organize frequently accessed orbital academic keys minimizing expected search time based on query frequencies. | $O(N^3)$ |

---

### 🌊 Module 4: Network Flow (Spatial & Resource Allocation)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **Bipartite Matching** | [`BipartiteMatching.java`](src/org/edutrack/m4_flow/BipartiteMatching.java) | Hopcroft-Karp algorithm ($O(E \sqrt{V})$) to assign faculty members to eligible courses under course capacity constraints. | $O(E \sqrt{V})$ |
| **Ford-Fulkerson** | [`FordFulkerson.java`](src/org/edutrack/m4_flow/FordFulkerson.java) | Maximum flow using DFS augmenting paths to allocate physical classroom modules, floating pods, and gravity generator power. | $O(E \cdot \text{max\_flow})$ |
| **Edmonds-Karp** | [`EdmondsKarp.java`](src/org/edutrack/m4_flow/EdmondsKarp.java) | BFS-based shortest augmenting paths ($O(V E^2)$) to optimize student transit flux through pressurized airlocks and docking bays. | $O(V \cdot E^2)$ |
| **Dinic's Algorithm** | [`Dinic.java`](src/org/edutrack/m4_flow/Dinic.java) | Level graphs (BFS) and blocking flows (DFS with current-edge optimization) for large campus-wide distribution networks. | $O(V^2 \cdot E)$ |
| **König's Theorem** | [`KonigTheorem.java`](src/org/edutrack/m4_flow/KonigTheorem.java) | Proves and extracts $|\text{Max Matching}| = |\text{Min Vertex Cover}|$; finds minimal faculty coverage and maximum conflict-free sets ($|\text{MIS}| = |V| - |\text{MVC}|$). | $O(V + E)$ |

---

### 🧩 Module 5: NP-Completeness and Approximation (Complex Constraints)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **DPLL SAT Solver** | [`DPLLSolver.java`](src/org/edutrack/m5_np/DPLLSolver.java) | Davis-Putnam-Logemann-Loveland algorithm with unit propagation, pure literal elimination, and backtracking for examination timetabling without pod collisions. | Exponential worst case |
| **3-SAT $\to$ CLIQUE** | [`Reductions.java`](src/org/edutrack/m5_np/Reductions.java) | Polynomial reduction mapping 3-CNF formula ($M$ clauses) into a graph ($3M$ vertices) where a clique of size $M$ exists iff 3-SAT is satisfiable. | $O(M^2)$ |
| **Karp Reduction Pipeline** | [`Reductions.java`](src/org/edutrack/m5_np/Reductions.java) | Demonstrates $\text{CLIQUE}(G, k) \iff \text{INDEPENDENT-SET}(\overline{G}, k) \iff \text{VERTEX-COVER}(\overline{G}, \|V\| - k)$ for deep conflict analysis. | $O(V^2)$ |
| **Vertex-Cover 2-Approximation** | [`VertexCoverApproximation.java`](src/org/edutrack/m5_np/VertexCoverApproximation.java) | Maximal matching greedy edge selection guaranteeing approximation ratio $\|C\| \le 2 \cdot \|C^*\|$ to resolve examination and pod scheduling conflicts. | $O(V + E)$ |

---

### 📊 Module 6: Randomized and Parallel Algorithms (Real-Time Analytics)
| Algorithm | Class | Orbital Campus Application | Complexity |
| :--- | :--- | :--- | :--- |
| **Randomized QuickSort** | [`RandomizedQuickSort.java`](src/org/edutrack/m6_randomized_parallel/RandomizedQuickSort.java) | Uniform random pivot with 3-way Dutch National Flag partitioning to rapidly rank academic standings and zero-G flight aptitudes. | Expected $O(N \log N)$ |
| **Reservoir Sampling** | [`ReservoirSampler.java`](src/org/edutrack/m6_randomized_parallel/ReservoirSampler.java) | Algorithm R maintaining a uniform random sample of size $K$ from an unbounded continuous stream of zero-G suit movement sensors. | $O(1)$ per stream item |
| **Miller-Rabin** | [`MillerRabin.java`](src/org/edutrack/m6_randomized_parallel/MillerRabin.java) | Probabilistic primality testing with error bound $\le 4^{-k}$ for student cryptographic authentication tokens and quantum-resistant certificates. | $O(k \log^3 N)$ |
| **Blelloch Parallel Scan** | [`BlellochScan.java`](src/org/edutrack/m6_randomized_parallel/BlellochScan.java) | Work-efficient parallel prefix sum with Up-Sweep (reduce) and Down-Sweep phases ($O(N)$ work, $O(\log N)$ depth) for cumulative credit curves. | Work: $O(N)$, Span: $O(\log N)$ |
| **Parallel Reduce** | [`ParallelReduce.java`](src/org/edutrack/m6_randomized_parallel/ParallelReduce.java) | Java ForkJoin framework tree reduction to aggregate campus-wide GPA and telemetry averages across multi-core processors. | Work: $O(N)$, Span: $O(\log N)$ |
| **Brent's Theorem Analyzer** | [`BrentsTheoremAnalyzer.java`](src/org/edutrack/m6_randomized_parallel/BrentsTheoremAnalyzer.java) | Theoretical scheduling principle $T_p \le \frac{W - D}{p} + D$; computes speedup $S_p = W/T_p$ and parallel efficiency $E_p = S_p/p$. | $O(1)$ |

---

## 📁 Project Directory Structure

```
DSA3 PROJECT/
├── build.bat                   # Windows batch build script
├── run.bat                     # Windows batch runner (CLI or Server)
├── build.ps1                   # PowerShell build script
├── run.ps1                     # PowerShell runner script
├── README.md                   # Complete architectural documentation
├── web/                        # Futuristic Cyberpunk Web Dashboard
│   ├── index.html              # Interactive Orbital Campus Dashboard
│   ├── style.css               # Sleek glassmorphism & neon dark UI
│   └── app.js                  # Dynamic API consumer & terminal logger
└── src/
    └── org/
        └── edutrack/
            ├── Main.java               # Interactive Console CLI & Server Bootstrap
            ├── EduTrackTestSuite.java  # Automated Verification Suite (42 unit tests)
            ├── model/                  # Antigravity Campus Data Models
            │   ├── Student.java
            │   ├── Faculty.java
            │   ├── Course.java
            │   ├── FloatingPod.java
            │   ├── Assignment.java
            │   └── OrbitalTelemetry.java
            ├── m1_string/              # Module 1: String Retrieval Algorithms
            │   ├── KMP.java
            │   ├── ZAlgorithm.java
            │   ├── RabinKarp.java
            │   └── AhoCorasick.java
            ├── m2_suffix/              # Module 2: Suffix Structures & Indexing
            │   ├── SuffixArray.java
            │   ├── SAIS.java
            │   ├── KasaiLCP.java
            │   └── SuffixAutomaton.java
            ├── m3_dp/                  # Module 3: Advanced Dynamic Programming
            │   ├── Levenshtein.java
            │   ├── DamerauLevenshtein.java
            │   ├── MatrixChainMultiplication.java
            │   ├── BitmaskDP.java
            │   └── OptimalBST.java
            ├── m4_flow/                # Module 4: Network Flow & Spatial Allocation
            │   ├── FlowNetwork.java
            │   ├── BipartiteMatching.java
            │   ├── FordFulkerson.java
            │   ├── EdmondsKarp.java
            │   ├── Dinic.java
            │   └── KonigTheorem.java
            ├── m5_np/                  # Module 5: NP-Completeness & Approximation
            │   ├── SATFormula.java
            │   ├── DPLLSolver.java
            │   ├── Reductions.java
            │   └── VertexCoverApproximation.java
            ├── m6_randomized_parallel/ # Module 6: Randomized & Parallel Analytics
            │   ├── RandomizedQuickSort.java
            │   ├── ReservoirSampler.java
            │   ├── MillerRabin.java
            │   ├── BlellochScan.java
            │   ├── ParallelReduce.java
            │   └── BrentsTheoremAnalyzer.java
            ├── service/                # Core Orchestration Services
            │   ├── AcademicRepository.java
            │   └── EduTrackEngine.java
            └── server/                 # Zero-Dependency Embedded HTTP Server
                └── EduTrackHttpServer.java
```

---

## 🛠️ Compilation & Execution

### 1. Requirements
* **Java Development Kit (JDK) 11+** (Tested on OpenJDK 25 LTS).
* Zero external Maven or Gradle dependencies required — 100% pure Java standard library (`java.*`, `com.sun.net.httpserver.*`).

### 2. Build the Project
Double-click `build.bat` or run in terminal:
```powershell
cmd /c build.bat
```

### 3. Run the Automated Verification Suite
To run all 42 automated algorithmic validation tests:
```powershell
java -cp bin org.edutrack.Main --test
```
or:
```powershell
java -cp bin org.edutrack.EduTrackTestSuite
```

### 4. Run the Full Interactive Console & Web Server
```powershell
cmd /c run.bat
```
or:
```powershell
java -cp bin org.edutrack.Main
```
This executes:
1. Full live demonstration of all 6 modules in the terminal with colored telemetry logs.
2. Launches the built-in HTTP Web Server on `http://localhost:8080` (or `http://localhost:8081` if 8080 is busy).
3. Open your browser to explore the **Orbital Academic Command Center** to run algorithms interactively!
