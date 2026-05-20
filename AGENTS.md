# Agent instructions (항상 적용)

이 파일은 **Cursor·Claude 등 AI가 세션 시작 시 먼저 읽는** 공통 규칙입니다.  
상세 협업·검수는 [docs/AGENTS.md](docs/AGENTS.md).

---

## 0. 이 프로젝트를 어떻게 볼 것인가

| 항목 | 내용 |
|------|------|
| 성격 | **개인 포트폴리오** (채용·면접용) |
| 규모 | **1인 프로젝트** — 팀·엔터프라이즈 패턴 불필요 |
| 원칙 | **단순하게 유지** — 요청·버그 수정 범위만. 추상화·레이어·라이브러리 추가는 최소화 |
| 지원 맥락 | **신입 지원**이나 실무 **약 8개월** 경력 있음 (`portfolio.json`의 `jobs` 등) |

**복잡하게 만들지 말 것:** CMS, 다중 페이지, 과도한 store 분리, “나중을 위한” 추상화, 사용자가 묻지 않은 리팩터·아키텍처 제안.

---

## 1. 제품·범위

- Windows 데스크톱 **메타포** 포트폴리오 — [docs/PRD.md](docs/PRD.md)
- **프로덕션 URL** — [docs/DEPLOY.md](docs/DEPLOY.md), `web/data/portfolio.json`의 `siteUrl` 참고. 변경 시 둘 다 갱신.
- **명시 없으면 추가·복원 금지**
  - Excel / PowerPoint **창·메타포**
  - **escapeFinal** 링크·아이콘·문서

---

## 2. 디자인 — 임의 수정 금지

**사용자가 디자인 변경을 요청하지 않으면 디자인 작업을 하지 않는다.**

- 색·간격·레이아웃·타이포·아이콘 배치·Tailwind/토큰 구조·Windows 크롬 비율 **임의 변경 금지**
- 버그·기능 수정 시 **기존 시각 유지** (동작만 수정)
- [docs/DESIGN.md](docs/DESIGN.md)는 참고용 — “개선”“통일”을 이유로 리디자인하지 말 것

---

## 3. 데이터 로딩·상태 (단순 우선)

### 3.1 현재 구조 (1차·권장 유지)

- **단일 페이지** (`app/page.tsx`) — 라우트 늘리지 않음 (요청 전까지).
- **React Query**로 `GET /v1/portfolio` **한 번** fetch·캐시 (`queryKey: ['portfolio']`).
- 결과는 **props**로 `PortfolioDesktop` 등에 전달해도 됨 (1인·단일 화면에 충분).
- **열린 창·포커스**만 `desktopStore` (Zustand) — UI 상태.

### 3.2 규칙

