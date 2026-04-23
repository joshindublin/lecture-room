import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY 환경변수가 없습니다.");

        const body = JSON.parse(event.body);
        const { concept, direction, target, purpose, price, benchmark, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 콘텐츠 기획자입니다.
수강생의 계정 정보를 분석하고 조쉬의 철학을 바탕으로 전략을 제안하세요.

- 컨셉: ${concept}
- 방향: ${direction}
- 타겟: ${target}
- 목적: ${purpose}
- 가격대: ${price}
- 벤치마킹: ${benchmark}

[규칙] 이모지 금지, 볼드체 금지, 평문으로만 작성. 지식 베이스를 최우선 참고할 것.

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ answer: text })
        };
    } catch (error) {
        console.error("Planner Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message, detail: "서버 내부 오류가 발생했습니다." })
        };
    }
};