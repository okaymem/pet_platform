import { useEffect, useState } from "react";
import {
  getPetEvents,
  type PetEvent,
} from "../api/events";
import EventCard from "./EventCard";
import CreateEvent from "./CreateEvent";
type EventsTab = "upcoming" | "completed";
type PetEventsProps = {
  petId: string;
};

function PetEvents({ petId }: PetEventsProps) {
  const [events, setEvents] = useState<PetEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] =
  useState<EventsTab>("upcoming");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);

        const petEvents = await getPetEvents(petId);

        setEvents(petEvents);
      } finally {
        setIsLoading(false);
      }
    }

     loadEvents();
  }, [petId]);

  const upcomingEvents = events
  .filter(
    (event) => event.completedAt === null,
  )
  .sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() -
      new Date(b.scheduledAt).getTime(),
  );

const completedEvents = events
  .filter(
    (event) => event.completedAt !== null,
  )
  .sort(
    (a, b) =>
      new Date(b.completedAt!).getTime() -
      new Date(a.completedAt!).getTime(),
  );


const visibleEvents =
  activeTab === "upcoming"
    ? upcomingEvents
    : completedEvents;
  if (isLoading) {
    return (
<section className="mt-8 mb-4">
          <h2 className="text-lg font-semibold">
          Events
        </h2>

        <p className="mt-3 text-sm text-gray-400">
          Loading events...
        </p>
      </section>
    );
  }

  return (
    <div className="mb-4 mt-4">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-semibold">
      Events
    </h2>

    <button
    onClick={() => setIsCreatingEvent(true)}
      type="button"
      className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
    >
      + Add
    </button>
  </div>
{isCreatingEvent && (
  <CreateEvent
    petId={petId}
    onCancel={() => setIsCreatingEvent(false)}
    onCreated={(event) => {
      setEvents((prev) => [...prev, event]);
      setIsCreatingEvent(false);
    }}
  />
)}
  <div className="flex rounded-xl bg-gray-100 p-1 mb-1">
    <button
      type="button"
      onClick={() => setActiveTab("upcoming")}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
        activeTab === "upcoming"
          ? "bg-white shadow-sm"
          : "text-gray-500"
      }`}
    >
      Upcoming
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("completed")}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
        activeTab === "completed"
          ? "bg-white shadow-sm"
          : "text-gray-500"
      }`}
    >
      Completed
    </button>
  </div>
  {visibleEvents.length === 0 ? (
  <div className="rounded-2xl border border-dashed p-6 text-center mt-4">
    <p className="text-sm text-gray-500">

      {activeTab === "upcoming"
        ? "No upcoming events"
        : "No completed events"}
    </p>
  </div>
) : (
  <div className="space-y-3">
    {visibleEvents.map((event) => (
  <EventCard
  key={event.id}
  event={event}
  completed={activeTab === "completed"}
  onUpdated={async () => {
    const petEvents = await getPetEvents(petId);
    setEvents(petEvents);
  }}
/>
))}
  </div>
)}
</div>
  );
}

export default PetEvents;