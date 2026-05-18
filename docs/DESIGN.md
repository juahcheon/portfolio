# DESIGN — UI·스타일 가이드

Windows 데스크톱 메타포를 웹으로 옮길 때의 **시각·레이아웃·스타일 규칙**입니다.  
제품 의도는 [PRD.md](./PRD.md), SCSS 파일 위치는 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

---

## 1. 디자인 목표

| 목표 | 설명 |
|------|------|
| **친숙함** | Windows 10/11 데스크톱·작업 표시줄·시작 메뉴를 “알아보게” |
| **정보 도달** | 화려함보다 **한 번에 창이 열리는** 명확함 (PRD: 클릭 최소화) |
| **디테일 즐기기** | 스크롤 레일, 시계, 아이콘 선택 하이라이트 등 **작은 요소**에 시간 투자 |
| **유지보수** | Tailwind(레이아웃·유틸) + SCSS 모듈(복잡 UI) 분리 |

---

## 2. 메타포 매핑 (Office · 시스템)

실제 Windows 앱 이름으로 **이력서 섹션**을 연상시킵니다.

| UI 라벨 | 역할 | 콘텐츠 성격 |
|---------|------|-------------|
| Word | 문서 | 소개·철학 |
| Excel | 스프레드시트 | 경력·숫자 요약 |
| PowerPoint | 슬라이드 | 프로젝트 |
| 제어판 | 설정 | 스킬 스택 |
| 내 PC / 휴지통 | 탐색기 | 분위기·장식 (깊은 탐색 없음) |
| Chrome / GitHub | 브라우저 | 외부·프로필 |
| Cursor | IDE | 제작 도구 소개 |

면접에서 “왜 Word가 소개냐” → **문서型 콘텐츠**라는 은유로 설명.

---

## 3. 기술 스택 (스타일)

| 용도 | 도구 |
|------|------|
| 전역·유틸 | Tailwind 3 (`globals.css`, `@layer utilities`) |
| 시작 메뉴 등 복잡 UI | **SCSS Modules** — `*.module.scss`, **camelCase** 클래스 |
| 아이콘 | `react-icons`, Font Awesome 6 (CDN in globals), `/public` PNG·SVG·webp |
| 폰트 | `layout.tsx` next/font (본문 400) |

### 3.1 왜 SCSS 모듈인가 (시작 메뉴)

`WindowsStartMenu.module.scss` (~500줄)는 스크롤 레일·휠 스무딩·행 호버 등 **상태가 많은 UI**입니다.  
Tailwind만으로는 가독성이 떨어져 **컴포넌트 전용 모듈**로 격리했습니다.  
다른 컴포넌트로 스타일이 **새지 않도록** className은 모듈 export만 사용합니다.

### 3.2 Tailwind vs SCSS 선택 기준

| Tailwind | SCSS module |
|----------|-------------|
| 바탕화면·Lnb·WinWindow 크롬 | WindowsStartMenu |
| 탐색기 shell (`explorerShellClasses`) | (필요 시) Chrome 레거시 일부 globals |

---

## 4. 디자인 토큰

### 4.1 CSS 변수 (`globals.css`)

```css
:root {
  --win-title: #0078d4;
  --win-border: #a0a0a0;
  --win-sky-blue: #00bcd4;
}
```

Tailwind `theme`와 별도로 유지 — `.next` 재빌드 시에도 `text-winSkyBlue` 등이 사라지지 않게 globals `@layer utilities`에 고정.

### 4.2 Tailwind (`tailwind.config` / palette)

- `bg-desk`, `bg-winBar`, `text-winBlue`, `shadow-win`, `shadow-task` 등 Windows 톤.
- `web/tailwind.palette.ts` — 팔레트 확장 참고.

### 4.3 SCSS 모듈 네이밍

