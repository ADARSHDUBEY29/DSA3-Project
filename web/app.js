// Theme Management System: Natural Light (Default), Smooth Dark, Warm Earth
const THEMES = [
    { id: 'natural-light', label: 'Natural Light', icon: '🌿' },
    { id: 'smooth-dark', label: 'Smooth Dark', icon: '🌙' },
    { id: 'warm-earth', label: 'Warm Earth', icon: '🍵' }
];

function initAppTheme() {
    const saved = localStorage.getItem('edutrack_theme') || 'natural-light';
    setAppTheme(saved);
}

function setAppTheme(themeId) {
    const match = THEMES.find(t => t.id === themeId) || THEMES[0];
    document.documentElement.setAttribute('data-theme', match.id);
    localStorage.setItem('edutrack_theme', match.id);

    const toggleLabel = document.getElementById('themeToggleLabel');
    if (toggleLabel) {
        toggleLabel.textContent = `${match.icon} ${match.label}`;
    }
    const loginThemeLabel = document.getElementById('loginThemeLabel');
    if (loginThemeLabel) {
        loginThemeLabel.textContent = `${match.icon} ${match.label}`;
    }
}

function cycleAppTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'natural-light';
    const currIdx = THEMES.findIndex(t => t.id === current);
    const nextIdx = (currIdx + 1) % THEMES.length;
    setAppTheme(THEMES[nextIdx].id);
}

// Immediate execution to prevent flash
initAppTheme();

document.addEventListener('DOMContentLoaded', () => {
    initAppTheme();
    loadAcademicData();
});

// Fetch all university data from backend
async function loadAcademicData() {
    try {
        const res = await fetch('/api/academic-data');
        if (res.ok) {
            academicData = await res.json();
            populateLoginSelects();
        }
    } catch (e) {
        console.error('Failed to load academic data:', e);
    }
}

// Populate login options from server data
function populateLoginSelects() {
    if (!academicData) return;

    // Students dropdown with clean EduTrack institutional IDs
    const stuSelect = document.getElementById('loginStudentSelect');
    if (stuSelect && academicData.students) {
        stuSelect.innerHTML = '';
        academicData.students.forEach((s, idx) => {
            const studentId = `ET-2026-${1001 + idx}`;
            s.institutionalId = studentId;
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = `${studentId} — ${s.name} (${s.major})`;
            stuSelect.appendChild(opt);
        });
        if (academicData.students.length > 0) {
            onStudentSelectChange(academicData.students[0].id);
        }
    }

    // Faculty dropdown
    const facSelect = document.getElementById('loginFacultySelect');
    if (facSelect && academicData.faculty) {
        facSelect.innerHTML = '';
        academicData.faculty.forEach((f, idx) => {
            const facultyId = `FAC-2026-${101 + idx}`;
            f.institutionalId = facultyId;
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = `Prof. ${f.name} — ${f.dept} (Max Load: ${f.maxLoad})`;
            facSelect.appendChild(opt);
        });
        if (academicData.faculty.length > 0) {
            onFacultySelectChange(academicData.faculty[0].id);
        }
    }
}

// ==============================================================
// 1. AUTHENTICATION & LOGIN LOGIC
// ==============================================================

function selectLoginRole(role) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form-view').forEach(view => view.classList.add('hidden'));

    if (role === 'student') {
        document.getElementById('tabStudent').classList.add('active');
        document.getElementById('formViewStudent').classList.remove('hidden');
    } else if (role === 'faculty') {
        document.getElementById('tabFaculty').classList.add('active');
        document.getElementById('formViewFaculty').classList.remove('hidden');
    } else if (role === 'dean') {
        document.getElementById('tabDean').classList.add('active');
        document.getElementById('formViewDean').classList.remove('hidden');
    }
}

function onStudentSelectChange(studentId) {
    if (!academicData || !academicData.students) return;
    const s = academicData.students.find(stu => stu.id === studentId);
    if (!s) return;

    document.getElementById('prevStuName').textContent = s.name;
    document.getElementById('prevStuMajor').textContent = `B.S. ${s.major} • ${s.podId}`;
    document.getElementById('prevStuIdTag').textContent = `ID: ${s.institutionalId || 'ET-2026-1001'}`;
    document.getElementById('prevStuGpa').textContent = s.gpa.toFixed(2);
    const initials = s.name.split(' ').map(n => n[0]).join('');
    document.getElementById('prevStuAvatar').textContent = initials;
}

function onFacultySelectChange(facId) {
    if (!academicData || !academicData.faculty) return;
    const f = academicData.faculty.find(fac => fac.id === facId);
    if (!f) return;

    document.getElementById('prevFacName').textContent = 'Prof. ' + f.name;
    document.getElementById('prevFacDept').textContent = 'Dept of ' + f.dept;
    document.getElementById('prevFacCourses').textContent = 'Qualified: ' + f.qualified.join(', ');
    document.getElementById('prevFacLoad').textContent = f.maxLoad;
    const initials = f.name.split(' ').map(n => n[0]).join('');
    document.getElementById('prevFacAvatar').textContent = initials;
}

function submitLogin(role) {
    if (role === 'student') {
        const stuId = document.getElementById('loginStudentSelect').value;
        const s = academicData ? academicData.students.find(x => x.id === stuId) : null;
        currentSession = {
            role: 'student',
            id: stuId,
            user: s || { id: 'STU-1001', institutionalId: 'ET-2026-1001', name: 'Nova Vance', major: 'Astrophysical Mechanics', gpa: 9.85, credits: 78, podId: 'POD-ALPHA' }
        };
    } else if (role === 'faculty') {
        const facId = document.getElementById('loginFacultySelect').value;
        const f = academicData ? academicData.faculty.find(x => x.id === facId) : null;
        currentSession = {
            role: 'faculty',
            id: facId,
            user: f || { id: 'FAC-01', institutionalId: 'FAC-2026-101', name: 'Elena Rostova', dept: 'Gravitational Physics', maxLoad: 3, qualified: ['GRAV-404', 'ASTRO-301'] }
        };
    } else if (role === 'dean') {
        currentSession = {
            role: 'dean',
            id: 'DEAN-01',
            user: { id: 'DEAN-01', institutionalId: 'ET-DEAN-EXEC', name: 'Dr. Arthur Vance', role: 'Dean of Academic Affairs & Registrar' }
        };
    }

    // Transition from Login Screen to Dashboard
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');

    setupDashboardForSession();
}

