# CONTENT — 콘텐츠 운영 가이드

이력·프로젝트·바탕화면 아이콘 등 **사용자에게 보이는 문구와 링크**의 단일 소스는  
`api/data/portfolio.json` 입니다.

타입 정의: `web/src/types/portfolio.ts` (`PortfolioPayload`).

---

## 1. 파일 위치와 반영 방법

| 작업 | 방법 |
|------|------|
| 로컬 수정 | `api/data/portfolio.json` 편집 |
| 반영 | API 서버 재시작 (`cd api && npm run dev`) |
| 웹 확인 | 브라우저 새로고침 (Query가 no-store로 재요청) |
| 타입 검사 | `cd web && npx tsc --noEmit` |

JSON을 고친 뒤 **web을 rebuild할 필요는 없습니다** (문구만 변경 시).

---

## 2. 최상위 스키마

```json
{
  "version": 1,
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
| `desktop` | 바탕화면 벽지·아이콘 |
| `profile` | Word(About), GitHub 모달 메타 |
| `about` | Word 창 본문 |
| `experienceSummary`, `jobs` | Excel(`experience`) 창 |
| `skills` | 제어판(`skills`) 창 |
| `timeline` | 타임라인 창 (시작 메뉴 등) |
| `projects` | PowerPoint(`projects`) 창, GitHub pinned |
| `github` | GitHub Chrome 모달 |
| `windowsCopy` | 휴지통 문구, Chrome iframe URL |

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
| `skills` | 제어판 | skills | `skills` |
| `about` | Word | about | `profile`, `about` |
| `github` | GitHub | github | `github`, `profile` |
| `cursor` | Cursor | cursor | 하드코딩 소개 |
| `experience` | Excel | experience | `jobs`, `experienceSummary` |
| `projects` | PowerPoint | projects | `projects` |
| `chrome` | Chrome | chrome | `windowsCopy.chromeFrameUrl` |

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

**about** — Word 창에 쓰는 `intro`, `philosophy`, `goals` (긴 문단).

---

## 5. jobs / experienceSummary

**experienceSummary** — 총 개월 수, 한 줄 요약.

**jobs[]** — 회사별:

- `company`, `role`, `focus`, `periodLabel`, `durationLabel`, `summary`
- `stack`: framework, languages[], state[], runtime[], deploy[], server[], collab[]
- `highlights[]`: 불릿 문자열 배열

Excel 창(`kind: experience`)에서 렌더됩니다.

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

| 필드 | 설명 |
|------|------|
| slug | 내부 키 |
| name, role, team, contribution | 헤더 |
| stackSummary, env | 부가 정보 |
| description | 본문 |
| links[] | `{ label, url }` 버튼 |

GitHub 모달의 pinned repo 선정에도 `pickGithubPinnedRepos(projects)` 사용.

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
