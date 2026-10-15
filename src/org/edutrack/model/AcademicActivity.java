package org.edutrack.model;

/**
 * Represents an academic activity, research symposium, or laboratory workshop.
 */
public class AcademicActivity {
    private String id;
    private String title;
    private String category; // WORKSHOP, HACKATHON, SYMPOSIUM, PRACTICUM
    private String hostFaculty;
    private String scheduleDate;
    private String timeSlot;
    private String podLocation;
    private int capacity;
    private int enrolledCount;
    private double creditsValue;
    private String status; // UPCOMING, IN_PROGRESS, COMPLETED

    public AcademicActivity(String id, String title, String category, String hostFaculty,
                            String scheduleDate, String timeSlot, String podLocation,
                            int capacity, int enrolledCount, double creditsValue, String status) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.hostFaculty = hostFaculty;
        this.scheduleDate = scheduleDate;
        this.timeSlot = timeSlot;
        this.podLocation = podLocation;
        this.capacity = capacity;
        this.enrolledCount = enrolledCount;
        this.creditsValue = creditsValue;
        this.status = status;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getHostFaculty() { return hostFaculty; }
    public String getScheduleDate() { return scheduleDate; }
    public String getTimeSlot() { return timeSlot; }
    public String getPodLocation() { return podLocation; }
    public int getCapacity() { return capacity; }
    public int getEnrolledCount() { return enrolledCount; }
    public double getCreditsValue() { return creditsValue; }
    public String getStatus() { return status; }
}
