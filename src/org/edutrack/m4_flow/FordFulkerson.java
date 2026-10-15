package org.edutrack.m4_flow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Module 4 - Ford-Fulkerson Algorithm.
 * Computes maximum flow using Depth-First Search augmenting paths.
 * Allocates physical classroom modules, floating pods, and orbital power grid capacities.
 */
public class FordFulkerson {

    public static class FlowResult {
        public final int maxFlow;
        public final List<String> allocationPaths;
        public final long executionTimeNs;

        public FlowResult(int maxFlow, List<String> allocationPaths, long executionTimeNs) {
            this.maxFlow = maxFlow;
            this.allocationPaths = allocationPaths;
            this.executionTimeNs = executionTimeNs;
        }
    }

    public static FlowResult computeMaxFlow(FlowNetwork network, int source, int sink) {
        long start = System.nanoTime();
        network.resetFlows();
        int maxFlow = 0;
        List<String> paths = new ArrayList<>();
        boolean[] visited = new boolean[network.getVertexCount()];

        while (true) {
            Arrays.fill(visited, false);
            List<FlowNetwork.Edge> path = new ArrayList<>();
            int bottleneck = dfs(network, source, sink, Integer.MAX_VALUE, visited, path);
            if (bottleneck == 0) break;

            maxFlow += bottleneck;
            StringBuilder sb = new StringBuilder("Augmenting Path: ");
            for (int i = 0; i < path.size(); i++) {
                sb.append(path.get(i).from).append(" -> ");
                if (i == path.size() - 1) sb.append(path.get(i).to);
            }
            sb.append(" (flow: +").append(bottleneck).append(")");
            paths.add(sb.toString());
        }

        long elapsed = System.nanoTime() - start;
        return new FlowResult(maxFlow, paths, elapsed);
    }

    private static int dfs(FlowNetwork network, int u, int sink, int bottleneck,
                           boolean[] visited, List<FlowNetwork.Edge> path) {
        if (u == sink) return bottleneck;
        visited[u] = true;

        for (FlowNetwork.Edge edge : network.getAdj().get(u)) {
            if (!visited[edge.to] && edge.remainingCapacity() > 0) {
                path.add(edge);
                int pushed = dfs(network, edge.to, sink, Math.min(bottleneck, edge.remainingCapacity()), visited, path);
                if (pushed > 0) {
                    edge.augment(pushed);
                    return pushed;
                }
                path.remove(path.size() - 1);
            }
        }
        return 0;
    }
}
