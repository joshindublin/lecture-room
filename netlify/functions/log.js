const { google } = require("googleapis");

exports.handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    try {
        const body = JSON.parse(event.body);
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        const sheetsId = process.env.GOOGLE_SHEETS_ID;

        if (!serviceAccountKey || !sheetsId) {
            return { statusCode: 200, body: JSON.stringify({ status: "skipped" }) };
        }

        let credentialsJson;
        try {
            const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
            credentialsJson = JSON.parse(decoded);
        } catch (e) {
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
        return { statusCode: 200, headers, body: JSON.stringify({ status: "success" }) };
    } catch (error) {
        console.error("Log Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};