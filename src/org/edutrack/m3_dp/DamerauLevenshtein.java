package org.edutrack.m3_dp;

import java.util.List;

/**
 * Module 3 - Damerau-Levenshtein Distance.
 * Handles adjacent transpositions (swaps) in addition to insertions, deletions, and substitutions.
 * Essential for correcting queries typed under zero-G microgravity vibrations and sensory gloves.
 */
public class DamerauLevenshtein {

    public static class DLResult {
        public final int distance;
        public final int[][] dp;
        public final boolean transpositionUsed;

        public DLResult(int distance, int[][] dp, boolean transpositionUsed) {
            this.distance = distance;
            this.dp = dp;
            this.transpositionUsed = transpositionUsed;
        }
    }

    /**
     * Computes Damerau-Levenshtein distance (Optimal String Alignment) between s1 and s2.
     */
    public static DLResult compute(String s1, String s2) {
        int n = s1.length();
        int m = s2.length();
        int[][] dp = new int[n + 1][m + 1];

        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;

        boolean transpositionDetected = false;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;

                dp[i][j] = Math.min(
                        dp[i - 1][j] + 1, // deletion
                        Math.min(
                                dp[i][j - 1] + 1, // insertion
                                dp[i - 1][j - 1] + cost // substitution
                        )
                );

                // Adjacent transposition check
                if (i > 1 && j > 1
                        && s1.charAt(i - 1) == s2.charAt(j - 2)
                        && s1.charAt(i - 2) == s2.charAt(j - 1)) {
                    int transCost = dp[i - 2][j - 2] + 1;
                    if (transCost < dp[i][j]) {
                        dp[i][j] = transCost;
                        transpositionDetected = true;
                    }
                }
            }
        }

        return new DLResult(dp[n][m], dp, transpositionDetected);
    }

    /**
     * Corrects a query against academic keywords considering adjacent transpositions.
     */
    public static String suggestCorrection(String query, List<String> dictionary) {
        String bestMatch = query;
        int minDistance = Integer.MAX_VALUE;

        for (String candidate : dictionary) {
            int d = compute(query.toLowerCase(), candidate.toLowerCase()).distance;
            if (d < minDistance) {
                minDistance = d;
                bestMatch = candidate;
            }
        }
        return bestMatch;
    }
}
