package org.edutrack.m1_string;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 1 - Knuth-Morris-Pratt (KMP) Algorithm.
 * Efficient pattern matching with O(N + M) worst-case time complexity.
 * Used for searching course names, student queries, and academic keywords.
 */
public class KMP {

    public static class KMPResult {
        public final List<Integer> matchIndices;
        public final int[] pi;
        public final int comparisons;
        public final long executionTimeNs;

        public KMPResult(List<Integer> matchIndices, int[] pi, int comparisons, long executionTimeNs) {
            this.matchIndices = matchIndices;
            this.pi = pi;
            this.comparisons = comparisons;
            this.executionTimeNs = executionTimeNs;
        }
    }

    /**
     * Computes the prefix function (pi table / LPS) for pattern P.
     * pi[i] is the length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i].
     */
    public static int[] computePrefixFunction(String pattern) {
        int m = pattern.length();
        int[] pi = new int[m];
        int j = 0;
        for (int i = 1; i < m; i++) {
            while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) {
                j = pi[j - 1];
            }
            if (pattern.charAt(i) == pattern.charAt(j)) {
                j++;
            }
            pi[i] = j;
        }
        return pi;
    }

    /**
     * Executes KMP search on text T with pattern P.
     */
    public static KMPResult search(String text, String pattern) {
        long startTime = System.nanoTime();
        List<Integer> matches = new ArrayList<>();
        int comparisons = 0;

        if (pattern == null || text == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new KMPResult(matches, new int[0], 0, System.nanoTime() - startTime);
        }

        int[] pi = computePrefixFunction(pattern);
        int n = text.length();
        int m = pattern.length();
        int q = 0; // number of characters matched

        for (int i = 0; i < n; i++) {
            while (q > 0 && pattern.charAt(q) != text.charAt(i)) {
                comparisons++;
                q = pi[q - 1];
            }
            comparisons++;
            if (pattern.charAt(q) == text.charAt(i)) {
                q++;
            }
            if (q == m) {
                matches.add(i - m + 1);
                q = pi[q - 1]; // look for next match
            }
        }

        long elapsed = System.nanoTime() - startTime;
        return new KMPResult(matches, pi, comparisons, elapsed);
    }
}
