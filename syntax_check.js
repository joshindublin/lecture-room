const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if(match) {
  fs.writeFileSync('test_syntax.cjs', match[1]);
}
