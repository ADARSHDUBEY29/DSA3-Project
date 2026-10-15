package org.edutrack.m2_suffix;

import java.util.*;

/**
 * Module 2 - Suffix Automaton (SAM).
 * Directed Acyclic Word Graph (DAWG) representing all substrings of a text in O(N) space and time.
 * Provides instant O(M) substring queries, count of distinct substrings, and occurrence frequencies.
 */
public class SuffixAutomaton {

    public static class State {
        public int len;
        public int link;
        public Map<Character, Integer> next = new HashMap<>();
        public int occurrences = 0; // number of occurrences of substrings ending here

        public State(int len, int link) {
            this.len = len;
            this.link = link;
        }
    }

    private final State[] st;
    private int sz;
    private int last;
    private final String sourceText;

    public SuffixAutomaton(String s) {
        this.sourceText = s;
        int maxStates = 2 * s.length() + 2;
        this.st = new State[maxStates];
        st[0] = new State(0, -1);
        this.sz = 1;
        this.last = 0;

        for (int i = 0; i < s.length(); i++) {
            extend(s.charAt(i));
        }
        computeOccurrences();
    }

    private void extend(char c) {
        int cur = sz++;
        st[cur] = new State(st[last].len + 1, 0);
        st[cur].occurrences = 1;

        int p = last;
        while (p != -1 && !st[p].next.containsKey(c)) {
            st[p].next.put(c, cur);
            p = st[p].link;
        }

        if (p == -1) {
            st[cur].link = 0;
        } else {
            int q = st[p].next.get(c);
            if (st[p].len + 1 == st[q].len) {
                st[cur].link = q;
            } else {
                int clone = sz++;
                st[clone] = new State(st[p].len + 1, st[q].link);
                st[clone].next.putAll(st[q].next);
                st[clone].occurrences = 0;

                while (p != -1 && st[p].next.get(c) == q) {
                    st[p].next.put(c, clone);
                    p = st[p].link;
                }
                st[q].link = clone;
                st[cur].link = clone;
            }
        }
        last = cur;
    }

    private void computeOccurrences() {
        // Sort states by length descending using counting sort
        Integer[] order = new Integer[sz];
        for (int i = 0; i < sz; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(st[b].len, st[a].len));

        for (int u : order) {
            if (st[u].link != -1) {
                st[st[u].link].occurrences += st[u].occurrences;
            }
        }
    }

    /**
     * Checks if a pattern is a substring in O(M) time.
     */
    public boolean containsSubstring(String pattern) {
        int curr = 0;
        for (int i = 0; i < pattern.length(); i++) {
            char ch = pattern.charAt(i);
            if (!st[curr].next.containsKey(ch)) return false;
            curr = st[curr].next.get(ch);
        }
        return true;
    }

    /**
     * Returns the number of occurrences of pattern in text in O(M) time.
     */
    public int countOccurrences(String pattern) {
        int curr = 0;
        for (int i = 0; i < pattern.length(); i++) {
            char ch = pattern.charAt(i);
            if (!st[curr].next.containsKey(ch)) return 0;
            curr = st[curr].next.get(ch);
        }
        return st[curr].occurrences;
    }

    /**
     * Counts the total number of distinct substrings in the document in O(V) time.
     */
    public long countDistinctSubstrings() {
        long total = 0;
        for (int i = 1; i < sz; i++) {
            total += st[i].len - st[st[i].link].len;
        }
        return total;
    }

    public int getStateCount() { return sz; }
    public String getSourceText() { return sourceText; }
}
