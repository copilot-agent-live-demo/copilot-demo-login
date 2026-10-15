# Copilot Live Demo: 이슈 하나가 PR이 되기까지

발표 "GitHub Copilot: 에이전트 시대, 제대로 활용하기"가 끝난 뒤 진행하는 시연용 저장소입니다.
로그인에 실패해도 오류 메시지가 보이지 않는 버그(15번 슬라이드의 이슈 예시)를 포함해 **이슈 3개를 클라우드 에이전트들에게 동시에 맡기고**, 그 결과를 사람이 검토합니다.

이 문서는 **조직 `copilot-agent-live-demo`의 저장소에서, 발표자의 개인 Copilot 라이선스(Pro 이상)로** 시연하는 것을 기준으로 합니다. 조직에는 Copilot Business를 구매하지 않습니다.

- 저장소: `https://github.com/copilot-agent-live-demo/copilot-demo-login`
- Copilot 사용량 청구: 발표자 개인 계정
- GitHub Actions 사용 시간: 조직 (공개 저장소라 무료)

## 0. 필요한 것

| 항목 | 조건 |
|---|---|
| Copilot 요금제 | **Pro, Pro+, Max 또는 Student.** 클라우드 에이전트가 포함된 요금제여야 합니다 (Free는 포함 여부를 확인하지 못했으니 Pro 이상 권장) |
| AI 크레딧 | 리허설 2~3번 + 본 시연 분량. Pro 기준 월 $15 상당이 포함돼 있고, 부족하면 추가 구매 가능 |
| 조직 권한 | 발표자 계정이 조직 `copilot-agent-live-demo`의 **Owner**여야 합니다 (조직을 만든 계정이면 자동으로 Owner) |
| 저장소 공개 범위 | **공개(Public) 권장.** 클라우드 에이전트와 코드 리뷰는 GitHub Actions에서 실행되는데, 공개 저장소는 Actions 사용 시간이 무료입니다 |
| 로컬 환경 | Node.js 22 이상, VS Code + GitHub Copilot 확장 |

> **회사 라이선스를 쓰는 계정이라면:** 개인 계정에 회사 Copilot Business/Enterprise 라이선스가 붙어 있으면 회사 정책 때문에 다른 조직의 저장소에서 기능이 막혀 있을 수 있습니다.

## 1. 사전 준비 (발표 전날까지)

### 1-1. 저장소 만들기

1. 조직 페이지(`github.com/copilot-agent-live-demo`) → **Repositories → New repository**
   - Owner: `copilot-agent-live-demo` (개인 계정이 아니라 **조직**이 선택돼 있는지 확인)
   - 이름: `copilot-demo-login`
   - 공개 범위: **Public**
   - README, .gitignore, 라이선스 추가는 모두 체크 해제 (이 폴더에 이미 있음)
2. 이 폴더를 push합니다. `node_modules/`는 `.gitignore`에 들어 있어 올라가지 않습니다.
   ```bash
   git init -b main
   git add .
   git commit -m "Initial demo app"
   git remote add origin https://github.com/copilot-agent-live-demo/copilot-demo-login.git
   git push -u origin main
   ```

### 1-2. 설정 확인

3. **조직** Settings → **Actions → General**에서 Actions가 허용돼 있는지 확인합니다. 새 조직은 기본으로 허용돼 있습니다.
4. **개인** Copilot 설정(**Settings → Copilot**, `github.com/settings/copilot`)에서 클라우드 에이전트와 코드 리뷰 관련 기능이 켜져 있는지 확인합니다. 조직에 Copilot을 구매하지 않았으므로 조직의 Copilot 정책 메뉴는 없거나 비어 있어도 정상입니다.
5. 저장소의 **Actions** 탭에서 `Copilot Setup Steps` 워크플로를 한 번 수동 실행(Run workflow)해 성공하는지 확인합니다.
6. (선택) 저장소 **Settings**에서 Copilot 코드 리뷰 자동 실행을 켜 둡니다.

