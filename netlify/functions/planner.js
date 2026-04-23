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
        const { concept, direction, target, purpose, price, benchmark, others, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 콘텐츠 기획자입니다.
수강생의 계정 정보를 분석하고 조쉬의 철학을 바탕으로 상세한 전략을 제안하세요.

[수강생 정보]
- 컨셉: ${concept}
- 방향: ${direction}
- 타겟: ${target}
- 목적: ${purpose}
- 가격대: ${price}
- 벤치마킹 스타일: ${benchmark}
- 기타 요청사항: ${others || "없음"}

[출력 가이드라인]
반드시 다음 4가지 항목을 포함하여 풍부하게 작성해주세요. 
- **중요**: 절대 이모지 및 볼드체(**)를 사용하지 마세요. 오직 평문으로만 작성하세요.
- **중요**: 답변은 오직 제공된 [지식 베이스]의 철학을 기반으로 작성해야 합니다.

1. 타겟 고객의 진짜 페인 포인트 진단
2. 당장 쓸 수 있는 추천 후킹 주제 3가지
3. 최적의 콘텐츠 포맷 제안
4. 랜딩페이지 유입 & 전환 시나리오

[지식 베이스]
${knowledgeBase || ""}`;

        // API 버전을 v1으로 명시하여 404 에러 방지
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" }, 
            { apiVersion: 'v1' }
        );

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ answer: text })
        };
    } catch (error) {
        console.error("Planner Error:", error);
        // 에러 발생 시 상세 메시지를 클라이언트에 전달
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};