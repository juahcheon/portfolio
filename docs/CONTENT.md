# CONTENT — 콘텐츠 운영 가이드

이력·프로젝트·바탕화면 아이콘 등 **사용자에게 보이는 문구와 링크**의 배포용 단일 소스는  
**`web/data/portfolio.json`** 입니다.

타입 정의: `web/src/types/portfolio.ts` (`PortfolioPayload`).

레거시 경로 `api/data/portfolio.json`을 쓰는 경우: `cd web && npm run sync:content`로 `web/data`에 복사하세요.

---

## 1. 파일 위치와 반영 방법

| 작업 | 방법 |
|------|------|
| 로컬 수정 | **`web/data/portfolio.json`** 편집 (권장) |
| 레거시 | `api/data/portfolio.json` → `npm run sync:content` (web) |
| 로컬 확인 | `cd web && npm run dev` → 새로고침 |
| Vercel 반영 | `web/data` 변경 **커밋·push** → 자동 재배포 |
| 타입 검사 | `cd web && npx tsc --noEmit` |

---

## 2. 최상위 스키마

```json
{
  "version": 1,
  "siteUrl": "https://…",
  "desktop": { ... },
  "profile": { ... },
  "about": { ... },
  "experienceSummary": { ... },
  "jobs": [ ... ],
  "skills": { ... },
  "timeline": [ ... ],
  "projects": [ ... ],
  "github": { ... },
  "windowsCopy": { ... }
}
```

| 필드 | UI에서 쓰이는 곳 |
|------|------------------|
| `siteUrl` | (선택) 배포 URL — 문서·공유와 맞출 때 사용. UI는 미사용 가능 |
| `desktop` | 바탕화면 벽지·아이콘 |
| `profile` | 자기소개(Word) 창 헤더, GitHub 모달 메타 |
| `about` | 자기소개(Word) 창 본문 |
| `experienceSummary`, `jobs` | JSON 보관 (전용 창 없음 — 노출 위치는 추후 결정) |
| `skills` | 스킬(`skills`) 창 |
| `timeline` | 타임라인 창 (시작 메뉴 등) |
| `projects` | 프로젝트 창 본문, GitHub pinned |
| `github` | GitHub Chrome 모달 |
| `windowsCopy` | 휴지통 문구 등 (`chromeFrameUrl`은 레거시 필드) |

`version`은 스키마/호환 표시용 숫자입니다. 필드를 크게 바꿀 때 증가시키고 CHANGELOG에 기록하세요.

---

## 3. desktop.icons — 바탕화면 아이콘

### 3.1 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `column` | number | 열 인덱스 (0부터, 왼쪽부터) |
| `id` | string | 고유 id (키보드·선택용) |
| `label` | string | 아이콘 아래 텍스트 |
| `imageUrl` | string | `/icons/...` 또는 `/img/webp/...` |
| `action` | `"window"` \| `"external"` | 동작 종류 |
| `windowId` | string? | `action: "window"`일 때 `windows.ts` 매핑 키 |
| `url` | string? | `action: "external"`일 때 새 탭 URL |
| `gapAfter` | `"none"`? | 다음 아이콘과 세로 간격 제거 |
| `shape` | `"circle"` \| `"rounded10"`? | 이미지 클립 형태 |

### 3.2 windowId ↔ 창 매핑

`web/src/lib/windows.ts` — `openWindowFromDesktopId` 참고.

| windowId | 창 제목 | kind | 콘텐츠 소스 |
|----------|---------|------|-------------|
| `trash` | 휴지통 | recycle | 탐색기 UI |
| `hero` | 내 PC | thisPc | 탐색기 UI |
| `skills` | 스킬 | skills | `skills` |
| `about` | 자기소개 | about | `profile`, `about` |
| `github` | GitHub | github | `github`, `profile` |
| `cursor` | Cursor | cursor | `WindowContents` (연락·GitHub·Cursor 안내) |
| `projects` | 프로젝트 | projects | `projects` |

`experience` 등 **Excel·PowerPoint용 windowId는 제거됨** (Office 창 없음).

### 3.3 아이콘 추가 체크리스트

