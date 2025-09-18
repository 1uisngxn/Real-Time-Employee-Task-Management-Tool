export const API_BASE = "http://localhost:5000/api/owner";

export async function createAccessCode(phoneNumber) {
  const res = await fetch(`${API_BASE}/CreateNewAccessCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  return res.json();
}

export async function validateAccessCode(phoneNumber, accessCode) {
  const res = await fetch(`${API_BASE}/ValidateAccessCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, accessCode })
  });
  return res.json();
}
