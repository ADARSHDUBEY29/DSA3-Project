package org.edutrack.m3_dp;

/**
 * Module 3 - Optimal Binary Search Tree (OBST).
 * Dynamic programming O(N^3) to organize frequently accessed orbital academic keys
 * to minimize the expected search time across campus neural search terminals.
 */
public class OptimalBST {

    public static class OBSTNode {
        public String key;
        public OBSTNode left;
        public OBSTNode right;

        public OBSTNode(String key) {
            this.key = key;
        }
    }

    public static class OBSTResult {
        public final double expectedCost;
        public final double[][] e; // expected search costs
        public final double[][] w; // weight sums
        public final int[][] root;  // root indices
        public final OBSTNode treeRoot;
        public final String[] keys;

        public OBSTResult(double expectedCost, double[][] e, double[][] w, int[][] root, OBSTNode treeRoot, String[] keys) {
            this.expectedCost = expectedCost;
            this.e = e;
            this.w = w;
            this.root = root;
            this.treeRoot = treeRoot;
            this.keys = keys;
        }

        public void printTree() {
            printSubtree(treeRoot, "", true);
        }

        private void printSubtree(OBSTNode node, String prefix, boolean isTail) {
            if (node != null) {
                System.out.println(prefix + (isTail ? "└── " : "├── ") + node.key);
                printSubtree(node.left, prefix + (isTail ? "    " : "│   "), false);
                printSubtree(node.right, prefix + (isTail ? "    " : "│   "), true);
            }
        }
    }

    /**
     * Solves OBST for keys 1..n with probabilities p[1..n] and dummy probabilities q[0..n].
     */
    public static OBSTResult build(String[] keys, double[] p, double[] q) {
        int n = keys.length;
        double[][] e = new double[n + 2][n + 2];
        double[][] w = new double[n + 2][n + 2];
        int[][] root = new int[n + 1][n + 1];

        // Base cases
        for (int i = 1; i <= n + 1; i++) {
            e[i][i - 1] = q[i - 1];
            w[i][i - 1] = q[i - 1];
        }

        // Subtree lengths l = 1 to n
        for (int l = 1; l <= n; l++) {
            for (int i = 1; i <= n - l + 1; i++) {
                int j = i + l - 1;
                e[i][j] = Double.MAX_VALUE;
                w[i][j] = w[i][j - 1] + p[j - 1] + q[j];

                for (int r = i; r <= j; r++) {
                    double t = e[i][r - 1] + e[r + 1][j] + w[i][j];
                    if (t < e[i][j]) {
                        e[i][j] = t;
                        root[i][j] = r;
                    }
                }
            }
        }

        OBSTNode treeRoot = reconstructTree(root, keys, 1, n);
        return new OBSTResult(e[1][n], e, w, root, treeRoot, keys);
    }

    private static OBSTNode reconstructTree(int[][] root, String[] keys, int i, int j) {
        if (i > j) return null;
        int r = root[i][j];
        OBSTNode node = new OBSTNode(keys[r - 1]);
        node.left = reconstructTree(root, keys, i, r - 1);
        node.right = reconstructTree(root, keys, r + 1, j);
        return node;
    }
}
