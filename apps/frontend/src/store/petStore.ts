import { create } from "zustand";
import type { Pet } from "../api/pets";

type PetStore = {
  pets: Pet[];
  selectedPet: Pet | null;

  setPets: (pets: Pet[]) => void;
  setSelectedPet: (pet: Pet | null) => void;
  updatePet: (pet: Pet) => void;
};

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  selectedPet: null,

  setPets: (pets) => set({ pets }),

  setSelectedPet: (pet) => set({ selectedPet: pet }),

  updatePet: (updatedPet) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === updatedPet.id ? updatedPet : pet,
      ),
      selectedPet: updatedPet,
    })),
}));