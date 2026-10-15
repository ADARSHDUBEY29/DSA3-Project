package org.edutrack.m6_randomized_parallel;

import java.util.List;
import java.util.Random;

/**
 * Module 6 - Randomized QuickSort.
 * Uses uniform random pivot selection and 3-way partitioning (Dutch National Flag)
 * to rapidly rank student academic records and orbital flight aptitudes in O(N log N) expected time.
 */
public class RandomizedQuickSort {

    private static final Random RNG = new Random();

    public static <T extends Comparable<T>> void sort(List<T> list) {
        if (list == null || list.size() <= 1) return;
        quickSort(list, 0, list.size() - 1);
    }

    private static <T extends Comparable<T>> void quickSort(List<T> list, int low, int high) {
        if (low >= high) return;

        // Choose random pivot and swap with low
        int pivotIndex = low + RNG.nextInt(high - low + 1);
        swap(list, low, pivotIndex);

        T pivot = list.get(low);

        // 3-way partition: elements < pivot, elements == pivot, elements > pivot
        int lt = low;
        int gt = high;
        int i = low + 1;

        while (i <= gt) {
            int cmp = list.get(i).compareTo(pivot);
            if (cmp < 0) {
                swap(list, lt++, i++);
            } else if (cmp > 0) {
                swap(list, i, gt--);
            } else {
                i++;
            }
        }

        quickSort(list, low, lt - 1);
        quickSort(list, gt + 1, high);
    }

    private static <T> void swap(List<T> list, int i, int j) {
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
