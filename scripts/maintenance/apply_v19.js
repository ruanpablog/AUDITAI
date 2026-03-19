const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Clean updateAuthUI - Removing the accidental "appView.classList.add('hidden')" at the end
const uiRegex = /const updateAuthUI = \(\) => \{[\s\S]*?renderAuditHistory\(\);[\s\S]*?appView\.classList\.add\('hidden'\);/g;
if (content.match(uiRegex)) {
    const replacement = `const updateAuthUI = () => {
        if (!currentUser && db.users) {
            const sessionEmail = sessionStorage.getItem('auditai_session');
            if (sessionEmail) currentUser = db.users.find(u => u.email === sessionEmail);
        }

        if (currentUser) {
            if (currentUser.status === 'pendente') {
                authView.classList.remove('hidden');
                appView.classList.add('hidden');
                pendingMsg.classList.remove('hidden');
            } else {
                authView.classList.add('hidden');
                appView.classList.remove('hidden');
                
                // Tema da Empresa
                if (currentUser.companyId && db.companies) {
                    const comp = db.companies.find(c => c.id === currentUser.companyId);
                    if (comp && comp.colors) {
                        document.documentElement.style.setProperty('--primary', comp.colors.primary);
                        document.documentElement.style.setProperty('--primary-hover', comp.colors.primary);
                        document.documentElement.style.setProperty('--secondary', comp.colors.secondary);
                        document.documentElement.style.setProperty('--accent', comp.colors.accent);
                    }
                }
                
                sidebarUserName.innerText = currentUser.name.split(' ')[0];
                sidebarUserRole.innerText = currentUser.role === 'admin' ? 'Administrador' : 'Usuário';
                sidebarAvatar.innerText = currentUser.name.charAt(0).toUpperCase();

                if (currentUser.role === 'admin') {
                    document.getElementById('nav-admin').classList.remove('hidden');
                } else {
                    document.getElementById('nav-admin').classList.add('hidden');
                }

                populateStores();
                renderAuditHistory();
            }
        } else {
            authView.classList.remove('hidden');
            appView.classList.add('hidden');
        }`;
    content = content.replace(uiRegex, replacement);
}

// 2. Fix the Redundant Injections throughout the file
content = content.split('if(typeof loadDB === "function") loadDB(); updateAuthUI();').join('updateAuthUI();');
content = content.split('if (typeof loadDB === "function") loadDB(); updateAuthUI();').join('updateAuthUI();');
content = content.split('loadDB();\n    updateAuthUI();').join('updateAuthUI();');

// 3. Final structural balance check
content = content.trim();
while (content.endsWith('});') || content.endsWith('}') || content.endsWith(');')) {
    if (content.endsWith('});')) content = content.slice(0, -3).trim();
    else if (content.endsWith('}')) content = content.slice(0, -1).trim();
    else if (content.endsWith(');')) content = content.slice(0, -2).trim();
}

function getBalance(text) {
    let stack = [];
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '{' || c === '(' || c === '[') stack.push(c);
        else if (c === '}' || c === ')' || c === ']') {
            if (stack.length === 0) continue;
            const last = stack[stack.length - 1];
            if ((c === '}' && last === '{') || (c === ')' && last === '(') || (c === ']' && last === '[')) stack.pop();
        }
    }
    return stack;
}

let stack = getBalance(content);
console.log("Fixing Balance Stack:", stack.join(''));
while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') content += '\n}';
    else if (last === '(') content += ')';
    else if (last === '[') content += ']';
}
content += ';\n';

fs.writeFileSync('app.js', content, 'utf8');
console.log("Implementation Plan v19 Applied Successfully.");
