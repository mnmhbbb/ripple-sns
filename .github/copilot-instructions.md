# Copilot 사용 지침 (ripple-sns)

이 문서는 코드 에이전트가 이 저장소에서 바로 생산적으로 작업할 수 있도록 핵심 규칙과 패턴을 간결하게 정리합니다.

- 프로젝트 유형: React + TypeScript + Vite SPA. Tailwind CSS 사용. Supabase로 인증/데이터베이스 연동.

- 빠른 명령(권장):

```bash
# 의존성 설치 (이 저장소는 pnpm 사용)
pnpm install

# 개발 서버 시작 (Vite)
pnpm dev

# 빌드 (먼저 tsc 체크, 그 다음 vite build)
pnpm build

# 린트
pnpm lint

# Supabase 타입 생성 (supabase CLI 필요, 프로젝트 접근 권한 필요)
pnpm run type-gen
```

- 중요 환경변수 (Vite):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_PUBLIC_URL` (비밀번호 재설정 이메일의 리다이렉트에 사용)

- 먼저 읽어볼 핵심 파일/디렉토리:
  - `src/lib/supabase.ts` — Supabase 클라이언트 생성 및 `Database` 타입 적용
  - `src/lib/database.types.ts` — Supabase로부터 생성된 타입. DB 변경 시 `type-gen`으로 동기화 필요
  - `src/provider/session-provider.tsx` 및 `src/store/session.ts` — 인증/세션 처리 흐름 (supabase.onAuthStateChange -> zustand)
  - `src/root-route.tsx` 및 `src/components/layout/*` — 라우팅과 레이아웃 경계 (Guest vs Member)
  - `src/api/*.ts` — Supabase 호출을 래핑한 얇은 헬퍼들 (auth, post, profile, image)
  - `src/hooks/queries` 및 `src/hooks/mutations` — React Query 기반 훅들(기존 네이밍/반환 형태를 따를 것)
  - `src/provider/modal-provider.tsx` 및 `src/store/*-modal.ts` — 모달 플로우와 상태 관리(모달은 여기를 재사용)

- 아키텍처 & 코드 관례(핵심 요약):
  - `@` alias가 `src`를 가리키도록 `vite.config.ts`에 설정되어 있습니다. 내부 모듈은 `@/...` 형식을 사용하세요.
  - React Query가 전역적으로 사용됩니다. 기본 옵션은 `src/main.tsx`에서 설정(재시도 없음, 포커스 시 재패치 없음).
  - Zustand 스토어는 `combine`과 `devtools`를 사용합니다. 액션 함수는 상태 객체의 `.actions` 아래에 위치합니다. 예: `useSetSession()`은 `state.actions.setSession`을 래핑합니다.
  - 인증 관련 변경은 `src/api/auth.ts`의 헬퍼 함수를 사용하고, 세션 상태 반영은 `session-provider` 를 통해만 수행하세요.
  - UI 컴포넌트는 `src/components/*`에 모여 있습니다(레이아웃, 포스트, UI primitives). 클래스 합치기는 `src/lib/utils.ts`의 `cn()`을 재사용하세요.
  - DB 관련 타입은 `src/lib/database.types.ts`로 타입 안전성을 보장합니다. 테이블/컬럼을 변경하면 이 파일을 재생성해야 합니다.

- 주의할 통합 포인트(비직관적이거나 중요함):
  - 로컬 목(mock) 서버: `server/db.json` + `json-server`가 가벼운 목 API로 포함되어 있습니다.
    실행 예: `npx json-server --watch server/db.json --port 3001`
  - 비밀번호 재설정 메일은 `src/api/auth.ts`에서 `VITE_PUBLIC_URL`을 사용해 `${VITE_PUBLIC_URL}/reset-password`로 리다이렉트합니다. 스테이징/프리뷰 환경에서는 이 값을 적절히 설정하세요.

- AI 에이전트에게 권장되는 변경 방식(실용 규칙):
  - 작은 단위의 PR을 선호하세요: 먼저 `src/hooks` / `src/api`를 수정하고, 그 다음 UI를 변경합니다.
  - DB 스키마 변경 시 `src/lib/database.types.ts`를 갱신하거나, PR 설명에 `type-gen` 실행 필요를 명확히 기록하세요.
  - 컴포넌트 안에서 직접 Supabase 호출을 만들지 말고, 기존 `src/api/*` 헬퍼를 재사용하세요.
  - 세션 흐름을 우회하지 마세요: `session-provider`를 통해 세션을 설정/갱신해야 합니다.
  - 타입 체크와 린트를 로컬에서 확인하려면 `pnpm build`(tsc 포함)와 `pnpm lint`를 실행하세요.

- 참고 예시 파일:
  - 인증 헬퍼: `src/api/auth.ts` (`signUp`, `signInWithPassword`, `requestPasswordResetEmail` 등)
  - 세션 연결: `src/provider/session-provider.tsx` -> `supabase.auth.onAuthStateChange` -> `useSetSession()` (`src/store/session.ts`)
  - 라우팅/레이아웃: `src/root-route.tsx` (Guest vs Member 분리, 기본 리다이렉트)
