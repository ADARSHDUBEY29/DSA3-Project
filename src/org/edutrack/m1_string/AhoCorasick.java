package org.edutrack.m1_string;

import java.util.*;

/**
 * Module 1 - Aho-Corasick Automaton.
 * Constructs Trie + Failure transitions + Output dictionary links.
 * Enables simultaneous multi-keyword retrieval across academic documents in linear O(N + total_matches) time.
 */
public class AhoCorasick {

    public static class Match {
        public final int index; // start index in text
        public final String keyword;

        public Match(int index, String keyword) {
            this.index = index;
            this.keyword = keyword;
        }

        @Override
        public String toString() {
            return String.format("Match['%s' at pos %d]", keyword, index);
        }
    }

    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        Node fail = null;
        List<String> output = new ArrayList<>();
    }

    private final Node root;
    private final List<String> keywords;

    public AhoCorasick(List<String> keywords) {
        this.root = new Node();
        this.keywords = new ArrayList<>(keywords);
        buildTrie();
        buildFailureLinks();
    }

    private void buildTrie() {
        for (String kw : keywords) {
            if (kw == null || kw.isEmpty()) continue;
            Node curr = root;
            for (char ch : kw.toCharArray()) {
                curr = curr.children.computeIfAbsent(ch, c -> new Node());
            }
            curr.output.add(kw);
        }
    }

    private void buildFailureLinks() {
        Queue<Node> queue = new ArrayDeque<>();
        for (Node child : root.children.values()) {
            child.fail = root;
            queue.add(child);
        }

        while (!queue.isEmpty()) {
            Node curr = queue.poll();

            for (Map.Entry<Character, Node> entry : curr.children.entrySet()) {
                char ch = entry.getKey();
                Node child = entry.getValue();

                Node fallback = curr.fail;
                while (fallback != null && !fallback.children.containsKey(ch)) {
                    fallback = fallback.fail;
                }

                if (fallback != null) {
                    child.fail = fallback.children.get(ch);
                } else {
                    child.fail = root;
                }

                // Inherit output matches from failure link
                if (child.fail != null) {
                    child.output.addAll(child.fail.output);
                }

                queue.add(child);
            }
        }
    }

    /**
     * Scans text and extracts all keyword occurrences simultaneously.
     */
    public List<Match> search(String text) {
        List<Match> matches = new ArrayList<>();
        if (text == null || text.isEmpty()) return matches;

        Node curr = root;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);

            while (curr != null && !curr.children.containsKey(ch)) {
                curr = curr.fail;
            }

            if (curr == null) {
                curr = root;
                continue;
            }

            curr = curr.children.get(ch);

            for (String kw : curr.output) {
                matches.add(new Match(i - kw.length() + 1, kw));
            }
        }
        return matches;
    }
}
