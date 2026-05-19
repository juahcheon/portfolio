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

### 2.2 브랜치 전략 (1인 포트폴리오)

팀 프로젝트처럼 `develop` + `release/*` + 티켓별 브랜치를 늘리지 **않습니다**.  
오버헤드 대비 이득이 거의 없고, 문서·검수·배포만 복잡해집니다.

#### 기본 2브랜치 (현재·권장 유지)

| 브랜치 | 용도 |
|--------|------|
| `feature-cursor` | **일상 작업** — 기능·UI·JSON·docs 초안. Cursor 커밋·push 기본 위치 |
| `main` | **안정·배포** — verify 통과·CHANGELOG 반영 후 merge. Git tag `v1.x.x`는 여기 |

**흐름**

1. 평소: `feature-cursor`에서 작업 → 작은 커밋을 자주 (§3).
2. 마일스톤: `npm run verify` → CHANGELOG 정리 → `main`에 merge (**push는 사람**).
3. 공개: `main`에 tag → 호스팅 배포 ([DEPLOY.md](./DEPLOY.md)).

`main`이 `feature-cursor`보다 뒤처져 있어도 정상입니다. 1차 구현이 끝날 때 한 번 merge하면 됩니다.

#### 추가 브랜치는 “필요할 때만”

| 상황 | 예시 이름 | 이유 |
|------|-----------|------|
| 며칠 걸리는 기능·verify가 깨질 수 있음 | `feat/recycle-bin-detail` | `feature-cursor`를 오래 망가뜨리지 않음 |
| `main` 긴급 수정인데 작업 트리에 WIP가 많음 | `fix/desktop-icon-404` | WIP와 분리 (드묾) |
| 2차 검수 | `review/claude-*` 또는 PR | Claude diff 리뷰 ([AGENTS.md](./AGENTS.md)) |

작업이 끝나면 **해당 브랜치 → `feature-cursor` merge 후 삭제**.  
`main`으로 바로 쌓지 않습니다 (검수·CHANGELOG 단계를 건너뜀).

#### 하지 않을 것

- AI 도구마다 브랜치 (`cursor-*`, `claude-*` …) — 지금은 `feature-cursor` 하나로 충분.
- 사소한 수정마다 `feat/...` 브랜치 — 커밋 단위(§3)로 나누는 편이 가볍습니다.
- `main`에 직접 일상 커밋 — 배포 스냅샷이 흐려짐.

이름을 나중에 `develop`으로 바꿔도 되지만, **지금 구조를 바꿀 필요는 없습니다.**

자세한 AI·커밋 워크플로는 [AGENTS.md](./AGENTS.md) §3.3·§5.

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
2. `refactor(window): Excel/PowerPoint 창 제거` (해당 시)
3. `fix(web): 프로덕션 API URL env 검증`
4. `chore: bump portfolio.json version to 1`

### 3.4 Cursor 커밋 워크플로 (사용자 요청 시)

**push·merge·tag는 사람**이 합니다. Cursor(에이전트)는 **커밋만**, 그리고 **「커밋해줘」라고 말했을 때만** 합니다.

#### 트리거

- 사용자: 「커밋해줘」, 「커밋 계획 잡아줘」 등 **명시적 요청**
- 그 외 세션 종료·기능 완료만으로는 **자동 커밋하지 않음**

#### 3단계 (필수)

| 단계 | 담당 | 내용 |
|------|------|------|
| **1. 묶음 계획** | Cursor | `git status` / `git diff`로 미커밋 변경 읽기 → 커밋 단위(§3.1·§3.2)로 **묶음안** 작성 |
| **2. 승인** | 사람 | 묶음별 메시지·포함 파일 확인. 수정 요청 가능 |
| **3. 실행** | Cursor | 승인된 묶음만 순서대로 `git add` → `git commit`. **push 금지** |

#### 묶음안 형식 (제시용)

```markdown
## 커밋 계획 (N개)

### 1. feat(explorer): 휴지통 빈 상태 문구
- 파일: `web/src/components/explorer/RecycleBinExplorerView.tsx`
- 메시지: `feat(explorer): 휴지통 빈 폴더 안내 문구 추가`

### 2. docs: Git 브랜치·커밋 워크플로
- 파일: `docs/HISTORY.md`, `docs/AGENTS.md`
- 메시지: `docs: 1인 브랜치 전략 및 Cursor 커밋 3단계 정리`

승인해 주시면 위 순서로 커밋합니다. (push는 하지 않습니다)
```

#### 묶는 기준

- **한 묶음 = 한 의도** (scope·type이 같거나, 되돌리기 단위가 하나).
- `docs`만 / `content`만 / UI 한 영역 — 가능하면 분리.
- `.env`, credential, 대용량 바이너리 — 커밋 제외 후 사용자에게 알림.
- pre-commit hook 실패 시: amend하지 않고 **원인 수정 후 새 커밋**.

상세 에이전트 규칙: [AGENTS.md](./AGENTS.md) §3.3.

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
- Excel / PowerPoint 창 제거 — `jobs`·`projects` JSON은 GitHub 등에서만 사용.
- 시작 메뉴 PlaceholderRow — 클릭 무동작 (의도적 장식).
- Windows 전용 에셋 파일명 대소문자 — 배포 환경에서 주의 (README·CONTENT 참고).

---

## 6. 관련 문서

- [CHANGELOG.md](./CHANGELOG.md)
- [ROADMAP.md](./ROADMAP.md)
- [WORKLOG.md](./WORKLOG.md)
- [AGENTS.md](./AGENTS.md)
