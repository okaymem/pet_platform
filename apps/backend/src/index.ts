import { statSync } from "node:fs";
import app from "./app.js";
import { startEventScheduler } from "./scheduler/eventScheduler";
import { startTelegramBot } from "./bot/telegramBot";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startEventScheduler()
  startTelegramBot()
});