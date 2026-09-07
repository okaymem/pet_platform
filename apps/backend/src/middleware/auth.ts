import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashSessionToken } from "../lib/session.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  let sessionToken: string | undefined;

  if (authorization?.startsWith("Bearer ")) {
    sessionToken = authorization.slice("Bearer ".length);
  }

  if (!sessionToken) {
    sessionToken = req.cookies.session;
  }

  if (!sessionToken) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const tokenHash = hashSessionToken(sessionToken);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  req.user = { id: session.userId };

  next();
}