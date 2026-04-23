import { GoogleGenerativeAI } from "npm:@google/generative-ai";

export default async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("OK", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    if (!Netlify.env.get("GEMINI_API_KEY")) {
        return new Response(JSON.stringify({ error: "환경 변수 GEMINI_API_KEY가 설정되지 않았습니다." }), { 
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
        });
    }

    try {
        const body = await req.json();
        const { concept, direction, target, purpose, price, benchmark, knowledgeBase } = body;

        if (!concept || !direction || !target || !purpose || !price) {
            return new Response("Bad Request", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
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
- **중요**: 벤치마킹 정보는 뉘앙스(톤앤매너)만 참고하세요.
- **중요**: 답변은 오직 제공된 [지식 베이스]에 담긴 조쉬의 노하우와 철학을 기반으로 작성해야 합니다.

1. 타겟 고객의 진짜 페인 포인트 진단
   - 피상적인 문제가 아니라, 타겟 고객이 밤에 잠 못 이루며 고민할 진짜 문제를 구체화해서 진단해주세요.

2. 당장 쓸 수 있는 추천 후킹(Hooking) 주제 3가지
   - 고객이 스크롤을 멈출 수밖에 없는 강력한 첫 문장(카피)과 그에 맞는 주제. (벤치마킹 스타일이 있다면 반영)

3. 최적의 콘텐츠 포맷 제안 (스토리텔링 / 정보성 / 감성 중 택 1)
   - 세 가지 중 현재 수강생의 '전환 목표'를 이루기에 가장 적합한 방향을 딱 하나 골라주고, 조쉬의 관점에서 그 이유를 설명해주세요.

4. 랜딩페이지 유입 & 전환 시나리오 (Funnel)
   - 가격대(${price})를 고려하여, 릴스나 인스타 게시물을 보고 어떻게 매끄럽게 원하는 목적지(${purpose})까지 이동하게 만들지 구체적인 액션 플랜을 제안해주세요.

[지식 베이스 (조쉬의 노하우)]
${knowledgeBase || "지식 베이스 정보가 없습니다."}`;

        const genAI = new GoogleGenerativeAI(Netlify.env.get("GEMINI_API_KEY"));
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "당신은 냉철하고 분석적인 콘텐츠 마케팅 전문가이자 조쉬의 페르소나를 가진 기획자입니다."
        });

        const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
        });

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
        console.error("Planner API Error:", error.stack || error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
    }
};

export const config = { path: "/planner" };