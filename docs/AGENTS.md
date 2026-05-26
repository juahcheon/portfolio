# AGENTS — AI 협업 가이드 (상세)

> **세션마다 먼저 읽을 공통 규칙**은 루트 [AGENTS.md](../AGENTS.md)에 있습니다.  
> (디자인 임의 수정 금지, React Query → portfolio store 순서 등)

이 저장소는 **1차: Cursor로 구현**, **2차: Claude로 검수**하는 흐름을 전제로 합니다.

---

## 1. 역할 분담

| 단계 | 도구 | 브랜치 | 할 일 |
|------|------|--------|--------|
| **1차 구현** | **Cursor** | `feature-cursor` | 기능·UI·SCSS·JSON 콘텐츠·문서 초안 |
| **2차 검수** | **Claude** | PR → `main` | 버그·타입·a11y·보안·문서↔코드 불일치 |
| **릴리스** | 사람 | `main` + tag `v1.x.x` | verify, 배포, CHANGELOG |

현재 remote: `origin/feature-cursor`, `origin/main`.

---

## 2. 저장소 맥락 (에이전트용 요약)

- **성격**: **1인 개인 포트폴리오** — 단순함 우선. 엔터프라이즈·과설계 금지 ([AGENTS.md](../AGENTS.md) §0).
- **제품**: Windows 데스크톱 메타포 ([PRD.md](./PRD.md)).
- **구조**: `api/` + `web/` 단일 페이지 ([ARCHITECTURE.md](./ARCHITECTURE.md)).
- **콘텐츠**: `api/data/portfolio.json` ([CONTENT.md](./CONTENT.md)).
- **지원 맥락**: 신입 지원 + 실무 약 8개월 (`jobs` JSON). **경력 전용 UI는 1차 구현 후 사용자가 추가 예정** — 지금 만들지 말 것.
- **클릭 원칙**: 바탕화면 → 창 1단계.
- **배포**: Vercel — [DEPLOY.md](./DEPLOY.md).
- **금지**: Excel/PowerPoint 창, escapeFinal.

---

## 3. Cursor (1차) — 작업 규칙

### 3.1 시작 전

1. [ROADMAP.md](./ROADMAP.md)에서 P0/P1 항목 확인.
2. 관련 문서 PRD / CONTENT / DESIGN 읽기.
3. `feature-cursor`에서 작업 (main에 직접 push 지양).

### 3.2 구현 시

- **디자인**: 사용자가 디자인 변경을 요청하지 않으면 **색·레이아웃·SCSS 구조를 바꾸지 않음** ([DESIGN.md](./DESIGN.md) 참고만).
- **범위**: 요청된 기능만 — drive-by refactor 금지.
- **스타일**: SCSS module, `className`, camelCase 클래스.
- **데이터**: UI 문구는 `portfolio.json` 우선.
- **데이터**: Query로 fetch 1회·캐시; 단일 페이지면 props OK. portfolio store·신규 라우트는 **필요할 때만**. [AGENTS.md](../AGENTS.md) §3.
- **단순함**: 요청 범위만, 새 라이브러리·레이어·문서 자동 추가 금지.
- **검증**: 변경 후 `npm run verify` (가능하면).
- **불가·한계**: 요청이 구조·플랫폼·비용상 불가하면 **억지 구현하지 말고** 먼저 불가와 이유를 말한 뒤, 가능한 대안만 제안 — [AGENTS.md](../AGENTS.md) §5.

### 3.3 커밋 (Cursor — 사용자가 「커밋해줘」할 때만)

메시지 형식: [HISTORY.md](./HISTORY.md) §3 — Conventional Commits + scope.

```
feat(start-menu): ...
fix(desktop): ...
docs: ...
```

`feat: 1차 구현` 같은 메시지는 **더 이상 사용하지 않음**.

#### 4단계 (승인 전 커밋 금지)

1. **계획** — `git status`, `git diff`(staged/unstaged)로 미커밋 변경을 읽고, §3.2 기준으로 **커밋 묶음안**을 사용자에게 제시 ([HISTORY.md](./HISTORY.md) §3.4 형식).
2. **승인** — 사용자가 OK·수정 지시할 때까지 `git commit` **하지 않음**.
3. **실행** — 승인된 묶음만 순서대로 stage → commit.
4. **PR 메시지 초안** — 커밋 후 `.github/pull_request_template.md` 형식에 맞춰 PR 제목·본문 초안을 작성해 사용자에게 제시. `git push`, PR 생성, merge는 하지 않음.

| Cursor가 함 | Cursor가 하지 않음 |
|-------------|-------------------|
| 묶음안 작성, 승인 후 commit, PR 메시지 초안 작성 | `git push`, GitHub PR 생성, `main` merge, tag |
| hook 실패 시 수정 후 **새** commit | 승인 없이 commit, `git config` 변경, `--no-verify` |

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

- **일상**: `feature-cursor`만 사용 ([HISTORY.md](./HISTORY.md) §2.2).
- **추가 브랜치**: 며칠짜리 기능·WIP와 분리 필요할 때만 `feat/...` 등 — 끝나면 `feature-cursor`로 merge 후 삭제.
- AI가 **브랜치를 새로 만들거나 이름을 바꾸지 않음** (사용자 요청 시만).
- merge·PR·tag·**push**는 사용자 — 배포 준비 시 ([DEPLOY.md](./DEPLOY.md)).

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
- 커밋: **「커밋해줘」 등 명시 요청 시만** — 묶음안 제시 → 승인 → commit ([HISTORY.md](./HISTORY.md) §3.4). push는 사람.
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
