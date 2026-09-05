import { prisma } from "../lib/prisma";
import { sendTelegramMessage } from "../lib/tgMessages";

export async function processDueEvents() {
  const now = new Date();

  const events = await prisma.petEvent.findMany({
    where: {
      scheduledAt: {
        lte: now,
      },
      notificationsEnabled: true,
      notifiedAt: null,
    },
    include: {
      pet: {
        include: {
          owner: true,
        },
      },
    },
  });

  for (const event of events) {
    const telegramId = event.pet.owner.telegramId;

    if (!telegramId) {
      continue;
    }

    const message = [
      "🐾 Напоминание",
      "",
      `Питомец: ${event.pet.name}`,
      `Тип события: ${event.type}`,
      `Событие: ${event.title}`,
      `Время: ${event.scheduledAt.toLocaleString()}`,
    ].join("\n");

    try {
      await sendTelegramMessage(
        telegramId,
        message,
      );

      await prisma.petEvent.update({
        where: {
          id: event.id,
        },
        data: {
          notifiedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(
        `Failed to notify about event ${event.id}:`,
        error,
      );
    }
  }
}