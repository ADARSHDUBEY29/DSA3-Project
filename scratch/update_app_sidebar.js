const fs = require('fs');

console.log('--- Updating web/app.js with TravelSync sidebar navigation ---');

let code = fs.readFileSync('web/app.js', 'utf8');

const algoNavFragment = `            <li class="sidebar-separator"></li>
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
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>`;

// Replace in student menu:
const oldStudentAlgoNav = `            <li class="sidebar-separator"></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" style="color:var(--brand-primary); font-weight:700;" onclick="switchNavSection('algo-lab', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔬</span><span>Algorithm Lab (24)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="toggleDsaMatrix()"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>DSA Architecture (24)</span></div></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>`;

// Replace in faculty menu:
const oldFacultyAlgoNav = `            <li class="sidebar-separator"></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" style="color:var(--brand-primary); font-weight:700;" onclick="switchNavSection('algo-lab', this)"><div class="nav-menu-link-inner"><span class="nav-icon">🔬</span><span>Algorithm Lab (24)</span></div><span class="nav-caret">&rsaquo;</span></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="toggleDsaMatrix()"><div class="nav-menu-link-inner"><span class="nav-icon">⚡</span><span>DSA Architecture</span></div></a></li>
            <li class="nav-menu-item"><a href="javascript:void(0)" class="nav-menu-link" onclick="logout()"><div class="nav-menu-link-inner"><span class="nav-icon">🚪</span><span>Sign Out</span></div></a></li>`;

code = code.replace(oldStudentAlgoNav, algoNavFragment);
code = code.replace(oldFacultyAlgoNav, algoNavFragment);
code = code.replace(oldFacultyAlgoNav, algoNavFragment); // Dean menu has same pattern

// Add openAlgoModule and openAlgoExplorer functions
const helperFunctions = `
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
`;

const toggleSidebarMarker = 'function toggleSidebar() {';
code = code.replace(toggleSidebarMarker, helperFunctions + '\n' + toggleSidebarMarker);

fs.writeFileSync('web/app.js', code, 'utf8');
console.log('Successfully updated web/app.js!');
