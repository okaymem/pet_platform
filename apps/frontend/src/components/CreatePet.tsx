import { useState, useEffect } from "react";
import { createPet, uploadPetPhoto, type Pet } from "../api/pets";
type CreatePetProps = {
  onCancel: () => void;
  onPetCreated: (pet: Pet) => void;
};

type PetFormData = {
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthDate: string;
  weight: string;
  description: string;
};

type Step = 1 | 2 | 3;

function CreatePet({ onCancel, onPetCreated }: CreatePetProps) {
  const [step, setStep] = useState<Step>(1);
const [photo, setPhoto] = useState<File | null>(null);
const [photoPreview, setPhotoPreview] = useState<string | null>(null);  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    description: "",
  });
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
function handlePhotoChange(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  setPhoto(file);
}
  function updateField<K extends keyof PetFormData>(
    field: K,
    value: PetFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNext() {
    if (step < 3) {
      setStep((current) => (current + 1) as Step);
    }
  }

  function handleBack() {
    if (step === 1) {
      onCancel();
      return;
    }

    setStep((current) => (current - 1) as Step);
  }

  async function handleSubmit() {
  try {
    setIsSubmitting(true);
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.species) {
      setError("Species is required");
      return;
    }

    const pet = await createPet({
      name: formData.name,
      species: formData.species,
      breed: formData.breed || undefined,
      sex: formData.sex || undefined,
      birthDate: formData.birthDate || undefined,
      weight: formData.weight
        ? Number(formData.weight)
        : undefined,
      description: formData.description || undefined,
    });

    if (photo) {
      await uploadPetPhoto(pet.id, photo);

    }

    onPetCreated(pet);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to create pet",
    );
  } finally {
    setIsSubmitting(false);
  }
}


  
  useEffect(() => {
  if (!photo) {
    setPhotoPreview(null);
    return;
  }

  const url = URL.createObjectURL(photo);

  setPhotoPreview(url);

  return () => {
    URL.revokeObjectURL(url);
  };
}, [photo]);
  return (
  <section className="mx-auto w-full max-w-md px-2 py-2">
        <button
        type="button"
        onClick={handleBack}
        className="mb-8 self-start text-sm text-gray-500"
      >
        ← Back
      </button>

      <div className="mb-8">
        <div className="mb-3 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1 flex-1 rounded-full ${
                item <= step ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-400">
          Step {step} of 3
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-5xl">🐾</div>

            <h1 className="text-3xl font-bold">
              Tell us about your pet
            </h1>

           
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <input
              value={formData.name}
              onChange={(event) =>
                updateField("name", event.currentTarget.value)
              }
              placeholder="For example, Archie"
              className="w-full rounded-2xl border px-4 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Species
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["Dog", "Cat", "Other"].map((species) => (
                <button
                  key={species}
                  type="button"
                  onClick={() => updateField("species", species)}
                  className={`rounded-2xl border p-4 ${
                    formData.species === species
                      ? "border-black bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {species}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Breed
            </label>

            <input
              value={formData.breed}
              onChange={(event) =>
                updateField("breed", event.target.value)
              }
              placeholder="For example, Golden Retriever"
              className="w-full rounded-2xl border px-4 py-4 outline-none focus:border-black"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-5xl">✨</div>

            <h1 className="text-3xl font-bold">
              A little more
            </h1>

            
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sex
            </label>

            <div className="grid grid-cols-2 gap-2">
              {["Male", "Female"].map((sex) => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => updateField("sex", sex)}
                  className={`rounded-2xl border p-4 ${
                    formData.sex === sex
                      ? "border-black bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Birth date
            </label>

            <input
              type="date"
              value={formData.birthDate}
              onChange={(event) =>
                updateField("birthDate", event.target.value)
              }
              className="w-full rounded-2xl border px-4 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Weight
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(event) =>
                  updateField("weight", event.target.value)
                }
                placeholder="12.5"
                className="w-full rounded-2xl border px-4 py-4 pr-12 outline-none focus:border-black"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                kg
              </span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>

            <h1 className="text-3xl font-bold">
              Almost done!
            </h1>

           
          </div>

          <div>
            <div className="mt-6 space-y-3">
  <p className="text-sm font-medium text-gray-700">
    Photo
  </p>

  <div className="grid grid-cols-2 gap-3">
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-sm transition active:scale-[0.98]">
      <span className="text-3xl">📷</span>
      <span className="text-sm font-medium">
        Take a picture
      </span>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
        className="hidden"
      />
    </label>

    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-sm transition active:scale-[0.98]">
      <span className="text-3xl">🖼️</span>
      <span className="text-sm font-medium">
         Gallery
      </span>

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
    </label>
  </div>
</div>
{photoPreview && (
  <div className="mt-6 flex justify-center">
    <img
      src={photoPreview}
      alt="Pet preview"
      className="h-40 w-40 rounded-2xl object-cover shadow-sm"
    />
  </div>
)}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Tell us something about your pet..."
              rows={5}
              className="w-full resize-none rounded-2xl border px-4 py-4 outline-none focus:border-black"
            />
          </div>
        </div>
      )}

      <div className="mt-auto pt-8"> {error && (
  <p className="text-sm text-red-500">
    {error}
  </p>
)}
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-2xl bg-black py-4 font-medium text-white transition active:scale-[0.98]"
          >
            Continue
          </button>
        ) : (
          <button
  type="button"
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="w-full rounded-2xl bg-black py-4 font-medium text-white transition  disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting ? "Creating pet..." : "Create pet"}
</button>
        )}
      </div>
    </section>
  );
}

export default CreatePet;

