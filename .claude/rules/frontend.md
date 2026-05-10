---
paths:
  - "apps/web/**/*.{ts,tsx}"
---

# Frontend Rules (Next.js 14 App Router)

## 컴포넌트 규칙
- Server Component가 기본. 클라이언트 상태/훅 필요 시에만 `'use client'` 추가
- `useState`/`useEffect` 있는 파일은 반드시 `'use client'`
- 컴포넌트 파일당 최대 200줄. 초과 시 하위 컴포넌트로 분리
- Props 타입은 `interface`로 명시, `type`은 유니온/유틸리티에만 사용

## Next.js 14 특이사항
- `cookies()`, `headers()`는 async — `await cookies()` 필수
- `app/` 디렉토리 라우트 그룹: `(marketing)`, `(app)`, `(auth)`
- 이미지: `next/image` 사용, `<img>` 태그 직접 사용 금지
- 폰트: `next/font/google` self-hosted (COEP 헤더와 충돌 방지)
- API Routes: `apps/web/app/api/` 아래, `route.ts` 파일명

## Supabase
- 브라우저: `lib/supabase/client.ts` → `createBrowserClient` from `@supabase/ssr`
- 서버: `lib/supabase/server.ts` → `createServerClient` from `@supabase/ssr`
- `@supabase/auth-helpers-nextjs` 사용 금지 (deprecated)
- RLS 정책 확인 — 모든 테이블에 row level security 활성화

## 상태 관리
- 전역 오디오 상태: `lib/store/audioStore.ts` (Zustand)
- 로컬 UI 상태만 `useState` 사용
- 서버 데이터 캐싱: Next.js `fetch` cache 또는 Supabase 쿼리

## Tailwind
- 디자인 토큰: `bg-[#0a0a0f]`, `text-[#f0f0f5]` 같은 임의 값보다 `tailwind.config.ts`의 커스텀 토큰 우선
- 반응형: `md:`, `lg:` 프리픽스 — 모바일 퍼스트
- 다크 모드: `html` 태그에 `class="dark"` 고정 (시스템 설정 따르지 않음)
