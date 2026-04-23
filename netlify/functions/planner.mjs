import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    // CORS 처리
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
        const { concept, direction, target, purpose, price, benchmark, others, knowledgeBase } = body;

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
        // 검증된 최신 모델 적용
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContentStream(systemPrompt);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(new TextEncoder().encode(chunkText));
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
        console.error("Planner Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
};