package org.edutrack.m4_flow;

import java.util.*;

/**
 * Module 4 - Dinic's Algorithm (O(V^2 * E)).
 * Leverages Level Graphs (BFS) and Blocking Flows (DFS with current-edge pointers).
 * Solves larger allocation networks across the multi-module orbital campus.
 */
public class Dinic {

    public static class DinicResult {
        public final int maxFlow;
        public final int phaseCount;
        public final long executionTimeNs;

        public DinicResult(int maxFlow, int phaseCount, long executionTimeNs) {
            this.maxFlow = maxFlow;
            this.phaseCount = phaseCount;
            this.executionTimeNs = executionTimeNs;
        }
    }

    public static DinicResult computeMaxFlow(FlowNetwork network, int source, int sink) {
        long start = System.nanoTime();
        network.resetFlows();

        int n = network.getVertexCount();
        int[] level = new int[n];
        int[] ptr = new int[n];
        int maxFlow = 0;
        int phases = 0;

        while (bfsLevelGraph(network, source, sink, level)) {
            Arrays.fill(ptr, 0);
            phases++;
            while (true) {
                int pushed = dfsBlockingFlow(network, source, sink, Integer.MAX_VALUE, level, ptr);
                if (pushed == 0) break;
                maxFlow += pushed;
            }
        }

        long elapsed = System.nanoTime() - start;
        return new DinicResult(maxFlow, phases, elapsed);
    }

    private static boolean bfsLevelGraph(FlowNetwork network, int source, int sink, int[] level) {
        Arrays.fill(level, -1);
        level[source] = 0;
        Queue<Integer> q = new ArrayDeque<>();
        q.add(source);

        while (!q.isEmpty()) {
            int u = q.poll();
            for (FlowNetwork.Edge edge : network.getAdj().get(u)) {
                if (edge.remainingCapacity() > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[u] + 1;
                    q.add(edge.to);
                }
            }
        }
        return level[sink] != -1;
    }

    private static int dfsBlockingFlow(FlowNetwork network, int u, int sink, int flow, int[] level, int[] ptr) {
        if (u == sink || flow == 0) return flow;

        List<FlowNetwork.Edge> edges = network.getAdj().get(u);
        for (; ptr[u] < edges.size(); ptr[u]++) {
            FlowNetwork.Edge edge = edges.get(ptr[u]);
            if (level[edge.to] == level[u] + 1 && edge.remainingCapacity() > 0) {
                int pushed = dfsBlockingFlow(network, edge.to, sink, Math.min(flow, edge.remainingCapacity()), level, ptr);
                if (pushed > 0) {
                    edge.augment(pushed);
                    return pushed;
                }
            }
        }
        return 0;
    }
}
