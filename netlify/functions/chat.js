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
        const body = JSON.parse(event.body);
        const { messages, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.
[규칙] 이모지 금지, 볼드체 금지, 평문으로만 작성. 지식 베이스 최우선 참고.

[지식 베이스]
${knowledgeBase || ""}`;

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
            headers,
            body: JSON.stringify({ answer })
        };
    } catch (error) {
        console.error("Chat Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};