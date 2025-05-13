import { useState } from "react";
import axios from "axios";

interface RegisterProps {
  setError: (error: string | null) => void;
}

export default function Register({ setError }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://poepoe.vercel.app/api/register",
        {
          username,
          password,
          role,
        }
      );
      alert(response.data.message);
      setError(null);
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      setError("Не удалось зарегистрироваться");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Регистрация</h2>
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 mb-2 w-full"
      >
        <option value="user">Пользователь</option>
        <option value="admin">Админ</option>
      </select>
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Зарегистрироваться
      </button>
    </div>
  );
}
