export default function CalculationDetails({ details }) {
  if (!details) return null;

  const parsed = typeof details === "string" ? JSON.parse(details) : details;

  return (
    <div className="bg-indigo-50 p-4 rounded-xl mt-2 text-left text-sm">
      <h4 className="font-semibold mb-2">Как произведён расчёт:</h4>
      <ul className="list-disc pl-5 mb-2">
        {parsed.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
      <div className="text-gray-600 mb-1">
        Формула: <code>{parsed.formula}</code>
      </div>
      <div className="text-gray-700">{parsed.explanation}</div>
    </div>
  );
}
