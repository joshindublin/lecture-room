
        /* ═══════════════════════════════════════════════════════════
           ██████  CONFIG — 여기만 수정하세요
           ═══════════════════════════════════════════════════════════ */
        const CONFIG = {

            /* 접근 코드 (대소문자 구분) */
            ACCESS_CODE: "LECTURE2026",


            /* 강의 목록
               driveFileId: 구글 드라이브 파일 URL에서 /d/ 뒤의 ID를 복사해 넣으세요
               예) https://drive.google.com/file/d/1aBcD.../view  →  "1aBcD..."
            */
            lectures: [
                {
                    id: 1,
                    title: "1강. 콘텐츠 기획의 본질 만드는 것이 아닌 문제 해결",
                    description: "",
                    driveFileId: "1DdMMjBPxqhoTxwyI4mltySNihHC4MWOG"
                },
                {
                    id: 2,
                    title: "2강. 페르소나를 넘어선 페인 포인트(Pain Point) 분석법",
                    description: "",
                    driveFileId: "1wSslbU4hs0NrqrHyROZlCbmYRsXRx8O3"
                },
                {
                    id: 3,
                    title: "3강. 절대 마르지 않는 콘텐츠 아이디어 뽑는 법",
                    description: "",
                    driveFileId: "1XbthIhZLxl1IAk4YbSVDSe4HprTMcnW9"
                },
                {
                    id: 4,
                    title: "4강. 팔리는 콘텐츠를 만드는 3단계 기획 프레임워크",
                    description: "",
                    driveFileId: "1LyL29KNYk-KFZ3H5YDj1bTJh5vu4wde4"
                },
                {
                    id: 5,
                    title: "5강. 고객을 멈추게 만드는 후킹 기획의 기술",
                    description: "",
                    driveFileId: "1q7rEzMrtYCe4EO2CyLolStsFEsHYNKg8"
                },
                {
                    id: 6,
                    title: "6강. 콘텐츠는 크게 2가지로 나뉜다 (정보성 vs 브랜딩)",
                    description: "",
                    driveFileId: "1gxKjFZqYP_QUVR8eR2f4RA9ysGvYygwN"
                },
                {
                    id: 7,
                    title: "7강. 사람의 심리를 이용한 7가지 콘텐츠 기획법",
                    description: "",
                    driveFileId: "1b-IJq3xw5bXquCre9PNaUnqDUc7qWAkJ"
                },
                {
                    id: 8,
                    title: "8강. 조회수는 우연, 전환은 설계. 콘텐츠 기획의 끝은 매출이다",
                    description: "",
                    driveFileId: "1jYTrtwsP1tqJyqv9N5_FBdLQvq3Wn8If"
                },
                {
                    id: 9,
                    title: "9강. 콘텐츠의 조회수는 정해져 있다 - 표본의 법칙",
                    description: "",
                    driveFileId: "1iCEZPCZpKiTaOew0qHqMSGzDvKnTaa76"
                },
                {
                    id: 10,
                    title: "10강. 편집 왕초보도 10분 만에 릴스 만들기 - 인스타 기능 & 리믹스 활용법",
                    description: "",
                    driveFileId: "1TZEkAZw6_dXZm0sN9YZM3p1K1-8phpJ6"
                },
                {
                    id: 11,
                    title: "11강. 캡컷 릴스 편집의 기본 - 30분이면 프로처럼 편집하기",
                    description: "",
                    driveFileId: "1fdFNNj1N30lem5Y1eQ7xCB12E49_n6qU"
                },
                {
                    id: 12,
                    title: "12강. 조회수 폭발하는 릴스 편집 공식 - 3초 법칙과 리텐션 편집",
                    description: "",
                    driveFileId: "1f1sp6IipRZCRAfybilpqSPwWAtViTGWQ"
                },
                {
                    id: 13,
                    title: "13강. 콘텐츠 유형별 편집 템플릿 - 따라만 하면 되는 편집 레시피",
                    description: "",
                    driveFileId: "1_Q3B34nyPxmgP61cIZTKA4adshTiBB0F"
                },
                {
                    id: 14,
                    title: "14강. 100만 바이럴 릴스의 공통점 - 성공하는 편집 패턴 분석",
                    description: "",
                    driveFileId: "1-evqEkVpCQAsQz_5p-MYhCuzobIIfL2-"
                },
                {
                    id: 15,
                    title: "15강. AI를 활용한 콘텐츠 제작 시간 10배 효율화 방법",
                    description: "",
                    driveFileId: "1HZepRcfoYirGOmY4Td4_WqF2qlMrBOO_"
                },
                {
                    id: 16,
                    title: "16강. AI를 활용한 레퍼런스 분석 및 100만 콘텐츠 기획법",
                    description: "",
                    driveFileId: "1K_tmkuzYBKxIDfbZsg5mw6t445UX0jLq"
                },
                {
                    id: 17,
                    title: "17강. 실제 매출을 키워주는 찐팬을 만드는 인스타그램 운영 전략",
                    description: "",
                    driveFileId: "1Ffl4rEpTPC783JWaQ355yzuS7ewFpRYQ"
                }
            ]

        };
        /* ═══════════════════════════════════════════════════════════
           CONFIG 끝 — 아래는 수정 불필요
           ═══════════════════════════════════════════════════════════ */

        /* ── State ── */
        let currentLectureId = null;

        /* ── Watch Progress (localStorage) ── */
        const LS_KEY = 'lrWatched';

        function getWatched() {
            try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
            catch { return []; }
        }

        function isWatched(id) {
            return getWatched().includes(id);
        }

        function setWatched(id, done) {
            const watched = getWatched();
            if (done && !watched.includes(id)) watched.push(id);
            if (!done) {
                const idx = watched.indexOf(id);
                if (idx > -1) watched.splice(idx, 1);
            }
            localStorage.setItem(LS_KEY, JSON.stringify(watched));
        }

        function updateCompleteBtn() {
            const btn = document.getElementById('btnComplete');
            if (!btn) return;
            const watched = isWatched(currentLectureId);
            btn.classList.toggle('done', watched);
            btn.innerHTML = watched
                ? '✅ 시청 완료됨 (취소하기)'
                : '✓ 시청 완료로 표시';
        }

        function toggleWatched() {
            setWatched(currentLectureId, !isWatched(currentLectureId));
            updateCompleteBtn();
        }

        function updateProgressBar() {
            const total = CONFIG.lectures.length;
            const done = getWatched().length;
            const pct = Math.round((done / total) * 100);
            document.getElementById('progressCount').textContent = `${done} / ${total} 완료`;
            document.getElementById('progressFill').style.width = pct + '%';
            document.getElementById('progressPct').textContent = pct + '%';
        }

        /* ── Auth ── */
        function checkAuth() {
            return sessionStorage.getItem('lrAuth') === CONFIG.ACCESS_CODE;
        }

        document.getElementById('unlockBtn').addEventListener('click', attemptUnlock);
        document.getElementById('codeInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') attemptUnlock();
            document.getElementById('errorMsg').textContent = '';
        });

        function attemptUnlock() {
            const val = document.getElementById('codeInput').value.trim();
            if (val === CONFIG.ACCESS_CODE) {
                sessionStorage.setItem('lrAuth', CONFIG.ACCESS_CODE);
                const lock = document.getElementById('lockScreen');
                lock.classList.add('fade-out');
                setTimeout(() => {
                    lock.style.display = 'none';
                    document.getElementById('app').style.display = 'block';
                    renderDashboard();
                }, 500);
            } else {
                const err = document.getElementById('errorMsg');
                err.textContent = '❌ 잘못된 코드입니다. 다시 확인해주세요.';
                const input = document.getElementById('codeInput');
                input.value = '';
                input.focus();
                input.style.borderColor = '#e94560';
                setTimeout(() => input.style.borderColor = '', 1500);
            }
        }

        function logout() {
            sessionStorage.removeItem('lrAuth');
            sessionStorage.removeItem('lrChatHistory'); // Logout clears chat history
            document.getElementById('videoFrame').src = '';
            document.getElementById('app').style.display = 'none';
            document.getElementById('chatBtn').style.display = 'none';
            document.getElementById('chatTooltip').style.display = 'none';
            document.getElementById('chatWindow').classList.remove('open');
            document.getElementById('chatMessages').innerHTML = '<div class="chat-msg ai">안녕하세요! 강의 관련 궁금한 점을 자유롭게 질문해주세요 😊</div>';
            const lock = document.getElementById('lockScreen');
            lock.style.display = 'flex';
            lock.classList.remove('fade-out');
            lock.style.opacity = '1';
            document.getElementById('codeInput').value = '';
            document.getElementById('errorMsg').textContent = '';
        }

        /* ── SPA Routing ── */
        function showPage(name) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + name);
            if (target) target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (name !== 'video') {
                document.getElementById('videoFrame').src = '';
                renderDashboard();
            }
        }

        /* ── Dashboard ── */
        function renderDashboard() {
            updateProgressBar();
            const grid = document.getElementById('lectureGrid');
            grid.innerHTML = CONFIG.lectures.map(lec => {
                const done = isWatched(lec.id);
                return `
    <div class="lecture-card${done ? ' watched' : ''}" onclick="playLecture(${lec.id})">
      <div class="card-thumbnail">
        <span class="card-num">Lec ${lec.id}</span>
        ${done ? '<span class="watched-badge">✓ 완료</span>' : ''}
        <div class="play-icon">▶</div>
      </div>
      <div class="card-body">
        <div class="card-title">${escHtml(lec.title)}</div>
        <div class="card-desc">${escHtml(lec.description)}</div>
      </div>
      <div class="card-footer${done ? ' done' : ''}">
        ${done ? '✅ 시청 완료' : '▶ 강의 시청하기'}
      </div>
    </div>
  `;
            }).join('');
        }

        /* ── Video ── */
        function playLecture(id) {
            const lec = CONFIG.lectures.find(l => l.id === id);
            if (!lec) return;
            currentLectureId = id;

            document.getElementById('videoTitle').textContent = lec.title;
            document.getElementById('videoDesc').textContent = lec.description;
            document.getElementById('videoFrame').src =
                `https://drive.google.com/file/d/${lec.driveFileId}/preview`;

            const idx = CONFIG.lectures.findIndex(l => l.id === id);
            document.getElementById('btnPrev').disabled = idx === 0;
            document.getElementById('btnNext').disabled = idx === CONFIG.lectures.length - 1;

            showPage('video');
            updateCompleteBtn();

        }

        function navigateLecture(delta) {
            const idx = CONFIG.lectures.findIndex(l => l.id === currentLectureId);
            const next = CONFIG.lectures[idx + delta];
            if (next) playLecture(next.id);
        }

        /* ── Utils ── */
        function escHtml(str) {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        /* ── Init ── */
        (function init() {
            if (checkAuth()) {
                document.getElementById('lockScreen').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                document.getElementById('chatBtn').style.display = 'flex';

                // 첫 방문 시 말풍선
                if (!sessionStorage.getItem('lrChatTooltipShown')) {
                    setTimeout(() => {
                        const tt = document.getElementById('chatTooltip');
                        if (tt) tt.style.display = 'block';
                        setTimeout(() => {
                            if (tt) { tt.style.opacity = '0'; setTimeout(() => tt.style.display = 'none', 500); }
                        }, 5000);
                        sessionStorage.setItem('lrChatTooltipShown', 'true');
                    }, 1000);
                }

                loadChatHistory();
                renderDashboard();
            } else {
                document.getElementById('codeInput').focus();
            }
        })();

        /* ── Chatbot Logic ── */
        let chatHistory = [];
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSubmitBtn = document.getElementById('chatSubmitBtn');

        function loadChatHistory() {
            const saved = sessionStorage.getItem('lrChatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
                chatMessages.innerHTML = '';
                chatHistory.forEach(msg => {
                    if (msg.role !== 'system') {
                        const el = document.createElement('div');
                        el.className = 'chat-msg ' + (msg.role === 'user' ? 'user' : 'ai');
                        el.textContent = msg.content;
                        chatMessages.appendChild(el);

                        if (msg.role === 'model' && msg._rowId) {
                            renderFeedbackButtons(el, msg._rowId, msg._feedbackSent);
                        }
                    }
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                chatMessages.innerHTML = '<div class="chat-msg ai">안녕하세요! 강의 관련 궁금한 점을 자유롭게 질문해주세요 😊</div>';
            }
        }

        function toggleChat() {
            document.getElementById('chatWindow').classList.toggle('open');
            document.getElementById('chatTooltip').style.display = 'none';
        }

        function handleChatKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        }

        function renderFeedbackButtons(container, rowId, alreadySent) {
            if (!rowId) return;
            const fbwrapper = document.createElement('div');
            if (alreadySent) {
                fbwrapper.className = 'chat-feedback done';
                fbwrapper.textContent = '의견 감사합니다!';
            } else {
                fbwrapper.className = 'chat-feedback';
                const upBtn = document.createElement('button');
                upBtn.textContent = '👍';
                upBtn.onclick = () => submitFeedback(rowId, '👍', fbwrapper);
                const downBtn = document.createElement('button');
                downBtn.textContent = '👎';
                downBtn.onclick = () => {
                    const comment = prompt("어떤 점이 아쉬웠나요?");
                    if (comment !== null) submitFeedback(rowId, '👎', fbwrapper, comment);
                };
                fbwrapper.appendChild(upBtn);
                fbwrapper.appendChild(downBtn);
            }
            container.insertAdjacentElement('afterend', fbwrapper);
        }

        async function submitFeedback(rowId, feedback, wrapperDiv, comment = "") {
            wrapperDiv.className = 'chat-feedback done';
            wrapperDiv.innerHTML = '의견 감사합니다!';

            const targetMsg = chatHistory.find(m => m._rowId === rowId);
            if (targetMsg) targetMsg._feedbackSent = true;
            sessionStorage.setItem('lrChatHistory', JSON.stringify(chatHistory));

            try {
                await fetch('/.netlify/functions/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rowId, feedback, comment })
                });
            } catch (e) {
                console.error('Feedback error:', e);
            }
        }

        async function sendChatMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            chatInput.value = '';
            chatInput.disabled = true;
            chatSubmitBtn.disabled = true;
            chatSubmitBtn.innerHTML = '...';

            const userEl = document.createElement('div');
            userEl.className = 'chat-msg user';
            userEl.textContent = text;
            chatMessages.appendChild(userEl);

            chatHistory.push({ role: 'user', content: text });
            sessionStorage.setItem('lrChatHistory', JSON.stringify(chatHistory));

            const typingEl = document.createElement('div');
            typingEl.className = 'typing-indicator';
            typingEl.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatMessages.appendChild(typingEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const aiEl = document.createElement('div');
            aiEl.className = 'chat-msg ai';
            let rowId = null;

            try {
                const res = await fetch('/.netlify/functions/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: chatHistory })
                });

                if (res.headers.has('X-Row-Id')) {
                    rowId = res.headers.get('X-Row-Id');
                }

                if (chatMessages.contains(typingEl)) {
                    chatMessages.removeChild(typingEl);
                }
                chatMessages.appendChild(aiEl);

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let fullAiAnswer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    fullAiAnswer += chunk;
                    aiEl.textContent = fullAiAnswer;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                chatHistory.push({ role: 'model', content: fullAiAnswer, _rowId: rowId, _feedbackSent: false });
                sessionStorage.setItem('lrChatHistory', JSON.stringify(chatHistory));
                if (rowId) {
                    renderFeedbackButtons(aiEl, rowId, false);
                }

            } catch (error) {
                console.error(error);
                if (chatMessages.contains(typingEl)) {
                    chatMessages.removeChild(typingEl);
                }
                aiEl.textContent = "죄송합니다. 오류가 발생하여 답변할 수 없습니다.";
                chatMessages.appendChild(aiEl);
            }

            chatInput.disabled = false;
            chatSubmitBtn.disabled = false;
            chatSubmitBtn.innerHTML = '→';
            chatInput.focus();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    