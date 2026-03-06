// ==========================================
// APP INITIALIZATION & UTILS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const authView = document.getElementById('auth-view');
    const appView = document.getElementById('app-view');

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const errorMsg = document.getElementById('auth-error-msg');
    const pendingMsg = document.getElementById('pending-msg');

    // Sidebar & Mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const btnLogout = document.getElementById('btn-logout');

    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserRole = document.getElementById('sidebar-user-role');

    // Audit Flow
    const auditProgress = document.getElementById('audit-progress-bar');
    const btnNextStep1 = document.getElementById('btn-next-step-1');
    const btnPrevStep2 = document.getElementById('btn-prev-step-2');
    const btnPrevStep3 = document.getElementById('btn-prev-step-3');
    const btnFinishAudit = document.getElementById('btn-finish-audit');
    const btnSaveDept = document.getElementById('btn-save-dept');

    // --- State Management (LocalStorage DB) ---
    // Simulating the DB requested in Lovable prompt
    const defaultDepartments = [
        { id: 'd1', name: 'Açougue', weight: 1 },
        { id: 'd2', name: 'Hortifruit', weight: 1 },
        { id: 'd3', name: 'Frios', weight: 1 },
        { id: 'd4', name: 'Área de Vendas', weight: 1 },
        { id: 'd5', name: 'Frente de Loja', weight: 1 },
        { id: 'd6', name: 'Depósito', weight: 1 },
        { id: 'd7', name: 'Recebimento', weight: 1 },
        { id: 'd8', name: 'Avarias', weight: 1 }
    ];

    const defaultCategories = [
        { id: 'c1', name: 'Limpeza e Organização', weight: 5 },
        { id: 'c2', name: 'Atendimento ao Cliente', weight: 5 },
        { id: 'c3', name: 'Entendimento dos Processos', weight: 5 },
        { id: 'c4', name: 'Desperdício', weight: 6 },
        { id: 'c5', name: 'Qualidade dos Produtos', weight: 8 }
    ];

    const defaultItems = [
        { id: 'i1', cat_id: 'c1', question: 'O setor está limpo e organizado de acordo com o padrão?', eh_critico: false },
        { id: 'i2', cat_id: 'c1', question: 'Equipamentos e utensílios estão higienizados?', eh_critico: true },
        { id: 'i3', cat_id: 'c2', question: 'Os colaboradores estão padronizados (uniforme/EPI)?', eh_critico: false },
        { id: 'i4', cat_id: 'c3', question: 'O POP (Procedimento Operacional Padrão) está sendo seguido?', eh_critico: true },
        { id: 'i5', cat_id: 'c4', question: 'O controle de validade está sendo feito adequadamente?', eh_critico: true },
        { id: 'i6', cat_id: 'c5', question: 'Aparência e frescor dos itens estão satisfatórios?', eh_critico: false },
        { id: 'i7', cat_id: 'c5', question: 'Temperaturas de armazenamento estão corretas?', eh_critico: true }
    ];

    const defaultStores = [
        { id: 's1', code: '001', name: 'Super Matriz Centro', city: 'São Paulo' },
        { id: 's2', code: '002', name: 'Filial Zona Sul', city: 'São Paulo' },
        { id: 's3', code: '003', name: 'Express Aeroporto', city: 'Guarulhos' }
    ];

    let db = {
        users: [],
        stores: defaultStores,
        departments: defaultDepartments,
        categories: defaultCategories,
        checklistItems: defaultItems,
        audits: []
    };

    let currentUser = null;

    // Load from local storage
    const loadDB = () => {
        const stored = localStorage.getItem('auditai_db');
        if (stored) {
            db = JSON.parse(stored);
        } else {
            // First time run, create default admin
            const adminUser = {
                id: 'admin_1',
                name: 'Admin Sistema',
                email: 'admin@auditai.com',
                pass: '123456',
                role: 'admin',
                status: 'aprovado'
            };
            db.users.push(adminUser);
            saveDB();
        }

        const loggedIn = sessionStorage.getItem('auditai_session');
        if (loggedIn) {
            currentUser = db.users.find(u => u.email === loggedIn);
        }
    };

    const saveDB = () => {
        localStorage.setItem('auditai_db', JSON.stringify(db));
    };

    // ==========================================
    // AUTHENTICATION MODULE
    // ==========================================
    loadDB();

    const updateAuthUI = () => {
        if (currentUser) {
            if (currentUser.status === 'pendente') {
                // Bloqueio temporario na propria auth view
                authView.classList.remove('hidden');
                appView.classList.add('hidden');
                loginForm.classList.add('hidden');
                regForm.classList.add('hidden');
                tabLogin.classList.add('hidden');
                tabRegister.classList.add('hidden');
                errorMsg.innerText = '';
                pendingMsg.classList.remove('hidden');
            } else {
                // Login completo
                authView.classList.add('hidden');
                appView.classList.remove('hidden');

                // Set UI
                sidebarUserName.innerText = currentUser.name.split(' ')[0];
                sidebarUserRole.innerText = currentUser.role === 'admin' ? 'Administrador' : (currentUser.role === 'manager' ? 'Gerente' : 'Auditor');
                sidebarAvatar.innerText = currentUser.name.charAt(0).toUpperCase();

                // Roles restrictions
                if (currentUser.role === 'admin') {
                    document.getElementById('nav-admin').classList.remove('hidden');
                } else {
                    document.getElementById('nav-admin').classList.add('hidden');
                }

                // Carrega dados pro dashboard e historico
                populateStores();
                renderAuditsHistory();
                renderAdminUsers();

                switchSection('audit-flow'); // Start with new audit
            }
        } else {
            authView.classList.remove('hidden');
            appView.classList.add('hidden');
        }
    };

    // Tabs toggle
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden'); regForm.classList.add('hidden');
        errorMsg.innerText = ''; pendingMsg.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        regForm.classList.remove('hidden'); loginForm.classList.add('hidden');
        errorMsg.innerText = ''; pendingMsg.classList.add('hidden');
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;

        const user = db.users.find(u => u.email === email && u.pass === pass);
        if (user) {
            sessionStorage.setItem('auditai_session', user.email);
            currentUser = user;
            updateAuthUI();
        } else {
            errorMsg.innerText = "Credenciais incorretas!";
        }
    });

    // Register
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const role = document.getElementById('reg-role').value;

        if (db.users.find(u => u.email === email)) {
            errorMsg.innerText = "E-mail já cadastrado!";
            return;
        }

        const newUser = {
            id: 'u_' + Date.now(),
            name, email, pass, role,
            status: role === 'admin' ? 'aprovado' : 'pendente' // P/ facilitar demo, admin é automático
        };

        db.users.push(newUser);
        saveDB();

        sessionStorage.setItem('auditai_session', newUser.email);
        currentUser = newUser;
        updateAuthUI();
    });

    // Logout
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('auditai_session');
        currentUser = null;
        updateAuthUI();
    });

    // ==========================================
    // NAVIGATION & MOBILE SIDEBAR
    // ==========================================
    const closeSidebar = () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    };

    btnMobileMenu.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
    });
    sidebarOverlay.addEventListener('click', closeSidebar);

    const switchSection = (sectionId) => {
        contentSections.forEach(s => s.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');

        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-target="${sectionId}"]`)?.classList.add('active');

        if (window.innerWidth <= 900) closeSidebar();
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.getAttribute('data-target'));
        });
    });

    // Check auth on load
    updateAuthUI();
});

    // ==========================================
    // AUDIT FLOW MODULE (STEP 1 -> STEP 2 -> STEP 3)
    // ==========================================
    
    let currentAudit = {
        id: null, storeId: null, date: null,
        managerName: '',
        departments: [] // Array of evaluated depts
    };
    let activeDeptId = null;
    let deptResponsibleName = '';
    
    // --- Step 1: Select Store ---
    function populateStores() {
        const grid = document.getElementById('stores-grid');
        grid.innerHTML = '';
        
        let availableStores = db.stores;
        // User role specific filter? Manager sees only his store, let's keep it simple for now and show all. 

        availableStores.forEach(s => {
            const card = document.createElement('div');
            card.className = 'glass select-card';
            card.innerHTML = \<i class="ph ph-storefront card-icon"></i><h4>\</h4><p>\ (Cód: \)</p>\;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('#stores-grid .select-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                currentAudit.storeId = s.id;
                document.getElementById('btn-next-step-1').classList.remove('hidden');
            });
            grid.appendChild(card);
        });
    }

    document.getElementById('btn-next-step-1').addEventListener('click', () => {
        if(!currentAudit.storeId) return;
        
        // Inicializa a auditoria se nao existir
        if(!currentAudit.id) {
            currentAudit.id = 'aud_' + Date.now();
            currentAudit.date = new Date().toISOString();
            currentAudit.departments = [];
        }

        const store = db.stores.find(s => s.id === currentAudit.storeId);
        document.getElementById('current-store-title').innerText = store.name;
        
        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
        populateDepts();
    });

    // --- Step 2: Select Department ---
    function populateDepts() {
        const grid = document.getElementById('depts-grid');
        grid.innerHTML = '';

        db.departments.forEach(d => {
            const isAudited = currentAudit.departments.find(x => x.deptId === d.id);
            
            const card = document.createElement('div');
            card.className = 'glass select-card';
            card.innerHTML = \
                <i class="ph ph-buildings card-icon"></i>
                <h4>\</h4>
                <p>\ Categorias</p>
                \
            \;
            
            card.addEventListener('click', () => {
                if(isAudited) {
                    alert('Este departamento já foi auditado nesta sessão.');
                    return;
                }
                
                const mName = document.getElementById('audit-manager-name').value;
                if(!mName) { alert('Informe o nome do Gerente da Loja antes de iniciar!'); return; }
                currentAudit.managerName = mName;

                activeDeptId = d.id;
                document.getElementById('current-dept-title').innerText = 'Depto: ' + d.name;
                
                document.getElementById('step-2').classList.add('hidden');
                document.getElementById('step-3').classList.remove('hidden');
                updateProgressBar(2);
                populateCategoriesAndItems();
            });

            grid.appendChild(card);
        });

        if(currentAudit.departments.length > 0) {
            document.getElementById('btn-finish-audit').classList.remove('hidden');
        }
    }

    document.getElementById('btn-prev-step-2').addEventListener('click', () => {
        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-1').classList.remove('hidden');
        updateProgressBar(0);
    });

    // --- Step 3: Evaluate Categories & Items ---
    function populateCategoriesAndItems() {
        const container = document.getElementById('categories-container');
        container.innerHTML = '';
        
        db.categories.forEach(cat => {
            const items = db.checklistItems.filter(i => i.cat_id === cat.id);
            if(items.length === 0) return;

            const sec = document.createElement('div');
            sec.className = 'glass';
            sec.style.padding = '20px';
            sec.style.marginBottom = '20px';
            
            let html = \<h4 style="margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">\</h4>\;
            
            items.forEach(item => {
                const criticoBadge = item.eh_critico ? '<span class="badge badge-danger">CRÍTICO</span>' : '';
                html += \
                    <div class="audit-item" data-item="\" style="margin-bottom: 24px;">
                        <p style="font-weight: 500; margin-bottom: 8px;">\ \</p>
                        
                        <div class="rating-group">
                            <button class="rating-btn ruim" data-val="ruim"><i class="ph ph-x-circle"></i> Ruim</button>
                            <button class="rating-btn bom" data-val="bom"><i class="ph ph-check-circle"></i> Bom</button>
                            <button class="rating-btn excelente" data-val="excelente"><i class="ph ph-star"></i> Excelente</button>
                        </div>
                        
                        <textarea class="item-obs hidden" placeholder="Justifique (Obrigatório para Ruim)" style="margin-top: 8px;"></textarea>
                    </div>
                \;
            });

            sec.innerHTML = html;
            container.appendChild(sec);
        });

        // Add event listeners to rating buttons
        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const btns = itemEl.querySelectorAll('.rating-btn');
            const obsEl = itemEl.querySelector('.item-obs');

            btns.forEach(b => {
                b.addEventListener('click', () => {
                    btns.forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    
                    if(b.dataset.val === 'ruim') {
                        obsEl.classList.remove('hidden');
                        obsEl.setAttribute('required', 'true');
                    } else {
                        obsEl.classList.add('hidden');
                        obsEl.removeAttribute('required');
                    }
                });
            });
        });
    }

    document.getElementById('btn-prev-step-3').addEventListener('click', () => {
        if(confirm('As respostas deste departamento serão perdidas. Deseja voltar?')) {
            document.getElementById('step-3').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
            updateProgressBar(1);
        }
    });

    document.getElementById('btn-save-dept').addEventListener('click', () => {
        const respName = document.getElementById('dept-responsible-name').value;
        if(!respName) { alert('Informe o nome do responsável pelo departamento!'); return; }

        let allAnswered = true;
        let deptResponses = [];

        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const activeBtn = itemEl.querySelector('.rating-btn.active');
            if(!activeBtn) { allAnswered = false; return; }

            const val = activeBtn.dataset.val;
            const obs = itemEl.querySelector('.item-obs').value;
            
            if(val === 'ruim' && !obs) {
                allAnswered = false;
                itemEl.querySelector('.item-obs').style.borderColor = 'var(--danger)';
            }

            deptResponses.push({
                itemId: itemEl.dataset.item,
                value: val,
                observations: obs
            });
        });

        if(!allAnswered) {
            alert('Por favor, responda todos os itens. Se "Ruim", a observação é obrigatória.');
            return;
        }

        // Calculate Department Score dynamically based on answers and categorize weights. (Simplified logic for now)
        let earned = 0; let total = deptResponses.length * 10;
        deptResponses.forEach(r => {
            if(r.value === 'bom') earned += 10;
            if(r.value === 'excelente') earned += 10; // Extra points logic could be here
        });

        const percentage = Math.round((earned / total) * 100);

        currentAudit.departments.push({
            deptId: activeDeptId,
            responsible: respName,
            score: earned,
            maxScore: total,
            percentage: percentage,
            responses: deptResponses
        });

        // Reset inputs and go back to step 2
        document.getElementById('dept-responsible-name').value = '';
        document.getElementById('step-3').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
        populateDepts(); // Repopulate to show checkmark
    });

    // --- Finish Audit ---
    document.getElementById('btn-finish-audit').addEventListener('click', () => {
        if(confirm('Deseja concluir a auditoria na loja atual?')) {
            saveAuditFinal();
        }
    });

    function saveAuditFinal() {
        // Calculate total score
        let tEarned = 0; let tMax = 0;
        currentAudit.departments.forEach(d => {
            tEarned += d.score;
            tMax += d.maxScore;
        });

        currentAudit.percentage = Math.round((tEarned / tMax) * 100);
        
        let rank = 'Insuficiente';
        if(currentAudit.percentage >= 100) rank = 'Excelente';
        else if (currentAudit.percentage >= 70) rank = 'Bom';
        else if (currentAudit.percentage >= 50) rank = 'Regular';
        
        currentAudit.classification = rank;
        currentAudit.auditor = currentUser.name;

        db.audits.push(JSON.parse(JSON.stringify(currentAudit))); // deep copy
        saveDB();

        // Reset Memory
        currentAudit = { id: null, storeId: null, date: null, managerName: '', departments: [] };
        
        // Show Report
        const justSaved = db.audits[db.audits.length - 1];
        showReport(justSaved);
    }

    function updateProgressBar(stepIndex) {
        const bar = document.getElementById('audit-progress-bar');
        bar.innerHTML = '';
        for(let i=0; i<3; i++) {
            const d = document.createElement('div'); d.className = 'step-dot';
            if(i < stepIndex) d.classList.add('done');
            else if(i === stepIndex) d.classList.add('current');
            bar.appendChild(d);
        }
    }
    updateProgressBar(0);


    // ==========================================
    // REPORT VIEW MODULE
    // ==========================================
    function showReport(auditObj) {
        document.getElementById('audit-flow').classList.add('hidden');
        document.getElementById('report-view').classList.remove('hidden');

        const store = db.stores.find(s => s.id === auditObj.storeId);
        document.getElementById('report-store-name').innerText = store ? store.name : 'Loja Desconhecida';
        
        const dateObj = new Date(auditObj.date);
        document.getElementById('report-date').innerText = \Data: \ | Auditor: \\;
        
        document.getElementById('report-score').innerText = auditObj.percentage + '%';
        
        const cBadge = document.getElementById('report-classification');
        cBadge.innerText = auditObj.classification;
        cBadge.className = 'badge'; // reset
        if(auditObj.classification === 'Excelente') cBadge.classList.add('badge-success');
        else if(auditObj.classification === 'Bom') cBadge.classList.add('badge-info');
        else if(auditObj.classification === 'Regular') cBadge.classList.add('badge-warning');
        else cBadge.classList.add('badge-danger');

        const deptContainer = document.getElementById('report-depts-summary');
        deptContainer.innerHTML = '';
        const critContainer = document.getElementById('report-critical-items');
        critContainer.innerHTML = '';

        auditObj.departments.forEach(d => {
            const dName = db.departments.find(x => x.id === d.deptId)?.name || 'Depto';
            
            // Dept Progress Bar
            let color = '#34d399';
            if(d.percentage < 50) color = '#ef4444';
            else if(d.percentage < 70) color = '#f59e0b';
            else if(d.percentage < 100) color = '#60a5fa';

            deptContainer.innerHTML += \
                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                        <span>\ <small style="color:var(--text-muted);">(Resp: \)</small></span>
                        <span style="font-weight:600;">\%</span>
                    </div>
                    <div class="progress-wrap">
                        <div class="progress-fill" style="width: \%; background:\"></div>
                    </div>
                </div>
            \;

            // Critical Items Extraction
            d.responses.forEach(r => {
                if(r.value === 'ruim') {
                    const iObj = db.checklistItems.find(x => x.id === r.itemId);
                    critContainer.innerHTML += \
                        <div style="background: rgba(239,68,68,0.1); border-left: 3px solid var(--danger); padding: 12px; border-radius: 4px;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">[\] - \</p>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Obs: \</p>
                        </div>
                    \;
                }
            });
        });

        if(critContainer.innerHTML === '') {
            critContainer.innerHTML = '<p style="color:var(--text-muted);">Nenhum ponto crítico ou observação negativa encontrada.</p>';
        }
    }

    document.getElementById('btn-back-report').addEventListener('click', () => {
        document.getElementById('report-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
        document.querySelector('.nav-btn[data-target="dashboard-view"]').click();
    });

    // ==========================================
    // HISTORY MODULE
    // ==========================================
    function renderAuditsHistory() {
        const tbody = document.getElementById('audits-table-body');
        tbody.innerHTML = '';

        if(db.audits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma auditoria realizada ainda.</td></tr>';
            return;
        }

        db.audits.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(aud => {
            const store = db.stores.find(s => s.id === aud.storeId)?.name || 'Loja Excluída';
            const dateStr = new Date(aud.date).toLocaleDateString('pt-BR');
            
            let badgeClass = 'badge-danger';
            if(aud.classification === 'Excelente') badgeClass = 'badge-success';
            else if(aud.classification === 'Bom') badgeClass = 'badge-info';
            else if(aud.classification === 'Regular') badgeClass = 'badge-warning';

            const tr = document.createElement('tr');
            tr.innerHTML = \
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td style="font-weight:600;">\%</td>
                <td><span class="badge \">\</span></td>
                <td><button class="btn btn-ghost" onclick='window.viewReportModal("\")'><i class="ph ph-eye"></i></button></td>
            \;
            tbody.appendChild(tr);
        });
    }

    window.viewReportModal = function(auditId) {
        const aud = db.audits.find(a => a.id === auditId);
        if(aud) showReport(aud);
    };

    // ==========================================
    // DASHBOARD & CHARTS
    // ==========================================
    let dashChartEvo = null;
    let dashChartDept = null;

    function renderDashboard() {
        // KPI calculations
        const audits = db.audits;
        document.getElementById('kpi-total-audits').innerText = audits.length;
        
        let uniqueStores = new Set(audits.map(a => a.storeId)).size;
        document.getElementById('kpi-stores-audited').innerText = uniqueStores;

        let tScore = 0;
        let cIssues = 0;

        audits.forEach(a => {
            tScore += a.percentage;
            a.departments.forEach(d => {
                cIssues += d.responses.filter(r => r.value === 'ruim').length;
            });
        });

        document.getElementById('kpi-avg-score').innerText = audits.length > 0 ? Math.round(tScore / audits.length) + '%' : '0%';
        document.getElementById('kpi-critical-issues').innerText = cIssues;
        document.getElementById('gauge-score').innerText = document.getElementById('kpi-avg-score').innerText;

        renderCharts(audits);
    }

    function renderCharts(audits) {
        // Chart.js Default styling for dark mode
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Timeline evolution chart
        const ctxEvo = document.getElementById('chart-evolution');
        if(dashChartEvo) dashChartEvo.destroy();

        const dates = audits.map(a => new Date(a.date).toLocaleDateString('pt-BR')).reverse();
        const scores = audits.map(a => a.percentage).reverse();

        if(ctxEvo) {
            dashChartEvo = new Chart(ctxEvo, {
                type: 'line',
                data: {
                    labels: dates.length > 0 ? dates : ['Sem dados'],
                    datasets: [{
                        label: 'Desempenho Geral (%)',
                        data: scores.length > 0 ? scores : [0],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { min: 0, max: 100 } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    // Call render dashboard when switching to it
    document.getElementById('nav-dashboard').addEventListener('click', renderDashboard);

    // ==========================================
    // ADMIN MODULE
    // ==========================================
    function renderAdminUsers() {
        const tbody = document.getElementById('admin-users-body');
        tbody.innerHTML = '';
        
        db.users.forEach(u => {
            const tr = document.createElement('tr');
            const roleName = u.role === 'admin' ? 'Administrador' : (u.role === 'manager' ? 'Gerente' : 'Auditor');
            const statusBadge = u.status === 'aprovado' ? '<span class="badge badge-success">Aprovado</span>' : '<span class="badge badge-warning">Pendente</span>';
            
            const btnApprove = u.status === 'pendente' ? \<button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick='window.approveUser("\")'>Aprovar</button>\ : '';

            tr.innerHTML = \
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td>\</td>
            \;
            tbody.appendChild(tr);
        });
    }

    window.approveUser = function(userId) {
        const u = db.users.find(x => x.id === userId);
        if(u) {
            u.status = 'aprovado';
            saveDB();
            renderAdminUsers();
        }
    };

    function renderAdminStores() {
        const tbody = document.getElementById('admin-stores-body');
        tbody.innerHTML = '';
        db.stores.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = \
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td>
                    <button class="btn btn-ghost" onclick='alert("Editar loja (Em breve)")'><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-ghost" style="color:var(--danger);" onclick='alert("Excluir loja (Em breve)")'><i class="ph ph-trash"></i></button>
                </td>
            \;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('nav-admin').addEventListener('click', () => {
        renderAdminUsers();
        renderAdminStores();
    });

    // Admin Tabs Logic
    document.querySelectorAll('#admin-view .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#admin-view .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#admin-view .tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Dashboard Tabs Logic
    document.querySelectorAll('#dashboard-view .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#dashboard-view .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#dashboard-view .tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

