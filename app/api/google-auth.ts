import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { env } from "./lib/env";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import { signSessionToken, verifySessionToken } from "./kimi/session";
import { findUserByUnionId, upsertUser } from "./queries/users";
import type { SessionPayload } from "./kimi/types";

// Google OAuth types
type GoogleTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
};

type GoogleUserProfile = {
  sub: string;
  name: string;
  email: string;
  picture: string;
  email_verified?: boolean;
};

/**
 * Build the Google OAuth authorization URL
 */
export function getGoogleOAuthUrl(origin?: string): string {
  const finalRedirectUri = origin
    ? `${origin}/api/oauth/google/callback`
    : `http://localhost:3000/api/oauth/google/callback`;

  const state = btoa(finalRedirectUri);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.googleClientId);
  url.searchParams.set("redirect_uri", finalRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return url.toString();
}

/**
 * Exchange authorization code for access token
 */
async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: redirectUri,
  });

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Google token exchange failed (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<GoogleTokenResponse>;
}

/**
 * Fetch user profile from Google using access token
 */
async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const resp = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    },
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch Google profile (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<GoogleUserProfile>;
}

/**
 * Create session token for Google user
 * Uses Google 'sub' as unionId with 'google_' prefix to avoid collisions
 */
async function createGoogleSession(googleUser: GoogleUserProfile): Promise<string> {
  const unionId = `google_${googleUser.sub}`;

  await upsertUser({
    unionId,
    name: googleUser.name,
    email: googleUser.email,
    avatar: googleUser.picture,
    provider: "google",
    lastSignInAt: new Date(),
  });

  const token = await signSessionToken({
    unionId,
    clientId: env.appId,
  });

  return token;
}

/**
 * Hono handler for Google OAuth callback
 */
export function createGoogleOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    const errorDescription = c.req.query("error_description");

    // Handle OAuth errors
    if (error) {
      if (error === "access_denied") {
        return c.redirect("/", 302);
      }
      return c.json(
        { error, error_description: errorDescription },
        400,
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return c.json({ error: "code and state are required" }, 400);
    }

    // Check if Google OAuth is configured
    if (!env.googleClientId || !env.googleClientSecret) {
      return c.json(
        { error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET." },
        500,
      );
    }

    try {
      const redirectUri = atob(state);

      // Exchange code for access token
      const tokenResp = await exchangeGoogleCode(code, redirectUri);

      // Get user profile from Google
      const userProfile = await getGoogleUserProfile(tokenResp.access_token);
      if (!userProfile) {
        throw new Error("Failed to fetch user profile from Google");
      }

      // Create session and set cookie
      const token = await createGoogleSession(userProfile);

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.redirect("/", 302);
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      return c.json(
        { error: "Google OAuth callback failed", details: (error as Error).message },
        500,
      );
    }
  };
}

/**
 * Authenticate a request using the session token (for Google users)
 * This is called by the context to populate ctx.user
 */
export async function authenticateGoogleUser(sessionPayload: SessionPayload) {
  const user = await findUserByUnionId(sessionPayload.unionId);
  return user ?? null;
}
