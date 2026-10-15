package org.edutrack.m2_suffix;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 2 - Kasai's Algorithm for LCP (Longest Common Prefix) array.
 * Runs in linear O(N) time.
 * Powers repeated-phrase and cross-assignment plagiarism detection across the orbital campus.
 */
public class KasaiLCP {

    public static class PlagiarismReport {
        public final String doc1Id;
        public final String doc2Id;
        public final String longestCommonPhrase;
        public final int longestCommonLength;
        public final List<String> sharedPhrases;
        public final double similarityScore;

        public PlagiarismReport(String doc1Id, String doc2Id, String longestCommonPhrase,
                                int longestCommonLength, List<String> sharedPhrases, double similarityScore) {
            this.doc1Id = doc1Id;
            this.doc2Id = doc2Id;
            this.longestCommonPhrase = longestCommonPhrase;
            this.longestCommonLength = longestCommonLength;
            this.sharedPhrases = sharedPhrases;
            this.similarityScore = similarityScore;
        }

        @Override
        public String toString() {
            return String.format("Plagiarism Analysis [%s vs %s] -> Similarity: %.1f%% | Max Shared Phrase: %d chars ('%s')",
                    doc1Id, doc2Id, similarityScore * 100, longestCommonLength,
                    longestCommonPhrase.length() > 40 ? longestCommonPhrase.substring(0, 37) + "..." : longestCommonPhrase);
        }
    }

    /**
     * Constructs the LCP array in O(N) using Kasai's algorithm.
     * lcp[i] stores the length of the longest common prefix between suffix sa[i] and sa[i-1].
     */
    public static int[] buildLCP(String text, int[] sa) {
        int n = text.length();
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            rank[sa[i]] = i;
        }

        int[] lcp = new int[n];
        int h = 0;

        for (int i = 0; i < n; i++) {
            if (rank[i] > 0) {
                int k = sa[rank[i] - 1];
                while (i + h < n && k + h < n && text.charAt(i + h) == text.charAt(k + h)) {
                    h++;
                }
                lcp[rank[i]] = h;
                if (h > 0) {
                    h--;
                }
            }
        }
        return lcp;
    }

    /**
     * Compares two assignments using generalized suffix array + Kasai LCP to find cross-document matches.
     */
    public static PlagiarismReport compareAssignments(String doc1Id, String text1,
                                                      String doc2Id, String text2,
                                                      int minPhraseLength) {
        String combined = text1 + "\u0001" + text2 + "\u0002";
        int len1 = text1.length();

        int[] sa = SAIS.buildSuffixArray(combined);
        int[] lcp = buildLCP(combined, sa);

        int maxLen = 0;
        int maxPos = -1;
        List<String> sharedPhrases = new ArrayList<>();
        int totalSharedChars = 0;

        for (int i = 1; i < combined.length(); i++) {
            int suffA = sa[i];
            int suffB = sa[i - 1];

            // Check if one suffix is from doc1 and the other from doc2
            boolean aInDoc1 = suffA < len1;
            boolean bInDoc1 = suffB < len1;

            if (aInDoc1 != bInDoc1) {
                int matchLen = lcp[i];
                if (matchLen >= minPhraseLength) {
                    int start = Math.min(suffA, suffB);
                    String phrase = combined.substring(start, start + matchLen);
                    if (!sharedPhrases.contains(phrase)) {
                        sharedPhrases.add(phrase);
                        totalSharedChars += matchLen;
                    }
                    if (matchLen > maxLen) {
                        maxLen = matchLen;
                        maxPos = start;
                    }
                }
            }
        }

        String longestMatch = (maxPos != -1 && maxLen > 0) ? combined.substring(maxPos, maxPos + maxLen) : "";
        double similarity = (len1 + text2.length() > 0) ? (2.0 * totalSharedChars) / (len1 + text2.length()) : 0.0;
        if (similarity > 1.0) similarity = 1.0;

        return new PlagiarismReport(doc1Id, doc2Id, longestMatch, maxLen, sharedPhrases, similarity);
    }
}
