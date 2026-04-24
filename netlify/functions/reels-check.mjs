import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    if (req.method === "OPTIONS") {
        return new Response("OK", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    try {
        const body = await req.json();
        const { hook, script, caption, focus, knowledgeBase } = body;

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

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        controller.enqueue(new TextEncoder().encode(chunk.text()));
                    }
                    controller.close();
                } catch (e) {
                    controller.error(e);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        console.error("Reels Check Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};