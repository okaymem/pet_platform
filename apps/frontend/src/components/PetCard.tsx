import { useEffect, useState } from "react";
import type { Pet } from "../api/pets";
import { apiFetch } from "../api/client";

type PetCardProps = {
  pet: Pet;
  onPetClick: (pet: Pet) => void;
};

function PetCard({ pet, onPetClick }: PetCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pet.photoType) {
      setPhotoUrl(null);
      return;
    }

    let objectUrl: string | null = null;

    async function loadPhoto() {
      const response = await apiFetch(
        `/api/pets/${pet.id}/photo`,
      );

      if (!response.ok) {
        return;
      }

      const blob = await response.blob();

      objectUrl = URL.createObjectURL(blob);
      setPhotoUrl(objectUrl);
    }

    loadPhoto();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pet.id, pet.photoType]);

  return (
    <button
      type="button"
      onClick={() => onPetClick(pet)}
      className="w-full text-left"
    >
      <article className="rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.98]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-2xl">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              "🐾"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold">
              {pet.name}
            </h3>

            <p className="text-sm text-gray-500">
              {pet.breed ?? pet.species}
            </p>

            {pet.weight !== null && (
              <p className="text-sm text-gray-500">
                {pet.weight} kg
              </p>
            )}
          </div>

          <span className="text-xl text-gray-300">
            →
          </span>
        </div>
      </article>
    </button>
  );
}

export default PetCard;