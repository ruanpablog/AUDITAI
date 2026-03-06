// ==========================================
// CRUDS - ADMIN (Empresas, Depts, Checklists)
// ==========================================

window.renderAdminCompanies = function () {
    const tbody = document.getElementById('admin-companies-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // As a mock, we will use stores as companies if none exist yet, just for demo purposes
    let companies = db.companies || [];

    if (companies.length === 0) {
        tbody.innerHTML = '<tr><td colspan=""4"" style=""text-align:center;"">Nenhuma empresa cadastrada.</td></tr>';
    }

    companies.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = \
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>
                <button class=""btn btn-ghost"" onclick='alert(""Editar (Em breve)"")'><i class=""ph ph-pencil-simple""></i></button>
                <button class=""btn btn-ghost"" style=""color:var(--danger);"" onclick='alert(""Excluir (Em breve)"")'><i class=""ph ph-trash""></i></button>
            </td>
        \;
        tbody.appendChild(tr);
    });
}

const btnAddCompany = document.getElementById('btn-add-company');
if (btnAddCompany) {
    btnAddCompany.addEventListener('click', () => {
        const name = prompt(""Nome da Nova Empresa:"");
        if (name) {
            if (!db.companies) db.companies = [];
            db.companies.push({ id: 'comp_' + Date.now(), name: name, cnpj: '' });
            saveDB();
            renderAdminCompanies();
        }
    });
}

window.renderAdminDepts = function () {
    const tbody = document.getElementById('admin-depts-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    db.departments.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = \
            <td>\</td>
            <td>\</td>
            <td>
                <button class=""btn btn-ghost"" onclick='alert(""Editar Dept (Em breve)"")'><i class=""ph ph-pencil-simple""></i></button>
                <button class=""btn btn-ghost"" style=""color:var(--danger);"" onclick='alert(""Excluir Dept (Em breve)"")'><i class=""ph ph-trash""></i></button>
            </td>
        \;
        tbody.appendChild(tr);
    });
}

const btnAddDept = document.getElementById('btn-add-dept');
if (btnAddDept) {
    btnAddDept.addEventListener('click', () => {
        const name = prompt(""Nome do Novo Departamento:"");
        if (name) {
            db.departments.push({ id: 'd_' + Date.now(), name: name, weight: 1 });
            saveDB();
            renderAdminDepts();
        }
    });
}

window.renderAdminChecklists = function () {
    const tbody = document.getElementById('admin-checklist-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    db.checklistItems.forEach(i => {
        const tr = document.createElement('tr');
        tr.innerHTML = \
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>
                <button class=""btn btn-ghost"" onclick='alert(""Editar Item (Em breve)"")'><i class=""ph ph-pencil-simple""></i></button>
                <button class=""btn btn-ghost"" style=""color:var(--danger);"" onclick='alert(""Excluir Item (Em breve)"")'><i class=""ph ph-trash""></i></button>
            </td>
        \;
        tbody.appendChild(tr);
    });
}

const btnAddChecklist = document.getElementById('btn-add-checklist');
if (btnAddChecklist) {
    btnAddChecklist.addEventListener('click', () => {
        const q = prompt(""Pergunta do novo item do checklist:"");
        if (q) {
            const crit = confirm(""Este item é CRÍTICO? (OK para Sim, Cancelar para Não)"");
            // Assign to default category for now
            db.checklistItems.push({ id: 'i_' + Date.now(), cat_id: 'c1', question: q, eh_critico: crit });
            saveDB();
            renderAdminChecklists();
        }
    });
}

// Refresh these tables when admin view is clicked
const nAdmin2 = document.getElementById('nav-admin');
if (nAdmin2) {
    nAdmin2.addEventListener('click', () => {
        renderAdminCompanies();
        renderAdminDepts();
        renderAdminChecklists();
    });
}


// ==========================================
// PHOTO UPLOAD MODULE (DURING AUDIT)
// ==========================================
let currentUploadItemEl = null;

document.getElementById('categories-container').addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-photo')) {
        const btn = e.target.closest('.btn-add-photo');
        currentUploadItemEl = btn.closest('.audit-item');
        document.getElementById('photo-upload-input').click();
    }
});

document.getElementById('photo-upload-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && currentUploadItemEl) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Str = event.target.result;

            // Store base64 in dataset of the item for later retrieval
            const photoDataStorage = currentUploadItemEl.querySelector('.photo-data');
            if (!photoDataStorage) {
                const hiddenData = document.createElement('input');
                hiddenData.type = 'hidden';
                hiddenData.className = 'photo-data';
                currentUploadItemEl.appendChild(hiddenData);
            }
            currentUploadItemEl.querySelector('.photo-data').value = base64Str;

            // Visual feedback
            const btn = currentUploadItemEl.querySelector('.btn-add-photo');
            btn.innerHTML = '<i class="ph ph-check-circle" style="color:var(--success);"></i> Foto Adicionada';
            btn.classList.add('btn-outline');
            btn.classList.remove('btn-ghost');

            currentUploadItemEl = null; // reset
        };
        reader.readAsDataURL(file);
    }
});


