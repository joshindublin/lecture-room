# Project Management Guidelines (Lecture Room Project ONLY)

> **주의:** 이 지침은 오직 `[유료-강의 VOD] 조쉬의 콘텐츠 마스터클래스` 프로젝트 폴더 내 작업에만 적용됩니다. '내 드라이브'의 다른 프로젝트에는 해당되지 않습니다.

## 1. 저장소 경로
이 프로젝트의 소스 코드와 .git 저장소는 아래 경로에 있습니다.

- **REAL PATH:** `/Users/josh-kim/Desktop/lecture-room`

## 2. 배포 및 업데이트 규칙
- `main` 브랜치를 GitHub에 푸시하면 Railway가 자동으로 프로덕션 배포합니다.
- 구 Netlify 함수, `netlify.toml`, `deploy.sh`는 현재 배포에 사용하지 않습니다.

## 3. 기능 및 디자인 원칙
- **모델:** `gemini-3.1-flash-lite` 모델과 스트리밍 방식을 사용합니다.
- **SDK:** GA 버전인 `@google/genai`를 사용합니다.
- **가독성:** 챗봇은 평문으로, 분석 및 첨삭 결과는 마크다운 제목과 목록으로 표시합니다.
- **금지:** 이모지 사용을 금지하고 오직 텍스트로만 답변합니다.
