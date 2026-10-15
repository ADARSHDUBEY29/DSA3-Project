package org.edutrack.m4_flow;

import java.util.*;

/**
 * Module 4 - Edmonds-Karp Algorithm (BFS-based Max-Flow O(V * E^2)).
 * Solves academic resource-flow problems: optimal student transit through pressurized airlocks and drifting docking bays.
 */
public class EdmondsKarp {

    public static class EKResult {
        public final int maxFlow;
        public final int augmentations;
        public final long executionTimeNs;

        public EKResult(int maxFlow, int augmentations, long executionTimeNs) {
            this.maxFlow = maxFlow;
            this.augmentations = augmentations;
            this.executionTimeNs = executionTimeNs;
        }
    }

    public static EKResult computeMaxFlow(FlowNetwork network, int source, int sink) {
        long start = System.nanoTime();
        network.resetFlows();

        int maxFlow = 0;
        int augmentations = 0;
        int n = network.getVertexCount();
        FlowNetwork.Edge[] parentEdge = new FlowNetwork.Edge[n];

        while (true) {
            Arrays.fill(parentEdge, null);
            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);

            while (!queue.isEmpty() && parentEdge[sink] == null) {
                int u = queue.poll();
                for (FlowNetwork.Edge edge : network.getAdj().get(u)) {
                    if (edge.to != source && parentEdge[edge.to] == null && edge.remainingCapacity() > 0) {
                        parentEdge[edge.to] = edge;
                        queue.add(edge.to);
                    }
                }
            }

            if (parentEdge[sink] == null) break; // no augmenting path found

            // Find bottleneck capacity along BFS path
            int bottleneck = Integer.MAX_VALUE;
            for (FlowNetwork.Edge e = parentEdge[sink]; e != null; e = parentEdge[e.from]) {
                bottleneck = Math.min(bottleneck, e.remainingCapacity());
            }

            // Augment along path
            for (FlowNetwork.Edge e = parentEdge[sink]; e != null; e = parentEdge[e.from]) {
                e.augment(bottleneck);
            }

            maxFlow += bottleneck;
            augmentations++;
        }

        long elapsed = System.nanoTime() - start;
        return new EKResult(maxFlow, augmentations, elapsed);
    }
}
