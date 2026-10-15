package org.edutrack.m5_np;

import java.util.*;

/**
 * Module 5 - DPLL (Davis-Putnam-Logemann-Loveland) SAT Solver.
 * Implements unit propagation, pure literal elimination, and recursive backtracking.
 * Solves complex orbital examination timetabling and zero-G pod allocation constraints.
 */
public class DPLLSolver {

    public static class Solution {
        public final boolean satisfiable;
        public final Map<Integer, Boolean> model; // varIndex -> boolean
        public final long executionTimeNs;

        public Solution(boolean satisfiable, Map<Integer, Boolean> model, long executionTimeNs) {
            this.satisfiable = satisfiable;
            this.model = model;
            this.executionTimeNs = executionTimeNs;
        }

        @Override
        public String toString() {
            if (!satisfiable) return "UNSATISFIABLE (Constraint Conflict Detected)";
            StringBuilder sb = new StringBuilder("SATISFIABLE\nAssignments:\n");
            for (Map.Entry<Integer, Boolean> entry : model.entrySet()) {
                sb.append(String.format("  Variable %d = %b\n", entry.getKey(), entry.getValue()));
            }
            return sb.toString();
        }
    }

    public static Solution solve(SATFormula formula) {
        long start = System.nanoTime();
        Map<Integer, Boolean> assignment = new HashMap<>();
        List<List<Integer>> clauses = new ArrayList<>();
        for (List<Integer> c : formula.getClauses()) {
            clauses.add(new ArrayList<>(c));
        }

        boolean sat = dpll(clauses, assignment, formula.getNumVars());
        long elapsed = System.nanoTime() - start;

        // Fill remaining unassigned variables with true by default
        if (sat) {
            for (int v = 1; v <= formula.getNumVars(); v++) {
                assignment.putIfAbsent(v, true);
            }
        }

        return new Solution(sat, assignment, elapsed);
    }

    private static boolean dpll(List<List<Integer>> clauses, Map<Integer, Boolean> assignment, int numVars) {
        // 1. Simplify: Unit Propagation
        boolean changed = true;
        while (changed) {
            changed = false;
            Integer unitLit = findUnitClause(clauses);
            if (unitLit != null) {
                int var = Math.abs(unitLit);
                boolean val = unitLit > 0;
                assignment.put(var, val);
                clauses = simplifyClauses(clauses, unitLit);
                changed = true;
                if (clauses == null) return false; // contradiction
                if (clauses.isEmpty()) return true;
            }
        }

        // 2. Simplify: Pure Literal Elimination
        Integer pureLit = findPureLiteral(clauses);
        while (pureLit != null) {
            int var = Math.abs(pureLit);
            boolean val = pureLit > 0;
            assignment.put(var, val);
            clauses = simplifyClauses(clauses, pureLit);
            if (clauses == null) return false;
            if (clauses.isEmpty()) return true;
            pureLit = findPureLiteral(clauses);
        }

        if (clauses.isEmpty()) return true;
        for (List<Integer> c : clauses) {
            if (c.isEmpty()) return false;
        }

        // 3. Choose unassigned branching variable
        int branchVar = selectBranchVariable(clauses, assignment, numVars);
        if (branchVar == -1) return true; // all assigned

        // Branch 1: Try true
        Map<Integer, Boolean> branchTrue = new HashMap<>(assignment);
        branchTrue.put(branchVar, true);
        List<List<Integer>> clausesTrue = simplifyClauses(clauses, branchVar);
        if (clausesTrue != null && dpll(clausesTrue, branchTrue, numVars)) {
            assignment.putAll(branchTrue);
            return true;
        }

        // Branch 2: Try false
        Map<Integer, Boolean> branchFalse = new HashMap<>(assignment);
        branchFalse.put(branchVar, false);
        List<List<Integer>> clausesFalse = simplifyClauses(clauses, -branchVar);
        if (clausesFalse != null && dpll(clausesFalse, branchFalse, numVars)) {
            assignment.putAll(branchFalse);
            return true;
        }

        return false;
    }

    private static Integer findUnitClause(List<List<Integer>> clauses) {
        for (List<Integer> c : clauses) {
            if (c.size() == 1) return c.get(0);
        }
        return null;
    }

    private static Integer findPureLiteral(List<List<Integer>> clauses) {
        Map<Integer, Boolean> signs = new HashMap<>();
        Set<Integer> impure = new HashSet<>();

        for (List<Integer> c : clauses) {
            for (int lit : c) {
                int var = Math.abs(lit);
                boolean sign = lit > 0;
                if (impure.contains(var)) continue;

                if (signs.containsKey(var)) {
                    if (signs.get(var) != sign) {
                        impure.add(var);
                        signs.remove(var);
                    }
                } else {
                    signs.put(var, sign);
                }
            }
        }

        if (!signs.isEmpty()) {
            Map.Entry<Integer, Boolean> entry = signs.entrySet().iterator().next();
            return entry.getValue() ? entry.getKey() : -entry.getKey();
        }
        return null;
    }

    private static List<List<Integer>> simplifyClauses(List<List<Integer>> clauses, int assignedLit) {
        List<List<Integer>> simplified = new ArrayList<>();
        int negLit = -assignedLit;

        for (List<Integer> c : clauses) {
            if (c.contains(assignedLit)) {
                // Clause satisfied, omit
                continue;
            }
            if (c.contains(negLit)) {
                // Remove false literal from clause
                List<Integer> newC = new ArrayList<>(c);
                newC.remove(Integer.valueOf(negLit));
                if (newC.isEmpty()) {
                    return null; // Empty clause generated -> conflict
                }
                simplified.add(newC);
            } else {
                simplified.add(new ArrayList<>(c));
            }
        }
        return simplified;
    }

    private static int selectBranchVariable(List<List<Integer>> clauses, Map<Integer, Boolean> assignment, int numVars) {
        for (List<Integer> c : clauses) {
            for (int lit : c) {
                int var = Math.abs(lit);
                if (!assignment.containsKey(var)) {
                    return var;
                }
            }
        }
        return -1;
    }
}
