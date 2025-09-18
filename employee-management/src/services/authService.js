const API_URL = "http://localhost:3000";

export async function sendCode(phoneNumber) {
  const response = await fetch(`${API_URL}/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber }),
  });
  return response.json();
}
