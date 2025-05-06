"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getUserCalculations } from "../../lib/calcApi";
import { useRouter } from "next/navigation";
import { FaBullhorn, FaChartBar, FaFileAlt } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { GiNewspaper } from "react-icons/gi";

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
        <div className="bg-white/80 p-8 rounded-xl shadow text-center text-gray-500">
          У вас пока нет сохранённых расчётов.
        </div>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="bg-white/95 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between p-6 border-l-4
                border-indigo-300 hover:border-indigo-500 transition group gap-4"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition">
                  <AdTypeIcon type={calc.adType} />
                </div>
                <div>
                  <div className="font-bold text-lg text-indigo-700 flex items-center gap-2">
                    <AdTypeLabel type={calc.adType} />
                    <span className="text-xs text-gray-400">
                      {new Date(calc.creation_date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  {calc.adType === "digital" && (
                    <div className="text-gray-600 text-sm">
                      Платформа:{" "}
                      <span className="font-semibold">{calc.platform}</span>
                    </div>
                  )}
                  {calc.adType === "billboard" && (
                    <div className="text-gray-600 text-sm flex items-center gap-1">
                      <MdOutlineLocationOn className="inline-block" />
                      <span>{calc.billboardCity}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  {calc.adType === "digital" && (
                    <>
                      <div className="text-gray-500 text-sm">
                        Бюджет:{" "}
                        <span className="font-semibold">{calc.budget} ₽</span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Цель: <span className="font-semibold">{calc.goal}</span>
                      </div>
                    </>
                  )}
                  {calc.adType === "billboard" && (
                    <>
                      <div className="text-gray-500 text-sm">
                        Дней:{" "}
                        <span className="font-semibold">
                          {calc.billboardDays}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Размер:{" "}
                        <span className="font-semibold">
                          {calc.billboardSize} м²
                        </span>
                      </div>
                    </>
                  )}
                  {calc.adType === "leaflet" && (
                    <>
                      <div className="text-gray-500 text-sm">
                        Листовок:{" "}
                        <span className="font-semibold">
                          {calc.leafletCount}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Материал:{" "}
                        <span className="font-semibold">
                          {calc.leafletMaterialCost} ₽/1000
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Распространение:{" "}
                        <span className="font-semibold">
                          {calc.leafletDistributionCost} ₽
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-indigo-600 font-semibold text-center md:text-right">
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
