package org.edutrack.model;

/**
 * Represents a student research paper or coding assignment submitted to the orbital repository.
 */
public class Assignment {
    private String id;
    private String courseCode;
    private String studentId;
    private String title;
    private String content;
    private long timestamp;
    private String status; // SUBMITTED, GRADED, UNDER_REVIEW, LATE
    private String dueDate;
    private double score; // e.g. 96.5 / 100
    private int weightagePct;
    private double similarityPct;

    public Assignment(String id, String courseCode, String studentId, String title, String content, long timestamp) {
        this(id, courseCode, studentId, title, content, timestamp, "GRADED", "2026-10-10", 95.0, 20, 4.2);
    }

    public Assignment(String id, String courseCode, String studentId, String title, String content, long timestamp,
                      String status, String dueDate, double score, int weightagePct, double similarityPct) {
        this.id = id;
        this.courseCode = courseCode;
        this.studentId = studentId;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status;
        this.dueDate = dueDate;
        this.score = score;
        this.weightagePct = weightagePct;
        this.similarityPct = similarityPct;
    }

    public String getId() { return id; }
    public String getCourseCode() { return courseCode; }
    public String getStudentId() { return studentId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
    public String getDueDate() { return dueDate; }
    public double getScore() { return score; }
    public int getWeightagePct() { return weightagePct; }
    public double getSimilarityPct() { return similarityPct; }

    @Override
    public String toString() {
        return String.format("[%s] Course: %-8s | Student: %-8s | Title: %-25s | Score: %.1f/100 | Status: %s",
                id, courseCode, studentId, title, score, status);
    }
}
