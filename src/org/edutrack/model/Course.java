package org.edutrack.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents an orbital academic course.
 */
public class Course {
    private String code;
    private String title;
    private int credits;
    private String requiredPodType;
    private int examTimeSlot; // 1 to K
    private List<String> enrolledStudentIds;

    public Course(String code, String title, int credits, String requiredPodType, int examTimeSlot) {
        this.code = code;
        this.title = title;
        this.credits = credits;
        this.requiredPodType = requiredPodType;
        this.examTimeSlot = examTimeSlot;
        this.enrolledStudentIds = new ArrayList<>();
    }

    public String getCode() { return code; }
    public String getTitle() { return title; }
    public int getCredits() { return credits; }
    public String getRequiredPodType() { return requiredPodType; }
    public int getExamTimeSlot() { return examTimeSlot; }
    public void setExamTimeSlot(int slot) { this.examTimeSlot = slot; }
    public List<String> getEnrolledStudentIds() { return enrolledStudentIds; }

    public void enrollStudent(String studentId) {
        if (!enrolledStudentIds.contains(studentId)) {
            enrolledStudentIds.add(studentId);
        }
    }

    @Override
    public String toString() {
        return String.format("[%s] %-28s | Credits: %d | PodReq: %-12s | ExamSlot: %d | Enrolled: %d",
                code, title, credits, requiredPodType, examTimeSlot, enrolledStudentIds.size());
    }
}
