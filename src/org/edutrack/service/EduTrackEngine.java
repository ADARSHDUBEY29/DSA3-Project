package org.edutrack.service;

import org.edutrack.m1_string.*;
import org.edutrack.m2_suffix.*;
import org.edutrack.m3_dp.*;
import org.edutrack.m4_flow.*;
import org.edutrack.m5_np.*;
import org.edutrack.m6_randomized_parallel.*;
import org.edutrack.model.*;

import java.math.BigInteger;
import java.util.*;

/**
 * Core orchestration engine uniting all 6 algorithmic modules (M1 - M6)
 * for the Antigravity Orbital University platform.
 */
public class EduTrackEngine {

    private final AcademicRepository repository;

    public EduTrackEngine(AcademicRepository repository) {
        this.repository = repository;
    }

    public AcademicRepository getRepository() {
        return repository;
    }

    // ==========================================
    // MODULE 1: String Algorithms
    // ==========================================

    public KMP.KMPResult searchCoursesKMP(String keyword) {
        StringBuilder sb = new StringBuilder();
        for (Course c : repository.getCourses().values()) {
            sb.append(c.getCode()).append(": ").append(c.getTitle()).append(". ");
        }
        return KMP.search(sb.toString(), keyword);
    }

    public ZAlgorithm.ZResult searchAssignmentPhrasesZ(String text, String phrase) {
        return ZAlgorithm.search(text, phrase);
    }

    public List<String> detectRecurringAssignmentPhrasesZ(String text, int minLength) {
        return ZAlgorithm.findRepeatedPhrases(text, minLength);
    }

    public RabinKarp.RKResult searchCourseCodesRabinKarp(String text, String code) {
        return RabinKarp.search(text, code);
    }

    public List<AhoCorasick.Match> scanAcademicKeywordsAhoCorasick(String text) {
        AhoCorasick ac = new AhoCorasick(repository.getAllAcademicKeywords());
        return ac.search(text);
    }

    // ==========================================
    // MODULE 2: Suffix Structures
    // ==========================================

    public SuffixArray indexDocumentSuffixArray(String text) {
        return new SuffixArray(text);
    }

    public int[] indexLargeDocumentSAIS(String text) {
        return SAIS.buildSuffixArray(text);
    }

    public KasaiLCP.PlagiarismReport detectPlagiarismKasai(String doc1Id, String doc2Id, int minPhraseLen) {
        Assignment a1 = null, a2 = null;
        for (Assignment a : repository.getAssignments()) {
            if (a.getId().equalsIgnoreCase(doc1Id)) a1 = a;
            if (a.getId().equalsIgnoreCase(doc2Id)) a2 = a;
        }
        String text1 = (a1 != null) ? a1.getContent() : "";
        String text2 = (a2 != null) ? a2.getContent() : "";
        return KasaiLCP.compareAssignments(doc1Id, text1, doc2Id, text2, minPhraseLen);
    }

    public SuffixAutomaton queryDocumentSuffixAutomaton(String text) {
        return new SuffixAutomaton(text);
    }

    // ==========================================
    // MODULE 3: Advanced Dynamic Programming
    // ==========================================

    public Levenshtein.Result correctQueryLevenshtein(String typoQuery) {
        String best = Levenshtein.suggestCorrection(typoQuery, repository.getAllAcademicKeywords());
        Levenshtein.Result res = Levenshtein.compute(typoQuery, best);
        return res;
    }

    public DamerauLevenshtein.DLResult correctQueryDamerauLevenshtein(String typoQuery) {
        String best = DamerauLevenshtein.suggestCorrection(typoQuery, repository.getAllAcademicKeywords());
        return DamerauLevenshtein.compute(typoQuery, best);
    }

    public MatrixChainMultiplication.MCMResult optimizeDataPipelineMCM(int[] tensorDimensions, String[] labels) {
        return MatrixChainMultiplication.solve(tensorDimensions, labels);
    }

    public BitmaskDP.TSPResult optimizeFloatingPodTransitBitmaskDP() {
        List<FloatingPod> pods = new ArrayList<>(repository.getFloatingPods().values());
        int n = pods.size();
        double[][] cost = new double[n][n];
        String[] names = new String[n];

        for (int i = 0; i < n; i++) {
            names[i] = pods.get(i).getName();
            for (int j = 0; j < n; j++) {
                if (i == j) cost[i][j] = 0;
                else {
                    // Propellant fuel = 3D distance * (1.0 + gravity drag)
                    double dist = pods.get(i).distanceTo(pods.get(j));
                    double dragFactor = 1.0 + (pods.get(i).getArtificialGravity() + pods.get(j).getArtificialGravity()) * 0.5;
                    cost[i][j] = dist * dragFactor;
                }
            }
        }
        return BitmaskDP.solvePodTransit(cost, names);
    }

