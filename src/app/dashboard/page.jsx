"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [calculationsCount, setCalculationsCount] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function fetchCalculationsCount() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/calculations?filters[user][id][$eq]=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setCalculationsCount(data.meta.pagination.total);
      } catch {
        setCalculationsCount(0);
      }
    }

    fetchCalculationsCount();
  }, [isAuthenticated, router, token, user]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-4 text-indigo-700">
          Привет, {user.username}!
        </h1>
        <p className="text-gray-700 mb-6">
          У вас сохранено{" "}
          <span className="font-semibold">{calculationsCount ?? "..."}</span>{" "}
          расчётов.
        </p>
        <button
          onClick={() => router.push("/my-calculations")}
          className="mb-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition"
        >
          Мои расчёты
        </button>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
        >
          Выйти
        </button>
      </div>
    </main>
  );
}
