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
                               │ GET /api/v1/portfolio (Route Handler)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  web/data/portfolio.json + app/api/v1/portfolio/route.ts     │
│  (Vercel 배포 시 web/ 만 포함)                               │
└─────────────────────────────────────────────────────────────┘

※ `api/` Express 서버는 제거됨. `web/data/portfolio.json`이 단일 원본.
```

| 패키지 | 역할 | 주요 기술 |
|--------|------|-----------|
| `web/` | UI, 라우팅, 클라이언트 상태, Route Handler | Next 15, React 19, TS, Tailwind, Zustand, TanStack Query |
| 루트 | 검증 스크립트 | `npm run verify` → web tsc + next build |

---

## 2. 콘텐츠 분리 설계

### 2.1 단일 소스

- `web/data/portfolio.json`이 **진실의 원천(Single Source of Truth)**.
- `web/src/types/portfolio.ts`의 `PortfolioPayload`가 프론트 계약.
- Route Handler(`app/api/v1/portfolio/route.ts`)가 이 파일을 읽어 반환.

### 2.2 개발·운영 편의

- 로컬: **`cd web && npm run dev`** (3003) — JSON은 `/api/v1/portfolio`.
- 배포: **Vercel Root `web`만** — [DEPLOY.md](./DEPLOY.md).

### 2.3 포트폴리오로서의 설명 포인트

> “콘텐츠는 `portfolio.json` 단일 파일에서 관리하고, 프론트는 Route Handler를 통해 소비하는 구조로 분리했다.”

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
| `WinWindow.tsx` | 창 크롬, kind별 분기(탐색기/Word/GitHub/`projects`는 Chrome 모달+임베드) |
| `WindowContents.tsx` | timeline, cursor |
| `ChromeLegacyModal.tsx` | GitHub iframe 셸 |

### 3.3 windowId → kind 매핑

`lib/windows.ts`의 `openWindowFromDesktopId`:

| windowId | title | kind |
|----------|-------|------|
| trash | 휴지통 | recycle |
| hero | 내 PC | thisPc |
| skills | 스킬 | skills |
| about | 자기소개 | about |
| github | GitHub | github |
| cursor | Cursor | cursor |
| projects | 프로젝트 | projects |

> **Excel / PowerPoint** (`experience`, `projects`) 창 kind는 제거됨. `jobs`·`projects` JSON 필드는 GitHub pinned·프로젝트 창 등에서 계속 사용 가능.

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

## 5. 에셋·정적 파일

| 경로 | 용도 |
|------|------|
| `web/public/img/` | 레거시 작업 표시줄·webp (sync:legacy) |
| `web/public/icons/` | 바탕화면·탐색기 아이콘 |
| `web/public/img/` | 레거시 작업 표시줄·webp |

이미지 URL은 JSON·컴포넌트에서 `/img/...`, `/icons/...` 형태로 참조합니다.

---

## 7. 환경 변수

| 변수 | 위치 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_PORTFOLIO_API_URL` | `web/.env.local` | API 베이스 URL (끝 `/` 제거됨) |

예시: `web/.env.local.example`

---

## 8. 빌드·검증

```powershell
# 루트
npm run verify          # web tsc + next build

# 개발 서버
cd web && npm run dev
```

배포 시 web은 Linux — **파일명 대소문자** 일치 필수 (CONTENT.md).

---

## 9. 배포 topology

```
[사용자]
    → Vercel (web/, Next.js)
```

`web/`만 Vercel에 배포. Route Handler가 `web/data/portfolio.json`을 읽어 반환.

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
