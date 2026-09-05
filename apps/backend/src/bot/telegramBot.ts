import { sendTelegramMessage } from "../lib/tgMessages";

const TELEGRAM_API_URL = "https://api.telegram.org";

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat: {
      id: number;
    };
    text?: string;
  };
};

type TelegramUpdatesResponse = {
  ok: boolean;
  result: TelegramUpdate[];
};

export async function startTelegramBot() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  if (!miniAppUrl) {
    throw new Error("TELEGRAM_MINI_APP_URL is not configured");
  }

  console.log("Telegram bot started");

  let offset = 0;

  while (true) {
    try {
      const response = await fetch(
        `${TELEGRAM_API_URL}/bot${botToken}/getUpdates?timeout=30&offset=${offset}`,
      );

      if (!response.ok) {
        throw new Error("Failed to get Telegram updates");
      }

      const data =
        (await response.json()) as TelegramUpdatesResponse;

      for (const update of data.result) {
        offset = update.update_id + 1;

        const message = update.message;

        if (!message?.text) {
          continue;
        }

        if (message.text.startsWith("/start")) {
          await sendWelcomeMessage(
            String(message.chat.id),
            miniAppUrl,
          );
        }
      }
    } catch (error) {
      console.error("Telegram bot error:", error);

      await new Promise((resolve) =>
        setTimeout(resolve, 3000),
      );
    }
  }
}

async function sendWelcomeMessage(
  telegramId: string,
  miniAppUrl: string,
) {
  await sendTelegramMessage(
    telegramId,
    [
      "Добро пожаловать в Pet Platform.",
      "",
      "Здесь вы можете хранить информацию о своих питомцах,",
      "планировать события и получать напоминания.",
      "",
      "Откройте приложение, чтобы начать.",
    ].join("\n"),
    {
      inline_keyboard: [
        [
          {
            text: "Открыть Pet Platform",
            web_app: {
              url: miniAppUrl,
            },
          },
        ],
      ],
    },
  );
}