function logout() {
    currentSession = null;
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

function switchAccountPrompt() {
    if (confirm("Sign out and return to institutional login portal?")) {
        logout();
    }
}

// ==============================================================
// 2. DASHBOARD VIEW INITIALIZATION & ROLE SEPARATION
// ==============================================================

function setupDashboardForSession() {
    if (!currentSession) return;

    const navAvatar = document.getElementById('navAvatarInitials');
    const navBadgeId = document.getElementById('navUserBadgeId');
    const navCaption = document.getElementById('navRoleCaption');

    // Hide all role workspaces
    document.getElementById('workspaceStudent').classList.add('hidden');
    document.getElementById('workspaceFaculty').classList.add('hidden');
    document.getElementById('workspaceDean').classList.add('hidden');

    const sidebarMenu = document.getElementById('sidebarNavMenu');
    sidebarMenu.innerHTML = '';

    if (currentSession.role === 'student') {
        const s = currentSession.user;
        const instId = s.institutionalId || 'ET-2026-1001';
        const initials = s.name.split(' ').map(n => n[0]).join('');

        navAvatar.textContent = initials;
        navBadgeId.textContent = instId;
        navCaption.textContent = 'STUDENT ACADEMIC PORTAL';

        // Show ONLY Student Workspace
        const wsStudent = document.getElementById('workspaceStudent');
        wsStudent.classList.remove('hidden');

        document.getElementById('stuHeroName').textContent = `Welcome, ${s.name}`;
        document.getElementById('stuHeroSub').textContent = `B.S. ${s.major} • Semester VI • ${s.podId}`;
        document.getElementById('stuKpiCredits').textContent = `${s.credits} / 120`;
        document.getElementById('stuKpiGpa').textContent = `${s.gpa.toFixed(2)} / 10.0`;
        document.getElementById('stuKpiHonors').textContent = s.gpa >= 9.5 ? 'Highest Distinction (Top Honors)' : (s.gpa >= 8.5 ? 'First Class Distinction' : 'Academic Standing');

        // Build Student Sidebar Navigation
        sidebarMenu.innerHTML = `
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link active" onclick="switchNavSection('home', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🏠</span><span>Overview</span></div></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('courses', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📚</span><span>Courses & Catalog</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('activities', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🎯</span><span>Academic Activities</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('submissions', this)"><div class="nav-menu-link-inner"><span class="nav-icon">✍️</span><span>Assignments & Pre-Screen</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('exams', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📑</span><span>Exam Records & Tickets</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('resources', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📖</span><span>Learning Resources</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('schedule', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🗓️</span><span>Schedules & Allocations</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('telemetry', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📡</span><span>Continuous Activity Feed</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('cgpa', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📊</span><span>CGPA & Rank (10 Scale)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="sidebar-separator"></li>
            <li class="sidebar-heading" style="padding:10px 16px 4px; font-size:11px; font-weight:700; color:var(--ts-text-secondary); text-transform:uppercase; letter-spacing:0.5px;">ALGORITHM INTELLIGENCE</li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m1', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔍</span><span>String Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m2', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📜</span><span>Document Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m3', this)"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>Optimization Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m4', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🌊</span><span>Network Flow</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m5', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧩</span><span>Complexity Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m6', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📊</span><span>Parallel &amp; Randomized</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoExplorer(this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧭</span><span>Algorithm Explorer (28)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="toggleDsaMatrix()"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>24 DSA Architecture</span></div></a></li>
            <li class="sidebar-separator"></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>
        `;

        renderEnrolledCoursesForStudent(s.id);
        renderAllCoursesCatalog();
        renderAcademicActivities();
        renderAssignmentsRecords();
        renderExamRecords();
        renderLearningResources();
        renderWeeklyTimetable();
        renderResourceAllocations();
        renderActivityStream();
        loadStudentLeaderboard();

    } else if (currentSession.role === 'faculty') {
        const f = currentSession.user;
        const initials = f.name.split(' ').map(n => n[0]).join('');
        const instId = f.institutionalId || 'FAC-2026-101';

        navAvatar.textContent = initials;
        navBadgeId.textContent = instId;
        navCaption.textContent = 'FACULTY ACADEMIC PORTAL';

        // Show ONLY Faculty Workspace
        const wsFaculty = document.getElementById('workspaceFaculty');
        wsFaculty.classList.remove('hidden');

        document.getElementById('facHeroName').textContent = `Welcome, Prof. ${f.name}`;
        document.getElementById('facHeroSub').textContent = `Department of ${f.dept} • Certified Faculty Instructor`;
        document.getElementById('facKpiLoad').textContent = `${f.maxLoad} Assigned / ${f.maxLoad} Max`;

        // Build Faculty Sidebar Navigation
        sidebarMenu.innerHTML = `
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link active" onclick="switchNavSection('home', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🏠</span><span>Faculty Overview</span></div></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('fac-matching', this)"><div class="nav-menu-link-inner"><span class="nav-icon">👨‍🏫</span><span>Teaching Allocations</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('fac-audit', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🛡️</span><span>Plagiarism & Collusion Audit</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('fac-roster', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📋</span><span>Scholar Gradebook</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('fac-research', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔬</span><span>Staffing Duality & Coverage</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="sidebar-separator"></li>
            <li class="sidebar-heading" style="padding:10px 16px 4px; font-size:11px; font-weight:700; color:var(--ts-text-secondary); text-transform:uppercase; letter-spacing:0.5px;">ALGORITHM INTELLIGENCE</li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m1', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔍</span><span>String Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m2', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📜</span><span>Document Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m3', this)"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>Optimization Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m4', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🌊</span><span>Network Flow</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m5', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧩</span><span>Complexity Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m6', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📊</span><span>Parallel &amp; Randomized</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoExplorer(this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧭</span><span>Algorithm Explorer (28)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="toggleDsaMatrix()"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>24 DSA Architecture</span></div></a></li>
            <li class="sidebar-separator"></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>
        `;

        loadFacultyMatchingAnalysis();
        loadFacultyStudentRoster();

    } else if (currentSession.role === 'dean') {
        navAvatar.textContent = 'AV';
        navBadgeId.textContent = 'ET-DEAN-EXEC';
        navCaption.textContent = 'REGISTRAR & DEAN GOVERNANCE';

        // Show ONLY Dean Workspace
        const wsDean = document.getElementById('workspaceDean');
        wsDean.classList.remove('hidden');

        // Build Dean Sidebar Navigation
        sidebarMenu.innerHTML = `
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link active" onclick="switchNavSection('home', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🏠</span><span>Governance Command</span></div></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('dean-sat', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📑</span><span>SAT Exam Timetabling</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('dean-transit', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🌊</span><span>Corridor Transit Flux</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('dean-pod-tour', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🗺️</span><span>Facility Inspection Tour</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('dean-parallel', this)"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>Parallel Analytics Engine</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="switchNavSection('dean-census', this)"><div class="nav-menu-link-inner"><span class="nav-icon">👥</span><span>Campus Faculty Census</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="sidebar-separator"></li>
            <li class="sidebar-heading" style="padding:10px 16px 4px; font-size:11px; font-weight:700; color:var(--ts-text-secondary); text-transform:uppercase; letter-spacing:0.5px;">ALGORITHM INTELLIGENCE</li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m1', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔍</span><span>String Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m2', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📜</span><span>Document Intelligence</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m3', this)"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>Optimization Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m4', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🌊</span><span>Network Flow</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m5', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧩</span><span>Complexity Lab</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoModule('m6', this)"><div class="nav-menu-link-inner"><span class="nav-icon">📊</span><span>Parallel &amp; Randomized</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="openAlgoExplorer(this)"><div class="nav-menu-link-inner"><span class="nav-icon">🧭</span><span>Algorithm Explorer (28)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="toggleDsaMatrix()"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>24 DSA Architecture</span></div></a></li>
            <li class="sidebar-separator"></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>
        `;

        solveDeanExamTimetable();
        loadDeanCampusFlow();
        optimizeDeanPodTour();
        loadDeanParallelAnalytics();
        loadDeanFacultyCensus();
    }
}

// Toggle Sidebar Collapse (☰)

// Direct Algorithm Module & Explorer Navigation
function openAlgoModule(modId, el) {
    switchNavSection('algo-lab', el);
    if (window.AlgoStudio) {
        if (!AlgoStudio._initialized) {
            AlgoStudio.init();
        }
        AlgoStudio.selectModule(modId);
    }
}

function openAlgoExplorer(el) {
    switchNavSection('algo-lab', el);
    if (window.AlgoStudio) {
        if (!AlgoStudio._initialized) {
            AlgoStudio.init();
        }
        AlgoStudio.selectModule('explorer');
    }
}

function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
}

