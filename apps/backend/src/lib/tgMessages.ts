const TELEGRAM_API_URL = "https://api.telegram.org";

type TelegramReplyMarkup = {
  inline_keyboard: Array<
    Array<{
      text: string;
      web_app?: {
        url: string;
      };
    }>
  >;
};

export async function sendTelegramMessage(
  telegramId: string,
  message: string,
  replyMarkup?: TelegramReplyMarkup,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(
    `${TELEGRAM_API_URL}/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        ...(replyMarkup
          ? { reply_markup: replyMarkup }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send Telegram message");
  }
}