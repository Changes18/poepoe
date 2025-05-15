import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { _id: string; username: string };
  customer: {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    email: string;
    phone: string;
    paymentMethod: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

interface OrderListProps {
  token: string | null;
  setError: (error: string | null) => void;
}

export default function OrderList({ token, setError }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3001/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("auth");
          localStorage.removeItem("user");
          setError("Сессия истекла. Пожалуйста, войдите заново.");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ошибка при загрузке заказов");
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, setError]);

  const handleDeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        setError("Сессия истекла. Пожалуйста, войдите заново.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении заказа");
      }

      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Заказ удален!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      toast.error(err instanceof Error ? err.message : "Неизвестная ошибка", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    }
  };

  if (loading) {
    return <div className="text-gray-500">Загрузка заказов...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-gray-500">Заказы отсутствуют</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Список заказов</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">
              Заказ #{order._id.slice(-6)}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Клиент: {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {order.customer.email}
              </p>
              <p className="text-sm text-gray-600">
                Телефон: {order.customer.phone}
              </p>
              <p className="text-sm text-gray-600">
                Пользователь: {order.user?.username || "Неизвестно"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Адрес: {order.customer.address}, {order.customer.city},{" "}
                {order.customer.postalCode}
              </p>
              <p className="text-sm text-gray-600">
                Способ оплаты: {order.customer.paymentMethod}
              </p>
              <p className="text-sm text-gray-600">Статус: {order.status}</p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">Товары:</p>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-600"
              >
                <p>
                  {item.name} (x{item.quantity})
                </p>
                <p>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900">
            <p>Итого:</p>
            <p>{order.total.toLocaleString("ru-RU")} ₽</p>
          </div>
          <button
            onClick={() => handleDeleteOrder(order._id)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );
}