// Navigation Section Switcher
function switchNavSection(secId, el) {
    if (el) {
        document.querySelectorAll('.nav-menu-link').forEach(l => l.classList.remove('active'));
        el.classList.add('active');
    }

    if (secId === 'algo-lab') {
        // Hide role workspaces and reveal workspaceAlgoLab
        document.getElementById('workspaceStudent')?.classList.add('hidden');
        document.getElementById('workspaceFaculty')?.classList.add('hidden');
        document.getElementById('workspaceDean')?.classList.add('hidden');
        const lab = document.getElementById('workspaceAlgoLab');
        if (lab) {
            lab.classList.remove('hidden');
            lab.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.AlgoStudio && typeof AlgoStudio.init === 'function') {
                if (!AlgoStudio._initialized) {
                    AlgoStudio.init();
                    AlgoStudio._initialized = true;
                }
            }
        }
        return;
    }

    // Returning to role workspace
    document.getElementById('workspaceAlgoLab')?.classList.add('hidden');
    if (currentSession) {
        if (currentSession.role === 'student') document.getElementById('workspaceStudent')?.classList.remove('hidden');
        else if (currentSession.role === 'faculty') document.getElementById('workspaceFaculty')?.classList.remove('hidden');
        else if (currentSession.role === 'dean') document.getElementById('workspaceDean')?.classList.remove('hidden');
    }

    if (secId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const sec = document.getElementById('section-' + secId);
    if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==============================================================
// 3. STUDENT WORKSPACE DATA & ACTIONS
// ==============================================================

function renderEnrolledCoursesForStudent(studentId) {
    if (!academicData) return;
    const tbody = document.getElementById('studentCoursesBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let enrolled = [];
    if (studentId === 'STU-1001') {
        enrolled = academicData.courses.filter(c => c.code === 'ASTRO-301' || c.code === 'GRAV-404' || c.code === 'ORBIT-205' || c.code === 'THERMO-380');
    } else if (studentId === 'STU-1002') {
        enrolled = academicData.courses.filter(c => c.code === 'ASTRO-301' || c.code === 'GRAV-404' || c.code === 'COSMO-420');
    } else if (studentId === 'STU-1003') {
        enrolled = academicData.courses.filter(c => c.code === 'QUANT-502' || c.code === 'EXO-530');
    } else if (studentId === 'STU-1004') {
        enrolled = academicData.courses.filter(c => c.code === 'ASTRO-301' || c.code === 'GRAV-404' || c.code === 'ORBIT-205' || c.code === 'EXO-530');
    } else if (studentId === 'STU-1005') {
        enrolled = academicData.courses.filter(c => c.code === 'AI-610' || c.code === 'NEURO-315');
    } else {
        enrolled = academicData.courses.slice(0, 3);
    }

    enrolled.forEach(c => {
        const tr = document.createElement('tr');
        const podMap = {
            'ASTRO-301': 'Pod-Alpha (Graviton Hall)',
            'GRAV-404': 'Pod-Delta (Dynamics Lab)',
            'QUANT-502': 'Pod-Beta (Quantum Sim)',
            'ORBIT-205': 'Pod-Gamma (Astrogation)',
            'AI-610': 'Pod-Beta (Swarm Center)',
            'COSMO-420': 'Pod-Delta (Plasma Chamber)',
            'NEURO-315': 'Pod-Epsilon (Bio-Dome)',
            'EXO-530': 'Pod-Gamma (Zenith Pod)',
            'ROBO-440': 'Pod-Beta (Robotics Bay)',
            'THERMO-380': 'Pod-Alpha (Cryo Center)'
        };
        const podName = podMap[c.code] || 'Pod-Alpha';
        tr.innerHTML = `
            <td><span class="code-pill">${c.code}</span></td>
            <td><strong>${c.title}</strong></td>
            <td>${c.credits} Credits</td>
            <td>${podName}</td>
            <td>Exam Slot ${c.examSlot}</td>
            <td><span class="status-pill success">Enrolled</span></td>
            <td><button class="btn-table-action" onclick="alert('Viewing syllabus outline & learning resources for ' + '${c.code}')">View Syllabus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAllCoursesCatalog() {
    if (!academicData || !academicData.courses) return;
    const tbody = document.getElementById('allCoursesCatalogBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const podTypeMap = {
        'THEORY': 'Graviton Theory Hall',
        'GRAVITY_LAB': 'Drifting Dynamics Lab',
        'QUANTUM_SIM': 'Quantum Simulation Lab',
        'ASTRONAV': 'Zenith Astrogation Pod'
    };

    academicData.courses.forEach(c => {
        const tr = document.createElement('tr');
        const podDesc = podTypeMap[c.podType] || c.podType;
        const isEnrolled = (currentSession && currentSession.role === 'student' && 
            (c.code === 'ASTRO-301' || c.code === 'GRAV-404' || c.code === 'ORBIT-205' || c.code === 'THERMO-380'));
        tr.innerHTML = `
            <td><span class="code-pill">${c.code}</span></td>
            <td><strong>${c.title}</strong></td>
            <td>${c.credits} Credits</td>
            <td>${podDesc}</td>
            <td>Slot ${c.examSlot} (SAT Scheduled)</td>
            <td><span style="font-family:var(--font-code); font-weight:600;">${c.enrolledCount} Scholars</span></td>
            <td>${isEnrolled ? '<span class="status-pill success">Enrolled</span>' : '<button class="btn-table-action" onclick="enrollInCourse(\'' + c.code + '\')">Register Course</button>'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAcademicActivities() {
    if (!academicData || !academicData.activities) return;
    const container = document.getElementById('activitiesContainer');
    if (!container) return;
    container.innerHTML = '';

    const catClasses = {
        'PRACTICUM': 'cat-practicum',
        'HACKATHON': 'cat-hackathon',
        'SYMPOSIUM': 'cat-symposium',
        'FIELD_TRIAL': 'cat-trial',
        'WORKSHOP': 'cat-workshop'
    };

    academicData.activities.forEach(act => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        const catClass = catClasses[act.category] || 'cat-symposium';
        const pct = Math.round((act.enrolled / act.capacity) * 100);
        card.innerHTML = `
            <div>
                <div class="activity-top-row">
                    <span class="activity-category-pill ${catClass}">${act.category.replace('_', ' ')}</span>
                    <span style="font-size:11px; font-weight:700; color:var(--brand-primary); background:var(--brand-light); padding:2px 7px; border-radius:12px;">+${act.credits} Cr</span>
                </div>
                <div class="activity-title">${act.title}</div>
                <div class="activity-meta-list">
                    <div class="activity-meta-item"><span>👨‍🏫</span> <span>Host: ${act.host}</span></div>
                    <div class="activity-meta-item"><span>📅</span> <span>${act.date} &bull; ${act.time}</span></div>
                    <div class="activity-meta-item"><span>📍</span> <span>${act.pod}</span></div>
                    <div class="activity-meta-item"><span>👥</span> <span>Enrolled: ${act.enrolled} / ${act.capacity} scholars (${pct}%)</span></div>
                </div>
            </div>
            <div class="activity-footer-row">
                <span class="status-pill ${act.status === 'ACTIVE' ? 'success' : ''}">${act.status}</span>
                <button class="btn-table-action" onclick="enrollInActivity('${act.id}', '${act.title.replace(/'/g, "\\'")}')">Register Slot &rarr;</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderAssignmentsRecords() {
    if (!academicData || !academicData.assignments) return;
    const tbody = document.getElementById('assignmentsRecordBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    academicData.assignments.forEach(a => {
        const tr = document.createElement('tr');
        const isGraded = a.status === 'GRADED';
        const statusBadge = isGraded ? '<span class="status-pill success">Graded</span>' :
            (a.status === 'UNDER_REVIEW' ? '<span class="status-pill warning">Under Review</span>' : '<span class="status-pill">Submitted</span>');
        const scoreText = isGraded ? `<strong>${a.score.toFixed(1)}</strong> / 100 <span style="font-size:11px; color:var(--brand-primary); font-weight:700;">(${(a.score / 10).toFixed(2)} / 10)</span>` : '<span style="color:var(--text-muted);">Pending</span>';
        const similarityBadge = isGraded ? `<span style="font-family:var(--font-code); color:${a.similarity > 5 ? 'var(--color-amber)' : 'var(--color-emerald)'}; font-weight:600;">${a.similarity}%</span>` : '<span style="color:var(--text-muted);">&mdash;</span>';

        tr.innerHTML = `
            <td><span class="code-pill">${a.id}</span></td>
            <td><strong>${a.courseCode}</strong></td>
            <td>${a.title}</td>
            <td>${a.dueDate || '2026-10-15'}</td>
            <td>${a.weightage || 25}%</td>
            <td>${scoreText}</td>
            <td>${similarityBadge}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderExamRecords() {
    if (!academicData || !academicData.examRecords) return;
    const tbody = document.getElementById('examTimetableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    academicData.examRecords.forEach(ex => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="code-pill">${ex.examCode}</span></td>
            <td><strong>${ex.courseCode}</strong> &bull; ${ex.courseTitle}</td>
            <td>${ex.date}</td>
            <td>${ex.timeSlot}</td>
            <td>${ex.hallPod}</td>
            <td><strong style="color:var(--brand-primary);">${ex.seat}</strong></td>
            <td><span class="status-pill success">✓ SAT Conflict-Free</span></td>
            <td><span style="font-family:var(--font-code); font-size:11px; color:var(--text-muted); background:#f1f5f9; padding:2px 6px; border-radius:4px;">${ex.cryptoToken}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLearningResources() {
    if (!academicData || !academicData.learningResources) return;
    const container = document.getElementById('learningResourcesContainer');
    if (!container) return;
    container.innerHTML = '';

    const iconMap = {
        'TEXTBOOK': '📕',
        'LAB_MANUAL': '🧪',
        'SLIDES': '📊',
        'PREPRINT': '📄',
        'SYLLABUS': '📋'
    };

    academicData.learningResources.forEach(res => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        const icon = iconMap[res.docType] || '📘';
        const tags = res.keywords.split(',').map(k => `<span class="resource-tag">${k.trim()}</span>`).join('');
        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="resource-type-icon">${icon}</span>
                        <div>
                            <span style="font-size:11px; font-weight:700; color:var(--brand-primary); text-transform:uppercase;">${res.docType} &bull; ${res.courseCode}</span>
                            <div style="font-size:11px; color:var(--text-light);">${res.format} &bull; ${res.wordCount.toLocaleString()} Words</div>
                        </div>
                    </div>
                    <span class="code-pill">${res.id}</span>
                </div>
                <div class="resource-title">${res.title}</div>
                <div style="font-size:11.5px; color:var(--brand-accent); font-weight:600; margin-bottom:6px;">Author: ${res.author}</div>
                <div class="resource-abstract">${res.abstractSummary}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px;">Indexing: <strong>${res.indexing}</strong></div>
                <div class="resource-tags">${tags}</div>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--border-muted);">
                <button class="btn-table-action" onclick="alert('Accessing digital syllabus and indexed document for ' + '${res.id}')">View Indexed Document</button>
                <button class="btn-table-action" style="background:var(--brand-primary); color:#ffffff; border-color:var(--brand-primary);" onclick="alert('Downloading ${res.format} for ${res.id}')">Download</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderWeeklyTimetable() {
    const tbody = document.getElementById('weeklyTimetableBody');
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td><strong>Morning (09:00 - 11:30)</strong></td>
            <td><div class="schedule-entry-chip"><strong>ASTRO-301</strong>Relativistic Celestial Mechanics<br>Pod-Alpha &bull; Prof. Rostova</div></td>
            <td><div class="schedule-entry-chip"><strong>QUANT-502</strong>Quantum Entanglement<br>Pod-Beta &bull; Prof. Sterling</div></td>
            <td><div class="schedule-entry-chip"><strong>ASTRO-301</strong>Tensor Calculations Lab<br>Pod-Alpha &bull; Prof. Rostova</div></td>
            <td><div class="schedule-entry-chip"><strong>THERMO-380</strong>Cryogenic Thermodynamics<br>Pod-Alpha &bull; Prof. Caldwell</div></td>
            <td><div class="schedule-entry-chip"><strong>QUANT-502</strong>Informatics Seminar<br>Pod-Beta &bull; Prof. Sterling</div></td>
        </tr>
        <tr>
            <td><strong>Midday (13:00 - 15:30)</strong></td>
            <td><div class="schedule-entry-chip"><strong>GRAV-404</strong>Antigravity Propulsion<br>Pod-Delta &bull; Prof. Caldwell</div></td>
            <td><div class="schedule-entry-chip"><strong>ORBIT-205</strong>Orbital Dynamics & Docking<br>Pod-Gamma &bull; Prof. Vance</div></td>
            <td><div class="schedule-entry-chip"><strong>GRAV-404</strong>Pulse Thruster Practicum<br>Pod-Delta &bull; Prof. Caldwell</div></td>
            <td><div class="schedule-entry-chip"><strong>AI-610</strong>Drone Swarm Coordination<br>Pod-Beta &bull; Prof. Sterling</div></td>
            <td><div class="schedule-entry-chip"><strong>ORBIT-205</strong>Simulated Spacecraft Docking<br>Pod-Gamma &bull; Prof. Vance</div></td>
        </tr>
        <tr>
            <td><strong>Afternoon (16:00 - 18:00)</strong></td>
            <td><div class="schedule-entry-chip" style="border-left-color:var(--color-emerald); background:var(--color-emerald-bg);"><strong>ACT-01</strong>Zero-G Practicum<br>Pod-Delta &bull; Optional Cr</div></td>
            <td><div class="schedule-entry-chip"><strong>COSMO-420</strong>Plasma Magnetohydrodynamics<br>Pod-Delta &bull; Prof. Rostova</div></td>
            <td><div class="schedule-entry-chip" style="border-left-color:var(--color-violet); background:var(--color-violet-bg);"><strong>FAC-OFFICE</strong>Academic Office Hours<br>Faculty Pod Concourse</div></td>
            <td><div class="schedule-entry-chip"><strong>EXO-530</strong>Atmospheric Geo-Engineering<br>Pod-Epsilon &bull; Dr. Finch</div></td>
            <td><div class="schedule-entry-chip" style="border-left-color:var(--color-amber); background:var(--color-amber-bg);"><strong>ACT-02</strong>Quantum Hackathon Prep<br>Pod-Beta &bull; Open Lab</div></td>
        </tr>
    `;
}

function renderResourceAllocations() {
    if (!academicData || !academicData.pods) return;
    const tbody = document.getElementById('resourceAllocationsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    academicData.pods.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="code-pill">${p.id}</span></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="status-pill">${p.type}</span></td>
            <td><strong>${p.capacity}</strong> Seats</td>
            <td><span style="font-family:var(--font-code); font-weight:600; color:var(--brand-primary);">${p.gravity.toFixed(2)} G</span></td>
            <td>${p.power} kW Units</td>
            <td><span class="status-pill success">Dinic Optimal Flow</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderActivityStream() {
    if (!academicData || !academicData.continuousActivityLogs) return;
    const container = document.getElementById('activityStreamContainer');
    if (!container) return;
    container.innerHTML = '';

    const iconMap = {
        'POD_CHECKIN': '🚪',
        'LIBRARY_ACCESS': '📚',
        'ASSIGNMENT_SUBMISSION': '📝',
        'EXAM_VERIFY': '🛡️',
        'TELEMETRY_STREAM': '📡',
        'ACTIVITY_ENROLL': '🎯'
    };

    academicData.continuousActivityLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'stream-event-item';
        const icon = iconMap[log.actionType] || '⚡';
        const dateStr = new Date(log.timestamp).toLocaleTimeString();
        item.innerHTML = `
            <div class="stream-avatar-node">${icon}</div>
            <div class="stream-content-wrap">
                <div class="stream-header-line">
                    <span class="stream-student-name">${log.studentName} <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">(${log.studentId})</span></span>
                    <span class="stream-timestamp">${dateStr}</span>
                </div>
                <div class="stream-desc-text">${log.description}</div>
                <div>
                    <span class="stream-telemetry-badge">📍 ${log.locationPod} &bull; G: ${log.microGravity.toFixed(3)} G &bull; CogLoad: ${log.cognitiveLoad.toFixed(2)}</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function enrollInActivity(actId, actTitle) {
    alert("Enrolled successfully in " + actTitle + " (" + actId + ")! Supplementary credits recorded.");
}

function enrollInCourse(courseCode) {
    alert("Course registration submitted for " + courseCode + ". DPLL SAT solver verifying conflict-free timetable.");
}

let searchDebounce = null;
async function handleSmartSearch(query) {
    clearTimeout(searchDebounce);
    if (!query || query.trim().length === 0) {
        document.getElementById('searchResultsContainer').innerHTML = '<div style="color:var(--text-muted); font-size:12.5px;">Search results with exact KMP match indices and academic tags will appear here.</div>';
        document.getElementById('searchCorrectionNotice').classList.add('hidden');
        return;
    }

    searchDebounce = setTimeout(async () => {
        try {
            const res = await fetch(`/api/smart-search?q=${encodeURIComponent(query.trim())}`);
            if (res.ok) {
                const data = await res.json();
                renderSearchResults(data);
            }
        } catch (e) {
            console.error('Search error:', e);
        }
    }, 200);
}

function renderSearchResults(data) {
    const notice = document.getElementById('searchCorrectionNotice');
    const container = document.getElementById('searchResultsContainer');

    if (data.editDistance > 0 && data.suggestedCorrection && data.suggestedCorrection.toLowerCase() !== data.query.toLowerCase()) {
        notice.classList.remove('hidden');
        document.getElementById('suggestedKeyword').textContent = data.suggestedCorrection;
    } else {
        notice.classList.add('hidden');
    }

    container.innerHTML = '';
    if (data.courseMatches && data.courseMatches.length > 0) {
        data.courseMatches.forEach(c => {
            const card = document.createElement('div');
            card.className = 'search-hit-item';
            let tagHtml = '';
            if (data.detectedKeywords && data.detectedKeywords.length > 0) {
                tagHtml = data.detectedKeywords.map(k => `<span class="code-pill" style="background:#e0e7ff; color:#3730a3;">${k}</span>`).join(' ');
            }
            card.innerHTML = `
                <div>
                    <h4 style="font-size:13.5px;"><span class="code-pill">${c.code}</span> ${c.title}</h4>
                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
                        KMP Match Indices: <code>${JSON.stringify(c.indices)}</code> &bull; ${tagHtml}
                    </div>
                </div>
                <button class="btn-table-action" onclick="alert('Viewing syllabus outline for ${c.code}')">Download Outline</button>
            `;
            container.appendChild(card);
        });
    } else {
        container.innerHTML = `<div style="color:var(--text-muted); font-size:12.5px;">No direct course title matched '${data.query}'. Try searching for keywords like 'mechanics', 'antigravity', or 'quantum'.</div>`;
    }
}

// ==============================================================
// TOP GLOBAL SEARCH CONTROLLER (Typo-Tolerant, Multi-Source)
// ==============================================================
// UNIVERSAL ROLE-AWARE PLATFORM SEARCH CONTROLLER
// (Adapts dynamically to Student, Faculty, and Dean / Admin)
// ==============================================================
let headerSearchDebounce = null;
let currentSearchQuery = '';
let currentSearchFilter = 'all'; // 'all', 'actions', 'algos', 'courses', 'people', 'records', 'tools'
let selectedSearchRowIndex = -1;

function highlightSearchMatch(text, query) {
    if (!text || !query) return text || '';
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(245,158,11,0.22); color:inherit; font-weight:700; border-radius:2px; padding:0 2px;">$1</mark>');
}

function getActiveRoleContext() {
    const role = (window.currentSession && window.currentSession.role) ? window.currentSession.role : 'student';
    const user = window.currentSession ? window.currentSession.user : null;
    let label = '🎓 Student Portal';
    let sub = user ? `${user.name} (${user.institutionalId || user.id})` : 'Nova Vance (ET-2026-1001)';
    let badgeClass = 'cat-symposium';

    if (role === 'faculty') {
        label = '👩‍🏫 Faculty Workspace';
        sub = user ? `Prof. ${user.name} (${user.dept || 'Academic Dept'})` : 'Prof. Elena Rostova';
        badgeClass = 'cat-practicum';
    } else if (role === 'dean') {
        label = '🏛️ Registrar & Dean Center';
        sub = 'Dr. Arthur Vance (Office of Academic Governance)';
        badgeClass = 'cat-hackathon';
    }

    return { role, user, label, sub, badgeClass };
}

function onHeaderSearch(query) {
    currentSearchQuery = query;
    const clearBtn = document.getElementById('headerSearchClearBtn');
    if (clearBtn) {
        if (query && query.trim().length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    clearTimeout(headerSearchDebounce);
    if (!query || query.trim().length === 0) {
        showSearchSuggestions();
        return;
    }

    headerSearchDebounce = setTimeout(() => {
        executeGlobalSearch(query.trim());
    }, 100);
}

function onHeaderSearchFocus() {
    const input = document.getElementById('headerGlobalSearch');
    const val = input ? input.value.trim() : '';
    if (val.length > 0) {
        executeGlobalSearch(val);
    } else {
        showSearchSuggestions();
    }
}

function clearHeaderSearch() {
    const input = document.getElementById('headerGlobalSearch');
    const clearBtn = document.getElementById('headerSearchClearBtn');
    if (input) {
        input.value = '';
        input.focus();
    }
    if (clearBtn) clearBtn.classList.add('hidden');
    currentSearchQuery = '';
    showSearchSuggestions();
}

function hideSearchDropdown() {
    const dropdown = document.getElementById('headerSearchDropdown');
    if (dropdown) dropdown.classList.add('hidden');
    selectedSearchRowIndex = -1;
}

function setSearchFilter(filterName, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    currentSearchFilter = filterName;
    const input = document.getElementById('headerGlobalSearch');
    if (input && input.value.trim().length > 0) {
        executeGlobalSearch(input.value.trim());
    } else {
        showSearchSuggestions();
    }
    if (input) input.focus();
}

function onHeaderSearchKeydown(e) {
    const dropdown = document.getElementById('headerSearchDropdown');
    if (!dropdown || dropdown.classList.contains('hidden')) return;

    const rows = dropdown.querySelectorAll('.search-result-row');
    if (rows.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSearchRowIndex++;
        if (selectedSearchRowIndex >= rows.length) selectedSearchRowIndex = 0;
        updateSelectedSearchRow(rows);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSearchRowIndex--;
        if (selectedSearchRowIndex < 0) selectedSearchRowIndex = rows.length - 1;
        updateSelectedSearchRow(rows);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSearchRowIndex >= 0 && selectedSearchRowIndex < rows.length) {
            rows[selectedSearchRowIndex].click();
        } else if (rows.length > 0) {
            rows[0].click();
        }
    } else if (e.key === 'Escape') {
        hideSearchDropdown();
        e.target.blur();
    }
}

function updateSelectedSearchRow(rows) {
    rows.forEach((r, idx) => {
        if (idx === selectedSearchRowIndex) {
            r.classList.add('selected');
            r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            r.classList.remove('selected');
        }
    });
}

function applySearchCorrection(correctedTerm) {
    const input = document.getElementById('headerGlobalSearch');
    if (input) {
        input.value = correctedTerm;
        onHeaderSearch(correctedTerm);
        input.focus();
    }
}

// -----------------------------------------------------------------------------
// Search Suggestions (Rendered when input is focused with no query)
// -----------------------------------------------------------------------------
function showSearchSuggestions() {
    const dropdown = document.getElementById('headerSearchDropdown');
    if (!dropdown) return;

    const { role, label, sub } = getActiveRoleContext();

    let roleActionsHtml = '';
    if (role === 'student') {
        roleActionsHtml = `
            <div class="search-category-header"><span>🎓 Suggested For You &bull; Student Quick Actions</span></div>
            <div class="search-result-row" onclick="switchNavSection('courses'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#eff6ff; color:#2563eb;">📚</span>
                    <div class="search-row-content">
                        <span class="search-row-title">My Enrolled Courses &amp; Pod Allocations</span>
                        <span class="search-row-sub">View current semester schedule, credits &amp; syllabi outline</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#dbeafe; color:#1d4ed8;">MY COURSES</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('submissions'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">✍️</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Submit Assignment &amp; Plagiarism Pre-Screen</span>
                        <span class="search-row-sub">Upload academic text &amp; analyze originality via Suffix Arrays &amp; Kasai LCP</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">ASSIGNMENT</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('exams'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">📑</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Exam Records &amp; Hall Tickets</span>
                        <span class="search-row-sub">SAT conflict-free seating, pod locations &amp; verification tokens</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#d1fae5; color:#047857;">EXAM TICKET</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('cgpa'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#fffbeb; color:#d97706;">📊</span>
                    <div class="search-row-content">
                        <span class="search-row-title">CGPA Transcript &amp; Class Rank (10.0 Scale)</span>
                        <span class="search-row-sub">Track academic honors, letter grades &amp; semester performance</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#fef3c7; color:#b45309;">TRANSCRIPT</span>
            </div>
        `;
    } else if (role === 'faculty') {
        roleActionsHtml = `
            <div class="search-category-header"><span>👩‍🏫 Suggested For You &bull; Faculty Quick Tools</span></div>
            <div class="search-result-row" onclick="switchNavSection('fac-matching'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">👨‍🏫</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Teaching Allocations &amp; Course Load</span>
                        <span class="search-row-sub">Bipartite matching &amp; Ford-Fulkerson network flow for teaching assignments</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#d1fae5; color:#047857;">ALLOCATION</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('fac-audit'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#eff6ff; color:#2563eb;">🛡️</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Plagiarism &amp; Collusion Multi-Doc Audit</span>
                        <span class="search-row-sub">Cross-examine student assignment corpus with Suffix Arrays &amp; Z-Algorithm</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#dbeafe; color:#1d4ed8;">AUDIT LAB</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('fac-roster'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">📋</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Scholar Gradebook &amp; Student Roster</span>
                        <span class="search-row-sub">Inspect enrolled students, individual GPA standing &amp; coursework submission</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">GRADEBOOK</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('fac-research'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#fffbeb; color:#d97706;">🔬</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Staffing Duality &amp; Coverage (König's Theorem)</span>
                        <span class="search-row-sub">Mathematical verification that max match equals min vertex cover</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#fef3c7; color:#b45309;">KÖNIG DUAL</span>
            </div>
        `;
    } else if (role === 'dean') {
        roleActionsHtml = `
            <div class="search-category-header"><span>🏛️ Suggested For You &bull; Executive Governance</span></div>
            <div class="search-result-row" onclick="switchNavSection('dean-sat'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#fffbeb; color:#d97706;">📑</span>
                    <div class="search-row-content">
                        <span class="search-row-title">SAT Exam Timetabling &amp; Conflict Resolution</span>
                        <span class="search-row-sub">DPLL conflict-driven solver generating 100% overlap-free exam slots</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#fef3c7; color:#b45309;">DPLL SAT</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('dean-transit'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#eff6ff; color:#2563eb;">🌊</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Campus Corridor Transit Flux Optimization</span>
                        <span class="search-row-sub">Dinic blocking flow &amp; Edmonds-Karp capacity scaling across pods</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#dbeafe; color:#1d4ed8;">FLOW MATRIX</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('dean-pod-tour'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">🗺️</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Facility Inspection Tour &amp; Pod Connectivity</span>
                        <span class="search-row-sub">Optimal traversal route visiting all campus facilities with min distance</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#d1fae5; color:#047857;">POD TOUR</span>
            </div>
            <div class="search-result-row" onclick="switchNavSection('dean-census'); hideSearchDropdown();">
                <div class="search-row-left">
                    <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">👥</span>
                    <div class="search-row-content">
                        <span class="search-row-title">Campus Faculty Census &amp; Department Roster</span>
                        <span class="search-row-sub">Institutional faculty workload equilibrium and department credentials</span>
                    </div>
                </div>
                <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">CENSUS</span>
            </div>
        `;
    }

    dropdown.innerHTML = `
        <div class="search-dropdown-meta-bar">
            <span class="search-active-role-chip">
                <span>🎯 Active Workspace:</span>
                <strong>${label}</strong>
            </span>
            <span style="color:var(--text-muted); font-size:10.5px;">${sub}</span>
        </div>

        <div class="search-filter-pills">
            <button class="search-filter-pill ${currentSearchFilter === 'all' ? 'active' : ''}" onclick="setSearchFilter('all', event)">✨ All Resources</button>
            <button class="search-filter-pill ${currentSearchFilter === 'actions' ? 'active' : ''}" onclick="setSearchFilter('actions', event)">⚡ Dashboard Actions</button>
            <button class="search-filter-pill ${currentSearchFilter === 'algos' ? 'active' : ''}" onclick="setSearchFilter('algos', event)">🔬 24 Algorithms</button>
            <button class="search-filter-pill ${currentSearchFilter === 'courses' ? 'active' : ''}" onclick="setSearchFilter('courses', event)">📚 Courses</button>
            <button class="search-filter-pill ${currentSearchFilter === 'people' ? 'active' : ''}" onclick="setSearchFilter('people', event)">👥 Students &amp; Faculty</button>
            <button class="search-filter-pill ${currentSearchFilter === 'tools' ? 'active' : ''}" onclick="setSearchFilter('tools', event)">⚙️ System Tools</button>
        </div>

        ${roleActionsHtml}

        <div class="search-category-header" style="margin-top:6px;">
            <span>🔬 Universal DSA Algorithm Intelligence (M1–M6)</span>
        </div>
        <div class="search-result-row" onclick="window.openAlgoInLab('kmp'); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#eff6ff; color:#2563eb;">⚡</span>
                <div class="search-row-content">
                    <span class="search-row-title">Knuth-Morris-Pratt (KMP) Prefix Automaton</span>
                    <span class="search-row-sub">Module 1 &bull; O(n+m) Exact String Matching with Pi Failure Function</span>
                </div>
            </div>
            <span class="search-row-pill" style="background:#dbeafe; color:#1d4ed8;">M1 STRING</span>
        </div>
        <div class="search-result-row" onclick="window.openAlgoInLab('suffix_automaton'); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">⚡</span>
                <div class="search-row-content">
                    <span class="search-row-title">Suffix Automaton (SAM / Blumer DAWG)</span>
                    <span class="search-row-sub">Module 2 &bull; Linear-state Substring Indexing &amp; Link Transitions</span>
                </div>
            </div>
            <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">M2 SUFFIX</span>
        </div>
        <div class="search-result-row" onclick="window.openAlgoInLab('bipartite_matching'); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">⚡</span>
                <div class="search-row-content">
                    <span class="search-row-title">Bipartite Matching &amp; König's Theorem</span>
                    <span class="search-row-sub">Module 4 &bull; Max Flow Dual to Min Vertex Cover</span>
                </div>
            </div>
            <span class="search-row-pill" style="background:#d1fae5; color:#047857;">M4 FLOW</span>
        </div>
        <div class="search-result-row" onclick="window.openAlgoInLab('miller_rabin'); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#fffbeb; color:#d97706;">⚡</span>
                <div class="search-row-content">
                    <span class="search-row-title">Miller-Rabin 64-bit Primality Test</span>
                    <span class="search-row-sub">Module 6 &bull; Randomized Modular Exponentiation for Passcode Verification</span>
                </div>
            </div>
            <span class="search-row-pill" style="background:#fef3c7; color:#b45309;">M6 RANDOM</span>
        </div>

        <div class="search-category-header" style="margin-top:6px;">
            <span>⚙️ System Controls &amp; Settings</span>
        </div>
        <div class="search-result-row" onclick="cycleAppTheme(); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#f1f5f9; color:#475569;">🎨</span>
                <div class="search-row-content">
                    <span class="search-row-title">Cycle Color Theme Palette</span>
                    <span class="search-row-sub">Switch between Natural Light, Smooth Dark, and Warm Earth</span>
                </div>
            </div>
            <span class="search-row-pill">THEME</span>
        </div>
        <div class="search-result-row" onclick="toggleDsaMatrix(); hideSearchDropdown();">
            <div class="search-row-left">
                <span class="search-row-icon" style="background:#f1f5f9; color:#475569;">🏛️</span>
                <div class="search-row-content">
                    <span class="search-row-title">Open 24 DSA Architectural Matrix</span>
                    <span class="search-row-sub">Interactive modal mapping modules M1 to M6 to university systems</span>
                </div>
            </div>
            <span class="search-row-pill">ARCH MATRIX</span>
        </div>
    `;

    selectedSearchRowIndex = -1;
    dropdown.classList.remove('hidden');
}

// -----------------------------------------------------------------------------
// Live Search Execution Across All Categories
// -----------------------------------------------------------------------------
async function executeGlobalSearch(query) {
    const dropdown = document.getElementById('headerSearchDropdown');
    if (!dropdown) return;

    const q = query.toLowerCase();
    const { role, label, sub } = getActiveRoleContext();

    // 1. Dashboard Actions & Features Registry (Role-Prioritized)
    const allActions = [
        // Student actions
        { id: 'courses', role: 'student', title: 'Courses & Catalog', sub: 'Course registration, Pod pods, syllabi outline & credits', icon: '📚', tag: 'STUDENT', fn: () => switchNavSection('courses') },
        { id: 'activities', role: 'student', title: 'Academic Activities & Hackathons', sub: 'Register for practicums, symposiums & competitions', icon: '🎯', tag: 'STUDENT', fn: () => switchNavSection('activities') },
        { id: 'submissions', role: 'student', title: 'Assignments & Plagiarism Pre-Screen', sub: 'Upload text and verify originality score before deadline', icon: '✍️', tag: 'STUDENT', fn: () => switchNavSection('submissions') },
        { id: 'exams', role: 'student', title: 'Exam Records & Hall Tickets', sub: 'SAT conflict-free schedule, seat assignment & cryptographic token', icon: '📑', tag: 'STUDENT', fn: () => switchNavSection('exams') },
        { id: 'resources', role: 'student', title: 'Learning Resources & Textbooks', sub: 'Digital library documents, author indexing & abstracts', icon: '📖', tag: 'STUDENT', fn: () => switchNavSection('resources') },
        { id: 'schedule', role: 'student', title: 'Schedules & Allocations', sub: 'Weekly orbital timetable & pod room allocation', icon: '🗓️', tag: 'STUDENT', fn: () => switchNavSection('schedule') },
        { id: 'telemetry', role: 'student', title: 'Continuous Activity Feed', sub: 'Live orbital telemetry, continuous logging & campus pulse', icon: '📡', tag: 'STUDENT', fn: () => switchNavSection('telemetry') },
        { id: 'cgpa', role: 'student', title: 'CGPA & Rank (10 Scale)', sub: 'Official academic transcript, grade breakdown & honors', icon: '📊', tag: 'STUDENT', fn: () => switchNavSection('cgpa') },

        // Faculty actions
        { id: 'fac-matching', role: 'faculty', title: 'Teaching Allocations & Pod Matching', sub: 'Bipartite matching and maximum flow for faculty assignment', icon: '👨‍🏫', tag: 'FACULTY', fn: () => switchNavSection('fac-matching') },
        { id: 'fac-audit', role: 'faculty', title: 'Plagiarism & Collusion Audit Lab', sub: 'Multi-document corpus audit with Suffix Arrays & Kasai LCP', icon: '🛡️', tag: 'FACULTY', fn: () => switchNavSection('fac-audit') },
        { id: 'fac-roster', role: 'faculty', title: 'Scholar Gradebook & Student Roster', sub: 'Class roster, student GPA ranking & submission evaluation', icon: '📋', tag: 'FACULTY', fn: () => switchNavSection('fac-roster') },
        { id: 'fac-research', role: 'faculty', title: 'Staffing Duality & Coverage (König)', sub: 'Mathematical verification of min vertex cover matching', icon: '🔬', tag: 'FACULTY', fn: () => switchNavSection('fac-research') },

        // Dean actions
        { id: 'dean-sat', role: 'dean', title: 'SAT Exam Timetabling & Conflict Resolution', sub: 'DPLL conflict-driven solver generating 100% overlap-free slots', icon: '📑', tag: 'ADMIN / DEAN', fn: () => switchNavSection('dean-sat') },
        { id: 'dean-transit', role: 'dean', title: 'Corridor Transit Flux Optimization', sub: 'Dinic blocking flow & Edmonds-Karp capacity scaling', icon: '🌊', tag: 'ADMIN / DEAN', fn: () => switchNavSection('dean-transit') },
        { id: 'dean-pod-tour', role: 'dean', title: 'Facility Inspection Tour & Pod Routing', sub: 'Optimal inspection path visiting all campus facilities', icon: '🗺️', tag: 'ADMIN / DEAN', fn: () => switchNavSection('dean-pod-tour') },
        { id: 'dean-parallel', role: 'dean', title: 'Parallel Performance Analytics Engine', sub: 'Blelloch scan, tree reduction & Brent theorem analysis', icon: '⚡', tag: 'ADMIN / DEAN', fn: () => switchNavSection('dean-parallel') },
        { id: 'dean-census', role: 'dean', title: 'Campus Faculty Census & Roster', sub: 'Institutional faculty workload equilibrium and department credentials', icon: '👥', tag: 'ADMIN / DEAN', fn: () => switchNavSection('dean-census') },

        // Universal tools
        { id: 'theme', role: 'all', title: 'Switch Color Theme Palette', sub: 'Natural Light, Smooth Dark, and Warm Earth palettes', icon: '🎨', tag: 'SETTING', fn: () => cycleAppTheme() },
        { id: 'video', role: 'all', title: 'Toggle Ambient Background Video', sub: 'Switch between Campus, Classroom, and Starfield ambient views', icon: '🎬', tag: 'SETTING', fn: () => cycleVideoAmbience() },
        { id: 'video-play', role: 'all', title: 'Play / Pause Background Video', sub: 'Toggle background ambient video playback', icon: '⏯️', tag: 'SETTING', fn: () => toggleVideoPlayback() },
        { id: 'algo-lab', role: 'all', title: 'Algorithm Intelligence Lab (M1–M6)', sub: 'Interactive step-by-step visualizer for all 24 DSA algorithms', icon: '🔬', tag: 'ALGO LAB', fn: () => switchNavSection('algo-lab') },
        { id: 'matrix', role: 'all', title: '24 DSA Architectural Matrix', sub: 'Comprehensive blueprint modal mapping algorithms to university architecture', icon: '⚡', tag: 'MODAL', fn: () => toggleDsaMatrix() },
        { id: 'logout', role: 'all', title: 'Sign Out & Switch Role Gateway', sub: 'Return to login portal to switch between Student, Faculty, and Dean', icon: '🚪', tag: 'AUTH', fn: () => logout() }
    ];

    const matchingActions = allActions.filter(act => {
        const text = (act.title + ' ' + act.sub + ' ' + act.tag).toLowerCase();
        return text.includes(q);
    }).sort((a, b) => {
        // Boost actions belonging to current user's role
        const aBoost = (a.role === role ? 2 : (a.role === 'all' ? 1 : 0));
        const bBoost = (b.role === role ? 2 : (b.role === 'all' ? 1 : 0));
        return bBoost - aBoost;
    });

    // 2. Search Algorithms (window.AlgoStudio.catalog)
    const matchingAlgos = [];
    if (window.AlgoStudio && AlgoStudio.catalog) {
        for (const [key, algo] of Object.entries(AlgoStudio.catalog)) {
            const name = (algo.name || '').toLowerCase();
            const prob = (algo.problem || '').toLowerCase();
            const mod = (algo.module || '').toLowerCase();
            const cat = (algo.category || '').toLowerCase();
            const dsa = (algo.dsaTopic || '').toLowerCase();
            if (key.toLowerCase().includes(q) || name.includes(q) || prob.includes(q) || mod.includes(q) || cat.includes(q) || dsa.includes(q)) {
                matchingAlgos.push({ key, algo });
            }
        }
    }

    // 3. Search Courses (academicData.courses)
    const matchingCourses = [];
    if (academicData && academicData.courses) {
        for (const c of academicData.courses) {
            const code = (c.code || '').toLowerCase();
            const title = (c.title || '').toLowerCase();
            const dept = (c.dept || '').toLowerCase();
            const pod = (c.podType || '').toLowerCase();
            if (code.includes(q) || title.includes(q) || dept.includes(q) || pod.includes(q)) {
                matchingCourses.push(c);
            }
        }
    }

    // 4. Search People (Students & Faculty)
    const matchingPeople = [];
    if (academicData) {
        if (academicData.students) {
            for (const s of academicData.students) {
                const sName = (s.name || '').toLowerCase();
                const sId = (s.id || '').toLowerCase();
                const sMajor = (s.major || '').toLowerCase();
                const sInst = (s.institutionalId || '').toLowerCase();
                if (sName.includes(q) || sId.includes(q) || sMajor.includes(q) || sInst.includes(q)) {
                    matchingPeople.push({ type: 'student', data: s });
                }
            }
        }
        if (academicData.faculty) {
            for (const f of academicData.faculty) {
                const fName = (f.name || '').toLowerCase();
                const fId = (f.id || '').toLowerCase();
                const fDept = (f.dept || '').toLowerCase();
                const fInst = (f.institutionalId || '').toLowerCase();
                if (fName.includes(q) || fId.includes(q) || fDept.includes(q) || fInst.includes(q)) {
                    matchingPeople.push({ type: 'faculty', data: f });
                }
            }
        }
    }

    // 5. Search Exams & Records (academicData.examRecords)
    const matchingExams = [];
    if (academicData && academicData.examRecords) {
        for (const ex of academicData.examRecords) {
            const exCode = (ex.examCode || '').toLowerCase();
            const cCode = (ex.courseCode || '').toLowerCase();
            const cTitle = (ex.courseTitle || '').toLowerCase();
            const hall = (ex.hallPod || '').toLowerCase();
            if (exCode.includes(q) || cCode.includes(q) || cTitle.includes(q) || hall.includes(q)) {
                matchingExams.push(ex);
            }
        }
    }

    // 6. Search Learning Resources (academicData.learningResources)
    const matchingResources = [];
    if (academicData && academicData.learningResources) {
        for (const res of academicData.learningResources) {
            const title = (res.title || '').toLowerCase();
            const docType = (res.docType || '').toLowerCase();
            const cCode = (res.courseCode || '').toLowerCase();
            const kw = (res.keywords || '').toLowerCase();
            const author = (res.author || '').toLowerCase();
            if (title.includes(q) || docType.includes(q) || cCode.includes(q) || kw.includes(q) || author.includes(q)) {
                matchingResources.push(res);
            }
        }
    }

    // 7. Search Academic Activities (academicData.activities)
    const matchingActivities = [];
    if (academicData && academicData.activities) {
        for (const act of academicData.activities) {
            const title = (act.title || '').toLowerCase();
            const cat = (act.category || '').toLowerCase();
            const host = (act.host || '').toLowerCase();
            if (title.includes(q) || cat.includes(q) || host.includes(q)) {
                matchingActivities.push(act);
            }
        }
    }

    // 8. Typo auto-correction query
    let correctionInfo = null;
    try {
        const res = await fetch(`/api/smart-search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
            const smartData = await res.json();
            if (smartData.suggestedCorrection && 
                smartData.suggestedCorrection.toLowerCase() !== q && 
                smartData.editDistance > 0 && 
                smartData.editDistance <= 3) {
                correctionInfo = smartData;
            }
        }
    } catch (e) {
        // Backend typo check is non-blocking
    }

    // Filter counts based on active filter
    const totalMatches = matchingActions.length + matchingAlgos.length + matchingCourses.length + matchingPeople.length + matchingExams.length + matchingResources.length + matchingActivities.length;

    let html = `
        <div class="search-dropdown-meta-bar">
            <span class="search-active-role-chip">
                <span>🎯 Active Workspace:</span>
                <strong>${label}</strong>
            </span>
            <span style="color:var(--text-muted); font-size:10.5px;">${totalMatches} result${totalMatches === 1 ? '' : 's'} found</span>
        </div>

        <div class="search-filter-pills">
            <button class="search-filter-pill ${currentSearchFilter === 'all' ? 'active' : ''}" onclick="setSearchFilter('all', event)">✨ All (${totalMatches})</button>
            <button class="search-filter-pill ${currentSearchFilter === 'actions' ? 'active' : ''}" onclick="setSearchFilter('actions', event)">⚡ Actions (${matchingActions.length})</button>
            <button class="search-filter-pill ${currentSearchFilter === 'algos' ? 'active' : ''}" onclick="setSearchFilter('algos', event)">🔬 Algorithms (${matchingAlgos.length})</button>
            <button class="search-filter-pill ${currentSearchFilter === 'courses' ? 'active' : ''}" onclick="setSearchFilter('courses', event)">📚 Courses (${matchingCourses.length})</button>
            <button class="search-filter-pill ${currentSearchFilter === 'people' ? 'active' : ''}" onclick="setSearchFilter('people', event)">👥 People (${matchingPeople.length})</button>
            <button class="search-filter-pill ${currentSearchFilter === 'records' ? 'active' : ''}" onclick="setSearchFilter('records', event)">📑 Records (${matchingExams.length + matchingResources.length})</button>
        </div>
    `;

    // Typo banner
    if (correctionInfo) {
        html += `
            <div class="search-correction-box">
                <div>
                    <span>💡 Did you mean: </span>
                    <strong onclick="applySearchCorrection('${correctionInfo.suggestedCorrection}')">${correctionInfo.suggestedCorrection}</strong>?
                    <span style="font-size:10.5px; color:var(--text-muted); margin-left:6px;">(Damerau-Levenshtein dist: ${correctionInfo.editDistance})</span>
                </div>
                <button class="btn-theme-pill" style="padding:2px 8px; font-size:11px;" onclick="applySearchCorrection('${correctionInfo.suggestedCorrection}')">Search &rarr;</button>
            </div>
        `;
    }

    if (totalMatches === 0) {
        html += `
            <div class="search-empty-state">
                <div style="font-size:24px; margin-bottom:6px;">🔍</div>
                <div style="font-weight:700; color:var(--text-heading); margin-bottom:4px;">No matches found for "${query}"</div>
                <div style="font-size:11.5px; color:var(--text-muted); line-height:1.5;">
                    Try searching for dashboard sections like <strong>courses</strong>, <strong>exams</strong>, <strong>gradebook</strong>, <strong>audit</strong>,<br>
                    algorithms like <strong>kmp</strong>, <strong>dinic</strong>, <strong>sat</strong>, <strong>miller</strong>, or scholars like <strong>nova</strong>, <strong>vance</strong>.
                </div>
            </div>
        `;
    } else {
        // Section: Dashboard Actions
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'actions') && matchingActions.length > 0) {
            html += `<div class="search-category-header"><span>⚡ Dashboard Features &amp; Actions (${matchingActions.length})</span></div>`;
            matchingActions.slice(0, currentSearchFilter === 'actions' ? 12 : 4).forEach(act => {
                const isCurrentRole = act.role === role;
                const pillBg = isCurrentRole ? 'var(--brand-light)' : '#f1f5f9';
                const pillColor = isCurrentRole ? 'var(--brand-primary)' : 'var(--text-muted)';
                html += `
                    <div class="search-result-row" onclick="(${act.fn.toString()})(); hideSearchDropdown();">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#f8fafc;">${act.icon}</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(act.title, query)}</span>
                                <span class="search-row-sub">${highlightSearchMatch(act.sub, query)}</span>
                            </div>
                        </div>
                        <span class="search-row-pill" style="background:${pillBg}; color:${pillColor};">${act.tag}</span>
                    </div>
                `;
            });
        }

        // Section: Algorithms
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'algos') && matchingAlgos.length > 0) {
            html += `<div class="search-category-header"><span>🔬 DSA Algorithms (${matchingAlgos.length})</span></div>`;
            matchingAlgos.slice(0, currentSearchFilter === 'algos' ? 15 : 4).forEach(({ key, algo }) => {
                const modTag = (algo.module || 'M1').toUpperCase();
                html += `
                    <div class="search-result-row" onclick="window.openAlgoInLab('${key}'); hideSearchDropdown();">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#eff6ff; color:#2563eb;">⚡</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(algo.name, query)}</span>
                                <span class="search-row-sub">${algo.problem ? highlightSearchMatch(algo.problem.substring(0, 85) + '...', query) : 'Interactive Visualizer & Lab'}</span>
                            </div>
                        </div>
                        <span class="search-row-pill" style="background:#dbeafe; color:#1d4ed8;">${modTag}</span>
                    </div>
                `;
            });
        }

        // Section: Courses
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'courses') && matchingCourses.length > 0) {
            html += `<div class="search-category-header"><span>📚 Academic Courses (${matchingCourses.length})</span></div>`;
            matchingCourses.slice(0, currentSearchFilter === 'courses' ? 10 : 4).forEach(c => {
                html += `
                    <div class="search-result-row" onclick="navigateToCourse('${c.code}')">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#f1f5f9; color:#0284c7;">📖</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(c.code + ': ' + c.title, query)}</span>
                                <span class="search-row-sub">${c.dept} &bull; ${c.credits} Credits &bull; Exam Slot ${c.examSlot} &bull; Pod: ${c.podType}</span>
                            </div>
                        </div>
                        <span class="search-row-pill">COURSE</span>
                    </div>
                `;
            });
        }

        // Section: People Directory (Students & Faculty)
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'people') && matchingPeople.length > 0) {
            html += `<div class="search-category-header"><span>👥 People Directory (${matchingPeople.length})</span></div>`;
            matchingPeople.slice(0, currentSearchFilter === 'people' ? 10 : 4).forEach(p => {
                if (p.type === 'student') {
                    const s = p.data;
                    const instId = s.institutionalId || s.id;
                    html += `
                        <div class="search-result-row" onclick="navigateToStudent('${s.id}')">
                            <div class="search-row-left">
                                <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">🎓</span>
                                <div class="search-row-content">
                                    <span class="search-row-title">${highlightSearchMatch(s.name, query)} &bull; <span style="font-family:var(--font-code); font-size:11px; color:var(--brand-primary);">${instId}</span></span>
                                    <span class="search-row-sub">${s.major} &bull; GPA: ${s.gpa.toFixed(2)}/10.0 &bull; ${s.credits} Credits</span>
                                </div>
                            </div>
                            <span class="search-row-pill" style="background:#d1fae5; color:#047857;">STUDENT</span>
                        </div>
                    `;
                } else {
                    const f = p.data;
                    const instId = f.institutionalId || f.id;
                    html += `
                        <div class="search-result-row" onclick="navigateToFaculty('${f.id}')">
                            <div class="search-row-left">
                                <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">👨‍🏫</span>
                                <div class="search-row-content">
                                    <span class="search-row-title">Prof. ${highlightSearchMatch(f.name, query)} &bull; <span style="font-family:var(--font-code); font-size:11px; color:var(--brand-primary);">${instId}</span></span>
                                    <span class="search-row-sub">Dept of ${f.dept} &bull; Max Course Load: ${f.maxLoad}</span>
                                </div>
                            </div>
                            <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">FACULTY</span>
                        </div>
                    `;
                }
            });
        }

        // Section: Exams
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'records') && matchingExams.length > 0) {
            html += `<div class="search-category-header"><span>📝 Exam Records &amp; SAT Schedules (${matchingExams.length})</span></div>`;
            matchingExams.slice(0, currentSearchFilter === 'records' ? 6 : 3).forEach(ex => {
                html += `
                    <div class="search-result-row" onclick="navigateToExam('${ex.examCode}')">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#ecfdf5; color:#059669;">🗓️</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(ex.courseCode + ' ' + ex.courseTitle, query)}</span>
                                <span class="search-row-sub">${ex.date} &bull; ${ex.timeSlot} &bull; ${ex.hallPod} &bull; Seat ${ex.seat}</span>
                            </div>
                        </div>
                        <span class="search-row-pill" style="background:#d1fae5; color:#047857;">EXAM</span>
                    </div>
                `;
            });
        }

        // Section: Learning Resources
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'records') && matchingResources.length > 0) {
            html += `<div class="search-category-header"><span>📄 Indexed Digital Resources (${matchingResources.length})</span></div>`;
            matchingResources.slice(0, currentSearchFilter === 'records' ? 6 : 3).forEach(res => {
                html += `
                    <div class="search-result-row" onclick="switchNavSection('resources'); hideSearchDropdown();">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#f5f3ff; color:#7c3aed;">📑</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(res.title, query)}</span>
                                <span class="search-row-sub">${res.courseCode} &bull; Author: ${res.author} &bull; ${res.format}</span>
                            </div>
                        </div>
                        <span class="search-row-pill" style="background:#ede9fe; color:#6d28d9;">${res.docType}</span>
                    </div>
                `;
            });
        }

        // Section: Activities
        if ((currentSearchFilter === 'all' || currentSearchFilter === 'actions') && matchingActivities.length > 0) {
            html += `<div class="search-category-header"><span>🎯 Academic Activities (${matchingActivities.length})</span></div>`;
            matchingActivities.slice(0, 2).forEach(act => {
                html += `
                    <div class="search-result-row" onclick="switchNavSection('activities'); hideSearchDropdown();">
                        <div class="search-row-left">
                            <span class="search-row-icon" style="background:#fffbeb; color:#d97706;">🏆</span>
                            <div class="search-row-content">
                                <span class="search-row-title">${highlightSearchMatch(act.title, query)}</span>
                                <span class="search-row-sub">Host: ${act.host} &bull; ${act.date} &bull; +${act.credits} Credits</span>
                            </div>
                        </div>
                        <span class="search-row-pill" style="background:#fef3c7; color:#b45309;">${act.category}</span>
                    </div>
                `;
            });
        }
    }

    dropdown.innerHTML = html;
    selectedSearchRowIndex = -1;
    dropdown.classList.remove('hidden');
}

// -----------------------------------------------------------------------------
// Direct Navigation and Row Highlighting Handlers
// -----------------------------------------------------------------------------
function navigateToCourse(courseCode) {
    hideSearchDropdown();
    switchNavSection('courses');
    setTimeout(() => {
        const rows = document.querySelectorAll('#allCoursesCatalogBody tr, #studentCoursesBody tr');
        for (const row of rows) {
            if (row.textContent.includes(courseCode)) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.style.outline = '2px solid var(--brand-primary)';
                row.style.backgroundColor = 'var(--brand-light)';
                setTimeout(() => {
                    row.style.outline = '';
                    row.style.backgroundColor = '';
                }, 2500);
                break;
            }
        }
    }, 250);
}

function navigateToStudent(studentId) {
    hideSearchDropdown();
    const { role } = getActiveRoleContext();
    if (role === 'faculty') {
        switchNavSection('fac-roster');
        setTimeout(() => {
            const rows = document.querySelectorAll('#facStudentRosterBody tr');
            for (const row of rows) {
                if (row.textContent.includes(studentId)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.style.outline = '2px solid var(--brand-primary)';
                    row.style.backgroundColor = 'var(--brand-light)';
                    setTimeout(() => {
                        row.style.outline = '';
                        row.style.backgroundColor = '';
                    }, 2500);
                    break;
                }
            }
        }, 250);
    } else if (role === 'dean') {
        switchNavSection('dean-census');
    } else {
        switchNavSection('cgpa');
    }
}

function navigateToFaculty(facultyId) {
    hideSearchDropdown();
    const { role } = getActiveRoleContext();
    if (role === 'faculty') {
        switchNavSection('fac-matching');
    } else if (role === 'dean') {
        switchNavSection('dean-census');
        setTimeout(() => {
            const rows = document.querySelectorAll('#deanFacultyCensusBody tr');
            for (const row of rows) {
                if (row.textContent.includes(facultyId)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.style.outline = '2px solid var(--brand-primary)';
                    row.style.backgroundColor = 'var(--brand-light)';
                    setTimeout(() => {
                        row.style.outline = '';
                        row.style.backgroundColor = '';
                    }, 2500);
                    break;
                }
            }
        }, 250);
    } else {
        switchNavSection('courses');
    }
}

function navigateToExam(examCode) {
    hideSearchDropdown();
    const { role } = getActiveRoleContext();
    if (role === 'dean') {
        switchNavSection('dean-sat');
    } else {
        switchNavSection('exams');
        setTimeout(() => {
            const rows = document.querySelectorAll('#examTimetableBody tr');
            for (const row of rows) {
                if (row.textContent.includes(examCode)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.style.outline = '2px solid var(--brand-primary)';
                    row.style.backgroundColor = 'var(--brand-light)';
                    setTimeout(() => {
                        row.style.outline = '';
                        row.style.backgroundColor = '';
                    }, 2500);
                    break;
                }
            }
        }, 250);
    }
}

// Close search dropdown on click outside
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('headerSearchWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        hideSearchDropdown();
    }
});

function quickFillSearch(term) {
    const input = document.getElementById('headerGlobalSearch');
    if (input) {
        input.value = term;
        onHeaderSearch(term);
        input.focus();
    }
}

async function runStudentPlagiarismCheck() {
    const content = document.getElementById('subPaperContent').value;
    const reportBox = document.getElementById('studentOriginalityReport');
    reportBox.classList.remove('hidden');
    reportBox.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">Running Suffix Array induced sorting and Kasai LCP multi-document comparison...</span>';

    try {
        const res = await fetch('/api/check-plagiarism', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: content
        });
        if (res.ok) {
            const data = await res.json();
            const similarityPct = (data.similarityScore * 100).toFixed(1);
            const isHigh = data.similarityScore > 0.3;
            reportBox.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong>Academic Originality Analysis</strong>
                    <span class="status-pill ${isHigh ? 'warning' : 'success'}">${similarityPct}% Similarity</span>
                </div>
                <p style="font-size:12px; margin-bottom:4px;">Matched Repository Source: <strong>${data.topMatchDoc}</strong></p>
                <p style="font-size:12px; margin-bottom:6px;">Longest Shared Phrase: <strong>${data.longestSharedLength} characters</strong></p>
                ${data.longestSharedPhrase ? `<div class="phrase-match-highlight">"${data.longestSharedPhrase}"</div>` : ''}
                <div style="margin-top:8px; font-size:11px; color:var(--text-muted);">
                    • Distinct Vocabulary Indexed (Suffix Automaton): <strong>${data.distinctVocabularySubstrings}</strong><br>
                    • Self-Repetitions Detected (Z-Algorithm): <strong>${data.selfRepetitionsDetected} recurring phrases</strong>
                </div>
            `;
        }
    } catch (e) {
        reportBox.innerHTML = '<span style="color:red; font-size:12px;">Error running originality screening: ' + e.message + '</span>';
    }
}

function loadSampleText(type) {
    const textarea = document.getElementById('subPaperContent');
    if (type === 'original') {
        textarea.value = "We propose an empirical model for zero-G plasma drift inside floating pods. By modulating the artificial magnetic tether, we observe steady velocity vectors without thermal dissipation. Results show 99.4% stability.";
    } else {
        textarea.value = "In zero-G orbital drift, antigravity propulsion requires constant calibration of the graviton flux capacitor. The mathematical formulation of relativistic tensor fields dictates that orbital velocity vectors must stabilize against planetary micro-drag.";
    }
}

async function solveStudentExamTicket() {
    try {
        const res = await fetch('/api/exam-timetabling');
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('examTimetableBody');
            if (tbody) {
                tbody.innerHTML = '';
                data.timetable.slice(0, 2).forEach(t => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span class="code-pill">${t.course}</span></td>
                        <td>Slot ${t.slot} (9:00 AM - 12:00 PM)</td>
                        <td>${t.pod}</td>
                        <td><span class="status-pill success">Seat Assigned (DPLL SAT)</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    } catch (e) {
        console.error('Exam ticket error:', e);
    }
}

async function loadStudentLeaderboard() {
    try {
        const res = await fetch('/api/student-analytics');
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('studentLeaderboardBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.leaderboard.forEach(s => {
                const tr = document.createElement('tr');
                const honorLabel = s.gpa >= 9.5 ? 'Highest Distinction (Top Honors)' : (s.gpa >= 8.5 ? 'First Class Distinction' : 'Academic Standing');
                const pillClass = s.gpa >= 9.5 ? 'success' : (s.gpa >= 8.5 ? 'primary' : '');
                tr.innerHTML = `
                    <td><strong>#${s.rank}</strong></td>
                    <td><strong>${s.name}</strong> <span style="font-size:11px; color:var(--text-muted);">(${s.id})</span></td>
                    <td>${s.major}</td>
                    <td><strong style="color:var(--brand-primary); font-size:13.5px;">${s.gpa.toFixed(2)}</strong> / 10.0</td>
                    <td><span class="status-pill ${pillClass}">${honorLabel}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error('Leaderboard error:', e);
    }
}

// ==============================================================
// 4. FACULTY WORKSPACE DATA & ACTIONS
// ==============================================================

async function loadFacultyMatchingAnalysis() {
    try {
        const res = await fetch('/api/faculty-matching');
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('facAllocationBody');
            if (tbody) {
                tbody.innerHTML = '';
                data.assignments.forEach(a => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${a.faculty}</strong></td>
                        <td>${a.dept}</td>
                        <td><span class="code-pill">${a.course}</span></td>
                        <td><span class="status-pill success">Hopcroft-Karp Assigned</span></td>
                        <td><span class="status-pill" style="background:#e0f2fe; color:#0369a1;">Active Section</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
            const m = document.getElementById('facKonigMatching');
            const c = document.getElementById('facKonigCover');
            const i = document.getElementById('facKonigIndSet');
            if (m) m.textContent = data.maxMatchingSize;
            if (c) c.textContent = data.minVertexCoverSize;
            if (i) i.textContent = data.maxIndependentSetSize;
        }
    } catch (e) {
        console.error('Faculty matching error:', e);
    }
}

async function loadFacultyStudentRoster() {
    try {
        const res = await fetch('/api/student-analytics');
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('facStudentRosterBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.leaderboard.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>#${s.rank}</strong></td>
                    <td>${s.name}</td>
                    <td>${s.gpa.toFixed(2)}</td>
                    <td>${s.credits} / 120 Units</td>
                    <td><span class="status-pill ${s.gpa >= 3.5 ? 'success' : ''}">${s.gpa >= 3.5 ? 'Good Standing' : 'Academic Warning'}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error('Faculty roster error:', e);
    }
}

// ==============================================================
// 5. DEAN & REGISTRAR WORKSPACE DATA & ACTIONS
// ==============================================================

async function solveDeanExamTimetable() {
    try {
        const res = await fetch('/api/exam-timetabling');
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('deanExamTimetableBody');
            if (tbody) {
                tbody.innerHTML = '';
                data.timetable.forEach(t => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span class="code-pill">${t.course}</span></td>
                        <td>Slot ${t.slot} (SAT Satisfied)</td>
                        <td>${t.pod}</td>
                        <td><span class="status-pill success">DPLL Satisfiable</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    } catch (e) {
        console.error('Dean exam error:', e);
    }
}

async function loadDeanCampusFlow() {
    try {
        const res = await fetch('/api/campus-flow');
        if (res.ok) {
            const data = await res.json();
            const airlockEl = document.getElementById('deanAirlockMax');
            const kpiFlow = document.getElementById('deanKpiFlow');
            if (airlockEl) airlockEl.textContent = data.airlockTransitMaxStudents;
            if (kpiFlow) kpiFlow.textContent = `${data.airlockTransitMaxStudents} / Hr`;
        }
    } catch (e) {
        console.error('Dean flow error:', e);
    }
}

async function optimizeDeanPodTour() {
    try {
        const res = await fetch('/api/pod-transit');
        if (res.ok) {
            const data = await res.json();
            const fuelPill = document.getElementById('deanFuelPill');
            const kpiFuel = document.getElementById('deanKpiFuel');
            const pathEl = document.getElementById('deanTourPath');
            if (fuelPill) fuelPill.textContent = `${data.minFuelJoules} Joules Fuel`;
            if (kpiFuel) kpiFuel.textContent = `${data.minFuelJoules} J Fuel`;
            if (pathEl) pathEl.textContent = data.tour.join(' → ') + ' → Central Hub';
        }
    } catch (e) {
        console.error('Dean tour error:', e);
    }
}

async function loadDeanParallelAnalytics() {
    try {
        const res = await fetch('/api/student-analytics');
        if (res.ok) {
            const data = await res.json();
            const avgEl = document.getElementById('deanAvgGpa');
            const speedEl = document.getElementById('deanMaxSpeedup');
            if (avgEl) avgEl.textContent = data.campusAverageGPA;
            if (speedEl) speedEl.textContent = `${data.maxParallelSpeedup}x`;
        }
    } catch (e) {
        console.error('Dean parallel analytics error:', e);
    }
}

async function loadDeanFacultyCensus() {
    if (!academicData || !academicData.faculty) return;
    const tbody = document.getElementById('deanFacultyCensusBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    academicData.faculty.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>Prof. ${f.name}</strong></td>
            <td>${f.dept}</td>
            <td>${f.maxLoad} Courses / Term</td>
            <td><span class="code-pill">${f.qualified.join(', ')}</span></td>
            <td><span class="status-pill success">100% Allocated</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal Toggle
function toggleDsaMatrix() {
    const modal = document.getElementById('dsaMatrixModal');
    if (modal) modal.classList.toggle('hidden');
}

// ==============================================================
// 6. INTERACTIVE BACKGROUND VIDEO AMBIENCE CONTROLLER
// ==============================================================

let videoAmbienceMode = 'campus'; // 'campus' | 'classroom' | 'off'
let isVideoPaused = false;

function cycleVideoAmbience() {
    const video = document.getElementById('dashboardVideo');
    const wrapper = document.getElementById('ambientVideoWrapper');
    const label = document.getElementById('currentVideoLabel');
    const stuFeed = document.getElementById('stuFeedText');
    const facFeed = document.getElementById('facFeedText');
    const deanFeed = document.getElementById('deanFeedText');

    if (videoAmbienceMode === 'campus') {
        videoAmbienceMode = 'classroom';
        if (video) {
            video.src = 'videos/classroom.mp4';
            video.play().catch(e => console.log('Autoplay:', e));
        }
        if (wrapper) {
            wrapper.classList.remove('video-hidden');
            wrapper.classList.add('video-active');
        }
        if (label) label.textContent = 'Classroom View';
        if (stuFeed) stuFeed.textContent = 'Classroom Pod Alpha';
        if (facFeed) facFeed.textContent = 'Classroom Pod Beta';
        if (deanFeed) deanFeed.textContent = 'Central Hub Concourse';
    } else if (videoAmbienceMode === 'classroom') {
        videoAmbienceMode = 'off';
        if (video) video.pause();
        if (wrapper) {
            wrapper.classList.remove('video-active');
            wrapper.classList.add('video-hidden');
        }
        if (label) label.textContent = 'Ambience Off';
        if (stuFeed) stuFeed.textContent = 'Stream Paused';
        if (facFeed) facFeed.textContent = 'Stream Paused';
        if (deanFeed) deanFeed.textContent = 'Stream Paused';
    } else {
        videoAmbienceMode = 'campus';
        if (video) {
            video.src = 'videos/campus.mp4';
            video.play().catch(e => console.log('Autoplay:', e));
        }
        if (wrapper) {
            wrapper.classList.remove('video-hidden');
            wrapper.classList.add('video-active');
        }
        if (label) label.textContent = 'Campus View';
        if (stuFeed) stuFeed.textContent = 'Orbital Quad Concourse';
        if (facFeed) facFeed.textContent = 'Central Observatory';
        if (deanFeed) deanFeed.textContent = 'Station Perimeter Stream';
    }
}

function toggleVideoPlayback() {
    const video = document.getElementById('dashboardVideo');
    const btn = document.getElementById('btnPlayPauseVideo');
    if (!video) return;

    if (video.paused) {
        video.play().catch(e => console.log('Play:', e));
        isVideoPaused = false;
        if (btn) btn.textContent = '⏸️';
    } else {
        video.pause();
        isVideoPaused = true;
        if (btn) btn.textContent = '▶️';
    }
}

// Auto-play videos safely on load
window.addEventListener('load', () => {
    const authVid = document.getElementById('authVideoBg');
    if (authVid) authVid.play().catch(e => console.log('Auth vid autoplay:', e));
    const dashVid = document.getElementById('dashboardVideo');
    if (dashVid) dashVid.play().catch(e => console.log('Dash vid autoplay:', e));
});

