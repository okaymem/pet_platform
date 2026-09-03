import type { PetEvent } from "../api/events";
import {
  Scissors,
  Stethoscope,
  Syringe,
  Pill,
  Utensils,
  FileText,
  Pin,
  Check,
  Repeat2,
  Footprints
} from "lucide-react";
import {
  completePetEvent,
  deletePetEvent,
} from "../api/events";
type EventCardProps = {
  event: PetEvent;
  completed?: boolean;
  onUpdated: () => void;
};

const eventTypeLabels: Record<string, string> = {
  grooming: "Grooming",
  vet: "Vet visit",
  vaccination: "Vaccination",
  medication: "Medication",
  feeding: "Feeding",
  walking: "Walking",
};

const eventIcons = {
  grooming: Scissors,
  vet: Stethoscope,
  vaccination: Syringe,
  medication: Pill,
  feeding: Utensils,
  walking: Footprints,
};

const intervalUnitLabels: Record<string, string> = {
  day: "day",
  week: "week",
  month: "month",
  year: "year",
};

function formatRecurringInterval(
  interval: number | null,
  intervalUnit: string | null,
) {
  if (!interval || !intervalUnit) {
    return null;
  }

  const unit = intervalUnitLabels[intervalUnit];

  if (!unit) {
    return null;
  }

  const pluralUnit =
    interval === 1 ? unit : `${unit}s`;

  return `Every ${interval} ${pluralUnit}`;
}

function EventCard({
  event,
  completed = false,
  onUpdated
}: EventCardProps) {
  const Icon =
    eventIcons[
      event.type as keyof typeof eventIcons
    ] ?? Pin;

  const date = new Date(event.scheduledAt);
  const now = new Date();

  const isCompleted =
  event.completedAt !== null;

const isOverdue =
  !isCompleted &&
  date.getTime() < now.getTime();

const isUrgent =
  !isCompleted &&
  !isOverdue &&
  date.getTime() - now.getTime() <=
    60 * 60 * 1000;

async function handleComplete() {
  try {
    await completePetEvent(
      event.petId,
      event.id,
    );

    onUpdated();
  } catch (error) {
    console.error(
      "Failed to complete event:",
      error,
    );
  }
}

async function handleDelete() {
  const confirmed = window.confirm(
    "Delete this event?",
  );

  if (!confirmed) {
    return;
  }

  try {
    await deletePetEvent(
      event.petId,
      event.id,
    );

    onUpdated();
  } catch (error) {
    console.error(
      "Failed to delete event:",
      error,
    );
  }
}

  const recurringText = event.isRecurring
    ? formatRecurringInterval(
        event.interval,
        event.intervalUnit,
      )
    : null;

  const formattedDate =
    date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formattedTime =
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const cardClassName = isCompleted
  ? "border-emerald-100 bg-emerald-50"
  : isOverdue
    ? "border-violet-200 bg-violet-50"
    : isUrgent
      ? "border-rose-100 bg-rose-50"
      : "border-sky-100 bg-sky-50";

const iconClassName = isCompleted
  ? "bg-emerald-100 text-emerald-700"
  : isOverdue
    ? "bg-violet-100 text-violet-700"
    : isUrgent
      ? "bg-rose-100 text-rose-700"
      : "bg-sky-100 text-sky-700";

const titleClassName = isCompleted
  ? "text-emerald-900"
  : isOverdue
    ? "text-violet-900"
    : isUrgent
      ? "text-rose-900"
      : "text-sky-900";

const secondaryTextClassName =
  isCompleted
    ? "text-emerald-700"
    : isOverdue
      ? "text-violet-700"
      : isUrgent
        ? "text-rose-700"
        : "text-sky-700";

  const recurringBadgeClassName =
    isCompleted
      ? "bg-emerald-100 text-emerald-700"
      : isUrgent
        ? "bg-rose-100 text-rose-700"
        : "bg-sky-100 text-sky-700";

  const notesClassName = isCompleted
    ? "text-emerald-600"
    : isUrgent
      ? "text-rose-600"
      : "text-sky-600";

  return (
    <article
      className={`rounded-2xl border p-4 transition ${cardClassName}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {isCompleted ? (
            <Check
              className="h-5 w-5"
              strokeWidth={2}
            />
          ) : (
            <Icon
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`font-medium ${titleClassName}`}
              >
                {event.title}
              </h3>

              {event.isRecurring && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${recurringBadgeClassName}`}
                  >
                    <Repeat2 className="h-3 w-3" />
                    Recurring
                  </span>

                  {recurringText && (
                    <span
                      className={`text-xs ${secondaryTextClassName}`}
                    >
                      {recurringText}
                    </span>
                  )}
                </div>
              )}
            </div>

            <span
              className={`shrink-0 text-xs font-medium ${secondaryTextClassName}`}
            >
              {eventTypeLabels[event.type] ??
                event.type}
            </span>
          </div>

          <p
            className={`mt-2 text-sm ${secondaryTextClassName}`}
          >
            {formattedDate} · {formattedTime}
          </p>
              

{isOverdue && (
  <p className="mt-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
    ПРОСРОЧЕНО!!!
  </p>
)}

{isUrgent && (
  <p className="mt-1.5 text-xs font-medium text-rose-700">
    Coming up soon
  </p>
)}

          {event.notes && (
            <p
              className={`mt-2 break-words text-sm ${notesClassName}`}
            >
              {event.notes}
            </p>
          )}
          <div className="mt-4 flex gap-2">
  {!isCompleted && (
    <button
      type="button"
      onClick={handleComplete}
      className="flex-1 rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-white"
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        <Check className="h-4 w-4" />
        Complete
      </span>
    </button>
  )}

  <button
    type="button"
    onClick={handleDelete}
    className={`rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-gray-700 ${
      isCompleted ? "w-full" : ""
    }`}
  >
    Delete
  </button>
</div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;