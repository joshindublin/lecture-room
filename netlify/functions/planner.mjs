import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    if (req.method === "OPTIONS") {
        return new Response("OK", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }

    try {
        const body = await req.json();
        const { concept, direction, target, purpose, price, benchmark, others, knowledgeBase } = body;

        // [진단용 프롬프트 수정]
        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 콘텐츠 기획자입니다.
(시스템 버전: 2026-04-23-FINAL-V1)

- 주제: ${concept}
- 고민: ${direction}
- 타겟: ${target}
- 목적: ${purpose}
- 가격: ${price}
- 스타일: ${benchmark}
- 기타: ${others || "없음"}

[규칙] 이모지 금지, 볼드체 금지, 평문으로만 상세히 작성하세요. 지식 베이스를 최우선 참고하세요.

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // [중요] apiVersion을 'v1'으로 강제 고정하고 가장 표준적인 모델명 사용
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const result = await model.generateContentStream(systemPrompt);

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    controller.enqueue(new TextEncoder().encode(chunk.text()));
                }
                controller.close();
            }
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" } });

    } catch (error) {
        console.error("Planner Fatal Error:", error);
        return new Response(JSON.stringify({ error: "[진단정보] " + error.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }
};