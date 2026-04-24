const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update Google Fonts link
html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+KR:wght@300;400;500;700;900&display=swap"\s*rel="stylesheet" \/>/g,
    `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />`
);

// Update :root CSS variables
html = html.replace(
    /:root\s*\{[\s\S]*?\}/,
    `:root {
            --bg: #000000;
            --card: #141414;
            --accent: #414141;
            --point: #ffde59;
            --point-dim: #ccb247;
            --text: #ffffff;
            --text-dark: #151515;
            --muted: #a0a0a0;
            --border: rgba(65, 65, 65, 0.8);
            --radius: 4px;
            --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
        }`
);

// Update body font and background
html = html.replace(
    /body \{ font-family: 'Noto Sans KR', sans-serif; background: var\(--bg\); color: var\(--text\); min-height: 100vh; line-height: 1\.7; \}/,
    `body { font-family: 'Inter', 'Noto Sans KR', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; line-height: 1.7; }
        h1, h2, h3 { font-family: 'Inter', 'Noto Sans KR', sans-serif; letter-spacing: -0.02em; }`
);

// Update .btn-primary
html = html.replace(
    /\.btn-primary\s*\{[\s\S]*?\}/,
    `.btn-primary {
            width: 100%; padding: 14px; background: var(--point);
            color: var(--text-dark); border: 1px solid var(--point); border-radius: var(--radius); font-weight: 800; cursor: pointer;
            transition: transform 0.2s, background 0.2s;
        }`
);
html = html.replace(
    /\.btn-primary:hover\s*\{[\s\S]*?\}/,
    `.btn-primary:hover { transform: translateY(-2px); background: #e5c750; }`
);

// Update .header-nav button
html = html.replace(
    /\.header-nav button\.active\s*\{[\s\S]*?\}/,
    `.header-nav button.active { color: var(--point); }
        .header-nav button:hover { color: var(--point); }`
);

// Update .btn-logout
html = html.replace(
    /\.btn-logout\s*\{[\s\S]*?\}/,
    `.btn-logout { margin-left: auto; background: transparent; color: var(--text); border-radius: var(--radius); padding: 7px 14px; cursor: pointer; border: 1px solid var(--accent); font-size: 0.8rem; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
        .btn-logout:hover { border-color: var(--point); color: var(--point); }`
);

// Update .btn-submit-plan
html = html.replace(
    /\.btn-submit-plan\s*\{[\s\S]*?\}/,
    `.btn-submit-plan { background: var(--point); color: var(--text-dark); border: 1px solid var(--point); padding: 14px; border-radius: var(--radius); font-weight: 800; cursor: pointer; font-size: 1rem; transition: transform 0.2s, background 0.2s; }`
);
html = html.replace(
    /\.btn-submit-plan:hover\s*\{[\s\S]*?\}/,
    `.btn-submit-plan:hover { transform: translateY(-2px); background: #e5c750; }`
);

// Update planner-result background
html = html.replace(
    /background: rgba\(15, 52, 96, 0\.5\); border: 1px solid var\(--accent\);/,
    `background: var(--card); border: 1px solid var(--accent);`
);

// Update planner-result strong
html = html.replace(
    /\.planner-result strong\s*\{[\s\S]*?\}/,
    `.planner-result strong { color: var(--point); font-weight: 800; background: rgba(255, 222, 89, 0.1); padding: 2px 6px; border-radius: 4px; }`
);

// Update chat-btn
html = html.replace(
    /\.chat-btn\s*\{[\s\S]*?\}/,
    `.chat-btn { 
            position: fixed; right: 24px; bottom: 24px; 
            padding: 0 20px; height: 56px; border-radius: 28px; 
            background: var(--point); color: var(--text-dark); border: 1px solid var(--point); 
            cursor: pointer; z-index: 900; display: flex; align-items: center; 
            gap: 10px; font-size: 1rem; font-weight: 800;
            box-shadow: 0 8px 24px rgba(255, 222, 89, 0.2); 
            transition: transform 0.3s, background 0.3s;
        }`
);
html = html.replace(
    /\.chat-btn:hover\s*\{[\s\S]*?\}/,
    `.chat-btn:hover { transform: scale(1.05) translateY(-2px); background: #e5c750; }`
);
html = html.replace(
    /rgba\(233,69,96,0\.4\)/g,
    `rgba(255, 222, 89, 0.2)`
);
html = html.replace(
    /rgba\(233, 69, 96, 0\.2\)/g,
    `rgba(255, 222, 89, 0.2)`
);
html = html.replace(
    /rgba\(233, 69, 96, 0\.12\)/g,
    `rgba(255, 222, 89, 0.12)`
);
html = html.replace(
    /rgba\(233, 69, 96, 0\.1\)/g,
    `rgba(255, 222, 89, 0.1)`
);
html = html.replace(
    /rgba\(233, 69, 96, 0\.3\)/g,
    `rgba(255, 222, 89, 0.3)`
);

// Update chat-msg.user
html = html.replace(
    /\.chat-msg\.user\s*\{[\s\S]*?\}/,
    `.chat-msg.user { align-self: flex-end; background: var(--point); color: var(--text-dark); border-bottom-right-radius: 2px; }`
);
html = html.replace(
    /\.chat-input-area button:hover\s*\{[\s\S]*?\}/,
    `.chat-input-area button:hover { background: #e5c750; }`
);
html = html.replace(
    /\.chat-input-area button\s*\{[\s\S]*?\}/,
    `.chat-input-area button { background: var(--point); border: none; color: var(--text-dark); padding: 0 16px; border-radius: var(--radius); cursor: pointer; font-weight: 800; transition: background 0.2s; }`
);

fs.writeFileSync('index.html', html);
console.log('Update applied');
