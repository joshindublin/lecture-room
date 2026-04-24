#!/bin/bash

# 1. 진짜 저장소 경로로 이동
TARGET_DIR="/Users/josh-kim/Library/CloudStorage/GoogleDrive-josh@socialable.co.kr/내 드라이브/00. 강의 VOD/[유료-강의 VOD] 조쉬의 콘텐츠 마스터클래스"
cd "$TARGET_DIR"

# 2. 강제 배포 트리거 생성 (현재 시간 기록)
echo "# Last Deploy: $(date)" >> netlify.toml

# 3. 깃 명령 실행
git add .
git commit -m "chore: automated deploy trigger $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

echo "------------------------------------------------"
echo "✅ 배포 명령이 성공적으로 전송되었습니다!"
echo "Netlify 대시보드에서 빌드 완료를 확인하세요."
echo "------------------------------------------------"
