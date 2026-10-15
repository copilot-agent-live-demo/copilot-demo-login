import { createLoginForm } from "./LoginForm";
import type { LoginFn } from "./api/authClient";

function setup(login: LoginFn) {
  const root = document.createElement("div");
  document.body.replaceChildren(root);
  createLoginForm(root, login);

  const form = root.querySelector("form")!;
  form.querySelector<HTMLInputElement>('input[name="email"]')!.value = "demo@example.com";
  form.querySelector<HTMLInputElement>('input[name="password"]')!.value = "password123";
  return { root, form };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("LoginForm", () => {
  it("로그인 성공 시 환영 메시지를 표시한다", async () => {
    const { root, form } = setup(async () => ({ displayName: "데모 사용자" }));

    form.requestSubmit();
    await flush();

    const welcome = root.querySelector<HTMLParagraphElement>(".welcome")!;
    expect(welcome.hidden).toBe(false);
    expect(welcome.textContent).toBe("데모 사용자님, 환영합니다!");
  });

  it("요청 중에는 버튼을 비활성화한다", async () => {
    let resolve!: () => void;
    const { root, form } = setup(
      () => new Promise((r) => (resolve = () => r({ displayName: "데모 사용자" }))),
    );

    form.requestSubmit();
    expect(root.querySelector("button")!.disabled).toBe(true);

    resolve();
    await flush();
    expect(root.querySelector("button")!.disabled).toBe(false);
  });

  it("비밀번호 표시 버튼으로 비밀번호를 보이거나 숨긴다", () => {
    const { root } = setup(async () => ({ displayName: "데모 사용자" }));
    const password = root.querySelector<HTMLInputElement>('input[name="password"]')!;
    const toggle = root.querySelector<HTMLButtonElement>(".password-toggle")!;

    expect(password.type).toBe("password");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");

    toggle.click();
    expect(password.type).toBe("text");
    expect(toggle.textContent).toBe("비밀번호 숨기기");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");

    toggle.click();
    expect(password.type).toBe("password");
    expect(toggle.textContent).toBe("비밀번호 표시");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
  });
});
