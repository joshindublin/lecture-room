import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// ── /api/chat ──
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, knowledgeBase } = req.body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.
[답변 규칙]
- 제공된 [지식 베이스] 내용을 1순위로 참고하세요.
- 절대 이모지(Emoji)를 사용하지 마세요.
- 절대 볼드체(**) 등 마크다운 텍스트 강조를 사용하지 마세요.
- 친근한 존댓말(~해요)을 사용하세요.

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
        });

        const history = messages.slice(0, -1).map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        for await (const chunk of result.stream) {
            res.write(chunk.text());
        }
        res.end();
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ── /api/planner ──
app.post("/api/planner", async (req, res) => {
    try {
        const { concept, direction, target, purpose, price, benchmark, others, knowledgeBase } = req.body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 콘텐츠 기획자입니다.
수강생의 계정 정보를 분석하고, [지식 베이스]에 담긴 조쉬의 철학과 방법론을 바탕으로 가장 실질적이고 날카로운 전략을 제안해야 합니다.

[수강생 계정 정보]
- 계정 컨셉 및 주제: ${concept}
- 고민 및 운영 방향성: ${direction}
- 타겟 고객: ${target}
- 목표하는 전환/효과: ${purpose}
- 판매 상품 및 가격대: ${price}
- 벤치마킹 스타일: ${benchmark}
- 기타 요청사항: ${others || "없음"}

[출력 가이드라인]
반드시 다음 4가지 항목을 포함하여 풍부하고 상세하게 작성해주세요.
- **중요**: 절대 이모지(Emoji)를 사용하지 마세요.
- **중요**: 절대 볼드체(**) 등 마크다운 강조 기호를 사용하지 마세요. 오직 평문으로만 작성하세요.
- **중요**: 답변은 오직 제공된 [지식 베이스]의 철학을 기반으로 작성해야 합니다.

1. 타겟 고객의 진짜 페인 포인트 진단
2. 당장 쓸 수 있는 추천 후킹 주제 3가지
3. 최적의 콘텐츠 포맷 제안 (스토리텔링/정보성/감성 중 택 1과 그 이유)
4. 랜딩페이지 유입 및 전환 시나리오

[지식 베이스]
${knowledgeBase || "지식 베이스 정보가 없습니다."}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContentStream(systemPrompt);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        for await (const chunk of result.stream) {
            res.write(chunk.text());
        }
        res.end();
    } catch (error) {
        console.error("Planner Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ── /api/reels-check ──
app.post("/api/reels-check", async (req, res) => {
    try {
        const { hook, script, caption, focus, knowledgeBase } = req.body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 코치입니다.
수강생이 제출한 릴스 기획안을 [지식 베이스]의 '첨삭 시스템' 기준에 따라 냉철하면서도 따뜻하게 점검해야 합니다.

[수강생 제출 내용]
1. 후킹 제목: ${hook}
2. 릴스 대본: ${script}
3. 릴스 캡션: ${caption}
4. 강조/신경쓴 점: ${focus}

[점검 가이드라인]
1. 반드시 [지식 베이스]의 '21. 자동 과제 첨삭 시스템' 형식을 따르세요.
2. [📋 조쉬의 첨삭 리포트]라는 제목으로 시작하세요.
3. 총점 10점 만점으로 점수를 매기고, 항목별(후킹 3, 가치 전달 2, 증거/신뢰 2, 리텐션 1, CTA 2) 근거를 쓰세요.
4. 잘한 부분은 확실히 칭찬하여 동기를 부여하고, 부족한 부분은 조쉬의 철학을 담아 날카롭게 수정 제안하세요.
5. 이모지와 볼드체 사용을 금지하고 오직 평문 마크다운으로만 작성하세요. (줄바꿈 빈 줄 2번 사용 필수)

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContentStream(systemPrompt);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        for await (const chunk of result.stream) {
            res.write(chunk.text());
        }
        res.end();
    } catch (error) {
        console.error("Reels Check Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
