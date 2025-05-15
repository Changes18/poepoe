import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при входе");
      }

      const data = await response.json();
      console.log("Login response:", data); // Для отладки
      localStorage.setItem("auth", "true");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-md w-80 text-center shadow-md"
      >
        <h1 className="mb-2 font-bold text-black">Вход</h1>

        <input
          value={login}
          required
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Логин"
          type="text"
          className="my-1 p-2 w-full rounded border focus:outline"
        />

        <input
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          type="password"
          className="my-1 p-2 w-full rounded border focus:outline"
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="items-center text-center bg-gray-700 p-2 rounded text-white my-3 py-2 w-full"
        >
          Войти
        </button>

        <div className="flex justify-center gap-1 text-sm">
          <h3>Нет аккаунта?</h3>
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-700 hover:underline"
          >
            Зарегистрируйся
          </span>
        </div>
      </form>
    </div>
  );
}
