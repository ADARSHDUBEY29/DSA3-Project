package org.edutrack;

import org.edutrack.m1_string.*;
import org.edutrack.m2_suffix.*;
import org.edutrack.m3_dp.*;
import org.edutrack.m4_flow.*;
import org.edutrack.m5_np.*;
import org.edutrack.m6_randomized_parallel.*;
import org.edutrack.model.*;
import org.edutrack.server.EduTrackHttpServer;
import org.edutrack.service.AcademicRepository;
import org.edutrack.service.EduTrackEngine;

import java.math.BigInteger;
import java.util.*;

/**
 * Main entry point for EduTrack: Intelligent Orbital University Platform.
 */
public class Main {

    private static final String CYAN = "\u001B[36m";
    private static final String GREEN = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String PURPLE = "\u001B[35m";
    private static final String BLUE = "\u001B[34m";
    private static final String RESET = "\u001B[0m";
    private static final String BOLD = "\u001B[1m";

    public static void main(String[] args) {
        AcademicRepository repository = new AcademicRepository();
        EduTrackEngine engine = new EduTrackEngine(repository);

        if (args.length > 0) {
            String arg = args[0].toLowerCase();
            if (arg.contains("test")) {
                EduTrackTestSuite.runAllTests();
                return;
            } else if (arg.contains("server")) {
                int port = 8080;
                if (args.length > 1) {
                    try { port = Integer.parseInt(args[1]); } catch (Exception ignored) {}
                }
                startServer(port, engine);
                return;
            }
        }

        printBanner();
        runFullDemonstration(engine);

        // Check if interactive or starting web server
        System.out.println(GREEN + "\n[EduTrack] Automatically starting Web Server Dashboard on http://localhost:8080 ..." + RESET);
        startServer(8080, engine);
    }

