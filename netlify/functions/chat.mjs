import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

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

    // API 키 누락 즉시 체크
    if (!process.env.GEMINI_API_KEY) {
        return new Response(
            JSON.stringify({ error: "환경 변수 GEMINI_API_KEY가 설정되지 않았습니다." }),
            { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
    }

    try {
        const body = await req.json();
        const messages = body.messages;

        if (!messages || messages.length === 0) {
            return new Response("Bad Request", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
        }

        // 지식 베이스 파일 로드 (import.meta.url 없이, 환경별 경로 탐색)
        let knowledgeBase = "";
        const possiblePaths = [
            "/var/task/knowledge-base.md",
            path.join(process.cwd(), "knowledge-base.md"),
        ];
        for (const p of possiblePaths) {
            try {
                const content = await fs.readFile(p, "utf-8");
                if (content) { knowledgeBase = content; break; }
            } catch (e) { /* 다음 경로 시도 */ }
        }

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.

[역할]
- 수강생의 강의 관련 질문에 친절하고 정확하게 답변합니다.
- 조쉬의 강의 철학과 콘텐츠 기획 방법론을 기반으로 하되, 일반적으로 널리 알려진 마케팅/콘텐츠 이론이나 유명한 전문가들의 인사이트도 자유롭게 인용하여 답변을 풍부하게 합니다.

[답변 규칙]
- 질문 내용이 특정 강의에서 다루는 주제와 직접 관련이 있을 때만 해당 강의 번호를 자연스럽게 언급하세요. 관련 강의가 없다면 굳이 언급하지 마세요.
- 지식 베이스 문서의 내용을 우선 참고하되, 거기에 없는 내용이라도 콘텐츠 기획/마케팅/SNS 운영에 관한 일반적인 지식이나 업계에서 유명한 사람들의 말을 인용해서 충분히 답변할 수 있다면 답변하세요.
- 친근한 존댓말("~해요" 체)을 사용하세요.
- 답변은 간결하게 (3-5문장), 필요 시 구체적 예시 포함.
- 절대 강의 영상 링크나 다운로드 방법을 안내하지 마세요.
- 강의 주제(콘텐츠 기획, 마케팅, SNS, 편집, AI 활용)와 완전히 무관한 질문에는 정중히 안내하세요.

[지식 베이스]
${knowledgeBase || "지식 베이스 없음 — 일반 지식으로 답변하세요."}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            systemInstruction: systemPrompt
        });

        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage);

        const rowId = new Date().toISOString();

        const stream = new ReadableStream({
            async start(controller) {
                let fullAnswer = "";
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        fullAnswer += chunkText;
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                    controller.close();
                } catch (streamErr) {
                    console.error("Stream error:", streamErr);
                    controller.error(streamErr);
                }

                // 로깅 (스트림과 완전 분리, 실패해도 무시)
                try {
                    const originUrl = new URL(req.url).origin;
                    await fetch(`${originUrl}/.netlify/functions/log`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: lastMessage, answer: fullAnswer, _time: rowId })
                    });
                } catch (logErr) {
                    console.error("Logging failed (non-critical):", logErr);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Expose-Headers": "X-Row-Id",
                "X-Row-Id": rowId
            }
        });

    } catch (error) {
        console.error("Chat API Error:", error.stack || error);
        return new Response(
            JSON.stringify({ error: error.message, stack: error.stack }),
            { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
    }
};
