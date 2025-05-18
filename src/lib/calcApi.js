import { getCalculationDetails } from "@/components/funcs/getCalculationDetails";

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

export async function handleCreateCalculation(form, user) {
  const details = getCalculationDetails(form);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/calculations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          ...form,
          results: details.explanation,
          calculation_details: JSON.stringify(details),
          polzovatels: [user.id], // связь many-to-many
        },
      }),
    }
  );

  const data = await response.json();
  return data;
}
