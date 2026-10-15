package org.edutrack;

import org.edutrack.m1_string.*;
import org.edutrack.m2_suffix.*;
import org.edutrack.m3_dp.*;
import org.edutrack.m4_flow.*;
import org.edutrack.m5_np.*;
import org.edutrack.m6_randomized_parallel.*;

import java.math.BigInteger;
import java.util.*;

/**
 * Rigorous Automated Test Suite validating all 24 algorithmic implementations across M1-M6.
 */
public class EduTrackTestSuite {

    private static int testsPassed = 0;
    private static int testsFailed = 0;

    public static void main(String[] args) {
        runAllTests();
    }

    public static void runAllTests() {
        System.out.println("================================================================================");
        System.out.println("            EDUTRACK VERIFICATION SUITE - ALGORITHMIC VALIDATION               ");
        System.out.println("================================================================================");

        testModule1();
        testModule2();
        testModule3();
        testModule4();
        testModule5();
        testModule6();

        System.out.println("--------------------------------------------------------------------------------");
        System.out.printf("TEST RESULTS: %d PASSED, %d FAILED\n", testsPassed, testsFailed);
        System.out.println("================================================================================\n");

        if (testsFailed > 0) {
            throw new AssertionError("Test suite failed with " + testsFailed + " errors!");
        }
    }

    private static void assertEquals(Object expected, Object actual, String testName) {
        if (Objects.equals(expected, actual)) {
            testsPassed++;
            System.out.printf("  [PASS] %-55s = %s\n", testName, actual);
        } else {
            testsFailed++;
            System.err.printf("  [FAIL] %-55s Expected: %s, Got: %s\n", testName, expected, actual);
        }
    }

    private static void assertTrue(boolean condition, String testName) {
        if (condition) {
            testsPassed++;
            System.out.printf("  [PASS] %s\n", testName);
        } else {
            testsFailed++;
            System.err.printf("  [FAIL] %s - Condition was false\n", testName);
        }
    }

    // ==========================================
    // MODULE 1 TESTS
    // ==========================================
    private static void testModule1() {
        System.out.println("\n[M1 - String Algorithms]");

        // 1. KMP
        String text = "ORBITAL_PROPULSION_QUANTUM_PROPULSION_ANTIGRAVITY";
        String pattern = "PROPULSION";
        KMP.KMPResult kmp = KMP.search(text, pattern);
        assertEquals(Arrays.asList(8, 27), kmp.matchIndices, "KMP Pattern Search Match Indices");

        // 2. Z-Algorithm
        ZAlgorithm.ZResult zRes = ZAlgorithm.search("ASTRONAV_ASTRONAV_DOCKING", "ASTRONAV");
        assertEquals(Arrays.asList(0, 9), zRes.matchIndices, "Z-Algorithm Pattern Matches");

        // 3. Rabin-Karp
        RabinKarp.RKResult rk = RabinKarp.search("COURSE:GRAV-404; LAB:GRAV-404;", "GRAV-404");
        assertEquals(Arrays.asList(7, 21), rk.matchIndices, "Rabin-Karp Rolling Hash Matches");

        // 4. Aho-Corasick
        AhoCorasick ac = new AhoCorasick(Arrays.asList("gravity", "anti", "quantum"));
        List<AhoCorasick.Match> acMatches = ac.search("antigravity and quantum fields");
        assertEquals(3, acMatches.size(), "Aho-Corasick Multi-Pattern Matches Count");
    }

