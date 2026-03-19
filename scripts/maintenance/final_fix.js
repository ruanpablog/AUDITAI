const fs = require('fs');
const filePath = 'C:\\Users\\user\\Desktop\\ANTIGRAVITY\\auditai\\app.js';
let content = fs.readFileSync(filePath, 'utf8');

// Localizar o ponto onde renderScheduledAudits fecha seus iteradores principais
const marker = 'document.querySelectorAll(\'.btn-do-followup\').forEach(btn => {';
const markerIndex = content.lastIndexOf(marker);

if (markerIndex !== -1) {
    // Encontrar o fechamento do forEach e da função renderScheduledAudits
    let rest = content.substring(markerIndex);
    let closeCount = 0;
    let cutIndex = -1;
    
    for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '}') {
            closeCount++;
            if (closeCount === 3) { // 1 for forEach, 1 for addEventListener, 1 for renderScheduledAudits
                cutIndex = markerIndex + i + 1;
                break;
            }
        }
    }

    if (cutIndex !== -1) {
        const cleanBase = content.substring(0, cutIndex);
        const finalBlock = `

// --- Funções Administrativas (Global) ---
window.editChecklistItem = function(id) {
    const item = (db.checklistItems || []).find(x => x.id === id);
    if (!item) return;
    const deptList = db.departments.map((d, idx) => (idx+1) + '. ' + d.name).join('\\n');
    const currentDept = db.departments.find(d => d.id === item.dept_id);
    const currentDeptNum = currentDept ? db.departments.indexOf(currentDept) + 1 : '';
    const deptChoice = prompt('Departamento (atual: ' + (currentDept ? currentDept.name : 'Sem dept') + '):\\n\\n' + deptList + '\\n\\nNúmero ou vazio:', currentDeptNum);
    if (deptChoice && deptChoice.trim()) {
        const idx = parseInt(deptChoice.trim()) - 1;
        if (idx >= 0 && idx < db.departments.length) item.dept_id = db.departments[idx].id;
    }
    const newQ = prompt('Editar Pergunta:', item.question);
    if (newQ && newQ.trim()) item.question = newQ.trim();
    item.eh_critico = confirm('CRÍTICO?');
    saveDB();
    renderAdminChecklists();
};

window.editCategory = function(id) {
    const cat = db.categories.find(c => c.id === id);
    if (!cat) return;
    const n = prompt('Nome:', cat.name);
    if (n) cat.name = n.trim();
    saveDB();
    renderAdminCategories();
};

window.deleteChecklist = id => { if(confirm("Excluir?")) { db.checklistItems = db.checklistItems.filter(i => i.id !== id); saveDB(); renderAdminChecklists(); } };
window.deleteCategory = id => { if(confirm("Excluir?")) { db.categories = db.categories.filter(c => c.id !== id); saveDB(); renderAdminCategories(); } };
window.deleteStore = id => { if(confirm("Excluir?")) { db.stores = db.stores.filter(s => s.id !== id); saveDB(); renderAdminStores(); } };
window.deleteDept = id => { if(confirm("Excluir?")) { db.departments = db.departments.filter(d => d.id !== id); saveDB(); renderAdminDepts(); } };

// --- Backup & Importação (v24) ---
const btnImport = document.getElementById('btn-import-db');
const fileInput = document.getElementById('db-file-input');
if (btnImport && fileInput) {
    btnImport.onclick = () => fileInput.click();
    fileInput.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data && Array.isArray(data.users)) {
                    if (confirm("SOBRESCREVER DADOS?")) {
                        localStorage.setItem('auditai_db', ev.target.result);
                        alert('Sucesso! Reiniciando...');
                        window.location.reload();
                    }
                } else alert('JSON Inválido.');
            } catch(err) { alert('Erro: ' + err.message); }
            fileInput.value = '';
        };
        reader.readAsText(file);
    };
}

// --- Segurança & Logout ---
document.oncontextmenu = e => e.preventDefault();
document.onkeydown = e => {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) return false;
};

let inactivityTimer;
const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    if (sessionStorage.getItem('auditai_session')) {
        inactivityTimer = setTimeout(() => { alert('Sessão expirada.'); logout(); }, 30 * 60 * 1000);
    }
};
['mousedown', 'mousemove', 'keypress'].forEach(n => document.addEventListener(n, resetInactivityTimer, true));
resetInactivityTimer();

loadDB();
updateAuthUI();
});
`;
        fs.writeFileSync(filePath, cleanBase + finalBlock);
        console.log('Sucesso!');
    } else {
        console.log('Falha ao encontrar ponto de corte.');
    }
} else {
    console.log('Falha ao encontrar marker.');
}
