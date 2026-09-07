import { statSync } from "node:fs";
import app from "./app.js";
import { startEventScheduler } from "./scheduler/eventScheduler";
import { startTelegramBot } from "./bot/telegramBot";
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  startEventScheduler();
  startTelegramBot();
});