
const fs = require('fs');

const supabaseUrl = 'https://nxyziofojebwqvdufoyb.supabase.co/rest/v1/app_state';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXppb2ZvamVid3F2ZHVmb3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTgyNjcsImV4cCI6MjA4ODczNDI2N30.0wgbyBSZdkNDJCQYZgGO19NcV6oVo9TUEOaRruh82K0';

async function updateMaster() {
    try {
        let data = fs.readFileSync('c:/Users/user/Desktop/ANTIGRAVITY/auditai/auditai_backup_usuario.json', 'utf8');
        let db = null;
        for (let i = data.length; i > 0; i--) {
            try {
                db = JSON.parse(data.substring(0, i));
                break;
            } catch (e) {}
        }
        
        if (!db) throw new Error("Não foi possível parsear o JSON.");

        const bodyJSON = {
            id: 'auditai_main',
            db_data: {
                users: db.users || [],
                stores: db.stores || [],
                departments: db.departments || [],
                categories: db.categories || [],
                checklistItems: db.checklistItems || [],
                companies: db.companies || [],
                config: db.config || {}
            }
        };

        const body = JSON.stringify(bodyJSON);

        console.log("Fazendo upload para auditai_main via REST API...");
        const response = await fetch(supabaseUrl + '?id=eq.auditai_main', {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        console.log("Sucesso! O banco de dados mestre foi atualizado.");
    } catch (err) {
        console.error("Erro na sincronização:", err.message);
    }
}

updateMaster();
