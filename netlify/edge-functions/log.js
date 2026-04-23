import { google } from "npm:googleapis";

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

    try {
        const body = await req.json();
        
        const serviceAccountKey = Netlify.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
        const sheetsId = Netlify.env.get("GOOGLE_SHEETS_ID");

        if (!serviceAccountKey || !sheetsId) {
            console.warn("Missing Google Sheets API environment variables.");
            return new Response(JSON.stringify({ status: "skipped", message: "credentials missing" }), {
                status: 200, headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        let credentialsJson;
        try {
            const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
            credentialsJson = JSON.parse(decoded);
        } catch {
            credentialsJson = JSON.parse(serviceAccountKey);
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: credentialsJson.client_email,
                private_key: credentialsJson.private_key,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = sheetsId;
        const range = "Sheet1";

        if (body.question && body.answer && body._time) {
            const row = [body._time, body.question, body.answer, "", ""];
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [row] },
            });
            return new Response(JSON.stringify({ status: "success" }), {
                status: 200, headers: { "Access-Control-Allow-Origin": "*" }
            });
        } else if (body.rowId) {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${range}!A:A`,
            });
            const rows = response.data.values || [];
            let targetRowNumber = -1;
            for (let i = rows.length - 1; i >= 0; i--) {
                if (rows[i] && rows[i][0] === body.rowId) {
                    targetRowNumber = i + 1;
                    break;
                }
            }
            if (targetRowNumber !== -1) {
                const updateRange = `${range}!D${targetRowNumber}:E${targetRowNumber}`;
                await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: updateRange,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[body.feedback || "", body.comment || ""]] },
                });
                return new Response(JSON.stringify({ status: "feedback updated" }), {
                    status: 200, headers: { "Access-Control-Allow-Origin": "*" }
                });
            } else {
                return new Response(JSON.stringify({ status: "row not found" }), {
                    status: 404, headers: { "Access-Control-Allow-Origin": "*" }
                });
            }
        }
        return new Response(JSON.stringify({ status: "invalid request" }), {
            status: 400, headers: { "Access-Control-Allow-Origin": "*" }
        });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500, headers: { "Access-Control-Allow-Origin": "*" }
        });
    }
};

export const config = { path: "/log" };
