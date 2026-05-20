# DEPLOY — Vercel (web 단일)

프로덕션은 **Vercel에 `web/`만** 배포합니다.  
포트폴리오 JSON은 Next **Route Handler** `GET /api/v1/portfolio`로 제공합니다 (`web/data/portfolio.json`).

별도 Express API 호스팅은 **하지 않습니다**.

---

## URL (확정 시 기입)

| 항목 | 값 | 비고 |
|------|-----|------|
| **Web (Vercel)** | `_TBD_` | Root Directory: **`web`** |
| **데이터 API** | `https://(your-domain)/api/v1/portfolio` | 같은 Vercel 프로젝트 |
| **환경 변수** | (보통 **불필요**) | 기본은 same-origin `/api/v1/portfolio` |

---

## Vercel 설정

1. GitHub repo 연결
2. **Root Directory**: `web`
3. Framework: Next.js (자동)
4. Build Command: `npm run build` (기본 — `prebuild`에서 `sync:content` 시도, `api/` 없으면 스킵)
5. Output: Next 기본
6. **Environment Variables**: 기본 없음. 레거시 Express로만 테스트할 때 `NEXT_PUBLIC_PORTFOLIO_API_URL`

배포 후 브라우저에서 `https://(your-domain)/api/v1/portfolio` 가 JSON이면 성공.

---

## 콘텐츠 수정 → 재배포

| 수정 위치 | 배포 |
|-----------|------|
| **`web/data/portfolio.json`** (권장·Vercel에 포함) | Git push → Vercel 자동 빌드 |
| `api/data/portfolio.json` (레거시) | 로컬에서 `cd web; npm run sync:content` 후 **web/data 커밋** |

Vercel Root가 `web`이면 빌드 시 **`api/` 폴더는 번들에 없음** — 반드시 `web/data/portfolio.json`을 repo에 포함하세요.

---

## 로컬 (개발)

```powershell
cd D:\factory\portfolio\web
npm install
npm run dev
```

- http://localhost:3003
- 데이터: http://localhost:3003/api/v1/portfolio
- **`api/` Express는 필수 아님** (레거시로만 `cd api; npm run dev` + env override 가능)

`api/data`만 수정했다면:

```powershell
cd web
npm run sync:content
```

---

## 배포 체크리스트

- [ ] `web/data/portfolio.json` 최신·커밋됨
- [ ] Vercel Root = `web`
- [ ] `npm run verify` 통과
- [ ] 프로덕션 `/api/v1/portfolio` JSON 확인
- [ ] `DEPLOY.md` URL 표 갱신
- [ ] Git tag + [CHANGELOG.md](./CHANGELOG.md) (릴리스 시)

---

## 관련 문서

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTENT.md](./CONTENT.md)
- [ROADMAP.md](./ROADMAP.md)