- **camelCase** — 예: `startMenuRoot`, `startMenuScrollRail`, `startMenuRow`
- BEM을 엄격히 쓰지 않고, **컴포넌트 접두**로 충돌 방지
- `!important`는 **사용하지 않음** (서드파티 override 불가피한 경우만 예외)

---

## 5. 레이아웃 원칙

### 5.1 바탕화면

- 아이콘 **열(column)** 단위 flex — `column` 필드로 JSON 제어.
- 아이콘 영역 너비 ~100px, 라벨 Windows 스타일 **흰 글자 + 검은 text-shadow**.
- 선택: `#add7ff7d` 테두리, `#80b9ee72` 배경.
- `cursor: default` — 전역 `button { cursor: default }` (Windows 느낌).

### 5.2 작업 표시줄 (Lnb)

- 고정 `bottom-0`, 높이 **50px**, `bg-winBar`, `backdrop-blur`.
- Windows 버튼 · 검색 · 작업 보기 · 탐색기 — **장식** (대부분 미연결).
- 열린 창: 중앙 스크롤 영역, active 시 흰색 반투명 배경.
- 시계: 오전/오후 + `YYYY-MM-DD` 두 줄.

### 5.3 창

- 기본 중앙 배치, `stackIndex`로 cascade offset (14px, 12px).
- 최대화 시 `calc(100vh - 50px)` — 작업 표시줄 제외.
- active: `outline` 파란색 반투명.
- Cursor 창만 `rounded-[10px]` (메타포).

### 5.4 시작 메뉴

- `role="dialog"`, `aria-label="시작 메뉴"`.
- 좌측 레일(메뉴·계정·전원) + 중앙 스크롤 리스트.
- 커스텀 스크롤바 레일·thumb (`pointer` 드래그).
- `prefers-reduced-motion: reduce` 시 휠 스무딩 비활성.

---

## 6. 이미지·아이콘

| 종류 | 경로 | 비고 |
|------|------|------|
| 바탕화면 | `/icons/desktop/*` | SVG·PNG |
| 레거시 작업줄 | `/img/*`, `/img/webp/*` | sync:legacy |
| 폴백 | 라벨 첫 글자 그라데이션 타일 | onError |

- **shape**: `circle` (DS Helper), `rounded10` (Cursor).
- 배포: 경로 **소문자** 통일 (CONTENT.md).

---

## 7. 인터랙션

| 동작 | 패턴 |
|------|------|
| 아이콘 열기 | 더블클릭 · Enter · Space |
| 바탕화면 | 빈 곳 클릭 → 선택 해제 |
| 시작 메뉴 | Esc 닫기 · 항목 클릭 시 `onClose` |
| 창 | 최소화 → 작업줄 위 버튼, 복원 클릭 |

**의도적으로 없음**: 폴더 더블클릭으로 하위 경로 진입, 실제 파일 열기.

---

## 8. 접근성 (1차 · 개선 예정)

- 일부 `aria-label`, `role="dialog"`.
- 키보드: 바탕화면·시작 메뉴 Esc.
- 색 대비·포커스 링: 전면 audit은 P1 (ROADMAP).

---

## 9. 레거시 Chrome 모달

`ChromeLegacyModal` + `globals.css` 내 Chrome 탭·주소창 의사 스타일 —  
GitHub variant는 pinned repo·차트 이미지 추가.

---

## 10. 새 UI 추가 시 체크리스트

1. PRD에 메타포·스코프 맞는지 확인.
2. 스타일: Tailwind로 충분한지, 100줄 넘으면 SCSS module 검토.
3. className **모듈 또는 Tailwind** — 인라인 style 지양.
4. public 에셋 경로·webp 소문자.
5. 키보드·aria 최소 한 가지.
6. CONTENT/PRD 매핑 표 업데이트.

---

## 11. 관련 문서

- [PRD.md](./PRD.md)
- [CONTENT.md](./CONTENT.md)
- [ROADMAP.md](./ROADMAP.md) — a11y, SEO
