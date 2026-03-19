const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Force global loadDB() call before updateAuthUI()
content = content.split('updateAuthUI();').join('if(typeof loadDB === "function") loadDB(); updateAuthUI();');

// 2. Fix updateAuthUI logic (Simplified and robust)
const updateAuthUIRegex = /const updateAuthUI = \(\) => \{[\s\S]*?sidebarAvatar\.innerText = currentUser\.name\.charAt\(0\)\.toUpperCase\(\);/g;
const robustUpdateAuthUI = `const updateAuthUI = () => {
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
                sidebarUserName.innerText = currentUser.name.split(' ')[0];
                sidebarUserRole.innerText = currentUser.role === 'admin' ? 'Administrador' : 'Usuário';
                sidebarAvatar.innerText = currentUser.name.charAt(0).toUpperCase();`;

content = content.replace(updateAuthUIRegex, robustUpdateAuthUI);

// 3. Completely remove any debugger or console.clear loops
content = content.replace(/debugger/g, '// debugger disabled');
content = content.replace(/console\.clear\(\)/g, '// console.clear disabled');

// 4. Final Balance Cleanup
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
console.log("Fixing Stack:", stack.join(''));
while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') content += '\n}';
    else if (last === '(') content += ')';
    else if (last === '[') content += ']';
}
content += ';\n';

fs.writeFileSync('app.js', content, 'utf8');
console.log("Universal Patch Applied.");
