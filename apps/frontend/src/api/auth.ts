import { apiFetch, apiUrl, setSessionToken } from "./client";

export type User = {
  id: string;
  username: string | null;
  firstName: string;
};

type MeResponse = {
  user: User;
};

export async function authenticateWithTelegram(initData: string) {
  const response = await fetch(apiUrl("/api/auth/telegram"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initData }),
  });

  if (!response.ok) {
    throw new Error("Telegram authentication failed");
  }

  const data: { token: string } = await response.json();

  setSessionToken(data.token);
}

export async function getMe(): Promise<User> {
  const response = await apiFetch("/api/auth/me");

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  const data: MeResponse = await response.json();

  return data.user;
}