1. `portfolio.json` → `desktop.icons`에 객체 추가 (`column` 배치).
2. `imageUrl` 파일을 `web/public/` 아래에 두기.
3. `action: "window"`면 `windowId`가 `windows.ts`에 있는지 확인.
4. 새 `windowId`면 `windows.ts` + (필요 시) `WindowContents` / `WinWindow` 분기 추가.
5. 로컬에서 더블클릭·Enter로 열리는지 확인.

### 3.4 이미지 경로 규칙

- 배포(Linux)는 **대소문자 구분** — JSON에는 **소문자 `.webp`** 권장.
- Windows에서 `word.WebP`처럼 저장돼 있으면 `webp` 폴더에서 이름 통일 또는 `npm run sync:legacy`.
- 로드 실패 시 바탕화면에 **라벨 첫 글자 폴백 타일**이 표시됨.

---

## 4. profile / about

**profile** — 이름, 직함, 헤드라인 줄, 이메일, GitHub, heroPlaceholder(그라데이션·이니셜).

**about** — 자기소개(Word) 창에 쓰는 `intro`, `philosophy`, `goals` (긴 문단).

---

## 5. jobs / experienceSummary

**experienceSummary** — 총 개월 수, 한 줄 요약.

**jobs[]** — 회사별 상세(스택·하이라이트 포함).

현재 **전용 창 UI는 없음**. 신입 지원 + 약 8개월 경력 데이터는 JSON에 두고, **1차 구현이 끝난 뒤** 화면에 붙일 예정 ([ROADMAP.md](./ROADMAP.md)). AI가 경력 모듈을 선제 구현하지 말 것.

---

## 6. skills

```json
"skills": {
  "frontend": ["..."],
  "stateData": ["..."],
  "tools": ["..."]
}
```

제어판 창 3열 그리드로 표시됩니다.

---

## 7. timeline

```json
{ "dateLabel": "...", "title": "...", "description": "..." }
```

시작 메뉴 **타임라인** → `timelineWindow()` 로 열림.

---

## 8. projects

프로젝트 목록 JSON. **프로젝트** 창(`projects`)은 기존 Chrome 모달(`ChromeLegacyModal`) 안에 `ProjectsPanelView`로 표시. GitHub 모달 pinned(`pickGithubPinnedRepos`)에서도 사용.

---

## 9. github / windowsCopy

```json
"github": {
  "username": "juahcheon",
  "profileUrl": "https://github.com/juahcheon",
  "chartImageUrl": "https://ghchart.rshah.org/juahcheon"
},
"windowsCopy": {
  "trash": "휴지통이 비어 있습니다.",
  "chromeFrameUrl": "https://www.google.com"
}
```

`chromeFrameUrl`은 과거 Chrome 창용으로 남겨 둔 필드이며, 현재 기본 창 라우팅에서는 사용하지 않을 수 있습니다.

---

## 10. 시작 메뉴·작업 표시줄

시작 메뉴 일부 항목은 **JSON이 아니라** `WindowsStartMenu.tsx` / `Lnb.tsx`에 하드코딩되어 있습니다.

| 항목 | 설정 위치 |
|------|-----------|
| DS Helper URL | `desktop.icons` 중 `dshelper`의 `url` (없으면 기본 dshelper.kr) |
| GitHub, 타임라인, Cursor | `Lnb` → `WindowsStartMenu` 콜백 |
| Placeholder 앱 (Discord 등) | 코드 내 PlaceholderRow — 동작 없음 |

시작 메뉴 문구를 JSON으로 옮기는 것은 ROADMAP 후보입니다.

---

## 11. 레거시 에셋 동기화

```powershell
cd web
npm run sync:legacy
```

기본 소스: `D:\factory\juahcheon.github.io`  
다른 경로: `$env:LEGACY_ROOT="..."; npm run sync:legacy`

복사 대상 예: `img/webp/*`, 작업 표시줄 PNG, `folder_lnb.png` 등 (README 참고).

---

## 12. 검증

```powershell
cd D:\factory\portfolio
npm run verify
```

JSON 문법 오류는 API 기동 시 또는 fetch 실패로 드러납니다.  
필드 추가 시 `portfolio.ts` 타입도 함께 맞추세요.

---

## 13. 관련 문서

- [PRD.md](./PRD.md) — 화면 매핑·스코프
- [ARCHITECTURE.md](./ARCHITECTURE.md) — API 분리
- [ROADMAP.md](./ROADMAP.md) — JSON화·아이콘 연결 예정
