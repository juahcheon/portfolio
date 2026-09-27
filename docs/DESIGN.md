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
- 활성 창에도 색상 `outline`을 추가하지 않으며 기본 회색 테두리를 유지합니다.
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

전역 ‘둘러보기 안내’ 버튼은 오른쪽 아래, 작업 표시줄 위에 고정합니다. 마우스를 올리면 열리고 버튼과 패널 사이를 이동할 때도 유지됩니다. 영역을 벗어나면 접되, 내부에 키보드 포커스가 있으면 유지합니다. 펼치면 각 행에 화면 아이콘·16px 목적별 제목·오른쪽 꺾쇠를 표시하고 행 전체를 이동 버튼으로 사용합니다. 번호·설명·별도 하단 링크는 표시하지 않습니다. 선택·바깥 클릭·Escape로 접으며 창을 최대화해도 접근할 수 있습니다.

폭 768px 미만 또는 높이 600px 미만에서는 제공된 아이폰 홈 화면 레퍼런스를 사용합니다. 기존 desktop.wallpaper의 #5F9EA0 계열 곡선 배경 위에 실제 시각, 소개·오늘 날짜 위젯 2개, 둥근 사각형 앱 아이콘 4열, 검색 알약 버튼을 배치합니다. 기존 아이콘을 재사용하고 홈 하단에는 자기소개·프로젝트·GitHub·CMD 4개 앱의 반투명 독을 고정합니다. 검색은 흐린 배경의 전체 화면 대화상자에서 앱 이름과 실제 프로젝트 이름·설명·기술을 필터링하며 결과를 누르면 해당 화면을 엽니다. 앱 화면은 전체 화면으로 표시하고 앱 도구 모음의 복귀 버튼과 하단 홈 막대(34px와 안전 영역 중 큰 높이)를 제공합니다. 자기소개는 Word의 파란 파일 도구 모음·모바일 보기 표시·사각형 흰 문서·하단 문서 페이지 이동으로 구성합니다. 프로젝트는 Chrome의 알약형 주소창·하단 탐색 도구 모음·검색 가능한 프로젝트 탭 목록으로 구성하고 정보는 간결한 목록으로 표시합니다. PC의 Word·Windows 스타일은 유지합니다. 홈 이동 후에도 읽던 위치·프로젝트 선택·CMD 기록은 유지합니다.

자기소개·프로젝트 모바일 본문은 14px, 제목은 15~26px, 보조 문구는 13px로 조정합니다. 스킬 메모 본문은 15px, 보조 문구는 13px로 표시합니다. 다른 앱은 기존 본문 16px 이상을 유지하며 주요 버튼은 44px 이상을 적용하고 안전 영역과 가상 키보드에 맞춰 높이를 조정합니다. Word의 리본·눈금자를 숨기고 문서를 세로 배치하며, 모바일 프로젝트 선택은 Chrome 탭 목록, 768~1023px 데스크톱에서는 드롭다운을 사용하며 트러블슈팅은 세로 구조로 표시합니다. 스킬은 노란 도구 버튼·흰 메모 본문·분야별 기술 목록·메모 검색으로 구성하고 홈 아이콘도 메모 모양으로 표시합니다. 내 PC·휴지통은 모바일 홈과 검색에서 제외하며 PC에서 열어 둔 두 창은 모바일 전환 시 최소화합니다. PC 탐색기는 유지합니다. GitHub 카드는 한 열로 표시하고 잔디만 가로 스크롤합니다. 비활성 앱은 숨김·inert 처리하며 모바일 창 축소 애니메이션은 생략합니다. 폭 768px 이상·높이 600px 이상에서는 다중 창 데스크톱을 제공하되, 폭 1024px 미만의 본문은 간결한 레이아웃을 유지합니다. 좁은 데스크톱은 장식 작업 표시줄 버튼·트레이를 숨기고 창 버튼을 44px로 표시합니다. 터치는 데스크톱에서도 한 번 탭으로 실행하며 마우스는 기존 더블클릭을 유지합니다. 폴더블 접기·펼치기와 분할 화면은 뷰포트 변화로 처리하고 모드 전환 시 드래그 위치를 초기화해 창이 화면 밖에 남지 않도록 합니다.

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

프로젝트 본문은 최소 13px, 보조 문구 14~17px, 본문 19px, 프로젝트 제목 28px, 페이지 제목 33px로 표시합니다. 기존 최소 글자 11px 대비 약 18% 확대하며 스크린샷 모달도 제목 19px·설명 17px를 사용합니다.

`ChromeLegacyModal` + `globals.css` 내 Chrome 탭·주소창 의사 스타일 —  
GitHub variant는 라이트 테마의 헤더·탭, 왼쪽 실제 프로필 사진·소개, 오른쪽 주요 프로젝트 카드·기여 그래프로 구성합니다. 비공개 저장소는 Private 표시와 접근 권한 안내를 제공하며, 잔디 새로고침 버튼으로 그래프를 갱신할 수 있습니다. 잔디 칸에 hover하거나 키보드 포커스를 두면 날짜와 기여 수를 어두운 툴팁으로 표시합니다. 방향키로 날짜를 이동하고 Escape로 툴팁을 닫습니다.

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
