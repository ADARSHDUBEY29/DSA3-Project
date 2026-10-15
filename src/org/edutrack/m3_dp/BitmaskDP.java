package org.edutrack.m3_dp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Module 3 - Bitmask Dynamic Programming.
 * Explores combinations of courses and zero-G floating pod resources.
 * Solves:
 * 1) Optimal Zero-G Floating Pod Transit (Traveling Academic Tour) minimizing thruster propellant.
 * 2) Course & Resource Knapsack Feasibility over discrete zero-G energy budgets.
 */
public class BitmaskDP {

    public static class TSPResult {
        public final double minCost;
        public final List<Integer> tour;
        public final String[] podNames;

        public TSPResult(double minCost, List<Integer> tour, String[] podNames) {
            this.minCost = minCost;
            this.tour = tour;
            this.podNames = podNames;
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("Optimal Pod Transit Fuel: %.2f Joules | Path: ", minCost));
            for (int i = 0; i < tour.size(); i++) {
                int podIdx = tour.get(i);
                sb.append(podNames != null && podIdx < podNames.length ? podNames[podIdx] : "Pod-" + podIdx);
                if (i < tour.size() - 1) sb.append(" -> ");
            }
            return sb.toString();
        }
    }

    /**
     * Solves Traveling Academic Tour across N drifting pods using Bitmask DP O(N^2 * 2^N).
     * costMatrix[i][j] = thruster fuel needed to navigate from pod i to pod j.
     */
    public static TSPResult solvePodTransit(double[][] costMatrix, String[] podNames) {
        int n = costMatrix.length;
        if (n == 0) return new TSPResult(0, new ArrayList<>(), podNames);
        if (n == 1) {
            List<Integer> single = new ArrayList<>();
            single.add(0);
            single.add(0);
            return new TSPResult(0, single, podNames);
        }

        int totalStates = 1 << n;
        double[][] dp = new double[totalStates][n];
        int[][] parent = new int[totalStates][n];

        for (int mask = 0; mask < totalStates; mask++) {
            Arrays.fill(dp[mask], Double.POSITIVE_INFINITY);
            Arrays.fill(parent[mask], -1);
        }

        // Start at pod 0 (central campus hub)
        dp[1][0] = 0;

        for (int mask = 1; mask < totalStates; mask++) {
            for (int u = 0; u < n; u++) {
                if ((mask & (1 << u)) == 0 || Double.isInfinite(dp[mask][u])) continue;

                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) == 0) {
                        int nextMask = mask | (1 << v);
                        double newCost = dp[mask][u] + costMatrix[u][v];
                        if (newCost < dp[nextMask][v]) {
                            dp[nextMask][v] = newCost;
                            parent[nextMask][v] = u;
                        }
                    }
                }
            }
        }

        // Close tour back to pod 0
        int fullMask = (1 << n) - 1;
        double bestCost = Double.POSITIVE_INFINITY;
        int lastNode = -1;

        for (int u = 1; u < n; u++) {
            double totalTourCost = dp[fullMask][u] + costMatrix[u][0];
            if (totalTourCost < bestCost) {
                bestCost = totalTourCost;
                lastNode = u;
            }
        }

        // Reconstruct path
        List<Integer> tour = new ArrayList<>();
        int currMask = fullMask;
        int currNode = lastNode;

        while (currNode != -1) {
            tour.add(0, currNode);
            int prev = parent[currMask][currNode];
            currMask ^= (1 << currNode);
            currNode = prev;
        }
        tour.add(0); // return to origin pod

        return new TSPResult(bestCost, tour, podNames);
    }

    /**
     * Finds maximum credits a student can take from N courses without exceeding energy or time slots.
     */
    public static int maxCreditsSubset(int[] courseCredits, int[] powerCost, int maxPower) {
        int n = courseCredits.length;
        int bestCredits = 0;

        for (int mask = 0; mask < (1 << n); mask++) {
            int currentPower = 0;
            int currentCredits = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    currentPower += powerCost[i];
                    currentCredits += courseCredits[i];
                }
            }
            if (currentPower <= maxPower && currentCredits > bestCredits) {
                bestCredits = currentCredits;
            }
        }
        return bestCredits;
    }
}
