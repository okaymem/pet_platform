import { processDueEvents } from "../services/eventNotifications";

const INTERVAL = 30 * 1000;

export function startEventScheduler() {
  console.log("Event scheduler started");

   processDueEvents();

  setInterval(() => {
     processDueEvents();
  }, INTERVAL);
}