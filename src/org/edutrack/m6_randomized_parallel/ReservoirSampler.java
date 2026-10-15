package org.edutrack.m6_randomized_parallel;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Module 6 - Reservoir Sampling (Algorithm R).
 * Maintains a uniformly random sample of size K from an unbounded continuous stream of
 * zero-G student telemetry, movement sensors, and suit thruster logs.
 * Guarantee: Every item seen so far has an equal K / N probability of inclusion.
 */
public class ReservoirSampler<T> {

    private final int capacity;
    private final List<T> reservoir;
    private long itemsSeen;
    private final Random rng;

    public ReservoirSampler(int capacity) {
        this.capacity = capacity;
        this.reservoir = new ArrayList<>(capacity);
        this.itemsSeen = 0;
        this.rng = new Random();
    }

    public synchronized void streamItem(T item) {
        itemsSeen++;
        if (reservoir.size() < capacity) {
            reservoir.add(item);
        } else {
            long j = Math.abs(rng.nextLong()) % itemsSeen;
            if (j < capacity) {
                reservoir.set((int) j, item);
            }
        }
    }

    public synchronized List<T> getSample() {
        return new ArrayList<>(reservoir);
    }

    public synchronized long getItemsSeen() {
        return itemsSeen;
    }

    public synchronized int getCapacity() {
        return capacity;
    }

    public synchronized void reset() {
        reservoir.clear();
        itemsSeen = 0;
    }
}
