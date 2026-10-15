package org.edutrack.m6_randomized_parallel;

import java.math.BigInteger;
import java.util.Random;

/**
 * Module 6 - Miller-Rabin Primality Test.
 * Fast probabilistic test for large numerical computations, student cryptographic authentication tokens,
 * and orbital digital certificates.
 * Error probability after k iterations is at most 4^(-k).
 */
public class MillerRabin {

    private static final Random RNG = new Random();

    /**
     * Tests primality of n using k independent Miller-Rabin rounds.
     */
    public static boolean isProbablePrime(BigInteger n, int k) {
        if (n.compareTo(BigInteger.ONE) <= 0) return false;
        if (n.equals(BigInteger.TWO) || n.equals(BigInteger.valueOf(3))) return true;
        if (n.mod(BigInteger.TWO).equals(BigInteger.ZERO)) return false;

        // Write n - 1 as 2^s * d
        BigInteger d = n.subtract(BigInteger.ONE);
        int s = 0;
        while (d.mod(BigInteger.TWO).equals(BigInteger.ZERO)) {
            d = d.divide(BigInteger.TWO);
            s++;
        }

        // Run k tests
        for (int i = 0; i < k; i++) {
            BigInteger a = uniformRandom(BigInteger.TWO, n.subtract(BigInteger.TWO));
            BigInteger x = a.modPow(d, n);

            if (x.equals(BigInteger.ONE) || x.equals(n.subtract(BigInteger.ONE))) {
                continue;
            }

            boolean composite = true;
            for (int r = 1; r < s; r++) {
                x = x.modPow(BigInteger.TWO, n);
                if (x.equals(n.subtract(BigInteger.ONE))) {
                    composite = false;
                    break;
                }
            }

            if (composite) return false; // Definitely composite
        }

        return true; // Probable prime
    }

    /**
     * Generates a probable prime of specified bitLength for student cryptographic keys.
     */
    public static BigInteger generatePrime(int bitLength, int certainty) {
        while (true) {
            BigInteger candidate = new BigInteger(bitLength, RNG).setBit(0).setBit(bitLength - 1);
            if (isProbablePrime(candidate, certainty)) {
                return candidate;
            }
        }
    }

    private static BigInteger uniformRandom(BigInteger bottom, BigInteger top) {
        BigInteger range = top.subtract(bottom).add(BigInteger.ONE);
        BigInteger res;
        do {
            res = new BigInteger(range.bitLength(), RNG);
        } while (res.compareTo(range) >= 0);
        return res.add(bottom);
    }
}
