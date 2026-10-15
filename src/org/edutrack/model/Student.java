package org.edutrack.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents an orbital student navigating the antigravity campus.
 */
public class Student implements Comparable<Student> {
    private String id;
    private String name;
    private String major;
    private double gpa;
    private int completedCredits;
    private String currentPodId;
    private List<Double> sensorTelemetry;

    public Student(String id, String name, String major, double gpa, int completedCredits, String currentPodId) {
        this.id = id;
        this.name = name;
        this.major = major;
        this.gpa = gpa;
        this.completedCredits = completedCredits;
        this.currentPodId = currentPodId;
        this.sensorTelemetry = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getMajor() { return major; }
    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }
    public int getCompletedCredits() { return completedCredits; }
    public void setCompletedCredits(int credits) { this.completedCredits = credits; }
    public String getCurrentPodId() { return currentPodId; }
    public void setCurrentPodId(String currentPodId) { this.currentPodId = currentPodId; }
    public List<Double> getSensorTelemetry() { return sensorTelemetry; }
    public void addTelemetry(double val) { sensorTelemetry.add(val); }

    @Override
    public int compareTo(Student other) {
        // Higher GPA ranked first
        return Double.compare(other.gpa, this.gpa);
    }

    @Override
    public String toString() {
        return String.format("[%s] %-18s | Major: %-20s | GPA: %.2f | Credits: %3d | Pod: %s",
                id, name, major, gpa, completedCredits, currentPodId);
    }
}
