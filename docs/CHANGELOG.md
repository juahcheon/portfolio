# CHANGELOG

이 파일은 **버전 단위로 무엇이 바뀌었는지** 기록합니다.  
맥락·동기·마이그레이션 스토리는 [HISTORY.md](./HISTORY.md)를 봐주세요.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르고, 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 사용합니다.

---

## [Unreleased]

### Added

- 모바일 포트폴리오: 아이폰 홈 화면 레퍼런스 기반의 위젯 2개·4열 앱 아이콘·전체 화면 검색·반투명 독·앱 홈 복귀 막대. 기존 바탕화면 색 #5F9EA0 계열 곡선 배경과 아이콘을 재사용하고 읽던 위치·선택·입력 기록 보존.
- AI Switch Docs 바탕화면 바로가기와 독립 프로젝트 항목: 본인 PR·코드에서 확인한 다국어 문서·튜토리얼·검수 자동화·업데이트 소식 자동화 스킬 설계·구현 정리
- AI Switch 바탕화면 아이콘과 프로젝트 소개: 공식 아이콘 사용, 로그인 없이 볼 수 있는 실제 화면 캡처와 원본 이미지 링크 제공
- 루트 [AGENTS.md](../AGENTS.md) — AI 공통 규칙 (디자인 임의 수정 금지, 데이터 로딩 순서)
- [docs/DEPLOY.md](./DEPLOY.md) — 배포 URL placeholder (미정)

### Changed

- 인턴 실무 중심 자기소개·현재 재직 상태와 Ops 비동기 갱신·성능, 디자인 토큰, Docs 작성 자동화 사례를 반영. 최신 PC·모바일 UI와 프로젝트 구성을 유지.
- 이력서 PDF의 기존 5쪽 디자인을 보존하고 AI Switch 이미지 스튜디오·공공자료 화면 2장을 추가. 원본 템플릿과 텍스트 교체 데이터로 같은 디자인을 재생성하도록 정리.

- 모바일에서만 휴지통·내 PC를 제외하고 스킬을 iOS 메모 스타일로 변경. 분야별 기술 목록·검색·메모 아이콘 제공, PC 탐색기 유지.
- 모바일 자기소개를 Word 파일 도구 모음·흰 문서·페이지 이동으로 복원하고, 프로젝트를 Chrome 주소창·하단 도구 모음·검색 가능한 탭 목록으로 변경. 본문 14px·보조 13px로 조정하고 정보 카드의 과한 여백 축소.
- 기기명 대신 뷰포트 너비·높이로 반응형 전환: 768×600px 이상에서 데스크톱 창을 제공하고, 그보다 좁거나 낮으면 모바일 앱으로 표시. 768~1023px 창·작업 표시줄 간소화, 모바일 홈 아이콘 4열, 안전 영역·터치 실행·창 배치 보완.

- GitHub 창을 실제 프로필을 참고한 라이트 테마와 프로필·카드·잔디 배치로 변경. 실제 아바타, 비공개 저장소 표시, 잔디 재요청·새로고침 및 실패 안내 추가, 임의 저장소 수 제거
- GitHub 잔디를 공개 기여 달력 데이터로 렌더링하고 날짜·기여 수 hover 툴팁 및 키보드 이동 추가
- 자기소개 근무 경험의 주요 기능을 굵게 강조하고 3페이지 프로젝트 소개·개별 상세 바로가기 추가. 기존 프로젝트 창에서도 요청한 항목으로 전환
- 자기소개 하단의 고정 버튼을 제거하고, 화면 오른쪽 아래 ‘둘러보기 안내’에 화면 아이콘·목적별 제목·오른쪽 꺾쇠로 구성된 바로가기 추가
- 데스크톱 창 제목 표시줄 더블클릭으로 최대화·이전 크기 복원 전환. 공통 창과 프로젝트·GitHub Chrome 창에 적용하고 창 조작 버튼은 제외
- AI Switch 아이콘은 서비스로 직접 연결하고 프로젝트 목록을 AI Switch → DS Helper → 말해부엉 순서로 통일. DS Helper 링크를 테스트 도메인으로 변경하고 프로젝트 종료 상태와 기존 기여 내역 표시
- 상상력집단 경력과 AI Switch 프로젝트: 본인 커밋·PR를 근거로 디자인 토큰화, 이미지 처리, 회의록·콘솔·공지·다국어 업무 보완
- `ai-switch-web` 본인 커밋·PR를 근거로 다국어 문서 사이트·튜토리얼·랜딩 내비게이션·스크린샷 검수 자동화·AI 모델 동향 통합·검색 및 배포 개선을 추가하고 공개 Docs 링크 연결
- Chrome 레거시 모달: 단일 탭만 표시, 탭 hover 배경 제거, 주소줄 뒤로·앞으로·새로고침 가로 배치 및 자물쇠·별·더보기 정렬 조정
- 바탕화면: Chrome → **프로젝트** 창(`projects`, 기존 **ChromeLegacyModal** 셸 + 본문만 `projects` JSON), Word 라벨 → **자기소개**, 아이콘 순서(자기소개↔스킬, 프로젝트↔DS Helper) 조정; `profile.title` 웹 프론트엔드 개발자
- Cursor 창: 연락·GitHub 안내로 정리
- 문서: PRD/CONTENT/ARCHITECTURE 창 매핑 갱신
- 문서: 배포일 미정·구현 우선 명시
- Excel/PowerPoint 창 제거 — 경력·프로젝트는 JSON·GitHub pinned 등으로만 활용 가능
- [AGENTS.md](../AGENTS.md): 1인·단순함 원칙, 경력 UI 추후, Query+props 우선, 금지 제안 목록
- [.cursor/rules/portfolio.mdc](../.cursor/rules/portfolio.mdc): Cursor alwaysApply 규칙

### Removed

- Excel(`experience`) / PowerPoint(`projects`) 창 UI 및 `windowId` 매핑
- README escapeFinal 안내

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
