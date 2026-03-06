    const appJSPath = 'c:\\Users\\user\\Desktop\\ANTIGRAVITY\\auditai\\app.js';
    let content = require('fs').readFileSync(appJSPath, 'utf8');

    // Fix the broken template literals injected via powershell
    content = content.replace(/\\\\n                <td>\\$\\{c\\.id\\}<\\/td>/g, '\\\n                <td>\</td>');
    content = content.replace(/\\\\n                <td>\\$\\{d\\.id\\}<\\/td>/g, '\\\n                <td>\</td>');
    content = content.replace(/\\\\n                <td>\\$\\{i\\.id\\}<\\/td>/g, '\\\n                <td>\</td>');

    // Remove the bad blocks and rewrite them cleanly
    const safeContent = content.replace(/window\.renderAdminCompanies = function\(\) \{[\s\S]*?renderAdminChecklists\(\);\n        \}\);\n    \}/, '');
    
    require('fs').writeFileSync(appJSPath, safeContent);
    console.log('Cleaned file');
