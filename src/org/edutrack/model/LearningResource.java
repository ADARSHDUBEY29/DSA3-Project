package org.edutrack.model;

/**
 * Represents an indexed academic learning resource, syllabus, textbook, or research document.
 */
public class LearningResource {
    private String id;
    private String title;
    private String courseCode;
    private String docType; // TEXTBOOK, SLIDES, LAB_MANUAL, PREPRINT, SYLLABUS
    private String author;
    private String fileFormat;
    private int wordCount;
    private String indexingStructure; // Suffix Array (SA-IS), Suffix Automaton, KMP
    private String abstractSummary;
    private String keywords;

    public LearningResource(String id, String title, String courseCode, String docType,
                            String author, String fileFormat, int wordCount,
                            String indexingStructure, String abstractSummary, String keywords) {
        this.id = id;
        this.title = title;
        this.courseCode = courseCode;
        this.docType = docType;
        this.author = author;
        this.fileFormat = fileFormat;
        this.wordCount = wordCount;
        this.indexingStructure = indexingStructure;
        this.abstractSummary = abstractSummary;
        this.keywords = keywords;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCourseCode() { return courseCode; }
    public String getDocType() { return docType; }
    public String getAuthor() { return author; }
    public String getFileFormat() { return fileFormat; }
    public int getWordCount() { return wordCount; }
    public String getIndexingStructure() { return indexingStructure; }
    public String getAbstractSummary() { return abstractSummary; }
    public String getKeywords() { return keywords; }
}