    private static void startServer(int port, EduTrackEngine engine) {
        try {
            EduTrackHttpServer server = new EduTrackHttpServer(port, engine);
            server.start();
            int boundPort = server.getPort();
            System.out.println(CYAN + BOLD + ">>> Web Dashboard ready at: http://localhost:" + boundPort + " <<<" + RESET);
            System.out.println("Press Ctrl+C or enter 'q' to quit.");

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                try { server.stop(); } catch (Exception ignored) {}
            }));

            Scanner scanner = new Scanner(System.in);
            try {
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine().trim();
                    if (line.equalsIgnoreCase("q") || line.equalsIgnoreCase("exit")) {
                        server.stop();
                        System.out.println("Orbital station telemetry offline. Goodbye!");
                        return;
                    } else if (line.equalsIgnoreCase("test")) {
                        EduTrackTestSuite.runAllTests();
                    } else if (line.equalsIgnoreCase("demo")) {
                        runFullDemonstration(engine);
                    } else {
                        System.out.println("Commands available: 'demo', 'test', 'q' (quit). Server is running at http://localhost:" + boundPort);
                    }
                }
            } catch (Exception ignored) {}

            // Keep alive if stdin reaches EOF (daemon or headless background execution)
            Thread.currentThread().join();
        } catch (Exception e) {
            System.err.println("Could not launch web server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void printBanner() {
        System.out.println(CYAN + BOLD);
        System.out.println("================================================================================");
        System.out.println("   ______ ____   __  __ _____ _____      _       _____  _  __");
        System.out.println("  |  ____|  _ \\ |  |  |_   _|  __ \\    / \\     / ____|| |/ /");
        System.out.println("  | |__  | | | || |  | | | | | |__) |  / _ \\   | |     | ' / ");
        System.out.println("  |  __| | | | || |  | | | | |  _  /  / ___ \\  | |     |  <  ");
        System.out.println("  | |____| |_| || |__| |_| |_| | \\ \\ / /   \\ \\ | |____ | . \\ ");
        System.out.println("  |______|____/  \\____/|_____|_|  \\_/_/     \\_\\ \\_____||_|\\_\\");
        System.out.println("      INTELLIGENT ANTIGRAVITY CAMPUS ACADEMIC PLATFORM (ORBITAL STATION ALPHA)  ");
        System.out.println("================================================================================" + RESET);
    }

    public static void runFullDemonstration(EduTrackEngine engine) {
        AcademicRepository repo = engine.getRepository();

        System.out.println(YELLOW + BOLD + "\n>>> [MODULE 1] STRING ALGORITHMS (INFORMATION RETRIEVAL)" + RESET);
        // 1. KMP
        KMP.KMPResult kmp = engine.searchCoursesKMP("Mechanics");
        System.out.println(" 1. KMP (Course Title Search 'Mechanics'): Matches at index " + kmp.matchIndices + " (Comparisons: " + kmp.comparisons + ")");

        // 2. Z-Algorithm
        String paper1 = repo.getAssignments().get(0).getContent();
        ZAlgorithm.ZResult zRes = engine.searchAssignmentPhrasesZ(paper1, "antigravity propulsion");
        System.out.println(" 2. Z-Algorithm (Repeated Phrase 'antigravity propulsion'): Matches at index " + zRes.matchIndices);
        List<String> repeatedPhrases = engine.detectRecurringAssignmentPhrasesZ(paper1, 20);
        System.out.println("    Detected recurring assignment clauses: " + repeatedPhrases.size() + " recurring sub-phrases.");

        // 3. Rabin-Karp
        RabinKarp.RKResult rk = engine.searchCourseCodesRabinKarp("Orbit Schedule: [ASTRO-301 in Pod Alpha, GRAV-404 in Pod Delta]", "GRAV-404");
        System.out.println(" 3. Rabin-Karp Rolling Hash (Course Code 'GRAV-404'): Match at index " + rk.matchIndices + " (Evaluations: " + rk.hashEvaluations + ")");

        // 4. Aho-Corasick
        List<AhoCorasick.Match> acMatches = engine.scanAcademicKeywordsAhoCorasick(
                "Students in antigravity labs require propulsion telemetry and quantum simulation.");
        System.out.println(" 4. Aho-Corasick (Simultaneous Keyword Multi-Pattern Scan):");
        for (AhoCorasick.Match m : acMatches) {
            System.out.println("    -> Found Keyword: '" + m.keyword + "' at text position " + m.index);
        }

        System.out.println(GREEN + BOLD + "\n>>> [MODULE 2] SUFFIX STRUCTURES (DOCUMENT SIMILARITY & INDEXING)" + RESET);
        // 1. Suffix Array
        SuffixArray sa = engine.indexDocumentSuffixArray(paper1);
        System.out.println(" 1. Suffix Array (Indexed Paper-1): Total suffixes = " + sa.getSuffixArray().length);
        System.out.println("    Occurrences of 'orbital' in indexed textbook: " + sa.countOccurrences("orbital"));

        // 2. SA-IS
        int[] saisSA = engine.indexLargeDocumentSAIS(paper1);
        System.out.println(" 2. SA-IS (Linear O(N) Induced Sorting): First 5 sorted suffix pointers = " +
                Arrays.toString(Arrays.copyOf(saisSA, Math.min(5, saisSA.length))));

        // 3. Kasai LCP & Plagiarism Detection
        KasaiLCP.PlagiarismReport plag = engine.detectPlagiarismKasai("ASN-001", "ASN-002", 15);
        System.out.println(" 3. Kasai LCP (Plagiarism & Collusion Detection between Student Assignments):");
        System.out.println("    " + plag);

        // 4. Suffix Automaton
        SuffixAutomaton sam = engine.queryDocumentSuffixAutomaton(paper1);
        System.out.println(" 4. Suffix Automaton (SAM): States = " + sam.getStateCount() +
                ", Distinct Substrings = " + sam.countDistinctSubstrings() +
                ", Contains 'graviton flux': " + sam.containsSubstring("graviton flux"));

        System.out.println(CYAN + BOLD + "\n>>> [MODULE 3] ADVANCED DYNAMIC PROGRAMMING (ERROR CORRECTION & OPTIMIZATION)" + RESET);
        // 1. Levenshtein
        Levenshtein.Result lev = engine.correctQueryLevenshtein("antigravty");
        System.out.println(" 1. Levenshtein Distance: Typo 'antigravty' corrected (Distance: " + lev.distance + ")");

        // 2. Damerau-Levenshtein
        DamerauLevenshtein.DLResult dl = engine.correctQueryDamerauLevenshtein("antigravtiy");
        System.out.println(" 2. Damerau-Levenshtein (Microgravity Transposition): Typo 'antigravtiy' corrected (Distance: " +
                dl.distance + ", Transposition Handled: " + dl.transpositionUsed + ")");

        // 3. Matrix-Chain Multiplication
        int[] dims = {15, 30, 10, 50, 20};
        String[] labels = {"TelemetryTensor", "CourseMatrix", "PodResource", "AirlockFlux"};
        MatrixChainMultiplication.MCMResult mcm = engine.optimizeDataPipelineMCM(dims, labels);
        System.out.println(" 3. Matrix-Chain Multiplication (Academic Data Pipeline Optimization):");
        System.out.println("    Optimal Order: " + mcm.optimalParenthesization);
        System.out.println("    Minimum Scalar FLOPs: " + mcm.minOperations);

        // 4. Bitmask DP (Traveling Pod Tour)
        BitmaskDP.TSPResult tsp = engine.optimizeFloatingPodTransitBitmaskDP();
        System.out.println(" 4. Bitmask DP (Floating Pod Orbital Transit Tour):");
        System.out.println("    " + tsp);

        // 5. Optimal Binary Search Tree (OBST)
        OptimalBST.OBSTResult obst = engine.buildOptimalAcademicKeyBST();
        System.out.println(" 5. Optimal BST (Frequently Accessed Academic Keys):");
        System.out.printf("    Expected Search Cost: %.4f operations\n", obst.expectedCost);

        System.out.println(BLUE + BOLD + "\n>>> [MODULE 4] NETWORK FLOW (SPATIAL & RESOURCE ALLOCATION)" + RESET);
        // 1. Bipartite Matching
        BipartiteMatching.MatchingResult match = engine.matchFacultyToCoursesBipartite();
        System.out.println(" 1. Bipartite Matching (Hopcroft-Karp Faculty Assignment): " + match.maxMatchingSize + " courses staffed.");

        // 2. Ford-Fulkerson
        FordFulkerson.FlowResult ff = engine.allocatePodResourcesFordFulkerson();
        System.out.println(" 2. Ford-Fulkerson (Floating Pod Physical Module Allocation): Max Flow = " + ff.maxFlow + " slots.");

        // 3. Edmonds-Karp
        EdmondsKarp.EKResult ek = engine.solveResourceFlowEdmondsKarp();
        System.out.println(" 3. Edmonds-Karp (Airlock Student Transit Flow): Max Flow = " + ek.maxFlow + " students/min.");

        // 4. Dinic's Algorithm
        Dinic.DinicResult dinic = engine.solveCampusNetworkDinic();
        System.out.println(" 4. Dinic's Algorithm (Multi-Module Orbital Campus Flow): Max Flow = " + dinic.maxFlow + " (Phases: " + dinic.phaseCount + ")");

        // 5. König's Theorem
        KonigTheorem.ConflictAnalysisResult konig = engine.analyzeFacultyCourseConflictsKonig();
        System.out.println(" 5. König's Theorem (Conflict & Coverage Analysis):");
        System.out.println("    |Max Matching| = " + konig.maxMatchingSize + " == |Min Vertex Cover| = " + konig.minVertexCoverSize);
        System.out.println("    |Max Independent Set| = " + konig.maxIndependentSetSize + " conflict-free academic slots.");

        System.out.println(PURPLE + BOLD + "\n>>> [MODULE 5] NP-COMPLETENESS & APPROXIMATION (COMPLEX CONSTRAINTS)" + RESET);
        // 1. SAT Solver (DPLL)
        DPLLSolver.Solution sat = engine.solveExamScheduleSAT();
        System.out.println(" 1. DPLL SAT Solver (Examination Timetabling & Zero-G Pod Constraints):");
        System.out.println("    Status: " + (sat.satisfiable ? "SATISFIABLE (Conflict-Free Schedule Found)" : "UNSATISFIABLE"));

        // 2. 3-SAT to CLIQUE Reduction
        Reductions.ReductionResult redClique = engine.demonstrate3SatToCliqueReduction();
        System.out.println(" 2. 3-SAT -> CLIQUE Reduction: " + redClique.reductionExplanation);

        // 3. CLIQUE -> INDEPENDENT-SET -> VERTEX-COVER
        Reductions.ReductionResult redPipeline = engine.demonstrateReductionPipeline();
        System.out.println(" 3. Karp Reduction Pipeline: " + redPipeline.reductionExplanation);

        // 4. Vertex-Cover 2-Approximation
        VertexCoverApproximation.CoverResult approx = engine.approximateVertexCoverConflicts();
        System.out.println(" 4. Vertex-Cover 2-Approximation (Exam/Pod Collision Resolution):");
        System.out.println("    " + approx);

        System.out.println(YELLOW + BOLD + "\n>>> [MODULE 6] RANDOMIZED & PARALLEL ALGORITHMS (REAL-TIME ANALYTICS)" + RESET);
        // 1. Randomized QuickSort
        List<Student> ranked = engine.rankStudentsRandomizedQuickSort();
        System.out.println(" 1. Randomized QuickSort (Academic Standing & Flight Aptitude Leaderboard):");
        for (int i = 0; i < Math.min(3, ranked.size()); i++) {
            System.out.println("    #" + (i + 1) + " " + ranked.get(i));
        }

        // 2. Reservoir Sampling
        List<OrbitalTelemetry> sample = engine.sampleTelemetryReservoir(3);
        System.out.println(" 2. Reservoir Sampling (Algorithm R for Continuous Zero-G Sensor Stream):");
        for (OrbitalTelemetry t : sample) {
            System.out.println("    " + t);
        }

        // 3. Miller-Rabin
        BigInteger cryptoToken = engine.generateSecureStudentKeyMillerRabin(64);
        System.out.println(" 3. Miller-Rabin Primality Test: Generated 64-bit Cryptographic Token = " + cryptoToken);

        // 4. Blelloch Parallel Scan
        BlellochScan.ScanResult blelloch = engine.computeCumulativeCreditsBlelloch();
        System.out.println(" 4. Blelloch Parallel Scan (Cumulative Credits Prefix Sum):");
        System.out.println("    Inclusive Cumulative: " + Arrays.toString(blelloch.inclusiveScan));
        System.out.println("    Total Campus Credits: " + blelloch.totalSum + " (Work Ops: " + blelloch.workOperations + ", Tree Depth: " + blelloch.depthSteps + ")");

        // 5. Parallel Reduce
        double avgGpa = engine.aggregateGPAForkJoin();
        System.out.printf(" 5. Parallel Reduce (ForkJoin Framework): Orbital Campus Average GPA = %.3f\n", avgGpa);

        // 6. Brent's Theorem Analyzer
        BrentsTheoremAnalyzer.AnalysisReport brent = engine.analyzeParallelSpeedupBrentsTheorem(250000, 32);
        System.out.println(" 6. Brent's Theorem Scalability Analyzer (Work W = 250,000, Depth D = 32):");
        System.out.printf("    Theoretical Max Parallelism: %.1fx\n", brent.parallelismDegree);
        System.out.println("    " + brent.metrics.get(3)); // 8 cores
        System.out.println("    " + brent.metrics.get(5)); // 32 cores

        System.out.println("\n" + GREEN + BOLD + "================================================================================");
        System.out.println("   ALL 6 ALGORITHMIC MODULES EXECUTED SUCCESSFULLY WITH FULL SYSTEM INTEGRITY!  ");
        System.out.println("================================================================================" + RESET);
    }
}
