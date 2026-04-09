const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  virtualConsole: new jsdom.VirtualConsole().sendTo(console)
});

dom.window.addEventListener("error", (event) => {
  console.error("Runtime error caught:", event.error);
});

setTimeout(() => {
    console.log("Lecture Grid HTML:");
    console.log(dom.window.document.getElementById('lectureGrid') ? dom.window.document.getElementById('lectureGrid').innerHTML.length : 'NULL');
    console.log("ChatBtn display:", dom.window.document.getElementById('chatBtn') ? dom.window.document.getElementById('chatBtn').style.display : 'NULL');
}, 1000);
