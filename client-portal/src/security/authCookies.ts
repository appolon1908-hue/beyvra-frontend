import type { CookieSetOptions } from "universal-cookie";

// 7 days for trading app - reduced from 30 days for enhanced security
const LOGIN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 604,800 seconds

export const authCookieOptions = (persistent = true): CookieSetOptions => ({
  path: "/",
  secure: true,
  sameSite: "strict",
  // Note: httpOnly should be enforced on backend for access_token
  // Frontend can only set secure and sameSite
  ...(persistent ? { maxAge: LOGIN_MAX_AGE_SECONDS } : {}),
});

