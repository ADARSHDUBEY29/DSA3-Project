package org.edutrack.m6_randomized_parallel;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

/**
 * Module 6 - Parallel Reduce.
 * Implements parallel divide-and-conquer tree reduction using Java's ForkJoin framework.
 * Aggregates student GPA metrics, cognitive loads, and orbital sensor data across cluster threads.
 */
public class ParallelReduce {

    private static final int THRESHOLD = 1000;
    private static final ForkJoinPool POOL = new ForkJoinPool();

    private static class SumTask extends RecursiveTask<Double> {
        private final double[] array;
        private final int start;
        private final int end;

        public SumTask(double[] array, int start, int end) {
            this.array = array;
            this.start = start;
            this.end = end;
        }

        @Override
        protected Double compute() {
            int length = end - start;
            if (length <= THRESHOLD) {
                double sum = 0.0;
                for (int i = start; i < end; i++) {
                    sum += array[i];
                }
                return sum;
            } else {
                int mid = start + length / 2;
                SumTask leftTask = new SumTask(array, start, mid);
                SumTask rightTask = new SumTask(array, mid, end);
                leftTask.fork();
                double rightResult = rightTask.compute();
                double leftResult = leftTask.join();
                return leftResult + rightResult;
            }
        }
    }

    public static double parallelSum(double[] data) {
        if (data == null || data.length == 0) return 0.0;
        return POOL.invoke(new SumTask(data, 0, data.length));
    }

    public static double parallelAverage(double[] data) {
        if (data == null || data.length == 0) return 0.0;
        return parallelSum(data) / data.length;
    }
}
