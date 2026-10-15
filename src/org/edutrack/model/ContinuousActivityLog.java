package org.edutrack.model;

/**
 * Represents a continuous real-time student and academic activity event log.
 */
public class ContinuousActivityLog {
    private String id;
    private long timestamp;
    private String studentId;
    private String studentName;
    private String actionType; // LIBRARY_ACCESS, ASSIGNMENT_SUBMISSION, LAB_CHECKIN, EXAM_VERIFY, TELEMETRY_STREAM
    private String description;
    private String locationPod;
    private double microGravity;
    private double cognitiveLoad;

    public ContinuousActivityLog(String id, long timestamp, String studentId, String studentName,
                                 String actionType, String description, String locationPod,
                                 double microGravity, double cognitiveLoad) {
        this.id = id;
        this.timestamp = timestamp;
        this.studentId = studentId;
        this.studentName = studentName;
        this.actionType = actionType;
        this.description = description;
        this.locationPod = locationPod;
        this.microGravity = microGravity;
        this.cognitiveLoad = cognitiveLoad;
    }

    public String getId() { return id; }
    public long getTimestamp() { return timestamp; }
    public String getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getActionType() { return actionType; }
    public String getDescription() { return description; }
    public String getLocationPod() { return locationPod; }
    public double getMicroGravity() { return microGravity; }
    public double getCognitiveLoad() { return cognitiveLoad; }
}
