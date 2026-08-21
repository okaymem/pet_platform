import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { hashSessionToken } from "../lib/session.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
console.log("COOKIE HEADER:", req.headers.cookie ?? "NO COOKIE");
  const sessionToken = req.cookies.session;

console.log("SESSION COOKIE:", !!sessionToken);

if (!sessionToken) {
  console.log("❌ NO SESSION COOKIE");

  return res.status(401).json({
    error: "Unauthorized",
  });
}

const tokenHash = hashSessionToken(sessionToken);

const session = await prisma.session.findUnique({
  where: {
    tokenHash,
  },
});

console.log("SESSION FOUND:", !!session);

if (!session || session.expiresAt < new Date()) {
  return res.status(401).json({
    error: "Unauthorized",
  });
}

  req.user = {
    id: session.userId,
  };

  next();
}