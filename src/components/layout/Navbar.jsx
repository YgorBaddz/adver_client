"use client";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex justify-between items-center p-4 md:p-8">
      <Link
        href={"/"}
        className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-400 text-transparent bg-clip-text"
      >
        Adver
      </Link>
      <nav className="space-x-4 hidden md:flex">
        <a href="#" className="text-gray-700 hover:text-indigo-600">
          Калькулятор
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600">
          Мои расчёты
        </a>
        {user ? (
          <div className="text-indigo-600 font-semibold">
            <Link href={"/dashboard"}>{user.username}</Link>

            <button
              className="ml-4 text-red-500 cursor-pointer"
              onClick={logout}
            >
              Выйти
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-indigo-600 font-semibold">
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
}
