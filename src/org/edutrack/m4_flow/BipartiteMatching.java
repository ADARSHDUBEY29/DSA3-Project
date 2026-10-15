package org.edutrack.m4_flow;

import java.util.*;

/**
 * Module 4 - Maximum Bipartite Matching (Hopcroft-Karp Algorithm O(E * sqrt(V))).
 * Assigns faculty members to eligible courses under qualifications and max-load limits.
 */
public class BipartiteMatching {

    private final int leftSize;  // Faculty count
    private final int rightSize; // Course count
    private final List<List<Integer>> adj; // 1-indexed left to 1-indexed right
    private final int[] pairU; // pair of u in U (left)
    private final int[] pairV; // pair of v in V (right)
    private final int[] dist;  // BFS distances

    public static class MatchingResult {
        public final int maxMatchingSize;
        public final Map<Integer, Integer> leftToRightMatch; // left -> right (1-indexed)
        public final int[] pairU;
        public final int[] pairV;

        public MatchingResult(int maxMatchingSize, Map<Integer, Integer> leftToRightMatch, int[] pairU, int[] pairV) {
            this.maxMatchingSize = maxMatchingSize;
            this.leftToRightMatch = leftToRightMatch;
            this.pairU = pairU;
            this.pairV = pairV;
        }
    }

    public BipartiteMatching(int leftSize, int rightSize) {
        this.leftSize = leftSize;
        this.rightSize = rightSize;
        this.adj = new ArrayList<>(leftSize + 1);
        for (int i = 0; i <= leftSize; i++) {
            adj.add(new ArrayList<>());
        }
        this.pairU = new int[leftSize + 1];
        this.pairV = new int[rightSize + 1];
        this.dist = new int[leftSize + 1];
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
    }

    public List<List<Integer>> getAdj() {
        return adj;
    }

    public int getLeftSize() { return leftSize; }
    public int getRightSize() { return rightSize; }

    public MatchingResult solve() {
        Arrays.fill(pairU, 0);
        Arrays.fill(pairV, 0);

        int matching = 0;
        while (bfs()) {
            for (int u = 1; u <= leftSize; u++) {
                if (pairU[u] == 0 && dfs(u)) {
                    matching++;
                }
            }
        }

        Map<Integer, Integer> map = new LinkedHashMap<>();
        for (int u = 1; u <= leftSize; u++) {
            if (pairU[u] != 0) {
                map.put(u, pairU[u]);
            }
        }

        return new MatchingResult(matching, map, pairU.clone(), pairV.clone());
    }

    private boolean bfs() {
        Queue<Integer> queue = new ArrayDeque<>();
        for (int u = 1; u <= leftSize; u++) {
            if (pairU[u] == 0) {
                dist[u] = 0;
                queue.add(u);
            } else {
                dist[u] = Integer.MAX_VALUE;
            }
        }

        dist[0] = Integer.MAX_VALUE;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            if (dist[u] < dist[0]) {
                for (int v : adj.get(u)) {
                    if (dist[pairV[v]] == Integer.MAX_VALUE) {
                        dist[pairV[v]] = dist[u] + 1;
                        queue.add(pairV[v]);
                    }
                }
            }
        }
        return dist[0] != Integer.MAX_VALUE;
    }

    private boolean dfs(int u) {
        if (u != 0) {
            for (int v : adj.get(u)) {
                if (dist[pairV[v]] == dist[u] + 1) {
                    if (dfs(pairV[v])) {
                        pairV[v] = u;
                        pairU[u] = v;
                        return true;
                    }
                }
            }
            dist[u] = Integer.MAX_VALUE;
            return false;
        }
        return true;
    }
}
