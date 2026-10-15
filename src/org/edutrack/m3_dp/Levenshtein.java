package org.edutrack.m3_dp;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 3 - Levenshtein Edit Distance.
 * Dynamic programming O(N * M) algorithm for student search query error correction.
 */
public class Levenshtein {

    public enum EditOp { MATCH, INSERT, DELETE, SUBSTITUTE }

    public static class EditStep {
        public final EditOp op;
        public final char sourceChar;
        public final char targetChar;

        public EditStep(EditOp op, char sourceChar, char targetChar) {
            this.op = op;
            this.sourceChar = sourceChar;
            this.targetChar = targetChar;
        }

        @Override
        public String toString() {
            switch (op) {
                case MATCH: return String.format("Keep '%c'", sourceChar);
                case INSERT: return String.format("Insert '%c'", targetChar);
                case DELETE: return String.format("Delete '%c'", sourceChar);
                case SUBSTITUTE: return String.format("Substitute '%c' -> '%c'", sourceChar, targetChar);
                default: return "";
            }
        }
    }

    public static class Result {
        public final int distance;
        public final int[][] dp;
        public final List<EditStep> editScript;

        public Result(int distance, int[][] dp, List<EditStep> editScript) {
            this.distance = distance;
            this.dp = dp;
            this.editScript = editScript;
        }
    }

    public static Result compute(String s1, String s2) {
        int n = s1.length();
        int m = s2.length();
        int[][] dp = new int[n + 1][m + 1];

        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int insertCost = dp[i][j - 1] + 1;
                    int deleteCost = dp[i - 1][j] + 1;
                    int subCost = dp[i - 1][j - 1] + 1;
                    dp[i][j] = Math.min(insertCost, Math.min(deleteCost, subCost));
                }
            }
        }

        // Traceback alignment
        List<EditStep> steps = new ArrayList<>();
        int i = n, j = m;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && s1.charAt(i - 1) == s2.charAt(j - 1)) {
                steps.add(0, new EditStep(EditOp.MATCH, s1.charAt(i - 1), s2.charAt(j - 1)));
                i--; j--;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
                steps.add(0, new EditStep(EditOp.SUBSTITUTE, s1.charAt(i - 1), s2.charAt(j - 1)));
                i--; j--;
            } else if (j > 0 && dp[i][j] == dp[i][j - 1] + 1) {
                steps.add(0, new EditStep(EditOp.INSERT, ' ', s2.charAt(j - 1)));
                j--;
            } else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) {
                steps.add(0, new EditStep(EditOp.DELETE, s1.charAt(i - 1), ' '));
                i--;
            } else {
                break;
            }
        }

        return new Result(dp[n][m], dp, steps);
    }

    /**
     * Suggests the closest academic catalog keyword from a dictionary.
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
