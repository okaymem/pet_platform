export type Pet = {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthDate: string | null;
  weight: number | null;
  photoUrl: string | null;
  photoType: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getPets(): Promise<Pet[]> {
  const response = await fetch("/api/pets", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load pets");
  }

  const pets: Pet[] = await response.json();

  return pets;
}

export async function createPet(data: {
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  birthDate?: string;
  weight?: number;
  description?: string;
}): Promise<Pet> {
  const response = await fetch("/api/pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create pet");
  }

  return response.json();
}


export async function uploadPetPhoto(
  petId: string,
  photo: File,
): Promise<void> {
  const formData = new FormData();

  formData.append("photo", photo);

  const response = await fetch(`/api/pets/${petId}/photo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload pet photo");
  }
}

export async function updatePet(
  petId: string,
  data: {
    name?: string;
    species?: string;
    breed?: string;
    sex?: string;
    birthDate?: string;
    weight?: number;
    description?: string;
  },
): Promise<Pet> {
  const response = await fetch(`/api/pets/${petId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Failed to update pet (${response.status})`,
    );
  }

  return response.json();
}