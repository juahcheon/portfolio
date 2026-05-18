# ARCHITECTURE

포트폴리오 모노레포의 기술 구조, 데이터 흐름, 상태 관리, 배포를 정리합니다.  
제품 의도·화면 매핑은 [PRD.md](./PRD.md), 콘텐츠 수정은 [CONTENT.md](./CONTENT.md)를 참고하세요.

---

## 1. 시스템 개요

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  web/ — Next.js 15 (App Router, Client Components)     │  │
│  │  · page.tsx → fetchPortfolio() → PortfolioDesktop    │  │
│  │  · Zustand: 열린 창 / activeId                         │  │
│  │  · TanStack Query: portfolio 서버 상태                 │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ GET /v1/portfolio
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  api/ — Express                                              │
│  · readFile(api/data/portfolio.json)                         │
│  · CORS origin: true (개발·분리 배포)                        │
└─────────────────────────────────────────────────────────────┘
```

| 패키지 | 역할 | 주요 기술 |
|--------|------|-----------|
| `web/` | UI, 라우팅, 클라이언트 상태 | Next 15, React 19, TS, Tailwind, SCSS modules, Zustand, TanStack Query |
| `api/` | 포트폴리오 JSON HTTP 제공 | Express, Node ESM |
| 루트 | 검증 스크립트 | `npm run verify` → api + web 각각 verify |

---

## 2. API를 분리한 이유

면접·문서에서 자주 묻는 결정이므로, 의도를 명확히 적어 둡니다.

### 2.1 콘텐츠와 UI 배포 주기 분리

이력·프로젝트 문구는 `api/data/portfolio.json`에만 있습니다.  
문구만 고칠 때 **Next.js 전체를 다시 빌드·배포하지 않아도** API만 갱신할 수 있습니다. (실무에서 CMS·BFF를 나누는 것과 같은 방향)

### 2.2 단일 소스 + 타입 계약

- JSON이 **진실의 원천(Single Source of Truth)**.
- `web/src/types/portfolio.ts`의 `PortfolioPayload`가 프론트 계약.
- 나중에 Headless CMS·Notion API로 바꿀 때 **web 컴포넌트는 fetch 경로만** 바꾸면 됨.

### 2.3 개발·운영 편의

- 로컬: API `4000`, web `3003` — 각각 hot reload.
- web만 mock API로 UI 작업 가능.
- 배포: Vercel(Serverless/Edge) + Railway·Render 등 **호스팅을 독립** 선택 (README 권장).

### 2.4 포트폴리오로서의 설명 포인트

> “정적 HTML에 박혀 있던 데이터를 API로 빼서, 프론트는 **소비자** 역할만 하게 했다.”

과도한 분리는 아님 — 현재 API는 파일 read 1엔드포인트 수준이며, **1차 목표는 구조 연습 + 유지보수**에 가깝습니다.

---

## 3. web 디렉터리 구조

```
web/src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃, 폰트
│   ├── page.tsx            # fetch + PortfolioDesktop
│   ├── providers.tsx       # QueryClientProvider
│   └── globals.css         # Tailwind, Windows CSS 변수, Chrome 모달 공통
├── components/
│   ├── desktop/            # 데스크톱·창·작업 표시줄·시작 메뉴
│   ├── explorer/           # 휴지통, 내 PC 탐색기 UI
│   └── word/               # Word 스타일 About 창
├── lib/
│   ├── api.ts              # fetchPortfolio, base URL
│   └── windows.ts          # windowId → OpenWindow 매핑
├── store/
│   └── desktopStore.ts     # open[], activeId, open/close/focus
└── types/
    └── portfolio.ts        # PortfolioPayload 타입
