const webApp = window.Telegram.WebApp;

webApp.ready();

const output = document.createElement("pre");

output.style.whiteSpace = "pre-wrap";
output.style.wordBreak = "break-all";

document.body.appendChild(output);


async function authenticate() {
  try {
    const response = await fetch("/api/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        initData: webApp.initData,
      }),
    });

    const text = await response.text();

    output.textContent += `Status: ${response.status}\n\n`;
    output.textContent += text;
  } catch (error) {
    output.textContent += `REQUEST ERROR:\n${String(error)}`;
  }
}

output.textContent += `\n\nDOCUMENT.COOKIE:\n${document.cookie}`;
async function meCheck() {
  const profileElement = document.getElementById("profile");

  if (!profileElement) {
    throw new Error("Profile element not found");
  }

  const meResponse = await fetch("/api/auth/me", {
  credentials: "include",
});

  const data = await meResponse.json();

  output.textContent += `\n\nME STATUS: ${meResponse.status}\n`;
  output.textContent += `ME RESPONSE:\n${JSON.stringify(data, null, 2)}`;

  if (!meResponse.ok) {
    throw new Error("Failed to load profile");
  }

  const { user } = data;

  profileElement.innerHTML = `
    <h2>Profile</h2>
    <p>ID: ${user.id}</p>
    <p>Username: ${user.username}</p>
    <p>First name: ${user.firstName}</p>
  `;
}

await authenticate();

await new Promise((resolve) => setTimeout(resolve, 1000));

await meCheck();

export {};