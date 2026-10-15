package org.edutrack.m4_flow;

import java.util.*;

/**
 * Module 4 - König's Theorem.
 * Establishes that in any bipartite graph, Max Matching Size == Min Vertex Cover Size.
 * Maximum Independent Set Size == Total Vertices - Min Vertex Cover Size.
 * Analyzes faculty-course assignment conflicts and minimal supervisor coverage.
 */
public class KonigTheorem {

    public static class ConflictAnalysisResult {
        public final int maxMatchingSize;
        public final int minVertexCoverSize;
        public final int maxIndependentSetSize;
        public final Set<Integer> facultyInCover;   // U \ Z
        public final Set<Integer> coursesInCover;   // V ∩ Z
        public final Set<Integer> independentFaculty;
        public final Set<Integer> independentCourses;

        public ConflictAnalysisResult(int maxMatchingSize, int minVertexCoverSize, int maxIndependentSetSize,
                                      Set<Integer> facultyInCover, Set<Integer> coursesInCover,
                                      Set<Integer> independentFaculty, Set<Integer> independentCourses) {
            this.maxMatchingSize = maxMatchingSize;
            this.minVertexCoverSize = minVertexCoverSize;
            this.maxIndependentSetSize = maxIndependentSetSize;
            this.facultyInCover = facultyInCover;
            this.coursesInCover = coursesInCover;
            this.independentFaculty = independentFaculty;
            this.independentCourses = independentCourses;
        }

        @Override
        public String toString() {
            return String.format("König Conflict Analysis:\n" +
                            "  Max Matching Size: %d\n" +
                            "  Min Vertex Cover Size: %d (Faculty: %s, Courses: %s)\n" +
                            "  Max Independent Set Size: %d (Faculty: %s, Courses: %s)",
                    maxMatchingSize, minVertexCoverSize, facultyInCover, coursesInCover,
                    maxIndependentSetSize, independentFaculty, independentCourses);
        }
    }

    /**
     * Executes König's Theorem on bipartite matching graph.
     */
    public static ConflictAnalysisResult analyze(BipartiteMatching bm, BipartiteMatching.MatchingResult matchResult) {
        int leftSize = bm.getLeftSize();
        int rightSize = bm.getRightSize();

        int[] pairU = matchResult.pairU;
        int[] pairV = matchResult.pairV;

        // Step 1: Find unmatched vertices in U
        Set<Integer> zU = new HashSet<>();
        Set<Integer> zV = new HashSet<>();
        Queue<Integer> queue = new ArrayDeque<>();

        for (int u = 1; u <= leftSize; u++) {
            if (pairU[u] == 0) {
                zU.add(u);
                queue.add(u);
            }
        }

        // Step 2: BFS alternating paths
        // From U to V: follow non-matching edges
        // From V to U: follow matching edges
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : bm.getAdj().get(u)) {
                if (v != pairU[u] && !zV.contains(v)) {
                    zV.add(v);
                    int matchedU = pairV[v];
                    if (matchedU != 0 && !zU.contains(matchedU)) {
                        zU.add(matchedU);
                        queue.add(matchedU);
                    }
                }
            }
        }

        // Step 3: Vertex Cover = (U \ Z_U) ∪ (V ∩ Z_V)
        Set<Integer> facultyInCover = new HashSet<>();
        for (int u = 1; u <= leftSize; u++) {
            if (!zU.contains(u)) {
                facultyInCover.add(u);
            }
        }

        Set<Integer> coursesInCover = new HashSet<>(zV);
        int mvcSize = facultyInCover.size() + coursesInCover.size();

        // Step 4: Independent Set = complement of Vertex Cover
        Set<Integer> indFaculty = new HashSet<>();
        for (int u = 1; u <= leftSize; u++) {
            if (!facultyInCover.contains(u)) indFaculty.add(u);
        }

        Set<Integer> indCourses = new HashSet<>();
        for (int v = 1; v <= rightSize; v++) {
            if (!coursesInCover.contains(v)) indCourses.add(v);
        }

        int misSize = indFaculty.size() + indCourses.size();

        return new ConflictAnalysisResult(
                matchResult.maxMatchingSize,
                mvcSize,
                misSize,
                facultyInCover,
                coursesInCover,
                indFaculty,
                indCourses
        );
    }
}
