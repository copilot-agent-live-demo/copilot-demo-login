# AGENTS.md

에이전트가 이 저장소에서 혼자 작업할 때 참고하는 매뉴얼입니다.

## 실행 방법

```bash
npm ci            # 의존성 설치
npm test          # Vitest 단위 테스트 (jsdom)
npm run typecheck # 타입 검사
npm run dev       # 로컬 실행: http://127.0.0.1:5173
```

## 폴더 구조

- `src/api/authClient.ts`: 인증 API 클라이언트 (데모용 가짜 구현, 수정 금지)
- `src/LoginForm.ts`: 로그인 폼 UI
- `src/LoginForm.test.ts`: 로그인 폼 테스트
- `src/style.css`: 스타일

## 데모 계정

| 이메일 | 비밀번호 | 결과 |
|---|---|---|
| demo@example.com | password123 | 성공 |
| demo@example.com | 그 외 | `INVALID_CREDENTIALS` |
| locked@example.com | 아무거나 | `ACCOUNT_LOCKED` |
| offline@example.com | 아무거나 | `NETWORK_ERROR` |

## 완료 기준 (Definition of Done)

- `npm test`와 `npm run typecheck`가 모두 통과한다
- 바뀐 동작마다 테스트가 있다
- `src/api/`는 수정하지 않는다
- PR 설명에 무엇을, 왜 바꿨는지와 확인 방법을 적는다
