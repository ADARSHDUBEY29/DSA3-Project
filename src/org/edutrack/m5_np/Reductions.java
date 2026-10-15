package org.edutrack.m5_np;

import java.util.*;

/**
 * Module 5 - Polynomial Reductions Pipeline:
 * 1) 3-SAT -> CLIQUE
 * 2) CLIQUE -> INDEPENDENT-SET -> VERTEX-COVER
 * Demonstrates academic constraint reductions and deep conflict analysis.
 */
public class Reductions {

    public static class Graph {
        public final int vertexCount;
        public final boolean[][] adj;
        public final List<String> vertexLabels;

        public Graph(int vertexCount) {
            this.vertexCount = vertexCount;
            this.adj = new boolean[vertexCount][vertexCount];
            this.vertexLabels = new ArrayList<>(vertexCount);
            for (int i = 0; i < vertexCount; i++) {
                vertexLabels.add("v" + i);
            }
        }

        public void addEdge(int u, int v) {
            if (u != v) {
                adj[u][v] = true;
                adj[v][u] = true;
            }
        }

        public int edgeCount() {
            int count = 0;
            for (int i = 0; i < vertexCount; i++) {
                for (int j = i + 1; j < vertexCount; j++) {
                    if (adj[i][j]) count++;
                }
            }
            return count;
        }

        /**
         * Returns the complement graph \bar{G} where edge exists iff it doesn't in G.
         */
        public Graph complement() {
            Graph comp = new Graph(vertexCount);
            comp.vertexLabels.clear();
            comp.vertexLabels.addAll(this.vertexLabels);
            for (int i = 0; i < vertexCount; i++) {
                for (int j = i + 1; j < vertexCount; j++) {
                    if (!adj[i][j]) {
                        comp.addEdge(i, j);
                    }
                }
            }
            return comp;
        }
    }

    public static class ReductionResult {
        public final Graph graph;
        public final int targetK;
        public final String reductionName;
        public final String reductionExplanation;

        public ReductionResult(Graph graph, int targetK, String reductionName, String reductionExplanation) {
            this.graph = graph;
            this.targetK = targetK;
            this.reductionName = reductionName;
            this.reductionExplanation = reductionExplanation;
        }
    }

    /**
     * Reduces a 3-SAT instance to a CLIQUE instance.
     * Formula with M clauses -> Graph with 3*M vertices.
     * Target Clique size = M.
     */
    public static ReductionResult reduce3SatToClique(SATFormula formula) {
        List<List<Integer>> clauses = formula.getClauses();
        int m = clauses.size();
        int totalVertices = 3 * m;

        Graph g = new Graph(totalVertices);
        g.vertexLabels.clear();

        // Create labels for each literal instance (clauseIdx, literal)
        for (int c = 0; c < m; c++) {
            List<Integer> clause = clauses.get(c);
            for (int pos = 0; pos < 3; pos++) {
                int lit = pos < clause.size() ? clause.get(pos) : 0;
                int var = Math.abs(lit);
                String name = formula.getVariableName(var);
                String litStr = lit < 0 ? "¬" + name : name;
                g.vertexLabels.add(String.format("C%d[%s]", c + 1, litStr));
            }
        }

        // Add edges between vertices in different clauses that are not negations of each other
        for (int i = 0; i < totalVertices; i++) {
            int clauseI = i / 3;
            int posI = i % 3;
            int litI = posI < clauses.get(clauseI).size() ? clauses.get(clauseI).get(posI) : 0;

            for (int j = i + 1; j < totalVertices; j++) {
                int clauseJ = j / 3;
                int posJ = j % 3;
                int litJ = posJ < clauses.get(clauseJ).size() ? clauses.get(clauseJ).get(posJ) : 0;

                // Different clauses and non-contradictory literals
                if (clauseI != clauseJ && litI != -litJ) {
                    g.addEdge(i, j);
                }
            }
        }

        String explanation = String.format(
                "3-SAT formula with %d clauses reduced to CLIQUE graph with %d vertices and %d edges. " +
                        "A clique of size k = %d exists iff 3-SAT is satisfiable.",
                m, totalVertices, g.edgeCount(), m);

        return new ReductionResult(g, m, "3-SAT -> CLIQUE", explanation);
    }

    /**
     * Reduces CLIQUE instance (G, k) to INDEPENDENT-SET instance (\bar{G}, k).
     */
    public static ReductionResult reduceCliqueToIndependentSet(Graph g, int k) {
        Graph comp = g.complement();
        String explanation = String.format(
                "CLIQUE(G, %d) reduced to INDEPENDENT-SET(\\bar{G}, %d). " +
                        "Vertices: %d, Complement Edges: %d. A clique in G corresponds to an independent set in \\bar{G}.",
                k, k, comp.vertexCount, comp.edgeCount());
        return new ReductionResult(comp, k, "CLIQUE -> INDEPENDENT-SET", explanation);
    }

    /**
     * Reduces INDEPENDENT-SET instance (G, k) to VERTEX-COVER instance (G, |V| - k).
     */
    public static ReductionResult reduceIndependentSetToVertexCover(Graph g, int k) {
        int targetCover = g.vertexCount - k;
        String explanation = String.format(
                "INDEPENDENT-SET(G, %d) reduced to VERTEX-COVER(G, k' = |V| - %d = %d). " +
                        "S is an independent set in G iff V \\ S is a vertex cover.",
                k, k, targetCover);
        return new ReductionResult(g, targetCover, "INDEPENDENT-SET -> VERTEX-COVER", explanation);
    }
}
