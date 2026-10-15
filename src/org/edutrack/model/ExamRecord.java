package org.edutrack.model;

/**
 * Represents an academic examination record, timetable schedule, and SAT conflict validation.
 */
public class ExamRecord {
    private String examCode;
    private String courseCode;
    private String courseTitle;
    private String studentId;
    private String examDate;
    private String timeSlot;
    private String hallPod;
    private String seatNumber;
    private String status; // CONFIRMED, COMPLETED, PENDING_SAT
    private String cryptoToken;
    private int maxMarks;
    private double scoreAwarded; // on 10.0 or 100 scale

    public ExamRecord(String examCode, String courseCode, String courseTitle, String studentId,
                      String examDate, String timeSlot, String hallPod, String seatNumber,
                      String status, String cryptoToken, int maxMarks, double scoreAwarded) {
        this.examCode = examCode;
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        this.studentId = studentId;
        this.examDate = examDate;
        this.timeSlot = timeSlot;
        this.hallPod = hallPod;
        this.seatNumber = seatNumber;
        this.status = status;
        this.cryptoToken = cryptoToken;
        this.maxMarks = maxMarks;
        this.scoreAwarded = scoreAwarded;
    }

    public String getExamCode() { return examCode; }
    public String getCourseCode() { return courseCode; }
    public String getCourseTitle() { return courseTitle; }
    public String getStudentId() { return studentId; }
    public String getExamDate() { return examDate; }
    public String getTimeSlot() { return timeSlot; }
    public String getHallPod() { return hallPod; }
    public String getSeatNumber() { return seatNumber; }
    public String getStatus() { return status; }
    public String getCryptoToken() { return cryptoToken; }
    public int getMaxMarks() { return maxMarks; }
    public double getScoreAwarded() { return scoreAwarded; }
}
