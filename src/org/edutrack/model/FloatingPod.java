package org.edutrack.model;

/**
 * Represents a floating lecture pod or academic lab drifting in orbit.
 */
public class FloatingPod {
    private String id;
    private String name;
    private String podType; // "THEORY", "GRAVITY_LAB", "QUANTUM_SIM", "ASTRONAV"
    private int capacity;
    private double x;
    private double y;
    private double z;
    private double artificialGravity; // 0.0 to 1.0 G
    private int powerGridUnits;

    public FloatingPod(String id, String name, String podType, int capacity, double x, double y, double z, double artificialGravity, int powerGridUnits) {
        this.id = id;
        this.name = name;
        this.podType = podType;
        this.capacity = capacity;
        this.x = x;
        this.y = y;
        this.z = z;
        this.artificialGravity = artificialGravity;
        this.powerGridUnits = powerGridUnits;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getPodType() { return podType; }
    public int getCapacity() { return capacity; }
    public double getX() { return x; }
    public double getY() { return y; }
    public double getZ() { return z; }
    public double getArtificialGravity() { return artificialGravity; }
    public int getPowerGridUnits() { return powerGridUnits; }

    public double distanceTo(FloatingPod other) {
        double dx = this.x - other.x;
        double dy = this.y - other.y;
        double dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    @Override
    public String toString() {
        return String.format("[%s] %-20s | Type: %-12s | Cap: %3d | Pos: (%.1f, %.1f, %.1f) | G: %.2f | Pwr: %d",
                id, name, podType, capacity, x, y, z, artificialGravity, powerGridUnits);
    }
}
