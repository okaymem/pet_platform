import { useState, useEffect } from "react";
import {
  updatePet,
  uploadPetPhoto,
  type Pet
} from "../api/pets";
import PetEvents from "./PetEvents";
type PetDetailsProps = {
  pet: Pet;
  onBack: () => void;
  onPetUpdated: (pet: Pet) => void;
};

type EditingField =
  | "name"
  | "species"
  | "breed"
  | "sex"
  | "weight"
  | "birthDate"
  | "description"
  | null;

type SavingField =
  | EditingField
  | "photo";

function PetDetails({
  pet,
  onBack,
  onPetUpdated,
}: PetDetailsProps) {
  const [editingField, setEditingField] =
    useState<EditingField>(null);

  const [savingField, setSavingField] =
    useState<SavingField>(null);

  const [value, setValue] = useState("");

  const [photoVersion, setPhotoVersion] =
    useState(0);
  function startEditing(
    field: Exclude<EditingField, null>,
  ) {
    if (savingField) {
      return;
    }

    setEditingField(field);

    switch (field) {
      case "name":
        setValue(pet.name);
        break;

      case "species":
        setValue(pet.species);
        break;

      case "breed":
        setValue(pet.breed ?? "");
        break;

      case "sex":
        setValue(pet.sex ?? "");
        break;

      case "weight":
        setValue(
          pet.weight !== null
            ? String(pet.weight)
            : "",
        );
        break;

      case "birthDate":
        setValue(
          pet.birthDate
            ? new Date(pet.birthDate)
                .toISOString()
                .split("T")[0]
            : "",
        );
        break;

      case "description":
        setValue(pet.description ?? "");
        break;
    }
  }

  function cancelEditing() {
    if (savingField) {
      return;
    }

    setEditingField(null);
    setValue("");
  }

  async function saveField(
    nextValue?: string,
  ) {
    if (!editingField || savingField) {
      return;
    }

    const field = editingField;
    const currentValue = nextValue ?? value;

    try {
      setSavingField(field);

      let data: {
        name?: string;
        species?: string;
        breed?: string;
        sex?: string;
        birthDate?: string;
        weight?: number;
        description?: string;
      } = {};

      switch (field) {
        case "name":
          if (!currentValue.trim()) {
            return;
          }

          data = {
            name: currentValue.trim(),
          };
          break;

        case "species":
          if (!currentValue) {
            return;
          }

          data = {
            species: currentValue,
          };
          break;

        case "breed":
          data = {
            breed: currentValue.trim(),
          };
          break;

        case "sex":
          data = {
            sex: currentValue,
          };
          break;

        case "weight":
          data = {
            weight: currentValue
              ? Number(currentValue)
              : undefined,
          };
          break;

        case "birthDate":
          data = {
            birthDate:
              currentValue || undefined,
          };
          break;

        case "description":
          data = {
            description:
              currentValue.trim(),
          };
          break;
      }

      const updatedPet = await updatePet(
        pet.id,
        data,
      );

      onPetUpdated(updatedPet);

      setEditingField(null);
      setValue("");
    } finally {
      setSavingField(null);
    }
  }

  async function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file || savingField) {
      return;
    }

    try {
      setSavingField("photo");

      await uploadPetPhoto(
        pet.id,
        file,
      );

      setPhotoVersion(
        (current) => current + 1,
      );
    } finally {
      setSavingField(null);
      event.target.value = "";
    }
  }

  function renderEditableField(
    field: Exclude<EditingField, null>,
    label: string,
    displayValue: string,
  ) {
    const isEditing =
      editingField === field;

    const isSaving =
      savingField === field;

    if (!isEditing) {
      return (
        <button
          type="button"
          disabled={savingField !== null}
          onClick={() =>
            startEditing(field)
          }
          className="block w-full min-w-0 overflow-hidden text-left disabled:cursor-not-allowed"        >
          <p className="text-xs text-gray-400">
            {label}
          </p>

          <p className="mt-1 break-words font-medium">
            {displayValue}
          </p>
        </button>
      );
    }

    return (
      <div>
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <div className="relative mt-1">
          {field === "species" ? (
            <select
              autoFocus
              value={value}
              disabled={savingField !== null}
              onChange={(event) => {
                const nextValue =
                  event.target.value;

                setValue(nextValue);

                if (nextValue) {
                  void saveField(
                    nextValue,
                  );
                }
              }}
              className="w-full appearance-none rounded-xl border bg-white px-3 py-3 pr-12 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select species
              </option>

              <option value="Dog">
                Dog
              </option>

              <option value="Cat">
                Cat
              </option>

              <option value="Bird">
                Bird
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          ) : field === "sex" ? (
            <select
              autoFocus
              value={value}
              disabled={savingField !== null}
              onChange={(event) => {
                const nextValue =
                  event.target.value;

                setValue(nextValue);

                if (nextValue) {
                  void saveField(
                    nextValue,
                  );
                }
              }}
              className="w-full appearance-none rounded-xl border bg-white px-3 py-3 pr-12 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Not specified
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>
          ) : field === "description" ? (
            <textarea
              autoFocus
              value={value}
              disabled={savingField !== null}
              onChange={(event) =>
                setValue(
                  event.target.value,
                )
              }
              onBlur={() =>
                void saveField()
              }
              rows={4}
              className="w-full resize-none rounded-xl border px-3 py-3 pr-12 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          ) : (
            <input
              autoFocus
              disabled={savingField !== null}
              type={
                field === "weight"
                  ? "number"
                  : field === "birthDate"
                    ? "date"
                    : "text"
              }
              step={
                field === "weight"
                  ? "0.1"
                  : undefined
              }
              value={value}
              onChange={(event) =>
                setValue(
                  event.target.value,
                )
              }
              onBlur={() =>
                void saveField()
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  field !== "birthDate"
                ) {
                  event.currentTarget.blur();
                }
              }}
              className="w-full rounded-xl border px-3 py-3 pr-12 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          )}

          <button
            type="button"
            disabled={savingField !== null}
            onPointerDown={(event) => {
              event.preventDefault();
              cancelEditing();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {isSaving && (
          <p className="mt-1 text-xs text-gray-400">
            Saving...
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-2 py-4">
      <button
        type="button"
        onClick={onBack}
        disabled={savingField !== null}
        className="mb-6 text-sm font-medium text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Back
      </button>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="flex flex-col items-center text-center">
          <label
            className={
              savingField
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
          >
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-5xl">
              {pet.photoType ? (
                <img
                  src={`/api/pets/${pet.id}/photo?v=${photoVersion}`}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                "🐾"
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              disabled={savingField !== null}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>

          {savingField === "photo" ? (
            <p className="mt-2 text-xs text-gray-400">
              Saving...
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              Tap photo to change
            </p>
          )}
        </div>

        <div className="mt-8">
          {renderEditableField(
            "name",
            "Name",
            pet.name,
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
            {renderEditableField(
              "species",
              "Species",
              pet.species,
            )}
          </div>

          <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
            {renderEditableField(
              "sex",
              "Sex",
              pet.sex ?? "Not specified",
            )}
          </div>

          <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
            {renderEditableField(
              "breed",
              "Breed",
              pet.breed ?? "Not specified",
            )}
          </div>

          <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
            {renderEditableField(
              "weight",
              "Weight",
              pet.weight !== null
                ? `${pet.weight} kg`
                : "Not specified",
            )}
          </div>
        </div>


        <div className="mt-3 rounded-2xl bg-gray-50 p-4">
          {renderEditableField(
            "birthDate",
            "Birth date",
            pet.birthDate
              ? new Date(
                  pet.birthDate,
                ).toLocaleDateString()
              : "Not specified",
          )}
        </div>


        <div className="mt-3 rounded-2xl bg-gray-50 p-4">
          {renderEditableField(
            "description",
            "About",
            pet.description ||
              "Add description",
          )}
        </div>
      </div>
      <PetEvents petId={pet.id} />
    </section>
  );
}

export default PetDetails;