### 1-3. 가장 먼저 확인할 것: Copilot이 할당되는가

7. 테스트용 이슈를 하나 만들고 오른쪽 **Assignees**에 **Copilot**이 보이는지 확인합니다.
   - **보이면:** 개인 라이선스로 조직 저장소에서 시연할 수 있습니다. 다음 단계로 진행합니다.
   - **안 보이면:** 개인 라이선스가 이 조직 저장소에 적용되지 않는 상태입니다. 아래 중 하나를 고릅니다.
     - **(쉬움)** 저장소를 개인 계정으로 옮겨서 시연: 저장소 Settings → Danger Zone → **Transfer ownership** → 내 계정
     - **(확실)** 조직에 Copilot Business를 구매하고 본인 좌석 1개 할당 (월 $19, 시연 후 해제 가능)

### 1-4. 리허설과 백업

8. **리허설을 2~3번 합니다.** 아래 이슈 3개를 만들어 모두 Copilot에게 할당하고, 이슈별로 걸린 시간과 결과, 사용한 크레딧을 기록합니다.
   - PR 3개가 모두 나온 뒤 **순서대로 머지해도 충돌이 없는지** 확인합니다. 이슈마다 바뀌는 파일을 나눠 두었지만, 에이전트가 범위를 벗어나 다른 파일을 고치면 충돌이 날 수 있습니다.
   - 리허설에서 확인한 뒤에는 머지하지 말고 닫거나 백업으로 남깁니다 (`main`은 버그가 있는 상태 유지).
9. **백업을 남깁니다.**
   - 이슈별로 가장 잘 나온 리허설 PR 3개는 머지하지 말고 열어 둡니다. 시연 때 에이전트가 늦어지면 이 PR로 넘어갑니다.
   - 리허설 전 과정을 화면 녹화해 둡니다. 네트워크 장애에 대비한 것입니다.
   - 리허설 PR을 열어 둔 채로 시연하면 같은 버그를 고치는 PR이 두 개가 됩니다. 시연용 이슈는 새로 만들고, 백업 PR은 제목 앞에 `[백업]`을 붙여 구분합니다.

## 2. 시연 당일 체크리스트

- [ ] 개인 계정으로 GitHub 로그인, Copilot 요금제와 남은 AI 크레딧 확인
- [ ] 발표장 네트워크에서 github.com 접속 확인 (회사 프록시나 방화벽 때문에 개인 계정 로그인이 막히지 않는지 확인)
- [ ] **시연 전용 브라우저 프로필** 사용: 다른 저장소 목록, 알림, 이메일 주소 같은 개인 정보가 화면에 나오지 않게
- [ ] 브라우저 탭: ① 조직 저장소 Issues ② 백업 PR ③ **개인 계정**의 사용량 페이지 (**Settings → Billing and licensing**). 조직 결제 화면에는 Copilot 사용량이 나오지 않습니다
- [ ] VS Code가 회사 계정이 아니라 **개인 계정**으로 Copilot에 로그인돼 있는지 확인 (왼쪽 아래 계정 아이콘)
- [ ] VS Code에서 이 폴더를 열고 Copilot Chat 로그인 확인, `npm install`과 `npm run dev` 실행 확인
- [ ] 글꼴 크게 (VS Code 확대 150% 이상, 브라우저 125% 이상)
- [ ] 메신저·메일 알림 끄기
- [ ] `docs/demo-issue.md`, `demo-issue-2.md`, `demo-issue-3.md` 내용을 복사할 수 있게 열어 두기 (또는 이슈 3개를 **본문까지 써서 미리 만들어 두고 할당만 시연**하면 ② 단계가 빨라집니다)

## 3. 시연 진행 (약 10분)

