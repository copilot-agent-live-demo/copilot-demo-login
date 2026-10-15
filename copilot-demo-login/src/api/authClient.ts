// 데모용 가짜 인증 API. 실제 서버 없이 이메일 값으로 결과를 흉내 낸다.

export type AuthErrorCode = "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | "NETWORK_ERROR";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

export interface LoginResult {
  displayName: string;
}

export type LoginFn = (email: string, password: string) => Promise<LoginResult>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const login: LoginFn = async (email, password) => {
  await delay(400);

  if (email === "offline@example.com") throw new AuthError("NETWORK_ERROR");
  if (email === "locked@example.com") throw new AuthError("ACCOUNT_LOCKED");
  if (email !== "demo@example.com" || password !== "password123") {
    throw new AuthError("INVALID_CREDENTIALS");
  }

  return { displayName: "데모 사용자" };
};
