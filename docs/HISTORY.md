# HISTORY — 프로젝트 연대기

**CHANGELOG**([CHANGELOG.md](./CHANGELOG.md))는 “버전마다 무엇이 바뀌었나”를,  
**HISTORY**는 “왜·어떤 흐름으로 왔나”를 기록합니다.

---

## 1. 타임라인

| 시기 | 단계 | 요약 |
|------|------|------|
| 2024-11 | 저장소 생성 | `Initial commit`, 골격만 존재 |
| 2025-05-13 ~ 05-18 | **1차 구현** | `juahcheon.github.io` → 모노레포, Windows UI 본격 구현 |
| 2026-05-18 | 문서화 | `docs/` 정리, 1.0.0 기준선 |

### 1차 구현 세부 (git 기준)

| 날짜 | 커밋 요지 | 의미 (추정·정리) |
|------|-----------|------------------|
| 2025-05-13 | 1차 구현 완료 | API + web + 데스크톱 뼈대 |
| 2025-05-14 | 1차 구현 | 창·탐색기·콘텐츠 연결 |
| 2025-05-15 | 아이콘 및 디테일 수정 | 바탕화면·에셋·작업 표시줄 |
| 2025-05-18 | 1차 구현 | 시작 메뉴 등 마무리 디테일 |

> 당시 커밋 메시지가 `feat: 1차 구현`으로 동일해, **앞으로는 영역별 커밋**으로 쪼개는 것을 권장합니다 (아래 3절).

---

## 2. 주요 전환점

### 2.1 juahcheon.github.io → portfolio

- **이전**: 정적 GitHub Pages, 데스크톱 연출 + HTML에 박힌 이력.
- **이후**: Next.js + TypeScript + API로 **콘텐츠와 UI 분리**.
- **에셋**: `web/scripts/sync-legacy-assets.mjs`로 레거시 `img/webp`, 작업 표시줄 PNG 등 동기화.

### 2.2 브랜치 전략 (현재)

| 브랜치 | 용도 |
|--------|------|
| `feature-cursor` | **1차 개발** — Cursor로 기능·UI 구현 (현재 작업 브랜치) |
| `main` | 안정·배포용 (병합 후) |
| (예정) `review/claude-*` 또는 PR | **2차** — Claude로 검수·리팩터 제안 |

자세한 AI 워크플로는 [AGENTS.md](./AGENTS.md).

### 2.3 의도적으로 제거·단순화한 것

- 브랜드 데모 아이콘(뚜레쥬르 등) 제거 → 포트폴리오 본연 콘텐츠에 집중.
- **바탕화면 → 앱 내부 2단계 탐색 없음** — 클릭 수 최소화 (PRD 5절).
- Linux 배포 시 **`.WebP` 대소문자** 이슈 → JSON·경로는 `.webp` 소문자 기준.

---

## 3. 1차 버전 — 커밋을 어떻게 쪼갤까?

지금까지는 `feat: 1차 구현` 반복이라 **나중에 blame·리뷰·CHANGELOG 작성이 어렵습니다.**  
1차를 마무리하는 동안부터 아래 규칙을 추천합니다.

### 3.1 Conventional Commits + 영역(scope)

```
<type>(<scope>): <한 줄 요약>

[본문: 왜 바꿨는지, 선택적]
```

**type**: `feat` | `fix` | `refactor` | `style` | `chore` | `docs` | `test`

**scope 예시** (이 repo 기준):

| scope | 예시 |
|-------|------|
| `desktop` | 바탕화면 아이콘, 선택 상태 |
| `lnb` | 작업 표시줄, 시계 |
| `start-menu` | WindowsStartMenu SCSS·스크롤 |
| `window` | WinWindow, 최소화·최대화 |
| `explorer` | 휴지통, 내 PC |
| `word` | WordAppWindow |
| `content` | portfolio.json, API 데이터 |
| `api` | Express 서버 |
| `web` | Next 설정, providers |
| `assets` | sync:legacy, public/img |

