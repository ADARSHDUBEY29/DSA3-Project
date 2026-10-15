package org.edutrack.m6_randomized_parallel;

import java.util.ArrayList;
import java.util.List;

/**
 * Module 6 - Brent's Theorem Analyzer.
 * Formal theoretical evaluation of parallel scheduling efficiency.
 * Brent's Scheduling Principle: For a parallel computation with Work W and Depth/Span D,
 * on p processors, the execution time Tp satisfies:
 *       Tp <= (W - D) / p + D <= W / p + D
 * Speedup Sp = W / Tp
 * Efficiency Ep = Sp / p
 */
public class BrentsTheoremAnalyzer {

    public static class ProcessorMetric {
        public final int processors;
        public final double timeTp;
        public final double speedup;
        public final double efficiency;

        public ProcessorMetric(int processors, double timeTp, double speedup, double efficiency) {
            this.processors = processors;
            this.timeTp = timeTp;
            this.speedup = speedup;
            this.efficiency = efficiency;
        }

        @Override
        public String toString() {
            return String.format("p = %3d | Bound Tp = %9.2f time units | Speedup = %7.2fx | Efficiency = %6.2f%%",
                    processors, timeTp, speedup, efficiency * 100);
        }
    }

    public static class AnalysisReport {
        public final long workW;
        public final long depthD;
        public final double parallelismDegree; // W / D
        public final List<ProcessorMetric> metrics;

        public AnalysisReport(long workW, long depthD, double parallelismDegree, List<ProcessorMetric> metrics) {
            this.workW = workW;
            this.depthD = depthD;
            this.parallelismDegree = parallelismDegree;
            this.metrics = metrics;
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append("=== Brent's Theorem Theoretical Scalability Analysis ===\n");
            sb.append(String.format("Total Work (W): %d operations\n", workW));
            sb.append(String.format("Critical Path Depth/Span (D): %d steps\n", depthD));
            sb.append(String.format("Theoretical Max Parallelism (W/D): %.2f\n", parallelismDegree));
            sb.append("Processor Scaling Bounds:\n");
            for (ProcessorMetric pm : metrics) {
                sb.append("  ").append(pm.toString()).append("\n");
            }
            return sb.toString();
        }
    }

    /**
     * Evaluates Brent's theorem bounds across various core counts [1, 2, 4, 8, 16, 32, 64, 128].
     */
    public static AnalysisReport analyze(long workW, long depthD) {
        double maxParallelism = depthD > 0 ? (double) workW / depthD : 1.0;
        int[] processorCounts = {1, 2, 4, 8, 16, 32, 64, 128};
        List<ProcessorMetric> metrics = new ArrayList<>();

        for (int p : processorCounts) {
            double tp = (double) (workW - depthD) / p + depthD;
            double speedup = (double) workW / tp;
            double efficiency = speedup / p;
            metrics.add(new ProcessorMetric(p, tp, speedup, efficiency));
        }

        return new AnalysisReport(workW, depthD, maxParallelism, metrics);
    }
}
