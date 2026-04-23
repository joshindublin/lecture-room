import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event, context) => {
    // CORS
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: "API 키 누락" }) };
    }

    try {
        const body = JSON.parse(event.body);
        const { messages, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.
[답변 규칙]
- 제공된 [지식 베이스] 내용을 1순위로 참고하세요.
- 절대 이모지를 사용하지 마세요.
- 절대 볼드체 등 텍스트 강조를 사용하지 마세요.
- 친근한 존댓말(~해요)을 사용하세요.

[지식 베이스]
${knowledgeBase || "일반 지식으로 답변하세요."}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        const answer = result.response.text();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ answer })
        };
    } catch (error) {
        console.error("Chat Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};