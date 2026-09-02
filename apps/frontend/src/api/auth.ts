export type User = {
  id: number;
  username: string | null;
  firstName: string;
};

type MeResponse = {
  user: User;
};

export async function authenticateWithTelegram(initData: string) {
  const response = await fetch("/api/auth/telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      initData,
    }),
  });

  if (!response.ok) {
    throw new Error("Telegram authentication failed");
  }
}

export async function getMe(): Promise<User> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  const data: MeResponse = await response.json();

  return data.user;
}