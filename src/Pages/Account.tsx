import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  username: string;
  role: string;
  _id: string;
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editField, setEditField] = useState<"username" | "password" | null>(
    null
  );
  const [updateData, setUpdateData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const auth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");

    if (!auth || !userData || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUpdateData((prev) => ({ ...prev, username: parsedUser.username }));
    } catch (err) {
      console.error("Ошибка при парсинге user:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleUpdate = async (field: "username" | "password") => {
    setError(null);

    if (
      field === "password" &&
      updateData.password !== updateData.confirmPassword
    ) {
      setError("Пароли не совпадают");
      return;
    }

    if (field === "username" && !updateData.username) {
      setError("Логин не может быть пустым");
      return;
    }

    if (field === "password" && !updateData.password) {
      setError("Пароль не может быть пустым");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/users/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          field === "username"
            ? { username: updateData.username }
            : { password: updateData.password }
        ),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении данных");
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setUser(updatedUser.user);
      setUpdateData({
        username: updatedUser.user.username,
        password: "",
        confirmPassword: "",
      });
      setEditField(null);
      toast.success("Данные обновлены!", { position: "top-right" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const cancelEdit = () => {
    setEditField(null);
    setUpdateData((prev) => ({
      ...prev,
      username: user?.username || "",
      password: "",
      confirmPassword: "",
    }));
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center py-12 px-4 h-screen">
        <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Личный кабинет
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Информация о пользователе */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              {editField === "username" ? (
                <>
                  <input
                    type="text"
                    value={updateData.username}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, username: e.target.value })
                    }
                    className="flex-1 bg-gray-50 p-1 text-sm text-gray-700 border-none focus:bg-gray-100 focus:ring-0 transition-colors"
                    placeholder="Новый логин"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate("username")}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 flex-1">
                    <span className="font-medium">Логин:</span> {user.username}
                  </p>
                  <button
                    onClick={() => setEditField("username")}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              {editField === "password" ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="password"
                    value={updateData.password}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, password: e.target.value })
                    }
                    className="w-full bg-gray-50 p-1 text-sm text-gray-700 border-none focus:bg-gray-100 focus:ring-0 transition-colors"
                    placeholder="Новый пароль"
                    autoFocus
                  />
                  <input
                    type="password"
                    value={updateData.confirmPassword}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 p-1 text-sm text-gray-700 border-none focus:bg-gray-100 focus:ring-0 transition-colors"
                    placeholder="Подтвердите пароль"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate("password")}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 flex-1">
                    <span className="font-medium">Пароль:</span> ********
                  </p>
                  <button
                    onClick={() => setEditField("password")}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Роль:</span>{" "}
              {user.role === "admin" ? "Администратор" : "Пользователь"}
            </p>
          </div>

          {/* Кнопка выхода */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4"
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}
