# ripple-sns

물결처럼 자연스러운 사용자 경험을 만드는 것을 목표로 만든 SNS 프로젝트

## 기능 요약

- **인증**: Supabase 기반 회원가입 및 로그인, Github OAuth 로그인, 비밀번호 재설정
- **포스트 피드**: 무한 스크롤로 자연스러운 컨텐츠 탐색 (Tanstack Query `useInfiniteQuery` 사용)
- **포스트 상세**: 개별 포스트(컨텐츠, 이미지) 조회 및 댓글 작성
- **댓글 (트리 구조)**: 댓글 및 대댓글 지원, 계층형 표시
- **좋아요**: 포스트 좋아요 토글 (낙관적 업데이트, RPC 함수로 좋아요 카운트 관련 동시성 이슈 방지)
- **사용자 프로필**: 닉네임, 바이오, 아바타 관리
- **이미지 업로드**: 프로필 이미지, 포스트 이미지 (Supabase Storage)

## 기술 스택

### Frontend

- **React 19** + **TypeScript** + **Vite** (빠른 개발 서버, 번들링)
- **라우팅**: React Router 7
- **상태 관리**:
  - **Zustand** — 클라이언트 상태 (인증 세션, 모달)
  - **Tanstack Query** — 서버 상태 (캐시, 동기화 관리)
- **UI/스타일**:
  - **Tailwind CSS** — 유틸리티 기반 스타일
  - **Radix UI** — 접근성 높은 UI primitives (Dialog, Alert, Popover 등)
  - **shadcn/ui 패턴** — Radix UI + Tailwind를 합친 컴포넌트 (직접 구현)
  - **Lucide React** — 아이콘 라이브러리
- **번들 최적화**: `tsc -b` (타입 체크) → `vite build`

### Backend & 데이터

- **Supabase** (PostgreSQL 기반)
  - **Auth**: 이메일/비밀번호 기반 인증, OAuth 연동 준비
  - **Database**: PostgreSQL + Row-Level Security (RLS), RPC 함수
  - **Storage**: 이미지 저장 (프로필, 포스트)

## 데이터 모델

4개 테이블 중심 구조:

| 테이블    | 용도             | 주요 컬럼                                                                       |
| --------- | ---------------- | ------------------------------------------------------------------------------- |
| `profile` | 사용자 프로필    | id, nickname, bio, avatar_url, created_at                                       |
| `post`    | 포스트           | id, author_id, content, image_urls, like_count, comment_count, created_at       |
| `like`    | 좋아요           | id, post_id, user_id, created_at                                                |
| `comment` | 댓글 (트리 구조) | id, post_id, author_id, content, parent_comment_id, root_comment_id, created_at |

## 아키텍처 개요

### 레이어별 책임

**렌더링 계층**

- React 페이지 & 컴포넌트 (JSX)
- React Router로 라우팅 (Guest vs Member)

**상태 & 데이터 계층**

- **Zustand** (클라이언트 상태): 인증 세션, 모달 UI 상태
- **Tanstack Query** (서버 상태): API 캐시, 동기화, optimistic update

**백엔드 통신 계층**

- `src/api/*.ts` (Supabase 호출 래핑 함수)
- `src/hooks/queries|mutations/*` (Tanstack Query 훅)

**데이터 저장소**

- Supabase (PostgreSQL + RLS + RPC + Storage)

### 핵심 특징

- **Tanstack Query**: 캐시 중앙화 → 중복 요청 제거, 자동 동기화, 낙관적 업데이트
- **Zustand**: 간단한 클라이언트 상태 (모달, 인증) 관리
- **Supabase RLS**: DB 레벨 권한 강제 → 클라이언트 신뢰 불필요
- **타입 안전성**: `database.types.ts`로 DB 스키마 타입화

## Supabase 아키텍처

### 설계 원칙

1. **RLS (Row-Level Security)**
   - 데이터 접근 권한을 **DB 레벨에서 강제** → 클라이언트 코드가 잘못되어도 문제 차단
   - 예: 사용자 A가 사용자 B의 포스트를 수정하려 해도 DB가 차단

2. **RPC 함수**
   - **동시성 이슈 방지**: 같은 포스트에 여러 사용자가 동시에 좋아요를 누를 때
     - 클라이언트: `like_count += 1` → 동시성 문제, 카운트 꼬임
     - RPC: DB에서 원자적(atomic) 업데이트 → 항상 일관성 유지
   - **서버 신뢰성**: 비즈니스 로직이 클라이언트 아닌 DB에서 실행 → 안전

3. **Storage**
   - 이미지를 별도 저장소에 저장 → DB 크기 관리, 확장성 향상
   - 공개 읽기(CDN) → 빠른 로딩

### RPC 함수 (Postgres 함수)

동시성 안전성과 데이터 일관성을 보장하기 위함

- `toggle_post_like(p_post_id, p_user_id)`
  - 좋아요 추가/제거 + 자동 `post.like_count` 업데이트
  - DB 레벨 원자성 → race condition 없음

- `increment_comment_count(p_post_id)`
  - 댓글 추가 시 `post.comment_count` 증가
  - 클라이언트 수동 업데이트 대신 DB에서 처리

- `recalculate_comment_count(p_post_id)`
  - 댓글 삭제 시 카운트 재계산(현재는 답글이 삭제되면 원댓글도 삭제되는 구조이므로-> \*변경예정)
  - 삭제된 댓글 개수를 정확히 집계하여 `post.comment_count` 업데이트

### Storage

- 프로필 이미지 (`/profiles`)
- 포스트 이미지 (`/posts`)
- 공개 읽기, 인증된 사용자 쓰기 정책 적용

### API 접근 규칙

타입 안전성, 에러 처리 일관성, 테스트 용이성을 위해:

- **필수**: `src/api/*.ts` 헬퍼 함수만 사용 (auth, post, profile, image)
- **금지**: 컴포넌트에서 직접 supabase 클라이언트 호출

## 개발 패턴

### 경로 별칭

- `@` → `src` (설정: `vite.config.ts`)
- 모든 내부 임포트는 `@/...` 형식 사용

### 상태 관리 계층

- **인증/세션**: `SessionProvider` + `src/store/session.ts` (Zustand)
- **UI 상태 (모달)**: `ModalProvider` + `src/store/*-modal.ts` (Zustand)
- **서버 데이터**: Tanstack Query (`src/hooks/queries/*`, `src/hooks/mutations/*`)

### Tanstack Query 설정

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
```

- 불필요한 API 호출을 줄이기 위함
- retry를 하지 않고 error 상태를 만들어서 사용자에게 명백한 피드백을 주기 위함

### UI 패턴

- 컴포넌트: `src/components/layout`, `src/components/post`, `src/components/ui`
- 클래스 병합: `cn()` 함수 사용 (`src/lib/utils.ts`)
- Tailwind + Radix UI primitives

## DB 스키마 변경 시

- Supabase에서 테이블/컬럼 변경
- 로컬에서 `pnpm run type-gen` 실행 → `src/lib/database.types.ts` 갱신
- PR에 갱신된 `database.types.ts` 포함 (또는 실행 지시사항 명기)
