# Portfolio — Windows desktop UI

**Vercel에 `web/`만** 배포합니다. 데이터는 Next Route Handler `GET /api/v1/portfolio` (`web/data/portfolio.json`).

## 문서

| 문서 | 설명 |
|------|------|
| [docs/PRD.md](docs/PRD.md) | 제품 요구사항·화면 매핑 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 기술 구조·API 분리 이유 |
| [docs/CONTENT.md](docs/CONTENT.md) | `portfolio.json` 수정 가이드 |
| [docs/DESIGN.md](docs/DESIGN.md) | UI·SCSS 규칙 |
| [docs/HISTORY.md](docs/HISTORY.md) | 프로젝트 연대기·커밋·버전 전략 |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 버전별 변경 목록 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 할 일·우선순위 |
| [docs/WORKLOG.md](docs/WORKLOG.md) | 작업 일지 |
| [docs/AGENTS.md](docs/AGENTS.md) | Cursor / Claude 협업 (상세) |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Vercel 배포·URL |
| [AGENTS.md](AGENTS.md) | **AI 공통 규칙 (세션마다 먼저 읽기)** |

## 사람인 취업 지원 스킬

[사람인 취업 지원 인수인계](.agents/skills/saramin-job-application/SKILL.md)는 공고 선별, 커밋 근거 확인, 회사별 자기소개서, PDF 반영, 실제 제출본 검증과 HTML 지원 기록 관리 기준을 담고 있습니다.

이 스킬이 포함된 브랜치를 내려받아 Codex에서 저장소를 연 뒤 사용합니다. 다른 컴퓨터나 프로젝트에서의 설치 방법도 스킬 안에 있습니다.

```text
$saramin-job-application 오늘도 5곳 지원해줘. 기존 지원 내역부터 확인해.
```

개인 지원 자료는 Git에서 제외한 `.job-search/` 또는 별도 비공개 폴더에 보관합니다. 스킬에는 실제 연락처·지원서·로그인 정보가 포함되지 않습니다.

## 구조

| 경로 | 설명 |
|------|------|
| `api/` | (레거시) Express — 로컬·참고용. **배포에는 미사용** |
| `web/` | Next.js 15, Tailwind, Route Handler, TanStack Query, Zustand |
| `web/data/portfolio.json` | 배포용 콘텐츠 (Vercel에 포함) |

## 레거시 데스크톱·작업줄 에셋 (필수)

`juahcheon.github.io`와 동일한 **webp·PNG**가 `web/public/img/`에 있어야 아이콘이 보입니다.

```powershell
cd D:\factory\portfolio\web
npm run sync:legacy
```

기본 소스 경로는 `D:\factory\juahcheon.github.io` 입니다. 다른 위치면:

```powershell
$env:LEGACY_ROOT="C:\path\to\juahcheon.github.io"; npm run sync:legacy
```

복사 항목: `img/webp/*`, `task-remove.png`, `task02-remove.png`, `folder_lnb.png`, `protect-remove.png`, `chrome_logo.svg`, `wifi.svg`

### 바탕화면 아이콘이 안 보일 때

`web/public/img/webp/` 등에 **webp·PNG가 없으면** 브라우저가 이미지를 못 불러옵니다. 위 `npm run sync:legacy`로 `juahcheon.github.io/img` 전체를 복사한 뒤 새로고침하세요. 복사 전에는 레이블 첫 글자가 들어간 **임시 타일**이 보이도록 되어 있습니다.

Windows에서만 대소문자가 다른 파일명(예: `word.WebP`)을 쓰는 경우, 배포(Linux)에서 404가 날 수 있어 JSON은 `/img/webp/word.webp`처럼 **소문자 확장자**를 기준으로 맞춰 두었습니다. 로컬 파일명이 다르면 `webp` 폴더 안 이름을 `.webp`로 맞추거나 동기화 스크립트로 정리하세요.

## 로컬 실행

```powershell
cd D:\factory\portfolio\web
npm install
npm run dev
```

- http://localhost:3003
- 데이터: http://localhost:3003/api/v1/portfolio

`api/data/portfolio.json`만 수정했다면 `npm run sync:content`로 `web/data`에 반영하세요.

## Vercel 배포

- **프로덕션:** [https://portfolio-dusky-three-v0owey1kvg.vercel.app/](https://portfolio-dusky-three-v0owey1kvg.vercel.app/)
- Root Directory: **`web`**
- 상세: [docs/DEPLOY.md](docs/DEPLOY.md)

## 검증

`api`·`web` 각각 `npm install` 후 루트에서:

```powershell
cd D:\factory\portfolio
npm run verify
```

## 데스크톱 아이콘

- 뚜레쥬르·탐앤탐스·KINNI 제거
- Excel / PowerPoint 전용 창 없음 (Office 메타포 미사용)
- 나머지는 윈도우 스타일 창으로 섹션 표시 (데이터는 API)

## 배포

프로덕션 URL은 [docs/DEPLOY.md](docs/DEPLOY.md) 및 `web/data/portfolio.json`의 `siteUrl`과 동일하게 유지합니다.
