import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  createPetSchema,
  updatePetSchema,
} from "../schemas/pet.schema.js";
import { getNextScheduledAt } from "../services/reccurringEvents";
const router = Router();

router.get("/:petId/events", authMiddleware, async (req, res) => {
  const { petId } = req.params;

  if (typeof petId !== "string") {
    return res.status(400).json({
      error: "Invalid pet id",
    });
  }

  const pet = await prisma.pet.findFirst({
    where: {
      id: petId,
      ownerId: req.user!.id,
    },
    select: {
      id: true,
    },
  });

  if (!pet) {
    return res.status(404).json({
      error: "Pet not found",
    });
  }

  const events = await prisma.petEvent.findMany({
    where: {
      petId,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });
  return res.json(events);
});

router.post(
  "/:petId/events",
  authMiddleware,
  async (req, res) => {
    const { petId } = req.params;

    if (typeof petId !== "string") {
      return res.status(400).json({
        error: "Invalid pet id",
      });
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: req.user!.id,
      },
      select: {
        id: true,
      },
    });

    if (!pet) {
      return res.status(404).json({
        error: "Pet not found",
      });
    }

    const {
      type,
      title,
      scheduledAt,
      isRecurring,
      interval,
      intervalUnit,
      notificationsEnabled,
      notes,
    } = req.body;

    if (!type || !title || !scheduledAt) {
      return res.status(400).json({
        error:
          "type, title and scheduledAt are required",
      });
    }
    const scheduledDate = new Date(scheduledAt);

if (Number.isNaN(scheduledDate.getTime())) {
  return res.status(400).json({
    error: "Invalid scheduledAt",
  });
}

if (scheduledDate <= new Date()) {
  return res.status(400).json({
    error: "Event cannot be scheduled in the past",
  });
}

    if (isRecurring) {
      if (!interval || interval < 1) {
        return res.status(400).json({
          error:
            "Recurring event interval must be at least 1",
        });
      }

      if (
        !["day", "week", "month", "year"].includes(
          intervalUnit,
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid recurring event interval unit",
        });
      }
    }

    const event = await prisma.petEvent.create({
  data: {
    petId,
    type,
    title,
    scheduledAt: scheduledDate,

    isRecurring: Boolean(isRecurring),
    interval: isRecurring
      ? interval ?? null
      : null,
    intervalUnit: isRecurring
      ? intervalUnit ?? null
      : null,

    notificationsEnabled:
      notificationsEnabled !== false,

    notes: notes || null,
  },
});

    return res.status(201).json(event);
  },
);

router.patch(
  "/:petId/events/:eventId/complete",
  authMiddleware,
  async (req, res) => {
    const { petId, eventId } = req.params;

    if (
      typeof petId !== "string" ||
      typeof eventId !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid pet or event id",
      });
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: req.user!.id,
      },
      select: {
        id: true,
      },
    });

    if (!pet) {
      return res.status(404).json({
        error: "Pet not found",
      });
    }

    const event = await prisma.petEvent.findFirst({
      where: {
        id: eventId,
        petId,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    if (event.completedAt) {
      return res.status(400).json({
        error: "Event is already completed",
      });
    }

    const completedEvent =
      await prisma.petEvent.update({
        where: {
          id: event.id,
        },
        data: {
          completedAt: new Date(),
        },
      });

    if (
      event.isRecurring &&
      event.interval &&
      event.intervalUnit
    ) {
      const nextScheduledAt = getNextScheduledAt(event.scheduledAt, event.interval, event.intervalUnit)

      await prisma.petEvent.create({
        data: {
          petId: event.petId,
          type: event.type,
          title: event.title,
          scheduledAt: nextScheduledAt,

          isRecurring: true,
          interval: event.interval,
          intervalUnit: event.intervalUnit,

          notificationsEnabled:
            event.notificationsEnabled,

          notes: event.notes,
        },
      });
    }

    return res.json(completedEvent);
  },
);

router.delete(
  "/:petId/events/:eventId",
  authMiddleware,
  async (req, res) => {
    const { petId, eventId } = req.params;

    if (
      typeof petId !== "string" ||
      typeof eventId !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid pet or event id",
      });
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: req.user!.id,
      },
      select: {
        id: true,
      },
    });

    if (!pet) {
      return res.status(404).json({
        error: "Pet not found",
      });
    }

    const event = await prisma.petEvent.findFirst({
      where: {
        id: eventId,
        petId,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    await prisma.petEvent.delete({
      where: {
        id: event.id,
      },
    });

    return res.status(204).send();
  },
);
export default router;