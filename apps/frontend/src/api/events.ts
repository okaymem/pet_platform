export type PetEvent = {
  id: string;
  petId: string;
  type: string;
  title: string;
  scheduledAt: string;

  completedAt: string | null;

  isRecurring: boolean;
  interval: number | null;
  intervalUnit: string | null;

  notificationsEnabled: boolean;

  notes: string | null;
  createdAt: string;
};

export async function getPetEvents(
  petId: string,
): Promise<PetEvent[]> {
  const response = await fetch(
    `/api/pets/${petId}/events`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pet events");
  }

  return response.json();
}

export async function createPetEvent(
  petId: string,
  data: {
    type: string;
    title: string;
    scheduledAt: string;

    isRecurring?: boolean;
    interval?: number;
    intervalUnit?: string;

    notificationsEnabled?: boolean;

    notes?: string;
  },
): Promise<PetEvent> {
  const response = await fetch(
    `/api/pets/${petId}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create pet event");
  }

  return response.json();
}

export async function completePetEvent(
  petId: string,
  eventId: string,
): Promise<PetEvent> {
  const response = await fetch(
    `/api/pets/${petId}/events/${eventId}/complete`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to complete pet event",
    );
  }

  return response.json();
}

export async function deletePetEvent(
  petId: string,
  eventId: string,
): Promise<void> {
  const response = await fetch(
    `/api/pets/${petId}/events/${eventId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete pet event");
  }
}