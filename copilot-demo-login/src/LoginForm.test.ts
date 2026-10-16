import { createLoginForm } from "./LoginForm";
import { AuthError, type AuthErrorCode, type LoginFn } from "./api/authClient";

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

  describe("로그인 실패", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it.each<[AuthErrorCode, string]>([
      ["INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다."],
      ["ACCOUNT_LOCKED", "계정이 잠겼습니다. 관리자에게 문의해 주세요."],
      ["NETWORK_ERROR", "네트워크 연결을 확인한 뒤 다시 시도해 주세요."],
    ])("%s 오류 시 해당 메시지를 role=alert로 표시한다", async (code, message) => {
      const { root, form } = setup(async () => {
        throw new AuthError(code);
      });

      form.requestSubmit();
      await flush();

      const alert = root.querySelector<HTMLElement>('[role="alert"]')!;
      expect(alert.textContent).toBe(message);
      expect(root.querySelector<HTMLParagraphElement>(".welcome")!.hidden).toBe(true);
    });

    it("알 수 없는 오류 시 기본 메시지를 표시한다", async () => {
      const { root, form } = setup(async () => {
        throw new Error("boom");
      });

      form.requestSubmit();
      await flush();

      expect(root.querySelector('[role="alert"]')!.textContent).toBe(
        "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    });

    it("다시 로그인을 시도하면 이전 오류 메시지를 지운다", async () => {
      let attempt = 0;
      let resolve!: () => void;
      const { root, form } = setup(() => {
        attempt += 1;
        if (attempt === 1) return Promise.reject(new AuthError("INVALID_CREDENTIALS"));
        return new Promise((r) => (resolve = () => r({ displayName: "데모 사용자" })));
      });
      const alert = root.querySelector<HTMLElement>('[role="alert"]')!;

      form.requestSubmit();
      await flush();
      expect(alert.textContent).not.toBe("");

      form.requestSubmit();
      expect(alert.textContent).toBe("");

      resolve();
      await flush();
      expect(alert.textContent).toBe("");
      expect(root.querySelector<HTMLParagraphElement>(".welcome")!.hidden).toBe(false);
    });
  });
});
