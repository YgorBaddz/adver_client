"use client";

import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { createCalculation } from "../../lib/calcApi";

const platforms = [
  { value: "Google", label: "Google Ads" },
  { value: "VK", label: "VK Реклама" },
  { value: "Яндекс", label: "Яндекс Директ" },
];

export default function Calculator() {
  const [form, setForm] = useState({
    platform: platforms[0].value,
    budget: "",
    goal: "",
    geo: "",
    keywords: "",
    duration: "",
  });

  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCalculate = (e) => {
    e.preventDefault();
    const cpc =
      form.platform === "Google" ? 20 : form.platform === "VK" ? 15 : 10;
    const clicks = Math.floor(form.budget / cpc);
    setResult({
      cpc,
      clicks,
      reach: clicks * 10,
      summary: `Прогноз: ${clicks} кликов, ~${
        clicks * 10
      } охват, средний CPC: ${cpc}₽`,
    });
    setSaveStatus(""); // сбрасываем статус при новом расчёте
  };

  const handleSave = async () => {
    setSaveStatus("loading");
    try {
      const response = await createCalculation({
        polzovatelId: user.id,
        data: {
          calc_name: `Расчёт от ${new Date().toLocaleString("ru-RU")}`,
          platform: form.platform,
          budget: Number(form.budget),
          company_objectives: form.goal,
          creation_date: new Date().toISOString(),
          results: result.summary,
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleCalculate}
        className="w-full max-w-lg bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 space-y-6 mt-10"
      >
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-2">
          Калькулятор рекламы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              География
            </label>
            <input
              name="geo"
              placeholder="Россия, Москва"
              value={form.geo}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">
              Ключевые слова
            </label>
            <input
              name="keywords"
              placeholder="через запятую"
              value={form.keywords}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Длительность (дней)
            </label>
            <input
              name="duration"
              type="number"
              min={1}
              value={form.duration}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold shadow-lg mt-2">
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
