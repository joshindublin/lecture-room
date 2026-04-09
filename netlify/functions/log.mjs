import { google } from "googleapis";

/*
======================================================
Google Sheets API 설정 방법 안내
======================================================
1. Google Cloud Console에서 프로젝트 생성
2. API 및 서비스 > 라이브러리에서 'Google Sheets API' 검색 후 활성화
3. IAM 및 관리자 > 서비스 계정 메뉴에서 서비스 계정 생성 후 JSON 키 만들기(다운로드)
4. 구글 시트를 생성하고 문서 우측 상단 '공유' 버튼 클릭하여 서비스 계정 이메일(client_email)을 '편집자'로 추가
5. 다운로드한 JSON 키 파일의 내용을 전체 복사하여 Base64로 인코딩한 문자열을 Netlify 환경변수 `GOOGLE_SERVICE_ACCOUNT_KEY` 로 저장
   - 만약 Base64 인코딩 없이 JSON 원본 텍스트를 그대로 넣어도 작동하도록 하단에 예외 처리해두었습니다.
6. 기록할 구글 시트의 ID (URL에서 /d/ 뒷부분의 긴 문자열)를 Netlify 환경변수 `GOOGLE_SHEETS_ID` 로 저장
======================================================
*/

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

        if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEETS_ID) {
            console.warn("Missing Google Sheets API environment variables.");
            return new Response(JSON.stringify({ status: "skipped", message: "credentials missing" }), {
                status: 200, headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        let credentialsJson;
        try {
            // Base64 디코딩 시도
            const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
            credentialsJson = JSON.parse(decoded);
        } catch {
            // 실패 시 원본 문자열 JSON 파싱 시도
            credentialsJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: credentialsJson.client_email,
                private_key: credentialsJson.private_key,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
        const range = "Sheet1";

        // 1. 대화 기록 저장 시 (chat.mjs에서 호출됨)
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

            // 2. 피드백 업데이트 시 (프론트엔드에서 👍/👎 버튼 클릭 시)
            // 식별자(rowId)는 시간(_time) 값을 프론트에서 전송
        } else if (body.rowId) {
            // 1. 시트 데이터 가져와서 해당 rowId 찾기
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${range}!A:A`, // 시간 컬럼만 가져오기
            });

            const rows = response.data.values || [];
            // rowId(_time) 와 일치하는 행 번호(rowIndex + 1) 찾기. 가장 최근 것부터 검색.
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
