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
| `cursor` | Cursor | — | 시작 메뉴의 외부 링크 |
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

`profile.aiToolAttitude`의 `heading`, `body`는 자기소개 첫 페이지의 ‘지향점’ 다음에 표시할 AI 도구 활용 태도입니다. 기존 타임라인 문단 스타일을 사용합니다.

자기소개는 소개·근무 경험·프로젝트 소개의 3페이지입니다. 근무 경험의 `jobs[].aboutHighlights`에서 `**기능명**`은 굵게 표시합니다. 3페이지는 `projects[].aboutSummary`의 짧은 소개와 각 프로젝트 상세를 여는 버튼을 표시하며, 요약이 없으면 `description`을 사용합니다.

자기소개 하단의 고정 프로젝트·CMD 버튼은 전역 ‘둘러보기 안내’로 이동했습니다. `desktop.exploreGuide`에서 메뉴 제목·버튼 이름과 목적별 항목(`items[].title`, `windowId`)을 관리합니다. 각 행은 기존 바탕화면 아이콘·목적을 나타내는 제목·오른쪽 화살표로 구성하며, 행 전체를 누르면 해당 창을 엽니다.

모바일 바탕화면의 첫 이용 안내는 `desktop.mobileIntro`에서 관리합니다. 이름·직함은 기존 `profile`을 재사용하고 앱 목록·프로젝트 본문은 PC와 같은 데이터를 사용합니다.

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

## 8. projects

프로젝트 목록 JSON. **프로젝트** 창(`projects`)은 기존 Chrome 모달(`ChromeLegacyModal`) 안에 `ProjectsPanelView`로 표시. GitHub 모달 pinned(`pickGithubPinnedRepos`)에서도 사용.

`projects` 배열 순서는 AI Switch → AI Switch Docs → DS Helper → 말해부엉 → 나머지입니다. 프로젝트 창·명령 프롬프트 목록에서 이 순서를 사용하고, GitHub 핀 카드는 앞의 4개를 표시합니다. 넓은 화면에서는 위쪽에 비공개 AI Switch·AI Switch Docs, 아래쪽에 공개 DS Helper·말해부엉을 두 열로 배치합니다. GitHub 링크가 없는 프로젝트는 첫 번째 공개 서비스 링크를 사용합니다.

`statusLabel`(선택)은 프로젝트 본문과 목록의 상태 표시입니다. DS Helper는 `프로젝트 종료`로 표시하며 기존 역할·기여·구현 내역을 유지합니다.

`links[].visibility`를 `"private"`로 지정하면 GitHub 카드에 Private와 접근 권한 안내를 표시하고 프로젝트 링크에도 비공개임을 표시합니다. 링크는 유지하며 공개 서비스 주소는 Website로 구분합니다.

`organizationAvatarUrl`(선택)은 GitHub 카드 제목 옆에 표시할 실제 organization 프로필 이미지 주소입니다. DS Helper와 말해부엉에 적용하며, 로드 실패 시 기존 저장소 아이콘을 표시합니다.

`githubLanguage`(선택)는 GitHub 저장소의 `/languages` API에서 코드량이 가장 많은 대표 언어를 확인해 기록합니다. GitHub 카드에 사용하며 `stackSummary`에서 추측하지 않습니다. 미입력 시 언어 표시를 생략합니다. 2026-09-27 기준 AI Switch Docs는 JavaScript, AI Switch·DS Helper·말해부엉·Portfolio는 TypeScript입니다.

AI Switch Docs는 `slug: "ai-switch-docs"`인 별도 프로젝트입니다. 기존 프로젝트와 같은 `description`, `details`, `features`, `troubleshooting`, `links`로 문서 구축·튜토리얼·다국어 검수·업데이트 자동화 스킬 기여를 표시합니다.

`screenshots`(선택)는 `title`, `imageUrl`, `description`, `width`, `height`로 구성합니다. 이미지는 `web/public/img/ai-switch/`처럼 로컬 공개 경로에 저장하며, 프로젝트 창에서 서비스 로그인 없이 열람하고 원본 이미지도 열 수 있습니다.

바탕화면의 AI Switch는 `https://ax.aiswitch.co.kr/chat`, AI Switch Docs는 `https://aiswitch.co.kr/docs/ko/introduction/`, DS Helper는 `https://test.dshelper.kr/`를 새 탭으로 엽니다. Docs 아이콘은 기존 AI Switch 아이콘 에셋을 재사용합니다.

---

## 9. github / windowsCopy

```json
"github": {
  "username": "juahcheon",
  "profileUrl": "https://github.com/juahcheon",
  "avatarUrl": "https://avatars.githubusercontent.com/u/132863519?v=4",
  "chartImageUrl": "https://ghchart.rshah.org/juahcheon"
},
"windowsCopy": {
  "trash": "휴지통이 비어 있습니다.",
  "chromeFrameUrl": "https://www.google.com"
}
```

`chromeFrameUrl`은 과거 Chrome 창용으로 남겨 둔 필드이며, 현재 기본 창 라우팅에서는 사용하지 않을 수 있습니다.

GitHub 창은 `avatarUrl`의 실제 프로필 사진과 주요 프로젝트 카드를 라이트 테마로 표시합니다. 기여 그래프는 창을 열 때와 ‘잔디 새로고침’ 클릭 시 `/api/github/contributions`에서 공개 GitHub 달력의 날짜별 기여 수·색상 단계를 읽습니다. 각 칸의 hover·키보드 포커스에 날짜와 기여 수를 표시하며, 로딩 실패 시 재시도와 원본 프로필 링크를 제공합니다. `chartImageUrl`은 기존 이미지 대체 화면용이며, GitHub 창의 인터랙티브 달력에는 사용하지 않습니다. 저장소·팔로워 수를 임의로 생성하지 않습니다.

---

## 10. 시작 메뉴·작업 표시줄

CMD 체험은 같은 포트폴리오 데이터를 사용합니다. `whoami`는 직함·연락처·AI 툴을 대하는 자세, `git status`는 회사별 근무 경험과 명시된 프로젝트 상태, `git log`는 프로젝트 소개·기여, `cat skills.md`는 스킬 폴더와 프로젝트별 기술·도구, `ls`는 프로젝트 목록을 표시합니다. `npm run dev`는 실제 `web/package.json`의 실행 명령을 안내하며 서버를 실행하지 않습니다.

`troubleshoot`는 모든 프로젝트의 기존 `troubleshooting`을 발단·전개·해결 순서로 출력합니다. `troubleshoot ai-switch-docs`처럼 프로젝트 slug 또는 이름을 붙이면 해당 프로젝트만 표시합니다. AI Switch·AI Switch Docs의 바이브 코딩 작업 방식은 `description`과 `aboutSummary`에 기록하여 프로젝트·자기소개·CMD에 함께 반영합니다.

시작 메뉴 일부 항목은 **JSON이 아니라** `WindowsStartMenu.tsx` / `Lnb.tsx`에 하드코딩되어 있습니다.

| 항목 | 설정 위치 |
|------|-----------|
| DS Helper URL | `desktop.icons` 중 `dshelper`의 `url` (없으면 기본 test.dshelper.kr) |
| GitHub, Cursor | `Lnb` → `WindowsStartMenu` 콜백 |
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
