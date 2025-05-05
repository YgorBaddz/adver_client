export async function createCalculation({ polzovatelId, data }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/calculations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          ...data,
          polzovatels: [polzovatelId], // если many-to-many
        },
      }),
    }
  );
  return res.json();
}

export async function getUserCalculations({ userId }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/calculations?filters[polzovatels][id][$eq]=${userId}&populate=polzovatels`
  );
  return res.json();
}