    public OptimalBST.OBSTResult buildOptimalAcademicKeyBST() {
        String[] keys = {"ASTRO-301", "GRAV-404", "ORBIT-205", "QUANT-502", "SINGULARITY"};
        double[] p = {0.25, 0.35, 0.15, 0.15, 0.10}; // Search probabilities
        double[] q = {0.05, 0.05, 0.05, 0.05, 0.05, 0.05}; // Dummy miss probabilities
        return OptimalBST.build(keys, p, q);
    }

    // ==========================================
    // MODULE 4: Network Flow
    // ==========================================

    public BipartiteMatching.MatchingResult matchFacultyToCoursesBipartite() {
        List<Faculty> facList = new ArrayList<>(repository.getFaculty().values());
        List<Course> crsList = new ArrayList<>(repository.getCourses().values());

        BipartiteMatching bm = new BipartiteMatching(facList.size(), crsList.size());
        for (int i = 0; i < facList.size(); i++) {
            Faculty f = facList.get(i);
            for (int j = 0; j < crsList.size(); j++) {
                Course c = crsList.get(j);
                if (f.getQualifiedCourseCodes().contains(c.getCode())) {
                    bm.addEdge(i + 1, j + 1); // 1-indexed
                }
            }
        }
        return bm.solve();
    }

    public KonigTheorem.ConflictAnalysisResult analyzeFacultyCourseConflictsKonig() {
        List<Faculty> facList = new ArrayList<>(repository.getFaculty().values());
        List<Course> crsList = new ArrayList<>(repository.getCourses().values());

        BipartiteMatching bm = new BipartiteMatching(facList.size(), crsList.size());
        for (int i = 0; i < facList.size(); i++) {
            Faculty f = facList.get(i);
            for (int j = 0; j < crsList.size(); j++) {
                Course c = crsList.get(j);
                if (f.getQualifiedCourseCodes().contains(c.getCode())) {
                    bm.addEdge(i + 1, j + 1);
                }
            }
        }
        BipartiteMatching.MatchingResult mr = bm.solve();
        return KonigTheorem.analyze(bm, mr);
    }

    public FordFulkerson.FlowResult allocatePodResourcesFordFulkerson() {
        // Source (0) -> Faculty (1..4) -> Courses (5..9) -> Pods (10..14) -> Sink (15)
        FlowNetwork fn = new FlowNetwork(16);
        int src = 0;
        int sink = 15;

        // Source to Faculty (capacity = max course load)
        fn.addEdge(src, 1, 3);
        fn.addEdge(src, 2, 2);
        fn.addEdge(src, 3, 3);
        fn.addEdge(src, 4, 2);

        // Faculty to Courses
        fn.addEdge(1, 5, 1); fn.addEdge(1, 6, 1);
        fn.addEdge(2, 7, 1); fn.addEdge(2, 9, 1);
        fn.addEdge(3, 5, 1); fn.addEdge(3, 8, 1);
        fn.addEdge(4, 6, 1); fn.addEdge(4, 8, 1);

        // Courses to Pods
        fn.addEdge(5, 10, 1); // ASTRO -> POD-ALPHA
        fn.addEdge(6, 13, 1); // GRAV -> POD-DELTA
        fn.addEdge(7, 11, 1); // QUANT -> POD-BETA
        fn.addEdge(8, 12, 1); // ORBIT -> POD-GAMMA
        fn.addEdge(9, 11, 1); // AI -> POD-BETA

        // Pods to Sink (Pod capacity slots)
        for (int pod = 10; pod <= 14; pod++) {
            fn.addEdge(pod, sink, 2);
        }

        return FordFulkerson.computeMaxFlow(fn, src, sink);
    }

    public EdmondsKarp.EKResult solveResourceFlowEdmondsKarp() {
        FlowNetwork fn = createSampleTransitNetwork();
        return EdmondsKarp.computeMaxFlow(fn, 0, 7);
    }

    public Dinic.DinicResult solveCampusNetworkDinic() {
        FlowNetwork fn = createSampleTransitNetwork();
        return Dinic.computeMaxFlow(fn, 0, 7);
    }

    private FlowNetwork createSampleTransitNetwork() {
        // Student flux network through pressurized airlocks: 0 (Central Hub) to 7 (Outer Observatories)
        FlowNetwork fn = new FlowNetwork(8);
        fn.addEdge(0, 1, 100); // Hub -> North Airlock
        fn.addEdge(0, 2, 120); // Hub -> South Airlock
        fn.addEdge(1, 3, 60);  // North -> Graviton Ring
        fn.addEdge(1, 4, 70);  // North -> Quantum Bridge
        fn.addEdge(2, 4, 80);  // South -> Quantum Bridge
        fn.addEdge(2, 5, 90);  // South -> Bio-Dome
        fn.addEdge(3, 6, 50);  // Graviton -> Outer Ring A
        fn.addEdge(4, 6, 80);  // Quantum -> Outer Ring A
        fn.addEdge(4, 7, 70);  // Quantum -> Observatory (Sink)
        fn.addEdge(5, 7, 85);  // Bio-Dome -> Observatory (Sink)
        fn.addEdge(6, 7, 110); // Outer Ring -> Observatory (Sink)
        return fn;
    }

