# WORKLOG — 작업 일지

**무엇을 언제 했는지** 세션·날짜 단위로 남깁니다.  
할 일·우선순위는 [ROADMAP.md](./ROADMAP.md), 버전별 요약은 [CHANGELOG.md](./CHANGELOG.md)를 봅주세요.

형식은 자유롭되, 아래 템플릿을 권장합니다.

---

## 템플릿 (복사용)

```markdown
### YYYY-MM-DD — 제목 (도구: Cursor / Claude)

**목표**
- 

**한 일**
- 

**결과 / 스크린샷·URL**
- 

**다음**
- 

**메모**
- 
```

---

## 2024-11-29 — 저장소 초기화

**한 일**
- `Initial commit`, 프로젝트 골격

---

## 2025-05-13 ~ 2025-05-18 — 1차 구현 (Cursor)

**목표**
- `juahcheon.github.io` Windows 데스크톱 경험을 Next.js 모노레포로 이전

**한 일**
- `api/` Express + `portfolio.json`
- `web/` Next 15, PortfolioDesktop, Lnb, WinWindow
- 탐색기(휴지통, 내 PC), Word(About), WindowContents
- Chrome/GitHub 모달, 바탕화면 아이콘·에셋 sync:legacy
- 시작 메뉴 (`WindowsStartMenu` + SCSS), 스크롤 레일
- 레거시 브랜드 아이콘 제거, DS Helper 외부 링크

**메모**
- 커밋 메시지가 `feat: 1차 구현`으로 반복됨 → 이후 scope별 커밋으로 전환 (HISTORY.md §3)

---

## 2026-05-18 — 문서화

**목표**
- PRD, ARCHITECTURE, CONTENT, HISTORY, CHANGELOG, DESIGN, AGENTS, WORKLOG, ROADMAP 정리

**한 일**
- `docs/` 초안 작성
- 1.0.0 CHANGELOG 기준선

**다음**
- Claude 검수 브랜치/PR
- ROADMAP P0 항목 착수

---

## (여기부터 새 세션 기록)

### 2026-09-09 — AI Switch 경력 문구 정리

