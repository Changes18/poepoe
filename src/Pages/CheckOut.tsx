import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  paymentMethod: string;
}

export default function CheckOut() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Пожалуйста, войдите в аккаунт");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Ошибка при загрузке корзины");
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Пожалуйста, войдите в аккаунт");
      navigate("/login");
      return;
    }

    // Валидация данных
    const {
      firstName,
      lastName,
      address,
      postalCode,
      city,
      email,
      phone,
      paymentMethod,
    } = customerData;
    if (
      !firstName ||
      !lastName ||
      !address ||
      !postalCode ||
      !city ||
      !email ||
      !phone ||
      !paymentMethod
    ) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    try {
      // Формируем заказ
      const orderData = {
        customer: customerData,
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      // Отправляем заказ
      await axios.post("http://localhost:3001/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Очищаем корзину
      await axios.delete("http://localhost:3001/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Заказ успешно оформлен!");
      navigate("/bask");
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
      toast.error("Ошибка при оформлении заказа");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Оформление заказа
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Форма для данных клиента */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Данные для доставки
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Имя
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={customerData.firstName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Фамилия
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={customerData.lastName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Адрес
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Почтовый индекс
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={customerData.postalCode}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Город
                </label>
                <input
                  type="text"
                  name="city"
                  value={customerData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Способ оплаты
                </label>
                <select
                  name="paymentMethod"
                  value={customerData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  <option value="card">Кредитная карта</option>
                  <option value="cash">Наличные при получении</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Оформить заказ
              </button>
            </form>
          </div>

          {/* Товары в корзине */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Ваш заказ
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Корзина пуста</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-600 border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p>Количество: {item.quantity}</p>
                    </div>
                    <p>
                      {(item.product.price * item.quantity).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₽
                    </p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-800">
                  <p>Итого:</p>
                  <p>{calculateTotal().toLocaleString("ru-RU")} ₽</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
