package org.edutrack.m1_string;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 1 - Rabin-Karp String Matching Algorithm.
 * Employs polynomial rolling hash with prime modulus to search assignment and course codes.
 */
public class RabinKarp {

    private static final long PRIME_MOD = 1_000_000_007L;
    private static final long BASE = 256L;

    public static class RKResult {
        public final List<Integer> matchIndices;
        public final int spuriousHits;
        public final int hashEvaluations;
        public final long executionTimeNs;

        public RKResult(List<Integer> matchIndices, int spuriousHits, int hashEvaluations, long executionTimeNs) {
            this.matchIndices = matchIndices;
            this.spuriousHits = spuriousHits;
            this.hashEvaluations = hashEvaluations;
            this.executionTimeNs = executionTimeNs;
        }
    }

    /**
     * Searches for pattern in text using rolling hash.
     */
    public static RKResult search(String text, String pattern) {
        long startTime = System.nanoTime();
        List<Integer> matches = new ArrayList<>();
        int spuriousHits = 0;
        int evaluations = 0;

        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new RKResult(matches, 0, 0, System.nanoTime() - startTime);
        }

        int n = text.length();
        int m = pattern.length();

        // Compute BASE^(m-1) % PRIME_MOD
        long h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * BASE) % PRIME_MOD;
        }

        long patternHash = 0;
        long windowHash = 0;

        for (int i = 0; i < m; i++) {
            patternHash = (BASE * patternHash + pattern.charAt(i)) % PRIME_MOD;
            windowHash = (BASE * windowHash + text.charAt(i)) % PRIME_MOD;
        }

        for (int s = 0; s <= n - m; s++) {
            evaluations++;
            if (patternHash == windowHash) {
                // Verify exact characters to eliminate spurious collision
                boolean exactMatch = true;
                for (int j = 0; j < m; j++) {
                    if (text.charAt(s + j) != pattern.charAt(j)) {
                        exactMatch = false;
                        spuriousHits++;
                        break;
                    }
                }
                if (exactMatch) {
                    matches.add(s);
                }
            }

            // Roll hash to next window
            if (s < n - m) {
                windowHash = (BASE * (windowHash - text.charAt(s) * h) + text.charAt(s + m)) % PRIME_MOD;
                if (windowHash < 0) {
                    windowHash += PRIME_MOD;
                }
            }
        }

        long elapsed = System.nanoTime() - startTime;
        return new RKResult(matches, spuriousHits, evaluations, elapsed);
    }
}
