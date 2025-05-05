"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/authApi";
import useAuthStore from "../../store/authStore";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await loginUser(form);
    if (res.jwt) {
      login(res.jwt, res.user);
      router.push("/dashboard");
    } else {
      setError(res.error?.message || "Неверные данные");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-2">
          Вход в аккаунт
        </h2>
        <p className="text-center text-gray-500 mb-2">
          Добро пожаловать! Введите данные для входа.
        </p>
        <div>
          <input
            name="identifier"
            placeholder="Email или имя пользователя"
            onChange={handleChange}
            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            onChange={handleChange}
            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        )}
        <button className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold shadow-lg">
          Войти
        </button>
        <div className="text-center text-sm text-gray-500 mt-2">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
}
