import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    // Windows에서 localhost가 IPv6(::1)로만 열려 접속이 안 되는 문제를 피하려고 IPv4로 고정
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