    // ==========================================
    // MODULE 2 TESTS
    // ==========================================
    private static void testModule2() {
        System.out.println("\n[M2 - Suffix Structures]");

        String s = "banana";
        // 1. Suffix Array
        SuffixArray sa = new SuffixArray(s);
        int[] expectedSA = {5, 3, 1, 0, 4, 2}; // a, ana, anana, banana, na, nana
        assertTrue(Arrays.equals(expectedSA, sa.getSuffixArray()), "Suffix Array Doubling Correctness ('banana')");
        assertEquals(3, sa.countOccurrences("a"), "Suffix Array Binary Search Count ('a')");

        // 2. SA-IS
        int[] saisSA = SAIS.buildSuffixArray(s);
        assertTrue(Arrays.equals(expectedSA, saisSA), "SA-IS Linear Time Suffix Array Match");

        // 3. Kasai LCP
        int[] lcp = KasaiLCP.buildLCP(s, saisSA);
        // LCP of adjacent suffixes in sorted order:
        // "a", "ana" -> 1
        // "ana", "anana" -> 3
        // "anana", "banana" -> 0
        // "banana", "na" -> 0
        // "na", "nana" -> 2
        int[] expectedLCP = {0, 1, 3, 0, 0, 2};
        assertTrue(Arrays.equals(expectedLCP, lcp), "Kasai LCP Array Correctness");

        // Plagiarism detection
        KasaiLCP.PlagiarismReport plag = KasaiLCP.compareAssignments("D1", "orbital graviton flux pulse", "D2", "deep space graviton flux pulse drive", 10);
        assertTrue(plag.longestCommonPhrase.contains("graviton flux pulse"), "Kasai Plagiarism Common Phrase Match");

        // 4. Suffix Automaton
        SuffixAutomaton sam = new SuffixAutomaton("ababa");
        assertTrue(sam.containsSubstring("aba"), "Suffix Automaton Contains 'aba'");
        assertTrue(!sam.containsSubstring("abba"), "Suffix Automaton Rejects 'abba'");
        assertEquals(2, sam.countOccurrences("aba"), "Suffix Automaton Occurrences Count ('aba')");
    }

    // ==========================================
    // MODULE 3 TESTS
    // ==========================================
    private static void testModule3() {
        System.out.println("\n[M3 - Advanced Dynamic Programming]");

        // 1. Levenshtein
        Levenshtein.Result lev = Levenshtein.compute("kitten", "sitting");
        assertEquals(3, lev.distance, "Levenshtein Distance ('kitten' -> 'sitting')");

        // 2. Damerau-Levenshtein
        DamerauLevenshtein.DLResult dl1 = DamerauLevenshtein.compute("CA", "AC");
        assertEquals(1, dl1.distance, "Damerau-Levenshtein Transposition ('CA' -> 'AC')");
        assertTrue(dl1.transpositionUsed, "Damerau-Levenshtein Transposition Flag Set");

        // 3. Matrix-Chain Multiplication
        int[] p = {10, 20, 30, 40, 30}; // 4 matrices: 10x20, 20x30, 30x40, 40x30
        MatrixChainMultiplication.MCMResult mcm = MatrixChainMultiplication.solve(p, new String[]{"A1", "A2", "A3", "A4"});
        assertEquals(30000L, mcm.minOperations, "Matrix-Chain Multiplication Min Scalar Operations");

        // 4. Bitmask DP (Traveling Pod Tour)
        double[][] dist = {
                {0, 10, 15, 20},
                {10, 0, 35, 25},
                {15, 35, 0, 30},
                {20, 25, 30, 0}
        };
        BitmaskDP.TSPResult tsp = BitmaskDP.solvePodTransit(dist, new String[]{"P0", "P1", "P2", "P3"});
        assertEquals(80.0, tsp.minCost, "Bitmask DP Minimal TSP Tour Cost");

        // 5. Optimal BST
        String[] keys = {"A", "B", "C"};
        double[] probs = {0.5, 0.1, 0.05};
        double[] misses = {0.15, 0.1, 0.05, 0.05};
        OptimalBST.OBSTResult obst = OptimalBST.build(keys, probs, misses);
        assertTrue(obst.expectedCost > 0.0, "Optimal BST Expected Cost Computed");
    }

