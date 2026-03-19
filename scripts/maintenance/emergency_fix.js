const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Remove Debugger Loop entirely
const debuggerRegex = /\/\/ 3\. Sistema Anti-Debugger[\s\S]*?\/\/ 4\. Timer de Inatividade/g;
const simpleAD = `// 3. Sistema Anti-Debugger (Desativado para Estabilidade)
    // Monitoramento básico removido para evitar congelamento.
    
    `;
content = content.replace(debuggerRegex, simpleAD + "// 4. Timer de Inatividade");

// 2. Ensure loadDB() is called at the end of DOMContentLoaded
// Search where updateAuthUI is called
const authCall = 'updateAuthUI();';
if (content.includes(authCall) && !content.includes('loadDB();')) {
    content = content.replace(authCall, 'loadDB();\n    updateAuthUI();');
}

// 3. Final structural cleaning
content = content.trim();
// Remove everything after the last real code and re-add closures until balanced
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
console.log("Remaining Stack:", stack.join(''));
while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') content += '\n}';
    else if (last === '(') content += ')';
    else if (last === '[') content += ']';
}
content += ';\n';

fs.writeFileSync('app.js', content, 'utf8');
console.log("Emergency Patch Applied.");
