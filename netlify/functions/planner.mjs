import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event, context) => {
    // CORS 처리
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: "OK"
        };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "환경 변수 GEMINI_API_KEY가 설정되지 않았습니다." }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { concept, direction, target, purpose, price, benchmark, knowledgeBase } = body;

        if (!concept || !direction || !target || !purpose || !price) {
            return { statusCode: 400, body: "Bad Request" };
        }

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 수석 콘텐츠 기획자입니다.
수강생의 계정 정보를 분석하고, [지식 베이스]에 담긴 조쉬의 철학과 방법론을 바탕으로 가장 실질적이고 날카로운 전략을 제안해야 합니다.

[조쉬의 기획 철학 핵심]
- 모든 콘텐츠는 고객의 '페인 포인트(Pain Point)'에서 출발해야 합니다.
- 조회수는 허영 지표입니다. 목적은 명확한 '전환(매출, DM, 체류, 신뢰)'입니다.
- 두루뭉술한 위로나 감성보다는 명확한 기준과 행동 지침을 제시하세요.
- 친근한 존댓말("~해요", "~합시다")을 사용하세요.

[수강생 계정 정보]
- 계정 컨셉 및 주제: ${concept}
- 현재 고민 및 방향성: ${direction}
- 타겟 고객: ${target}
- 목표하는 마케팅 효과/전환: ${purpose}
- 판매 상품 및 가격대: ${price}
- 벤치마킹 스타일: ${benchmark || "없음"}

[출력 가이드라인]
반드시 다음 4가지 항목을 포함하여 풍부하고 상세하게 작성해주세요.
- **중요**: 절대 이모지(Emoji)를 사용하지 마세요.
- **중요**: 절대 볼드체(**텍스트**) 등 텍스트 강조 마크다운을 사용하지 마세요. 오직 평문으로만 작성하세요.
- **중요**: 답변은 오직 제공된 [지식 베이스]에 담긴 조쉬의 노하우와 철학을 기반으로 작성해야 합니다.

1. 타겟 고객의 진짜 페인 포인트 진단
2. 당장 쓸 수 있는 추천 후킹 주제 3가지
3. 최적의 콘텐츠 포맷 제안 (스토리텔링 / 정보성 / 감성 중 택 1)
4. 랜딩페이지 유입 & 전환 시나리오 (Funnel)

[지식 베이스]
${knowledgeBase || "지식 베이스 정보가 없습니다."}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // 가장 안정적인 모델명 사용
            systemInstruction: "당신은 냉철한 콘텐츠 마케팅 전문가 조쉬입니다."
        });

        // 비-스트리밍 방식으로 결과 생성 (안정성 우선)
        const result = await model.generateContent(systemPrompt);
        const fullText = result.response.text();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ answer: fullText })
        };

    } catch (error) {
        console.error("Planner API Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
};