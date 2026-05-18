# ROADMAP — 할 일·우선순위

작업 **일지**는 [WORKLOG.md](./WORKLOG.md), 완료된 릴리스는 [CHANGELOG.md](./CHANGELOG.md)를 봅주세요.

우선순위: **P0** (1차 마무리) → **P1** (1.1) → **P2** (1.2+) → **P3** (2.0 검토).

---

## 현재 단계

| 항목 | 상태 |
|------|------|
| 제품 버전 | **1.0.0** (1차) |
| 개발 브랜치 | `feature-cursor` |
| 검수 | **2차 — Claude** (예정) |
| 배포 | web Vercel + API 별도 (README) |

---

## P0 — 1.0 마무리

- [ ] `feature-cursor` → Claude 검수 → `main` merge
- [ ] 프로덕션 `NEXT_PUBLIC_PORTFOLIO_API_URL` 설정·동작 확인
- [ ] `npm run verify` CI 또는 수동 게이트 통과
- [ ] Git tag `v1.0.0` + CHANGELOG 확정
- [ ] (선택) 라이브 URL README에 명시

---

## P1 — 1.1.0 (기능 보강)

### 콘텐츠·네비게이션

- [ ] 바탕화면 **Excel(경력)** · **PowerPoint(프로젝트)** 아이콘 연결 (`windowId`: experience, projects)
- [ ] 시작 메뉴 Placeholder 앱 정리 — 연결할 것 / 제거할 것 구분
- [ ] `portfolio.json`에 시작 메뉴 “최근 앱” 일부 이전 (선택)

### 품질

- [ ] 이미지 404 점검 (webp 대소문자, sync:legacy)
- [ ] 키보드 포커스·시작 메뉴 a11y 보강
- [ ] 모바일: 최소 안내 화면 또는 “데스크톱 권장” (전체 메타포 유지 시)

### 개발 프로세스

- [ ] 커밋 규칙 팀(본인) 합의 — HISTORY.md §3
- [ ] PR 템플릿 (변경 요약, 스크린샷, verify 체크)

---

## P2 — 1.2.0 (배포·외부 노출)

- [ ] SEO: title, description, OG (fixing-metadata 스킬 참고 가능)
- [ ] favicon·manifest 정리
- [ ] CASE_STUDY.md 또는 블로그용 “왜 Windows UI인가” 짧은 글
- [ ] Lighthouse 성능·접근성 목표치

---

## P3 — 2.0.0 (구조 변경 시만)

아래는 **breaking** 가능성이 있어 별도 설계 후:

- [ ] Headless CMS / Notion → API 대체
- [ ] i18n (한/영)
- [ ] 모바일 전용 레이아웃 (메타포 변경)
- [ ] 다크 모드 Windows 테마

---

## Claude 2차 검수 체크리스트 (예정)

검수 시 Claude에게 맡길 항목 예시:

- [ ] 타입·null 안전 (`WindowContents`, API fetch)
- [ ] 중복 id·window focus edge case
- [ ] SCSS 모듈 네이밍·미사용 클래스
- [ ] 보안: `iframe` URL, `target=_blank` rel
- [ ] 성능: 이미지 `unoptimized` 남용 여부
- [ ] 문서와 코드 불일치 (PRD 매핑 vs JSON)

결과는 PR 코멘트 또는 `docs/WORKLOG.md`에 “Claude 검수 YYYY-MM-DD”로 기록.

---

## 완료 시 표시

항목을 끝내면 `- [x]`로 바꾸고, 필요 시 CHANGELOG `[Unreleased]`에 한 줄 추가하세요.
