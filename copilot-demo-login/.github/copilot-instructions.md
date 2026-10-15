# copilot-instructions.md

- TypeScript strict 모드를 유지한다. `any` 사용 금지
- UI는 프레임워크 없이 순수 DOM API로 작성한다. React·jQuery 등 라이브러리 추가 금지
- API 호출은 `src/api/`의 클라이언트만 사용한다
- 테스트는 Vitest, 파일명은 `*.test.ts`. 동작을 바꾸면 테스트도 함께 추가한다
- 사용자에게 보이는 문구는 한국어, 존댓말("~해 주세요")로 쓴다
- 오류·상태 메시지는 스크린리더가 읽도록 `role="alert"` 또는 `aria-live`를 쓴다
- 한국어 주석 허용, 커밋 메시지는 영어
