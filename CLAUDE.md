# factory/portfolio

Windows 10 데스크톱 메타포 기반 개인 포트폴리오 + PDF 포트폴리오 제작 프로젝트.

## Project Overview

- `web/` — Next.js 15 기반 웹 포트폴리오 (Vercel 배포)
- `pdf/draft.html` — A4 3페이지 PDF 포트폴리오 본체
- `pdf/cover-letter.html` — 자기소개서 별도 파일 (A4 1장, 회사별 제출)
- `pdf/draft.md` — 자기소개서 원문 템플릿 (사용자 작성 + AI 자동완성)

## Commands

```bash
# 웹 개발 서버
cd web && npm run dev

# PDF 확인 (브라우저에서 직접 열기)
# pdf/draft.html
# pdf/cover-letter.html
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, SCSS
- **State**: Zustand, TanStack Query
- **Data**: web/data/portfolio.json (단일 소스)
- **Deploy**: Vercel

## PDF 포트폴리오 구조

| 파일 | 페이지 | 내용 |
|---|---|---|
| `draft.html` | 1페이지 | 사이드바(사진·이름·연락처) + Education · Experience · Skills |
| `draft.html` | 2페이지 | DS Helper (스택·트러블슈팅·스크린샷) |
| `draft.html` | 3페이지 | Portfolio (스택·트러블슈팅·스크린샷) |
| `cover-letter.html` | 별도 파일 | 자기소개서 (직접 작성 + AI 자동완성) — 회사마다 따로 제출 |

## 자기소개서 자동화

사용자가 아래처럼 말하면 자기소개서 AI 항목을 자동으로 작성한다:

> "회사에서 원하는 인재상은 [내용]이야."
> "인재상은 [내용]이야."

### 처리 순서

1. `pdf/draft.md` 를 읽는다
2. **[사용자 작성]** 항목(개발자가 된 이유 · 강점 · 성장 과정)을 참고 맥락으로 활용한다
3. 전달받은 인재상에 맞게 **지원 동기**와 **입사 후 포부**를 작성한다
   - 지나치게 추상적인 문장 금지 — 사용자의 실제 경험(Baro 서비스, DS Helper, 모노레포, React Native 확장 등)을 근거로 연결할 것
   - 회사 인재상 키워드를 자연스럽게 녹여낼 것
   - 분량: 각 항목 4~6문장
4. `pdf/draft.md` 의 **[AI 작성]** 섹션을 업데이트한다 (적용된 인재상 명시 포함)
5. `pdf/cover-letter.html` 의 해당 칸도 동시에 업데이트한다

### PDF 수동 반영

사용자가 "자기소개서 내용을 PDF에 반영해줘"라고 하면:
- `pdf/draft.md` 의 모든 항목을 읽어 `pdf/cover-letter.html` 을 업데이트한다

## 스킬 데이터 주의사항

`web/data/portfolio.json` 이 실제 배포본과 다를 수 있다.
스킬 항목을 수정할 때는 반드시 Playwright로 실제 웹을 확인할 것.
