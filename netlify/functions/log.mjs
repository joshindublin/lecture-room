import { google } from "googleapis";

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
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        const sheetsId = process.env.GOOGLE_SHEETS_ID;

        if (!serviceAccountKey || !sheetsId) {
            return new Response(JSON.stringify({ status: "skipped" }), { status: 200 });
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
        const range = "Sheet1";

        if (body.question && body.answer && body._time) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetsId,
                range,
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [[body._time, body.question, body.answer, "", ""]] },
            });
        } else if (body.rowId) {
            const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetsId, range: `${range}!A:A` });
            const rows = res.data.values || [];
            let targetRow = -1;
            for (let i = rows.length - 1; i >= 0; i--) {
                if (rows[i] && rows[i][0] === body.rowId) { targetRow = i + 1; break; }
            }
            if (targetRow !== -1) {
                await sheets.spreadsheets.values.update({
                    spreadsheetId: sheetsId,
                    range: `${range}!D${targetRow}:E${targetRow}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[body.feedback || "", body.comment || ""]] },
                });
            }
        }
        return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (error) {
        console.error("Log Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};