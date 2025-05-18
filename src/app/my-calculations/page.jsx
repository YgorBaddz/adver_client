"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getUserCalculations } from "../../lib/calcApi";
import { useRouter } from "next/navigation";
import { FaBullhorn, FaChartBar, FaFileAlt } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { GiNewspaper } from "react-icons/gi";
import CalculationDetails from "@/components/CalculationDetails";

function AdTypeIcon({ type }) {
  if (type === "digital") return <FaChartBar className="text-blue-500" />;
  if (type === "billboard") return <FaBullhorn className="text-yellow-500" />;
  if (type === "leaflet") return <GiNewspaper className="text-green-500" />;
  return <FaFileAlt />;
}

function AdTypeLabel({ type }) {
  if (type === "digital") return "Онлайн реклама";
  if (type === "billboard") return "Билборд";
  if (type === "leaflet") return "Листовки";
  return "Реклама";
}

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
        <div className="bg-white/80 p-8 rounded-xl shadow text-center text-gray-500 max-w-xl w-full">
          У вас пока нет сохранённых расчётов.
        </div>
      ) : (
        <div className="w-full max-w-4xl grid gap-6">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="bg-white/95 rounded-2xl shadow-lg p-6 border-l-4 border-indigo-300 hover:border-indigo-500 transition group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Левая часть: иконка и базовая инфо */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition flex-shrink-0">
                    <AdTypeIcon type={calc.adType} />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold text-indigo-700 flex items-center gap-2 flex-wrap">
                      <AdTypeLabel type={calc.adType} />
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(calc.creation_date).toLocaleDateString(
                          "ru-RU"
                        )}
                      </span>
                    </div>
                    {calc.adType === "digital" && (
                      <div className="text-gray-600 text-sm truncate max-w-xs">
                        Платформа:{" "}
                        <span className="font-semibold">{calc.platform}</span>
                      </div>
                    )}
                    {calc.adType === "billboard" && (
                      <div className="text-gray-600 text-sm flex items-center gap-1 truncate max-w-xs">
                        <MdOutlineLocationOn className="inline-block" />
                        <span>{calc.billboardCity}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Средняя часть: параметры */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
                  {calc.adType === "digital" && (
                    <>
                      <div>
                        Бюджет:{" "}
                        <span className="font-semibold">{calc.budget} ₽</span>
                      </div>
                      <div>
                        Цель:{" "}
                        <span className="font-semibold">
                          {calc.goal || "-"}
                        </span>
                      </div>
                    </>
                  )}
                  {calc.adType === "billboard" && (
                    <>
                      <div>
                        Дней:{" "}
                        <span className="font-semibold">
                          {calc.billboardDays}
                        </span>
                      </div>
                      <div>
                        Размер:{" "}
                        <span className="font-semibold">
                          {calc.billboardSize} м²
                        </span>
                      </div>
                    </>
                  )}
                  {calc.adType === "leaflet" && (
                    <>
                      <div>
                        Листовок:{" "}
                        <span className="font-semibold">
                          {calc.leafletCount}
                        </span>
                      </div>
                      <div>
                        Материал:{" "}
                        <span className="font-semibold">
                          {calc.leafletMaterialCost} ₽/1000
                        </span>
                      </div>
                      <div>
                        Распространение:{" "}
                        <span className="font-semibold">
                          {calc.leafletDistributionCost} ₽
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Правая часть: итог */}
                <div className="text-indigo-600 font-semibold text-center md:text-right min-w-[180px] break-words">
                  {calc.results}
                </div>
              </div>

              {/* Детали расчёта */}
              <div className="mt-4 border-t border-indigo-200 pt-4">
                <CalculationDetails details={calc.calculation_details} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
