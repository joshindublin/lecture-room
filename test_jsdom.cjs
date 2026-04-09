const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, { 
    runScripts: "dangerously", 
    resources: "usable",
    url: "http://localhost/" 
});

dom.window.addEventListener('error', (event) => {
    console.error("JSDOM Window Error:", event.error);
});

setTimeout(() => {
    console.log("Lecture Grid length before unlock:", dom.window.document.getElementById('lectureGrid')?.innerHTML.length);
    
    // Evaluate checkAuth to bypass
    dom.window.sessionStorage.setItem('lrAuth', "LECTURE2026");
    
    // Just call renderDashboard()
    try {
        dom.window.eval('renderDashboard()');
        console.log("Lecture Grid length after render:", dom.window.document.getElementById('lectureGrid')?.innerHTML.length);
    } catch(e) {
        console.error("Eval Error:", e);
    }
    process.exit();
}, 2000);