    // ==========================================
    // MODULE 5: NP-Completeness & Approximation
    // ==========================================

    public DPLLSolver.Solution solveExamScheduleSAT() {
        // 3 Courses, 2 Time Slots
        // x1: C1 in Slot 1, x2: C1 in Slot 2
        // x3: C2 in Slot 1, x4: C2 in Slot 2
        // x5: C3 in Slot 1, x6: C3 in Slot 2
        SATFormula formula = new SATFormula(6);
        formula.setVariableName(1, "ASTRO_Slot1");
        formula.setVariableName(2, "ASTRO_Slot2");
        formula.setVariableName(3, "GRAV_Slot1");
        formula.setVariableName(4, "GRAV_Slot2");
        formula.setVariableName(5, "QUANT_Slot1");
        formula.setVariableName(6, "QUANT_Slot2");

        // Each course must have at least one slot
        formula.addClause(1, 2);
        formula.addClause(3, 4);
        formula.addClause(5, 6);

        // Course cannot be in both slots
        formula.addClause(-1, -2);
        formula.addClause(-3, -4);
        formula.addClause(-5, -6);

        // Conflict: ASTRO and GRAV share students -> cannot both be in Slot 1
        formula.addClause(-1, -3);

        return DPLLSolver.solve(formula);
    }

    public Reductions.ReductionResult demonstrate3SatToCliqueReduction() {
        SATFormula formula = new SATFormula(3);
        formula.setVariableName(1, "x1");
        formula.setVariableName(2, "x2");
        formula.setVariableName(3, "x3");

        // (x1 ∨ x2 ∨ ¬x3) ∧ (¬x1 ∨ x3 ∨ x2)
        formula.addClause(1, 2, -3);
        formula.addClause(-1, 3, 2);

        return Reductions.reduce3SatToClique(formula);
    }

    public Reductions.ReductionResult demonstrateReductionPipeline() {
        Reductions.ReductionResult cliqueRes = demonstrate3SatToCliqueReduction();
        Reductions.ReductionResult isRes = Reductions.reduceCliqueToIndependentSet(cliqueRes.graph, cliqueRes.targetK);
        return Reductions.reduceIndependentSetToVertexCover(isRes.graph, isRes.targetK);
    }

    public VertexCoverApproximation.CoverResult approximateVertexCoverConflicts() {
        // Build examination conflict graph
        Reductions.Graph g = new Reductions.Graph(6);
        g.vertexLabels.set(0, "ASTRO-301");
        g.vertexLabels.set(1, "GRAV-404");
        g.vertexLabels.set(2, "QUANT-502");
        g.vertexLabels.set(3, "ORBIT-205");
        g.vertexLabels.set(4, "AI-610");
        g.vertexLabels.set(5, "EXO-101");

        // Conflict edges (shared students or shared floating pods)
        g.addEdge(0, 1);
        g.addEdge(1, 3);
        g.addEdge(2, 4);
        g.addEdge(0, 4);
        g.addEdge(3, 5);
        g.addEdge(1, 4);

        return VertexCoverApproximation.compute2Approx(g);
    }

    // ==========================================
    // MODULE 6: Randomized & Parallel Algorithms
    // ==========================================

    public List<Student> rankStudentsRandomizedQuickSort() {
        List<Student> list = new ArrayList<>(repository.getStudents().values());
        RandomizedQuickSort.sort(list);
        return list;
    }

    public List<OrbitalTelemetry> sampleTelemetryReservoir(int sampleSize) {
        ReservoirSampler<OrbitalTelemetry> sampler = new ReservoirSampler<>(sampleSize);
        for (OrbitalTelemetry t : repository.getTelemetryLogs()) {
            sampler.streamItem(t);
        }
        return sampler.getSample();
    }

    public BigInteger generateSecureStudentKeyMillerRabin(int bitLength) {
        return MillerRabin.generatePrime(bitLength, 25);
    }

    public BlellochScan.ScanResult computeCumulativeCreditsBlelloch() {
        List<Student> students = new ArrayList<>(repository.getStudents().values());
        long[] credits = new long[students.size()];
        for (int i = 0; i < students.size(); i++) {
            credits[i] = students.get(i).getCompletedCredits();
        }
        return BlellochScan.scan(credits);
    }

    public double aggregateGPAForkJoin() {
        List<Student> students = new ArrayList<>(repository.getStudents().values());
        double[] gpas = new double[students.size()];
        for (int i = 0; i < students.size(); i++) {
            gpas[i] = students.get(i).getGpa();
        }
        return ParallelReduce.parallelAverage(gpas);
    }

    public BrentsTheoremAnalyzer.AnalysisReport analyzeParallelSpeedupBrentsTheorem(long work, long depth) {
        return BrentsTheoremAnalyzer.analyze(work, depth);
    }
}
