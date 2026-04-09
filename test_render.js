const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Evaluate the script safely to just get CONFIG
const initStr = "let CONFIG;" + scriptContent.split('/* ── State ── */')[0].replace('const CONFIG', 'CONFIG');
eval(initStr);

let hasError = false;
CONFIG.lectures.forEach((lec, i) => {
    if (typeof lec.title !== 'string') { console.log(`Error in title index ${i}`); hasError = true; }
    if (typeof lec.description !== 'string') { console.log(`Error in description index ${i}`); hasError = true; }
});
if (!hasError) console.log("All lectures strictly valid strings.");