```

### 3.1 진입 흐름

1. `page.tsx` — `useQuery(['portfolio'], fetchPortfolio)`
2. 성공 시 `<PortfolioDesktop data={q.data} />`
3. 실패 시 API URL 안내 에러 UI

### 3.2 데스크톱 레이어

| 파일 | 책임 |
|------|------|
| `PortfolioDesktop.tsx` | 벽지, 아이콘 열, 창 목록, Lnb |
| `Lnb.tsx` | 작업 표시줄, 시작 메뉴, 시계, 트레이 |
| `WindowsStartMenu.tsx` + `.module.scss` | 시작 메뉴 UI·스크롤 |
| `WinWindow.tsx` | 창 크롬, kind별 분기(탐색기/Word/GitHub/Chrome) |
| `WindowContents.tsx` | skills, timeline, cursor |
| `ChromeLegacyModal.tsx` | Chrome/GitHub iframe 셸 |

### 3.3 windowId → kind 매핑

`lib/windows.ts`의 `openWindowFromDesktopId`:

| windowId | title | kind |
|----------|-------|------|
| trash | 휴지통 | recycle |
| hero | 내 PC | thisPc |
| skills | 제어판 | skills |
| about | Word | about |
| github | GitHub | github |
| cursor | Cursor | cursor |
| chrome | Chrome | chrome (+ iframeUrl) |

> **Excel / PowerPoint** (`experience`, `projects`) 창 kind는 제거됨. `jobs`·`projects` JSON 필드는 GitHub pinned 등에서 계속 사용 가능.

`desktopStore.ts`의 `OpenWindow.kind`가 라우팅 키입니다.

---

## 4. 상태 관리

### 4.1 서버 상태 — TanStack Query (1단계)

- **대상**: `PortfolioPayload` 전체 (한 번 fetch).
- **캐시 키**: `['portfolio']`.
- **정책**: `cache: 'no-store'` (fetch 시 항상 최신 JSON).
- 컴포넌트마다 `fetchPortfolio()` 직접 호출 **금지** — Query 훅/프리페치만 사용.

### 4.2 포트폴리오 데이터 전달 (단순 우선)

**1인·단일 페이지** 포트폴리오이므로 **props 전달이 기본**이다 ([AGENTS.md](../AGENTS.md) §3).

- `page.tsx`: React Query → `PortfolioDesktop data={...}`
- 컴포넌트마다 `fetch` 중복 금지

**portfolio 전용 Zustand store**는 라우트가 늘거나 props drilling이 실제로 불편해질 때만 검토한다. 지금 단계에서 필수 아님.

### 4.3 창 UI 상태 — Zustand (`desktopStore`)

| 상태 | 설명 |
|------|------|
| `open` | 열린 창 배열 (`OpenWindow[]`) |
| `activeId` | 포커스된 창 id |
| `openWindow` | 동일 id면 focus만, 없으면 append |
| `closeWindow` | 제거 후 active를 마지막 창으로 |
| `focusWindow` | activeId 변경 |

바탕화면 **아이콘 선택**은 `PortfolioDesktop` 로컬 `useState` (Zustand 밖).

### 4.4 창 내부 로컬 상태

`WinWindow`: `maximized`, `minimized` — 창마다 독립.

---

## 5. api 디렉터리

```
api/
├── src/server.ts       # Express app
└── data/portfolio.json # 콘텐츠
```

| 엔드포인트 | 응답 |
|------------|------|
| `GET /health` | `{ ok: true }` |
| `GET /v1/portfolio` | portfolio.json raw |

환경 변수: `PORT` (기본 4000).

---

## 6. 에셋·정적 파일

| 경로 | 용도 |
|------|------|
| `web/public/img/` | 레거시 작업 표시줄·webp (sync:legacy) |
| `web/public/icons/` | 바탕화면·탐색기 아이콘 |
| `web/scripts/sync-legacy-assets.mjs` | juahcheon.github.io → public 복사 |

이미지 URL은 JSON·컴포넌트에서 `/img/...`, `/icons/...` 형태로 참조합니다.

---

## 7. 환경 변수

| 변수 | 위치 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_PORTFOLIO_API_URL` | `web/.env.local` | API 베이스 URL (끝 `/` 제거됨) |
| `PORT` | api | API 포트 |

예시: `web/.env.local.example`

---

## 8. 빌드·검증

```powershell
# 루트
npm run verify          # api tsc + web tsc + next build

# 개별
cd api && npm run dev
cd web && npm run dev
```

배포 시 web은 Linux — **파일명 대소문자** 일치 필수 (CONTENT.md).

---

## 9. 배포 topology (예정)

**URL·배포일 미정** — [DEPLOY.md](./DEPLOY.md)에 Vercel·API 주소를 확정 후 기록.

```
[사용자]
    → Vercel (web, Next.js)     ← _TBD_
    → API 호스트                ← _TBD_
```

CORS는 API에서 `origin: true`로 개발·분리 도메인을 허용합니다. 프로덕션에서는 필요 시 origin 화이트리스트로 좁힐 수 있습니다.

---

## 10. 확장 시 수정 지점

| 변경 | 주로 건드릴 파일 |
|------|------------------|
| 새 바탕화면 아이콘 | `portfolio.json` → `windows.ts` → (필요 시) `WindowContents` |
| 새 창 종류 | `desktopStore` kind union, `WinWindow`, `WindowContents` |
| API 필드 추가 | `portfolio.json`, `types/portfolio.ts`, 소비 컴포넌트 |
| 시작 메뉴 항목 | `WindowsStartMenu.tsx`, `Lnb` props |

---

## 11. 관련 문서

- [PRD.md](./PRD.md)
- [CONTENT.md](./CONTENT.md)
- [DESIGN.md](./DESIGN.md)
- [AGENTS.md](./AGENTS.md)
