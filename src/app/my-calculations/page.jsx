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
            <div key={calc.id} className="...">
              <div className="font-bold">
                {calc.adType === "digital"
                  ? calc.platform
                  : calc.adType === "billboard"
                  ? "Билборд"
                  : "Листовки"}
              </div>
              {calc.adType === "digital" && (
                <>
                  <div>Бюджет: {calc.budget} ₽</div>
                  <div>Цель: {calc.goal}</div>
                </>
              )}
              {calc.adType === "billboard" && (
                <>
                  <div>Город: {calc.billboardCity}</div>
                  <div>Дней: {calc.billboardDays}</div>
                  <div>Размер: {calc.billboardSize} м²</div>
                </>
              )}
              {calc.adType === "leaflet" && (
                <>
                  <div>Листовок: {calc.leafletCount}</div>
                  <div>Материал: {calc.leafletMaterialCost} ₽/1000</div>
                  <div>Распространение: {calc.leafletDistributionCost} ₽</div>
                </>
              )}
              <div className="text-indigo-600">{calc.results}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
