import { AuthError, type AuthErrorCode, type LoginFn } from "./api/authClient";

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
  ACCOUNT_LOCKED: "계정이 잠겼습니다. 관리자에게 문의해 주세요.",
  NETWORK_ERROR: "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
};

const UNKNOWN_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AuthError && Object.hasOwn(ERROR_MESSAGES, error.code)) {
    return ERROR_MESSAGES[error.code];
  }
  return UNKNOWN_ERROR_MESSAGE;
}

export function createLoginForm(root: HTMLElement, login: LoginFn): void {
  root.innerHTML = `
    <form class="login-form" novalidate>
      <h1>로그인</h1>
      <label>
        이메일
        <input name="email" type="email" autocomplete="username" required />
      </label>
      <label>
        비밀번호
        <input name="password" type="password" autocomplete="current-password" required />
      </label>
      <button type="submit">로그인</button>
      <p class="error" role="alert" hidden></p>
      <p class="welcome" hidden></p>
    </form>
  `;

  const form = root.querySelector<HTMLFormElement>("form")!;
  const button = form.querySelector<HTMLButtonElement>("button")!;
  const welcome = form.querySelector<HTMLParagraphElement>(".welcome")!;
  const errorMessage = form.querySelector<HTMLParagraphElement>(".error")!;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    // 다시 시도하면 이전 결과 메시지를 지운다
    errorMessage.textContent = "";
    errorMessage.hidden = true;
    welcome.textContent = "";
    welcome.hidden = true;

    button.disabled = true;
    try {
      const result = await login(email, password);
      welcome.textContent = `${result.displayName}님, 환영합니다!`;
      welcome.hidden = false;
    } catch (error) {
      console.error(error);
      errorMessage.textContent = getErrorMessage(error);
      errorMessage.hidden = false;
    } finally {
      button.disabled = false;
    }
  });
}
