import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { validateTelegramInitData } from "../lib/telegram.js";
import {
  createSessionToken,
  hashSessionToken,
} from "../lib/session.js";
import {authMiddleware} from "../middleware/auth.js"
const router = Router();

router.post("/telegram", async (req, res) => {
  const { initData } = req.body;

  if (typeof initData !== "string") {
    return res.status(400).json({
      error: "initData is required",
    });
  }

  const telegramUser = validateTelegramInitData(initData);
  if (!telegramUser?.id) {
    return res.status(401).json({
      error: "Invalid Telegram initData",
    });
  }

  const user = await prisma.user.upsert({
  where: {
    telegramId: telegramUser.id.toString(),
  },
  update: {
    username: telegramUser.username ?? null,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name ?? null,
  },
  create: {
    telegramId: telegramUser.id.toString(),
    username: telegramUser.username ?? null,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name ?? null,
  },
});

  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);

  await prisma.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return res.status(200).json({
  message: "Authenticated",
  token: sessionToken,
});
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id,
    },
  });

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.json({
    user,
  });
});

export default router;