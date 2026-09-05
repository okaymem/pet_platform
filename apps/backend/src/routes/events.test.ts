import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

import app from "../app.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../middleware/auth.js", () => ({
  authMiddleware: (
    req: { user?: { id: string } },
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      id: "test-user-id",
    };

    next();
  },
}));

describe("PATCH /pets/:petId/events/:eventId/complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
it("rejects event scheduled in the past", async () => {
  vi.spyOn(prisma.pet, "findFirst").mockResolvedValue({
    id: "pet-1",
  } as never);

  vi.spyOn(prisma.petEvent, "create");

  const response = await request(app)
    .post("/pets/pet-1/events")
    .send({
      type: "vaccination",
      title: "Past vaccination",
      scheduledAt: "2020-01-01T10:00:00.000Z",
      isRecurring: false,
    });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    error: "Event cannot be scheduled in the past",
  });

  expect(prisma.petEvent.create).not.toHaveBeenCalled();
});
  it("completes recurring event and creates next occurrence", async () => {
    vi.spyOn(prisma.pet, "findFirst").mockResolvedValue({
      id: "pet-1",
    } as never);

    vi.spyOn(prisma.petEvent, "findFirst").mockResolvedValue({
      id: "event-1",
      petId: "pet-1",
      type: "vaccination",
      title: "Rabies vaccine",
      scheduledAt: new Date("2026-09-10T10:00:00.000Z"),
      completedAt: null,
      isRecurring: true,
      interval: 1,
      intervalUnit: "year",
      notificationsEnabled: true,
      notes: "Annual vaccination",
      createdAt: new Date(),
    } as never);

    vi.spyOn(prisma.petEvent, "update").mockResolvedValue({
      id: "event-1",
      completedAt: new Date(),
    } as never);

    const createEventMock = vi
      .spyOn(prisma.petEvent, "create")
      .mockResolvedValue({
        id: "event-2",
        petId: "pet-1",
        type: "vaccination",
        title: "Rabies vaccine",
        scheduledAt: new Date("2027-09-10T10:00:00.000Z"),
        completedAt: null,
        isRecurring: true,
        interval: 1,
        intervalUnit: "year",
        notificationsEnabled: true,
        notes: "Annual vaccination",
        createdAt: new Date(),
      } as never);

    const response = await request(app).patch(
      "/pets/pet-1/events/event-1/complete",
    );

    expect(response.status).toBe(200);

    expect(prisma.petEvent.update).toHaveBeenCalledWith({
      where: {
        id: "event-1",
      },
      data: {
        completedAt: expect.any(Date),
      },
    });

    expect(createEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          petId: "pet-1",
          title: "Rabies vaccine",
          isRecurring: true,
          interval: 1,
          intervalUnit: "year",
        }),
      }),
    );
  });
});