- `web/data/portfolio.json`의 상상력집단 경력을 비디오 스튜디오·이미지 스튜디오·공공자료 페이지의 UI/UX 및 리디자인 중심으로 수정.
- 이미지 스튜디오·공공자료 화면을 확인하고 JSON 구문·`git diff --check` 통과.
- [Notion 업무일지](https://app.notion.com/p/027e359a64e04b4194e320624730067d)의 2026-08-03~2026-09-09 기록 27건을 읽고 상상력집단 경력을 핵심 업무 6개 묶음과 세부 작업 목록으로 보완. UI/UX·관리자·가이드·회의록·인증·API·AI 협회 업무 반영.
- 실패로 기록된 `/status` 개선 등은 성과에서 제외하고, AI 협회 도메인 이관은 사전 검토·계획 수립 범위로 표기.
- AI Switch 공식 로고를 저장하고, 바탕화면 아이콘에서 기존 프로젝트 창의 해당 항목과 스크린샷을 바로 열도록 연결.
- 로그인된 Chrome의 비디오 스튜디오 첫 화면·제작 화면, 이미지 스튜디오, 공공자료 화면을 총 4장 캡처. 공개 이미지 경로로 저장해 로그인 없이 열람하도록 반영.
- 검증을 위해 기존 `web/package.json` 의존성을 pnpm으로 설치 (패키지 목록·잠금 파일 변경 없음).
- 검증: `web`의 `pnpm run verify`(타입 검사·프로덕션 빌드), AI Switch 바로 열기·기본 프로젝트 렌더링, 브라우저에서 바탕화면 아이콘 더블클릭·작업 화면 표시, 인증 없는 아이콘·스크린샷 4장 HTTP 200 응답 확인.
- 공공자료의 ‘통계·지표 인용’ 상세 화면 1장을 추가 캡처해 AI Switch 작업 화면을 총 5장으로 보완.

### 2026-09-10 — nuri-ai 커밋·PR 기반 경력 보완

- `nuri-ai`의 최신 `main`·`dev`·`feat/ja` 이력과 `juahcheon` 작성 비머지 커밋 179개, 본인이 연 PR 28건(병합 27건·미병합 종료 1건)을 대조. 사용자 확인에 따라 다른 작성자의 커밋은 본인 구현으로 추가하지 않음.
- [PR #262](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/262)와 `8571a5b56`·`05bca5f6c` 등에서 디자인 토큰화·공통 CSS 변수 적용·기존 시각 값 보존·Figma 변수 내보내기 보완을 확인해 자기소개와 AI Switch 프로젝트에 반영.
- [#303](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/303) API 키·커넥터, [#348](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/348) 이미지 로딩·캐시·상태 복구, [#425](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/425) 회의록·영상 장면 참조, [#441](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/441) 공공자료, [#475](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/475) 다국어 자동 점검, [#468](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/468)·[#483](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/483) 공지·대시보드 작업을 구체화.
- 인증은 [#254](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/254)·[#268](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/268)·[#273](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/273)·[#325](https://github.com/ImaginationGroup-co-kr/nuri-ai/pull/325)의 세션 복구·로그아웃·계정 연결·콜백 수정 범위로 정리. 다른 작성자의 토큰 보안 체계 전체 구축·에이전트 빌더·KPI 집계 변경과 구분.
- 롤백된 상태 운영 패널은 성과에서 제외하고 유지된 공통 상태 화면 개선만 반영. 미병합 PR #333을 별도 완료 실적으로 계산하지 않음. 기존 Notion 기반 가이드·AI 협회 업무와 스크린샷 5장은 유지.
- 검증: JSON 구문·토큰화 노출·기존 프로젝트/경력/이미지 보존 검사, TypeScript, `git diff --check` 통과. `pnpm run verify`의 프로덕션 빌드는 Windows Application Control의 SWC 실행 차단으로 실패했으며 정상 권한 재시도에서도 동일. 컴파일러 설정·보안 정책은 변경하지 않음.

### 2026-09-10 — ai-switch-web 커밋·PR 기반 경력 보완

- `ImaginationGroup-co-kr/ai-switch-web`의 최신 `main`(`1a3a3c6`)과 전체 브랜치, `juahcheon`이 작성한 병합 PR 10건을 확인. PR의 원본 커밋 작성자도 모두 `juahcheon`임을 대조하고 squash·merge로 중복된 작업은 합쳐서 반영.
- [#42](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/42)·[#43](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/43)의 Astro·Starlight 문서 사이트 이관, 5개 언어 가이드·튜토리얼·PDF와 사이드바·FAQ·목차 UX를 구체화. [#44](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/44)의 랜딩·문서 내비게이션과 공통 푸터 개선 추가.
- [#45](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/45)의 제품 가이드 확장·AI 모델 동향 페이지 통합과 [#47](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/47)의 한국어 기준 다국어 문서 정합성·스크린샷 처리·렌더링 검수 자동화 반영. AI 모델 동향은 기존 콘텐츠의 이관·통합 범위로 표기.
- [#51](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/51)의 공유·검색 메타데이터와 크롤러 안내, [#52](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/52)·[#53](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/53)·[#54](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/54)의 문서 진입·브라우저 언어·기존 URL 리디렉션 보완 추가. 검색 순위·유입 증가 같은 미확인 성과는 기재하지 않음.
- [#46](https://github.com/ImaginationGroup-co-kr/ai-switch-web/pull/46)의 CI 설치 중 잠금 파일 변경으로 발생한 운영 배포 오류 수정과 플랫폼 의존성 정리를 반영.
- 상상력집단 경력과 기존 AI Switch 프로젝트에 통합하고 Astro 스택·공개 [AI Switch Docs](https://aiswitch.co.kr/docs/ko/introduction/) 링크 추가. UI/UX·리디자인 중심 역할과 디자인 토큰화, 기존 업무·다른 경력·프로젝트·스크린샷 5장 보존.
- 검증: JSON 구문·기존 데이터 보존·중복 검사, TypeScript, 자기소개·AI Switch 컴포넌트의 React 렌더링, Docs 공개 페이지 접근 및 `git diff --check` 통과. 전체 빌드는 앞선 Windows Application Control의 SWC 차단으로 완료하지 못한 상태이며 이 콘텐츠 변경을 위해 보안 정책이나 빌드 설정을 변경하지 않음.

### YYYY-MM-DD — 

**목표**
- 

**한 일**
- 
