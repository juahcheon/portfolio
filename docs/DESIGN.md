# DESIGN — UI·스타일 가이드

Windows 데스크톱 메타포를 웹으로 옮길 때의 **시각·레이아웃·스타일 규칙**입니다.  
제품 의도는 [PRD.md](./PRD.md), web 구조는 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

---

## 1. 디자인 목표

| 목표 | 설명 |
|------|------|
| **친숙함** | Windows 10/11 데스크톱·작업 표시줄·시작 메뉴를 “알아보게” |
| **정보 도달** | 화려함보다 **한 번에 창이 열리는** 명확함 (PRD: 클릭 최소화) |
| **디테일 즐기기** | 스크롤 레일, 시계, 아이콘 선택 하이라이트 등 **작은 요소**에 시간 투자 |
| **유지보수** | 스타일은 **Tailwind + 최소 globals** — 파일 수·맥락 전환 최소화 |

---

## 2. 메타포 매핑 (Office · 시스템)

실제 Windows 앱 이름으로 **이력서 섹션**을 연상시킵니다.

| UI 라벨 | 역할 | 콘텐츠 성격 |
|---------|------|-------------|
| Word | 문서 | 소개·철학 |
| 제어판 | 설정 | 스킬 스택 |
| 내 PC / 휴지통 | 탐색기 | 분위기·장식 (깊은 탐색 없음) |
| Chrome / GitHub | 브라우저 | 외부·프로필 |
| Cursor | IDE | 제작 도구 소개 |

면접에서 “왜 Word가 소개냐” → **문서型 콘텐츠**라는 은유로 설명.  
Excel·PowerPoint 메타포는 **사용하지 않음** (경력·프로젝트 전용 Office 창 없음).

---

## 3. 왜 Tailwind CSS를 쓰는가

### 3.1 이 프로젝트에서의 선택 (1인·포트폴리오)

| 맥락 | 스타일 방식 |
|------|-------------|
| **협업·팀 프로젝트** (일반적으로) | **SCSS** — 공통 변수·믹스인·partial, 디자인 토큰 공유, 로직(`.tsx`)과 스타일(`.scss`) 분리로 리뷰·역할 분담이 쉬움 |
| **이 repo (1인 포트폴리오)** | **Tailwind** — **파일 수를 최소화**하고, 컴포넌트 하나당 `.tsx` + (필요 시) 짧은 `globals` 예외만 두기 위함 |

혼자 작업할 때는 `Component.tsx`와 `Component.module.scss`를 오가며 맥락을 나눌 필요가 적습니다.  
스타일을 **마크업과 같은 파일의 `className`**에 두면 “이 화면이 어떻게 생겼는지”를 한곳에서 읽을 수 있고, 포트폴리오 규모에서는 **유지보수 비용이 SCSS 분리 이득보다 작다**고 보고 Tailwind를 기본으로 했습니다.

### 3.2 Tailwind가 이 구조에 잘 맞는 추가 이유

위 “파일 최소화” 외에, 이 프로젝트에서 실제로 도움이 되는 점입니다.

| 이유 | 설명 |
|------|------|
| **설계 토큰 한곳** | `tailwind.config.ts`, `tailwind.palette.ts`에 `winBar`, `winBlue`, `shadow-win` 등 Windows 톤을 모아 두고 `className`에서 재사용 |
| **미사용 CSS 정리** | 빌드 시 쓰인 유틸만 남김 — 데모·포트폴리오에 쌓인 `.scss` dead code를 줄이기 쉬움 |
| **스타일 누수 방지** | SCSS 모듈처럼 파일을 나누지 않아도, 유틸은 **해당 요소에만** 붙이면 됨 (전역 클래스 남발만 피하면 됨) |
| **Next.js와 궁합** | App Router·PostCSS 파이프라인과 기본 세팅이 맞고, 레이아웃·반응형을 유틸 문자열로 빠르게 맞추기 좋음 |
| **복잡 UI도 동일 패턴** | 시작 메뉴처럼 상태가 많은 UI도 **TSX + Tailwind + (필요 시) `globals.css` 예외**로 통일 — 별도 500줄 `.scss` 파일 없음 |

Tailwind가 **만능은 아닙니다.** `::-webkit-scrollbar` 같은 pseudo, 긴 `@keyframes`, 레거시 Chrome 모달처럼 **선언형 CSS가 읽기 나은 구간**은 `globals.css`의 `@layer components`에만 둡니다 (아래 §3.4).

### 3.3 기술 스택 (스타일)

| 용도 | 도구 |
|------|------|
| 컴포넌트·레이아웃 | **Tailwind 3** — `className`, `tailwind.config.ts`, `explorerShellClasses.ts` 등 |
| 전역·예외 | `globals.css` — CSS 변수, `@layer utilities`, pseudo/레거시 모달 |
| 아이콘 | `react-icons`, Font Awesome 6 (CDN in globals), `/public` PNG·SVG·webp |
| 폰트 | `layout.tsx` next/font (본문 400) |

**사용하지 않음:** `*.module.scss` — 과거 AI가 추가한 SCSS 모듈은 제거했고, 새 UI도 SCSS 모듈을 추가하지 않습니다.

### 3.4 `globals.css`만 쓰는 경우

| 예 | 이유 |
|----|------|
| `.startMenuListScroll` | 스크롤바 `::-webkit-scrollbar` — Tailwind만으로 표현 어려움 |
| `.clmPageModal` 등 | 레거시 Chrome 모달 — 탭·주소창 pseudo·긴 공통 규칙 |
| `text-winSkyBlue` 등 | JIT 청크에서 빠질 수 있는 토큰을 `@layer utilities`에 고정 ([ARCHITECTURE.md](./ARCHITECTURE.md) 참고) |

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

### 4.3 클래스·네이밍

- Tailwind 유틸 + 프로젝트 토큰(`bg-winBar`, `text-winBlue` 등) 위주
- 반복되는 긴 `className` 묶음은 `explorerShellClasses.ts`처럼 **TS 상수**로 분리 가능
- `!important`는 **사용하지 않음** (서드파티 override 불가피한 경우만 예외)
- 인라인 `style`은 **동적 값**(스크롤 thumb 위치 등)처럼 Tailwind로 표현하기 어려울 때만

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
2. 스타일: **Tailwind 우선** — pseudo·긴 keyframes만 `globals.css` 검토.
3. `className` 위주 — 인라인 style·새 SCSS module 지양.
4. public 에셋 경로·webp 소문자.
5. 키보드·aria 최소 한 가지.
6. CONTENT/PRD 매핑 표 업데이트.

---

## 11. 관련 문서

- [PRD.md](./PRD.md)
- [CONTENT.md](./CONTENT.md)
- [ROADMAP.md](./ROADMAP.md) — a11y, SEO
