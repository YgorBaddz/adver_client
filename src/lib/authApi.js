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
  // Поиск пользователя по email или username и паролю
  const query = encodeURIComponent(
    `filters[$or][0][email][$eq]=${identifier}&filters[$or][1][username][$eq]=${identifier}&filters[password][$eq]=${password}`
  );
  const res = await fetch(`${STRAPI_URL}/api/polzovatels?${query}`);
  const data = await res.json();
  return data;
}
