"use client";

import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { createCalculation } from "../../lib/calcApi";

const adTypes = [
  { value: "digital", label: "Онлайн реклама" },
  { value: "billboard", label: "Билборды" },
  { value: "leaflet", label: "Листовки" },
];

const platforms = [
  { value: "Google", label: "Google Ads" },
  { value: "VK", label: "VK Реклама" },
  { value: "Яндекс", label: "Яндекс Директ" },
];

export default function Calculator() {
  const [form, setForm] = useState({
    adType: "digital",
    platform: platforms[0].value,
    budget: "",
    goal: "",
    geo: "",
    keywords: "",
    duration: "",
    billboardDays: "",
    billboardCity: "",
    billboardSize: "",
    leafletCount: "",
    leafletMaterialCost: "",
    leafletDistributionCost: "",
  });

  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCalculate = (e) => {
    e.preventDefault();
    let summary = "";

    if (form.adType === "digital") {
      const cpc =
        form.platform === "Google" ? 20 : form.platform === "VK" ? 15 : 10;
      const clicks = Math.floor(form.budget / cpc);
      summary = `Прогноз: ${clicks} кликов, ~${
        clicks * 10
      } охват, средний CPC: ${cpc}₽`;
    } else if (form.adType === "billboard") {
      const ratePerSqmPerDay = 500; // примерная ставка
      const cost =
        Number(form.billboardDays || 0) *
        Number(form.billboardSize || 0) *
        ratePerSqmPerDay;
      summary = `Стоимость билборда: ${cost.toLocaleString()} ₽ за ${
        form.billboardDays
      } дней в ${form.billboardCity}`;
    } else if (form.adType === "leaflet") {
      const materialCost = Number(form.leafletMaterialCost || 0);
      const distributionCost = Number(form.leafletDistributionCost || 0);
      const count = Number(form.leafletCount || 0);
      const cost = ((materialCost + distributionCost) * count) / 1000;
      summary = `Стоимость листовок: ${cost.toLocaleString()} ₽ за ${count} шт`;
    }

    setResult({ summary });
    setSaveStatus("");
  };

  const handleSave = async () => {
    setSaveStatus("loading");

    // Приведение значений к числу или null
    const safeNumber = (val) =>
      val === "" || val === undefined ? null : Number(val);

    try {
      const response = await createCalculation({
        polzovatelId: user.id,
        data: {
          adType: form.adType,
          platform: form.platform,
          budget: safeNumber(form.budget),
          goal: form.goal,
          geo: form.geo,
          keywords: safeNumber(form.keywords), // исправлено!
          duration: safeNumber(form.duration), // исправлено!
          billboardDays: safeNumber(form.billboardDays),
          billboardCity: form.billboardCity,
          billboardSize: safeNumber(form.billboardSize),
          leafletCount: safeNumber(form.leafletCount),
          leafletMaterialCost: safeNumber(form.leafletMaterialCost),
          leafletDistributionCost: safeNumber(form.leafletDistributionCost),
          results: result.summary,
          creation_date: new Date().toISOString(),
        },
      });
      if (response.data) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-10">
      <form
        onSubmit={handleCalculate}
        className="w-full max-w-lg bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-4">
          Калькулятор рекламы
        </h2>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Тип рекламы
          </label>
          <select
            name="adType"
            value={form.adType}
            onChange={handleChange}
            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            {adTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {form.adType === "digital" && (
          <>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Платформа
              </label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                {platforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Бюджет (₽)
              </label>
              <input
                name="budget"
                type="number"
                min={100}
                value={form.budget}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Цель кампании
              </label>
              <input
                name="goal"
                placeholder="Например, клики"
                value={form.goal}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </>
        )}

        {form.adType === "billboard" && (
          <>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Дней аренды
              </label>
              <input
                name="billboardDays"
                type="number"
                min={1}
                value={form.billboardDays}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Город
              </label>
              <input
                name="billboardCity"
                placeholder="Город"
                value={form.billboardCity}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Размер билборда (м²)
              </label>
              <input
                name="billboardSize"
                type="number"
                min={1}
                value={form.billboardSize}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
          </>
        )}

        {form.adType === "leaflet" && (
          <>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Количество листовок
              </label>
              <input
                name="leafletCount"
                type="number"
                min={1}
                value={form.leafletCount}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Стоимость материала за 1000 шт (₽)
              </label>
              <input
                name="leafletMaterialCost"
                type="number"
                min={0}
                value={form.leafletMaterialCost}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Стоимость распространения (₽)
              </label>
              <input
                name="leafletDistributionCost"
                type="number"
                min={0}
                value={form.leafletDistributionCost}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>
          </>
        )}

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold shadow-lg mt-4">
          Рассчитать
        </button>

        {result && (
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded text-indigo-800 text-center mt-4">
            <div className="font-semibold mb-2">Результаты:</div>
            <div>{result.summary}</div>
            {isAuthenticated && (
              <button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-lg mt-4"
                onClick={handleSave}
                disabled={saveStatus === "loading"}
              >
                {saveStatus === "loading"
                  ? "Сохранение..."
                  : saveStatus === "success"
                  ? "Сохранено!"
                  : "Сохранить расчёт"}
              </button>
            )}
            {!isAuthenticated && (
              <div className="text-gray-500 text-sm mt-2">
                <span>Войдите, чтобы сохранять расчёты</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="text-red-500 mt-2">Ошибка при сохранении</div>
            )}
          </div>
        )}
      </form>
    </main>
  );
}
