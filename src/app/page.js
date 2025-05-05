import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
          Автоматизация расчёта стоимости рекламы
        </h1>
        <p className="mb-6 text-lg md:text-xl text-gray-700 max-w-xl">
          Быстро, точно и удобно рассчитайте бюджет рекламной кампании онлайн.
        </p>
        <Link
          href={"calculator"}
          className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
        >
          Рассчитать стоимость
        </Link>
      </section>

      <section className="py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white/70 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">⚡</span>
          <h3 className="font-bold mb-1">Быстро</h3>
          <p className="text-gray-500 text-sm">
            Мгновенные расчёты по заданным параметрам
          </p>
        </div>
        <div className="bg-white/70 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🎯</span>
          <h3 className="font-bold mb-1">Точно</h3>
          <p className="text-gray-500 text-sm">
            Актуальные данные и прозрачные алгоритмы
          </p>
        </div>
        <div className="bg-white/70 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">📊</span>
          <h3 className="font-bold mb-1">Аналитика</h3>
          <p className="text-gray-500 text-sm">
            Визуализация и история ваших расчётов
          </p>
        </div>
      </section>

      <footer className="text-center text-gray-400 py-4 text-sm">
        &copy; 2025 AdCalc. Все права защищены.
      </footer>
    </main>
  );
}
