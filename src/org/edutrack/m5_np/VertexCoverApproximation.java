package org.edutrack.m5_np;

import java.util.*;

/**
 * Module 5 - Vertex Cover 2-Approximation Algorithm.
 * Employs maximal matching greedy edge selection: repeatedly picks an uncovered edge (u, v),
 * adds both u and v to cover, and removes all edges incident to either vertex.
 * Guaranteed approximation ratio: |C| <= 2 * |C*|.
 * Used for covering and resolving examination conflicts and zero-G pod collisions.
 */
public class VertexCoverApproximation {

    public static class CoverResult {
        public final Set<Integer> cover;
        public final List<int[]> selectedEdges; // matching edges picked
        public final int coverSize;
        public final double maxTheoreticalOptSize;

        public CoverResult(Set<Integer> cover, List<int[]> selectedEdges) {
            this.cover = cover;
            this.selectedEdges = selectedEdges;
            this.coverSize = cover.size();
            // Since selectedEdges form an independent edge matching M, |C*| >= |M|
            // and |C| = 2 * |M| <= 2 * |C*|
            this.maxTheoreticalOptSize = (double) coverSize / 2.0;
        }

        @Override
        public String toString() {
            return String.format("2-Approximation Vertex Cover Size: %d (Matched Edges: %d, Lower Bound |C*| >= %.0f)\nVertices in Cover: %s",
                    coverSize, selectedEdges.size(), maxTheoreticalOptSize, cover);
        }
    }

    /**
     * Computes 2-approximation vertex cover for graph G.
     */
    public static CoverResult compute2Approx(Reductions.Graph g) {
        int n = g.vertexCount;
        boolean[][] remaining = new boolean[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(g.adj[i], 0, remaining[i], 0, n);
        }

        Set<Integer> cover = new LinkedHashSet<>();
        List<int[]> pickedEdges = new ArrayList<>();

        for (int u = 0; u < n; u++) {
            for (int v = u + 1; v < n; v++) {
                if (remaining[u][v]) {
                    // Pick edge (u, v)
                    pickedEdges.add(new int[]{u, v});
                    cover.add(u);
                    cover.add(v);

                    // Remove all incident edges to u and v
                    for (int k = 0; k < n; k++) {
                        remaining[u][k] = false;
                        remaining[k][u] = false;
                        remaining[v][k] = false;
                        remaining[k][v] = false;
                    }
                }
            }
        }

        return new CoverResult(cover, pickedEdges);
    }
}
