package org.edutrack.m2_suffix;

import java.util.Arrays;

/**
 * Module 2 - SA-IS (Suffix Array Induced Sorting).
 * Landmark linear-time O(N) suffix array construction algorithm.
 * Optimized for indexing massive orbital academic documents and textbooks.
 */
public class SAIS {

    private static final boolean S_TYPE = true;
    private static final boolean L_TYPE = false;

    /**
     * Constructs suffix array for string in O(N) time using SA-IS.
     */
    public static int[] buildSuffixArray(String s) {
        int n = s.length();
        int[] sInt = new int[n + 1];
        int maxChar = 0;
        for (int i = 0; i < n; i++) {
            sInt[i] = (int) s.charAt(i) + 1; // reserve 0 for sentinel
            if (sInt[i] > maxChar) maxChar = sInt[i];
        }
        sInt[n] = 0; // sentinel terminal character

        int[] saWithSentinel = sais(sInt, maxChar + 1);
        int[] sa = new int[n];
        System.arraycopy(saWithSentinel, 1, sa, 0, n);
        return sa;
    }

    private static int[] sais(int[] s, int alphabetSize) {
        int n = s.length;
        if (n == 1) return new int[]{0};
        if (n == 2) {
            if (s[0] < s[1]) return new int[]{0, 1};
            return new int[]{1, 0};
        }

        // Step 1: Classify each character as S-type or L-type
        boolean[] type = new boolean[n];
        type[n - 1] = S_TYPE;
        for (int i = n - 2; i >= 0; i--) {
            if (s[i] < s[i + 1]) {
                type[i] = S_TYPE;
            } else if (s[i] > s[i + 1]) {
                type[i] = L_TYPE;
            } else {
                type[i] = type[i + 1];
            }
        }

        // Step 2: Identify LMS (Left-Most S-type) characters
        int[] lmsMap = new int[n];
        Arrays.fill(lmsMap, -1);
        int lmsCount = 0;
        for (int i = 1; i < n; i++) {
            if (type[i] == S_TYPE && type[i - 1] == L_TYPE) {
                lmsMap[i] = lmsCount++;
            }
        }

        int[] lms = new int[lmsCount];
        int idx = 0;
        for (int i = 1; i < n; i++) {
            if (type[i] == S_TYPE && type[i - 1] == L_TYPE) {
                lms[idx++] = i;
            }
        }

        // Step 3: Bucket count
        int[] bucket = new int[alphabetSize];
        for (int val : s) {
            bucket[val]++;
        }

        // Step 4: Induced sort with initial LMS
        int[] sa = new int[n];
        inducedSort(s, sa, type, bucket, alphabetSize, lms);

        // Step 5: Order LMS substrings and compact
        if (lmsCount > 0) {
            int[] sortedLms = new int[lmsCount];
            int pos = 0;
            for (int val : sa) {
                if (val > 0 && lmsMap[val] != -1) {
                    sortedLms[pos++] = val;
                }
            }

            int[] summaryString = new int[lmsCount];
            int currentName = 0;
            summaryString[lmsMap[sortedLms[0]]] = currentName;

            for (int i = 1; i < lmsCount; i++) {
                int prevLms = sortedLms[i - 1];
                int currLms = sortedLms[i];

                if (!areLmsSubstringsEqual(s, type, prevLms, currLms)) {
                    currentName++;
                }
                summaryString[lmsMap[currLms]] = currentName;
            }

            int[] summarySA;
            if (currentName + 1 == lmsCount) {
                summarySA = new int[lmsCount];
                for (int i = 0; i < lmsCount; i++) {
                    summarySA[summaryString[i]] = i;
                }
            } else {
                summarySA = sais(summaryString, currentName + 1);
            }

            for (int i = 0; i < lmsCount; i++) {
                sortedLms[i] = lms[summarySA[i]];
            }

            // Step 6: Final induced sort from sorted LMS suffixes
            inducedSort(s, sa, type, bucket, alphabetSize, sortedLms);
        }

        return sa;
    }

    private static boolean areLmsSubstringsEqual(int[] s, boolean[] type, int i, int j) {
        int n = s.length;
        for (int k = 0; ; k++) {
            int si = i + k;
            int sj = j + k;
            if (si >= n || sj >= n) return false;
            if (s[si] != s[sj]) return false;

            boolean isLmsI = (k > 0 && type[si] == S_TYPE && type[si - 1] == L_TYPE);
            boolean isLmsJ = (k > 0 && type[sj] == S_TYPE && type[sj - 1] == L_TYPE);

            if (isLmsI && isLmsJ) return true;
            if (isLmsI || isLmsJ) return false;
        }
    }

    private static void inducedSort(int[] s, int[] sa, boolean[] type, int[] bucket, int alphabetSize, int[] lms) {
        int n = s.length;
        Arrays.fill(sa, -1);

        // Put LMS elements at the ends of their buckets
        int[] bucketEnd = getBucketTails(bucket, alphabetSize);
        for (int i = lms.length - 1; i >= 0; i--) {
            int c = s[lms[i]];
            sa[bucketEnd[c]--] = lms[i];
        }

        // Left-to-right pass for L-type
        int[] bucketHead = getBucketHeads(bucket, alphabetSize);
        for (int i = 0; i < n; i++) {
            int j = sa[i] - 1;
            if (j >= 0 && type[j] == L_TYPE) {
                int c = s[j];
                sa[bucketHead[c]++] = j;
            }
        }

        // Right-to-left pass for S-type
        bucketEnd = getBucketTails(bucket, alphabetSize);
        for (int i = n - 1; i >= 0; i--) {
            int j = sa[i] - 1;
            if (j >= 0 && type[j] == S_TYPE) {
                int c = s[j];
                sa[bucketEnd[c]--] = j;
            }
        }
    }

    private static int[] getBucketHeads(int[] bucket, int alphabetSize) {
        int[] heads = new int[alphabetSize];
        int sum = 0;
        for (int i = 0; i < alphabetSize; i++) {
            heads[i] = sum;
            sum += bucket[i];
        }
        return heads;
    }

    private static int[] getBucketTails(int[] bucket, int alphabetSize) {
        int[] tails = new int[alphabetSize];
        int sum = 0;
        for (int i = 0; i < alphabetSize; i++) {
            sum += bucket[i];
            tails[i] = sum - 1;
        }
        return tails;
    }
}
