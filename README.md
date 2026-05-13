# Portfolio — Windows desktop UI

Vercel에 `web`을, API는 별도(Vercel Serverless / Railway 등)로 두는 구성을 권장합니다.

## 구조

| 경로 | 설명 |
|------|------|
| `api/` | `GET /v1/portfolio` — 포트폴리오 JSON |
| `web/` | Next.js 15 App Router, Tailwind, TanStack Query, Zustand |

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

복사 항목: `img/webp/*`, `task-remove.png`, `task02-remove.png`, `folder_lnb.png`, `protect-remove.png`, `chrome_logo.svg`, `wifi.svg`, `Netflix_2015_logo.svg`

### 바탕화면 아이콘이 안 보일 때

`web/public/img/webp/` 등에 **webp·PNG가 없으면** 브라우저가 이미지를 못 불러옵니다. 위 `npm run sync:legacy`로 `juahcheon.github.io/img` 전체를 복사한 뒤 새로고침하세요. 복사 전에는 레이블 첫 글자가 들어간 **임시 타일**이 보이도록 되어 있습니다.

Windows에서만 대소문자가 다른 파일명(예: `word.WebP`)을 쓰는 경우, 배포(Linux)에서 404가 날 수 있어 JSON은 `/img/webp/word.webp`처럼 **소문자 확장자**를 기준으로 맞춰 두었습니다. 로컬 파일명이 다르면 `webp` 폴더 안 이름을 `.webp`로 맞추거나 동기화 스크립트로 정리하세요.

## 로컬 실행

```powershell
cd D:\factory\portfolio\api
npm install
npm run dev
```

다른 터미널:

```powershell
cd D:\factory\portfolio\web
npm install
copy .env.local.example .env.local
npm run dev
```

웹 `.env.local`의 `NEXT_PUBLIC_PORTFOLIO_API_URL`을 API 주소에 맞춥니다.

## 검증

`api`·`web` 각각 `npm install` 후 루트에서:

```powershell
cd D:\factory\portfolio
npm run verify
```

## 데스크톱 아이콘

- 뚜레쥬르·탐앤탐스·KINNI 제거
- **escapeFinal** → `https://escapefinal.netlify.app/` (새 탭)
- 나머지는 윈도우 스타일 창으로 섹션 표시 (데이터는 API)
