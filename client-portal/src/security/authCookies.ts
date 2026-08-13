import type { CookieSetOptions } from "universal-cookie";

const LOGIN_MAX_AGE_SECONDS = 2_629_746;

export const authCookieOptions = (persistent = true): CookieSetOptions => ({
  path: "/",
  secure: true,
  sameSite: "strict",
  ...(persistent ? { maxAge: LOGIN_MAX_AGE_SECONDS } : {}),
});