1. 컴포넌트마다 `fetchPortfolio()` **직접 호출 금지** — Query 한곳에서만 fetch.
2. **portfolio 전용 Zustand store는 필수 아님.** props drilling이 실제로 문제될 때만 도입 ([docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).
3. 서버 데이터(JSON)와 창 UI 상태 **혼합 store 금지**.

### 3.3 콘텐츠 수정

- 문구·경력·프로젝트: **`api/data/portfolio.json`만** — [docs/CONTENT.md](docs/CONTENT.md)
- UI에 하드코딩된 소개 문구 추가 지양

### 3.4 경력 상세 (`jobs`) — 추후

- JSON에 `jobs`, `experienceSummary`(약 8개월) **데이터는 유지** 가능.
- **전용 화면·Excel 창은 없음.** 1차 UI 구현이 끝난 뒤 사용자가 **추가 예정** — 지금은 **경력 UI를 새로 만들거나 복잡한 경력 모듈을 제안하지 말 것**.
- GitHub pinned 등 기존 `projects` 소비만 유지.

---

## 4. 구현 시 공통 규칙

| 항목 | 규칙 |
|------|------|
| 단순함 | 최소 파일·최소 의존성. “best practice”가 곧 복잡함이면 **하지 않음** |
| 범위 | **요청된 것만**. drive-by refactor·디자인 개편·문서 남발 금지 |
| 스타일 | Tailwind, `className`, 토큰(`tailwind.config`/`globals.css`), `!important` 지양 — 이유는 [docs/DESIGN.md](docs/DESIGN.md) §3 |
| UX | 바탕화면 → **창 1단계**; 앱 안 다단계 탐색 추가 금지 |
| 창 추가 | `portfolio.json` → `windows.ts` → `desktopStore` kind → `WinWindow` / `WindowContents` — **PRD·CONTENT 동시 확인** |
| 검증 | 변경 후 `npm run verify` (가능하면) |
| 커밋 | `type(scope): summary` — [docs/HISTORY.md](docs/HISTORY.md). **「커밋해줘」 시** 묶음안 → 승인 → commit (§3.4) |
| 커밋·push | 커밋만 에이전트(승인 후). **push·merge·tag는 사용자** |
| 에셋 | `npm run sync:legacy` 또는 `web/public` **기존 경로** — 임의 placeholder 이미지 금지 |
| 배포 경로 | Linux **대소문자** — webp·PNG 소문자 통일 |
| 라이브러리 | 사용자 요청 없이 **새 패키지 추가 금지** |
| 문서 | 사용자가 요청하지 않은 md **새로 만들지 않음** (CASE_STUDY 등) |

---

## 5. 불가·한계 — 억지 구현 금지

요청이 **기술·플랫폼·프로젝트 범위 밖**이면, 우회용 해킹·과한 복잡도로 “된 것처럼” 만들지 말고 **먼저 불가 또는 제약을 짧게 말한다.**

| 해야 할 것 | 하지 말 것 |
|------------|------------|
| 왜 안 되는지(브라우저·Vercel·구조·비용 등) 한두 문장으로 설명 | 불가능한데 억지로 비슷한 동작을 넣어 품질·유지보수만 악화 |
| 가능한 대안 1~2개 제시 (더 단순한 방법, 문서만 수정, 범위 축소) | 사용자가 고르기 전에 대안 없이 임의로 큰 리팩터 진행 |
| “지금 repo 구조로는 ~까지 가능”처럼 **경계** 명시 | 모호한 “해보겠습니다” 후 실패·롤백 반복 |

예: Express API를 Vercel에 그대로 상시 호스팅, 무료로 24시간 전용 서버, 브라우저만으로 OS 수준 동작 등 — **안 되면 안 된다고 말하고** [docs/DEPLOY.md](docs/DEPLOY.md)·[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)와 맞는 방법을 제안한다.

---

## 6. AI가 하지 말아야 할 제안 (기본)

- 마이크로서비스·Redis·GraphQL·i18n·다크모드·CMS
- “portfolio store 꼭 도입하세요” (현재 단일 페이지면 불필요)
- Excel/PowerPoint 창 복원
- 경력 전용 대시보드·관리자 페이지 (1차 구현 전·후 사용자 요청 전)
- 대규모 폴더 구조 변경·테스트 보일러plate 일괄 추가

---

## 7. 브랜치 (1인·단순)

- **일상**: `feature-cursor` — 작업·커밋 기본
- **안정**: `main` — verify·CHANGELOG 후 merge, tag·배포
- **가끔**: `feat/...` — 며칠짜리 기능만. 끝나면 `feature-cursor`로 합침
- 상세: [docs/HISTORY.md](docs/HISTORY.md) §2.2 — AI가 브랜치 체계를 늘리지 않음

---

## 8. 문서 맵 (필요할 때만)

| 문서 | 용도 |
|------|------|
| [docs/PRD.md](docs/PRD.md) | 화면·스코프 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 구조·상태 |
| [docs/CONTENT.md](docs/CONTENT.md) | JSON·아이콘 |
| [docs/DESIGN.md](docs/DESIGN.md) | UI (참고만) |
| [docs/DEPLOY.md](docs/DEPLOY.md) | 배포 URL (미정) |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 할 일 |
| [docs/WORKLOG.md](docs/WORKLOG.md) | 작업 일지 |

---

## 9. 세션 마무리 (권장)

- 큰 변경: [docs/WORKLOG.md](docs/WORKLOG.md) 한 줄
- 릴리스: [docs/CHANGELOG.md](docs/CHANGELOG.md) `[Unreleased]`

---

## 10. 환경 (PowerShell)

```powershell
cd api; npm run dev
cd web; npm run dev   # http://localhost:3003 — 데이터는 /api/v1/portfolio (Route Handler)
cd D:\factory\portfolio; npm run verify
cd web; npm run sync:legacy
```

`&&` 대신 `;` 사용.
