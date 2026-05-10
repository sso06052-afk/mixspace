# MixSpace 개발 환경 셋업 (Mac/Linux)
# 사용법: make setup

.PHONY: setup dev install clean

setup:
	@echo "📦 pnpm 설치 확인..."
	@which pnpm || npm install -g pnpm
	@echo "📦 의존성 설치..."
	pnpm install
	@echo "📋 .env.local 확인..."
	@test -f .env.local || (cp .env.example .env.local && echo "⚠️  .env.local 생성됨 — Supabase URL/KEY 입력 필요")
	@echo "✅ 셋업 완료! pnpm dev 실행"

dev:
	pnpm dev

install:
	pnpm install

# FastAPI 백엔드 셋업 (Mac)
setup-api:
	cd apps/api && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
	@echo "✅ FastAPI 셋업 완료! pnpm dev:api 실행"
