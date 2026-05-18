# CHANGELOG

이 파일은 **버전 단위로 무엇이 바뀌었는지** 기록합니다.  
맥락·동기·마이그레이션 스토리는 [HISTORY.md](./HISTORY.md)를 봅주세요.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르고, 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 사용합니다.

---

## [Unreleased]

### Added

- (다음 커밋부터 여기에 기록)

### Changed

### Fixed

### Removed

---

## [1.0.0] — 2026-05-18

1차 공개 목표 버전. Windows 데스크톱 메타포 포트폴리오의 첫 완성 단계.

### Added

- **모노레포**: `api/` (Express) + `web/` (Next.js 15 App Router)
- **API** `GET /v1/portfolio` — `api/data/portfolio.json` 제공
- **웹** TanStack Query로 포트폴리오 데이터 fetch, 로딩·에러 UI
- **데스크톱** 바탕화면 아이콘(열 배치), 선택·더블클릭·키보드 활성화
- **작업 표시줄 (Lnb)** Windows 버튼, 열린 창 목록, 시계, 트레이 장식
- **시작 메뉴** (`WindowsStartMenu`) — 최근 앱, 알파벳 목록, 커스텀 스크롤 레일
- **창** Zustand 기반 다중 창, 최소화·최대화·포커스
- **탐색기 스타일** 휴지통, 내 PC (`RecycleBinExplorerView`, `ThisPcExplorerView`)
- **Word 스타일** 소개 창 (`WordAppWindow` ← `about`)
- **콘텐츠 창** 스킬, 경력, 타임라인, 프로젝트 (`WindowContents`)
- **Chrome / GitHub 모달** iframe·프로필 (`ChromeLegacyModal`)
- **레거시 에셋** `npm run sync:legacy` — `juahcheon.github.io` → `web/public/img`
- **검증** 루트 `npm run verify` (api + web 타입·빌드)
- **문서** `docs/` PRD, ARCHITECTURE, CONTENT, DESIGN, AGENTS, WORKLOG, ROADMAP

### Changed

- 레거시 대비 **콘텐츠 단일화**: HTML 산재 → `portfolio.json`
- 데스크톱 아이콘 **webp 경로 소문자** 정규화 (Linux 배포 404 방지)

### Removed

- 바탕화면 **뚜레쥬르·탐앤탐스·KINNI** (레거시 브랜드 데모)
- (과거 README 정책) escapeFinal 데스크톱 아이콘 — 현재 JSON 미포함

### Fixed

- 이미지 로드 실패 시 바탕화면 **폴백 타일**(라벨 첫 글자)

---

## [0.1.0] — 2024-11-29

저장소 초기화.

### Added

- `Initial commit` — 프로젝트 골격

---

## 버전 올릴 때 체크리스트

1. `api/data/portfolio.json`의 `"version"` 숫자 증가 (스키마 호환 시)
2. 이 파일에 `[X.Y.Z] — 날짜` 섹션 추가
3. Git tag: `git tag v1.0.0` (공개 배포 시)
4. [HISTORY.md](./HISTORY.md)에 마일스톤 한 줄 추가 (선택)
