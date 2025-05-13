import { useState } from "react";
import axios from "axios";

interface LoginProps {
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
}

export default function Login({ setToken, setError }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://poepoe.vercel.app/api/login", {
        username,
        password,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
      setError(null);
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Не удалось войти");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Вход</h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Войти
      </button>
    </div>
  );
}