    // ==========================================
    // MODULE 4 TESTS
    // ==========================================
    private static void testModule4() {
        System.out.println("\n[M4 - Network Flow]");

        // 1. Bipartite Matching (Hopcroft-Karp)
        BipartiteMatching bm = new BipartiteMatching(4, 4);
        bm.addEdge(1, 1);
        bm.addEdge(1, 2);
        bm.addEdge(2, 2);
        bm.addEdge(3, 2);
        bm.addEdge(3, 3);
        bm.addEdge(4, 3);
        BipartiteMatching.MatchingResult matchRes = bm.solve();
        assertEquals(3, matchRes.maxMatchingSize, "Hopcroft-Karp Max Bipartite Matching Size");

        // 2. König's Theorem (|M| == |Min Vertex Cover|)
        KonigTheorem.ConflictAnalysisResult konig = KonigTheorem.analyze(bm, matchRes);
        assertEquals(matchRes.maxMatchingSize, konig.minVertexCoverSize, "König's Theorem: |Max Matching| == |Min Vertex Cover|");
        assertEquals(4 + 4 - konig.minVertexCoverSize, konig.maxIndependentSetSize, "König's Theorem: |Max Independent Set| == |V| - |MVC|");

        // 3. Ford-Fulkerson
        FlowNetwork fn1 = new FlowNetwork(4);
        fn1.addEdge(0, 1, 20);
        fn1.addEdge(0, 2, 10);
        fn1.addEdge(1, 2, 5);
        fn1.addEdge(1, 3, 10);
        fn1.addEdge(2, 3, 20);
        FordFulkerson.FlowResult ff = FordFulkerson.computeMaxFlow(fn1, 0, 3);
        assertEquals(25, ff.maxFlow, "Ford-Fulkerson Max Flow");

        // 4. Edmonds-Karp
        FlowNetwork fn2 = new FlowNetwork(4);
        fn2.addEdge(0, 1, 20);
        fn2.addEdge(0, 2, 10);
        fn2.addEdge(1, 2, 5);
        fn2.addEdge(1, 3, 10);
        fn2.addEdge(2, 3, 20);
        EdmondsKarp.EKResult ek = EdmondsKarp.computeMaxFlow(fn2, 0, 3);
        assertEquals(25, ek.maxFlow, "Edmonds-Karp Max Flow");

        // 5. Dinic's Algorithm
        FlowNetwork fn3 = new FlowNetwork(4);
        fn3.addEdge(0, 1, 20);
        fn3.addEdge(0, 2, 10);
        fn3.addEdge(1, 2, 5);
        fn3.addEdge(1, 3, 10);
        fn3.addEdge(2, 3, 20);
        Dinic.DinicResult dinic = Dinic.computeMaxFlow(fn3, 0, 3);
        assertEquals(25, dinic.maxFlow, "Dinic's Algorithm Max Flow");
    }

    // ==========================================
    // MODULE 5 TESTS
    // ==========================================
    private static void testModule5() {
        System.out.println("\n[M5 - NP-Completeness & Approximation]");

        // 1. SAT Solver (DPLL)
        SATFormula satF = new SATFormula(3);
        satF.addClause(1, 2);   // (x1 v x2)
        satF.addClause(-1, 3);  // (~x1 v x3)
        satF.addClause(-2, -3); // (~x2 v ~x3)
        DPLLSolver.Solution sol = DPLLSolver.solve(satF);
        assertTrue(sol.satisfiable, "DPLL SAT Satisfiable Formula");

        SATFormula unsatF = new SATFormula(1);
        unsatF.addClause(1);  // (x1)
        unsatF.addClause(-1); // (~x1)
        DPLLSolver.Solution unsatSol = DPLLSolver.solve(unsatF);
        assertTrue(!unsatSol.satisfiable, "DPLL SAT Contradiction Detected (UNSAT)");

        // 2. 3-SAT to CLIQUE Reduction
        SATFormula redF = new SATFormula(3);
        redF.addClause(1, 2, 3);
        redF.addClause(-1, -2, -3);
        Reductions.ReductionResult cliqueRed = Reductions.reduce3SatToClique(redF);
        assertEquals(6, cliqueRed.graph.vertexCount, "3-SAT to CLIQUE Graph Vertices (3 * M)");
        assertEquals(2, cliqueRed.targetK, "3-SAT to CLIQUE Target Clique Size (M)");

        // 3. CLIQUE to INDEPENDENT-SET to VERTEX-COVER Reduction
        Reductions.ReductionResult isRed = Reductions.reduceCliqueToIndependentSet(cliqueRed.graph, cliqueRed.targetK);
        assertEquals(2, isRed.targetK, "CLIQUE to INDEPENDENT-SET Target K Preserved");
        Reductions.ReductionResult vcRed = Reductions.reduceIndependentSetToVertexCover(isRed.graph, isRed.targetK);
        assertEquals(6 - 2, vcRed.targetK, "INDEPENDENT-SET to VERTEX-COVER Target K' = |V| - K");

        // 4. Vertex-Cover 2-Approximation
        Reductions.Graph g = new Reductions.Graph(4);
        g.addEdge(0, 1);
        g.addEdge(1, 2);
        g.addEdge(2, 3);
        VertexCoverApproximation.CoverResult approx = VertexCoverApproximation.compute2Approx(g);
        assertTrue(approx.coverSize <= 2 * 2, "Vertex Cover 2-Approximation Ratio (|C| <= 2 * |C*|)");
    }

