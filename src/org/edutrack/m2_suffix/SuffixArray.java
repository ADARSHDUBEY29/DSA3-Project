package org.edutrack.m2_suffix;

import java.util.Arrays;

/**
 * Module 2 - Suffix Array with Binary Search Pattern Matching.
 * Indexes digital textbooks, notes, and academic documents.
 */
public class SuffixArray {

    private final String text;
    private final int n;
    private final int[] sa;

    public SuffixArray(String text) {
        this.text = text;
        this.n = text.length();
        this.sa = buildSuffixArray(text);
    }

    public int[] getSuffixArray() {
        return sa;
    }

    public String getText() {
        return text;
    }

    /**
     * Builds Suffix Array using Prefix Doubling algorithm O(N log^2 N).
     */
    private int[] buildSuffixArray(String s) {
        int len = s.length();
        Suffix[] suffixes = new Suffix[len];
        for (int i = 0; i < len; i++) {
            suffixes[i] = new Suffix(i, s.charAt(i) - ' ', (i + 1 < len) ? s.charAt(i + 1) - ' ' : -1);
        }

        Arrays.sort(suffixes);
        int[] ind = new int[len];

        for (int k = 4; k < 2 * len; k *= 2) {
            int rank = 0;
            int prevRank = suffixes[0].rank1;
            suffixes[0].rank1 = rank;
            ind[suffixes[0].index] = 0;

            for (int i = 1; i < len; i++) {
                if (suffixes[i].rank1 == prevRank && suffixes[i].rank2 == suffixes[i - 1].rank2) {
                    prevRank = suffixes[i].rank1;
                    suffixes[i].rank1 = rank;
                } else {
                    prevRank = suffixes[i].rank1;
                    suffixes[i].rank1 = ++rank;
                }
                ind[suffixes[i].index] = i;
            }

            for (int i = 0; i < len; i++) {
                int nextIndex = suffixes[i].index + k / 2;
                suffixes[i].rank2 = (nextIndex < len) ? suffixes[ind[nextIndex]].rank1 : -1;
            }

            Arrays.sort(suffixes);
        }

        int[] result = new int[len];
        for (int i = 0; i < len; i++) {
            result[i] = suffixes[i].index;
        }
        return result;
    }

    /**
     * Binary search pattern matching in O(M log N) time.
     * Returns range [low, high] of matching suffixes.
     */
    public int[] findPatternRange(String pattern) {
        int m = pattern.length();
        if (m == 0 || n == 0) return new int[]{-1, -1};

        // Binary search lower bound
        int low = 0, high = n - 1;
        int first = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            int suffixStart = sa[mid];
            String sub = text.substring(suffixStart, Math.min(n, suffixStart + m));
            int cmp = sub.compareTo(pattern);

            if (cmp >= 0) {
                if (cmp == 0) first = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        if (first == -1) return new int[]{-1, -1};

        // Binary search upper bound
        low = first;
        high = n - 1;
        int last = first;
        while (low <= high) {
            int mid = (low + high) / 2;
            int suffixStart = sa[mid];
            String sub = text.substring(suffixStart, Math.min(n, suffixStart + m));
            int cmp = sub.compareTo(pattern);

            if (cmp == 0) {
                last = mid;
                low = mid + 1;
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return new int[]{first, last};
    }

    public int countOccurrences(String pattern) {
        int[] range = findPatternRange(pattern);
        if (range[0] == -1) return 0;
        return range[1] - range[0] + 1;
    }

    private static class Suffix implements Comparable<Suffix> {
        int index;
        int rank1;
        int rank2;

        Suffix(int index, int rank1, int rank2) {
            this.index = index;
            this.rank1 = rank1;
            this.rank2 = rank2;
        }

        @Override
        public int compareTo(Suffix o) {
            if (this.rank1 != o.rank1) return Integer.compare(this.rank1, o.rank1);
            return Integer.compare(this.rank2, o.rank2);
        }
    }
}
