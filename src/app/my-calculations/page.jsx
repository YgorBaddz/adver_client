"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getUserCalculations } from "../../lib/calcApi";
import { useRouter } from "next/navigation";

export default function MyCalculations() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    async function fetchCalcs() {
      setLoading(true);
      const data = await getUserCalculations({ userId: user.id });
      setCalculations(data.data || []);
      setLoading(false);
    }
    fetchCalcs();
  }, [isAuthenticated, user, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-8">
        Мои расчёты
      </h2>
      {loading ? (
        <div className="text-gray-500">Загрузка...</div>
      ) : calculations.length === 0 ? (
        <div className="bg-white/80 p-8 rounded-xl shadow text-center text-gray-500">
          У вас пока нет сохранённых расчётов.
        </div>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="bg-white/90 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <div className="font-bold text-lg text-indigo-700 mb-1">
                  {calc.platform}
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  Бюджет: <span className="font-semibold">{calc.budget} ₽</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(calc.creation_date).toLocaleString("ru-RU")}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                <div className="text-indigo-600 font-semibold mb-2">
                  {calc.results}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