    // ==========================================
    // MODULE 6 TESTS
    // ==========================================
    private static void testModule6() {
        System.out.println("\n[M6 - Randomized & Parallel Algorithms]");

        // 1. Randomized QuickSort
        List<Integer> list = Arrays.asList(42, 17, 99, 13, 8, 55, 17, 99, 3);
        RandomizedQuickSort.sort(list);
        List<Integer> expectedSorted = Arrays.asList(3, 8, 13, 17, 17, 42, 55, 99, 99);
        assertEquals(expectedSorted, list, "Randomized QuickSort Correctness");

        // 2. Reservoir Sampling
        ReservoirSampler<Integer> sampler = new ReservoirSampler<>(5);
        for (int i = 0; i < 1000; i++) {
            sampler.streamItem(i);
        }
        assertEquals(5, sampler.getSample().size(), "Reservoir Sampling Exact Capacity");
        assertEquals(1000L, sampler.getItemsSeen(), "Reservoir Items Streamed Count");

        // 3. Miller-Rabin Primality Test
        assertTrue(MillerRabin.isProbablePrime(BigInteger.valueOf(1_000_000_007L), 20), "Miller-Rabin Known Prime (1,000,000,007)");
        assertTrue(!MillerRabin.isProbablePrime(BigInteger.valueOf(1_000_000_005L), 20), "Miller-Rabin Composite Identification");

        // 4. Blelloch Parallel Scan
        long[] input = {3, 1, 7, 0, 4, 1, 6, 3};
        BlellochScan.ScanResult scan = BlellochScan.scan(input);
        long[] expectedInclusive = {3, 4, 11, 11, 15, 16, 22, 25};
        long[] expectedExclusive = {0, 3, 4, 11, 11, 15, 16, 22};
        assertTrue(Arrays.equals(expectedInclusive, scan.inclusiveScan), "Blelloch Scan Inclusive Prefix Sum");
        assertTrue(Arrays.equals(expectedExclusive, scan.exclusiveScan), "Blelloch Scan Exclusive Prefix Sum");
        assertEquals(25L, scan.totalSum, "Blelloch Scan Total Sum");

        // 5. Parallel Reduce
        double[] array = {1.5, 2.5, 3.5, 4.5, 5.5};
        double sum = ParallelReduce.parallelSum(array);
        assertEquals(17.5, sum, "Parallel Reduce ForkJoin Sum");

        // 6. Brent's Theorem Analyzer
        BrentsTheoremAnalyzer.AnalysisReport brent = BrentsTheoremAnalyzer.analyze(1000, 10);
        assertEquals(100.0, brent.parallelismDegree, "Brent's Theorem Max Parallelism W/D");
        assertTrue(brent.metrics.get(0).speedup >= 1.0, "Brent's Speedup >= 1.0");
    }
}
