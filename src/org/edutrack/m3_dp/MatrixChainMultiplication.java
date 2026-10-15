package org.edutrack.m3_dp;

/**
 * Module 3 - Matrix-Chain Multiplication (MCM).
 * Dynamic programming O(N^3) to optimize the parenthesization of multi-stage academic tensor operations.
 * Minimizes computational FLOPs and satellite memory bandwidth for zero-G analytics pipelines.
 */
public class MatrixChainMultiplication {

    public static class MCMResult {
        public final long minOperations;
        public final long[][] m; // DP table
        public final int[][] s; // Split table
        public final String optimalParenthesization;
        public final String[] matrixLabels;

        public MCMResult(long minOperations, long[][] m, int[][] s, String optimalParenthesization, String[] matrixLabels) {
            this.minOperations = minOperations;
            this.m = m;
            this.s = s;
            this.optimalParenthesization = optimalParenthesization;
            this.matrixLabels = matrixLabels;
        }
    }

    /**
     * Solves MCM given dimension array p where matrix i has dimension p[i-1] x p[i].
     */
    public static MCMResult solve(int[] p, String[] labels) {
        int n = p.length - 1; // number of matrices
        long[][] m = new long[n + 1][n + 1];
        int[][] s = new int[n + 1][n + 1];

        // Length l is the chain length
        for (int l = 2; l <= n; l++) {
            for (int i = 1; i <= n - l + 1; i++) {
                int j = i + l - 1;
                m[i][j] = Long.MAX_VALUE;
                for (int k = i; k <= j - 1; k++) {
                    long q = m[i][k] + m[k + 1][j] + (long) p[i - 1] * p[k] * p[j];
                    if (q < m[i][j]) {
                        m[i][j] = q;
                        s[i][j] = k;
                    }
                }
            }
        }

        String paren = buildOptimalString(s, 1, n, labels);
        return new MCMResult(m[1][n], m, s, paren, labels);
    }

    private static String buildOptimalString(int[][] s, int i, int j, String[] labels) {
        if (i == j) {
            return (labels != null && i - 1 < labels.length) ? labels[i - 1] : ("M" + i);
        }
        return "(" + buildOptimalString(s, i, s[i][j], labels) + " × " + buildOptimalString(s, s[i][j] + 1, j, labels) + ")";
    }
}
