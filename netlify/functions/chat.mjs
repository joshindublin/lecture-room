import { GoogleGenerativeAI } from "@google/generative-ai";

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

    try {
        const body = await req.json();
        const { messages, knowledgeBase } = body;

        const systemPrompt = `당신은 '조쉬의 콘텐츠 마스터클래스'의 AI 조교입니다.
[답변 규칙]
- 제공된 [지식 베이스] 내용을 1순위로 참고하세요.
- 절대 이모지(Emoji)를 사용하지 마세요.
- 절대 볼드체(**) 등 마크다운 텍스트 강조를 사용하지 마세요.
- 친근한 존댓말(~해요)을 사용하세요.

[지식 베이스]
${knowledgeBase || ""}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemPrompt 
        });

        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        controller.enqueue(new TextEncoder().encode(chunk.text()));
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
        console.error("Chat Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
};