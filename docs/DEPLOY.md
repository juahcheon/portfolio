# DEPLOY — 배포 (미정)

**배포 예정일·프로덕션 URL은 아직 정하지 않았습니다.**  
1차는 **로컬 구현·`npm run verify`** 를 우선하고, URL이 정해지면 이 문서와 README를 갱신합니다.

---

## URL (확정 시 기입)

| 항목 | 값 | 비고 |
|------|-----|------|
| **Web (Vercel)** | `_TBD_` | Next.js `web/` |
| **API** | `_TBD_` | Express `api/`, `GET /v1/portfolio` |
| **Web env** | `NEXT_PUBLIC_PORTFOLIO_API_URL=_TBD_` | `web/.env.local` / Vercel 환경 변수 |

URL을 알게 되면 AI·본인 모두 **이 표를 먼저 업데이트**한 뒤 README·ROADMAP P0 배포 체크를 진행합니다.

---

## 권장 topology (변경 없음)

```
사용자 → Vercel (web)
       → API 호스트 (portfolio.json)
```

자세한 구조: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 로컬 (현재 개발)

```powershell
cd api; npm run dev          # http://localhost:4000
cd web; npm run dev          # http://localhost:3003
# web/.env.local
# NEXT_PUBLIC_PORTFOLIO_API_URL=http://localhost:4000
```

---

## 배포 시 체크리스트 (나중에)

- [ ] API URL 확정 → `DEPLOY.md` · Vercel env 반영
- [ ] CORS 필요 시 API origin 제한 검토
- [ ] `web/public/img/webp` 등 에셋 포함 여부
- [ ] `npm run verify` 통과
- [ ] Git tag `v1.x.x` + [CHANGELOG.md](./CHANGELOG.md)

---

## 관련 문서

- [ROADMAP.md](./ROADMAP.md) — P0 배포 항목
- [HISTORY.md](./HISTORY.md) — 릴리스 절차
