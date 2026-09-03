import type { Pet } from "../api/pets";
import PetCard from "./PetCard";

type PetListProps = {
  pets: Pet[];
  onAddPet: () => void;
  onPetClick: (pet: Pet) =>void;
};

function PetList({ pets, onAddPet, onPetClick }: PetListProps) {
  return (
    <section className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My pets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your little companions
          </p>
        </div>

        <button
        onClick={onAddPet}
          type="button"
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition active:scale-95"
        >
          + Add
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <div className="mb-3 text-4xl">🐾</div>

          <h2 className="font-semibold">
            No pets yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your first pet to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet) => (
            <PetCard pet={pet} key={pet.id} onPetClick={onPetClick}/>
))}
        </div>
      )}
    </section>
  );
}

export default PetList;
