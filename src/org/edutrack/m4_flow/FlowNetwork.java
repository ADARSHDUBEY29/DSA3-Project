package org.edutrack.m4_flow;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 4 - Flow Network representation with residual edges.
 */
public class FlowNetwork {

    public static class Edge {
        public final int from;
        public final int to;
        public final int capacity;
        public int flow;
        public Edge residual;

        public Edge(int from, int to, int capacity) {
            this.from = from;
            this.to = to;
            this.capacity = capacity;
            this.flow = 0;
        }

        public int remainingCapacity() {
            return capacity - flow;
        }

        public void augment(int bottleneck) {
            this.flow += bottleneck;
            this.residual.flow -= bottleneck;
        }

        @Override
        public String toString() {
            return String.format("%d -> %d [flow: %d / cap: %d]", from, to, flow, capacity);
        }
    }

    private final int vertexCount;
    private final List<List<Edge>> adj;
    private final List<Edge> allEdges;

    public FlowNetwork(int vertexCount) {
        this.vertexCount = vertexCount;
        this.adj = new ArrayList<>(vertexCount);
        this.allEdges = new ArrayList<>();
        for (int i = 0; i < vertexCount; i++) {
            adj.add(new ArrayList<>());
        }
    }

    public void addEdge(int from, int to, int capacity) {
        Edge forward = new Edge(from, to, capacity);
        Edge backward = new Edge(to, from, 0); // residual reverse edge
        forward.residual = backward;
        backward.residual = forward;

        adj.get(from).add(forward);
        adj.get(to).add(backward);
        allEdges.add(forward);
    }

    public int getVertexCount() { return vertexCount; }
    public List<List<Edge>> getAdj() { return adj; }
    public List<Edge> getAllEdges() { return allEdges; }

    public void resetFlows() {
        for (Edge e : allEdges) {
            e.flow = 0;
            if (e.residual != null) e.residual.flow = 0;
        }
    }
}
