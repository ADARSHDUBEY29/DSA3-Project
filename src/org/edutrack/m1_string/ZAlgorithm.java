package org.edutrack.m1_string;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 1 - Z-Algorithm (Z-Function).
 * Computes Z-array in O(N) linear time using a sliding match window [L, R].
 * Used to detect repeated phrases and recurring patterns in floating-campus assignments.
 */
public class ZAlgorithm {

    public static class ZResult {
        public final int[] zArray;
        public final List<Integer> matchIndices;
        public final List<String> recurringPhrases;
        public final long executionTimeNs;

        public ZResult(int[] zArray, List<Integer> matchIndices, List<String> recurringPhrases, long executionTimeNs) {
            this.zArray = zArray;
            this.matchIndices = matchIndices;
            this.recurringPhrases = recurringPhrases;
            this.executionTimeNs = executionTimeNs;
        }
    }

    /**
     * Computes the Z-array for string S.
     * Z[i] = length of the longest common prefix between S and S[i..N-1].
     */
    public static int[] calculateZ(String s) {
        int n = s.length();
        int[] z = new int[n];
        if (n == 0) return z;
        z[0] = n;

        int l = 0, r = 0;
        for (int i = 1; i < n; i++) {
            if (i <= r) {
                z[i] = Math.min(r - i + 1, z[i - l]);
            }
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) {
                z[i]++;
            }
            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }
        }
        return z;
    }

    /**
     * Pattern search using Z-algorithm by forming concatenation: pattern + "$" + text.
     */
    public static ZResult search(String text, String pattern) {
        long startTime = System.nanoTime();
        List<Integer> matches = new ArrayList<>();
        if (pattern == null || text == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new ZResult(new int[0], matches, new ArrayList<>(), System.nanoTime() - startTime);
        }

        String concat = pattern + "\u0001" + text;
        int[] z = calculateZ(concat);
        int m = pattern.length();

        for (int i = m + 1; i < concat.length(); i++) {
            if (z[i] == m) {
                matches.add(i - m - 1);
            }
        }

        long elapsed = System.nanoTime() - startTime;
        return new ZResult(z, matches, new ArrayList<>(), elapsed);
    }

    /**
     * Analyzes an assignment text to detect recurring phrases of at least minLength.
     */
    public static List<String> findRepeatedPhrases(String text, int minLength) {
        List<String> repeated = new ArrayList<>();
        int n = text.length();
        for (int i = 0; i < n - minLength; i++) {
            String suffix = text.substring(i);
            int[] z = calculateZ(suffix);
            for (int j = 1; j < suffix.length(); j++) {
                if (z[j] >= minLength) {
                    String phrase = suffix.substring(0, z[j]);
                    if (!repeated.contains(phrase)) {
                        repeated.add(phrase);
                    }
                }
            }
        }
        return repeated;
    }
}
