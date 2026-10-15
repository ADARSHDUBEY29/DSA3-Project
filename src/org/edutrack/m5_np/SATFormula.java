package org.edutrack.m5_np;

import java.util.*;

/**
 * Module 5 - Boolean Satisfiability (CNF) representation.
 * Models examination scheduling and 3D floating pod constraints.
 */
public class SATFormula {

    private final int numVars;
    private final List<List<Integer>> clauses;
    private final Map<Integer, String> varNames;

    public SATFormula(int numVars) {
        this.numVars = numVars;
        this.clauses = new ArrayList<>();
        this.varNames = new HashMap<>();
    }

    public void setVariableName(int varIndex, String name) {
        varNames.put(varIndex, name);
    }

    public String getVariableName(int varIndex) {
        return varNames.getOrDefault(varIndex, "x" + varIndex);
    }

    public void addClause(int... literals) {
        List<Integer> c = new ArrayList<>();
        for (int lit : literals) {
            c.add(lit);
        }
        clauses.add(c);
    }

    public int getNumVars() { return numVars; }
    public List<List<Integer>> getClauses() { return clauses; }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < clauses.size(); i++) {
            sb.append("(");
            List<Integer> c = clauses.get(i);
            for (int j = 0; j < c.size(); j++) {
                int lit = c.get(j);
                int var = Math.abs(lit);
                String name = getVariableName(var);
                sb.append(lit < 0 ? "¬" + name : name);
                if (j < c.size() - 1) sb.append(" ∨ ");
            }
            sb.append(")");
            if (i < clauses.size() - 1) sb.append(" ∧ ");
        }
        return sb.toString();
    }
}
