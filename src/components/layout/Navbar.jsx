"use client";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur flex justify-between items-center p-4 md:p-8 shadow">
      <Link
        href={"/"}
        className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-400 text-transparent bg-clip-text"
      >
        Adver
      </Link>
      <nav className="flex flex-col gap-2 md:flex-row md:gap-4 items-center">
        <Link
          href="/calculator"
          className="text-gray-700 hover:text-indigo-600"
        >
          Калькулятор
        </Link>
        {user && (
          <Link
            href="/my-calculations"
            className="text-gray-700 hover:text-indigo-600"
          >
            Мои расчёты
          </Link>
        )}
        {user ? (
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Link href={"/dashboard"}>{user.username}</Link>
            <button
              className="ml-2 text-red-500 cursor-pointer"
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