**좋은 커밋 예**

```
feat(start-menu): 커스텀 스크롤 레일·휠 스무딩 추가
fix(desktop): webp 404 시 폴백 타일 표시
chore(assets): juahcheon.github.io에서 task-remove.png 동기화
docs: PRD 바탕화면 매핑 표 추가
```

**피할 것**

- `feat: 1차 구현` (무엇이 바뀌었는지 알 수 없음)
- 한 커밋에 시작 메뉴 + JSON 경력 수정 + API (리뷰·되돌리기 어려움)

### 3.2 커밋 단위 가이드

- **한 커밋 = 한 의도** (보이는 결과 또는 리팩터 한 덩어리).
- UI만 손댔으면 `style` / `feat(desktop)` — 데이터는 분리.
- **docs만** 바꿨으면 `docs:` 단독 커밋 (코드 리뷰 부담 감소).
- 1차 “완료” 직전: `chore: release v1.0.0` + tag.

### 3.3 1차 마무리 전 권장 커밋 순서 (예시)

1. `docs: add PRD, ARCHITECTURE, CONTENT, …`
2. `feat(desktop): experience/projects 바탕화면 아이콘 연결` (ROADMAP 항목 시)
3. `fix(web): 프로덕션 API URL env 검증`
4. `chore: bump portfolio.json version to 1`

---

## 4. 버전업은 어떻게 진행할까?

### 4.1 두 가지 “버전”

| 종류 | 위치 | 용도 |
|------|------|------|
| **제품/데이터 버전** | `portfolio.json` → `"version": 1` | JSON 스키마·필드 호환 |
| **배포 버전** | Git tag `v1.0.0` + CHANGELOG | 사용자·면접관에게 “릴리스” |

둘을 맞출 필요는 없지만, **공개 배포 시점**에는 같이 올리는 것을 권장합니다.

### 4.2 Semantic Versioning (권장)

| 버전 | 언제 |
|------|------|
| **1.0.0** | 1차 공개: 데스크톱·시작 메뉴·핵심 창·API 연동 완료 |
| **1.1.0** | 기능 추가 (예: Excel/PowerPoint 바탕화면 연결, 새 창) |
| **1.0.1** | 버그만 (이미지 404, 창 포커스 등) |
| **2.0.0** | JSON 스키마 breaking, URL 구조 변경, 메타포 대폭 변경 |

### 4.3 단계별 로드맵과 버전 (제안)

| 단계 | Git / CHANGELOG | 내용 |
|------|-----------------|------|
| **1.0.x** | `v1.0.0` ~ | Cursor `feature-cursor` → 검수 → `main` |
| **1.1.0** | minor | ROADMAP P1 (경력·프로젝트 아이콘, a11y) |
| **1.2.0** | minor | 배포·도메인·SEO 메타 |
| **2.0.0** | major | 모바일 대응 또는 CMS 등 구조 변경 시 |

### 4.4 릴리스 절차 (짧게)

1. `feature-cursor`에서 기능 완료 → `npm run verify`
2. CHANGELOG `[Unreleased]` → `[1.0.1]` 등으로 이동
3. `main`에 merge (또는 PR)
4. `git tag v1.0.0 && git push origin v1.0.0`
5. Vercel( web ) + API 호스팅 배포

---

## 5. 기술 부채·알려진 이슈 (연대기 메모)

- 커밋 메시지 homogeneity → §3 규칙으로 개선 중.
- `experience` / `projects` 창은 코드에 있으나 바탕화면 미연결.
- 시작 메뉴 PlaceholderRow — 클릭 무동작 (의도적 장식).
- Windows 전용 에셋 파일명 대소문자 — 배포 환경에서 주의 (README·CONTENT 참고).

---

## 6. 관련 문서

- [CHANGELOG.md](./CHANGELOG.md)
- [ROADMAP.md](./ROADMAP.md)
- [WORKLOG.md](./WORKLOG.md)
- [AGENTS.md](./AGENTS.md)
