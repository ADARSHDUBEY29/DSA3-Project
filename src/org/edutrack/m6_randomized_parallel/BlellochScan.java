package org.edutrack.m6_randomized_parallel;

import java.util.Arrays;

/**
 * Module 6 - Blelloch Parallel Scan (Prefix Sum).
 * Work-efficient parallel scan with O(N) total operations and O(log N) depth/span.
 * Comprises Up-Sweep (reduce) and Down-Sweep phases.
 * Computes cumulative academic statistics, running student credits, and orbital power draws.
 */
public class BlellochScan {

    public static class ScanResult {
        public final long[] exclusiveScan;
        public final long[] inclusiveScan;
        public final long totalSum;
        public final int workOperations;
        public final int depthSteps;

        public ScanResult(long[] exclusiveScan, long[] inclusiveScan, long totalSum, int workOperations, int depthSteps) {
            this.exclusiveScan = exclusiveScan;
            this.inclusiveScan = inclusiveScan;
            this.totalSum = totalSum;
            this.workOperations = workOperations;
            this.depthSteps = depthSteps;
        }
    }

    /**
     * Executes Blelloch Scan on array of values.
     * Automatically pads to next power of 2 internally for tree balancing.
     */
    public static ScanResult scan(long[] input) {
        int originalLen = input.length;
        if (originalLen == 0) {
            return new ScanResult(new long[0], new long[0], 0, 0, 0);
        }

        // Pad to next power of 2
        int n = 1;
        while (n < originalLen) n <<= 1;

        long[] tree = new long[n];
        System.arraycopy(input, 0, tree, 0, originalLen);

        int workOps = 0;
        int depth = 0;

        // Phase 1: Up-Sweep (Reduce)
        for (int d = 0; (1 << d) < n; d++) {
            depth++;
            int stride = 1 << (d + 1);
            int half = 1 << d;
            for (int k = 0; k < n; k += stride) {
                tree[k + stride - 1] += tree[k + half - 1];
                workOps++;
            }
        }

        long totalSum = tree[n - 1];
        tree[n - 1] = 0; // set root to zero identity for exclusive scan

        // Phase 2: Down-Sweep
        for (int d = (int) (Math.log(n) / Math.log(2)) - 1; d >= 0; d--) {
            depth++;
            int stride = 1 << (d + 1);
            int half = 1 << d;
            for (int k = 0; k < n; k += stride) {
                long leftVal = tree[k + half - 1];
                tree[k + half - 1] = tree[k + stride - 1];
                tree[k + stride - 1] += leftVal;
                workOps += 2;
            }
        }

        long[] exclusive = new long[originalLen];
        long[] inclusive = new long[originalLen];
        System.arraycopy(tree, 0, exclusive, 0, originalLen);

        for (int i = 0; i < originalLen; i++) {
            inclusive[i] = exclusive[i] + input[i];
        }

        return new ScanResult(exclusive, inclusive, totalSum, workOps, depth);
    }
}
