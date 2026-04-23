import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    if (req.method === "OPTIONS") {
        return new Response("OK", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } });
    }

    try {
        const body = await req.json();
        const { messages, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.
(시스템 버전: V2-PRO-STABLE)
[규칙] 이모지 금지, 볼드체 금지, 평문으로만 작성. 지식 베이스 최우선 참고.

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro", systemInstruction: systemPrompt });

        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage);

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
        console.error("Chat Error:", error);
        return new Response(JSON.stringify({ error: "[최종진단] " + error.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }
};