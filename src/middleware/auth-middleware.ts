import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from "../types/express";

function getAccessTokenCandidates(req: Request) {
  const tokens = new Set<string>();

  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;

  if (bearerToken) tokens.add(bearerToken);
  if (req.cookies.accessToken) tokens.add(req.cookies.accessToken);

  const rawCookie = req.headers.cookie;
  if (rawCookie) {
    rawCookie.split(";").forEach((cookie) => {
      const [rawName, ...rawValue] = cookie.trim().split("=");
      if (rawName === "accessToken" && rawValue.length > 0) {
        tokens.add(decodeURIComponent(rawValue.join("=")));
      }
    });
  }

  return Array.from(tokens);
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const accessTokens = getAccessTokenCandidates(req);

  if (accessTokens.length === 0) {
    res.status(401).json({ success: false, error: "Unauthorized: Token not found" });
    return;
  }

  for (const accessToken of accessTokens) {
    try {
      const payload = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as CustomJwtPayload;

      if (payload) {
        req.user = payload;
        next();
        return;
      }
    } catch {
      // Try the next candidate. Browsers can send duplicate cookies from
      // different domains, and one stale token should not block a valid one.
    }
  }

  console.warn("[auth] token verification failed", {
    tokenCandidates: accessTokens.length,
    hasAuthorization: Boolean(req.headers.authorization),
    hasCookieHeader: Boolean(req.headers.cookie),
  });
  res.status(403).json({ success: false, error: "Invalid token" });
}

export function roleGuard(...roles: string[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (roles.includes(user?.role)) {
      next();
      return;
    }

    res.status(403).json({ success: false, error: "Unauthorized access" });
  };
};
