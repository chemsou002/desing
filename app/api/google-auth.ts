import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as jose from "jose";
import { env } from "./lib/env";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import { users } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

const JWT_ALG = "HS256";

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  // Fetch Google's public keys
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  const { keys } = await response.json();

  // Try to verify with each key
  for (const key of keys) {
    try {
      const publicKey = await jose.importJWK(key, "RS256");
      const { payload } = await jose.jwtVerify(idToken, publicKey, {
        algorithms: ["RS256"],
        issuer: "https://accounts.google.com",
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return {
        sub: payload.sub as string,
        name: payload.name as string,
        email: payload.email as string,
        picture: payload.picture as string | undefined,
      };
    } catch {
      continue;
    }
  }
  throw new Error("Failed to verify Google token");
}

async function signSessionToken(payload: { userId: string; type: string }): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function findUserByGoogleId(googleId: string) {
  const rows = await getDb()
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);
  return rows.at(0);
}

export async function upsertGoogleUser(data: {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
}) {
  const existing = await findUserByGoogleId(data.googleId);
  if (existing) {
    await getDb()
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        lastSignInAt: new Date(),
      })
      .where(eq(users.googleId, data.googleId));
    return existing.id;
  } else {
    const result = await getDb()
      .insert(users)
      .values({
        googleId: data.googleId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        lastSignInAt: new Date(),
      });
    return Number(result[0].insertId);
  }
}

export function createGoogleOAuthHandler() {
  return async (c: Context) => {
    try {
      const { idToken } = await c.req.json();

      if (!idToken) {
        return c.json({ error: "idToken is required" }, 400);
      }

      const googleUser = await verifyGoogleToken(idToken);
      const userId = await upsertGoogleUser({
        googleId: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      });

      const token = await signSessionToken({
        userId: String(userId),
        type: "google",
      });

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.json({ success: true, user: { name: googleUser.name, email: googleUser.email } });
    } catch (error) {
      console.error("[Google OAuth] Error:", error);
      return c.json({ error: "Google authentication failed" }, 500);
    }
  };
}
