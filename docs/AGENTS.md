# AGENTS — AI 협업 가이드

이 저장소는 **1차: Cursor로 구현**, **2차: Claude로 검수**하는 흐름을 전제로 합니다.  
사람(주아)과 AI가 같은 규칙으로 작업할 때 참고하는 문서입니다.

---

## 1. 역할 분담

| 단계 | 도구 | 브랜치 | 할 일 |
|------|------|--------|--------|
| **1차 구현** | **Cursor** | `feature-cursor` | 기능·UI·SCSS·JSON 콘텐츠·문서 초안 |
| **2차 검수** | **Claude** | PR → `main` (또는 `review/claude-*`) | 버그·타입·a11y·보안·문서↔코드 불일치 |
| **릴리스** | 사람 | `main` + tag `v1.x.x` | verify, 배포, CHANGELOG |

현재 remote: `origin/feature-cursor`, `origin/main`.

---

## 2. 저장소 맥락 (에이전트용 요약)

- **제품**: Windows 데스크톱 메타포 포트폴리오 ([PRD.md](./PRD.md)).
- **구조**: `api/` Express + `web/` Next.js 15 ([ARCHITECTURE.md](./ARCHITECTURE.md)).
- **콘텐츠**: `api/data/portfolio.json` only ([CONTENT.md](./CONTENT.md)).
- **스타일**: Tailwind + SCSS modules, camelCase ([DESIGN.md](./DESIGN.md)).
- **클릭 원칙**: 바탕화면 → 창 **1단계**; 앱 내부 깊은 탐색 없음.

---

## 3. Cursor (1차) — 작업 규칙

### 3.1 시작 전

1. [ROADMAP.md](./ROADMAP.md)에서 P0/P1 항목 확인.
2. 관련 문서 PRD / CONTENT / DESIGN 읽기.
3. `feature-cursor`에서 작업 (main에 직접 push 지양).

### 3.2 구현 시

- **범위**: 요청된 기능만 — drive-by refactor 금지.
- **스타일**: SCSS module, `className`, camelCase 클래스 ([DESIGN.md](./DESIGN.md)).
- **데이터**: UI 문구 하드코딩보다 `portfolio.json` 우선.
- **검증**: 변경 후 `npm run verify` (가능하면).

### 3.3 커밋

[HISTORY.md](./HISTORY.md) §3 — Conventional Commits + scope:

```
feat(start-menu): ...
fix(desktop): ...
docs: ...
```

`feat: 1차 구현` 같은 메시지는 **더 이상 사용하지 않음**.

### 3.4 세션 종료 시

- [WORKLOG.md](./WORKLOG.md)에 날짜·한 일·다음 할 일 기록.
- ROADMAP 체크박스 갱신.
- 큰 기능이면 CHANGELOG `[Unreleased]`에 한 줄.

---

## 4. Claude (2차) — 검수 규칙

### 4.1 입력으로 줄 것

- PR diff 또는 “검수해 줄 브랜치: feature-cursor”
- 링크: `docs/PRD.md`, `docs/ARCHITECTURE.md`
- 스크린샷(시작 메뉴, 바탕화면, 창) 있으면 UX 판단에 유리

### 4.2 검수 체크리스트

[ROADMAP.md](./ROADMAP.md) “Claude 2차 검수” 섹션 참고. 요약:

| 영역 | 확인 |
|------|------|
| 타입 | `PortfolioPayload`, `OpenWindow.kind` exhaustiveness |
| 상태 | 창 중복 open, close 후 focus, minimize |
| 보안 | `window.open`, iframe `src`, 외부 URL JSON |
| a11y | 키보드, aria, 포커스 트랩(시작 메뉴) |
| 성능 | Image `unoptimized` 남용, 불필요 re-render |
| 문서 | PRD 매핑표 ↔ `portfolio.json` ↔ `windows.ts` |
| 스타일 | DESIGN 원칙, `!important` 남용 |

### 4.3 출력 형식 (권장)

```markdown
## Summary
한 줄 총평

## Blockers
- (머지 전 필수)

## Suggestions
- (개선 권장)

## Nits
- (사소)
```

Blocker는 **직접 수정 PR** 또는 Cursor에게 “이슈 #n 수정”으로 넘깁니다.

### 4.4 Claude가 하지 않을 것 (기본)

- `git config` 변경
- main force push
- 사용자 요청 없는 대규모 리팩터
- `portfolio.json` 이력 내용을 **임의로 조작** (문구 변경은 사람 확인)

---

## 5. 브랜치·PR 워크플로

```
main          ← 안정, 배포
  ↑ merge PR
feature-cursor ← Cursor 1차 개발 (현재)
```

**권장 PR 흐름 (2차)**

1. `feature-cursor`에서 작업 완료 → `npm run verify`
2. PR: `feature-cursor` → `main` (제목·본문에 스크린샷, ROADMAP 항목)
3. Claude 리뷰 코멘트 → Cursor 또는 사람이 수정 → 재push
4. merge → tag `v1.0.0` (또는 patch) → CHANGELOG 날짜 확정

**3차 이후 (선택)**

- `feature/cursor-<topic>` 짧은 브랜치 → `feature-cursor` merge (기능 단위)

---

## 6. 문서 유지

| 변경 유형 | 업데이트할 문서 |
|-----------|-----------------|
| 새 바탕화면 아이콘/창 | PRD §6, CONTENT §3, CHANGELOG |
| API/상태 구조 | ARCHITECTURE, CHANGELOG |
| UI 톤·SCSS 규칙 | DESIGN |
| 릴리스 | CHANGELOG, HISTORY, tag |
| 세션 기록 | WORKLOG |

---

## 7. 환경·명령 (공통)

```powershell
# API
cd api; npm install; npm run dev

# Web
cd web; npm install; copy .env.local.example .env.local
# NEXT_PUBLIC_PORTFOLIO_API_URL=http://localhost:4000
npm run dev

# 검증
cd D:\factory\portfolio; npm run verify

# 레거시 에셋
cd web; npm run sync:legacy
```

Windows PowerShell — `&&` 대신 `;` 사용.

---

## 8. 사용자 규칙 요약 (Cursor / Claude 공통)

- 응답·문서: **한국어**.
- 스타일: **SCSS**, `className`, camelCase, 모듈 격리.
- 커밋: **사용자가 요청할 때만** (에이전트 임의 commit 금지).
- 코드 인용: `` `startLine:endLine:path` `` 형식.

---

## 9. 관련 문서

- [PRD.md](./PRD.md)
- [HISTORY.md](./HISTORY.md) — 커밋·버전 전략
- [ROADMAP.md](./ROADMAP.md)
- [WORKLOG.md](./WORKLOG.md)

---

## 10. AGENTS.md 개정

워크플로가 바뀌면 (예: Codex 추가, CI bot) 이 파일과 HISTORY를 함께 수정하세요.
