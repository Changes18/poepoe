import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password, role: "user" }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Не удалось подключиться к серверу");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-md w-80 text-center shadow-md"
      >
        <h1 className="mb-2 font-bold text-black">Регистрация</h1>

        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          placeholder="Логин"
          type="text"
          className="my-1 p-2 w-full rounded border focus:outline"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Пароль"
          type="password"
          className="my-1 p-2 w-full rounded border focus:outline"
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="items-center text-center bg-gray-700 p-2 rounded text-white my-3 py-2 w-full"
        >
          Зарегистрироваться
        </button>

        <div className="flex justify-center gap-1 text-sm">
          <h3>Есть аккаунт?</h3>
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-blue-700 hover:underline"
          >
            Войти
          </span>
        </div>
      </form>
    </div>
  );
}
