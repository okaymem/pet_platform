import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Plus,
  Tag,
  X,
  Bell,
  Footprints
} from "lucide-react";
import {
  createPetEvent,
  type PetEvent,
} from "../api/events";

type CreateEventProps = {
  petId: string;
  onCreated: (event: PetEvent) => void;
  onCancel: () => void;
};

const eventTypes = [
  { value: "grooming", label: "Grooming" },
  { value: "vet", label: "Vet visit" },
  { value: "vaccination", label: "Vaccination" },
  { value: "medication", label: "Medication" },
  { value: "feeding", label: "Feeding" },
  { value: "walking", label: "Walking" },
];

function getDefaultDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultTime() {
  const now = new Date();

  const minutes = now.getMinutes();

  const roundedMinutes =
    minutes < 30 ? 30 : 60;

  const date = new Date(now);

  date.setMinutes(roundedMinutes, 0, 0);

  return date.toTimeString().slice(0, 5);
}
 function getMinDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function CreateEvent({
  petId,
  onCreated,
  onCancel,
}: CreateEventProps) {
  const [type, setType] = useState("vet");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getDefaultDate);
  const [time, setTime] = useState(getDefaultTime);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [interval, setInterval] = useState("1");
  const [intervalUnit, setIntervalUnit] = useState("month");
  const [notificationsEnabled, setNotificationsEnabled] =
  useState(true);
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an event title");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    if (!time) {
      setError("Please select a time");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const scheduledAtDate = new Date(
  `${date}T${time}`,
);

if (scheduledAtDate <= new Date()) {
  setError("Event must be scheduled in the future");
  return;
}

const scheduledAt =
  scheduledAtDate.toISOString();

const createdEvent = await createPetEvent(petId, {
  type,
  title: title.trim(),
  scheduledAt,
  isRecurring,
  interval: isRecurring
    ? Number(interval)
    : undefined,
  intervalUnit: isRecurring
    ? intervalUnit
    : undefined,
    notificationsEnabled,
  notes: notes.trim() || undefined,
});

      onCreated(createdEvent);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create event",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mb-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <CalendarDays
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">
                New event
              </h3>

              <p className="mt-0.5 text-sm text-gray-500">
                Add something to your pet's schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4 text-gray-400" />
            Event type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          >
            {eventTypes.map((eventType) => (
              <option
                key={eventType.value}
                value={eventType.value}
              >
                {eventType.label}
              </option>
            ))}
          </select>
        </div>

<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Schedule
  </label>

  <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
    <button
      type="button"
      onClick={() => setIsRecurring(false)}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        !isRecurring
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500"
      }`}
    >
      One-time
    </button>

    <button
      type="button"
      onClick={() => setIsRecurring(true)}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        isRecurring
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500"
      }`}
    >
      Recurring
    </button>
  </div>
</div>        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Event title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);

              if (error) {
                setError(null);
              }
            }}
            placeholder="Rabies vaccination"
            autoFocus
            className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            When?
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
  type="date"
  value={date}
  min={getMinDate()}
  onChange={(event) =>
    setDate(event.target.value)
  }
  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
/>
            </div>

            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          </div>
        </div>
                {isRecurring && (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Repeat every
    </label>

    <div className="grid grid-cols-[1fr_1.5fr] gap-3">
      <input
        type="number"
        min="1"
        value={interval}
        onChange={(event) =>
          setInterval(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      />

      <select
        value={intervalUnit}
        onChange={(event) =>
          setIntervalUnit(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      >
        <option value="day">Day(s)</option>
        <option value="week">Week(s)</option>
        <option value="month">Month(s)</option>
        <option value="year">Year(s)</option>
      </select>
    </div>
  </div>
)}
        <div>
  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 transition hover:bg-gray-100">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-500">
        <Bell
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-800">
          Notify me
        </p>

        
      </div>
    </div>

    <input
      type="checkbox"
      checked={notificationsEnabled}
      onChange={(event) =>
        setNotificationsEnabled(
          event.target.checked,
        )
      }
      className="h-5 w-5 rounded border-gray-300 accent-blue-600"
    />
  </label>
</div>
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 text-gray-400" />
            Notes
            <span className="font-normal text-gray-400">
              optional
            </span>
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Add any useful details..."
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />

            {isSubmitting
              ? "Creating..."
              : "Create event"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateEvent;