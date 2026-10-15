import type { LoginFn } from "./api/authClient";

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
        <span class="password-field">
          <input name="password" type="password" autocomplete="current-password" required />
          <button class="password-toggle" type="button" aria-pressed="false">비밀번호 표시</button>
        </span>
      </label>
      <button type="submit">로그인</button>
      <p class="welcome" hidden></p>
    </form>
  `;

  const form = root.querySelector<HTMLFormElement>("form")!;
  const button = form.querySelector<HTMLButtonElement>("button")!;
  const welcome = form.querySelector<HTMLParagraphElement>(".welcome")!;
  const password = form.querySelector<HTMLInputElement>('input[name="password"]')!;
  const passwordToggle = form.querySelector<HTMLButtonElement>(".password-toggle")!;

  passwordToggle.addEventListener("click", () => {
    const isVisible = password.type === "text";
    password.type = isVisible ? "password" : "text";
    passwordToggle.textContent = isVisible ? "비밀번호 표시" : "비밀번호 숨기기";
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    button.disabled = true;
    try {
      const result = await login(email, password);
      welcome.textContent = `${result.displayName}님, 환영합니다!`;
      welcome.hidden = false;
    } catch (error) {
      // TODO: 사용자에게 오류를 보여주지 않는다 (데모 이슈 #1)
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
}
