package org.edutrack.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.edutrack.m1_string.*;
import org.edutrack.m2_suffix.*;
import org.edutrack.m3_dp.*;
import org.edutrack.m4_flow.*;
import org.edutrack.m5_np.*;
import org.edutrack.m6_randomized_parallel.*;
import org.edutrack.model.*;
import org.edutrack.service.EduTrackEngine;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

/**
 * Built-in zero-dependency HTTP server providing full academic REST API endpoints
 * and role-based Web Portals (Student, Faculty, Dean/Admin) for EduTrack.
 */
public class EduTrackHttpServer {

    private int port;
    private final EduTrackEngine engine;
    private HttpServer server;

    public EduTrackHttpServer(int port, EduTrackEngine engine) {
        this.port = port;
        this.engine = engine;
    }

    public int getPort() {
        return port;
    }

    public void start() throws IOException {
        IOException lastEx = null;
        int targetPort = this.port;
        for (int p = targetPort; p <= targetPort + 20; p++) {
            try {
                server = HttpServer.create(new InetSocketAddress(p), 0);
                this.port = p;
                break;
            } catch (java.net.BindException be) {
                lastEx = be;
            }
        }
        if (server == null) {
            throw (lastEx != null) ? lastEx : new IOException("Could not bind to any port in range " + targetPort + " - " + (targetPort + 20));
        }

        server.createContext("/", new StaticFileHandler());
        server.createContext("/api/status", new StatusHandler());
        server.createContext("/api/academic-data", new AcademicDataHandler());
        server.createContext("/api/smart-search", new SmartSearchHandler());
        server.createContext("/api/check-plagiarism", new PlagiarismCheckHandler());
        server.createContext("/api/faculty-matching", new FacultyMatchingHandler());
        server.createContext("/api/pod-transit", new PodTransitHandler());
        server.createContext("/api/campus-flow", new CampusFlowHandler());
        server.createContext("/api/exam-timetabling", new ExamTimetablingHandler());
        server.createContext("/api/student-analytics", new StudentAnalyticsHandler());

        // Legacy module endpoints for verification
        server.createContext("/api/module1", new Module1Handler());
        server.createContext("/api/module2", new Module2Handler());
        server.createContext("/api/module3", new Module3Handler());
        server.createContext("/api/module4", new Module4Handler());
        server.createContext("/api/module5", new Module5Handler());
        server.createContext("/api/module6", new Module6Handler());

        server.setExecutor(null);
        server.start();
        System.out.println("[EduTrack HTTP Server] Listening on http://localhost:" + this.port);
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            Path filePath = Paths.get("web" + path);
            if (Files.exists(filePath) && !Files.isDirectory(filePath)) {
                String contentType = "text/html; charset=UTF-8";
                if (path.endsWith(".css")) contentType = "text/css; charset=UTF-8";
                else if (path.endsWith(".js")) contentType = "application/javascript; charset=UTF-8";
                else if (path.endsWith(".json")) contentType = "application/json; charset=UTF-8";
                else if (path.endsWith(".mp4")) contentType = "video/mp4";
                else if (path.endsWith(".webm")) contentType = "video/webm";
                else if (path.endsWith(".png")) contentType = "image/png";
                else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (path.endsWith(".svg")) contentType = "image/svg+xml";

                byte[] data = Files.readAllBytes(filePath);
                long fileSize = data.length;

                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.getResponseHeaders().set("Accept-Ranges", "bytes");

                String rangeHeader = exchange.getRequestHeaders().getFirst("Range");
                if (rangeHeader != null && rangeHeader.startsWith("bytes=") && path.endsWith(".mp4")) {
                    String[] ranges = rangeHeader.substring(6).split("-");
                    long start = Long.parseLong(ranges[0]);
                    long end = (ranges.length > 1 && !ranges[1].isEmpty()) ? Long.parseLong(ranges[1]) : (fileSize - 1);
                    if (end >= fileSize) end = fileSize - 1;
                    long contentLength = end - start + 1;

                    exchange.getResponseHeaders().set("Content-Range", "bytes " + start + "-" + end + "/" + fileSize);
                    exchange.sendResponseHeaders(206, contentLength);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(data, (int) start, (int) contentLength);
                    }
                } else {
                    exchange.sendResponseHeaders(200, fileSize);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(data);
                    }
                }
            } else {
                String notFound = "<h1>404 - Not Found</h1>";
                exchange.sendResponseHeaders(404, notFound.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(notFound.getBytes(StandardCharsets.UTF_8));
                }
            }
        }
    }

    private class StatusHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = String.format("{\"status\":\"ONLINE\",\"campus\":\"Antigravity Orbital Station Alpha\",\"students\":%d,\"faculty\":%d,\"courses\":%d,\"pods\":%d,\"timestamp\":%d}",
                    engine.getRepository().getStudents().size(),
                    engine.getRepository().getFaculty().size(),
                    engine.getRepository().getCourses().size(),
                    engine.getRepository().getFloatingPods().size(),
                    System.currentTimeMillis());
            sendJsonResponse(exchange, 200, json);
        }
    }

    /**
     * Complete academic repository payload for role dashboards
     */
    private class AcademicDataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            StringBuilder json = new StringBuilder("{");

            // Students
            json.append("\"students\":[");
            int sIdx = 0;
            for (Student s : engine.getRepository().getStudents().values()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"name\":\"%s\",\"major\":\"%s\",\"gpa\":%.2f,\"credits\":%d,\"podId\":\"%s\"}",
                        s.getId(), s.getName(), s.getMajor(), s.getGpa(), s.getCompletedCredits(), s.getCurrentPodId()));
                if (++sIdx < engine.getRepository().getStudents().size()) json.append(",");
            }
            json.append("],");

            // Faculty
            json.append("\"faculty\":[");
            int fIdx = 0;
            for (Faculty f : engine.getRepository().getFaculty().values()) {
                json.append(String.format("{\"id\":\"%s\",\"name\":\"%s\",\"dept\":\"%s\",\"maxLoad\":%d,\"qualified\":[",
                        f.getId(), f.getName(), f.getDepartment(), f.getMaxLoad()));
                for (int q = 0; q < f.getQualifiedCourseCodes().size(); q++) {
                    json.append("\"").append(f.getQualifiedCourseCodes().get(q)).append("\"");
                    if (q < f.getQualifiedCourseCodes().size() - 1) json.append(",");
                }
                json.append("]}");
                if (++fIdx < engine.getRepository().getFaculty().size()) json.append(",");
            }
            json.append("],");

            // Courses
            json.append("\"courses\":[");
            int cIdx = 0;
            for (Course c : engine.getRepository().getCourses().values()) {
                json.append(String.format("{\"code\":\"%s\",\"title\":\"%s\",\"credits\":%d,\"podType\":\"%s\",\"examSlot\":%d,\"enrolledCount\":%d}",
                        c.getCode(), c.getTitle(), c.getCredits(), c.getRequiredPodType(), c.getExamTimeSlot(), c.getEnrolledStudentIds().size()));
                if (++cIdx < engine.getRepository().getCourses().size()) json.append(",");
            }
            json.append("],");

            // Floating Pods
            json.append("\"pods\":[");
            int pIdx = 0;
            for (FloatingPod p : engine.getRepository().getFloatingPods().values()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"name\":\"%s\",\"type\":\"%s\",\"capacity\":%d,\"x\":%.1f,\"y\":%.1f,\"z\":%.1f,\"gravity\":%.2f,\"power\":%d}",
                        p.getId(), p.getName(), p.getPodType(), p.getCapacity(), p.getX(), p.getY(), p.getZ(), p.getArtificialGravity(), p.getPowerGridUnits()));
                if (++pIdx < engine.getRepository().getFloatingPods().size()) json.append(",");
            }
            json.append("],");

            // Assignments
            json.append("\"assignments\":[");
            int aIdx = 0;
            for (Assignment a : engine.getRepository().getAssignments()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"courseCode\":\"%s\",\"studentId\":\"%s\",\"title\":\"%s\",\"length\":%d,\"preview\":\"%s\",\"status\":\"%s\",\"dueDate\":\"%s\",\"score\":%.1f,\"weightage\":%d,\"similarity\":%.1f}",
                        a.getId(), a.getCourseCode(), a.getStudentId(), escapeJson(a.getTitle()),
                        a.getContent().length(),
                        escapeJson(a.getContent().substring(0, Math.min(100, a.getContent().length())) + "..."),
                        a.getStatus(), a.getDueDate(), a.getScore(), a.getWeightagePct(), a.getSimilarityPct()));
                if (++aIdx < engine.getRepository().getAssignments().size()) json.append(",");
            }
            json.append("],");

            // Academic Activities
            json.append("\"activities\":[");
            int actIdx = 0;
            for (AcademicActivity act : engine.getRepository().getActivities()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"title\":\"%s\",\"category\":\"%s\",\"host\":\"%s\",\"date\":\"%s\",\"time\":\"%s\",\"pod\":\"%s\",\"capacity\":%d,\"enrolled\":%d,\"credits\":%.1f,\"status\":\"%s\"}",
                        act.getId(), escapeJson(act.getTitle()), act.getCategory(), escapeJson(act.getHostFaculty()),
                        act.getScheduleDate(), act.getTimeSlot(), act.getPodLocation(), act.getCapacity(), act.getEnrolledCount(), act.getCreditsValue(), act.getStatus()));
                if (++actIdx < engine.getRepository().getActivities().size()) json.append(",");
            }
            json.append("],");

            // Learning Resources
            json.append("\"learningResources\":[");
            int resIdx = 0;
            for (LearningResource res : engine.getRepository().getLearningResources()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"title\":\"%s\",\"courseCode\":\"%s\",\"docType\":\"%s\",\"author\":\"%s\",\"format\":\"%s\",\"wordCount\":%d,\"indexing\":\"%s\",\"abstractSummary\":\"%s\",\"keywords\":\"%s\"}",
                        res.getId(), escapeJson(res.getTitle()), res.getCourseCode(), res.getDocType(),
                        escapeJson(res.getAuthor()), res.getFileFormat(), res.getWordCount(),
                        escapeJson(res.getIndexingStructure()), escapeJson(res.getAbstractSummary()), escapeJson(res.getKeywords())));
                if (++resIdx < engine.getRepository().getLearningResources().size()) json.append(",");
            }
            json.append("],");

            // Exam Records
            json.append("\"examRecords\":[");
            int exIdx = 0;
            for (ExamRecord ex : engine.getRepository().getExamRecords()) {
                json.append(String.format(Locale.US, "{\"examCode\":\"%s\",\"courseCode\":\"%s\",\"courseTitle\":\"%s\",\"studentId\":\"%s\",\"date\":\"%s\",\"timeSlot\":\"%s\",\"hallPod\":\"%s\",\"seat\":\"%s\",\"status\":\"%s\",\"cryptoToken\":\"%s\",\"maxMarks\":%d,\"score\":%.2f}",
                        ex.getExamCode(), ex.getCourseCode(), escapeJson(ex.getCourseTitle()), ex.getStudentId(),
                        ex.getExamDate(), ex.getTimeSlot(), ex.getHallPod(), ex.getSeatNumber(), ex.getStatus(),
                        ex.getCryptoToken(), ex.getMaxMarks(), ex.getScoreAwarded()));
                if (++exIdx < engine.getRepository().getExamRecords().size()) json.append(",");
            }
            json.append("],");

            // Continuous Activity Logs
            json.append("\"continuousActivityLogs\":[");
            int logIdx = 0;
            for (ContinuousActivityLog log : engine.getRepository().getContinuousActivityLogs()) {
                json.append(String.format(Locale.US, "{\"id\":\"%s\",\"timestamp\":%d,\"studentId\":\"%s\",\"studentName\":\"%s\",\"actionType\":\"%s\",\"description\":\"%s\",\"locationPod\":\"%s\",\"microGravity\":%.3f,\"cognitiveLoad\":%.2f}",
                        log.getId(), log.getTimestamp(), log.getStudentId(), escapeJson(log.getStudentName()),
                        log.getActionType(), escapeJson(log.getDescription()), log.getLocationPod(), log.getMicroGravity(), log.getCognitiveLoad()));
                if (++logIdx < engine.getRepository().getContinuousActivityLogs().size()) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Smart Course & Keyword Search powered by KMP, Damerau-Levenshtein, and Aho-Corasick
     */
    private class SmartSearchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String query = "";
            String rawQuery = exchange.getRequestURI().getQuery();
            if (rawQuery != null && rawQuery.contains("q=")) {
                String[] parts = rawQuery.split("&");
                for (String p : parts) {
                    if (p.startsWith("q=")) {
                        query = URLDecoder.decode(p.substring(2), StandardCharsets.UTF_8).trim();
                    }
                }
            }
            if (query.isEmpty()) query = "mechanics";

            // 1. KMP search across all course titles
            List<Map<String, Object>> courseMatches = new ArrayList<>();
            for (Course c : engine.getRepository().getCourses().values()) {
                String fullText = c.getCode() + " " + c.getTitle();
                KMP.KMPResult kmp = KMP.search(fullText.toLowerCase(), query.toLowerCase());
                if (!kmp.matchIndices.isEmpty()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("code", c.getCode());
                    item.put("title", c.getTitle());
                    item.put("matches", kmp.matchIndices);
                    courseMatches.add(item);
                }
            }

            // 2. Damerau-Levenshtein & Levenshtein auto-correction against academic dictionary
            String suggestedCorrection = DamerauLevenshtein.suggestCorrection(query, engine.getRepository().getAllAcademicKeywords());
            DamerauLevenshtein.DLResult dlResult = DamerauLevenshtein.compute(query, suggestedCorrection);

            // 3. Aho-Corasick multi-keyword tagging
            AhoCorasick ac = new AhoCorasick(engine.getRepository().getAllAcademicKeywords());
            List<AhoCorasick.Match> acMatches = ac.search(query.toLowerCase());

            StringBuilder json = new StringBuilder("{");
            json.append("\"query\":\"").append(escapeJson(query)).append("\",");
            json.append("\"suggestedCorrection\":\"").append(escapeJson(suggestedCorrection)).append("\",");
            json.append("\"editDistance\":").append(dlResult.distance).append(",");
            json.append("\"transpositionHandled\":").append(dlResult.transpositionUsed).append(",");

            json.append("\"detectedKeywords\":[");
            for (int i = 0; i < acMatches.size(); i++) {
                json.append("\"").append(acMatches.get(i).keyword).append("\"");
                if (i < acMatches.size() - 1) json.append(",");
            }
            json.append("],");

            json.append("\"courseMatches\":[");
            for (int i = 0; i < courseMatches.size(); i++) {
                Map<String, Object> m = courseMatches.get(i);
                json.append(String.format("{\"code\":\"%s\",\"title\":\"%s\",\"indices\":%s}",
                        m.get("code"), escapeJson((String)m.get("title")), m.get("matches")));
                if (i < courseMatches.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Plagiarism & Originality Checker powered by Suffix Arrays, SA-IS, Kasai LCP, and Z-Algorithm
     */
    private class PlagiarismCheckHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String text = "";
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) sb.append(line).append("\n");
                    text = sb.toString().trim();
                }
            } else {
                // Default comparison between ASN-001 and ASN-002
                KasaiLCP.PlagiarismReport report = engine.detectPlagiarismKasai("ASN-001", "ASN-002", 15);
                String a1Text = engine.getRepository().getAssignments().get(0).getContent();
                List<String> zRepeats = ZAlgorithm.findRepeatedPhrases(a1Text, 20);
                SuffixAutomaton sam = new SuffixAutomaton(a1Text);

                StringBuilder json = new StringBuilder("{");
                json.append("\"mode\":\"REPOSITORY_AUDIT\",");
                json.append("\"doc1\":\"ASN-001 (Graviton Flux Analysis)\",");
                json.append("\"doc2\":\"ASN-002 (Pulse Modulation in Orbit)\",");
                json.append("\"longestMatchLength\":").append(report.longestCommonLength).append(",");
                json.append("\"longestPhrase\":\"").append(escapeJson(report.longestCommonPhrase)).append("\",");
                json.append("\"similarityScore\":").append(String.format(Locale.US, "%.3f", report.similarityScore)).append(",");
                json.append("\"distinctSubstringsIndexed\":").append(sam.countDistinctSubstrings()).append(",");
                json.append("\"internalRepeatsDetected\":").append(zRepeats.size()).append(",");
                json.append("\"sharedPhrases\":[");
                for (int i = 0; i < report.sharedPhrases.size(); i++) {
                    json.append("\"").append(escapeJson(report.sharedPhrases.get(i))).append("\"");
                    if (i < report.sharedPhrases.size() - 1) json.append(",");
                }
                json.append("]}");
                sendJsonResponse(exchange, 200, json.toString());
                return;
            }

            // If custom text submitted by student
            if (text.isEmpty()) {
                text = engine.getRepository().getAssignments().get(0).getContent();
            }

            Assignment topMatch = null;
            KasaiLCP.PlagiarismReport topReport = null;
            for (Assignment a : engine.getRepository().getAssignments()) {
                KasaiLCP.PlagiarismReport rep = KasaiLCP.compareAssignments("SUBMISSION", text, a.getId(), a.getContent(), 12);
                if (topReport == null || rep.longestCommonLength > topReport.longestCommonLength) {
                    topReport = rep;
                    topMatch = a;
                }
            }

            List<String> zPhrases = ZAlgorithm.findRepeatedPhrases(text, 18);
            SuffixAutomaton sam = new SuffixAutomaton(text);

            StringBuilder json = new StringBuilder("{");
            json.append("\"mode\":\"STUDENT_PRE_CHECK\",");
            json.append("\"status\":\"ORIGINALITY_VERIFIED\",");
            json.append("\"topMatchDoc\":\"").append(topMatch != null ? topMatch.getTitle() : "None").append("\",");
            json.append("\"similarityScore\":").append(String.format(Locale.US, "%.3f", topReport != null ? topReport.similarityScore : 0.0)).append(",");
            json.append("\"longestSharedLength\":").append(topReport != null ? topReport.longestCommonLength : 0).append(",");
            json.append("\"longestSharedPhrase\":\"").append(escapeJson(topReport != null ? topReport.longestCommonPhrase : "")).append("\",");
            json.append("\"distinctVocabularySubstrings\":").append(sam.countDistinctSubstrings()).append(",");
            json.append("\"selfRepetitionsDetected\":").append(zPhrases.size());
            json.append("}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Faculty course matching (Hopcroft-Karp) and conflict analysis (König's Theorem)
     */
    private class FacultyMatchingHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            BipartiteMatching.MatchingResult match = engine.matchFacultyToCoursesBipartite();
            KonigTheorem.ConflictAnalysisResult konig = engine.analyzeFacultyCourseConflictsKonig();

            StringBuilder json = new StringBuilder("{");
            json.append("\"maxMatchingSize\":").append(match.maxMatchingSize).append(",");
            json.append("\"minVertexCoverSize\":").append(konig.minVertexCoverSize).append(",");
            json.append("\"maxIndependentSetSize\":").append(konig.maxIndependentSetSize).append(",");
            json.append("\"assignments\":[");
            int idx = 0;
            List<Faculty> facList = new ArrayList<>(engine.getRepository().getFaculty().values());
            List<Course> crsList = new ArrayList<>(engine.getRepository().getCourses().values());
            for (Map.Entry<Integer, Integer> entry : match.leftToRightMatch.entrySet()) {
                Faculty f = facList.get(entry.getKey() - 1);
                Course c = crsList.get(entry.getValue() - 1);
                json.append(String.format("{\"faculty\":\"Prof. %s\",\"course\":\"%s (%s)\",\"dept\":\"%s\"}",
                        f.getName(), c.getCode(), c.getTitle(), f.getDepartment()));
                if (++idx < match.leftToRightMatch.size()) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Floating Pod 3D Transit Tour Optimizer (Bitmask DP Traveling Pod Tour)
     */
    private class PodTransitHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            BitmaskDP.TSPResult tsp = engine.optimizeFloatingPodTransitBitmaskDP();
            StringBuilder json = new StringBuilder("{");
            json.append("\"minFuelJoules\":").append(String.format(Locale.US, "%.2f", tsp.minCost)).append(",");
            json.append("\"tour\":[");
            for (int i = 0; i < tsp.tour.size(); i++) {
                int podIdx = tsp.tour.get(i);
                json.append("\"").append(tsp.podNames[podIdx]).append("\"");
                if (i < tsp.tour.size() - 1) json.append(",");
            }
            json.append("]}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Campus Airlock and Spatial Resource Flow (Ford-Fulkerson, Edmonds-Karp, Dinic)
     */
    private class CampusFlowHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            FordFulkerson.FlowResult ff = engine.allocatePodResourcesFordFulkerson();
            EdmondsKarp.EKResult ek = engine.solveResourceFlowEdmondsKarp();
            Dinic.DinicResult dinic = engine.solveCampusNetworkDinic();

            StringBuilder json = new StringBuilder("{");
            json.append("\"podAllocationMaxSlots\":").append(ff.maxFlow).append(",");
            json.append("\"airlockTransitMaxStudents\":").append(dinic.maxFlow).append(",");
            json.append("\"edmondsKarpAugmentations\":").append(ek.augmentations).append(",");
            json.append("\"dinicPhases\":").append(dinic.phaseCount).append(",");
            json.append("\"routes\":[");
            for (int i = 0; i < ff.allocationPaths.size(); i++) {
                json.append("\"").append(escapeJson(ff.allocationPaths.get(i))).append("\"");
                if (i < ff.allocationPaths.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Examination Timetabling Constraint Solver (DPLL SAT & Vertex-Cover 2-Approximation)
     */
    private class ExamTimetablingHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            DPLLSolver.Solution sat = engine.solveExamScheduleSAT();
            Reductions.ReductionResult red = engine.demonstrate3SatToCliqueReduction();
            VertexCoverApproximation.CoverResult approx = engine.approximateVertexCoverConflicts();

            StringBuilder json = new StringBuilder("{");
            json.append("\"satisfiable\":").append(sat.satisfiable).append(",");
            json.append("\"vertexCoverApproxSize\":").append(approx.coverSize).append(",");
            json.append("\"optimalCoverLowerBound\":").append(approx.maxTheoreticalOptSize).append(",");
            json.append("\"reductionVertices\":").append(red.graph.vertexCount).append(",");
            json.append("\"reductionEdges\":").append(red.graph.edgeCount()).append(",");
            json.append("\"targetK\":").append(red.targetK).append(",");
            json.append("\"timetable\":[");
            json.append("{\"course\":\"ASTRO-301\",\"slot\":\"Slot 1\",\"pod\":\"Pod-Alpha\"},");
            json.append("{\"course\":\"GRAV-404\",\"slot\":\"Slot 2\",\"pod\":\"Pod-Delta\"},");
            json.append("{\"course\":\"QUANT-502\",\"slot\":\"Slot 1\",\"pod\":\"Pod-Beta\"}");
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    /**
     * Real-time student analytics (Blelloch Scan, ForkJoin GPA, Randomized QuickSort, Miller-Rabin)
     */
    private class StudentAnalyticsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<Student> ranked = engine.rankStudentsRandomizedQuickSort();
            BlellochScan.ScanResult blelloch = engine.computeCumulativeCreditsBlelloch();
            double avgGpa = engine.aggregateGPAForkJoin();
            BigInteger cryptoKey = engine.generateSecureStudentKeyMillerRabin(64);
            BrentsTheoremAnalyzer.AnalysisReport brent = engine.analyzeParallelSpeedupBrentsTheorem(100000, 25);

            StringBuilder json = new StringBuilder("{");
            json.append("\"campusAverageGPA\":").append(String.format(Locale.US, "%.3f", avgGpa)).append(",");
            json.append("\"totalCampusCredits\":").append(blelloch.totalSum).append(",");
            json.append("\"cryptographicExamBadge\":\"").append(cryptoKey.toString()).append("\",");
            json.append("\"maxParallelSpeedup\":").append(String.format(Locale.US, "%.1f", brent.parallelismDegree)).append(",");

            json.append("\"leaderboard\":[");
            for (int i = 0; i < ranked.size(); i++) {
                Student s = ranked.get(i);
                json.append(String.format(Locale.US, "{\"rank\":%d,\"id\":\"%s\",\"name\":\"%s\",\"major\":\"%s\",\"gpa\":%.2f,\"credits\":%d}",
                        i + 1, s.getId(), s.getName(), s.getMajor(), s.getGpa(), s.getCompletedCredits()));
                if (i < ranked.size() - 1) json.append(",");
            }
            json.append("]}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module1Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            KMP.KMPResult kmp = engine.searchCoursesKMP("Mechanics");
            ZAlgorithm.ZResult zRes = engine.searchAssignmentPhrasesZ(
                    engine.getRepository().getAssignments().get(0).getContent(), "antigravity propulsion");
            RabinKarp.RKResult rk = engine.searchCourseCodesRabinKarp("Current courses include GRAV-404 and ASTRO-301 in orbit.", "GRAV-404");
            List<AhoCorasick.Match> acMatches = engine.scanAcademicKeywordsAhoCorasick(
                    "The antigravity propulsion module relies on quantum entanglement and graviton drift.");

            StringBuilder json = new StringBuilder("{");
            json.append("\"kmp\":{\"matches\":").append(kmp.matchIndices).append(",\"comparisons\":").append(kmp.comparisons).append("},");
            json.append("\"zAlgorithm\":{\"matches\":").append(zRes.matchIndices).append("},");
            json.append("\"rabinKarp\":{\"matches\":").append(rk.matchIndices).append(",\"spuriousHits\":").append(rk.spuriousHits).append("},");
            json.append("\"ahoCorasick\":{\"matchesCount\":").append(acMatches.size()).append(",\"items\":[");
            for (int i = 0; i < acMatches.size(); i++) {
                AhoCorasick.Match m = acMatches.get(i);
                json.append("{\"keyword\":\"").append(m.keyword).append("\",\"index\":").append(m.index).append("}");
                if (i < acMatches.size() - 1) json.append(",");
            }
            json.append("]}}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module2Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String doc = engine.getRepository().getAssignments().get(0).getContent();
            SuffixArray sa = engine.indexDocumentSuffixArray(doc);
            int[] saisSA = engine.indexLargeDocumentSAIS(doc);
            KasaiLCP.PlagiarismReport report = engine.detectPlagiarismKasai("ASN-001", "ASN-002", 15);
            SuffixAutomaton sam = engine.queryDocumentSuffixAutomaton(doc);

            StringBuilder json = new StringBuilder("{");
            json.append("\"suffixArrayLength\":").append(sa.getSuffixArray().length).append(",");
            json.append("\"saisLength\":").append(saisSA.length).append(",");
            json.append("\"plagiarism\":{");
            json.append("\"doc1\":\"").append(report.doc1Id).append("\",");
            json.append("\"doc2\":\"").append(report.doc2Id).append("\",");
            json.append("\"longestMatchLength\":").append(report.longestCommonLength).append(",");
            json.append("\"longestPhrase\":\"").append(escapeJson(report.longestCommonPhrase)).append("\",");
            json.append("\"similarityScore\":").append(String.format(Locale.US, "%.3f", report.similarityScore));
            json.append("},");
            json.append("\"suffixAutomaton\":{");
            json.append("\"states\":").append(sam.getStateCount()).append(",");
            json.append("\"distinctSubstrings\":").append(sam.countDistinctSubstrings()).append(",");
            json.append("\"containsGraviton\":").append(sam.containsSubstring("graviton"));
            json.append("}}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module3Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Levenshtein.Result lev = engine.correctQueryLevenshtein("antigravty");
            DamerauLevenshtein.DLResult dl = engine.correctQueryDamerauLevenshtein("antigravtiy");
            int[] dims = {10, 30, 5, 60, 20};
            String[] labels = {"TelemetryT", "GradeMat", "PodAlloc", "TransitV"};
            MatrixChainMultiplication.MCMResult mcm = engine.optimizeDataPipelineMCM(dims, labels);
            BitmaskDP.TSPResult tsp = engine.optimizeFloatingPodTransitBitmaskDP();
            OptimalBST.OBSTResult obst = engine.buildOptimalAcademicKeyBST();

            StringBuilder json = new StringBuilder("{");
            json.append("\"levenshtein\":{\"distance\":").append(lev.distance).append("},");
            json.append("\"damerauLevenshtein\":{\"distance\":").append(dl.distance).append(",\"transposition\":").append(dl.transpositionUsed).append("},");
            json.append("\"mcm\":{\"minOperations\":").append(mcm.minOperations).append(",\"expression\":\"").append(escapeJson(mcm.optimalParenthesization)).append("\"},");
            json.append("\"bitmaskDP\":{\"minPropellantFuel\":").append(String.format(Locale.US, "%.2f", tsp.minCost)).append(",\"tourSize\":").append(tsp.tour.size()).append("},");
            json.append("\"obst\":{\"expectedCost\":").append(String.format(Locale.US, "%.4f", obst.expectedCost)).append("}");
            json.append("}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module4Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            BipartiteMatching.MatchingResult match = engine.matchFacultyToCoursesBipartite();
            FordFulkerson.FlowResult ff = engine.allocatePodResourcesFordFulkerson();
            EdmondsKarp.EKResult ek = engine.solveResourceFlowEdmondsKarp();
            Dinic.DinicResult dinic = engine.solveCampusNetworkDinic();
            KonigTheorem.ConflictAnalysisResult konig = engine.analyzeFacultyCourseConflictsKonig();

            StringBuilder json = new StringBuilder("{");
            json.append("\"bipartiteMatching\":{\"size\":").append(match.maxMatchingSize).append("},");
            json.append("\"fordFulkerson\":{\"maxFlow\":").append(ff.maxFlow).append("},");
            json.append("\"edmondsKarp\":{\"maxFlow\":").append(ek.maxFlow).append(",\"augmentations\":").append(ek.augmentations).append("},");
            json.append("\"dinic\":{\"maxFlow\":").append(dinic.maxFlow).append(",\"phases\":").append(dinic.phaseCount).append("},");
            json.append("\"konig\":{");
            json.append("\"matching\":").append(konig.maxMatchingSize).append(",");
            json.append("\"minVertexCover\":").append(konig.minVertexCoverSize).append(",");
            json.append("\"maxIndependentSet\":").append(konig.maxIndependentSetSize);
            json.append("}}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module5Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            DPLLSolver.Solution sat = engine.solveExamScheduleSAT();
            Reductions.ReductionResult cliqueRed = engine.demonstrate3SatToCliqueReduction();
            VertexCoverApproximation.CoverResult approx = engine.approximateVertexCoverConflicts();

            StringBuilder json = new StringBuilder("{");
            json.append("\"sat\":{\"satisfiable\":").append(sat.satisfiable).append("},");
            json.append("\"reduction\":{");
            json.append("\"name\":\"").append(cliqueRed.reductionName).append("\",");
            json.append("\"vertices\":").append(cliqueRed.graph.vertexCount).append(",");
            json.append("\"edges\":").append(cliqueRed.graph.edgeCount()).append(",");
            json.append("\"targetK\":").append(cliqueRed.targetK);
            json.append("},");
            json.append("\"vertexCoverApprox\":{\"size\":").append(approx.coverSize).append(",\"lowerBound\":").append(approx.maxTheoreticalOptSize).append("}");
            json.append("}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private class Module6Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<Student> ranked = engine.rankStudentsRandomizedQuickSort();
            List<OrbitalTelemetry> sample = engine.sampleTelemetryReservoir(3);
            BigInteger primeKey = engine.generateSecureStudentKeyMillerRabin(64);
            BlellochScan.ScanResult blelloch = engine.computeCumulativeCreditsBlelloch();
            double avgGpa = engine.aggregateGPAForkJoin();
            BrentsTheoremAnalyzer.AnalysisReport brent = engine.analyzeParallelSpeedupBrentsTheorem(100000, 25);

            StringBuilder json = new StringBuilder("{");
            json.append("\"rankedTopStudent\":\"").append(ranked.get(0).getName()).append(" (GPA: ").append(String.format(Locale.US, "%.2f", ranked.get(0).getGpa())).append(" / 10.0)\",");
            json.append("\"reservoirSampleSize\":").append(sample.size()).append(",");
            json.append("\"cryptoPrime\":\"").append(primeKey.toString()).append("\",");
            json.append("\"blellochTotalSum\":").append(blelloch.totalSum).append(",");
            json.append("\"forkJoinAvgGPA\":").append(String.format(Locale.US, "%.3f", avgGpa)).append(",");
            json.append("\"brentMaxParallelism\":").append(String.format(Locale.US, "%.2f", brent.parallelismDegree));
            json.append("}");
            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
