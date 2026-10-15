<!-- GitHub 이슈 제목 -->
# 이메일 형식 검증 유틸 추가

<!-- 아래부터 이슈 본문에 그대로 붙여넣기 -->
## 배경

지금은 이메일 형식이 틀려도 그대로 로그인 요청을 보냅니다.
화면에 연결하기 전에, 먼저 검증 로직만 독립된 함수로 만들어 테스트로 굳혀 두려고 합니다.

## 할 일

- `src/validation.ts` 새 파일에 `isValidEmail(value: string): boolean` 함수 추가
  - 앞뒤 공백은 무시하고 판단하되, 중간에 공백이 있으면 무효
  - `@` 앞뒤에 글자가 있고, 도메인에 `.`이 하나 이상 있어야 유효
- `src/validation.test.ts` 새 파일에 테스트 추가
  - 유효: `demo@example.com`, ` demo@example.com `(공백 포함), `a.b@sub.example.co.kr`
  - 무효: 빈 문자열, `demo`, `demo@`, `@example.com`, `demo@example`, `demo @example.com`

## 완료 조건

- 유닛 테스트와 타입 검사 통과
- **`src/LoginForm.ts`는 수정하지 않음** (화면 연결은 후속 이슈에서 진행)
- 외부 라이브러리를 추가하지 않음
