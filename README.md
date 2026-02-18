# AI Platform Compare

Next.js(App Router) 기반 AI 공급자 비교/추천 서비스입니다.

## 개발 실행

```bash
npm run dev
```

## 프로덕션 빌드

```bash
npm run build
```

## 데이터 운영 가이드

### 공급자 데이터 수정 위치
- 파일: `app/data/providers.ts`
- 단일 소스 데이터 구조:
  - `id`, `name`, `website`, `category_tags`, `pricing`, `last_verified`
  - `capabilities`, `limits`, `integrations`, `best_for`

### Last verified 정책
- `last_verified`는 `YYYY-MM-DD` 형식으로 관리합니다.
- 정책:
  1. 요금/정책/연동 정보 수정 시 해당 공급자의 `last_verified`를 반드시 업데이트
  2. 값이 불명확하면 `unknown`/`null`로 두고 UI에 `—` + 툴팁(`Unknown / not verified`)로 노출
  3. 추정치 입력 금지, 공식 문서 링크(`pricing.api_pricing_link`) 우선 유지

### 홈 비교표 반영 규칙
- 홈 카드와 비교 테이블은 모두 `providers.ts`를 기준으로 렌더링됩니다.
- `/?compare=id1,id2,id3` 쿼리로 비교 상태를 공유할 수 있습니다.
