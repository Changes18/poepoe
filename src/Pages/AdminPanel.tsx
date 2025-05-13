import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify"; // Убрали импорт toast
import "react-toastify/dist/ReactToastify.css";
import ProductList from "../components/admin/ProductList";
import OrderList from "../components/admin/OrderList";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!auth || !user || !storedToken) {
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
      if (parsedUser.role !== "admin") {
        navigate("/");
        return;
      }
      setToken(storedToken);
    } catch (err) {
      console.error("Ошибка при парсинге user:", err);
      navigate("/login");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Панель администратора
        </h1>

        {/* Вкладки */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "products"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Товары
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "orders"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Заказы
            </button>
          </div>
        </div>

        {/* Содержимое вкладок */}
        {activeTab === "products" && (
          <ProductList token={token} setError={setError} />
        )}
        {activeTab === "orders" && (
          <OrderList token={token} setError={setError} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
