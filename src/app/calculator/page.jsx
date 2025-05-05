"use client";

import { useState } from "react";

const platforms = [
  { value: "google", label: "Google Ads" },
  { value: "vk", label: "VK Реклама" },
  { value: "yandex", label: "Яндекс Директ" },
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCalculate = (e) => {
    e.preventDefault();
    // Пример простой логики расчёта (замени на свою)
    const cpc =
      form.platform === "google" ? 20 : form.platform === "vk" ? 15 : 10;
    const clicks = Math.floor(form.budget / cpc);
    setResult({
      cpc,
      clicks,
      reach: clicks * 10,
      summary: `Прогноз: ${clicks} кликов, ~${
        clicks * 10
      } охват, средний CPC: ${cpc}₽`,
    });
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
          </div>
        )}
      </form>
    </main>
  );
}