| 단계 | 화면 | 할 일 | 시간 |
|---|---|---|---|
| ① 버그 확인 | 브라우저 `127.0.0.1:5173` | `demo@example.com` / 아무 비밀번호로 로그인. 아무 반응이 없음을 보여줌 | 1분 |
| ② 이슈 위임 | GitHub Issues → 에이전트 화면 | 이슈 3개를 차례로 Copilot에게 할당한 뒤, **에이전트 세션 목록에서 3개가 동시에 돌아가는 모습**을 보여줌 | 2분 |
| ③ 에이전트가 일하는 동안 | VS Code | `.github/copilot-instructions.md`와 `AGENTS.md`를 보여주고, `docs/demo-agent-mode-prompt.md`의 프롬프트로 Agent Mode 시연 | 3분 |
| ④ PR 검토 | GitHub PR | **#1(에러 메시지) PR만 자세히**: 세션 로그, 변경 파일, CI 결과를 보고 4가지 질문으로 검토. #2·#3은 결과만 짧게 (아래 참고) | 3분 |
| ⑤ 비용 확인 | Settings → Billing and licensing | 이번 작업에 든 크레딧 확인. 사용량 반영이 늦을 수 있으니 리허설 때 캡처해 둔 화면도 준비 | 1분 |

④에서 PR이 아직 안 나왔으면 진행 중인 세션 로그를 잠깐 보여준 뒤 "리허설 때 같은 이슈로 만든 결과입니다" 하고 백업 PR로 넘어갑니다.

### 동시에 맡기는 이슈 3개

| 이슈 | 본문 | 바뀌는 파일 | 건드리지 않는 파일 | ④에서 보여줄 것 |
|---|---|---|---|---|
| #1 로그인 실패 시 에러 메시지 | `docs/demo-issue.md` | `LoginForm.ts`, `LoginForm.test.ts`, `style.css` | `src/api/` | 4가지 질문으로 자세히 검토 |
| #2 이메일 형식 검증 유틸 | `docs/demo-issue-2.md` | 새 파일 `validation.ts`, `validation.test.ts` | `LoginForm.ts` | 추가된 테스트 목록과 CI 통과 |
| #3 다크 모드 | `docs/demo-issue-3.md` | 새 파일 `dark.css`, `index.html` | `style.css` | PR 브랜치를 받아 다크 모드 화면 보여주기 (또는 리허설 때 캡처) |

이슈마다 바뀌는 파일이 겹치지 않아서 PR 3개를 어떤 순서로 머지해도 충돌이 나지 않도록 설계했습니다. 에이전트가 "건드리지 않는 파일"을 고쳤다면, 그 자체가 "맥락에 맞는가?" 검토에서 짚을 좋은 사례입니다.

### PR 검토 포인트 (16번 슬라이드의 4가지 질문)

- **이해했는가?** 바뀐 코드를 내가 설명할 수 있는가. 모르는 부분은 PR에서 Copilot에게 질문
- **검증했는가?** CI(타입 검사·테스트) 통과, 실패 유형별 테스트 추가 여부
- **안전한가?** 오류 메시지에 서버 원문이나 내부 정보를 그대로 노출하지 않는가. `innerHTML`에 사용자 입력을 넣지 않는가
- **맥락에 맞는가?** `src/api/`를 건드리지 않았는가, 문구가 존댓말인가, `role="alert"`를 썼는가

## 4. 데모 계정

| 이메일 | 비밀번호 | 결과 |
|---|---|---|
| demo@example.com | password123 | 성공 |
| demo@example.com | 그 외 | 이메일·비밀번호 오류 |
| locked@example.com | 아무거나 | 계정 잠김 |
| offline@example.com | 아무거나 | 네트워크 오류 |

## 5. 시연 후 정리

- 시연에서 만든 PR은 닫거나 머지합니다. 다음 시연을 위해 `main`은 버그가 있는 상태로 유지하는 것이 좋습니다.
- Agent Mode로 바꾼 로컬 변경은 버립니다 (`git restore .`).
- 시연이 끝나 더 쓸 일이 없으면 저장소를 Archive하거나 비공개로 바꿔 둡니다.
