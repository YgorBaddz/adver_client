const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function registerUser({ username, email, password, company }) {
  const res = await fetch(`${STRAPI_URL}/api/polzovatels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { username, email, password, company },
    }),
  });
  return res.json();
}

export async function loginUser({ identifier, password }) {
  const params = new URLSearchParams({
    "filters[$or][0][email][$eq]": identifier,
    "filters[$or][1][username][$eq]": identifier,
  });
  const res = await fetch(`${STRAPI_URL}/api/polzovatels?${params.toString()}`);
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    // В Strapi v5 поля лежат прямо в объекте data
    const user = data.data.find((u) => u.password === password);
    return { data: user ? [user] : [] };
  }
  return { data: [] };
}
