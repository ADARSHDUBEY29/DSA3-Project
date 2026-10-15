package org.edutrack.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a faculty member stationed in the orbital university modules.
 */
public class Faculty {
    private String id;
    private String name;
    private String department;
    private int maxLoad;
    private List<String> qualifiedCourseCodes;

    public Faculty(String id, String name, String department, int maxLoad) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.maxLoad = maxLoad;
        this.qualifiedCourseCodes = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public int getMaxLoad() { return maxLoad; }
    public List<String> getQualifiedCourseCodes() { return qualifiedCourseCodes; }

    public void addQualifiedCourse(String courseCode) {
        if (!qualifiedCourseCodes.contains(courseCode)) {
            qualifiedCourseCodes.add(courseCode);
        }
    }

    @Override
    public String toString() {
        return String.format("[%s] Prof. %-16s | Dept: %-22s | MaxLoad: %d | Qualified: %s",
                id, name, department, maxLoad, qualifiedCourseCodes);
    }
}
