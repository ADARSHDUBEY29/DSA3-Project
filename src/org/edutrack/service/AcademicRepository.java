package org.edutrack.service;

import org.edutrack.model.*;
import java.util.*;

/**
 * In-memory repository seeded with orbital antigravity university academic records,
 * comprehensive courses, learning resources, assignments, examination records,
 * academic activities, resource allocations, and continuous activity telemetry.
 */
public class AcademicRepository {

    private final Map<String, Student> students = new LinkedHashMap<>();
    private final Map<String, Faculty> faculty = new LinkedHashMap<>();
    private final Map<String, Course> courses = new LinkedHashMap<>();
    private final Map<String, FloatingPod> floatingPods = new LinkedHashMap<>();
    private final List<Assignment> assignments = new ArrayList<>();
    private final List<AcademicActivity> activities = new ArrayList<>();
    private final List<LearningResource> learningResources = new ArrayList<>();
    private final List<ExamRecord> examRecords = new ArrayList<>();
    private final List<ContinuousActivityLog> continuousActivityLogs = new ArrayList<>();
    private final List<OrbitalTelemetry> telemetryLogs = new ArrayList<>();

    public AcademicRepository() {
        seedData();
    }

    private void seedData() {
        // 1. Floating Pods (Campus Spatial Infrastructure)
        addPod(new FloatingPod("POD-ALPHA", "Graviton Hall Alpha", "THEORY", 120, 15.0, 30.0, 45.0, 0.35, 100));
        addPod(new FloatingPod("POD-BETA", "Quantum Sim Lab Beta", "QUANTUM_SIM", 50, 75.0, 120.0, -25.0, 0.05, 180));
        addPod(new FloatingPod("POD-GAMMA", "Zenith Astrogation Pod", "ASTRONAV", 65, -40.0, 95.0, 110.0, 0.15, 120));
        addPod(new FloatingPod("POD-DELTA", "Drifting Dynamics Lab", "GRAVITY_LAB", 40, 140.0, -50.0, 35.0, 0.00, 220));
        addPod(new FloatingPod("POD-EPSILON", "Bio-Dome Tether Ring", "THEORY", 90, 25.0, -85.0, -60.0, 0.85, 140));

        // 2. Students (CGPA on a 10.0 scale)
        addStudent(new Student("STU-1001", "Nova Vance", "Astrophysical Mechanics", 9.85, 78, "POD-ALPHA"));
        addStudent(new Student("STU-1002", "Lyra Thorne", "Antigravity Engineering", 9.70, 84, "POD-BETA"));
        addStudent(new Student("STU-1003", "Orion Drake", "Quantum Informatics", 8.62, 62, "POD-GAMMA"));
        addStudent(new Student("STU-1004", "Kaelen Cross", "Orbital Logistics", 9.30, 70, "POD-DELTA"));
        addStudent(new Student("STU-1005", "Zara Sterling", "Exosuit Bio-Tethering", 9.95, 92, "POD-ALPHA"));
        addStudent(new Student("STU-1006", "Cassian Vane", "Gravitational Field Theory", 8.00, 45, "POD-BETA"));
        addStudent(new Student("STU-1007", "Astra Chen", "Quantum Informatics", 9.12, 58, "POD-GAMMA"));
        addStudent(new Student("STU-1008", "Darek Flynn", "Antigravity Engineering", 9.55, 80, "POD-DELTA"));
        addStudent(new Student("STU-1009", "Maya Lin", "Orbital Bio-Systems", 9.42, 68, "POD-EPSILON"));
        addStudent(new Student("STU-1010", "Soren Voss", "Quantum Cryptography", 8.90, 52, "POD-BETA"));
        addStudent(new Student("STU-1011", "Elena Zhao", "Autonomous Avionics", 9.75, 88, "POD-GAMMA"));
        addStudent(new Student("STU-1012", "Rowan Cruz", "Deep-Space Cryogenics", 8.78, 60, "POD-ALPHA"));

        // 3. Faculty
        Faculty f1 = new Faculty("FAC-01", "Elena Rostova", "Gravitational Physics", 3);
        f1.addQualifiedCourse("GRAV-404");
        f1.addQualifiedCourse("ASTRO-301");
        f1.addQualifiedCourse("COSMO-420");

        Faculty f2 = new Faculty("FAC-02", "Marcus Sterling", "Quantum Engineering", 3);
        f2.addQualifiedCourse("QUANT-502");
        f2.addQualifiedCourse("AI-610");
        f2.addQualifiedCourse("ROBO-440");

        Faculty f3 = new Faculty("FAC-03", "Sarah Vance", "Orbital Architecture", 3);
        f3.addQualifiedCourse("ORBIT-205");
        f3.addQualifiedCourse("ASTRO-301");
        f3.addQualifiedCourse("EXO-530");

        Faculty f4 = new Faculty("FAC-04", "Thorne Caldwell", "Antigravity Propulsion", 3);
        f4.addQualifiedCourse("GRAV-404");
        f4.addQualifiedCourse("ORBIT-205");
        f4.addQualifiedCourse("THERMO-380");

        Faculty f5 = new Faculty("FAC-05", "Dr. Alistair Finch", "Bio-Cybernetics", 2);
        f5.addQualifiedCourse("NEURO-315");
        f5.addQualifiedCourse("EXO-530");

        addFaculty(f1);
        addFaculty(f2);
        addFaculty(f3);
        addFaculty(f4);
        addFaculty(f5);

        // 4. Courses (Expanded to 10 comprehensive courses)
        addCourse(new Course("ASTRO-301", "Relativistic Celestial Mechanics", 4, "THEORY", 1));
        addCourse(new Course("GRAV-404", "Antigravity Propulsion Systems", 5, "GRAVITY_LAB", 2));
        addCourse(new Course("QUANT-502", "Quantum Entanglement Informatics", 4, "QUANTUM_SIM", 1));
        addCourse(new Course("ORBIT-205", "Orbital Dynamics & Docking", 3, "ASTRONAV", 3));
        addCourse(new Course("AI-610", "Autonomous Drone Swarm Coordination", 4, "QUANTUM_SIM", 2));
        addCourse(new Course("COSMO-420", "Plasma Magnetohydrodynamics & Shielding", 4, "GRAVITY_LAB", 3));
        addCourse(new Course("NEURO-315", "Neural Cyber-Interface Architectures", 3, "THEORY", 1));
        addCourse(new Course("EXO-530", "Exoplanetary Atmospheric Geo-Engineering", 4, "ASTRONAV", 2));
        addCourse(new Course("ROBO-440", "Robotic Spacecraft Tele-Robotics", 4, "QUANTUM_SIM", 3));
        addCourse(new Course("THERMO-380", "Deep-Space Cryogenic Thermodynamics", 3, "THEORY", 1));

        // Enrollments
        courses.get("ASTRO-301").enrollStudent("STU-1001");
        courses.get("ASTRO-301").enrollStudent("STU-1002");
        courses.get("ASTRO-301").enrollStudent("STU-1004");
        courses.get("GRAV-404").enrollStudent("STU-1001");
        courses.get("GRAV-404").enrollStudent("STU-1002");
        courses.get("GRAV-404").enrollStudent("STU-1004");
        courses.get("GRAV-404").enrollStudent("STU-1008");
        courses.get("QUANT-502").enrollStudent("STU-1003");
        courses.get("QUANT-502").enrollStudent("STU-1007");
        courses.get("QUANT-502").enrollStudent("STU-1010");
        courses.get("ORBIT-205").enrollStudent("STU-1001");
        courses.get("ORBIT-205").enrollStudent("STU-1004");
        courses.get("ORBIT-205").enrollStudent("STU-1008");
        courses.get("AI-610").enrollStudent("STU-1005");
        courses.get("AI-610").enrollStudent("STU-1011");
        courses.get("COSMO-420").enrollStudent("STU-1002");
        courses.get("COSMO-420").enrollStudent("STU-1006");
        courses.get("NEURO-315").enrollStudent("STU-1005");
        courses.get("NEURO-315").enrollStudent("STU-1009");
        courses.get("EXO-530").enrollStudent("STU-1003");
        courses.get("EXO-530").enrollStudent("STU-1004");
        courses.get("ROBO-440").enrollStudent("STU-1007");
        courses.get("ROBO-440").enrollStudent("STU-1011");
        courses.get("THERMO-380").enrollStudent("STU-1001");
        courses.get("THERMO-380").enrollStudent("STU-1012");

        // 5. Academic Activities & Extracurriculars
        activities.add(new AcademicActivity("ACT-01", "Orbital Zero-G Practicum: Graviton Dynamics", "PRACTICUM",
                "Prof. Elena Rostova", "2026-10-14", "14:00 - 17:00 UTC", "POD-DELTA (Drifting Lab)", 30, 26, 1.5, "ACTIVE"));
        activities.add(new AcademicActivity("ACT-02", "Quantum Informatics & Entanglement Hackathon 2026", "HACKATHON",
                "Prof. Marcus Sterling", "2026-10-22", "09:00 - 21:00 UTC", "POD-BETA (Quantum Sim)", 45, 42, 2.0, "UPCOMING"));
        activities.add(new AcademicActivity("ACT-03", "Autonomous Drone Swarm Inter-Pod Navigation Trials", "FIELD_TRIAL",
                "Prof. Sarah Vance", "2026-10-28", "13:00 - 16:30 UTC", "POD-GAMMA (Zenith Pod)", 25, 20, 1.5, "UPCOMING"));
        activities.add(new AcademicActivity("ACT-04", "Deep-Space Propulsion Engineering Symposium", "SYMPOSIUM",
                "Prof. Thorne Caldwell", "2026-11-04", "10:00 - 15:00 UTC", "POD-ALPHA (Graviton Hall)", 100, 88, 1.0, "UPCOMING"));
        activities.add(new AcademicActivity("ACT-05", "Exoplanetary Atmospheric Geo-Engineering Workshop", "WORKSHOP",
                "Dr. Alistair Finch", "2026-11-12", "11:00 - 14:00 UTC", "POD-EPSILON (Bio-Dome)", 40, 35, 1.0, "UPCOMING"));
        activities.add(new AcademicActivity("ACT-06", "Orbital Station Alpha Academic Governance & Ethics Conclave", "SYMPOSIUM",
                "Dr. Arthur Vance (Dean)", "2026-11-20", "15:00 - 18:00 UTC", "POD-ALPHA (Executive Room)", 60, 58, 1.0, "UPCOMING"));

        // 6. Assignments with Content, Grades, Due Dates, and Originality
        String paper1 = "In zero-G orbital drift, antigravity propulsion requires constant calibration of the graviton flux capacitor. " +
                "The mathematical formulation of relativistic tensor fields dictates that orbital velocity vectors must stabilize against planetary micro-drag. " +
                "Experimental data gathered in Pod-Delta indicates high efficiency during pulse modulation.";

        String paper2 = "For interplanetary spacecraft in zero-G orbital drift, antigravity propulsion requires constant calibration of the graviton flux capacitor. " +
                "This study investigates alternative propellant cycles where orbital velocity vectors must stabilize against planetary micro-drag under quantum field variance.";

        String paper3 = "Autonomous drone swarms navigating between drifting pods utilize decentralized consensus. " +
                "Neural telemetry latency must be kept below ten milliseconds to avoid collisions near the airlock threshold.";

        String paper4 = "Relativistic tensor field perturbations around rotating Kerr singularities create frame-dragging anomalies. " +
                "We calculate geodesics using Christoffel symbols to model micro-satellite trajectories in Lagrange orbital points.";

        String paper5 = "Deep-space cryogenic coolant loop optimization using Brayton cycles at liquid helium temperatures. " +
                "Thermal dissipations in micro-gravity environments exhibit anomalous boiling characteristics.";

        addAssignment(new Assignment("ASN-001", "GRAV-404", "STU-1002", "Graviton Flux Analysis", paper1,
                System.currentTimeMillis() - 86400000L * 3, "GRADED", "2026-10-02", 96.5, 25, 4.2));
        addAssignment(new Assignment("ASN-002", "GRAV-404", "STU-1008", "Pulse Modulation in Orbit", paper2,
                System.currentTimeMillis() - 86400000L * 2, "GRADED", "2026-10-02", 94.0, 25, 6.8));
        addAssignment(new Assignment("ASN-003", "AI-610", "STU-1005", "Swarm Consensus Protocol", paper3,
                System.currentTimeMillis() - 86400000L, "GRADED", "2026-10-03", 99.0, 30, 2.1));
        addAssignment(new Assignment("ASN-004", "ASTRO-301", "STU-1001", "Relativistic Tensor Geodesics", paper4,
                System.currentTimeMillis() - 43200000L, "GRADED", "2026-10-04", 98.0, 30, 1.8));
        addAssignment(new Assignment("ASN-005", "THERMO-380", "STU-1001", "Cryogenic Thermal Dissipation", paper5,
                System.currentTimeMillis() - 14400000L, "UNDER_REVIEW", "2026-10-18", 0.0, 20, 0.0));
        addAssignment(new Assignment("ASN-006", "ORBIT-205", "STU-1001", "Autonomous Station Docking Simulation",
                "Simulation of orbital velocity match, hydrazine thruster pulsing, and magnetic latch engagement in Pod-Gamma.",
                System.currentTimeMillis() - 7200000L, "SUBMITTED", "2026-10-25", 0.0, 25, 0.0));

        // 7. Examination Records (Midterm & Final Examination Timetables)
        examRecords.add(new ExamRecord("EXAM-301", "ASTRO-301", "Relativistic Celestial Mechanics", "STU-1001",
                "2026-11-15", "09:30 - 12:30 UTC (Slot 1)", "Pod-Alpha (Graviton Hall)", "Seat A-14",
                "CONFIRMED", "MR-PRIME-1000000007", 100, 9.85));
        examRecords.add(new ExamRecord("EXAM-404", "GRAV-404", "Antigravity Propulsion Systems", "STU-1001",
                "2026-11-18", "14:00 - 17:00 UTC (Slot 2)", "Pod-Delta (Dynamics Lab)", "Seat D-08",
                "CONFIRMED", "MR-PRIME-1000000009", 100, 9.70));
        examRecords.add(new ExamRecord("EXAM-205", "ORBIT-205", "Orbital Dynamics & Docking", "STU-1001",
                "2026-11-22", "10:00 - 13:00 UTC (Slot 3)", "Pod-Gamma (Zenith Pod)", "Seat G-22",
                "CONFIRMED", "MR-PRIME-1000000021", 100, 9.60));
        examRecords.add(new ExamRecord("EXAM-380", "THERMO-380", "Deep-Space Cryogenic Thermodynamics", "STU-1001",
                "2026-11-26", "09:30 - 12:30 UTC (Slot 1)", "Pod-Alpha (Graviton Hall)", "Seat A-35",
                "CONFIRMED", "MR-PRIME-1000000033", 100, 9.40));

        // 8. Learning Resources and Documents
        learningResources.add(new LearningResource("RES-101", "Principles of Relativistic Celestial Mechanics (6th Ed.)",
                "ASTRO-301", "TEXTBOOK", "Prof. Elena Rostova", "PDF (18.4 MB)", 48200,
                "Suffix Array (SA-IS) + Kasai LCP",
                "Comprehensive standard textbook covering relativistic tensor calculus, Schwarzschild metrics, and orbital transfer mechanics.",
                "mechanics, relativistic, orbit, tensor, gravity"));
        learningResources.add(new LearningResource("RES-102", "Graviton Flux Capacitor Calibration Manual v3.2",
                "GRAV-404", "LAB_MANUAL", "Prof. Thorne Caldwell", "PDF (6.8 MB)", 14300,
                "Suffix Automaton (Linear)",
                "Official technical safety protocols and step-by-step laboratory instructions for zero-G thruster calibration in Pod-Delta.",
                "graviton, propulsion, flux, capacitor, calibration"));
        learningResources.add(new LearningResource("RES-103", "Quantum Entanglement & Space-Time Telemetry Lecture Notes",
                "QUANT-502", "SLIDES", "Prof. Marcus Sterling", "SLIDES (24.1 MB)", 9800,
                "Aho-Corasick Multi-Pattern",
                "Curated seminar slide decks exploring quantum teleportation protocols, Bell inequalities, and encrypted orbital links.",
                "quantum, entanglement, telemetry, informatics"));
        learningResources.add(new LearningResource("RES-104", "Orbital Docking Protocols & Airlock Vector Control",
                "ORBIT-205", "PREPRINT", "Prof. Sarah Vance", "PDF (9.2 MB)", 16700,
                "KMP Algorithm (Prefix Function)",
                "Preprint research publication investigating automated magnetic latching dynamics and station safety airlock standards.",
                "orbital, docking, airlock, velocity, dynamics"));
        learningResources.add(new LearningResource("RES-105", "Decentralized Drone Swarm Coordination in Microgravity",
                "AI-610", "PREPRINT", "Prof. Marcus Sterling", "PDF (12.0 MB)", 22400,
                "Ukkonen Suffix Tree",
                "Peer-reviewed paper outlining consensus algorithms and collision avoidance heuristics for autonomous scout drones.",
                "swarm, drone, consensus, latency, autonomous"));
        learningResources.add(new LearningResource("RES-106", "Cryogenic Loop Heat Exchangers in Spacecraft Design",
                "THERMO-380", "SYLLABUS", "Prof. Thorne Caldwell", "PDF (3.5 MB)", 7500,
                "Damerau-Levenshtein Typo Matcher",
                "Official course syllabus, weekly lecture breakdown, laboratory schedule, and examination grading rubrics.",
                "thermodynamics, cryogenic, cooling, brayton"));

        // 9. Continuous Activity Stream & Audit Logs
        long now = System.currentTimeMillis();
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-901", now - 3600000L * 4, "STU-1001", "Nova Vance",
                "POD_CHECKIN", "Pod-Alpha access granted via Miller-Rabin 64-bit biometric token.", "POD-ALPHA", 0.35, 0.42));
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-902", now - 3600000L * 3, "STU-1001", "Nova Vance",
                "LIBRARY_ACCESS", "Queried 'Relativistic Tensor Geodesics' indexed with Suffix Array SA-IS.", "POD-ALPHA", 0.35, 0.65));
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-903", now - 3600000L * 2, "STU-1002", "Lyra Thorne",
                "ASSIGNMENT_SUBMISSION", "Uploaded ASN-001 (Graviton Flux Analysis) with 4.2% Kasai LCP similarity index.", "POD-DELTA", 0.00, 0.78));
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-904", now - 3600000L * 1, "STU-1005", "Zara Sterling",
                "EXAM_VERIFY", "Exam seat confirmed for AI-610 via DPLL SAT Conflict-Free Timetable Solver.", "POD-BETA", 0.05, 0.50));
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-905", now - 1800000L, "STU-1001", "Nova Vance",
                "TELEMETRY_STREAM", "Continuous sensor stream: O2 = 98.4%, Thruster = 1420 J, Microgravity = 0.03 G.", "POD-ALPHA", 0.03, 0.45));
        continuousActivityLogs.add(new ContinuousActivityLog("LOG-906", now - 300000L, "STU-1004", "Kaelen Cross",
                "ACTIVITY_ENROLL", "Registered for 'Orbital Zero-G Practicum' under Prof. Elena Rostova.", "POD-DELTA", 0.00, 0.58));

        // 10. Sensor Telemetry Logs
        telemetryLogs.add(new OrbitalTelemetry("SENS-A01", "STU-1001", now - 5000, 0.03, 1420.5, 98.2, 0.45));
        telemetryLogs.add(new OrbitalTelemetry("SENS-A02", "STU-1002", now - 4000, 0.01, 2190.0, 94.7, 0.68));
        telemetryLogs.add(new OrbitalTelemetry("SENS-A03", "STU-1003", now - 3000, 0.05, 870.2, 99.1, 0.32));
        telemetryLogs.add(new OrbitalTelemetry("SENS-A04", "STU-1004", now - 2000, 0.00, 3100.8, 91.5, 0.81));
        telemetryLogs.add(new OrbitalTelemetry("SENS-A05", "STU-1005", now - 1000, 0.02, 1250.0, 97.4, 0.54));
    }

    public void addStudent(Student s) { students.put(s.getId(), s); }
    public void addFaculty(Faculty f) { faculty.put(f.getId(), f); }
    public void addCourse(Course c) { courses.put(c.getCode(), c); }
    public void addPod(FloatingPod p) { floatingPods.put(p.getId(), p); }
    public void addAssignment(Assignment a) { assignments.add(a); }
    public void addActivity(AcademicActivity a) { activities.add(a); }
    public void addLearningResource(LearningResource r) { learningResources.add(r); }
    public void addExamRecord(ExamRecord e) { examRecords.add(e); }
    public void addContinuousActivityLog(ContinuousActivityLog log) { continuousActivityLogs.add(log); }
    public void addTelemetry(OrbitalTelemetry t) { telemetryLogs.add(t); }

    public Map<String, Student> getStudents() { return students; }
    public Map<String, Faculty> getFaculty() { return faculty; }
    public Map<String, Course> getCourses() { return courses; }
    public Map<String, FloatingPod> getFloatingPods() { return floatingPods; }
    public List<Assignment> getAssignments() { return assignments; }
    public List<AcademicActivity> getActivities() { return activities; }
    public List<LearningResource> getLearningResources() { return learningResources; }
    public List<ExamRecord> getExamRecords() { return examRecords; }
    public List<ContinuousActivityLog> getContinuousActivityLogs() { return continuousActivityLogs; }
    public List<OrbitalTelemetry> getTelemetryLogs() { return telemetryLogs; }

    public List<String> getAllAcademicKeywords() {
        return Arrays.asList(
                "antigravity", "propulsion", "graviton", "quantum", "relativistic",
                "orbital", "telemetry", "drag", "entanglement", "astrogation",
                "trajectory", "singularity", "thruster", "plagiarism", "cryogenic",
                "plasma", "magnetohydrodynamics", "avionics", "cybernetics", "brayton"
        );
    }
}
