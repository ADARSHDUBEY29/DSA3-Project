package org.edutrack.model;

/**
 * Represents zero-G continuous telemetry streamed from student exosuits and sensor beacons.
 */
public class OrbitalTelemetry {
    private String sensorId;
    private String studentId;
    private long timestamp;
    private double microGravityLevel; // e.g. 0.02 G
    private double thrusterBurnJoules; // energy consumed in micro-transit
    private double oxygenSupplyPct;
    private double cognitiveLoadIndex; // 0.0 - 1.0

    public OrbitalTelemetry(String sensorId, String studentId, long timestamp,
                            double microGravityLevel, double thrusterBurnJoules,
                            double oxygenSupplyPct, double cognitiveLoadIndex) {
        this.sensorId = sensorId;
        this.studentId = studentId;
        this.timestamp = timestamp;
        this.microGravityLevel = microGravityLevel;
        this.thrusterBurnJoules = thrusterBurnJoules;
        this.oxygenSupplyPct = oxygenSupplyPct;
        this.cognitiveLoadIndex = cognitiveLoadIndex;
    }

    public String getSensorId() { return sensorId; }
    public String getStudentId() { return studentId; }
    public long getTimestamp() { return timestamp; }
    public double getMicroGravityLevel() { return microGravityLevel; }
    public double getThrusterBurnJoules() { return thrusterBurnJoules; }
    public double getOxygenSupplyPct() { return oxygenSupplyPct; }
    public double getCognitiveLoadIndex() { return cognitiveLoadIndex; }

    @Override
    public String toString() {
        return String.format("[Sensor %s] Student: %-8s | G: %.3f | Thruster: %.1f J | O2: %.1f%% | CogLoad: %.2f",
                sensorId, studentId, microGravityLevel, thrusterBurnJoules, oxygenSupplyPct, cognitiveLoadIndex);
    }
}
